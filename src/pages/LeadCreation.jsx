import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { User, Plus, ArrowRight, ArrowLeft, CheckCircle, Phone, MapPin, Home, FileText, Camera, Globe } from 'lucide-react';
import { regions, builders, leadSources, configurations, possessionStatuses, scopeOptions, expectedServices, languages, projects, stickyRouting, teamMembers, customerTimelines } from '../data/mockData.js';

const LeadCreation = () => {
  const navigate = useNavigate();
  const { addLead } = useLeads();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', alternatePhone: '', email: '', whatsapp: '',
    coApplicantName: '', coApplicantPhone: '', coApplicantEmail: '', coApplicantRelation: '',
    language: 'English',
    project: projects[0].name, builder: projects[0].builder, tower: '', floor: '', unit: '',
    config: '3BHK', area: '', possession: '', possessionStatus: 'Not yet',
    source: 'Inbound Call', referrer: '',
    region: user?.region || 'Bangalore East',
    scope: [], services: [], budget: 15, readiness: 'Within 3 months',
    customerTimeline: 'Next 3 Months', notes: '',
  });

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleProjectChange = (projName) => {
    const p = projects.find(x => x.name === projName);
    if (p) setForm(f => ({ ...f, project: p.name, builder: p.builder, region: p.region }));
    else update('project', projName);
  };

  const handleSubmit = () => {
    // Auto-assignment via sticky routing
    let assignedTo = null, assignedToName = null, assignedRole = 'Pre-sales Executive';
    const stickyMatch = stickyRouting.find(r => r.type === 'Region' && form.region.startsWith(r.match.replace(/ (East|West|North|South)/, '')));
    if (stickyMatch) {
      assignedTo = stickyMatch.assignTo;
      assignedToName = stickyMatch.assignName;
    } else {
      const presales = teamMembers.find(t => t.role === 'Pre-sales Executive' && t.active);
      if (presales) { assignedTo = presales.id; assignedToName = presales.name; }
    }

    addLead({
      ...form,
      value: form.budget || 10,
      coApplicant: form.coApplicantName ? { name: form.coApplicantName, phone: form.coApplicantPhone, email: form.coApplicantEmail, relation: form.coApplicantRelation } : null,
      assignedTo, assignedToName, assignedRole,
      presalesOwner: assignedTo, presalesOwnerName: assignedToName,
      followUpDate: null, followUpSalesDate: null, meetingData: null,
      aiSummary: null, expectedServices: form.services, customerTimeline: form.customerTimeline,
      stylePreference: [], competition: 'None', decisionMaker: 'Not decided', propertyType: 'Residential',
      lastContact: null,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }} className="animate-fade-in">
        <Card style={{ padding: 48, textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} style={{ color: '#34D399' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>Lead Created!</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>"{form.name}" has been added and auto-assigned via sticky routing.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => navigate('/leads')}>View Queue</Button>
            <Button variant="outline" onClick={() => { setSuccess(false); setStep(1); setForm(f => ({ ...f, name: '', phone: '', email: '' })); }}>Add Another</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>New Lead</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Step {step} of 3 — {step === 1 ? 'Contact Info' : step === 2 ? 'Property Details' : 'Services & Notes'}</p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? 'var(--primary)' : 'var(--bg-card)', transition: 'all 0.3s' }} />
        ))}
      </div>

      <Card style={{ padding: 28 }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} /> Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FormField label="Full Name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Rohan Krishnan" />
              <FormField label="Primary Phone *" value={form.phone} onChange={v => update('phone', v)} placeholder="+91 98860 12345" />
              <FormField label="Alternate Phone" value={form.alternatePhone} onChange={v => update('alternatePhone', v)} placeholder="+91" />
              <FormField label="Email" value={form.email} onChange={v => update('email', v)} placeholder="email@example.com" />
              <FormField label="WhatsApp" value={form.whatsapp} onChange={v => update('whatsapp', v)} placeholder="+91" />
              <SelectField label="Language" value={form.language} options={languages} onChange={v => update('language', v)} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} /> Co-Applicant (Optional)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormField label="Name" value={form.coApplicantName} onChange={v => update('coApplicantName', v)} placeholder="Co-applicant name" />
                <FormField label="Phone" value={form.coApplicantPhone} onChange={v => update('coApplicantPhone', v)} placeholder="+91" />
                <FormField label="Email" value={form.coApplicantEmail} onChange={v => update('coApplicantEmail', v)} placeholder="email" />
                <SelectField label="Relation" value={form.coApplicantRelation} options={['', 'Spouse', 'Parent', 'Sibling', 'Friend', 'Business Partner']} onChange={v => update('coApplicantRelation', v)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 8 }}>
              <SelectField label="Lead Source *" value={form.source} options={leadSources} onChange={v => update('source', v)} />
              {['Customer Referral', 'Employee Referral'].includes(form.source) && (
                <FormField label="Referrer Name" value={form.referrer} onChange={v => update('referrer', v)} placeholder="Who referred?" />
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><Home size={18} /> Property Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <SelectField label="Project *" value={form.project} options={projects.map(p => p.name)} onChange={handleProjectChange} />
              <FormField label="Builder" value={form.builder} onChange={v => update('builder', v)} disabled />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, gridColumn: 'span 2' }}>
                <FormField label="Tower" value={form.tower} onChange={v => update('tower', v)} placeholder="e.g. B" />
                <FormField label="Floor" value={form.floor} onChange={v => update('floor', v)} placeholder="e.g. 12" type="number" />
                <FormField label="Flat No." value={form.unit} onChange={v => update('unit', v)} placeholder="e.g. B-1204" />
              </div>
              <SelectField label="Configuration *" value={form.config} options={configurations} onChange={v => update('config', v)} />
              <FormField label="Carpet Area (sqft)" value={form.area} onChange={v => update('area', v)} type="number" placeholder="e.g. 1450" />
              <FormField label="Possession Date" value={form.possession} onChange={v => update('possession', v)} type="date" />
              <SelectField label="Possession Status" value={form.possessionStatus} options={possessionStatuses} onChange={v => update('possessionStatus', v)} />
            </div>
            <SelectField label="Region" value={form.region} options={regions} onChange={v => update('region', v)} />
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={18} /> Expected Services & Notes</h3>
            <div>
              <label style={labelStyle}>Expected Services</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {expectedServices.map(s => {
                  const sel = form.services.includes(s);
                  return <button key={s} onClick={() => update('services', sel ? form.services.filter(x => x !== s) : [...form.services, s])} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: sel ? 'var(--primary-bg)' : 'transparent', border: `1px solid ${sel ? 'var(--primary)' : 'var(--border)'}`, color: sel ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer' }}>{s}</button>;
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Scope of Work</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {scopeOptions.map(s => {
                  const sel = form.scope.includes(s);
                  return <button key={s} onClick={() => update('scope', sel ? form.scope.filter(x => x !== s) : [...form.scope, s])} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: sel ? 'rgba(96,165,250,0.15)' : 'transparent', border: `1px solid ${sel ? '#60A5FA' : 'var(--border)'}`, color: sel ? '#60A5FA' : 'var(--text-muted)', cursor: 'pointer' }}>{s}</button>;
                })}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Budget (₹L)</label>
                <input type="range" min="5" max="100" value={form.budget} onChange={e => update('budget', +e.target.value)} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                  <span>₹5L</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{form.budget}L</span><span>₹1Cr+</span>
                </div>
              </div>
              <SelectField label="Customer Timeline" value={form.customerTimeline} options={customerTimelines} onChange={v => update('customerTimeline', v)} />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Key details..." style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', padding: '10px 14px', fontSize: 13, resize: 'vertical', outline: 'none' }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {step > 1 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={16} style={{ marginRight: 6 }} /> Back</Button> : <div />}
          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} disabled={step === 1 && !form.name}>Next <ArrowRight size={16} style={{ marginLeft: 6 }} /></Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}><CheckCircle size={16} style={{ marginRight: 6 }} /> Create Lead</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

/* Helpers */
const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 8 };

const FormField = ({ label, value, onChange, placeholder, type = 'text', disabled }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width: '100%', background: disabled ? 'var(--bg-card)' : 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', padding: '10px 14px', fontSize: 13, outline: 'none' }} />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', padding: '10px 14px', fontSize: 13 }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default LeadCreation;
