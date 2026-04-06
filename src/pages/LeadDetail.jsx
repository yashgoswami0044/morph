import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import ProjectLifecycle from '../components/ProjectLifecycle.jsx';
import {
  Phone, Mail, MessageSquare, ChevronLeft, MapPin, Home, IndianRupee,
  Layers, Calendar, Clock, Save, CheckCircle, XCircle, AlertCircle,
  Play, History, PhoneOff, User, Send, Globe, ChevronRight, Fingerprint, Search,
  Sparkles, ArrowRight, Users, BookOpen, FileText, UserPlus, Target, ExternalLink,
  Workflow, ClipboardList
} from 'lucide-react';
import { scopeOptions, styleOptions, readinessOptions, decisionMakerOptions, competitorOptions, expectedServices, customerTimelines, teamMembers, statusFlow, statusColors, languages, interiorPovOptions, catalogues } from '../data/mockData.js';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leads, updateLead, transitionStatus, assignLead, addCallLog, setFollowUp, scheduleMeeting, pushMoengageEvent } = useLeads();
  const [lead, setLead] = useState(null);

  const [activeCall, setActiveCall] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [showCallOutcome, setShowCallOutcome] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [showPostVisit, setShowPostVisit] = useState(false);
  const [showLostReason, setShowLostReason] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [callNotes, setCallNotes] = useState('');

  // Meeting form
  const [meetingForm, setMeetingForm] = useState({ datetime: '', location: '', attendees: '', locationUrl: '', visitType: 'Experience Centre Visit' });

  // Post-visit summary
  const [postVisitForm, setPostVisitForm] = useState({ summary: '', trigger: '', barrier: '' });
  const [lostReason, setLostReason] = useState('');

  const [form, setForm] = useState({
    scope: [], budget: 15, readiness: 'Within 3 months',
    style: [], competition: 'None', decisionMaker: 'Both spouses',
    notes: '', specialRequirements: '', services: [], customerTimeline: 'Next 3 Months',
    interiorPov: '', coApplicantName: '', coApplicantPhone: '', coApplicantEmail: '', coApplicantRelation: '',
    followUpDate: '', followUpSalesDate: '',
  });

  useEffect(() => {
    const found = leads.find(l => l.id === id);
    if (found) {
      setLead(found);
      setForm({
        scope: found.scope || [], budget: found.budget || found.value || 15,
        readiness: found.readiness || 'Within 3 months', style: found.stylePreference || [],
        competition: found.competition || 'None', decisionMaker: found.decisionMaker || 'Both spouses',
        notes: found.notes || '', specialRequirements: '',
        services: found.expectedServices || [], customerTimeline: found.customerTimeline || 'Next 3 Months',
        interiorPov: '', coApplicantName: found.coApplicant?.name || '', coApplicantPhone: found.coApplicant?.phone || '',
        coApplicantEmail: found.coApplicant?.email || '', coApplicantRelation: found.coApplicant?.relation || '',
        followUpDate: found.followUpDate || '', followUpSalesDate: found.followUpSalesDate || '',
      });
    }
  }, [id, leads]);

  useEffect(() => {
    let interval;
    if (activeCall) interval = setInterval(() => setCallTime(p => p + 1), 1000);
    else setCallTime(0);
    return () => clearInterval(interval);
  }, [activeCall]);

  // Auto-save
  useEffect(() => {
    if (!lead) return;
    const timer = setInterval(() => {
      updateLead(lead.id, { notes: form.notes, scope: form.scope, budget: form.budget, readiness: form.readiness, expectedServices: form.services, customerTimeline: form.customerTimeline,
        coApplicant: form.coApplicantName ? { name: form.coApplicantName, phone: form.coApplicantPhone, email: form.coApplicantEmail, relation: form.coApplicantRelation } : lead.coApplicant,
      });
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    }, 10000);
    return () => clearInterval(timer);
  }, [form, lead]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const calculateScore = () => {
    if (!lead) return 0;
    let score = 0;
    const possMonths = lead.possession ? (new Date(lead.possession) - Date.now()) / (1000 * 60 * 60 * 24 * 30) : 10;
    if (possMonths < 3) score += 35; else if (possMonths < 6) score += 28; else if (possMonths < 12) score += 17.5; else score += 7;
    if (form.budget >= 15) score += 25; else if (form.budget >= 10) score += 17.5; else if (form.budget >= 5) score += 10; else score += 2.5;
    if (form.scope.includes('Full Home Interiors')) score += 20; else if (form.scope.length >= 2) score += 14; else if (form.scope.length >= 1) score += 8; else score += 4;
    const readinessMap = { 'Want to start immediately': 20, 'Within 1 month': 16, 'Within 3 months': 10, 'Within 6 months': 8, 'After possession': 4, 'Not decided': 4 };
    score += readinessMap[form.readiness] || 4;
    return Math.round(score);
  };

  const currentScore = lead ? calculateScore() : 0;
  const scoreColor = currentScore >= 75 ? '#F87171' : currentScore >= 50 ? '#FBBF24' : '#60A5FA';

  const handleEndCall = () => {
    setActiveCall(false);
    setShowCallOutcome(true);
  };

  const handleCallOutcome = (outcome) => {
    const mockAiSummary = outcome === 'Connected' ? `Call connected for ${formatTime(callTime)}. ${callNotes || 'Details captured during conversation.'}` : null;
    addCallLog(lead.id, {
      date: new Date().toISOString(), duration: formatTime(callTime), outcome,
      notes: callNotes || `Call ${outcome.toLowerCase()}`, aiSummary: mockAiSummary,
    });
    setShowCallOutcome(false);
    setCallNotes('');
    if (outcome === 'No Answer' || outcome === 'Busy') setShowSchedule(true);
    if (outcome === 'Connected' && lead.status === 'Untouched') {
      transitionStatus(lead.id, 'Attempted', user?.name || 'Executive');
    }
  };

  const handleStatusTransition = (newStatus, reason) => {
    // Block any status change after Converted
    if (lead.status === 'Converted') return;
    transitionStatus(lead.id, newStatus, user?.name || 'User', reason ? { reason } : {});
    // Trigger MoEngage communication on status change
    pushMoengageEvent(lead.id, `moengage_comm_${newStatus.toLowerCase().replace(/\s/g, '_')}`, { status: newStatus, channel: 'MoEngage' });
    // Show post-visit summary form after Meeting Done
    if (newStatus === 'Meeting Done') setShowPostVisit(true);
  };

  // Save post-visit summary
  const handleSavePostVisit = () => {
    updateLead(lead.id, { postVisitSummary: { ...postVisitForm, savedAt: new Date().toISOString(), savedBy: user?.name } });
    setShowPostVisit(false);
  };

  // Handle Lost (mandatory reason)
  const handleLost = () => {
    if (!lostReason.trim()) return;
    transitionStatus(lead.id, 'Not Qualified', user?.name || 'User', { reason: lostReason });
    setShowLostReason(false);
    setLostReason('');
  };

  const handleScheduleMeeting = () => {
    scheduleMeeting(lead.id, {
      datetime: meetingForm.datetime, location: meetingForm.location,
      attendees: meetingForm.attendees.split(',').map(s => s.trim()).filter(Boolean),
      locationUrl: meetingForm.locationUrl,
      visitType: meetingForm.visitType,
    });
    transitionStatus(lead.id, 'Meeting Scheduled', user?.name || 'User');
    setShowMeeting(false);
  };

  const visitTypes = ['Model Home Visit', 'Experience Centre Visit', 'Remote Consultation', 'Virtual Tour'];

  const allowedTransitions = lead ? (statusFlow[lead.status] || []) : [];
  const isPresales = ['Pre-sales Executive', 'Regional Manager'].includes(user?.role);
  const isSales = ['Sales Manager', 'Sales Executive'].includes(user?.role);
  // Presales can call even if lead is assigned to sales
  const canCall = isPresales || isSales || user?.role === 'CRM Head';
  // Presales loses visibility after meeting done
  const meetingDone = lead?.status === 'Meeting Done' || lead?.status === 'Proposal Sent' || lead?.status === 'Converted';
  const presalesLostVisibility = isPresales && meetingDone;

  if (!lead) return <div style={{ padding: 40, textAlign: 'center', color: 'white' }}>Loading Profile...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/leads')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{lead.name}</h1>
              <Badge variant="outline" style={{ ...(statusColors[lead.status] || {}), fontSize: 11 }}>{lead.status}</Badge>
              {lead.assignedToName && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>→ {lead.assignedToName} ({lead.assignedRole})</span>}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Fingerprint size={12} /> {lead.id} · Source: {lead.source} · {lead.region}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {savedIndicator && <span style={{ fontSize: 12, color: '#34D399', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> Auto-saved</span>}
          <Button variant="outline" size="sm" onClick={() => setShowAssign(true)}><Users size={14} style={{ marginRight: 4 }}/> Assign</Button>
          <Button variant="outline" size="sm" onClick={() => setShowCatalogue(true)}><BookOpen size={14} style={{ marginRight: 4 }}/> Send Catalogue</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/leads')}><Save size={14} style={{ marginRight: 4 }}/> Save & Close</Button>
        </div>
      </div>

      {/* Presales visibility warning */}
      {presalesLostVisibility && (
        <div style={{ padding: 12, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} style={{ color: '#F87171' }} />
          <span style={{ fontSize: 13, color: '#F87171' }}>Meeting is completed. Lead activity visibility is limited for pre-sales. You can still make calls.</span>
        </div>
      )}

      {/* ── 3 COLUMNS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 20, flex: 1, minHeight: 0 }}>

        {/* ── LEFT PANEL ── */}
        <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingRight: 4, paddingBottom: 24 }}>
          <Card style={{ padding: 20, textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, rgba(168,137,68,0.15) 0%, rgba(20,24,32,0) 100%)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px', background: 'var(--bg-card)', border: `2px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', boxShadow: `0 8px 24px ${scoreColor}30` }}>{lead.name[0]}</div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>{lead.name}</h2>
              <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>{lead.source}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20 }}>
              <ActionButton icon={Phone} label={lead.phone} primary />
              <ActionButton icon={Mail} label={lead.email || 'No email'} />
              {lead.whatsapp && <ActionButton icon={MessageSquare} label={lead.whatsapp} variant="whatsapp" />}
              {lead.language && <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12, color: 'var(--text-dim)' }}><Globe size={14} /> {lead.language}</div>}
            </div>
          </Card>

          {/* Co-Applicant */}
          <Card style={{ padding: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserPlus size={12} /> Co-Applicant
            </h3>
            {lead.coApplicant ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PRow label="Name" value={lead.coApplicant.name} />
                <PRow label="Phone" value={lead.coApplicant.phone} />
                <PRow label="Email" value={lead.coApplicant.email} />
                <PRow label="Relation" value={lead.coApplicant.relation} />
                {canCall && <ActionButton icon={Phone} label={`Call ${lead.coApplicant.name}`} primary />}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input placeholder="Name" value={form.coApplicantName} onChange={e => setForm(f => ({ ...f, coApplicantName: e.target.value }))} style={inputStyle} />
                <input placeholder="Phone" value={form.coApplicantPhone} onChange={e => setForm(f => ({ ...f, coApplicantPhone: e.target.value }))} style={inputStyle} />
                <input placeholder="Email" value={form.coApplicantEmail} onChange={e => setForm(f => ({ ...f, coApplicantEmail: e.target.value }))} style={inputStyle} />
                <select value={form.coApplicantRelation} onChange={e => setForm(f => ({ ...f, coApplicantRelation: e.target.value }))} style={inputStyle}>
                  <option value="">Relation</option>
                  {['Spouse', 'Parent', 'Sibling', 'Friend', 'Business Partner'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
          </Card>

          <Card style={{ padding: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Property Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <PRow label="Project" value={lead.project} />
              <PRow label="Builder" value={lead.builder} />
              <PRow label="Config" value={lead.config} />
              <PRow label="Area/Floor" value={`${lead.area} sqft · F${lead.floor || '--'}`} />
              <PRow label="Value" value={`₹${lead.value}L`} highlight />
              <div style={{ height: 1, background: 'var(--border)' }} />
              <PRow label="Possession" value={lead.possession ? new Date(lead.possession).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'TBD'} />
              <PRow label="Status" value={lead.possessionStatus || 'Not yet'} />
            </div>
          </Card>

          {/* Follow-up Dates */}
          <Card style={{ padding: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Follow-up Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-dim)' }}>Pre-sales Follow-up</label>
                <input type="datetime-local" value={form.followUpDate?.slice(0, 16) || ''} onChange={e => { setForm(f => ({ ...f, followUpDate: e.target.value })); setFollowUp(lead.id, e.target.value, false); }} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-dim)' }}>Sales Follow-up</label>
                <input type="datetime-local" value={form.followUpSalesDate?.slice(0, 16) || ''} onChange={e => { setForm(f => ({ ...f, followUpSalesDate: e.target.value })); setFollowUp(lead.id, e.target.value, true); }} style={inputStyle} />
              </div>
            </div>
          </Card>
        </div>

        {/* ── CENTER PANEL ── */}
        <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: 4, paddingBottom: 24, gap: 14 }}>

          {/* ── TAB HEADER ── */}
          <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <button onClick={() => setActiveTab('details')} style={{
              flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              border: 'none', transition: 'all 0.25s',
              background: activeTab === 'details' ? 'linear-gradient(135deg, var(--primary-bg), rgba(168,137,68,0.25))' : 'transparent',
              color: activeTab === 'details' ? 'var(--primary-light)' : 'var(--text-dim)',
              boxShadow: activeTab === 'details' ? '0 0 12px rgba(168,137,68,0.15)' : 'none',
            }}>
              <ClipboardList size={15} /> Lead Details
            </button>
            <button onClick={() => setActiveTab('lifecycle')} style={{
              flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              border: 'none', transition: 'all 0.25s',
              background: activeTab === 'lifecycle' ? 'linear-gradient(135deg, var(--primary-bg), rgba(168,137,68,0.25))' : 'transparent',
              color: activeTab === 'lifecycle' ? 'var(--primary-light)' : 'var(--text-dim)',
              boxShadow: activeTab === 'lifecycle' ? '0 0 12px rgba(168,137,68,0.15)' : 'none',
            }}>
              <Workflow size={15} /> Project Lifecycle
            </button>
          </div>

          {/* ── TAB: LEAD DETAILS ── */}
          {activeTab === 'details' && (<>

          {/* Call Banner */}
          {canCall && (
            <div style={{ background: activeCall ? 'linear-gradient(90deg, rgba(52,211,153,0.1) 0%, rgba(20,24,32,1) 100%)' : 'var(--bg-card)', border: `1px solid ${activeCall ? '#34D39960' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={activeCall ? handleEndCall : () => setActiveCall(true)} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', background: activeCall ? '#EF4444' : 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', animation: activeCall ? 'pulse 2s infinite' : 'none' }}>
                  {activeCall ? <PhoneOff size={22} /> : <Phone size={22} />}
                </button>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                    {activeCall ? <span style={{ color: '#34D399' }}>Live Call · {formatTime(callTime)}</span> : 'Click to Call'}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activeCall ? 'Recording...' : `Last: ${lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : 'Never'}`}</p>
                </div>
              </div>
              {activeCall && (
                <input value={callNotes} onChange={e => setCallNotes(e.target.value)} placeholder="Call notes..." style={{ ...inputStyle, flex: 1, maxWidth: 300, marginLeft: 12 }} />
              )}
              {!activeCall && !showCallOutcome && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="ghost" size="sm" onClick={() => handleCallOutcome('No Answer')}>No Answer</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCallOutcome('Busy')}>Busy</Button>
                </div>
              )}
              {showCallOutcome && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Outcome:</span>
                  {['Connected', 'No Answer', 'Busy', 'Wrong Number'].map(o => (
                    <Button key={o} variant="secondary" size="sm" onClick={() => handleCallOutcome(o)}>{o}</Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showSchedule && (
            <div style={{ padding: 14, background: 'rgba(251,191,36,0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={16} style={{ color: '#FBBF24' }} /><span style={{ fontSize: 13, color: 'white' }}>Schedule Callback</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={inputStyle} />
                <Button variant="primary" size="sm" onClick={() => { setFollowUp(lead.id, scheduleDate, false); setShowSchedule(false); }}>Confirm</Button>
              </div>
            </div>
          )}

          {/* AI Summary */}
          {lead.aiSummary && (
            <Card style={{ padding: 16, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Sparkles size={16} style={{ color: '#8B5CF6' }} />
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6' }}>AI Call Summary</h4>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{lead.aiSummary}</p>
            </Card>
          )}

          {/* Meeting Data (if exists) */}
          {lead.meetingData && (
            <Card style={{ padding: 16, background: 'rgba(168,137,68,0.06)', border: '1px solid rgba(168,137,68,0.2)' }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> Meeting Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <PRow label="Date/Time" value={new Date(lead.meetingData.datetime).toLocaleString()} />
                <PRow label="Location" value={lead.meetingData.location} />
                <PRow label="Attendees" value={(lead.meetingData.attendees || []).join(', ')} />
                {lead.meetingData.locationUrl && (
                  <a href={lead.meetingData.locationUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ExternalLink size={12} /> Open in Maps
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Discovery Form */}
          {!presalesLostVisibility && (
            <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><Search size={16} style={{ color: 'var(--primary)' }}/> Need Discovery</h2>
              </div>

              {/* Expected Services */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'white', display: 'block', marginBottom: 10 }}>Expected Services</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {expectedServices.map(item => {
                    const sel = form.services.includes(item);
                    return <ChipBtn key={item} label={item} selected={sel} onClick={() => setForm(f => ({ ...f, services: sel ? f.services.filter(s => s !== item) : [...f.services, item] }))} color="var(--primary)" />;
                  })}
                </div>
              </div>

              {/* Scope */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'white', display: 'block', marginBottom: 10 }}>Scope of Work</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {scopeOptions.map(item => {
                    const sel = form.scope.includes(item);
                    return <ChipBtn key={item} label={item} selected={sel} onClick={() => setForm(f => ({ ...f, scope: sel ? f.scope.filter(s => s !== item) : [...f.scope, item] }))} color="#60A5FA" />;
                  })}
                </div>
              </div>

              {/* Budget + Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 10, display: 'block' }}>Budget (₹L)</label>
                  <input type="range" min="5" max="100" step="1" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: +e.target.value }))} style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
                    <span style={{ color: 'var(--text-dim)' }}>₹5L</span>
                    <span style={{ color: 'var(--primary)', fontSize: 18, fontWeight: 700 }}>₹{form.budget}L</span>
                    <span style={{ color: 'var(--text-dim)' }}>₹1Cr+</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 10, display: 'block' }}>Customer Timeline</label>
                  <select value={form.customerTimeline} onChange={e => setForm(f => ({ ...f, customerTimeline: e.target.value }))} style={inputStyle}>
                    {customerTimelines.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Buyer Intent */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <SelectGrp label="Readiness" value={form.readiness} options={readinessOptions} onChange={v => setForm(f => ({ ...f, readiness: v }))} />
                <SelectGrp label="Decision Maker" value={form.decisionMaker} options={decisionMakerOptions} onChange={v => setForm(f => ({ ...f, decisionMaker: v }))} />
                <SelectGrp label="Competition" value={form.competition} options={competitorOptions} onChange={v => setForm(f => ({ ...f, competition: v }))} />
              </div>

              {/* Interior POV */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'white', display: 'block', marginBottom: 8 }}>Interior Point of View</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {interiorPovOptions.map(pov => (
                    <button key={pov} onClick={() => setForm(f => ({ ...f, interiorPov: pov }))} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500, background: form.interiorPov === pov ? 'var(--primary-bg)' : 'var(--bg-main)', border: `1px solid ${form.interiorPov === pov ? 'var(--primary)' : 'var(--border)'}`, color: form.interiorPov === pov ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer' }}>{pov}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'white', display: 'block', marginBottom: 8 }}>Executive Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Key details, requirements..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>
            </Card>
          )}

          {/* ── POST-VISIT SUMMARY (show after Meeting Done) ── */}
          {(lead.status === 'Meeting Done' || lead.status === 'Proposal Sent' || lead.status === 'Converted') && lead.postVisitSummary && (
            <Card style={{ padding: 16, borderLeft: '3px solid #8B5CF6' }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', marginBottom: 10 }}>Post-Visit Summary</h4>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>{lead.postVisitSummary.summary || 'No summary'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: 10, background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>Trigger</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{lead.postVisitSummary.trigger || '-'}</p>
                </div>
                <div style={{ padding: 10, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#F87171', textTransform: 'uppercase' }}>Barrier</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{lead.postVisitSummary.barrier || '-'}</p>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 6 }}>By {lead.postVisitSummary.savedBy} · {new Date(lead.postVisitSummary.savedAt).toLocaleDateString()}</p>
            </Card>
          )}

          {/* Visit Type (if meeting data exists) */}
          {lead.meetingData?.visitType && (
            <Card style={{ padding: 14, background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.15)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', marginBottom: 4 }}>Visit Type</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{lead.meetingData.visitType}</p>
            </Card>
          )}

          {/* ── STATUS TRANSITION ACTIONS ── */}
          <Card style={{ padding: 20 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginBottom: 14 }}>
              Lead Status Actions
            </h4>

            {/* Lock after Converted */}
            {lead.status === 'Converted' && (
              <div style={{ padding: 14, background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.2)', textAlign: 'center' }}>
                <CheckCircle size={24} style={{ color: '#34D399', margin: '0 auto 8px' }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: '#34D399' }}>Lead Converted</p>
                <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Status changes are locked after conversion.</p>
              </div>
            )}

            {lead.status !== 'Converted' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {allowedTransitions.map(nextStatus => {
                  const sc = statusColors[nextStatus];
                  if (nextStatus === 'Not Qualified') {
                    return (
                      <button key={nextStatus} onClick={() => setShowLostReason(true)} style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <XCircle size={16} /> Not Qualified
                      </button>
                    );
                  }
                  if (nextStatus === 'Meeting Scheduled') {
                    return (
                      <button key={nextStatus} onClick={() => setShowMeeting(true)} style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={16} /> Schedule Meeting
                      </button>
                    );
                  }
                  return (
                    <button key={nextStatus} onClick={() => handleStatusTransition(nextStatus)} style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ArrowRight size={16} /> {nextStatus}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
          </>)}

          {/* ── TAB: PROJECT LIFECYCLE ── */}
          {activeTab === 'lifecycle' && (
            <ProjectLifecycle lead={lead} user={user} />
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingRight: 4, paddingBottom: 24 }}>

          {/* Score Card */}
          <Card style={{ padding: 20, background: 'linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.5) 100%)', border: `1px solid ${scoreColor}40` }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, textAlign: 'center' }}>Score</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={50} cy={50} r={42} fill="none" stroke="var(--bg-main)" strokeWidth={7} />
                  <circle cx={50} cy={50} r={42} fill="none" stroke={scoreColor} strokeWidth={7} strokeDasharray={264} strokeDashoffset={264 - 264 * currentScore / 100} strokeLinecap="round" style={{ transition: 'all 0.5s' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>{currentScore}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ label: 'Possession', value: lead.possession ? ((new Date(lead.possession) - Date.now()) / (30*24*60*60*1000) < 6 ? 28 : 17) : 7, max: 35, color: '#F87171' },
                { label: 'Budget', value: form.budget >= 15 ? 25 : 17, max: 25, color: '#FBBF24' },
                { label: 'Scope', value: form.scope.length >= 2 ? 20 : 10, max: 20, color: '#34D399' },
                { label: 'Intent', value: form.readiness?.includes('month') ? 20 : 10, max: 20, color: '#60A5FA' },
              ].map(d => (
                <div key={d.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
                    <span>{d.label}</span><span style={{ color: 'white', fontWeight: 600 }}>{d.value}/{d.max}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-main)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(d.value / d.max) * 100}%`, background: d.color, borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Status History */}
          <Card style={{ padding: 0}}>
            <div style={{ padding: '14px 16px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowRight size={14} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Status History</h3>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {(lead.statusHistory || []).map((entry, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 18, borderLeft: '2px solid var(--border)', paddingBottom: 16 }}>
                  <div style={{ position: 'absolute', left: -5, top: 2, width: 8, height: 8, borderRadius: '50%', background: statusColors[entry.status]?.color || 'var(--text-muted)' }} />
                  <p style={{ fontSize: 12, fontWeight: 600, color: statusColors[entry.status]?.color || 'white' }}>{entry.status}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>{new Date(entry.date).toLocaleString()} · by {entry.by}</p>
                  {entry.reason && <p style={{ fontSize: 10, color: '#F87171', fontStyle: 'italic' }}>Reason: {entry.reason}</p>}
                </div>
              ))}
            </div>
          </Card>

          {/* Call Timeline */}
          <Card style={{ padding: 0 }}>
            <div style={{ padding: '14px 16px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={14} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Call Timeline</h3>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {(lead.callHistory || []).map((call, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 18, borderLeft: '2px solid var(--border)', paddingBottom: 18 }}>
                  <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: call.outcome === 'Connected' ? '#34D399' : 'var(--text-muted)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{call.outcome}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)', marginLeft: 6 }}>{new Date(call.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {call.outcome === 'Connected' && <span style={{ fontSize: 10, color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '2px 6px', borderRadius: 8 }}>{call.duration}</span>}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>"{call.notes}"</p>
                  {call.aiSummary && (
                    <div style={{ marginTop: 6, padding: 8, background: 'rgba(139,92,246,0.06)', borderRadius: 6, border: '1px solid rgba(139,92,246,0.15)' }}>
                      <p style={{ fontSize: 10, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><Sparkles size={10} /> AI Summary</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{call.aiSummary}</p>
                    </div>
                  )}
                </div>
              ))}
              {(!lead.callHistory || lead.callHistory.length === 0) && <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: 16 }}>No calls yet</p>}
            </div>
          </Card>

          {/* MoEngage Status */}
          {lead.moengage && (
            <Card style={{ padding: 14, background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Target size={14} style={{ color: '#34D399' }} />
                <h4 style={{ fontSize: 11, fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>MoEngage</h4>
                <Badge variant="success" style={{ fontSize: 9, marginLeft: 'auto' }}>SYNCED</Badge>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>Last sync: {new Date(lead.moengage.lastSync).toLocaleString()}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {(lead.moengage.events || []).map((ev, i) => (
                  <span key={i} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>{ev}</span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {showAssign && (
        <Modal onClose={() => setShowAssign(false)} title="Reassign Lead">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {teamMembers.filter(t => t.active).map(t => (
              <button key={t.id} onClick={() => { assignLead(lead.id, t.id, user?.name); setShowAssign(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: lead.assignedTo === t.id ? 'var(--primary-bg)' : 'var(--bg-main)', border: `1px solid ${lead.assignedTo === t.id ? 'var(--primary)' : 'var(--border)'}`, color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div><span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span><span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>{t.role} · {t.region}</span></div>
                {lead.assignedTo === t.id && <CheckCircle size={16} style={{ color: 'var(--primary)' }} />}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {showMeeting && (
        <Modal onClose={() => setShowMeeting(false)} title="Schedule Meeting">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Visit Type</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {visitTypes.map(vt => (
                  <button key={vt} onClick={() => setMeetingForm(f => ({ ...f, visitType: vt }))} style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500, background: meetingForm.visitType === vt ? 'var(--primary-bg)' : 'var(--bg-main)', border: `1px solid ${meetingForm.visitType === vt ? 'var(--primary)' : 'var(--border)'}`, color: meetingForm.visitType === vt ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer' }}>{vt}</button>
                ))}
              </div>
            </div>
            <div><label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Date & Time</label><input type="datetime-local" value={meetingForm.datetime} onChange={e => setMeetingForm(f => ({ ...f, datetime: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Location</label><input value={meetingForm.location} onChange={e => setMeetingForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Morph Experience Centre" style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Location URL</label><input value={meetingForm.locationUrl} onChange={e => setMeetingForm(f => ({ ...f, locationUrl: e.target.value }))} placeholder="https://maps.google.com/..." style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Attendees (comma separated)</label><input value={meetingForm.attendees} onChange={e => setMeetingForm(f => ({ ...f, attendees: e.target.value }))} placeholder="Rohan, Meera, Ankit" style={inputStyle} /></div>
            <Button variant="primary" onClick={handleScheduleMeeting} style={{ marginTop: 8 }}><Calendar size={14} style={{ marginRight: 6 }} /> Confirm & Set Status</Button>
          </div>
        </Modal>
      )}

      {/* Post-Visit Summary Modal */}
      {showPostVisit && (
        <Modal onClose={() => setShowPostVisit(false)} title="Post-Visit Summary">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Capture visit observations — this helps the sales team prepare for next steps.</p>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Visit Summary (Open Text)</label>
              <textarea rows={4} value={postVisitForm.summary} onChange={e => setPostVisitForm(f => ({ ...f, summary: e.target.value }))} placeholder="Key observations, customer reactions, design preferences discussed..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#34D399', display: 'block', marginBottom: 4 }}>✦ Trigger — What motivated the customer?</label>
              <input value={postVisitForm.trigger} onChange={e => setPostVisitForm(f => ({ ...f, trigger: e.target.value }))} placeholder="e.g., Possession in 2 months, spouse impressed by showroom" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#F87171', display: 'block', marginBottom: 4 }}>⚠ Barrier — What's holding them back?</label>
              <input value={postVisitForm.barrier} onChange={e => setPostVisitForm(f => ({ ...f, barrier: e.target.value }))} placeholder="e.g., Budget concern, comparing with competitors" style={inputStyle} />
            </div>
            <Button variant="primary" onClick={handleSavePostVisit} style={{ marginTop: 8 }}><Save size={14} style={{ marginRight: 6 }} /> Save Post-Visit Summary</Button>
          </div>
        </Modal>
      )}

      {/* Lost Reason Modal (mandatory) */}
      {showLostReason && (
        <Modal onClose={() => setShowLostReason(false)} title="Reason Required — Not Qualified / Lost">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 12, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p style={{ fontSize: 12, color: '#F87171' }}><AlertCircle size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />Reason is <strong>mandatory</strong> for marking a lead as Not Qualified / Lost.</p>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Select Reason</label>
              <select value={lostReason} onChange={e => setLostReason(e.target.value)} style={inputStyle}>
                <option value="">-- Select a reason --</option>
                <option>Budget not sufficient</option>
                <option>Chose competitor</option>
                <option>Timeline too far out</option>
                <option>Not interested in interiors</option>
                <option>Could not reach customer</option>
                <option>Duplicate lead</option>
                <option>Wrong contact information</option>
                <option>Other</option>
              </select>
            </div>
            {lostReason === 'Other' && (
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Specify Reason</label>
                <input value={''} onChange={() => {}} placeholder="Enter detailed reason" style={inputStyle} />
              </div>
            )}
            <Button variant="primary" onClick={handleLost} disabled={!lostReason.trim()} style={{ marginTop: 8, opacity: lostReason.trim() ? 1 : 0.5 }}><XCircle size={14} style={{ marginRight: 6 }} /> Confirm Not Qualified</Button>
          </div>
        </Modal>
      )}

      {showCatalogue && (
        <Modal onClose={() => setShowCatalogue(false)} title="Send Catalogue">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {catalogues.map(cat => (
              <button key={cat.id} onClick={() => { alert(`Sent "${cat.name}" to ${lead.phone} via WhatsApp`); setShowCatalogue(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                  <div style={{ textAlign: 'left' }}><span style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</span><span style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block' }}>{cat.type} · {cat.size}</span></div>
                </div>
                <Send size={14} style={{ color: 'var(--primary)' }} />
              </button>
            ))}
          </div>
        </Modal>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--bg-main); border-radius: 4px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
      `}</style>
    </div>
  );
};

/* ── HELPERS ── */
const inputStyle = { width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none' };

const ActionButton = ({ icon: Icon, label, primary, variant }) => {
  const isWa = variant === 'whatsapp';
  const bg = primary ? 'var(--primary-bg)' : isWa ? 'rgba(34,197,94,0.1)' : 'var(--bg-main)';
  const color = primary ? 'var(--primary-light)' : isWa ? '#22C55E' : 'var(--text-muted)';
  const border = primary ? 'var(--primary)' : isWa ? 'rgba(34,197,94,0.3)' : 'var(--border)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: bg, border: `1px solid ${border}`, color, cursor: 'pointer', fontSize: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={14} /><span style={{ fontWeight: 500 }}>{label}</span></div>
      {(primary || isWa) && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
    </div>
  );
};

const PRow = ({ label, value, highlight }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 12 }}>
    <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>{label}</span>
    <span style={{ color: highlight ? 'white' : 'var(--text-muted)', fontWeight: highlight ? 700 : 500, textAlign: 'right', wordBreak: 'break-word', paddingLeft: 10 }}>{value}</span>
  </div>
);

const SelectGrp = ({ label, value, options, onChange }) => (
  <div>
    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>{options.map(o => <option key={o}>{o}</option>)}</select>
  </div>
);

const ChipBtn = ({ label, selected, onClick, color }) => (
  <button onClick={onClick} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: selected ? `${color}15` : 'transparent', border: `1px solid ${selected ? color : 'var(--border)'}`, color: selected ? color : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{label}</button>
);

const Modal = ({ onClose, title, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={onClose}>
    <Card style={{ width: 480, maxHeight: '80vh', overflow: 'auto', padding: 24, animation: 'fadeIn 0.2s' }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{title}</h3>
        <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}><XCircle size={18} /></button>
      </div>
      {children}
    </Card>
  </div>
);

export default LeadDetail;
