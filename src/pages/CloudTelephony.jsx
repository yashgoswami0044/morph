import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneOff, PhoneMissed, Play, Pause,
  Clock, User, CheckCircle, XCircle, AlertTriangle, ArrowRight, Settings,
  MessageSquare, Star, Mic, MicOff, Volume2, VolumeX, Headphones, Smartphone,
  Zap, Radio, BarChart2
} from 'lucide-react';
import { teamMembers } from '../data/mockData.js';

const CloudTelephony = () => {
  const { leads, addCallLog, updateLead } = useLeads();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('outbound');
  const [dialPad, setDialPad] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ outcome: '', notes: '', rating: 0, nextAction: '' });
  const [callLanding, setCallLanding] = useState('smartflow'); // smartflow or phone

  // Call timer
  useEffect(() => {
    let interval;
    if (activeCall) interval = setInterval(() => setCallTimer(p => p + 1), 1000);
    else setCallTimer(0);
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Mock call logs
  const [callLogs] = useState([
    { id: 'CL001', type: 'outbound', leadName: 'Vijay Kumar', phone: '+91 98765 43210', duration: '03:42', outcome: 'Connected', agent: 'Rahul V', time: '2026-04-04T10:15:00', recording: true, feedback: 'Interested in 3BHK full interiors. Budget ₹25L. Follow-up Friday.' },
    { id: 'CL002', type: 'outbound', leadName: 'Priya Sharma', phone: '+91 87654 32109', duration: '01:20', outcome: 'No Answer', agent: 'Rahul V', time: '2026-04-04T09:45:00', recording: true, feedback: null },
    { id: 'CL003', type: 'inbound', leadName: 'Deepak Menon', phone: '+91 76543 21098', duration: '05:15', outcome: 'Connected', agent: 'Sneha G', time: '2026-04-04T09:30:00', recording: true, feedback: 'Returning call. Wants to reschedule site visit to next week.' },
    { id: 'CL004', type: 'outbound', leadName: 'Anjali Rao', phone: '+91 65432 10987', duration: '00:00', outcome: 'Busy', agent: 'Rahul V', time: '2026-04-04T09:00:00', recording: false, feedback: null },
    { id: 'CL005', type: 'inbound', leadName: 'Unknown', phone: '+91 54321 09876', duration: '02:10', outcome: 'Connected', agent: 'Deepak M', time: '2026-04-03T17:30:00', recording: true, feedback: 'New inquiry from Google Ads campaign. Created lead.' },
  ]);

  // Inbound routing rules
  const [routingRules] = useState([
    { id: 'R01', type: 'Campaign', name: 'Google Ads - Bangalore', did: '+91 80 4000 1234', routeTo: 'Pre-sales Bangalore team', sticky: false, active: true },
    { id: 'R02', type: 'Campaign', name: 'Meta Ads - Mumbai', did: '+91 22 4000 5678', routeTo: 'Pre-sales Mumbai team', sticky: false, active: true },
    { id: 'R03', type: 'Customer', name: 'Returning Customer', did: 'Any DID', routeTo: 'Last assigned executive', sticky: true, active: true },
    { id: 'R04', type: 'Customer', name: 'Existing Lead (Sticky)', did: 'Any DID', routeTo: 'Assigned executive (region-based)', sticky: true, active: true },
    { id: 'R05', type: 'Campaign', name: 'Website Chat - Pan India', did: '+91 80 4000 9999', routeTo: 'Round-robin pre-sales', sticky: false, active: true },
  ]);

  // Click to call
  const handleClickToCall = (lead) => {
    setActiveCall(lead);
    setCallTimer(0);
  };

  // End call + show feedback
  const handleEndCall = () => {
    setShowFeedback(true);
  };

  // Save feedback
  const handleSaveFeedback = () => {
    if (activeCall?.id) {
      addCallLog(activeCall.id, {
        date: new Date().toISOString(),
        duration: formatTime(callTimer),
        outcome: feedbackData.outcome || 'Connected',
        notes: feedbackData.notes,
        aiSummary: feedbackData.notes,
        rating: feedbackData.rating,
        callLanding,
      });
    }
    setActiveCall(null);
    setShowFeedback(false);
    setFeedbackData({ outcome: '', notes: '', rating: 0, nextAction: '' });
  };

  // Leads pending calls (for click-to-call)
  const pendingLeads = leads.filter(l => ['Untouched', 'Attempted', 'Validated'].includes(l.status)).slice(0, 10);

  // Call stats
  const todayCalls = callLogs.filter(c => new Date(c.time).toDateString() === new Date().toDateString());
  const connectedCalls = todayCalls.filter(c => c.outcome === 'Connected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Cloud Telephony</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Click-to-call, post-call feedback, inbound routing & call analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <button onClick={() => setCallLanding('smartflow')} style={{ ...landingBtnStyle, background: callLanding === 'smartflow' ? 'var(--primary)' : 'transparent', color: callLanding === 'smartflow' ? 'white' : 'var(--text-muted)' }}>
              <Headphones size={13} /> SmartFlow
            </button>
            <button onClick={() => setCallLanding('phone')} style={{ ...landingBtnStyle, background: callLanding === 'phone' ? 'var(--primary)' : 'transparent', color: callLanding === 'phone' ? 'white' : 'var(--text-muted)' }}>
              <Smartphone size={13} /> Phone Device
            </button>
          </div>
        </div>
      </div>

      {/* Active Call Banner */}
      {activeCall && !showFeedback && (
        <Card style={{ padding: 20, background: 'linear-gradient(135deg, rgba(52,211,153,0.08) 0%, rgba(96,165,250,0.08) 100%)', border: '1px solid rgba(52,211,153,0.3)', animation: 'pulse 2s infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid #34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={22} style={{ color: '#34D399' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{activeCall.name || 'Unknown'}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{activeCall.phone} · via {callLanding === 'smartflow' ? 'SmartFlow' : 'Phone Device'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#34D399', fontFamily: 'monospace' }}>{formatTime(callTimer)}</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Duration</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(248,113,113,0.15)', border: '2px solid #F87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEndCall}>
                  <PhoneOff size={20} style={{ color: '#F87171' }} />
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Post-Call Feedback Modal */}
      {showFeedback && (
        <Card style={{ padding: 24, border: '1px solid rgba(168,137,68,0.3)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Post-Call Feedback</h3>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 16 }}>Call with {activeCall?.name} · Duration: {formatTime(callTimer)}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Call Outcome</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Connected', 'No Answer', 'Busy', 'Wrong Number', 'Voicemail', 'Call Back Requested'].map(o => (
                  <button key={o} onClick={() => setFeedbackData(f => ({ ...f, outcome: o }))} style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500,
                    background: feedbackData.outcome === o ? 'var(--primary-bg)' : 'var(--bg-main)',
                    border: `1px solid ${feedbackData.outcome === o ? 'var(--primary)' : 'var(--border)'}`,
                    color: feedbackData.outcome === o ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer',
                  }}>{o}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Next Action</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Schedule Meeting', 'Follow-up Call', 'Send Catalogue', 'Send Estimation', 'No Action', 'Mark NQ'].map(a => (
                  <button key={a} onClick={() => setFeedbackData(f => ({ ...f, nextAction: a }))} style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500,
                    background: feedbackData.nextAction === a ? 'rgba(52,211,153,0.08)' : 'var(--bg-main)',
                    border: `1px solid ${feedbackData.nextAction === a ? '#34D399' : 'var(--border)'}`,
                    color: feedbackData.nextAction === a ? '#34D399' : 'var(--text-muted)', cursor: 'pointer',
                  }}>{a}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={labelStyle}>Call Notes</label>
            <textarea rows={3} value={feedbackData.notes} onChange={e => setFeedbackData(f => ({ ...f, notes: e.target.value }))} placeholder="Key takeaways, customer requirements, objections..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Call Quality Rating</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setFeedbackData(f => ({ ...f, rating: s }))} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: feedbackData.rating >= s ? 'var(--primary-bg)' : 'var(--bg-main)', border: `1px solid ${feedbackData.rating >= s ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={16} style={{ color: feedbackData.rating >= s ? 'var(--primary)' : 'var(--text-dim)', fill: feedbackData.rating >= s ? 'var(--primary)' : 'none' }} />
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" style={{ marginTop: 16 }} onClick={handleSaveFeedback}>
            <CheckCircle size={14} style={{ marginRight: 6 }} /> Save Feedback & Close Call
          </Button>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { key: 'outbound', label: 'Outbound Calls', icon: PhoneOutgoing },
          { key: 'inbound', label: 'Inbound Routing', icon: PhoneIncoming },
          { key: 'logs', label: 'Call Logs', icon: Clock },
          { key: 'config', label: 'Telephony Config', icon: Settings },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500,
            background: activeTab === t.key ? 'var(--primary)' : 'transparent',
            color: activeTab === t.key ? 'white' : 'var(--text-muted)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><t.icon size={14} /> {t.label}</button>
        ))}
      </div>

      {/* ── Outbound: Click to Call ── */}
      {activeTab === 'outbound' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Call Queue */}
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Click-to-Call Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingLeads.map(l => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{l.name}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{l.phone} · <Badge variant={l.status === 'Untouched' ? 'gray' : 'warm'} style={{ fontSize: 8 }}>{l.status}</Badge></p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleClickToCall(l)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Phone size={16} style={{ color: '#34D399' }} />
                    </button>
                    <button onClick={() => navigate(`/leads/${l.id}`)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <User size={16} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <StatCard label="Total Calls" value={callLogs.length} icon={Phone} color="#A88944" />
              <StatCard label="Connected" value={connectedCalls} icon={CheckCircle} color="#34D399" />
              <StatCard label="Outbound" value={callLogs.filter(c => c.type === 'outbound').length} icon={PhoneOutgoing} color="#60A5FA" />
              <StatCard label="Inbound" value={callLogs.filter(c => c.type === 'inbound').length} icon={PhoneIncoming} color="#FBBF24" />
            </div>
            <Card style={{ padding: 16 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10 }}>Call Landing Mode</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, padding: 14, background: callLanding === 'smartflow' ? 'rgba(168,137,68,0.08)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${callLanding === 'smartflow' ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer' }} onClick={() => setCallLanding('smartflow')}>
                  <Headphones size={22} style={{ color: callLanding === 'smartflow' ? 'var(--primary)' : 'var(--text-dim)', marginBottom: 6 }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>SmartFlow</p>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>Browser-based calling with CRM integration</p>
                </div>
                <div style={{ flex: 1, padding: 14, background: callLanding === 'phone' ? 'rgba(96,165,250,0.08)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${callLanding === 'phone' ? '#60A5FA' : 'var(--border)'}`, cursor: 'pointer' }} onClick={() => setCallLanding('phone')}>
                  <Smartphone size={22} style={{ color: callLanding === 'phone' ? '#60A5FA' : 'var(--text-dim)', marginBottom: 6 }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Phone Device</p>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>Call landing on registered mobile device</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Inbound Call Routing ── */}
      {activeTab === 'inbound' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ padding: 14, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p style={{ fontSize: 12, color: '#FBBF24' }}><Radio size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              <strong>Sticky Logic:</strong> Returning customers route to last assigned executive. New calls route via campaign or round-robin.</p>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Campaign Routing */}
            <Card>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Campaign Call Routing</h3>
              {routingRules.filter(r => r.type === 'Campaign').map(r => (
                <div key={r.id} style={{ padding: '12px 14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{r.name}</h4>
                    <Badge variant={r.active ? 'success' : 'gray'}>{r.active ? 'Active' : 'Off'}</Badge>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>DID: <span style={{ color: 'var(--primary-light)' }}>{r.did}</span></p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Route to: <span style={{ color: 'var(--text-muted)' }}>{r.routeTo}</span></p>
                </div>
              ))}
            </Card>

            {/* Customer Incoming */}
            <Card>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Customer Incoming Call Routing</h3>
              {routingRules.filter(r => r.type === 'Customer').map(r => (
                <div key={r.id} style={{ padding: '12px 14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{r.name}</h4>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.sticky && <Badge variant="nurture" style={{ fontSize: 8 }}>STICKY</Badge>}
                      <Badge variant={r.active ? 'success' : 'gray'}>{r.active ? 'Active' : 'Off'}</Badge>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>DID: <span style={{ color: 'var(--primary-light)' }}>{r.did}</span></p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Route to: <span style={{ color: 'var(--text-muted)' }}>{r.routeTo}</span></p>
                </div>
              ))}
              <Card style={{ padding: 12, marginTop: 8, background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
                <p style={{ fontSize: 11, color: '#60A5FA' }}><AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Sticky routing logic: Incoming calls from known numbers are matched to existing leads and routed to the assigned executive based on region.</p>
              </Card>
            </Card>
          </div>
        </div>
      )}

      {/* ── Call Logs ── */}
      {activeTab === 'logs' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Recent Call Logs</h3>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)' }}>
                {['Type', 'Lead', 'Phone', 'Duration', 'Outcome', 'Agent', 'Time', 'Feedback'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {callLogs.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    {c.type === 'outbound' ? <PhoneOutgoing size={14} style={{ color: '#60A5FA' }} /> : <PhoneIncoming size={14} style={{ color: '#34D399' }} />}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{c.leadName}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{c.phone}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.duration}</td>
                  <td style={{ padding: '10px 14px' }}><Badge variant={c.outcome === 'Connected' ? 'success' : c.outcome === 'No Answer' ? 'warm' : 'gray'}>{c.outcome}</Badge></td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{c.agent}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-dim)' }}>{new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: c.feedback ? '#34D399' : 'var(--text-dim)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.feedback || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── Config ── */}
      {activeTab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Telephony Provider</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Provider', value: 'Cloud Telephony (Knowlarity / Exotel)' },
                { label: 'Trunk Type', value: 'SIP Trunk + PSTN Failover' },
                { label: 'Recording', value: 'All calls recorded (retained 90 days)' },
                { label: 'IVR', value: 'Configured for pre-sales routing' },
                { label: 'Call Masking', value: 'Enabled (customer sees DID number)' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{value}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Call Landing Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'SmartFlow (Browser)', value: 'WebRTC-based calling with screen pop. CRM auto-loads lead details on incoming call.' },
                { label: 'Phone Device', value: 'Call lands on registered mobile number. Agent logs feedback manually in CRM after call.' },
                { label: 'Agent Availability', value: 'Auto-detected. If SmartFlow offline, falls back to phone device.' },
                { label: 'Cloudtelephony Scope', value: 'Pre-sales only (per spec). Sales team uses direct calling.' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(52,211,153,0.3); } 70% { box-shadow: 0 0 0 12px rgba(52,211,153,0); } 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); } }`}</style>
    </div>
  );
};

const landingBtnStyle = { padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', transition: 'all 0.2s' };
const inputStyle = { width: '100%', padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 13, outline: 'none', lineHeight: 1.5 };
const labelStyle = { fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' };

const StatCard = ({ label, value, icon: Icon, color }) => (
  <Card style={{ padding: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</p>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginTop: 4 }}>{value}</h3>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: `${color}12`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  </Card>
);

export default CloudTelephony;
