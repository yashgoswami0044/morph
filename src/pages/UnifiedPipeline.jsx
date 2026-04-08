import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CheckCircle, Clock, ArrowRight, ChevronRight, Zap,
  FileText, Send, CreditCard, PenTool, Users, Paintbrush,
  Factory, ClipboardCheck, Wrench, ShieldCheck, IndianRupee,
  Hash, MapPin, User, Calendar, ExternalLink, Star,
  TrendingUp, Layers, AlertTriangle, Info
} from 'lucide-react';
import {
  mockLeads, mockEstimations, mockQuotations, mockPayments, mockContracts,
  mockProjects, projectPhases
} from '../data/mockData.js';

// ── UNIFIED 11-STAGE DEFINITION ──
const SALES_STAGES = [
  { id: 'estimation', name: 'Estimation', shortName: 'EST', icon: Hash, color: '#A88944', desc: 'Sales Executive creates estimate' },
  { id: 'quotation', name: 'Quotation', shortName: 'QTN', icon: FileText, color: '#D4A853', desc: 'Formal quote sent to customer' },
  { id: 'payment', name: 'Payment', shortName: 'PAY', icon: CreditCard, color: '#F59E0B', desc: 'Advance payment received' },
  { id: 'contract', name: 'Contract', shortName: 'CNT', icon: PenTool, color: '#FBBF24', desc: 'Contract signed & confirmed' },
];

const PROJECT_STAGES = [
  { id: 'onboarding', name: 'Onboarding', shortName: 'ONB', icon: Users, color: '#34D399', desc: '10% payment, Design Manager allocated' },
  { id: 'design', name: 'Design Phase', shortName: 'DSN', icon: Paintbrush, color: '#60A5FA', desc: 'Design iterations with customer' },
  { id: 'signoff', name: 'Design Sign-Off', shortName: 'SGN', icon: PenTool, color: '#8B5CF6', desc: 'Customer signs final design + 50% payment' },
  { id: 'production', name: 'Production Phase', shortName: 'PRD', icon: Factory, color: '#FBBF24', desc: 'Manufacturing begins in factory' },
  { id: 'qc', name: 'QC & Dispatch', shortName: 'QCD', icon: ClipboardCheck, color: '#EC4899', desc: 'Quality check + dispatch to site' },
  { id: 'installation', name: 'Installation', shortName: 'INS', icon: Wrench, color: '#F97316', desc: 'On-site installation by PM' },
  { id: 'handover', name: 'Handover', shortName: 'HND', icon: ShieldCheck, color: '#14B8A6', desc: 'OTP verified handover to customer' },
];

const PHASE_TO_STAGE_MAP = {
  'Onboarding': 'onboarding',
  'Design Phase': 'design',
  'Design Sign-off': 'signoff',
  'Production Phase': 'production',
  'QC & Dispatch': 'qc',
  'Installation': 'installation',
  'Handover': 'handover',
};

