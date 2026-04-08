import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Badge, Accordion, Modal } from '../components/ui/index.jsx';
import ProjectLifecycle from '../components/ProjectLifecycle.jsx';
import {
  Phone, Mail, MessageSquare, ChevronLeft, MapPin, Home, IndianRupee,
  Layers, Calendar, Clock, Save, CheckCircle, XCircle, AlertCircle,
  Play, History, PhoneOff, User, Send, Globe, ChevronRight, Fingerprint, Search,
  Sparkles, ArrowRight, Users, BookOpen, FileText, UserPlus, Target, ExternalLink,
  Workflow, ClipboardList, GitMerge, Zap, Hash, CreditCard, PenTool, Paintbrush,
  Factory, ClipboardCheck, Wrench, ShieldCheck, Star
} from 'lucide-react';
import { scopeOptions, styleOptions, readinessOptions, decisionMakerOptions, competitorOptions, expectedServices, customerTimelines, teamMembers, statusFlow, statusColors, languages, interiorPovOptions, catalogues, mockEstimations, mockQuotations, mockPayments, mockContracts, mockProjects, projectPhases } from '../data/mockData.js';
import MorphLoader from '../components/ui/MorphLoader.jsx';

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
    budget: '', services: [], scope: [], readiness: '',
    coApplicants: [],
    newFollowUpPre: '', newFollowUpSales: '',
    meetingDate: '', meetingLocation: '', meetingAttendees: '', specialRequirements: '', services: [], customerTimeline: 'Next 3 Months',
    interiorPov: '', coApplicants: [],
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
        interiorPov: '', coApplicants: found.coApplicants || [],
        newFollowUpPre: '', newFollowUpSales: '',
        meetingDate: '', meetingLocation: '', meetingAttendees: '',
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
        coApplicants: form.coApplicants.length > 0 ? form.coApplicants : lead.coApplicants || [],
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

  if (!lead) return (
    <div style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <MorphLoader size={70} />
    </div>
  );

  const project = mockProjects.find(p => p.leadId === lead.id);
  const contract = mockContracts.find(c => c.leadId === lead.id);
  const phaseInfo = project ? projectPhases.find(p => p.name === project.currentPhase) : null;
  const paidPct = contract && project ? Math.round((project.totalPaid / contract.contractValue) * 100) : 0;
  const formatCurrencyH = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n || 0).toLocaleString()}`;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>

      {/* ═══ UNIVERSAL LEAD SPOTLIGHT HEADER ═══ */}
      {(() => {
        const sc = statusColors[lead.status] || {};
        const isConverted = lead.status === 'Converted';
        const accentColor = sc.color || 'var(--primary)';

        // Adaptive KPI tiles based on status
        const kpiTiles = isConverted
          ? [
              { label: 'Contract Value', value: contract ? formatCurrencyH(contract.contractValue) : '—', color: '#34D399' },
              { label: 'Total Paid',     value: project   ? formatCurrencyH(project.totalPaid)      : '—', color: '#34D399' },
              { label: 'Pending',        value: project   ? formatCurrencyH(project.totalPending)   : '—', color: '#F87171' },
              { label: 'Current Phase',  value: project?.currentPhase || '—',                            color: phaseInfo?.color || 'var(--primary)' },
            ]
          : [
              { label: 'Lead Value',  value: lead.value ? `₹${lead.value}L` : '—',           color: lead.value >= 20 ? '#34D399' : 'var(--text-main)' },
              { label: 'Lead Score',  value: lead.score != null ? `${lead.score}/100` : '—', color: '#FBBF24' },
              { label: 'Status',      value: lead.status,                                    color: accentColor },
              { label: 'Source',      value: lead.source || '—',                             color: 'var(--text-muted)' },
            ];

        return (
          <div style={{
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${isConverted ? 'rgba(168,137,68,0.28)' : `${accentColor}22`}`,
            background: isConverted
              ? 'linear-gradient(135deg, rgba(168,137,68,0.09) 0%, rgba(52,211,153,0.05) 60%, rgba(96,165,250,0.03) 100%)'
              : `linear-gradient(135deg, ${accentColor}09 0%, rgba(96,165,250,0.03) 100%)`,
            padding: '14px 20px',
            marginBottom: 14,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow accents */}
            <div style={{ position: 'absolute', top: -30, right: 60, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -20, left: 100, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative' }}>

              {/* Left: Back + Avatar + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button onClick={() => navigate('/leads')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'transparent', border: `1px solid ${accentColor}40`, color: accentColor, cursor: 'pointer', flexShrink: 0 }}>
                  <ChevronLeft size={15} />
                </button>

                {/* Avatar with status badge */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${accentColor}15`, border: `2px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: accentColor, boxShadow: `0 0 16px ${accentColor}20` }}>
                    {lead.name.charAt(0)}
                  </div>
                  {/* Status badge: star for converted, colored dot for others */}
                  {isConverted ? (
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#FBBF24', border: '1.5px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star size={9} style={{ color: '#080a0f', fill: '#080a0f' }} />
                    </div>
                  ) : (
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: accentColor, border: '1.5px solid var(--bg-card)', boxShadow: `0 0 6px ${accentColor}` }} />
                  )}
                </div>

                {/* Text info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{lead.name}</h1>
                    {/* Status badge */}
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {lead.status}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--primary)', border: '1px solid rgba(168,137,68,0.5)' }}>
                      {lead.id}
                    </span>
                    {['Inbound Call', 'Website Inquiry'].includes(lead.source) && (
                      <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>⚡ INBOUND</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> {lead.region}</span>
                    {lead.config && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Layers size={11} /> {lead.config}{lead.area ? ` · ${lead.area} sqft` : ''}</span>}
                    {lead.assignedToName && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>👤 {lead.assignedToName}</span>}
                    {lead.project && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Home size={11} /> {lead.project}</span>}
                  </div>
                  {/* Progress bar: payment for converted, score bar for others */}
                  <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ height: 4, width: 150, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: isConverted ? `${paidPct}%` : `${lead.score || 0}%`,
                        background: isConverted
                          ? 'linear-gradient(90deg, var(--primary), #34D399)'
                          : `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
                        borderRadius: 2,
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                      {isConverted ? `${paidPct}% paid` : `Score: ${lead.score || 0}/100`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: KPI tiles + Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {kpiTiles.map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: 'center', padding: '7px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.07)', minWidth: 86 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</p>
                  </div>
                ))}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, marginLeft: 10 }}>
                  <Button variant="outline" size="sm" onClick={() => setShowAssign(true)} style={{ background: 'var(--bg-main)', height: 30, padding: '0 10px', fontSize: 11 }}>
                    <Users size={12} style={{ marginRight: 4 }}/> Assign
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCatalogue(true)} style={{ background: 'var(--bg-main)', height: 30, padding: '0 10px', fontSize: 11 }}>
                    <BookOpen size={12} style={{ marginRight: 4 }}/> Catalogue
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/leads')} style={{ height: 30, padding: '0 14px', fontSize: 11, boxShadow: 'var(--shadow-gold)', minWidth: 105, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {savedIndicator ? (
                      <span className="animate-fade-in" style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle size={12} style={{ marginRight: 4 }} /> Saved
                      </span>
                    ) : (
                      <span className="animate-fade-in" style={{ display: 'flex', alignItems: 'center' }}>
                        <Save size={12} style={{ marginRight: 4 }} /> Save & Close
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}




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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, rgba(168,137,68,0.15) 0%, transparent 100%)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px', background: 'var(--bg-card)', border: `2px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'var(--text-main)', boxShadow: `0 8px 24px ${scoreColor}30` }}>{lead.name[0]}</div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)' }}>{lead.name}</h2>
              <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>{lead.source}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20 }}>
              <ActionButton icon={Phone} label={lead.phone} primary />
              <ActionButton icon={Mail} label={lead.email || 'No email'} />
              {lead.whatsapp && <ActionButton icon={MessageSquare} label={lead.whatsapp} variant="whatsapp" />}
              {lead.language && <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12, color: 'var(--text-dim)' }}><Globe size={14} /> {lead.language}</div>}
            </div>
          </Card>

          {/* Co-Applicants */}
          <Accordion title="Co-Applicants" icon={UserPlus} defaultOpen={false} headerRight={form.coApplicants.length < 3 && (
            <button onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, coApplicants: [...f.coApplicants, { name: '', phone: '', email: '', relation: '' }] }))}} style={{ fontSize: 10, padding: '4px 8px', borderRadius: 4, background: 'var(--primary-bg)', color: 'var(--primary-light)', border: '1px solid var(--primary)', cursor: 'pointer' }}>+ Add</button>
          )}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {form.coApplicants.map((ca, idx) => (
                 <div key={idx} style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', position: 'relative' }}>
                   <button onClick={() => setForm(f => ({ ...f, coApplicants: f.coApplicants.filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: 10 }}>Remove</button>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                     <input placeholder="Name" value={ca.name} onChange={e => { const arr = [...form.coApplicants]; arr[idx].name = e.target.value; setForm(f => ({ ...f, coApplicants: arr })); }} style={inputStyle} />
                     <input placeholder="Phone" value={ca.phone} onChange={e => { const arr = [...form.coApplicants]; arr[idx].phone = e.target.value; setForm(f => ({ ...f, coApplicants: arr })); }} style={inputStyle} />
                     <input placeholder="Email" value={ca.email} onChange={e => { const arr = [...form.coApplicants]; arr[idx].email = e.target.value; setForm(f => ({ ...f, coApplicants: arr })); }} style={inputStyle} />
                     <select value={ca.relation} onChange={e => { const arr = [...form.coApplicants]; arr[idx].relation = e.target.value; setForm(f => ({ ...f, coApplicants: arr })); }} style={inputStyle}>
                       <option value="">Relation</option>
                       {['Spouse', 'Parent', 'Sibling', 'Friend', 'Business Partner'].map(r => <option key={r}>{r}</option>)}
                     </select>
                     {ca.name && canCall && <ActionButton icon={Phone} label={`Call ${ca.name}`} primary />}
                   </div>
                 </div>
              ))}
              {form.coApplicants.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>No co-applicants.</p>}
            </div>
          </Accordion>

          <Accordion title="Property Details" icon={Home} defaultOpen={false}>
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
          </Accordion>

          {/* Follow-up Dates */}
          <Accordion title="Follow-up Schedule" icon={Calendar} defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(lead.followUps || []).map((fu, idx) => (
                <div key={idx} style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{fu.type} Follow-up</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(fu.date).toLocaleString()}</p>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: 'var(--text-dim)' }}>Add Pre-sales</label>
                  <input type="datetime-local" value={form.newFollowUpPre || ''} onChange={e => setForm(f => ({ ...f, newFollowUpPre: e.target.value }))} style={{...inputStyle, padding: '6px 10px'}} />
                </div>
                <Button variant="primary" style={{ padding: '6px 12px' }} onClick={() => { if(form.newFollowUpPre) { setFollowUp(lead.id, form.newFollowUpPre, false); setForm(f => ({...f, newFollowUpPre: ''})); } }}>Add</Button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: 'var(--text-dim)' }}>Add Sales</label>
                  <input type="datetime-local" value={form.newFollowUpSales || ''} onChange={e => setForm(f => ({ ...f, newFollowUpSales: e.target.value }))} style={{...inputStyle, padding: '6px 10px'}} />
                </div>
                <Button variant="primary" style={{ padding: '6px 12px' }} onClick={() => { if(form.newFollowUpSales) { setFollowUp(lead.id, form.newFollowUpSales, true); setForm(f => ({...f, newFollowUpSales: ''})); } }}>Add</Button>
              </div>
            </div>
          </Accordion>
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
              border: 'none', transition: 'all 0.25s', position: 'relative',
              background: activeTab === 'lifecycle'
                ? lead.status === 'Converted'
                  ? 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(168,137,68,0.12))'
                  : 'linear-gradient(135deg, var(--primary-bg), rgba(168,137,68,0.25))'
                : 'transparent',
              color: activeTab === 'lifecycle'
                ? lead.status === 'Converted' ? '#34D399' : 'var(--primary-light)'
                : 'var(--text-dim)',
              boxShadow: activeTab === 'lifecycle'
                ? lead.status === 'Converted' ? '0 0 12px rgba(52,211,153,0.15)' : '0 0 12px rgba(168,137,68,0.15)'
                : 'none',
            }}>
              <GitMerge size={15} />
              {lead.status === 'Converted' ? 'Project Journey' : 'Project Lifecycle'}
              {lead.status === 'Converted' && (
                <span style={{ fontSize: 8, fontWeight: 800, color: '#34D399', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, padding: '1px 5px' }}>11 STAGES</span>
              )}
            </button>
          </div>

          {/* ── TAB: LEAD DETAILS ── */}
          {activeTab === 'details' && (<>

          {/* Call Banner */}
          {canCall && (
            <div style={{ background: activeCall ? 'linear-gradient(90deg, rgba(52,211,153,0.1) 0%, var(--bg-card) 100%)' : 'var(--bg-card)', border: `1px solid ${activeCall ? '#34D39960' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={activeCall ? handleEndCall : () => setActiveCall(true)} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', background: activeCall ? '#EF4444' : 'var(--primary)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', animation: activeCall ? 'pulse 2s infinite' : 'none' }}>
                  {activeCall ? <PhoneOff size={22} /> : <Phone size={22} />}
                </button>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={16} style={{ color: '#FBBF24' }} /><span style={{ fontSize: 13, color: 'var(--text-main)' }}>Schedule Callback</span></div>
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

          {/* Meetings Data */}
          {(lead.meetings || []).length > 0 && (
            <Card style={{ padding: 16, background: 'rgba(168,137,68,0.06)', border: '1px solid rgba(168,137,68,0.2)' }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> Meetings History
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {lead.meetings.map((m, idx) => (
                  <div key={idx} style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 8, border: '1px solid rgba(168,137,68,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <PRow label="Date/Time" value={new Date(m.datetime).toLocaleString()} />
                      <PRow label="Location" value={m.location} />
                      <PRow label="Attendees" value={(m.attendees || []).join(', ')} />
                      <PRow label="Visit Type" value={m.visitType || 'Site Visit'} />
                      {m.locationUrl && (
                        <a href={m.locationUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, gridColumn: '1 / -1' }}>
                          <ExternalLink size={12} /> Open in Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Discovery Form */}
          {!presalesLostVisibility && (
            <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}><Search size={16} style={{ color: 'var(--primary)' }}/> Need Discovery</h2>
              </div>

              {/* Expected Services */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 10 }}>Expected Services</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {expectedServices.map(item => {
                    const sel = form.services.includes(item);
                    return <ChipBtn key={item} label={item} selected={sel} onClick={() => setForm(f => ({ ...f, services: sel ? f.services.filter(s => s !== item) : [...f.services, item] }))} color="var(--primary)" />;
                  })}
                </div>
              </div>

              {/* Scope */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 10 }}>Scope of Work</label>
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
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 10, display: 'block' }}>Budget (₹L)</label>
                  <input type="range" min="5" max="100" step="1" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: +e.target.value }))} style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
                    <span style={{ color: 'var(--text-dim)' }}>₹5L</span>
                    <span style={{ color: 'var(--primary)', fontSize: 18, fontWeight: 700 }}>₹{form.budget}L</span>
                    <span style={{ color: 'var(--text-dim)' }}>₹1Cr+</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 10, display: 'block' }}>Customer Timeline</label>
                  <select value={form.customerTimeline} onChange={e => setForm(f => ({ ...f, customerTimeline: e.target.value }))} style={inputStyle}>
                    {customerTimelines.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Buyer Intent */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
                <SelectGrp label="Readiness" value={form.readiness} options={readinessOptions} onChange={v => setForm(f => ({ ...f, readiness: v }))} />
                <SelectGrp label="Decision Maker" value={form.decisionMaker} options={decisionMakerOptions} onChange={v => setForm(f => ({ ...f, decisionMaker: v }))} />
                <SelectGrp label="Competition" value={form.competition} options={competitorOptions} onChange={v => setForm(f => ({ ...f, competition: v }))} />
              </div>

              {/* Interior POV */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>Interior Point of View</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {interiorPovOptions.map(pov => (
                    <button key={pov} onClick={() => setForm(f => ({ ...f, interiorPov: pov }))} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500, background: form.interiorPov === pov ? 'var(--primary-bg)' : 'var(--bg-main)', border: `1px solid ${form.interiorPov === pov ? 'var(--primary)' : 'var(--border)'}`, color: form.interiorPov === pov ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer' }}>{pov}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>Executive Notes</label>
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

          {/* ── TAB: PROJECT JOURNEY (merged pipeline + lifecycle) ── */}
          {activeTab === 'lifecycle' && (
            <CombinedJourneyTab lead={lead} user={user} />
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingRight: 4, paddingBottom: 24 }}>

          {/* Score Card */}
          <Card style={{ padding: 20, background: 'var(--bg-elevated)', border: `1px solid ${scoreColor}40` }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, textAlign: 'center' }}>Score</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={50} cy={50} r={42} fill="none" stroke="var(--bg-main)" strokeWidth={7} />
                  <circle cx={50} cy={50} r={42} fill="none" stroke={scoreColor} strokeWidth={7} strokeDasharray={264} strokeDashoffset={264 - 264 * currentScore / 100} strokeLinecap="round" style={{ transition: 'all 0.5s' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>{currentScore}</span>
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
                    <span>{d.label}</span><span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{d.value}/{d.max}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-main)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(d.value / d.max) * 100}%`, background: d.color, borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Status History */}
          <Accordion title="Status History" icon={ArrowRight} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(lead.statusHistory || []).map((entry, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 18, borderLeft: '2px solid var(--border)', paddingBottom: 16 }}>
                  <div style={{ position: 'absolute', left: -5, top: 2, width: 8, height: 8, borderRadius: '50%', background: statusColors[entry.status]?.color || 'var(--text-muted)' }} />
                  <p style={{ fontSize: 12, fontWeight: 600, color: statusColors[entry.status]?.color || 'var(--text-main)' }}>{entry.status}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>{new Date(entry.date).toLocaleString()} · by {entry.by}</p>
                  {entry.reason && <p style={{ fontSize: 10, color: '#F87171', fontStyle: 'italic' }}>Reason: {entry.reason}</p>}
                </div>
              ))}
            </div>
          </Accordion>

          {/* Call Timeline */}
          <Accordion title="Call Timeline" icon={History} defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(lead.callHistory || []).map((call, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 18, borderLeft: '2px solid var(--border)', paddingBottom: 18 }}>
                  <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: call.outcome === 'Connected' ? '#34D399' : 'var(--text-muted)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{call.outcome}</span>
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
          </Accordion>

          {/* MoEngage Status */}
          {lead.moengage && (
            <Accordion title="MoEngage Status" icon={Target} defaultOpen={false} headerRight={<Badge variant="success" style={{ fontSize: 9 }}>SYNCED</Badge>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>Last sync: {new Date(lead.moengage.lastSync).toLocaleString()}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {(lead.moengage.events || []).map((ev, i) => (
                  <span key={i} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>{ev}</span>
                ))}
              </div>
            </Accordion>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {showAssign && (
        <Modal onClose={() => setShowAssign(false)} title="Reassign Lead">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {teamMembers.filter(t => t.active).map(t => (
              <button key={t.id} onClick={() => { assignLead(lead.id, t.id, user?.name); setShowAssign(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: lead.assignedTo === t.id ? 'var(--primary-bg)' : 'var(--bg-main)', border: `1px solid ${lead.assignedTo === t.id ? 'var(--primary)' : 'var(--border)'}`, color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s' }}>
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
              <button key={cat.id} onClick={() => { alert(`Sent "${cat.name}" to ${lead.phone} via WhatsApp`); setShowCatalogue(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s' }}>
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
const inputStyle = { width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none' };

const ActionButton = ({ icon: Icon, label, primary, variant }) => {
  const isWa = variant === 'whatsapp';
  const bg = primary ? 'var(--primary-bg)' : isWa ? 'rgba(34,197,94,0.1)' : 'var(--bg-main)';
  const color = primary ? 'var(--primary-light)' : isWa ? '#22C55E' : 'var(--text-main)';
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
    <span style={{ color: 'var(--text-main)', fontWeight: highlight ? 700 : 500, textAlign: 'right', wordBreak: 'break-word', paddingLeft: 10 }}>{value}</span>
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
// ── COMBINED JOURNEY TAB: Pipeline Strip + Project Lifecycle ──
const phaseIconsMap = {
  'Onboarding': Users,
  'Design Phase': Paintbrush,
  'Design Sign-off': PenTool,
  'Production Phase': Factory,
  'QC & Dispatch': ClipboardCheck,
  'Installation': Wrench,
  'Handover': ShieldCheck,
};
const phaseEditRolesMap = {
  'Onboarding': ['CRM Head', 'Regional Manager'],
  'Design Phase': ['Design Manager', 'CRM Head'],
  'Design Sign-off': ['Sales Manager', 'CRM Head'],
  'Production Phase': ['Production Manager', 'CRM Head'],
  'QC & Dispatch': ['QC Manager', 'Account Manager', 'CRM Head'],
  'Installation': ['Project Manager', 'CRM Head'],
  'Handover': ['Project Manager', 'CRM Head', 'Regional Manager'],
};

const CombinedJourneyTab = ({ lead, user }) => {
  const estimation = mockEstimations.find(e => e.leadId === lead.id);
  const quotation = mockQuotations.find(q => q.leadId === lead.id);
  const payment = mockPayments.find(p => p.leadId === lead.id);
  const contract = mockContracts.find(c => c.leadId === lead.id);
  const project = mockProjects.find(p => p.leadId === lead.id);
  const isConverted = lead.status === 'Converted';

  const currentPhaseIdx = project ? projectPhases.findIndex(p => p.name === project.currentPhase) : -1;
  // Unified selection: { type: 'sale'|'project', id: string }
  const [activeItem, setActiveItem] = useState({ type: 'project', id: project?.currentPhase || null });

  const selectedPhase = activeItem.type === 'project' ? (activeItem.id || project?.currentPhase) : null;
  const selectedPhaseIdx = projectPhases.findIndex(p => p.name === selectedPhase);
  const canEdit = phaseEditRolesMap[selectedPhase]?.includes(user?.role) || false;

  const getPhaseStatus = (idx) => {
    if (idx < currentPhaseIdx) return 'completed';
    if (idx === currentPhaseIdx) return 'active';
    return 'upcoming';
  };

  const salesStatus = (id) => ({
    estimation: !!estimation,
    quotation: !!quotation,
    payment: !!payment,
    contract: !!contract,
  }[id] ? 'completed' : 'pending');

  const formatCurrency = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ══ SECTION 1: UNIFIED 11-STAGE PIPELINE STRIP (Converted leads) ══ */}
      {isConverted && (
        <div style={{ marginBottom: 16 }}>
          {/* Label bar */}
          <div style={{ display: 'flex', marginBottom: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <div style={{ flex: 4, padding: '6px 12px', background: 'rgba(168,137,68,0.1)', borderTopLeftRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 6, borderRight: '2px solid rgba(52,211,153,0.3)' }}>
              <IndianRupee size={11} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--primary)' }}>Sales Journey</span>
            </div>
            <div style={{ flex: 7, padding: '6px 12px', background: 'rgba(52,211,153,0.06)', borderTopRightRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={11} style={{ color: '#34D399' }} />
              <span style={{ color: '#34D399' }}>Project Journey</span>
            </div>
          </div>

          {/* Stage bubbles row */}
          <Card style={{ padding: 0, borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflow: 'hidden', borderTop: 'none' }}>
            <div style={{ display: 'flex' }}>
              {/* Sales stages — clickable to drill into detail */}
              {[{ id: 'estimation', shortName: 'EST', icon: Hash, color: '#A88944', label: 'Estimation', data: estimation },
                { id: 'quotation', shortName: 'QTN', icon: FileText, color: '#D4A853', label: 'Quotation', data: quotation },
                { id: 'payment', shortName: 'PAY', icon: CreditCard, color: '#F59E0B', label: 'Payment', data: payment },
                { id: 'contract', shortName: 'CNT', icon: PenTool, color: '#FBBF24', label: 'Contract', data: contract },
              ].map((stage, idx) => {
                const status = salesStatus(stage.id);
                const isSelected = activeItem.type === 'sale' && activeItem.id === stage.id;
                const SIcon = stage.icon;
                return (
                  <React.Fragment key={stage.id}>
                    <button
                      onClick={() => setActiveItem({ type: 'sale', id: stage.id })}
                      style={{
                        flex: 1, padding: '10px 4px', textAlign: 'center', cursor: 'pointer',
                        background: isSelected ? `${stage.color}20` : status === 'completed' ? `${stage.color}12` : 'transparent',
                        borderBottom: isSelected ? `2px solid ${stage.color}` : status === 'completed' ? `2px solid ${stage.color}60` : '2px solid transparent',
                        border: 'none', fontFamily: 'inherit', transition: 'all 0.2s', position: 'relative',
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: `5px solid ${stage.color}` }} />
                      )}
                      <div style={{ width: 26, height: 26, borderRadius: '50%', margin: '0 auto 5px', background: status === 'completed' ? `${stage.color}20` : 'var(--bg-main)', border: `2px solid ${status === 'completed' ? stage.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSelected ? `0 2px 8px ${stage.color}40` : 'none' }}>
                        {status === 'completed' ? <CheckCircle size={12} style={{ color: stage.color }} /> : <SIcon size={11} style={{ color: 'var(--text-dim)' }} />}
                      </div>
                      <p style={{ fontSize: 9, fontWeight: 700, color: isSelected ? stage.color : status === 'completed' ? stage.color : 'var(--text-dim)', textTransform: 'uppercase', lineHeight: 1.2 }}>{stage.shortName}</p>
                      <p style={{ fontSize: 8, color: isSelected ? stage.color : 'var(--text-dim)', lineHeight: 1.2, marginTop: 1 }}>{stage.label}</p>
                    </button>
                    {idx === 3 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 4px', background: 'rgba(52,211,153,0.1)', borderLeft: '1px solid rgba(52,211,153,0.3)', borderRight: '1px solid rgba(52,211,153,0.3)' }}>
                        <Zap size={11} style={{ color: '#34D399' }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Project stages — clickable to jump to that phase */}
              {projectPhases.map((phase, idx) => {
                const status = getPhaseStatus(idx);
                const isSelected = activeItem.type === 'project' && phase.name === (activeItem.id || project?.currentPhase);
                const PIcon = phaseIconsMap[phase.name] || Wrench;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActiveItem({ type: 'project', id: phase.name })}
                    style={{
                      flex: 1, padding: '10px 3px', textAlign: 'center', cursor: 'pointer',
                      background: isSelected
                        ? `${phase.color}20`
                        : status === 'completed' ? `${phase.color}08` : 'transparent',
                      borderBottom: isSelected
                        ? `2px solid ${phase.color}`
                        : status !== 'upcoming' ? `2px solid ${phase.color}50` : '2px solid transparent',
                      border: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: `5px solid ${phase.color}` }} />
                    )}
                    <div style={{ width: 26, height: 26, borderRadius: '50%', margin: '0 auto 5px', background: status !== 'upcoming' ? `${phase.color}20` : 'var(--bg-main)', border: `2px solid ${status !== 'upcoming' ? phase.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSelected ? `0 2px 8px ${phase.color}40` : 'none' }}>
                      {status === 'completed' ? <CheckCircle size={12} style={{ color: phase.color }} /> : status === 'active' ? <PIcon size={11} style={{ color: phase.color }} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--border)' }} />}
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: status !== 'upcoming' ? phase.color : 'var(--text-dim)', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      {phase.name === 'Design Sign-off' ? 'DSGN SGN' : phase.name.split(' ').slice(0, 2).join(' ').toUpperCase().replace('DESIGN PHASE', 'DSN').replace('PRODUCTION PHASE', 'PRD').replace('QC &', 'QC').replace('ONBOARDING', 'ONB').replace('INSTALLATION', 'INS').replace('HANDOVER', 'HND')}
                    </p>
                    {status === 'active' && !isSelected && <p style={{ fontSize: 7, color: phase.color, fontWeight: 800, marginTop: 1 }}>ACTIVE</p>}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ══ SECTION 2: PAYMENT SUMMARY BAR ══ */}
      {project && (
        <Card style={{ padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IndianRupee size={13} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>Payment Summary</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 12, color: '#34D399', fontWeight: 700 }}>Paid: {formatCurrency(project.totalPaid)}</span>
              <span style={{ fontSize: 12, color: '#F87171', fontWeight: 700 }}>Pending: {formatCurrency(project.totalPending)}</span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Total: {formatCurrency(project.contractValue)}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--bg-main)', borderRadius: 2, overflow: 'hidden', marginTop: 10 }}>
            <div style={{ height: '100%', width: `${Math.round((project.totalPaid / project.contractValue) * 100)}%`, background: 'linear-gradient(90deg, var(--primary), #34D399)', borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
            {(project.payments || []).map((p, i) => (
              <div key={i} style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: p.status === 'Paid' ? 'rgba(52,211,153,0.06)' : 'var(--bg-main)', border: `1px solid ${p.status === 'Paid' ? 'rgba(52,211,153,0.2)' : 'var(--border)'}` }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: p.status === 'Paid' ? '#34D399' : '#F87171', textTransform: 'uppercase', marginBottom: 2 }}>{p.milestone.split('(')[1]?.replace(')', '') || p.milestone}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(p.amount)}</p>
                <p style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>{p.status === 'Paid' ? formatDate(p.date) : 'Pending'}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ══ SECTION 3: DETAIL CONTENT (Sales stage OR Project phase) ══ */}
      {activeItem.type === 'sale' ? (
        <SalesStageContent
          stageId={activeItem.id}
          estimation={estimation}
          quotation={quotation}
          payment={payment}
          contract={contract}
        />
      ) : project ? (
        <CombinedPhaseContent
          phase={selectedPhase}
          project={project}
          canEdit={canEdit}
          user={user}
          phaseIdx={selectedPhaseIdx}
          currentPhaseIdx={currentPhaseIdx}
        />
      ) : (
        <Card style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)' }}>
          {isConverted ? (
            <>
              <Zap size={28} style={{ color: '#34D399', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}>Project not set up yet</p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>Contract signed. Project lifecycle will appear once CRM Head creates the project.</p>
            </>
          ) : (
            <>
              <Wrench size={28} style={{ color: 'var(--text-dim)', margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}>No Project Yet</p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>Project lifecycle appears after lead conversion.</p>
            </>
          )}
        </Card>
      )}

      {/* ══ SECTION 4: PHASE SELECTOR for non-converted (plain 7-phase stepper) ══ */}
      {!isConverted && project && (
        <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ display: 'flex', overflowX: 'auto', background: 'var(--bg-main)' }}>
            {projectPhases.map((phase, idx) => {
              const status = getPhaseStatus(idx);
              const isSelected = phase.name === selectedPhase;
              const PIcon = phaseIconsMap[phase.name] || Wrench;
              return (
                <button key={phase.id} onClick={() => setActivePhase(phase.name)} style={{
                  flex: '1 0 auto', minWidth: 120, padding: '12px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  background: isSelected ? `${phase.color}15` : 'transparent',
                  borderBottom: isSelected ? `3px solid ${phase.color}` : '3px solid transparent',
                  border: 'none', borderLeft: idx > 0 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'inherit',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: status === 'completed' ? `${phase.color}25` : status === 'active' ? phase.color : 'var(--bg-card)', border: `2px solid ${status === 'upcoming' ? 'var(--border)' : phase.color}` }}>
                    {status === 'completed' ? <CheckCircle size={13} style={{ color: phase.color }} /> : <PIcon size={11} style={{ color: status === 'active' ? '#080a0f' : 'var(--text-dim)' }} />}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', color: isSelected ? phase.color : status === 'completed' ? phase.color : status === 'active' ? 'white' : 'var(--text-dim)' }}>{phase.name}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Edit permission badge */}
      {project && !canEdit && (
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.18)', borderRadius: 'var(--radius-md)', marginTop: 4 }}>
          <AlertCircle size={12} style={{ color: '#FBBF24' }} />
          <span style={{ fontSize: 11, color: '#FBBF24' }}>View only — editing requires {(phaseEditRolesMap[selectedPhase] || []).join(' or ')} role.</span>
        </div>
      )}
    </div>
  );
};

/* ── SALES STAGE DETAIL CONTENT ── */
const SalesStageContent = ({ stageId, estimation, quotation, payment, contract }) => {
  const formatCurrency = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${(n || 0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

  const stageMap = {
    estimation: { color: '#A88944', label: 'Estimation', icon: Hash, data: estimation },
    quotation: { color: '#D4A853', label: 'Quotation', icon: FileText, data: quotation },
    payment: { color: '#F59E0B', label: 'Payment Collection', icon: CreditCard, data: payment },
    contract: { color: '#FBBF24', label: 'Contract', icon: PenTool, data: contract },
  };
  const { color, label, icon: SIcon, data } = stageMap[stageId] || {};

  if (!data) {
    return (
      <Card style={{ padding: 32, textAlign: 'center', borderLeft: `3px solid ${color}`, border: `1px dashed ${color}40` }}>
        <SIcon size={28} style={{ color, margin: '0 auto 10px', opacity: 0.4 }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>No {label} Record</p>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>This stage has not been completed yet for this lead.</p>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${color}18`, border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SIcon size={18} style={{ color }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{label}</h3>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-main)' }}>{data.id}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: `${color}20`, color, border: `1px solid ${color}30` }}>
                {data.status?.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              {data.project} · {data.config}
              {data.area && ` · ${data.area} sqft`}
            </p>
          </div>
        </div>
      </div>

      {/* ── ESTIMATION ── */}
      {stageId === 'estimation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Approvals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { role: 'Created By', person: data.createdBy, color: '#60A5FA' },
              { role: 'Verified By', person: data.verifiedBy, color: '#34D399' },
              { role: 'Authorized By', person: data.authorizedBy, color: color },
            ].map(({ role, person, color: c }) => (
              <div key={role} style={{ padding: '10px 12px', background: person ? `${c}08` : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${person ? `${c}25` : 'var(--border)'}` }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>{role}</p>
                {person ? (
                  <>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{person.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>{person.role}</p>
                    <p style={{ fontSize: 10, color: c }}>{formatDate(person.date)}</p>
                  </>
                ) : (
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>Pending</p>
                )}
              </div>
            ))}
          </div>

          {/* Line items table */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Scope of Work</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 100px', gap: 8, padding: '6px 12px', background: 'var(--bg-main)', fontSize: 9, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                <span>Category / Description</span><span style={{ textAlign: 'right' }}>Qty</span><span style={{ textAlign: 'right' }}>Rate</span><span style={{ textAlign: 'right' }}>Amount</span>
              </div>
              {(data.items || []).map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 100px', gap: 8, padding: '8px 12px', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{item.category}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 1 }}>{item.description}</p>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', paddingTop: 2 }}>{item.qty}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', paddingTop: 2 }}>₹{(item.rate / 1000).toFixed(0)}K</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', paddingTop: 2 }}>₹{(item.amount / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              {[
                { label: 'Subtotal', value: formatCurrency(data.totalAmount) },
                { label: `Discount (${data.discountPercent}%)`, value: `-₹${((data.totalAmount - data.finalAmount) / 100000).toFixed(2)}L`, dim: true },
                { label: 'After Discount', value: formatCurrency(data.finalAmount) },
                { label: 'GST (18%)', value: formatCurrency(data.gst), dim: true },
              ].map(({ label: l, value: v, dim }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-dim)' }}>{l}</span>
                  <span style={{ fontWeight: 600, color: dim ? 'var(--text-dim)' : 'var(--text-main)' }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Grand Total</span>
                <span style={{ fontSize: 14, fontWeight: 800, color }}>{formatCurrency(data.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Sharing & notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
            <div style={{ padding: 12, background: data.sharedWithCustomer ? 'rgba(52,211,153,0.06)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${data.sharedWithCustomer ? 'rgba(52,211,153,0.2)' : 'var(--border)'}` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Shared With Customer</p>
              <p style={{ fontWeight: 600, color: data.sharedWithCustomer ? '#34D399' : '#F87171' }}>{data.sharedWithCustomer ? `Yes via ${data.sharedVia}` : 'Not yet shared'}</p>
              {data.sharedDate && <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{formatDate(data.sharedDate)} · {formatTime(data.sharedDate)}</p>}
            </div>
            <div style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Valid Until</p>
              <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatDate(data.validUntil)}</p>
              {data.notes && <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, fontStyle: 'italic' }}>{data.notes}</p>}
            </div>
          </div>

          {/* Revision history */}
          {data.revisionHistory?.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Revision History</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.revisionHistory.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 6, padding: '2px 6px', flexShrink: 0, marginTop: 1 }}>{r.version}</span>
                    <div><p style={{ fontSize: 12, color: 'var(--text-main)' }}>{r.note}</p><p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{r.changedBy} · {formatDate(r.date)}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── QUOTATION ── */}
      {stageId === 'quotation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Key info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { label: 'Linked Estimation', value: data.estimationId },
              { label: 'Grand Total', value: formatCurrency(data.grandTotal), highlight: true },
              { label: 'Status', value: data.status, ok: data.status === 'Customer Accepted' ? true : data.status === 'Customer Rejected' ? false : null },
              { label: 'Valid Until', value: formatDate(data.validUntil) },
              { label: 'Sent Via', value: data.sentVia || '—' },
              { label: 'Sent Date', value: data.sentDate ? `${formatDate(data.sentDate)} ${formatTime(data.sentDate)}` : '—' },
            ].map(({ label: l, value: v, ok, highlight }) => (
              <div key={l} style={{ padding: '10px 12px', background: ok === true ? 'rgba(52,211,153,0.06)' : ok === false ? 'rgba(248,113,113,0.06)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${ok === true ? 'rgba(52,211,153,0.2)' : ok === false ? 'rgba(248,113,113,0.2)' : 'var(--border)'}` }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 3 }}>{l}</p>
                <p style={{ fontSize: highlight ? 16 : 13, fontWeight: highlight ? 800 : 600, color: ok === true ? '#34D399' : ok === false ? '#F87171' : highlight ? color : 'var(--text-main)' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Payment terms */}
          <div style={{ padding: 14, background: `${color}06`, borderRadius: 'var(--radius-md)', border: `1px solid ${color}20` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>Payment Terms</p>
            <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6 }}>{data.paymentTerms}</p>
          </div>

          {/* Signature */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: 12, background: data.digitalSignature?.signed ? 'rgba(52,211,153,0.06)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${data.digitalSignature?.signed ? 'rgba(52,211,153,0.2)' : 'var(--border)'}` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Digital Signature</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: data.digitalSignature?.signed ? '#34D399' : '#F87171' }}>{data.digitalSignature?.signed ? `Signed by ${data.digitalSignature.signedBy}` : 'Not Signed'}</p>
              {data.digitalSignature?.signedDate && <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{formatDate(data.digitalSignature.signedDate)}</p>}
            </div>

            {/* Customer response */}
            {data.customerResponse && (
              <div style={{ padding: 12, background: data.customerResponse.accepted ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: `1px solid ${data.customerResponse.accepted ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Customer Response</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: data.customerResponse.accepted ? '#34D399' : '#F87171' }}>{data.customerResponse.accepted ? 'Accepted' : 'Rejected'} · {data.customerResponse.responseMode}</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{formatDate(data.customerResponse.responseDate)}</p>
                {data.customerResponse.remarks && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>"{data.customerResponse.remarks}"</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PAYMENT ── */}
      {stageId === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Amount highlight */}
          <div style={{ padding: 20, background: `${color}08`, borderRadius: 'var(--radius-md)', border: `1px solid ${color}25`, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>Amount Collected</p>
            <p style={{ fontSize: 28, fontWeight: 800, color }}>{formatCurrency(data.amount)}</p>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{data.paymentMode} · {formatDate(data.collectionDate)} · {formatTime(data.collectionDate)}</p>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { label: 'Collected By', value: `${data.collectedBy?.name} (${data.collectedBy?.role})` },
              { label: 'Payment Mode', value: data.paymentMode },
              { label: 'PAN Number', value: data.panNumber, ok: data.panVerified },
              { label: 'PAN Verified', value: data.panVerified ? 'Yes' : 'Pending', ok: data.panVerified },
              { label: 'Linked Quotation', value: data.quotationId },
              { label: 'Status', value: data.status, ok: data.status === 'Verified by Accounts' || data.status === 'Collected' ? true : null },
            ].map(({ label: l, value: v, ok }) => (
              <div key={l} style={{ padding: '10px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 3 }}>{l}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: ok === true ? '#34D399' : ok === false ? '#F87171' : 'var(--text-main)' }}>{v}</p>
              </div>
            ))}
          </div>

          {data.remarks && (
            <div style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Remarks</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>{data.remarks}</p>
            </div>
          )}

          {/* Account team receipt */}
          {data.accountTeamReceipt && (
            <div style={{ padding: 14, background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', marginBottom: 8 }}>Accounts Team Receipt</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <div><p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Receipt No</p><p style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>{data.accountTeamReceipt.receiptNo}</p></div>
                <div><p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Uploaded By</p><p style={{ fontSize: 12, color: 'var(--text-main)' }}>{data.accountTeamReceipt.uploadedBy}</p></div>
                <div><p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Upload Date</p><p style={{ fontSize: 12, color: 'var(--text-main)' }}>{formatDate(data.accountTeamReceipt.uploadDate)}</p></div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}><span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={13} /> Receipt Available</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CONTRACT ── */}
      {stageId === 'contract' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Contract value + timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ padding: '14px 16px', background: `${color}10`, borderRadius: 'var(--radius-md)', border: `1px solid ${color}25`, textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Contract Value</p>
              <p style={{ fontSize: 18, fontWeight: 800, color }}>{formatCurrency(data.contractValue)}</p>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Start Date</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{formatDate(data.startDate)}</p>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Est. Completion</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{formatDate(data.estimatedCompletion)}</p>
            </div>
          </div>

          {/* Approvals trail */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { role: 'Entered By', person: data.enteredBy, color: '#60A5FA' },
              { role: 'Validated By SM', person: data.validatedBy, color: '#34D399' },
              { role: 'Confirmed By RM', person: data.confirmedBy, color },
            ].map(({ role, person, color: c }) => (
              <div key={role} style={{ padding: '10px 12px', background: `${c}08`, borderRadius: 'var(--radius-md)', border: `1px solid ${c}25` }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>{role}</p>
                {person ? (
                  <>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{person.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>{person.role}</p>
                    <p style={{ fontSize: 10, color: c, marginTop: 2 }}>{formatDate(person.date)}</p>
                  </>
                ) : (
                  <p style={{ fontSize: 12, color: '#F87171', fontStyle: 'italic' }}>Pending</p>
                )}
              </div>
            ))}
          </div>

          {/* Payment schedule */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Payment Schedule</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(data.paymentSchedule || []).map((ps, i) => (
                <div key={i} style={{ padding: '10px 14px', background: ps.status === 'Paid' ? 'rgba(52,211,153,0.06)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${ps.status === 'Paid' ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {ps.status === 'Paid' ? <CheckCircle size={14} style={{ color: '#34D399' }} /> : <Clock size={14} style={{ color: 'var(--text-dim)' }} />}
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{ps.milestone}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>Due: {formatDate(ps.dueDate)}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: ps.status === 'Paid' ? '#34D399' : color }}>{formatCurrency(ps.amount)}</p>
                    <p style={{ fontSize: 9, fontWeight: 700, color: ps.status === 'Paid' ? '#34D399' : 'var(--text-dim)', textTransform: 'uppercase' }}>{ps.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

/* ── Phase content renderer for CombinedJourneyTab ── */
const CombinedPhaseContent = ({ phase, project, canEdit, user, phaseIdx, currentPhaseIdx }) => {
  const phaseData = projectPhases.find(p => p.name === phase);
  const color = phaseData?.color || '#9CA3AF';
  const status = phaseIdx < currentPhaseIdx ? 'completed' : phaseIdx === currentPhaseIdx ? 'active' : 'upcoming';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  const phaseHistory = project.phaseHistory?.find(h => h.phase === phase);

  return (
    <Card style={{ padding: 20, borderLeft: `3px solid ${color}`, background: status === 'active' ? `${color}04` : 'var(--bg-card)' }}>
      {/* Phase header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${color}18`, border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.createElement(phaseIconsMap[phase] || Wrench, { size: 18, style: { color } })}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{phase}</h3>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 10, background: status === 'active' ? `${color}20` : status === 'completed' ? 'rgba(52,211,153,0.12)' : 'var(--bg-main)', color: status === 'active' ? color : status === 'completed' ? '#34D399' : 'var(--text-dim)', border: `1px solid ${status === 'active' ? `${color}30` : status === 'completed' ? 'rgba(52,211,153,0.2)' : 'var(--border)'}` }}>
                {status === 'active' ? 'ACTIVE' : status === 'completed' ? 'DONE' : 'UPCOMING'}
              </span>
            </div>
            {phaseHistory && (
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                {formatDate(phaseHistory.startDate)}{phaseHistory.endDate ? ` → ${formatDate(phaseHistory.endDate)}` : ' · Ongoing'}
                {phaseHistory.completedBy && ` · by ${phaseHistory.completedBy}`}
              </p>
            )}
          </div>
        </div>
        {status === 'upcoming' && <span style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic' }}>Not started</span>}
      </div>

      {/* Phase-specific content */}
      {phase === 'Onboarding' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PhaseInfoRow label="Payment Status" value={project.onboardingPayment?.status || 'Pending'} ok={project.onboardingPayment?.status === 'Paid'} />
          <PhaseInfoRow label="Amount" value={project.onboardingPayment ? `₹${(project.onboardingPayment.amount / 100000).toFixed(1)}L (${project.onboardingPayment.percentage}%)` : '—'} />
          <PhaseInfoRow label="Payment Mode" value={project.onboardingPayment?.mode || '—'} />
          <PhaseInfoRow label="SAP Validated" value={project.onboardingPayment?.sapValidated ? `Yes · ${project.onboardingPayment.sapRef}` : 'No'} ok={project.onboardingPayment?.sapValidated} />
          {canEdit && <Button variant="primary" size="sm" style={{ gridColumn: '1 / -1', marginTop: 4 }}><CheckCircle size={12} style={{ marginRight: 6 }} /> Mark Onboarding Complete</Button>}
        </div>
      )}

      {phase === 'Design Phase' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {project.designManager && (
            <div style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={15} style={{ color }} /></div>
              <div><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{project.designManager.name}</p><p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Design Manager · Assigned {formatDate(project.designManager.assignedDate)}</p></div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Design Versions</p>
            {(project.designs || []).map(d => (
              <div key={d.id} style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{d.name}</p><p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{d.version} · {d.costing >= 100000 ? `₹${(d.costing / 100000).toFixed(1)}L` : `₹${d.costing.toLocaleString()}`} · {formatDate(d.createdDate)}</p></div>
                <Badge variant={d.status === 'Approved' ? 'success' : d.status === 'Revised' ? 'warm' : 'nurture'} style={{ fontSize: 9 }}>{d.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'Design Sign-off' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PhaseInfoRow label="Design Signed Off" value={project.designSignedOff ? 'Yes' : 'No'} ok={project.designSignedOff} />
          <PhaseInfoRow label="Sign-off Date" value={formatDate(project.designSignOffDate)} />
          <PhaseInfoRow label="Signed By" value={project.designSignedBy || '—'} />
          <PhaseInfoRow label="50% Payment" value={project.designPayment?.status || 'Pending'} ok={project.designPayment?.status === 'Paid'} />
          {!project.designSignedOff && canEdit && (
            <div style={{ gridColumn: '1 / -1', padding: 10, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.15)' }}>
              <p style={{ fontSize: 12, color: '#F87171', display: 'flex', alignItems: 'center', gap: 6 }}><AlertCircle size={12} /> Do NOT move to production until design is signed AND 50% payment collected.</p>
            </div>
          )}
        </div>
      )}

      {phase === 'Production Phase' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(project.productionManagers || []).map(pm => (
            <div key={pm.id} style={{ padding: 14, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={15} style={{ color }} /></div>
                  <div><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{pm.name}</p><p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Scope: {pm.scope}</p></div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color }}>{pm.progress}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pm.progress}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, borderRadius: 3, transition: 'width 0.4s' }} /></div>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Production Notes</p>
            {(project.productionNotes || []).map((note, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-main)' }}>{note.note}</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{note.by} · {formatDate(note.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'QC & Dispatch' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PhaseInfoRow label="QC Manager" value={project.qcManager?.name || 'Not Assigned'} />
          <PhaseInfoRow label="Dispatch Date" value={project.dispatchDate ? formatDate(project.dispatchDate) : 'Not Scheduled'} />
          {canEdit && !project.qcManager && <Button variant="primary" size="sm" style={{ gridColumn: '1 / -1', marginTop: 4 }}><User size={12} style={{ marginRight: 6 }} /> Assign QC Manager</Button>}
        </div>
      )}

      {phase === 'Installation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhaseInfoRow label="Project Manager" value={project.projectManager?.name || 'Not Assigned'} />
            <PhaseInfoRow label="Progress" value={`${project.installationProgress || 0}%`} />
          </div>
          {(project.installationProgress || 0) > 0 && (
            <div style={{ height: 8, background: 'var(--bg-main)', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: `${project.installationProgress}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, borderRadius: 4 }} /></div>
          )}
        </div>
      )}

      {phase === 'Handover' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhaseInfoRow label="Handover Status" value={project.handoverCompleted ? 'Completed' : 'Pending'} ok={project.handoverCompleted} />
            <PhaseInfoRow label="OTP Verified" value={project.handoverOtp ? 'Yes' : 'Not Yet'} ok={!!project.handoverOtp} />
            <PhaseInfoRow label="Handover Date" value={formatDate(project.handoverDate)} />
            <PhaseInfoRow label="10% Payment" value={(project.payments || []).find(p => p.milestone.includes('Handover'))?.status || 'Pending'} ok={(project.payments || []).find(p => p.milestone.includes('Handover'))?.status === 'Paid'} />
          </div>
          {project.handoverCompleted ? (
            <div style={{ padding: 16, background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.2)', textAlign: 'center' }}>
              <CheckCircle size={28} style={{ color: '#34D399', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: '#34D399' }}>Project Handed Over ✓</p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Congratulations! Project successfully delivered.</p>
            </div>
          ) : canEdit && (
            <Button variant="primary" size="sm"><CheckCircle size={12} style={{ marginRight: 6 }} /> Send Handover OTP</Button>
          )}
        </div>
      )}
    </Card>
  );
};

const PhaseInfoRow = ({ label, value, ok }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: ok === true ? '#34D399' : ok === false ? '#F87171' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
      {ok === true && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', flexShrink: 0 }} />}
      {ok === false && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F87171', flexShrink: 0 }} />}
      {value}
    </span>
  </div>
);


const SALES_STAGES_LD = [
  { id: 'estimation', name: 'Estimation', shortName: 'EST', icon: Hash, color: '#A88944' },
  { id: 'quotation', name: 'Quotation', shortName: 'QTN', icon: FileText, color: '#D4A853' },
  { id: 'payment', name: 'Payment', shortName: 'PAY', icon: CreditCard, color: '#F59E0B' },
  { id: 'contract', name: 'Contract', shortName: 'CNT', icon: PenTool, color: '#FBBF24' },
];
const PROJECT_STAGES_LD = [
  { id: 'onboarding', name: 'Onboarding', shortName: 'ONB', icon: Users, color: '#34D399', phase: 'Onboarding' },
  { id: 'design', name: 'Design Phase', shortName: 'DSN', icon: Paintbrush, color: '#60A5FA', phase: 'Design Phase' },
  { id: 'signoff', name: 'Sign-Off', shortName: 'SGN', icon: PenTool, color: '#8B5CF6', phase: 'Design Sign-off' },
  { id: 'production', name: 'Production', shortName: 'PRD', icon: Factory, color: '#FBBF24', phase: 'Production Phase' },
  { id: 'qc', name: 'QC & Dispatch', shortName: 'QCD', icon: ClipboardCheck, color: '#EC4899', phase: 'QC & Dispatch' },
  { id: 'installation', name: 'Installation', shortName: 'INS', icon: Wrench, color: '#F97316', phase: 'Installation' },
  { id: 'handover', name: 'Handover', shortName: 'HND', icon: ShieldCheck, color: '#14B8A6', phase: 'Handover' },
];

const LeadUnifiedPipeline = ({ lead }) => {
  const estimation = mockEstimations.find(e => e.leadId === lead.id);
  const quotation = mockQuotations.find(q => q.leadId === lead.id);
  const payment = mockPayments.find(p => p.leadId === lead.id);
  const contract = mockContracts.find(c => c.leadId === lead.id);
  const project = mockProjects.find(p => p.leadId === lead.id);

  const formatCurrency = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n||0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';

  const currentPhaseIdx = project ? PROJECT_STAGES_LD.findIndex(s => s.phase === project.currentPhase) : -1;

  const salesStatus = (id) => ({ estimation: !!estimation, quotation: !!quotation, payment: !!payment, contract: !!contract }[id] ? 'completed' : 'pending');
  const projStatus = (idx) => idx < currentPhaseIdx ? 'completed' : idx === currentPhaseIdx ? 'current' : 'pending';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Pipeline strip */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 4, padding: '8px 14px', background: 'rgba(168,137,68,0.08)', borderRight: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IndianRupee size={12} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sales (Pre-Conversion)</span>
          </div>
          <div style={{ flex: 7, padding: '8px 14px', background: 'rgba(52,211,153,0.04)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={12} style={{ color: '#34D399' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project (Post-Conversion)</span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {SALES_STAGES_LD.map((stage, idx) => {
            const status = salesStatus(stage.id);
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.id}>
                <div style={{ flex: 1, padding: '12px 6px', textAlign: 'center', background: status === 'completed' ? `${stage.color}10` : 'transparent', borderBottom: status === 'completed' ? `2px solid ${stage.color}50` : '2px solid transparent' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px', background: status === 'completed' ? `${stage.color}18` : 'var(--bg-main)', border: `2px solid ${status === 'completed' ? stage.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {status === 'completed' ? <CheckCircle size={13} style={{ color: stage.color }} /> : <Icon size={13} style={{ color: 'var(--text-dim)' }} />}
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: status === 'completed' ? stage.color : 'var(--text-dim)', textTransform: 'uppercase' }}>{stage.shortName}</p>
                </div>
                {idx === 3 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', background: 'rgba(52,211,153,0.1)', borderLeft: '1px solid rgba(52,211,153,0.3)', borderRight: '1px solid rgba(52,211,153,0.3)' }}>
                    <Zap size={12} style={{ color: '#34D399' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {PROJECT_STAGES_LD.map((stage, idx) => {
            const status = projStatus(idx);
            const Icon = stage.icon;
            return (
              <div key={stage.id} style={{ flex: 1, padding: '12px 4px', textAlign: 'center', background: status === 'current' ? `${stage.color}14` : status === 'completed' ? `${stage.color}08` : 'transparent', borderBottom: status !== 'pending' ? `2px solid ${stage.color}${status === 'current' ? '80' : '40'}` : '2px solid transparent', position: 'relative' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px', background: status !== 'pending' ? `${stage.color}18` : 'var(--bg-main)', border: `2px solid ${status !== 'pending' ? stage.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: status === 'current' ? `0 2px 10px ${stage.color}40` : 'none' }}>
                  {status === 'completed' ? <CheckCircle size={13} style={{ color: stage.color }} /> : status === 'current' ? <Icon size={13} style={{ color: stage.color }} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--border)' }} />}
                </div>
                <p style={{ fontSize: 9, fontWeight: 700, color: status !== 'pending' ? stage.color : 'var(--text-dim)', textTransform: 'uppercase' }}>{stage.shortName}</p>
                {status === 'current' && <p style={{ fontSize: 7, color: stage.color, fontWeight: 800, marginTop: 2 }}>ACTIVE</p>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {/* Sales Summary */}
        <Card style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 12 }}>Sales Journey Completed</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Estimation', data: estimation ? `${estimation.id} · ₹${(estimation.grandTotal||0).toLocaleString()}` : null },
              { label: 'Quotation', data: quotation ? `${quotation.id} · ${quotation.status}` : null },
              { label: 'Payment', data: payment ? `${payment.id} · ₹${(payment.amount||0).toLocaleString()}` : null },
              { label: 'Contract', data: contract ? `${contract.id} · ${formatCurrency(contract.contractValue)}` : null },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.data ? <CheckCircle size={12} style={{ color: '#34D399', flexShrink: 0 }} /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid var(--border)', flexShrink: 0 }} />}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: item.data ? 'var(--text-main)' : 'var(--text-dim)' }}>{item.label}</span>
                  {item.data && <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 1 }}>{item.data}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Payment Summary */}
        {project && (
          <Card style={{ padding: 16 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', marginBottom: 12 }}>Payment Milestones</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.payments?.map((pm, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {pm.status === 'Paid' ? <CheckCircle size={11} style={{ color: '#34D399' }} /> : <Clock size={11} style={{ color: 'var(--text-dim)' }} />}
                    <span style={{ fontSize: 11, color: pm.status === 'Paid' ? 'var(--text-main)' : 'var(--text-dim)' }}>{pm.milestone}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pm.status === 'Paid' ? '#34D399' : 'var(--text-dim)' }}>₹{(pm.amount/100000).toFixed(1)}L</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Total Paid</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>{formatCurrency(project.totalPaid)}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Phase history timeline */}
      {project && (
        <Card style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 14 }}>Phase Timeline</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {project.phaseHistory?.map((ph, idx) => {
              const stageInfo = PROJECT_STAGES_LD.find(s => s.phase === ph.phase);
              const color = stageInfo?.color || 'var(--primary)';
              return (
                <div key={idx} style={{ position: 'relative', paddingLeft: 24, paddingBottom: 16, borderLeft: idx < project.phaseHistory.length - 1 ? `2px solid ${color}40` : '2px solid transparent' }}>
                  <div style={{ position: 'absolute', left: -7, top: 2, width: 12, height: 12, borderRadius: '50%', background: ph.endDate ? color : `${color}80`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ph.endDate && <CheckCircle size={7} style={{ color: 'white' }} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{ph.phase}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>{formatDate(ph.startDate)}{ph.endDate ? ` → ${formatDate(ph.endDate)}` : ' · Ongoing'}</p>
                      {ph.completedBy && <p style={{ fontSize: 10, color: 'var(--text-dim)', fontStyle: 'italic' }}>by {ph.completedBy}</p>}
                    </div>
                    {!ph.endDate && <span style={{ fontSize: 9, fontWeight: 800, color: color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 8, padding: '2px 6px' }}>ACTIVE</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LeadDetail;
