import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Phone, MapPin, Clock, CheckCircle, XCircle, AlertTriangle,
  Send, Eye, Users, ShieldCheck, Smartphone, MessageSquare, ChevronRight,
  Calendar, AlertOctagon, Lock, Unlock, Building, UserCheck, ExternalLink, Copy
} from 'lucide-react';
import { mockSiteVisits, channelPartners, projects, teamMembers, siteVisitStatuses, collisionRules } from '../data/mockData.js';

const SiteVisitManager = () => {
  const { user } = useAuth();
  const { leads, transitionStatus } = useLeads();
  const navigate = useNavigate();
  const [visits, setVisits] = useState(mockSiteVisits);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showOtpModal, setShowOtpModal] = useState(null);
  const [showQrModal, setShowQrModal] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [showNewVisit, setShowNewVisit] = useState(false);
  const [remarkInput, setRemarkInput] = useState('');
  const [showRemark, setShowRemark] = useState(null);

  const upcoming = visits.filter(v => v.status === 'Scheduled');
  const completed = visits.filter(v => v.status === 'Completed');
  const noShows = visits.filter(v => v.status === 'Customer No-Show' || v.status === 'Sales Rep No-Show');

  // ── OTP VERIFICATION (CP flow) ──
  const handleSendOtp = (visitId) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, otpCode: code, otpSentAt: new Date().toISOString() } : v));
    setShowOtpModal(visitId);
    setOtpInput('');
  };

  const handleVerifyOtp = (visitId) => {
    const visit = visits.find(v => v.id === visitId);
    if (visit && otpInput === visit.otpCode) {
      setVisits(prev => prev.map(v => v.id === visitId ? {
        ...v, otpVerified: true, status: 'OTP Verified',
        smsContent: `Thank you for visiting, registered with ${v.channelPartner?.name || 'Morph Interiors'}. For queries, contact CRM: +91 98765 00020`
      } : v));
      setShowOtpModal(null);
    }
  };

  // ── QR CODE SCAN (Meeting Scheduled → Meeting Done) ──
  const handleQrScan = (visitId) => {
    setVisits(prev => prev.map(v => v.id === visitId ? {
      ...v, qrScanned: true, qrScannedAt: new Date().toISOString(), qrScannedBy: user?.name || 'Sales Manager',
      status: 'Completed', meetingDoneAt: new Date().toISOString(),
    } : v));
    const visit = visits.find(v => v.id === visitId);
    if (visit) {
      transitionStatus(visit.leadId, 'Meeting Done', user?.name || 'Sales Manager');
    }
    setShowQrModal(null);
  };

  // ── NO-SHOW HANDLING ──
  const handleCustomerNoShow = (visitId) => {
    setVisits(prev => prev.map(v => v.id === visitId ? {
      ...v, status: 'Customer No-Show', customerNoShow: true,
    } : v));
    // Lead remains in Presales bucket — no status change
  };

  const handleSalesRepNoShow = (visitId) => {
    setVisits(prev => prev.map(v => v.id === visitId ? {
      ...v, status: 'Sales Rep No-Show', salesRepNoShow: true,
    } : v));
    // Auto-escalate to Regional Manager
    const visit = visits.find(v => v.id === visitId);
    if (visit) {
      const rm = teamMembers.find(t => t.role === 'Regional Manager');
      if (rm) {
        // Notification happens through context
      }
    }
  };

  // ── LOCK REMARKS ──
  const handleLockRemarks = (visitId) => {
    setVisits(prev => prev.map(v => v.id === visitId ? {
      ...v, visitRemarks: remarkInput || v.visitRemarks, remarksLocked: true,
    } : v));
    setShowRemark(null);
    setRemarkInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Site Visit Management</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>QR scan check-in, OTP verification for CP leads, no-show tracking & escalation.</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewVisit(!showNewVisit)}>
          <Calendar size={16} style={{ marginRight: 6 }} /> Schedule Visit
        </Button>
      </div>

      {/* Protocol Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <InfoCard icon={QrCode} color="#A88944" title="QR Check-in" desc="Sales Manager scans QR at site → moves to Meeting Done" />
        <InfoCard icon={ShieldCheck} color="#34D399" title="CP OTP Lock" desc="Customer validates via OTP → CP locked with SMS confirmation" />
        <InfoCard icon={AlertOctagon} color="#F87171" title="No-Show Rules" desc="Customer no-show → back to presales. Rep no-show → escalate RM" />
        <InfoCard icon={MessageSquare} color="#60A5FA" title="SMS to Customer" desc="Meeting scheduled → SMS with CRM contact for escalation" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
          { key: 'completed', label: `Completed (${completed.length})` },
          { key: 'noshow', label: `No-Shows (${noShows.length})` },
          { key: 'collision', label: 'Collision Rules' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500,
            background: activeTab === t.key ? 'var(--primary)' : 'transparent',
            color: activeTab === t.key ? 'white' : 'var(--text-muted)', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── UPCOMING VISITS ── */}
      {activeTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {upcoming.length === 0 && <EmptyState text="No upcoming site visits" />}
          {upcoming.map(visit => (
            <VisitCard key={visit.id} visit={visit}
              onQrScan={() => setShowQrModal(visit.id)}
              onSendOtp={() => handleSendOtp(visit.id)}
              onCustomerNoShow={() => handleCustomerNoShow(visit.id)}
              onSalesRepNoShow={() => handleSalesRepNoShow(visit.id)}
              onViewLead={() => navigate(`/leads/${visit.leadId}`)}
              onAddRemark={() => { setShowRemark(visit.id); setRemarkInput(visit.visitRemarks); }}
            />
          ))}
        </div>
      )}

      {/* ── COMPLETED VISITS ── */}
      {activeTab === 'completed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {completed.length === 0 && <EmptyState text="No completed visits yet" />}
          {completed.map(visit => (
            <Card key={visit.id} style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(52,211,153,0.2)' }}>
              <div style={{ padding: '16px 20px', background: 'rgba(52,211,153,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <CheckCircle size={20} style={{ color: '#34D399' }} />
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{visit.leadName}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{visit.visitProject} · {visit.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {visit.channelPartner && <Badge variant="nurture" style={{ fontSize: 10 }}>CP: {visit.channelPartner.name}</Badge>}
                  {visit.otpVerified && <Badge variant="success" style={{ fontSize: 10 }}><ShieldCheck size={10} style={{ marginRight: 3 }} /> OTP Verified</Badge>}
                  {visit.qrScanned && <Badge variant="success" style={{ fontSize: 10 }}><QrCode size={10} style={{ marginRight: 3 }} /> QR Scanned</Badge>}
                </div>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', gap: 24 }}>
                <MiniInfo label="Date" value={new Date(visit.scheduledDate).toLocaleDateString()} />
                <MiniInfo label="Done At" value={visit.meetingDoneAt ? new Date(visit.meetingDoneAt).toLocaleTimeString() : '-'} />
                <MiniInfo label="QR By" value={visit.qrScannedBy || '-'} />
                <MiniInfo label="Attendees" value={(visit.attendees || []).join(', ')} />
              </div>
              {visit.visitRemarks && (
                <div style={{ padding: '10px 20px', background: 'var(--bg-main)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={12} style={{ color: 'var(--text-dim)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{visit.visitRemarks}"</span>
                  {visit.remarksLocked && <Badge variant="gray" style={{ fontSize: 9, marginLeft: 'auto' }}>LOCKED</Badge>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── NO-SHOWS ── */}
      {activeTab === 'noshow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {noShows.length === 0 && <EmptyState text="No no-shows recorded" />}
          {noShows.map(visit => (
            <Card key={visit.id} style={{ padding: 20, border: `1px solid ${visit.customerNoShow ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {visit.customerNoShow ?
                    <AlertTriangle size={20} style={{ color: '#FBBF24' }} /> :
                    <AlertOctagon size={20} style={{ color: '#F87171' }} />
                  }
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{visit.leadName}</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      {visit.customerNoShow ? '👤 Customer No-Show — Lead stays in Presales bucket' : '⚠ Sales Rep No-Show — Auto-escalated to Regional Manager'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${visit.leadId}`)}>View Lead</Button>
                  {visit.salesRepNoShow && <Badge variant="hot">ESCALATED</Badge>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── COLLISION RULES ── */}
      {activeTab === 'collision' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>CP Collision Rules (Internal vs. Channel Partner)</h3>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>A CP lead is only "locked" to a partner if the customer validates via OTP during the site visit.</p>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {collisionRules.map(rule => (
              <div key={rule.id} style={{ padding: 16, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Badge variant={rule.priority === 'High' ? 'hot' : 'warm'}>{rule.priority}</Badge>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{rule.scenario}</h4>
                </div>
                <p style={{ fontSize: 13, color: 'var(--primary-light)' }}>Resolution: {rule.resolution}</p>
              </div>
            ))}
            <Card style={{ padding: 16, background: 'rgba(168,137,68,0.06)', border: '1px solid rgba(168,137,68,0.2)' }}>
              <p style={{ fontSize: 13, color: 'var(--primary-light)' }}>
                <strong>SMS Template (CP):</strong> "Thank you for visiting, registered with [CP Name]."<br />
                <strong>Contact:</strong> The contact number shown to customer will be of the CRM person, not the sales rep.
              </p>
            </Card>
          </div>
        </Card>
      )}

      {/* ── QR SCAN MODAL ── */}
      {showQrModal && (
        <Modal onClose={() => setShowQrModal(null)} title="QR Code Check-In">
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ width: 180, height: 180, background: 'white', borderRadius: 'var(--radius-lg)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
              <div style={{ width: '100%', height: '100%', border: '3px solid #000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <QrCode size={64} style={{ color: '#000' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 14px, #000 14px, #000 15px)', opacity: 0.15 }} />
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'white', fontWeight: 600, marginBottom: 8 }}>Scan QR Code at Site</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 24 }}>
              The Sales Manager scans this QR code using GRE app or Sales app to check in. This moves the lead from "Meeting Scheduled" → "Meeting Done".
            </p>
            <Button variant="primary" onClick={() => handleQrScan(showQrModal)} style={{ width: '100%' }}>
              <CheckCircle size={16} style={{ marginRight: 8 }} /> Confirm QR Scan (Simulate)
            </Button>
          </div>
        </Modal>
      )}

      {/* ── OTP MODAL ── */}
      {showOtpModal && (() => {
        const visit = visits.find(v => v.id === showOtpModal);
        return (
          <Modal onClose={() => setShowOtpModal(null)} title="OTP Verification — Channel Partner Lock">
            <div style={{ padding: 8 }}>
              <div style={{ padding: 14, background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: '#34D399' }}>
                  <ShieldCheck size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  OTP sent to customer's mobile. The lead will be "locked" to <strong>{visit?.channelPartner?.name}</strong> upon verification.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>OTP Code (Demo: {visit?.otpCode})</label>
                  <input value={otpInput} onChange={e => setOtpInput(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6}
                    style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 20, textAlign: 'center', letterSpacing: 8, fontWeight: 700 }} />
                </div>
                <Button variant="primary" onClick={() => handleVerifyOtp(showOtpModal)} disabled={otpInput.length !== 6}>
                  <ShieldCheck size={16} style={{ marginRight: 6 }} /> Verify & Lock to CP
                </Button>
                <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-dim)' }}>
                  SMS will be sent: "Thank you for visiting, registered with {visit?.channelPartner?.name}."
                </p>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* ── REMARK MODAL ── */}
      {showRemark && (
        <Modal onClose={() => setShowRemark(null)} title="Site Visit Remarks">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 10, background: 'rgba(251,191,36,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <p style={{ fontSize: 12, color: '#FBBF24' }}>
                <Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Once locked, remarks are visible to Pre-sales but cannot be edited.
              </p>
            </div>
            <textarea value={remarkInput} onChange={e => setRemarkInput(e.target.value)} rows={4} placeholder="e.g. Customer not visited site / Both spouses attended..."
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13, resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="primary" onClick={() => handleLockRemarks(showRemark)} style={{ flex: 1 }}>
                <Lock size={14} style={{ marginRight: 6 }} /> Save & Lock Remarks
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── COMPONENTS ── */

const VisitCard = ({ visit, onQrScan, onSendOtp, onCustomerNoShow, onSalesRepNoShow, onViewLead, onAddRemark }) => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-bg)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: 18 }}>
          {visit.leadName[0]}
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{visit.leadName}</h3>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{visit.visitProject} · {visit.location}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Badge variant={visit.status === 'Scheduled' ? 'warm' : 'success'}>{visit.status}</Badge>
        {visit.channelPartner && <Badge variant="nurture">CP: {visit.channelPartner.name}</Badge>}
      </div>
    </div>

    <div style={{ padding: '14px 20px', display: 'flex', gap: 24, borderBottom: '1px solid var(--border)' }}>
      <MiniInfo label="Date & Time" value={new Date(visit.scheduledDate).toLocaleString()} />
      <MiniInfo label="Sales Rep" value={visit.salesRep.name} />
      <MiniInfo label="Pre-sales" value={visit.presalesOwner.name} />
      <MiniInfo label="Attendees" value={`${(visit.attendees || []).length} people`} />
    </div>

    {/* SMS Status */}
    {visit.smsSentToCustomer && (
      <div style={{ padding: '10px 20px', background: 'rgba(96,165,250,0.04)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <MessageSquare size={13} style={{ color: '#60A5FA' }} />
        <span style={{ fontSize: 11, color: '#60A5FA' }}>SMS sent: </span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic', flex: 1 }}>"{visit.smsContent}"</span>
      </div>
    )}

    {/* Actions */}
    <div style={{ padding: '14px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm" onClick={onQrScan}>
        <QrCode size={14} style={{ marginRight: 4 }} /> QR Scan Check-In
      </Button>
      {visit.channelPartner && !visit.otpVerified && (
        <Button variant="outline" size="sm" onClick={onSendOtp} style={{ borderColor: '#34D399', color: '#34D399' }}>
          <Smartphone size={14} style={{ marginRight: 4 }} /> Send OTP (CP Lock)
        </Button>
      )}
      {visit.channelPartner && visit.otpVerified && (
        <Badge variant="success" style={{ padding: '6px 12px' }}><ShieldCheck size={12} style={{ marginRight: 4 }} /> OTP Verified</Badge>
      )}
      <Button variant="outline" size="sm" onClick={onAddRemark}>
        <Lock size={14} style={{ marginRight: 4 }} /> Add Remark
      </Button>
      <Button variant="ghost" size="sm" onClick={onViewLead}>View Lead <ChevronRight size={14} /></Button>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
        <button onClick={onCustomerNoShow} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 600, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#FBBF24', cursor: 'pointer' }}>
          Customer No-Show
        </button>
        <button onClick={onSalesRepNoShow} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 600, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171', cursor: 'pointer' }}>
          Rep No-Show
        </button>
      </div>
    </div>
  </Card>
);

const InfoCard = ({ icon: Icon, color, title, desc }) => (
  <div style={{ padding: 16, borderRadius: 'var(--radius-lg)', background: `${color}08`, border: `1px solid ${color}25` }}>
    <Icon size={20} style={{ color, marginBottom: 8 }} />
    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{title}</h4>
    <p style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>{desc}</p>
  </div>
);

const MiniInfo = ({ label, value }) => (
  <div>
    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <p style={{ fontSize: 13, color: 'white', marginTop: 4, fontWeight: 500 }}>{value}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <Card style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--border)', background: 'var(--bg-main)' }}>
    <CheckCircle size={36} style={{ color: '#34D399', margin: '0 auto 12px' }} />
    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}>{text}</p>
  </Card>
);

const Modal = ({ onClose, title, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={onClose}>
    <Card style={{ width: 480, maxHeight: '85vh', overflow: 'auto', padding: 24, animation: 'fadeIn 0.2s' }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{title}</h3>
        <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}><XCircle size={18} /></button>
      </div>
      {children}
    </Card>
  </div>
);

export default SiteVisitManager;