const UnifiedPipeline = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only converted leads that have projects
  const convertedLeads = mockLeads.filter(l => l.status === 'Converted');
  const [selectedLeadId, setSelectedLeadId] = useState(convertedLeads[0]?.id || null);

  const selectedLead = convertedLeads.find(l => l.id === selectedLeadId);
  const project = selectedLead ? mockProjects.find(p => p.leadId === selectedLeadId) : null;
  const estimation = selectedLead ? mockEstimations.find(e => e.leadId === selectedLeadId) : null;
  const quotation = selectedLead ? mockQuotations.find(q => q.leadId === selectedLeadId) : null;
  const payment = selectedLead ? mockPayments.find(p => p.leadId === selectedLeadId) : null;
  const contract = selectedLead ? mockContracts.find(c => c.leadId === selectedLeadId) : null;

  const formatCurrency = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n||0).toLocaleString()}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  // Determine current project stage index
  const currentProjectStageId = project ? PHASE_TO_STAGE_MAP[project.currentPhase] : null;
  const currentProjectStageIdx = PROJECT_STAGES.findIndex(s => s.id === currentProjectStageId);

  // Stage status helpers
  const getSalesStageStatus = (stageId) => {
    if (!selectedLead) return 'pending';
    const map = {
      estimation: !!estimation,
      quotation: !!quotation,
      payment: !!payment,
      contract: !!contract,
    };
    return map[stageId] ? 'completed' : 'pending';
  };

  const getProjectStageStatus = (stageId, idx) => {
    if (!project) return 'pending';
    if (idx < currentProjectStageIdx) return 'completed';
    if (idx === currentProjectStageIdx) return 'current';
    return 'pending';
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            Unified Pipeline
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Full journey view: Estimation → Quotation → Payment → Contract → Onboarding → Handover (11 stages)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Lead:</span>
          <select
            value={selectedLeadId || ''}
            onChange={e => setSelectedLeadId(e.target.value)}
            style={{
              padding: '8px 36px 8px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
              background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)',
              cursor: 'pointer', outline: 'none', minWidth: 220,
              appearance: 'none',
            }}
          >
            {convertedLeads.map(l => (
              <option key={l.id} value={l.id}>{l.name} ({l.id}) — ₹{l.budget}L</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLead && (
        <>
          {/* ── LEAD SUMMARY STRIP ── */}
          <Card style={{ padding: '16px 24px', background: 'linear-gradient(135deg, rgba(168,137,68,0.08) 0%, rgba(52,211,153,0.04) 100%)', border: '1px solid rgba(168,137,68,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-bg)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>
                  {selectedLead.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{selectedLead.name}</h2>
                    <Badge variant="success" style={{ fontSize: 10 }}>CONVERTED</Badge>
                    <Badge variant="outline" style={{ fontSize: 10, color: 'var(--primary)', borderColor: 'rgba(168,137,68,0.5)' }}>{selectedLead.id}</Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {selectedLead.region}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Layers size={12} /> {selectedLead.config} · {selectedLead.area} sqft</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} /> Assigned: {selectedLead.assignedToName}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { label: 'Contract Value', value: formatCurrency((project?.contractValue || 0)), color: '#34D399' },
                  { label: 'Total Paid', value: formatCurrency(project?.totalPaid || 0), color: '#34D399' },
                  { label: 'Pending', value: formatCurrency(project?.totalPending || 0), color: '#F87171' },
                  { label: 'Current Phase', value: project?.currentPhase || '—', color: 'var(--primary)' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ══════════════════════════════════════════════════
              THE UNIFIED 11-STAGE PIPELINE STRIP
          ══════════════════════════════════════════════════ */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {/* Section Labels */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              <div style={{ flex: 4, padding: '10px 16px', background: 'rgba(168,137,68,0.08)', borderRight: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <IndianRupee size={14} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pre-Conversion (Sales Process)</span>
              </div>
              <div style={{ flex: 7, padding: '10px 16px', background: 'rgba(52,211,153,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={14} style={{ color: '#34D399' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Post-Conversion (Project Lifecycle)</span>
              </div>
            </div>

            {/* Stage Bubbles */}
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              {/* Sales Stages */}
              {SALES_STAGES.map((stage, idx) => {
                const status = getSalesStageStatus(stage.id);
                const Icon = stage.icon;
                const isLast = idx === SALES_STAGES.length - 1;
                return (
                  <React.Fragment key={stage.id}>
                    <div style={{
                      flex: 1, padding: '16px 10px', textAlign: 'center',
                      background: status === 'completed' ? `${stage.color}10` : 'transparent',
                      borderBottom: status === 'completed' ? `2px solid ${stage.color}40` : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', margin: '0 auto 8px',
                        background: status === 'completed' ? `${stage.color}18` : 'var(--bg-main)',
                        border: `2px solid ${status === 'completed' ? stage.color : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: status === 'completed' ? `0 4px 12px ${stage.color}30` : 'none',
                      }}>
                        {status === 'completed'
                          ? <CheckCircle size={16} style={{ color: stage.color }} />
                          : <Icon size={16} style={{ color: 'var(--text-dim)' }} />
                        }
                      </div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: status === 'completed' ? stage.color : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stage.shortName}</p>
                      <p style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2, lineHeight: 1.3 }}>{stage.name}</p>
                    </div>
                    {isLast && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', background: 'rgba(52,211,153,0.1)', borderLeft: '1px solid rgba(52,211,153,0.3)', borderRight: '1px solid rgba(52,211,153,0.3)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 6px' }}>
                          <Zap size={14} style={{ color: '#34D399' }} />
                          <div style={{ width: 1, height: 20, background: 'rgba(52,211,153,0.4)' }} />
                          <p style={{ fontSize: 7, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', writingMode: 'vertical-rl', transform: 'rotate(180deg)', margin: 0 }}>CONVERTED</p>
                          <div style={{ width: 1, height: 20, background: 'rgba(52,211,153,0.4)' }} />
                          <Zap size={14} style={{ color: '#34D399' }} />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Project Stages */}
              {PROJECT_STAGES.map((stage, idx) => {
                const status = getProjectStageStatus(stage.id, idx);
                const Icon = stage.icon;
                return (
                  <div key={stage.id} style={{
                    flex: 1, padding: '16px 8px', textAlign: 'center',
                    background: status === 'completed' ? `${stage.color}08` : status === 'current' ? `${stage.color}14` : 'transparent',
                    borderBottom: status !== 'pending' ? `2px solid ${stage.color}${status === 'current' ? '80' : '40'}` : '2px solid transparent',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}>
                    {status === 'current' && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${stage.color}, transparent)` }} />
                    )}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', margin: '0 auto 8px',
                      background: status === 'completed' ? `${stage.color}18` : status === 'current' ? `${stage.color}22` : 'var(--bg-main)',
                      border: `2px solid ${status !== 'pending' ? stage.color : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: status === 'current' ? `0 4px 16px ${stage.color}40` : status === 'completed' ? `0 2px 8px ${stage.color}20` : 'none',
                      animation: status === 'current' ? 'subtlePulse 2s infinite' : 'none',
                    }}>
                      {status === 'completed'
                        ? <CheckCircle size={16} style={{ color: stage.color }} />
                        : status === 'current'
                          ? <Icon size={16} style={{ color: stage.color }} />
                          : <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid var(--border)' }} />
                      }
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: status !== 'pending' ? stage.color : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stage.shortName}</p>
                    <p style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2, lineHeight: 1.3 }}>{stage.name}</p>
                    {status === 'current' && (
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: stage.color, background: `${stage.color}15`, border: `1px solid ${stage.color}30`, borderRadius: 8, padding: '1px 5px', display: 'inline-block' }}>ACTIVE</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ── MAIN CONTENT: TWO COLUMNS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

            {/* ── LEFT: STAGE DETAIL PANELS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* PRE-CONVERSION: Sales Stages Summary */}
              <SectionHeader icon={IndianRupee} title="Pre-Conversion — Sales Journey" color="var(--primary)" />

              {/* Stage 1: Estimation */}
              <StageCard
                stageNum={1}
                name="Estimation"
                icon={Hash}
                color="#A88944"
                status={estimation ? 'completed' : 'pending'}
                owner="Sales Executive"
                trigger="New Lead Added"
              >
                {estimation ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <MiniInfo label="EST ID" value={estimation.id} />
                    <MiniInfo label="Amount" value={`₹${(estimation.grandTotal || 0).toLocaleString()}`} highlight />
                    <MiniInfo label="Status" value={estimation.status} />
                    <MiniInfo label="Created By" value={estimation.createdBy?.name} />
                    <MiniInfo label="Verified By" value={estimation.verifiedBy?.name || '—'} />
                    <MiniInfo label="Authorized By" value={estimation.authorizedBy?.name || '—'} />
                  </div>
                ) : <EmptyState text="No estimation created yet" />}
              </StageCard>

              {/* Stage 2: Quotation */}
              <StageCard
                stageNum={2}
                name="Quotation"
                icon={FileText}
                color="#D4A853"
                status={quotation ? 'completed' : 'pending'}
                owner="Sales Manager"
                trigger="EST Authorized"
              >
                {quotation ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <MiniInfo label="QTN ID" value={quotation.id} />
                    <MiniInfo label="Grand Total" value={`₹${(quotation.grandTotal || 0).toLocaleString()}`} highlight />
                    <MiniInfo label="Status" value={quotation.status} />
                    <MiniInfo label="Payment Terms" value={quotation.paymentTerms} />
                    <MiniInfo label="Sent Via" value={quotation.sentVia || '—'} />
                    <MiniInfo label="Valid Until" value={formatDate(quotation.validUntil)} />
                  </div>
                ) : <EmptyState text="No quotation issued yet" />}
              </StageCard>

              {/* Stage 3: Payment */}
              <StageCard
                stageNum={3}
                name="Payment"
                icon={CreditCard}
                color="#F59E0B"
                status={payment ? 'completed' : 'pending'}
                owner="Finance / Sales"
                trigger="Quote Accepted"
              >
                {payment ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <MiniInfo label="PAY ID" value={payment.id} />
                    <MiniInfo label="Amount" value={`₹${(payment.amount || 0).toLocaleString()}`} highlight />
                    <MiniInfo label="Status" value={payment.status} />
                    <MiniInfo label="Mode" value={payment.paymentMode} />
                    <MiniInfo label="Collected By" value={payment.collectedBy?.name} />
                    <MiniInfo label="Date" value={formatDate(payment.collectionDate)} />
                  </div>
                ) : <EmptyState text="No payment collected yet" />}
              </StageCard>

              {/* Stage 4: Contract */}
              <StageCard
                stageNum={4}
                name="Contract"
                icon={PenTool}
                color="#FBBF24"
                status={contract ? 'completed' : 'pending'}
                owner="Regional Manager"
                trigger="Payment Received"
              >
                {contract ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <MiniInfo label="Contract ID" value={contract.id} />
                    <MiniInfo label="Value" value={formatCurrency(contract.contractValue)} highlight />
                    <MiniInfo label="Status" value={contract.status} />
                    <MiniInfo label="Entered By" value={contract.enteredBy?.name} />
                    <MiniInfo label="Validated By" value={contract.validatedBy?.name || '—'} />
                    <MiniInfo label="Confirmed By" value={contract.confirmedBy?.name || '—'} />
                    <MiniInfo label="Start Date" value={formatDate(contract.startDate)} />
                    <MiniInfo label="Est. Completion" value={formatDate(contract.estimatedCompletion)} />
                    <MiniInfo label="Payment Schedule" value={`${contract.paymentSchedule?.length || 0} milestones`} />
                  </div>
                ) : <EmptyState text="No contract created yet" />}
              </StageCard>

              {/* CONVERSION DIVIDER */}
              <div style={{ position: 'relative', margin: '8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--border), rgba(52,211,153,0.6))' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20, padding: '6px 16px' }}>
                  <Zap size={16} style={{ color: '#34D399' }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#34D399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Lead Converted → Project Created</span>
                  <Zap size={16} style={{ color: '#34D399' }} />
                </div>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, var(--border), rgba(52,211,153,0.6))' }} />
              </div>

              {/* POST-CONVERSION: Project Stages */}
              <SectionHeader icon={Layers} title="Post-Conversion — Project Lifecycle" color="#34D399" />

              {project ? (
                <>
                  {/* Stage 5–11: Project Phases */}
                  {PROJECT_STAGES.map((stage, idx) => {
                    const status = getProjectStageStatus(stage.id, idx);
                    const phase = project.phaseHistory?.find(h => PHASE_TO_STAGE_MAP[h.phase] === stage.id);
                    const Icon = stage.icon;
                    return (
                      <StageCard
                        key={stage.id}
                        stageNum={idx + 5}
                        name={stage.name}
                        icon={Icon}
                        color={stage.color}
                        status={status}
                        owner={getPhaseOwner(stage.id)}
                        trigger={getPhaseTrigger(stage.id)}
                      >
                        {status !== 'pending' ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            <MiniInfo label="Start Date" value={formatDate(phase?.startDate)} />
                            <MiniInfo label="End Date" value={phase?.endDate ? formatDate(phase.endDate) : status === 'current' ? 'In Progress' : '—'} />
                            <MiniInfo label="Completed By" value={phase?.completedBy || (status === 'current' ? 'Ongoing' : '—')} />
                            {/* Phase-specific details */}
                            {stage.id === 'onboarding' && project.designManager && (
                              <MiniInfo label="Design Manager" value={project.designManager.name} highlight />
                            )}
                            {stage.id === 'design' && (
                              <MiniInfo label="Designs Count" value={`${project.designs?.length || 0} designs`} />
                            )}
                            {stage.id === 'signoff' && (
                              <MiniInfo label="Signed By" value={project.designSignedBy || '—'} highlight />
                            )}
                            {stage.id === 'production' && (
                              <>
                                <MiniInfo label="Production Mgr" value={project.productionManagers?.[0]?.name || '—'} />
                                <MiniInfo label="Progress" value={`${project.productionManagers?.[0]?.progress || 0}%`} highlight />
                              </>
                            )}
                          </div>
                        ) : (
                          <EmptyState text={`Pending — triggers when ${getPhaseTrigger(stage.id).toLowerCase()}`} />
                        )}
                      </StageCard>
                    );
                  })}
                </>
              ) : (
                <Card style={{ padding: 32, textAlign: 'center', border: '1px dashed var(--border)' }}>
                  <Layers size={32} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No project created yet for this lead.</p>
                </Card>
              )}
            </div>

            {/* ── RIGHT: SIDEBAR CARDS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>


              {/* Payment Milestones */}
              {project && (
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Payment Milestones</h3>
                    <div style={{ fontSize: 11 }}>
                      <span style={{ color: '#34D399', fontWeight: 600 }}>{formatCurrency(project.totalPaid)} paid</span>
                    </div>
                  </div>
                  {project.payments?.map((pm, i) => (
                    <div key={i} style={{
                      padding: '12px 18px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                      background: pm.status === 'Paid' ? 'rgba(52,211,153,0.03)' : 'transparent',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: pm.status === 'Paid' ? '#34D399' : 'var(--text-muted)' }}>{pm.milestone}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                            {pm.status === 'Paid' ? `Paid · ${formatDate(pm.date)}` : 'Pending'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>₹{(pm.amount / 100000).toFixed(2)}L</span>
                          {pm.status === 'Paid'
                            ? <CheckCircle size={14} style={{ color: '#34D399' }} />
                            : <Clock size={14} style={{ color: 'var(--text-dim)' }} />
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {/* Quick Actions */}
              <Card style={{ padding: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${selectedLeadId}`)} style={{ justifyContent: 'flex-start', gap: 8 }}>
                    <ExternalLink size={13} /> Open Lead Detail
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/sales-process')} style={{ justifyContent: 'flex-start', gap: 8 }}>
                    <IndianRupee size={13} /> View Sales Process
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/projects')} style={{ justifyContent: 'flex-start', gap: 8 }}>
                    <Layers size={13} /> View Project Lifecycle
                  </Button>
                </div>
              </Card>

              {/* Change Items Progress */}
              <Card style={{ padding: 16, background: 'rgba(168,137,68,0.04)', border: '1px solid rgba(168,137,68,0.2)' }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 12 }}>Pipeline Changes Status</h3>
                {[
                  { label: 'Single unified pipeline view', priority: 'HIGH', done: true },
                  { label: 'Lead detail: Sales + Project tabs', priority: 'HIGH', done: true },
                  { label: 'Stage transition auto-trigger', priority: 'MED', done: false },
                  { label: 'Payment milestone auto-link', priority: 'MED', done: false },
                  { label: 'Combined call timeline', priority: 'LOW', done: false },
                  { label: 'Full funnel dashboard', priority: 'LOW', done: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {item.done
                      ? <CheckCircle size={13} style={{ color: '#34D399', flexShrink: 0 }} />
                      : <Clock size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: 12, color: item.done ? 'var(--text-main)' : 'var(--text-dim)', flex: 1 }}>{item.label}</span>
                    <Badge variant={item.priority === 'HIGH' ? 'hot' : item.priority === 'MED' ? 'warm' : 'gray'} style={{ fontSize: 9 }}>{item.priority}</Badge>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.2); }
          70% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
    </div>
  );
};

// ── HELPER FUNCTIONS ──
const getPhaseOwner = (stageId) => {
  const map = {
    onboarding: 'Designer / PM',
    design: 'Designer',
    signoff: 'Customer + PM',
    production: 'Production Manager',
    qc: 'QC Team',
    installation: 'Site Team',
    handover: 'CRM Head + PM',
  };
  return map[stageId] || '—';
};

const getPhaseTrigger = (stageId) => {
  const map = {
    onboarding: 'Contract Signed',
    design: 'Onboarding Done',
    signoff: 'Design Ready',
    production: 'Design Approved',
    qc: 'Production Done',
    installation: 'Dispatch Done',
    handover: 'Installation OK',
  };
  return map[stageId] || '—';
};

// ── SUB-COMPONENTS ──
const SectionHeader = ({ icon: Icon, title, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
    <Icon size={16} style={{ color }} />
    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
  </div>
);

const StageCard = ({ stageNum, name, icon: Icon, color, status, owner, trigger, children }) => {
  const [expanded, setExpanded] = useState(status !== 'pending');
  return (
    <Card style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${status !== 'pending' ? color : 'var(--border)'}`, opacity: status === 'pending' ? 0.65 : 1 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: status === 'current' ? `${color}08` : 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: status !== 'pending' ? `${color}15` : 'var(--bg-main)', border: `1.5px solid ${status !== 'pending' ? color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {status === 'completed' ? <CheckCircle size={16} style={{ color }} /> : <Icon size={16} style={{ color: status === 'current' ? color : 'var(--text-dim)' }} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 10, padding: '1px 7px' }}>Stage {stageNum}</span>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: status !== 'pending' ? 'var(--text-main)' : 'var(--text-muted)' }}>{name}</h4>
              {status === 'current' && <Badge variant="warm" style={{ fontSize: 9 }}>In Progress</Badge>}
              {status === 'completed' && <Badge variant="success" style={{ fontSize: 9 }}>✓ Done</Badge>}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>Owner: {owner} · Trigger: {trigger}</p>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--text-dim)', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {expanded && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', background: 'var(--bg-main)' }}>
          {children}
        </div>
      )}
    </Card>
  );
};

const MiniInfo = ({ label, value, highlight }) => (
  <div>
    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 3 }}>{label}</p>
    <p style={{ fontSize: 12, fontWeight: highlight ? 700 : 500, color: highlight ? 'var(--text-main)' : 'var(--text-muted)' }}>{value || '—'}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-dim)', fontSize: 12, fontStyle: 'italic' }}>
    {text}
  </div>
);

export default UnifiedPipeline;
