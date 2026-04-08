import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockLeads, statusFlow, teamMembers } from '../data/mockData.js';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(mockLeads);
  const [notifications, setNotifications] = useState([]);
  // ── Core CRUD ──
  const updateLead = useCallback((id, updates) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const addLead = useCallback((newLead) => {
    const lead = {
      ...newLead,
      id: `L-${Date.now()}`,
      status: 'Untouched',
      previousStatus: null,

      statusHistory: [{ status: 'Untouched', date: new Date().toISOString(), by: 'System' }],
      callHistory: [],    };
    setLeads(prev => [...prev, lead]);    addNotification('lead_created', `New lead "${lead.name}" added`, lead.id);
    return lead;
  }, []);

  const deleteLead = useCallback((id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  }, []);

  // ── STATUS TRANSITION (with validation) ──
  const transitionStatus = useCallback((id, newStatus, byUser, extra = {}) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== id) return lead;
      const allowedNext = statusFlow[lead.status] || [];
      if (!allowedNext.includes(newStatus)) {
        console.warn(`Invalid transition: ${lead.status} → ${newStatus}`);
        return lead;
      }
      const historyEntry = {
        status: newStatus,
        date: new Date().toISOString(),
        by: byUser || 'System',
        ...(extra.reason ? { reason: extra.reason } : {}),
      };
      const updated = {
        ...lead,
        previousStatus: lead.status,
        status: newStatus,
        statusHistory: [...(lead.statusHistory || []), historyEntry],
        ...extra,
      };

      // Auto-assignment logic
      if (newStatus === 'Validated') {
        // Assign to Sales Manager based on region
        const sm = teamMembers.find(t => t.role === 'Sales Manager' && (lead.region?.includes('Bangalore') ? t.region === 'Bangalore' : t.region === lead.region));
        if (sm) {
          updated.assignedTo = sm.id;
          updated.assignedToName = sm.name;
          updated.assignedRole = 'Sales Manager';
        }
      }
      if (newStatus === 'Not Qualified') {
        // Route to Regional Manager
        const rm = teamMembers.find(t => t.role === 'Regional Manager' && (lead.region?.includes('Bangalore') ? t.region === 'Bangalore' : t.region === lead.region));
        if (rm) {
          updated.assignedTo = rm.id;
          updated.assignedToName = rm.name;
          updated.assignedRole = 'Regional Manager';
          updated.notQualifiedReason = extra.reason || 'Not specified';
        }
      }
      return updated;
    }));

    pushMoengageEvent(id, `status_${newStatus.toLowerCase().replace(/\s/g, '_')}`, { status: newStatus, ...extra });
    addNotification('status_change', `Lead status changed to "${newStatus}"`, id);
  }, []);

  // ── ASSIGNMENT ──
  const assignLead = useCallback((id, toUserId, byUser) => {
    const user = teamMembers.find(t => t.id === toUserId);
    if (!user) return;
    setLeads(prev => prev.map(lead => {
      if (lead.id !== id) return lead;
      return {
        ...lead,
        assignedTo: user.id,
        assignedToName: user.name,
        assignedRole: user.role,
      };
    }));
    addNotification('assignment', `Lead reassigned to ${user.name} (${user.role})`, id);  }, []);

  // ── AUTO-ASSIGN INTERESTED LEADS TO SALES ──
  const autoAssignToSales = useCallback((id) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== id) return lead;
      const sm = teamMembers.find(t => t.role === 'Sales Manager' && (lead.region?.includes('Bangalore') ? t.region === 'Bangalore' : t.region === lead.region));
      if (!sm) return lead;
      return {
        ...lead,
        assignedTo: sm.id,
        assignedToName: sm.name,
        assignedRole: 'Sales Manager',
      };
    }));
  }, []);

  // ── HELPER: Get Next Dates ──
  const getNextFollowUpObj = useCallback((lead) => {
    if (!lead || !lead.followUps || lead.followUps.length === 0) return null;
    const future = lead.followUps.filter(f => !f.completed && new Date(f.date) >= new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(a.date) - new Date(b.date));
    return future.length > 0 ? future[0] : null;
  }, []);

  const getNextMeetingObj = useCallback((lead) => {
    if (!lead || !lead.meetings || lead.meetings.length === 0) return null;
    const future = lead.meetings.filter(m => new Date(m.datetime) >= new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
    return future.length > 0 ? future[0] : null;
  }, []);

  const getNextFollowUp = useCallback((lead) => getNextFollowUpObj(lead)?.date || null, [getNextFollowUpObj]);
  const getNextMeeting = useCallback((lead) => getNextMeetingObj(lead)?.datetime || null, [getNextMeetingObj]);

  // ── SCHEDULE MEETING ──
  const scheduleMeeting = useCallback((id, meetingData) => {
    setLeads(prev => prev.map(lead =>
      lead.id === id ? { 
        ...lead, 
        meetings: [...(lead.meetings || []), meetingData],
        followUps: [...(lead.followUps || []), { type: 'Sales', date: meetingData.datetime, completed: false }]
      } : lead
    ));
  }, []);

  // ── ADD CALL LOG ──
  const addCallLog = useCallback((id, callEntry) => {
    setLeads(prev => prev.map(lead =>
      lead.id === id ? {
        ...lead,
        callHistory: [callEntry, ...(lead.callHistory || [])],
        lastContact: callEntry.date,
      } : lead
    ));
  }, []);

  // ── NOTIFICATIONS ──
  const addNotification = useCallback((type, message, leadId) => {
    setNotifications(prev => [{
      id: `N-${Date.now()}`,
      type,
      message,
      leadId,
      timestamp: new Date().toISOString(),
      read: false,
    }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  // ── FOLLOW-UP & REMINDERS ──
  const setFollowUp = useCallback((id, date, forSales = false) => {
    setLeads(prev => prev.map(lead =>
      lead.id === id ? {
        ...lead,
        followUps: [...(lead.followUps || []), { type: forSales ? 'Sales' : 'Pre-sales', date, completed: false }]
      } : lead
    ));
  }, []);

  // ── HELPER: Get leads needing first call within 48h ──
  const getPendingFirstCall = useCallback(() => {
    return leads.filter(l => {
      if (l.status !== 'Untouched') return false;
      const created = l.statusHistory?.[0]?.date;
      if (!created) return false;
      const hoursSinceCreate = (Date.now() - new Date(created).getTime()) / 3600000;
      return hoursSinceCreate <= 48;
    });
  }, [leads]);

  // ── HELPER: Get overdue first call (>48h untouched) ──
  const getOverdueFirstCall = useCallback(() => {
    return leads.filter(l => {
      if (l.status !== 'Untouched') return false;
      const created = l.statusHistory?.[0]?.date;
      if (!created) return false;
      const hoursSinceCreate = (Date.now() - new Date(created).getTime()) / 3600000;
      return hoursSinceCreate > 48;
    });
  }, [leads]);

  // ── HELPER: Sorted leads with inbound/website on top for Untouched/Attempted ──
  const getSortedLeads = useCallback((statusFilter) => {
    let filtered = [...leads];
    if (statusFilter && statusFilter !== 'All') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      // For Untouched + Attempted: inbound & website leads on top
      if (['Untouched', 'Attempted'].includes(a.status) || ['Untouched', 'Attempted'].includes(b.status)) {
        const inboundSources = ['Inbound Call', 'Website Inquiry'];
        const aIsInbound = inboundSources.includes(a.source) ? 1 : 0;
        const bIsInbound = inboundSources.includes(b.source) ? 1 : 0;
        if (aIsInbound !== bIsInbound) return bIsInbound - aIsInbound;
      }

      // For Validated+: sort by follow-up date
      if (['Validated', 'Meeting Scheduled', 'Meeting Done', 'Proposal Sent'].includes(a.status)) {
        const aDate = getNextFollowUp(a) || getNextMeeting(a);
        const bDate = getNextFollowUp(b) || getNextMeeting(b);
        if (aDate && bDate) return new Date(aDate) - new Date(bDate);
        if (aDate) return -1;
        if (bDate) return 1;
      }

      // Default: value descending
      return (b.value || 0) - (a.value || 0);
    });
  }, [leads]);

  return (
    <LeadContext.Provider value={{
      leads, updateLead, addLead, deleteLead,
      transitionStatus, assignLead, autoAssignToSales,
      scheduleMeeting, addCallLog, setFollowUp,
      notifications, addNotification, markNotificationRead,
      
      getPendingFirstCall, getOverdueFirstCall, getSortedLeads,
      getNextFollowUp, getNextMeeting, getNextFollowUpObj, getNextMeetingObj,
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);
