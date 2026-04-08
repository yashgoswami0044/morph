import React, { useState, useMemo } from 'react';
import { Card, Badge, Button } from './ui/index.jsx';
import {
  CheckCircle, Clock, Lock, ChevronRight, User, FileText,
  Calendar, IndianRupee, Package, Clipboard, Truck, Home,
  Paintbrush, AlertCircle, Plus, Send, ExternalLink, Settings
} from 'lucide-react';
import { projectPhases, projectTeam, mockProjects } from '../data/mockData.js';

const inputStyle = { width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none', fontFamily: 'inherit' };

// Role-to-phase edit permissions
const phaseEditRoles = {
  'Onboarding': ['CRM Head', 'Regional Manager'],
  'Design Phase': ['Design Manager', 'CRM Head'],
  'Design Sign-off': ['Sales Manager', 'CRM Head'],
  'Production Phase': ['Production Manager', 'CRM Head'],
  'QC & Dispatch': ['QC Manager', 'Account Manager', 'CRM Head'],
  'Installation': ['Project Manager', 'CRM Head'],
  'Handover': ['Project Manager', 'CRM Head', 'Regional Manager'],
};

const phaseIcons = {
  'Onboarding': Settings,
  'Design Phase': Paintbrush,
  'Design Sign-off': FileText,
  'Production Phase': Package,
  'QC & Dispatch': Clipboard,
  'Installation': Truck,
  'Handover': Home,
};

const ProjectLifecycle = ({ lead, user }) => {
  const project = useMemo(() => mockProjects.find(p => p.leadId === lead?.id), [lead]);
  const [activePhase, setActivePhase] = useState(null);

  if (!project) {
    return (
      <Card style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--border)', background: 'var(--bg-main)' }}>
        <Package size={32} style={{ color: 'var(--text-dim)', margin: '0 auto 12px', opacity: 0.4 }} />
        <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-muted)' }}>No Project Created Yet</p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8 }}>Project lifecycle will appear here after conversion and project setup.</p>
      </Card>
    );
  }

  const currentPhaseIdx = projectPhases.findIndex(p => p.name === project.currentPhase);
  const selectedPhase = activePhase || project.currentPhase;
  const selectedPhaseIdx = projectPhases.findIndex(p => p.name === selectedPhase);
  const canEdit = phaseEditRoles[selectedPhase]?.includes(user?.role) || false;

  const getPhaseStatus = (phase, idx) => {
    if (idx < currentPhaseIdx) return 'completed';
    if (idx === currentPhaseIdx) return 'active';
    return 'upcoming';
  };

  const totalPaid = project.totalPaid || 0;
  const totalPending = project.totalPending || 0;
  const totalContract = project.contractValue || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── PHASE STEPPER ── */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', overflowX: 'auto', background: 'var(--bg-main)' }}>
          {projectPhases.map((phase, idx) => {
            const status = getPhaseStatus(phase, idx);
            const isSelected = phase.name === selectedPhase;
            const Icon = phaseIcons[phase.name] || Package;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.name)}
                style={{
                  flex: '1 0 auto',
                  minWidth: 140,
                  padding: '14px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: isSelected
                    ? `linear-gradient(180deg, ${phase.color}15 0%, transparent 100%)`
                    : 'transparent',
                  borderBottom: isSelected ? `3px solid ${phase.color}` : '3px solid transparent',
                  border: 'none', borderLeft: idx > 0 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'inherit',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: status === 'completed' ? `${phase.color}25` : status === 'active' ? phase.color : 'var(--bg-card)',
                  border: `2px solid ${status === 'upcoming' ? 'var(--border)' : phase.color}`,
                  transition: 'all 0.25s',
                }}>
                  {status === 'completed' ? (
                    <CheckCircle size={14} style={{ color: phase.color }} />
                  ) : (
                    <Icon size={12} style={{ color: status === 'active' ? '#080a0f' : 'var(--text-dim)' }} />
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  color: isSelected ? phase.color : status === 'completed' ? phase.color : status === 'active' ? 'white' : 'var(--text-dim)',
                }}>
                  {phase.name}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── PAYMENT SUMMARY ── */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IndianRupee size={14} style={{ color: 'var(--primary)' }} /> Payment Summary
          </h3>
          <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
            <span style={{ color: '#34D399', fontWeight: 600 }}>Paid: ₹{(totalPaid / 100000).toFixed(1)}L</span>
            <span style={{ color: '#F87171', fontWeight: 600 }}>Pending: ₹{(totalPending / 100000).toFixed(1)}L</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {(project.payments || []).map((p, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 'var(--radius-md)',
              background: p.status === 'Paid' ? 'rgba(52,211,153,0.06)' : 'var(--bg-main)',
              border: `1px solid ${p.status === 'Paid' ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: p.status === 'Paid' ? '#34D399' : '#F87171', textTransform: 'uppercase', marginBottom: 4 }}>
                {p.milestone}
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>₹{(p.amount / 1000).toLocaleString('en-IN')}K</p>
              {p.date && <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                <Calendar size={9} style={{ marginRight: 3 }} />{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>}
              {!p.date && <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, opacity: 0.5 }}>Pending</p>}
            </div>
          ))}
        </div>
      </Card>

      {/* ── PHASE DETAIL CONTENT ── */}
      <PhaseContent
        phase={selectedPhase}
        project={project}
        canEdit={canEdit}
        user={user}
      />

      {/* ── EDIT PERMISSION NOTICE ── */}
      {!canEdit && (
        <div style={{
          padding: 12, display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: 'var(--radius-md)',
        }}>
          <Lock size={14} style={{ color: '#FBBF24' }} />
          <span style={{ fontSize: 12, color: '#FBBF24' }}>
            You can view this phase but editing requires {(phaseEditRoles[selectedPhase] || []).join(' or ')} role.
          </span>
        </div>
      )}
    </div>
  );
};

/* ── Phase-specific content ── */
const PhaseContent = ({ phase, project, canEdit, user }) => {
  const phaseData = projectPhases.find(p => p.name === phase);
  const phaseColor = phaseData?.color || '#9CA3AF';

  switch (phase) {
    case 'Onboarding': return <OnboardingPhase project={project} canEdit={canEdit} color={phaseColor} />;
    case 'Design Phase': return <DesignPhase project={project} canEdit={canEdit} color={phaseColor} />;
    case 'Design Sign-off': return <DesignSignoffPhase project={project} canEdit={canEdit} color={phaseColor} />;
    case 'Production Phase': return <ProductionPhase project={project} canEdit={canEdit} color={phaseColor} />;
    case 'QC & Dispatch': return <QCPhase project={project} canEdit={canEdit} color={phaseColor} />;
    case 'Installation': return <InstallationPhase project={project} canEdit={canEdit} color={phaseColor} />;
    case 'Handover': return <HandoverPhase project={project} canEdit={canEdit} color={phaseColor} />;
    default: return null;
  }
};

/* ── ONBOARDING ── */
const OnboardingPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={Settings} color={color} title="Onboarding" desc="10% payment collection & customer onboarding" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
      <InfoRow label="Payment Status" value={project.onboardingPayment?.status || 'Pending'} badge badgeColor={project.onboardingPayment?.status === 'Paid' ? '#34D399' : '#F87171'} />
      <InfoRow label="Amount" value={`₹${((project.onboardingPayment?.amount || 0) / 100000).toFixed(1)}L`} />
      <InfoRow label="Payment Mode" value={project.onboardingPayment?.mode || '—'} />
      <InfoRow label="SAP Validated" value={project.onboardingPayment?.sapValidated ? `Yes (${project.onboardingPayment.sapRef})` : 'No'} />
      {project.onboardingPayment?.date && <InfoRow label="Date" value={new Date(project.onboardingPayment.date).toLocaleDateString('en-IN')} />}
    </div>
    {canEdit && (
      <Button variant="primary" size="sm" style={{ marginTop: 16 }}>
        <CheckCircle size={13} style={{ marginRight: 6 }} /> Mark Onboarding Complete
      </Button>
    )}
  </Card>
);

/* ── DESIGN PHASE ── */
const DesignPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={Paintbrush} color={color} title="Design Phase" desc="Design iterations with customer" />
    {project.designManager && (
      <div style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={16} style={{ color }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{project.designManager.name}</p>
          <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Design Manager · Assigned {new Date(project.designManager.assignedDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>
    )}
    <div style={{ marginTop: 16 }}>
      <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Design Versions</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(project.designs || []).map(d => (
          <div key={d.id} style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{d.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{d.version} · ₹{(d.costing / 100000).toFixed(1)}L · {new Date(d.createdDate).toLocaleDateString('en-IN')}</p>
            </div>
            <Badge variant={d.status === 'Approved' ? 'success' : d.status === 'Revised' ? 'warm' : 'nurture'} style={{ fontSize: 9 }}>
              {d.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
    {canEdit && (
      <Button variant="outline" size="sm" style={{ marginTop: 14 }}>
        <Plus size={13} style={{ marginRight: 6 }} /> Upload New Design
      </Button>
    )}
  </Card>
);

/* ── DESIGN SIGN-OFF ── */
const DesignSignoffPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={FileText} color={color} title="Design Sign-off" desc="Design approval & 50% payment" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
      <InfoRow label="Design Signed Off" value={project.designSignedOff ? 'Yes' : 'No'} badge badgeColor={project.designSignedOff ? '#34D399' : '#F87171'} />
      {project.designSignOffDate && <InfoRow label="Sign-off Date" value={new Date(project.designSignOffDate).toLocaleDateString('en-IN')} />}
      {project.designSignedBy && <InfoRow label="Signed By" value={project.designSignedBy} />}
      <InfoRow label="50% Payment" value={project.designPayment?.status || 'Pending'} badge badgeColor={project.designPayment?.status === 'Paid' ? '#34D399' : '#F87171'} />
    </div>
    {!project.designSignedOff && canEdit && (
      <div style={{ marginTop: 14, padding: 12, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.15)' }}>
        <p style={{ fontSize: 12, color: '#F87171', display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={13} /> Do NOT move to production until design is signed AND 50% payment collected.
        </p>
      </div>
    )}
  </Card>
);

/* ── PRODUCTION PHASE ── */
const ProductionPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={Package} color={color} title="Production Phase" desc="Manufacturing & progress tracking" />
    <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 16, marginBottom: 10 }}>Production Managers</h4>
    {(project.productionManagers || []).map(pm => (
      <div key={pm.id} style={{ padding: 14, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{pm.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Scope: {pm.scope}</p>
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{pm.progress}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pm.progress}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, borderRadius: 3, transition: 'width 0.4s' }} />
        </div>
      </div>
    ))}
    {canEdit && (
      <Button variant="outline" size="sm" style={{ marginBottom: 16 }}>
        <Plus size={13} style={{ marginRight: 6 }} /> Add Another PM
      </Button>
    )}
    {(project.productionManagers || []).length > 1 && (
      <div style={{ padding: 10, background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248,113,113,0.15)', marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: '#F87171', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={12} /> Production Manager 1's work & progress is NOT visible to Production Manager 2.
        </p>
      </div>
    )}
    <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 8, marginBottom: 10 }}>Production Notes</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(project.productionNotes || []).map((note, i) => (
        <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-main)' }}>{note.note}</p>
          <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{note.by} · {new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      ))}
    </div>
    {canEdit && (
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input placeholder="Add production note..." style={{ ...inputStyle, flex: 1 }} />
        <Button variant="primary" size="sm"><Plus size={13} /></Button>
      </div>
    )}
  </Card>
);

/* ── QC & DISPATCH ── */
const QCPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={Clipboard} color={color} title="QC & Dispatch" desc="Quality check & dispatch coordination" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
      <InfoRow label="QC Manager" value={project.qcManager?.name || 'Not Assigned'} />
      <InfoRow label="Dispatch Date" value={project.dispatchDate ? new Date(project.dispatchDate).toLocaleDateString('en-IN') : 'Not Scheduled'} />
    </div>
    {(project.qcChecklist || []).length > 0 && (
      <div style={{ marginTop: 14 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10 }}>QC Checklist</h4>
        {project.qcChecklist.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <CheckCircle size={14} style={{ color: item.passed ? '#34D399' : 'var(--text-dim)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.item}</span>
          </div>
        ))}
      </div>
    )}
    {canEdit && !project.qcManager && (
      <Button variant="primary" size="sm" style={{ marginTop: 16 }}>
        <User size={13} style={{ marginRight: 6 }} /> Assign QC Manager
      </Button>
    )}
  </Card>
);

/* ── INSTALLATION ── */
const InstallationPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={Truck} color={color} title="Installation" desc="On-site installation & progress" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
      <InfoRow label="Project Manager" value={project.projectManager?.name || 'Not Assigned'} />
      <InfoRow label="Progress" value={`${project.installationProgress || 0}%`} />
    </div>
    {project.installationProgress > 0 && (
      <div style={{ marginTop: 12, height: 8, background: 'var(--bg-main)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${project.installationProgress}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, borderRadius: 4 }} />
      </div>
    )}
    {(project.installationNotes || []).length > 0 && (
      <div style={{ marginTop: 14 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10 }}>Installation Notes</h4>
        {project.installationNotes.map((note, i) => (
          <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 6 }}>
            <p style={{ fontSize: 13, color: 'var(--text-main)' }}>{note.note}</p>
            <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{note.by} · {new Date(note.date).toLocaleDateString('en-IN')}</p>
          </div>
        ))}
      </div>
    )}
    {canEdit && !project.projectManager && (
      <Button variant="primary" size="sm" style={{ marginTop: 16 }}>
        <User size={13} style={{ marginRight: 6 }} /> Assign Project Manager
      </Button>
    )}
  </Card>
);

/* ── HANDOVER ── */
const HandoverPhase = ({ project, canEdit, color }) => (
  <Card style={{ padding: 20, borderLeft: `3px solid ${color}` }}>
    <SectionHeader icon={Home} color={color} title="Handover" desc="OTP verification & final handover" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
      <InfoRow label="Handover Status" value={project.handoverCompleted ? 'Completed' : 'Pending'} badge badgeColor={project.handoverCompleted ? '#34D399' : '#F87171'} />
      {project.handoverDate && <InfoRow label="Handover Date" value={new Date(project.handoverDate).toLocaleDateString('en-IN')} />}
      <InfoRow label="OTP Verified" value={project.handoverOtp ? 'Yes' : 'Not Yet'} />
      <InfoRow label="10% Payment" value={(project.payments || []).find(p => p.milestone.includes('Handover'))?.status || 'Pending'} badge badgeColor={(project.payments || []).find(p => p.milestone.includes('Handover'))?.status === 'Paid' ? '#34D399' : '#F87171'} />
    </div>
    {canEdit && !project.handoverCompleted && (
      <Button variant="primary" size="sm" style={{ marginTop: 16 }}>
        <CheckCircle size={13} style={{ marginRight: 6 }} /> Send Handover OTP
      </Button>
    )}
    {project.handoverCompleted && (
      <div style={{ marginTop: 16, padding: 16, background: 'rgba(52,211,153,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.2)', textAlign: 'center' }}>
        <CheckCircle size={28} style={{ color: '#34D399', margin: '0 auto 8px' }} />
        <p style={{ fontSize: 16, fontWeight: 700, color: '#34D399' }}>Project Handed Over</p>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Congratulations! The project has been successfully delivered.</p>
      </div>
    )}
  </Card>
);

/* ── Shared helpers ── */
const SectionHeader = ({ icon: Icon, color, title, desc }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{desc}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value, badge, badgeColor }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    {badge ? (
      <span style={{ fontSize: 13, fontWeight: 600, color: badgeColor || 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor }} />
        {value}
      </span>
    ) : (
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{value}</span>
    )}
  </div>
);

export default ProjectLifecycle;
