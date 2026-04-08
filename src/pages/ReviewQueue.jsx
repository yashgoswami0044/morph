import React, { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import {
  CheckCircle, XCircle, ArrowRight, User, IndianRupee,
  Home, Clock, AlertTriangle, AlertOctagon, Layers, Calendar, ArrowRightLeft
} from 'lucide-react';
import { teamMembers, statusColors } from '../data/mockData.js';

const ReviewQueue = () => {
  const { leads, updateLead, transitionStatus, assignLead } = useLeads();
  const { user } = useAuth();

  // Validated leads waiting for Sales Manager to review OR Not Qualified for Regional Manager
  const reviewItems = useMemo(() => {
    const validated = leads.filter(l => l.status === 'Validated' && l.assignedRole === 'Sales Manager');
    const notQual = leads.filter(l => l.status === 'Not Qualified');
    return [...validated.map(l => ({ ...l, reviewType: 'validated' })), ...notQual.map(l => ({ ...l, reviewType: 'notqualified' }))];
  }, [leads]);

  const [returningId, setReturningId] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  const handleApprove = (id) => {
    // Assign to Sales Executive
    const se = teamMembers.find(t => t.role === 'Sales Executive' && t.active);
    if (se) assignLead(id, se.id, user?.name);
  };

  const handleReturn = (id) => {
    if (!returnReason.trim()) return;
    updateLead(id, { notes: `[Returned by Manager] ${returnReason}` });
    transitionStatus(id, 'Attempted', user?.name || 'Manager');
    setReturningId(null);
    setReturnReason('');
  };

  const handleEscalate = (id) => {
    const crmHead = teamMembers.find(t => t.role === 'CRM Head');
    if (crmHead) assignLead(id, crmHead.id, user?.name);
  };

  const handleRecycle = (id) => {
    transitionStatus(id, 'Validated', user?.name || 'Regional Manager');
  };

  const handleAssignPresales = (id) => {
    const presales = teamMembers.find(t => t.role === 'Pre-sales Executive' && t.active);
    if (presales) assignLead(id, presales.id, user?.name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Review Queue</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Approve validated leads for sales handoff, or review not-qualified leads for recycling.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Badge variant="warm" style={{ fontSize: 14, padding: '6px 12px' }}>{reviewItems.filter(r => r.reviewType === 'validated').length} Validated</Badge>
          <Badge variant="hot" style={{ fontSize: 14, padding: '6px 12px' }}>{reviewItems.filter(r => r.reviewType === 'notqualified').length} Not Qualified</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {reviewItems.map(lead => (
          <ReviewCard
            key={lead.id}
            lead={lead}
            onApprove={() => handleApprove(lead.id)}
            onReturn={() => {
              if (returningId === lead.id) handleReturn(lead.id);
              else { setReturningId(lead.id); setReturnReason(''); }
            }}
            onEscalate={() => handleEscalate(lead.id)}
            onRecycle={() => handleRecycle(lead.id)}
            onAssignPresales={() => handleAssignPresales(lead.id)}
            isReturning={returningId === lead.id}
            returnReason={returnReason}
            onReturnReasonChange={setReturnReason}
            onCancelReturn={() => setReturningId(null)}
          />
        ))}

        {reviewItems.length === 0 && (
          <Card style={{ padding: 80, textAlign: 'center', background: 'var(--bg-main)', border: '1px dashed var(--border)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} style={{ color: '#34D399' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Queue is Clear!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>All leads have been processed.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

const ReviewCard = ({ lead, onApprove, onReturn, onEscalate, onRecycle, onAssignPresales, isReturning, returnReason, onReturnReasonChange, onCancelReturn }) => {
  const isNotQualified = lead.reviewType === 'notqualified';
  const scoreColor = statusColors[lead.status]?.color || 'var(--primary)';
  const sc = statusColors[lead.status] || {};



  return (
    <Card style={{ padding: 0, overflow: 'hidden', border: isNotQualified ? '1px solid rgba(248,113,113,0.3)' : isReturning ? '1px solid #FBBF24' : '1px solid var(--border)', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', background: isNotQualified ? 'rgba(248,113,113,0.04)' : 'var(--bg-main)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${scoreColor}15`, fontWeight: 700, color: scoreColor, fontSize: 18, boxShadow: `0 0 10px ${scoreColor}40` }}>
            {lead.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)' }}>{lead.name}</h3>
              <Badge variant="outline" style={{ ...sc, fontSize: 10 }}>{lead.status}</Badge>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={13} /> {lead.presalesOwnerName || 'Unassigned'}
              {lead.coApplicants && lead.coApplicants.length > 0 && <span style={{ color: 'var(--primary-light)' }}> + {lead.coApplicants[0].name} {lead.coApplicants.length > 1 ? `(+${lead.coApplicants.length - 1})` : ''}</span>}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <MetaItem icon={Home} label="Project" value={lead.project} />
          <MetaItem icon={Layers} label="Config" value={`${lead.config} · ${lead.area || '-'} sq ft`} />
          <MetaItem icon={IndianRupee} label="Value" value={`₹${lead.value}L`} highlight={lead.value >= 25} />
          <MetaItem icon={Calendar} label="Possession" value={lead.possession ? new Date(lead.possession).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-'} />
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: 260, padding: 20, borderRight: '1px solid var(--border)', background: 'var(--bg-card)', flexShrink: 0 }}>
          {/* Services tags */}
          {lead.expectedServices?.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <h5 style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>Services</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {lead.expectedServices.map(s => <Badge key={s} variant="outline" style={{ fontSize: 9, padding: '2px 6px', background: 'var(--bg-main)' }}>{s}</Badge>)}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div style={{ flex: 1, padding: 20 }}>
          {isNotQualified && lead.notQualifiedReason && (
            <div style={{ padding: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#F87171', marginBottom: 4 }}>Not Qualified Reason</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{lead.notQualifiedReason}</p>
            </div>
          )}

          {lead.aiSummary && (
            <div style={{ padding: 12, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#8B5CF6', marginBottom: 4 }}>✨ AI Summary</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{lead.aiSummary}</p>
            </div>
          )}

          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{lead.notes || 'No notes.'}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(lead.scope || []).map(s => <Badge key={s} variant="outline" style={{ background: 'var(--bg-main)' }}>{s}</Badge>)}
            {lead.readiness && <Badge variant="outline" style={{ background: 'var(--bg-main)' }}>{lead.readiness}</Badge>}
            {lead.customerTimeline && <Badge variant="outline" style={{ background: 'var(--bg-main)' }}>{lead.customerTimeline}</Badge>}
          </div>

          {/* Return form */}
          {isReturning && (
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(251,191,36,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(251,191,36,0.3)', animation: 'fadeIn 0.2s' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#FBBF24', marginBottom: 10, display: 'block' }}>Return to Executive — Reason</label>
              <textarea value={returnReason} onChange={e => onReturnReasonChange(e.target.value)} placeholder="e.g. Needs more information. Did you confirm budget?" rows={3} autoFocus
                style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid rgba(251,191,36,0.4)', color: 'var(--text-main)', padding: 14, borderRadius: 'var(--radius-md)', fontSize: 14, resize: 'none', outline: 'none' }} />
              <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                <Button onClick={onReturn} style={{ background: '#FBBF24', color: '#000', fontWeight: 700, opacity: returnReason.trim() ? 1 : 0.5 }}>Confirm Return</Button>
                <Button variant="ghost" onClick={onCancelReturn}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isReturning && (
          <div style={{ width: 200, padding: 20, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', background: 'var(--bg-main)' }}>
            {isNotQualified ? (
              <>
                <ActionBtn color="#34D399" label="Recycle to Validated" icon={ArrowRightLeft} onClick={onRecycle} />
                <ActionBtn color="#60A5FA" label="Assign to Pre-sales" icon={User} onClick={onAssignPresales} />
                <ActionBtn color="#F87171" label="Escalate to CRM Head" icon={AlertOctagon} onClick={onEscalate} />
              </>
            ) : (
              <>
                <ActionBtn color="#34D399" label="Approve & Handoff" icon={CheckCircle} onClick={onApprove} />
                <ActionBtn color="#FBBF24" label="Return to Exec" icon={ArrowRight} onClick={onReturn} />
                {lead.value >= 25 && <ActionBtn color="#F87171" label="Escalate Alert" icon={AlertOctagon} onClick={onEscalate} />}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const ActionBtn = ({ color, label, icon: Icon, onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}40`, cursor: 'pointer', transition: 'all 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.background = `${color}25`}
    onMouseLeave={e => e.currentTarget.style.background = `${color}15`}>
    <Icon size={16} /> {label}
  </button>
);

const MetaItem = ({ icon: Icon, label, value, highlight }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Icon size={12} /> {label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color: highlight ? '#34D399' : 'var(--text-main)' }}>{value}</span>
  </div>
);

export default ReviewQueue;
