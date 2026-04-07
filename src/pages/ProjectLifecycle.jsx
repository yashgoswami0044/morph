import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal } from '../components/ui/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CheckCircle, Clock, XCircle, ArrowRight, ChevronRight, ChevronDown,
  Users, Send, FileText, Paintbrush, Factory, ClipboardCheck, Truck,
  ShieldCheck, Smartphone, IndianRupee, CreditCard, Lock, Download,
  Plus, Eye, EyeOff, MessageSquare, User, Home, Calendar, AlertTriangle,
  Wrench, Package, Star, ExternalLink, Copy, PenTool
} from 'lucide-react';
import { mockProjects, projectPhases, projectTeam, qcChecklistTemplate } from '../data/mockData.js';

const ProjectLifecycle = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null); // { projectId, role }
  const [activePhaseTab, setActivePhaseTab] = useState(null);
  const [showOtpHandover, setShowOtpHandover] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const proj = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  const formatCurrency = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
  const fmtDT = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';

  const phaseIdx = (phaseName) => projectPhases.findIndex(p => p.name === phaseName);

  // ── Assign role ──
  const handleAssign = (projectId, role, personId) => {
    const person = projectTeam.find(t => t.id === personId);
    if (!person) return;
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updated = { ...p };
      if (role === 'Design Manager') updated.designManager = { id: person.id, name: person.name, assignedBy: user?.name || 'CRM', assignedDate: new Date().toISOString() };
      if (role === 'Production Manager') updated.productionManagers = [...(updated.productionManagers || []), { id: person.id, name: person.name, assignedBy: user?.name, assignedDate: new Date().toISOString(), scope: '', notes: '', progress: 0 }];
      if (role === 'QC Manager') updated.qcManager = { id: person.id, name: person.name, assignedBy: user?.name, assignedDate: new Date().toISOString() };
      if (role === 'Project Manager') updated.projectManager = { id: person.id, name: person.name, assignedBy: user?.name, assignedDate: new Date().toISOString() };
      return updated;
    }));
    setShowAssignModal(null);
  };

  // ── Move to next phase ──
  const advancePhase = (projectId, nextPhase) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const hist = [...p.phaseHistory];
      if (hist.length && !hist[hist.length - 1].endDate) hist[hist.length - 1] = { ...hist[hist.length - 1], endDate: new Date().toISOString(), completedBy: user?.name };
      hist.push({ phase: nextPhase, startDate: new Date().toISOString(), endDate: null, completedBy: null });
      return { ...p, currentPhase: nextPhase, phaseHistory: hist };
    }));
  };

  // ── Add production note ──
  const addProductionNote = (projectId) => {
    if (!noteInput.trim()) return;
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, productionNotes: [...p.productionNotes, { date: new Date().toISOString(), by: user?.name || 'System', note: noteInput, visible: true }] } : p));
    setNoteInput('');
  };

  // ── Send design PDF ──
  const sendDesignPdf = (projectId, designId) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : { ...p, designs: p.designs.map(d => d.id === designId ? { ...d, sentToCustomer: true, sentVia: 'WhatsApp + Email', sentDate: new Date().toISOString() } : d) }));
  };

  // ── Handover OTP ──
  const initiateHandover = (projectId) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, handoverOtp: code } : p));
    setShowOtpHandover(projectId);
    setOtpInput('');
  };
  const verifyHandover = (projectId) => {
    const p = projects.find(x => x.id === projectId);
    if (p && otpInput === p.handoverOtp) {
      setProjects(prev => prev.map(x => x.id === projectId ? { ...x, handoverCompleted: true, handoverDate: new Date().toISOString(), currentPhase: 'Handover' } : x));
      setShowOtpHandover(null);
    }
  };

  // ── Project List View ──
  if (!selectedProject) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Project Lifecycle</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Post-conversion journey: Onboarding → Design → Production → QC → Installation → Handover</p>
          </div>
        </div>

        {/* Phase Pipeline */}
        <div style={{ display: 'flex', gap: 2 }}>
          {projectPhases.map((ph, i) => (
            <div key={ph.id} style={{ flex: 1, textAlign: 'center', padding: '12px 4px', background: `${ph.color}12`, border: `1px solid ${ph.color}30`, borderRadius: i === 0 ? 'var(--radius-md) 0 0 var(--radius-md)' : i === projectPhases.length - 1 ? '0 var(--radius-md) var(--radius-md) 0' : 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: ph.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ph.name}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'white', marginTop: 4 }}>{projects.filter(p => p.currentPhase === ph.name).length}</p>
            </div>
          ))}
        </div>

        {/* Project Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {projects.map(p => {
            const phase = projectPhases.find(ph => ph.name === p.currentPhase);
            const paidPct = Math.round((p.totalPaid / p.contractValue) * 100);
            return (
              <Card key={p.id} style={{ padding: 0, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', border: `1px solid ${phase?.color || 'var(--border)'}30` }}
                onClick={() => { setSelectedProject(p.id); setActivePhaseTab(p.currentPhase); }}
                onMouseEnter={e => e.currentTarget.style.borderColor = phase?.color || 'var(--border)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${phase?.color || 'var(--border)'}30`}>
                <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${phase?.color}15`, border: `2px solid ${phase?.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Home size={22} style={{ color: phase?.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 3 }}>{p.customerName}</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{p.projectName} · {p.config} · {p.area} sqft</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>PHASE</p>
                      <Badge variant="outline" style={{ color: phase?.color, borderColor: `${phase?.color}50`, fontSize: 11, marginTop: 4 }}>{p.currentPhase}</Badge>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>CONTRACT</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: 'white', marginTop: 2 }}>{formatCurrency(p.contractValue)}</p>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: 80 }}>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>PAID</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-main)', borderRadius: 3, overflow: 'hidden', minWidth: 50 }}>
                          <div style={{ width: `${paidPct}%`, height: '100%', background: '#34D399', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>{paidPct}%</span>
                      </div>
                    </div>
                    <ChevronRight size={20} style={{ color: 'var(--text-dim)' }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Project Detail View ──
  const currentPhaseObj = projectPhases.find(ph => ph.name === proj?.currentPhase);
  const currentPhaseIdx = phaseIdx(proj?.currentPhase);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => setSelectedProject(null)} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{proj.customerName} — {proj.projectName}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{proj.config} · {proj.area} sqft · Contract: {formatCurrency(proj.contractValue)}</p>
        </div>
        <Badge variant="outline" style={{ color: currentPhaseObj?.color, borderColor: `${currentPhaseObj?.color}50`, fontSize: 13, padding: '6px 14px' }}>{proj.currentPhase}</Badge>
        <Button variant="danger" size="sm" onClick={() => {
          if (confirm('Are you sure you want to cancel this project? This will mark the lead as Not Qualified.')) {
            setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, currentPhase: 'Cancelled', status: 'Not Qualified' } : p));
            // In a real app, this would also call transitionStatus(proj.leadId, 'Not Qualified')
            setSelectedProject(null);
          }
        }}>
          <XCircle size={14} style={{ marginRight: 6 }} /> Cancel Project
        </Button>
      </div>

      {/* Phase Progress Strip */}
      <div style={{ display: 'flex', gap: 3 }}>
        {projectPhases.map((ph, i) => {
          const isDone = i < currentPhaseIdx;
          const isCurrent = i === currentPhaseIdx;
          return (
            <button key={ph.id} onClick={() => setActivePhaseTab(ph.name)} style={{
              flex: 1, padding: '10px 6px', textAlign: 'center', borderRadius: i === 0 ? '8px 0 0 8px' : i === 6 ? '0 8px 8px 0' : 0,
              background: isCurrent ? `${ph.color}20` : isDone ? `${ph.color}08` : 'var(--bg-main)',
              border: `1px solid ${isCurrent ? ph.color : isDone ? `${ph.color}30` : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
                {isDone ? <CheckCircle size={10} style={{ color: ph.color }} /> : isCurrent ? <Clock size={10} style={{ color: ph.color }} /> : <div style={{ width: 10, height: 10, borderRadius: '50%', border: `1px solid var(--border)` }} />}
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, color: isCurrent ? ph.color : isDone ? `${ph.color}AA` : 'var(--text-dim)', textTransform: 'uppercase' }}>{ph.name}</p>
            </button>
          );
        })}
      </div>

      {/* Payment Summary */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Payment Summary</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Paid: {formatCurrency(proj.totalPaid)}</span>
            <span style={{ fontSize: 12, color: '#F87171', fontWeight: 600 }}>Pending: {formatCurrency(proj.totalPending)}</span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {proj.payments.map((pm, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 16px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', background: pm.status === 'Paid' ? 'rgba(52,211,153,0.04)' : 'transparent' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: pm.status === 'Paid' ? '#34D399' : 'var(--text-dim)', textTransform: 'uppercase' }}>{pm.milestone}</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '4px 0' }}>₹{pm.amount.toLocaleString()}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {pm.status === 'Paid' ? <CheckCircle size={10} style={{ color: '#34D399' }} /> : <Clock size={10} style={{ color: 'var(--text-dim)' }} />}
                <span style={{ fontSize: 10, color: pm.status === 'Paid' ? '#34D399' : 'var(--text-dim)' }}>{pm.status === 'Paid' ? formatDate(pm.date) : 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
        {proj.onlinePaymentEnabled && (
          <div style={{ padding: '10px 20px', background: 'rgba(96,165,250,0.04)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={14} style={{ color: '#60A5FA' }} />
            <span style={{ fontSize: 11, color: '#60A5FA' }}>CCAvenue Online Payment Enabled · Order: {proj.ccavenueOrderId}</span>
            <Button variant="outline" size="sm" style={{ marginLeft: 'auto', fontSize: 11 }}>Generate Payment Link</Button>
          </div>
        )}
      </Card>

      {/* ── PHASE CONTENT ── */}
      {activePhaseTab === 'Onboarding' && (
        <PhaseSection title="Onboarding" color="#34D399" icon={CheckCircle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <InfoBlock label="10% Payment" value={`₹${proj.onboardingPayment.amount.toLocaleString()} (${proj.onboardingPayment.mode})`} status={proj.onboardingPayment.status} />
            <InfoBlock label="SAP Validated" value={proj.onboardingPayment.sapValidated ? `✅ ${proj.onboardingPayment.sapRef}` : '❌ Pending validation by Account Manager'} status={proj.onboardingPayment.sapValidated ? 'Paid' : 'Pending'} />
            <InfoBlock label="Design Manager Allocated" value={proj.designManager ? `${proj.designManager.name} (by ${proj.designManager.assignedBy})` : 'Not yet assigned'} status={proj.designManager ? 'Paid' : 'Pending'} />
            <InfoBlock label="CRM Head Follow-up" value="CRM Head takes follow-up for 50% payment" status="info" />
          </div>
          {!proj.designManager && (
            <Button variant="primary" style={{ marginTop: 16 }} onClick={() => setShowAssignModal({ projectId: proj.id, role: 'Design Manager' })}>
              <Users size={14} style={{ marginRight: 6 }} /> Allocate Design Manager
            </Button>
          )}
        </PhaseSection>
      )}

      {activePhaseTab === 'Design Phase' && (
        <PhaseSection title="Design Phase" color="#60A5FA" icon={Paintbrush}>
          {/* Design Manager */}
          <Card style={{ padding: 16, background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.15)', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>Design Manager</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginTop: 4 }}>{proj.designManager?.name || 'Not assigned'}</p>
                {proj.designManager && <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Assigned by {proj.designManager.assignedBy} · {fmtDT(proj.designManager.assignedDate)}</p>}
              </div>
              <div style={{ padding: 10, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <p style={{ fontSize: 10, color: '#F87171', fontWeight: 600 }}>⚠ Design Manager cannot register leads</p>
              </div>
            </div>
          </Card>

          {/* Designs List */}
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Designs & Revisions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {proj.designs.map(d => (
              <Card key={d.id} style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={18} style={{ color: d.status === 'Approved' ? '#34D399' : '#60A5FA' }} />
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{d.version} — {d.name}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Created: {fmtDT(d.createdDate)} · Costing: {formatCurrency(d.costing)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge variant={d.status === 'Approved' ? 'success' : d.status === 'Revised' ? 'gray' : 'warm'}>{d.status}</Badge>
                  {d.sentToCustomer ? (
                    <Badge variant="nurture" style={{ fontSize: 9 }}>Sent via {d.sentVia}</Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => sendDesignPdf(proj.id, d.id)}><Send size={12} style={{ marginRight: 4 }} /> Send PDF</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Card style={{ padding: 14, marginTop: 16, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p style={{ fontSize: 12, color: '#FBBF24' }}>💡 Sales and Design Manager can change design and pricing. Costing may differ from original estimation.</p>
          </Card>
        </PhaseSection>
      )}

      {activePhaseTab === 'Design Sign-off' && (
        <PhaseSection title="Design Sign-off & 50% Payment" color="#8B5CF6" icon={PenTool}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card style={{ padding: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6', marginBottom: 12 }}>Design Sign-off</h4>
              {proj.designSignedOff ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={16} style={{ color: '#34D399' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#34D399' }}>Signed by {proj.designSignedBy}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>{formatDate(proj.designSignOffDate)}</span>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Customer must sign off on the final design before proceeding.</p>
                  <Button variant="primary"><PenTool size={14} style={{ marginRight: 6 }} /> Mark Design Signed</Button>
                </div>
              )}
            </Card>
            <Card style={{ padding: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6', marginBottom: 12 }}>50% Payment</h4>
              {proj.designPayment.status === 'Paid' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} style={{ color: '#34D399' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#34D399' }}>₹{proj.designPayment.amount.toLocaleString()} received</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{proj.designPayment.mode} · Confirmed by Accounts: {proj.designPayment.confirmedByAccounts ? '✅' : '❌'}</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#F87171', marginBottom: 8 }}>₹{proj.designPayment.amount.toLocaleString()} pending</p>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>CRM Head follows up for this payment.</p>
                  <Button variant="primary"><IndianRupee size={14} style={{ marginRight: 6 }} /> Record 50% Payment</Button>
                </div>
              )}
            </Card>
          </div>
          <Card style={{ padding: 14, marginTop: 16, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <p style={{ fontSize: 12, color: '#F87171', fontWeight: 600 }}>⚠ Do NOT move to Production until design is signed AND 50% payment is received.</p>
          </Card>
          {proj.designSignedOff && proj.designPayment.status === 'Paid' && phaseIdx(proj.currentPhase) < 3 && (
            <Button variant="primary" style={{ marginTop: 16 }} onClick={() => advancePhase(proj.id, 'Production Phase')}>
              <ArrowRight size={14} style={{ marginRight: 6 }} /> Move to Production Phase
            </Button>
          )}
        </PhaseSection>
      )}

      {activePhaseTab === 'Production Phase' && (
        <PhaseSection title="Production Phase" color="#FBBF24" icon={Factory}>
          {/* Production Managers */}
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Production Managers</h4>
          {proj.productionManagers.length === 0 ? (
            <Card style={{ padding: 24, textAlign: 'center', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>No production manager assigned yet.</p>
              <Button variant="primary" onClick={() => setShowAssignModal({ projectId: proj.id, role: 'Production Manager' })}>
                <Plus size={14} style={{ marginRight: 6 }} /> Assign Production Manager
              </Button>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {proj.productionManagers.map((pm, i) => (
                <Card key={pm.id} style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Factory size={18} style={{ color: '#FBBF24' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{pm.name}</h4>
                      <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Scope: {pm.scope || '-'} · Assigned by {pm.assignedBy}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 80 }}>
                      <div style={{ height: 6, background: 'var(--bg-main)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${pm.progress}%`, height: '100%', background: pm.progress >= 80 ? '#34D399' : '#FBBF24', borderRadius: 3 }} />
                      </div>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)', textAlign: 'center', marginTop: 4 }}>{pm.progress}%</p>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={() => setShowAssignModal({ projectId: proj.id, role: 'Production Manager' })} style={{ width: 'fit-content' }}>
                <Plus size={12} style={{ marginRight: 4 }} /> Add Another PM
              </Button>
            </div>
          )}

          {/* Production Notes */}
          <Card style={{ padding: 14, background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)', marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: '#F87171' }}><EyeOff size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Production Manager 1's work & progress is NOT visible to Production Manager 2.</p>
          </Card>

          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10 }}>Production Notes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {proj.productionNotes.map((n, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, color: 'white' }}>{n.note}</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{n.by} · {fmtDT(n.date)}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Add production note..." style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13 }} />
            <Button variant="primary" onClick={() => addProductionNote(proj.id)}>Add Note</Button>
          </div>

          {currentPhaseIdx === 3 && (
            <Button variant="outline" style={{ marginTop: 20 }} onClick={() => advancePhase(proj.id, 'QC & Dispatch')}>
              <ArrowRight size={14} style={{ marginRight: 6 }} /> Move to QC & Dispatch
            </Button>
          )}
        </PhaseSection>
      )}

      {activePhaseTab === 'QC & Dispatch' && (
        <PhaseSection title="QC & Dispatch" color="#EC4899" icon={ClipboardCheck}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Card style={{ padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#EC4899', marginBottom: 8 }}>QC Manager</h4>
              {proj.qcManager ? (
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{proj.qcManager.name}<span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>Assigned by {proj.qcManager.assignedBy}</span></p>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowAssignModal({ projectId: proj.id, role: 'QC Manager' })}>Assign QC Manager</Button>
              )}
            </Card>
            <Card style={{ padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#EC4899', marginBottom: 8 }}>Remaining Payment (30%+10%)</h4>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#F87171' }}>₹{proj.totalPending.toLocaleString()} pending</p>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Sales team or Production team can enter. Account Manager confirms.</p>
            </Card>
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10 }}>QC Checklist</h4>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)' }}>
                  {['', 'Category', 'Item', 'Required', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qcChecklistTemplate.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 14px' }}><input type="checkbox" style={{ accentColor: '#EC4899' }} /></td>
                    <td style={{ padding: '8px 14px', fontSize: 12, fontWeight: 600, color: 'white' }}>{item.category}</td>
                    <td style={{ padding: '8px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{item.item}</td>
                    <td style={{ padding: '8px 14px' }}>{item.required ? <Badge variant="hot" style={{ fontSize: 9 }}>Required</Badge> : <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Optional</span>}</td>
                    <td style={{ padding: '8px 14px' }}><Badge variant="gray" style={{ fontSize: 9 }}>Pending</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {currentPhaseIdx === 4 && (
            <Button variant="outline" style={{ marginTop: 20 }} onClick={() => advancePhase(proj.id, 'Installation')}>
              <ArrowRight size={14} style={{ marginRight: 6 }} /> Move to Installation
            </Button>
          )}
        </PhaseSection>
      )}

      {activePhaseTab === 'Installation' && (
        <PhaseSection title="Installation Phase" color="#F97316" icon={Wrench}>
          <Card style={{ padding: 16, background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: '#F97316' }}>
              <Wrench size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Managed by Project Manager. PM knows to jump in when QC & Dispatch is complete. He captures installation schedule, progress, and team coordination.
            </p>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Card style={{ padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F97316', marginBottom: 8 }}>Project Manager</h4>
              {proj.projectManager ? (
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{proj.projectManager.name}</p>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowAssignModal({ projectId: proj.id, role: 'Project Manager' })}>Assign Project Manager</Button>
              )}
            </Card>
            <Card style={{ padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F97316', marginBottom: 8 }}>Installation Progress</h4>
              <div style={{ width: '100%', height: 10, background: 'var(--bg-main)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${proj.installationProgress}%`, height: '100%', background: '#F97316', borderRadius: 5 }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>{proj.installationProgress}% complete</p>
            </Card>
          </div>

          {currentPhaseIdx === 5 && (
            <Button variant="primary" style={{ marginTop: 12 }} onClick={() => initiateHandover(proj.id)}>
              <ShieldCheck size={14} style={{ marginRight: 6 }} /> Initiate Handover (OTP)
            </Button>
          )}
        </PhaseSection>
      )}

      {activePhaseTab === 'Handover' && (
        <PhaseSection title="Handover & OTP Verification" color="#14B8A6" icon={ShieldCheck}>
          {proj.handoverCompleted ? (
            <Card style={{ padding: 40, textAlign: 'center', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.3)' }}>
              <CheckCircle size={48} style={{ color: '#14B8A6', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>Project Handed Over! 🎉</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>OTP verified & handover completed on {fmtDT(proj.handoverDate)}</p>
            </Card>
          ) : (
            <Card style={{ padding: 24 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 12 }}>OTP Handover Verification</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Send OTP to customer (and all applicants/co-applicants) for final handover confirmation.</p>
              <Button variant="primary" onClick={() => initiateHandover(proj.id)}>
                <Smartphone size={14} style={{ marginRight: 6 }} /> Send Handover OTP
              </Button>
            </Card>
          )}
        </PhaseSection>
      )}

      {/* ── ASSIGN MODAL ── */}
      {showAssignModal && (
        <Modal onClose={() => setShowAssignModal(null)} title={`Assign ${showAssignModal.role}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projectTeam.filter(t => t.role === showAssignModal.role && t.active).map(t => (
              <button key={t.id} onClick={() => handleAssign(showAssignModal.projectId, showAssignModal.role, t.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t.region} · {t.email}</p>
                </div>
                {t.currentProjects != null && <Badge variant="gray">{t.currentProjects} active</Badge>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* ── HANDOVER OTP MODAL ── */}
      {showOtpHandover && (() => {
        const p = projects.find(x => x.id === showOtpHandover);
        return (
          <Modal onClose={() => setShowOtpHandover(null)} title="Handover OTP Verification">
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 16 }}>OTP sent to {p?.customerName} and all applicants/co-applicants.</p>
            <div style={{ padding: 12, background: 'rgba(20,184,166,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(20,184,166,0.2)', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#14B8A6' }}>Demo OTP: <strong>{p?.handoverOtp}</strong></p>
            </div>
            <input value={otpInput} onChange={e => setOtpInput(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6}
              style={{ width: '100%', padding: '14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 22, textAlign: 'center', letterSpacing: 8, fontWeight: 700, marginBottom: 14 }} />
            <Button variant="primary" onClick={() => verifyHandover(showOtpHandover)} style={{ width: '100%' }}>
              <ShieldCheck size={14} style={{ marginRight: 6 }} /> Verify & Complete Handover
            </Button>
          </Modal>
        );
      })()}
    </div>
  );
};

/* ── Helpers ── */
const PhaseSection = ({ title, color, icon: Icon, children }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <Icon size={18} style={{ color }} />
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{title}</h3>
    </div>
    {children}
  </Card>
);

const InfoBlock = ({ label, value, status }) => (
  <div style={{ padding: 14, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
    <p style={{ fontSize: 13, fontWeight: 500, color: status === 'Paid' ? '#34D399' : status === 'info' ? '#60A5FA' : '#FBBF24' }}>{value}</p>
  </div>
);

export default ProjectLifecycle;
