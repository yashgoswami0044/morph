import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { AlertTriangle, Clock, User, ChevronRight, Phone, CheckCircle, XCircle, ArrowRight, Bell, Mail, Calendar, Shield } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import { escalationMatrix, teamMembers } from '../data/mockData.js';
import { useNavigate } from 'react-router-dom';

const Escalations = () => {
  const { leads, assignLead, transitionStatus, getNextFollowUp, getNextMeeting, getNextMeetingObj } = useLeads();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const now = Date.now();

  // ── ESCALATION TYPE 1: 48h No Contact → Alert to Team Lead / Hierarchy ──
  const noContactLeads = leads.filter(l => {
    if (l.status === 'Untouched') {
      const created = l.statusHistory?.[0]?.date;
      return created && (now - new Date(created).getTime()) > 48 * 3600000;
    }
    if (l.status === 'Validated' && l.assignedRole === 'Sales Manager') {
      const lastHist = l.statusHistory?.[l.statusHistory.length - 1];
      return lastHist && (now - new Date(lastHist.date).getTime()) > 72 * 3600000;
    }
    return false;
  }).map(l => {
    const created = l.statusHistory?.[0]?.date;
    const hoursOverdue = Math.floor((now - new Date(l.lastContact || created).getTime()) / 3600000);
    const matchedRule = escalationMatrix.find(r => {
      if (l.status === 'Untouched') return r.id === 1;
      if (l.status === 'Validated') return r.id === 3;
      return false;
    });
    return { ...l, hoursOverdue, rule: matchedRule, escalationType: '48h_no_contact' };
  });

  // ── ESCALATION TYPE 2: Missed Scheduled Meeting → Alert to RM / Hierarchy ──
  const missedMeetings = leads.filter(l => {
    if (l.status !== 'Meeting Scheduled') return false;
    const meetingDate = getNextMeeting(l);
    if (!meetingDate) return false;
    return new Date(meetingDate).getTime() < now;
  }).map(l => {
    const meetingObj = getNextMeetingObj(l);
    const meetingDate = new Date(meetingObj.datetime);
    const hoursMissed = Math.floor((now - meetingDate.getTime()) / 3600000);
    return { ...l, hoursOverdue: hoursMissed, escalationType: 'missed_meeting', meetingDate, meetingObj };
  });

  // ── ESCALATION TYPE 3: Overdue Follow-ups → Daily summary to Sales Head ──
  const overdueFollowups = leads.filter(l => {
    const fu = getNextFollowUp(l);
    return fu && new Date(fu) < new Date() && !['Converted', 'Not Qualified'].includes(l.status);
  }).map(l => {
    const fu = new Date(getNextFollowUp(l));
    const daysOverdue = Math.floor((now - fu.getTime()) / 86400000);
    return { ...l, daysOverdue, followUpDate: fu, escalationType: 'overdue_followup' };
  });

  const allEscalations = [...noContactLeads, ...missedMeetings];
  const notQualifiedLeads = leads.filter(l => l.status === 'Not Qualified');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Escalation Center</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>48h no-contact alerts, missed meetings, overdue follow-ups & lead recycling.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <EscKpi label="No Contact (48h+)" value={noContactLeads.length} color="#F87171" icon={AlertTriangle} />
        <EscKpi label="Missed Meetings" value={missedMeetings.length} color="#FBBF24" icon={Calendar} />
        <EscKpi label="Overdue Follow-ups" value={overdueFollowups.length} color="#EC4899" icon={Clock} />
        <EscKpi label="Not Qualified" value={notQualifiedLeads.length} color="#60A5FA" icon={XCircle} />
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { key: 'active', label: `No Contact 48h+ (${noContactLeads.length})` },
          { key: 'missed', label: `Missed Meetings (${missedMeetings.length})` },
          { key: 'overdue', label: `Overdue Follow-ups (${overdueFollowups.length})` },
          { key: 'notqualified', label: `Not Qualified (${notQualifiedLeads.length})` },
          { key: 'matrix', label: 'Escalation Matrix' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500, background: activeTab === t.key ? 'var(--primary)' : 'transparent', color: activeTab === t.key ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: 48h No Contact → Alert Team Lead / Hierarchy ── */}
      {activeTab === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <p style={{ fontSize: 12, color: '#F87171' }}><Bell size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              <strong>48+ Hours No Contact:</strong> Alert to Team Lead / Hierarchy. Escalation flows to Pre-sales Head → Sales Head depending on role.</p>
          </Card>
          {noContactLeads.length === 0 && <EmptyState message="No active 48h+ escalations" />}
          {noContactLeads.map(lead => (
            <EscalationCard key={lead.id} lead={lead} type="no_contact" navigate={navigate} assignLead={assignLead} />
          ))}
        </div>
      )}

      {/* ── Tab 2: Missed Scheduled Meeting → Alert RM / Hierarchy ── */}
      {activeTab === 'missed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 12, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p style={{ fontSize: 12, color: '#FBBF24' }}><Calendar size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              <strong>Missed Scheduled Meeting:</strong> Alert to Regional Manager / Hierarchy. Meeting was scheduled but not marked as done.</p>
          </Card>
          {missedMeetings.length === 0 && <EmptyState message="No missed meetings" />}
          {missedMeetings.map(lead => (
            <Card key={lead.id} style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(251,191,36,0.3)' }}>
              <div style={{ padding: '16px 20px', background: 'rgba(251,191,36,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Calendar size={20} style={{ color: '#FBBF24' }} />
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{lead.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lead.project} · {lead.meetingObj?.visitType || 'Site Visit'}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#FBBF24' }}>{lead.hoursOverdue}h</p>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>MISSED</p>
                </div>
              </div>
              <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Scheduled</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#FBBF24' }}>{lead.meetingDate.toLocaleString()}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Location</span>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lead.meetingObj?.location || '—'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Assigned To</span>
                    <p style={{ fontSize: 12, color: 'white' }}>{lead.assignedToName || '—'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${lead.id}`)}>
                    <Phone size={14} style={{ marginRight: 4 }} /> Follow Up
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => {
                    const rm = teamMembers.find(t => t.role === 'Regional Manager');
                    if (rm) assignLead(lead.id, rm.id, 'System (Missed Meeting)');
                  }}>
                    <ArrowRight size={14} style={{ marginRight: 4 }} /> Escalate to RM
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Tab 3: Overdue Follow-ups → Daily Summary to Sales Head ── */}
      {activeTab === 'overdue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 12, background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)' }}>
            <p style={{ fontSize: 12, color: '#EC4899' }}><Mail size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              <strong>Overdue Follow-ups:</strong> Daily summary sent to Sales Head. Below are all leads with past-due follow-up dates.</p>
          </Card>
          <Card style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Daily summary email (auto-sent at 9:00 AM to Sales Head)</span>
            <Badge variant="success">Active</Badge>
          </Card>
          {overdueFollowups.length === 0 && <EmptyState message="No overdue follow-ups 🎉" />}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)' }}>
                  {['Lead', 'Status', 'Follow-up Date', 'Days Overdue', 'Assigned To', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overdueFollowups.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'white' }}>{l.name}</td>
                    <td style={{ padding: '10px 14px' }}><Badge variant="warm" style={{ fontSize: 9 }}>{l.status}</Badge></td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#EC4899' }}>{l.followUpDate.toLocaleDateString()}</td>
                    <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700, color: l.daysOverdue > 3 ? '#F87171' : '#FBBF24' }}>{l.daysOverdue}d</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{l.assignedToName || '—'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${l.id}`)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Not Qualified Recycling */}
      {activeTab === 'notqualified' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 16, background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.2)' }}>
            <p style={{ fontSize: 13, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} /> Not-qualified leads (including cancelled projects) are routed to Regional Manager. They can be recycled or permanently closed.
            </p>
          </Card>
          {notQualifiedLeads.length === 0 && <EmptyState message="No not-qualified leads pending review." />}
          {notQualifiedLeads.map(lead => (
            <Card key={lead.id} style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171', fontWeight: 700, fontSize: 16 }}>
                  {lead.name[0]}
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{lead.name}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{lead.project} · {lead.config}</p>
                  <p style={{ fontSize: 11, color: '#F87171', marginTop: 4 }}>Reason: {lead.notQualifiedReason || 'Not specified'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm" onClick={() => {
                  const presales = teamMembers.find(t => t.role === 'Pre-sales Executive');
                  if (presales) assignLead(lead.id, presales.id, 'Regional Manager');
                }}>
                  <Phone size={14} style={{ marginRight: 4 }} /> Assign to Pre-sales
                </Button>
                <Button size="sm" onClick={() => transitionStatus(lead.id, 'Validated', 'Regional Manager')}>
                  <CheckCircle size={14} style={{ marginRight: 4 }} /> Recycle to Validated
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Escalation Matrix */}
      {activeTab === 'matrix' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Escalation Rules Matrix</h3>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>SLA-based multi-level escalation rules per specification.</p>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                {['Scenario', 'Level 1', 'Level 2', 'Level 3', 'SLA', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {escalationMatrix.map(rule => (
                <tr key={rule.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'white', fontWeight: 500, maxWidth: 250 }}>{rule.scenario}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{rule.level1}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#FBBF24' }}>{rule.level2}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#F87171' }}>{rule.level3}</td>
                  <td style={{ padding: '14px 16px' }}><Badge variant="hot">{rule.slaHours}h</Badge></td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--primary-light)' }}>{rule.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

const EmptyState = ({ message }) => (
  <Card style={{ padding: 50, textAlign: 'center', background: 'var(--bg-main)', border: '1px dashed var(--border)' }}>
    <CheckCircle size={36} style={{ color: '#34D399', margin: '0 auto 12px' }} />
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{message}</p>
  </Card>
);

const EscKpi = ({ label, value, color, icon: Icon }) => (
  <Card style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</p>
      <h3 style={{ fontSize: 26, fontWeight: 700, color: 'white', marginTop: 4 }}>{value}</h3>
    </div>
    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${color}12`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} style={{ color }} />
    </div>
  </Card>
);

const EscalationCard = ({ lead, navigate, assignLead }) => (
  <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(248,113,113,0.3)' }}>
    <div style={{ padding: '16px 20px', background: 'rgba(248,113,113,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AlertTriangle size={20} style={{ color: '#F87171' }} />
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{lead.name}</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lead.project} · {lead.config} · {lead.status}</p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: '#F87171' }}>{lead.hoursOverdue}h</p>
        <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>OVERDUE</p>
      </div>
    </div>
    <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Assigned To</span>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{lead.assignedToName || 'Unassigned'} ({lead.assignedRole || '—'})</p>
        </div>
        <div>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>SLA Rule</span>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#FBBF24' }}>{lead.rule?.scenario || 'N/A'}</p>
        </div>
        <div>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Alert To</span>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#F87171' }}>Team Lead → Hierarchy</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${lead.id}`)}>
          <Phone size={14} style={{ marginRight: 4 }} /> Call Now
        </Button>
        <Button variant="danger" size="sm" onClick={() => {
          const rm = teamMembers.find(t => t.role === 'Regional Manager');
          if (rm) assignLead(lead.id, rm.id, 'System');
        }}>
          <ArrowRight size={14} style={{ marginRight: 4 }} /> Reassign
        </Button>
      </div>
    </div>
  </Card>
);

export default Escalations;
