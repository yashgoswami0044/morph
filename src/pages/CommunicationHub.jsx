import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  MessageSquare, Mail, Phone, Send, Plus, Edit, Trash2, CheckCircle,
  AlertTriangle, Settings, Copy, ExternalLink, Lock, Eye, Smartphone,
  CreditCard, Link as LinkIcon, Globe, Zap, Clock
} from 'lucide-react';

const CommunicationHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('whatsapp');

  // ── WhatsApp Templates ──
  const [waTemplates] = useState([
    { id: 'WA01', name: 'Welcome - New Lead', status: 'Approved', category: 'Marketing', language: 'English',
      body: 'Hi {{1}}, welcome to Morph Interiors! We specialize in premium home interiors. Your dedicated consultant {{2}} will reach out shortly. For queries: {{3}}',
      variables: ['Customer Name', 'Executive Name', 'CRM Phone'], lastUsed: '2026-04-03', sends: 342 },
    { id: 'WA02', name: 'Meeting Confirmation', status: 'Approved', category: 'Utility', language: 'English',
      body: 'Dear {{1}}, your site visit is confirmed for {{2}} at {{3}}. For any queries, contact CRM: {{4}}. See you there!',
      variables: ['Customer Name', 'Date & Time', 'Location', 'CRM Number'], lastUsed: '2026-04-04', sends: 218 },
    { id: 'WA03', name: 'Estimation Shared', status: 'Approved', category: 'Utility', language: 'English',
      body: 'Hi {{1}}, your estimation ({{2}}) for {{3}} has been shared. Total: ₹{{4}}. Valid until {{5}}. View: {{6}}',
      variables: ['Customer Name', 'EST ID', 'Project', 'Amount', 'Valid Date', 'Link'], lastUsed: '2026-04-03', sends: 89 },
    { id: 'WA04', name: 'Payment Link', status: 'Approved', category: 'Utility', language: 'English',
      body: 'Dear {{1}}, please complete your payment of ₹{{2}} for {{3}}. Pay online: {{4}}. For help, call: {{5}}',
      variables: ['Customer Name', 'Amount', 'Project', 'Payment URL', 'CRM Number'], lastUsed: '2026-04-02', sends: 56 },
    { id: 'WA05', name: 'Design PDF Share', status: 'Approved', category: 'Utility', language: 'English',
      body: 'Hi {{1}}, your design revision {{2}} for {{3}} is ready! Download: {{4}}. Feedback welcome.',
      variables: ['Customer Name', 'Version', 'Project', 'PDF URL'], lastUsed: '2026-04-01', sends: 41 },
    { id: 'WA06', name: 'Follow-up Reminder', status: 'Pending', category: 'Marketing', language: 'English',
      body: 'Hi {{1}}, this is {{2}} from Morph Interiors. We had a great conversation about your {{3}}. Would love to schedule a visit. Shall we?',
      variables: ['Customer Name', 'Executive Name', 'Project'], lastUsed: null, sends: 0 },
  ]);

  // ── Email Templates ──
  const [emailTemplates] = useState([
    { id: 'EM01', name: 'Welcome Email', subject: 'Welcome to Morph Interiors – Your Home Transformation Begins', status: 'Active',
      body: 'Dear {name},\n\nThank you for your interest in Morph Interiors. Your dedicated interior consultant {exec_name} will be in touch shortly.\n\nWe look forward to transforming your {project} into your dream home.\n\nBest regards,\nTeam Morph Interiors',
      variables: ['name', 'exec_name', 'project'], lastUsed: '2026-04-04', sends: 512 },
    { id: 'EM02', name: 'Estimation Document', subject: 'Your Interior Estimation – {est_id}', status: 'Active',
      body: 'Dear {name},\n\nPlease find attached your estimation ({est_id}) for {project}.\n\nTotal: ₹{amount} (incl. GST)\nValid until: {valid_date}\n\nFor any queries, reach us at crm@morphinteriors.com\n\nAttachment: {pdf_link}',
      variables: ['name', 'est_id', 'project', 'amount', 'valid_date', 'pdf_link'], lastUsed: '2026-04-03', sends: 89 },
    { id: 'EM03', name: 'Payment Confirmation', subject: 'Payment Received – ₹{amount}', status: 'Active',
      body: 'Dear {name},\n\nWe confirm receipt of ₹{amount} via {mode} for project {project}.\n\nReceipt will be shared by our accounts team within 24 hours.\n\nThank you.',
      variables: ['name', 'amount', 'mode', 'project'], lastUsed: '2026-04-01', sends: 45 },
    { id: 'EM04', name: 'Design PDF', subject: 'Design Revision {version} – {project}', status: 'Active',
      body: 'Dear {name},\n\nAttached is design revision {version} for your {project} home.\n\nCosting: ₹{cost}\n\nPlease review and share your feedback.\n\nBest,\n{designer_name}\nDesign Manager, Morph Interiors',
      variables: ['name', 'version', 'project', 'cost', 'designer_name'], lastUsed: '2026-04-02', sends: 67 },
  ]);

  // ── SMS Templates ──
  const [smsTemplates] = useState([
    { id: 'SMS01', name: 'Meeting Reminder', status: 'Active', dlt: 'DLT-1107160001',
      body: 'Dear {#var#}, your visit at Morph Interiors is on {#var#} at {#var#}. Contact CRM: {#var#} for changes. -Morph',
      variables: ['Name', 'Date', 'Location', 'CRM Phone'], sends: 328 },
    { id: 'SMS02', name: 'Payment Link', status: 'Active', dlt: 'DLT-1107160002',
      body: 'Dear {#var#}, pay ₹{#var#} for Morph Interiors via {#var#}. For help: {#var#}. -Morph',
      variables: ['Name', 'Amount', 'Payment URL', 'CRM Phone'], sends: 129 },
    { id: 'SMS03', name: 'OTP Verification', status: 'Active', dlt: 'DLT-1107160003',
      body: 'Your OTP for Morph Interiors handover verification is {#var#}. Valid for 10 minutes. -Morph',
      variables: ['OTP Code'], sends: 87 },
  ]);

  // Integration configs
  const integrations = {
    whatsapp: { provider: 'Gupshup', accountId: 'morph-interiors-prod', status: 'Connected', apiKey: '••••••••••••ab3f', webhook: 'https://api.morph.in/webhooks/gupshup' },
    email: { provider: 'SMTP (SendGrid)', host: 'smtp.sendgrid.net', port: 587, from: 'crm@morphinteriors.com', status: 'Connected' },
    sms: { provider: 'MSG91', senderId: 'MORPHI', dltEntityId: 'DLT-1107160000', status: 'Connected', apiKey: '••••••••••••7e2a' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Communication Hub</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>WhatsApp, Email & SMS templates with integration configuration.</p>
      </div>

      {/* Channel Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, count: waTemplates.length, color: '#25D366' },
          { key: 'email', label: 'Email', icon: Mail, count: emailTemplates.length, color: '#60A5FA' },
          { key: 'sms', label: 'SMS', icon: Phone, count: smsTemplates.length, color: '#FBBF24' },
          { key: 'payment', label: 'Payment Links', icon: CreditCard, count: null, color: '#34D399' },
          { key: 'config', label: 'Integration Config', icon: Settings, count: null, color: '#8B5CF6' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500,
            background: activeTab === t.key ? 'var(--primary)' : 'transparent',
            color: activeTab === t.key ? 'white' : 'var(--text-muted)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><t.icon size={14} />{t.label} {t.count != null && <Badge variant="gray" style={{ fontSize: 9 }}>{t.count}</Badge>}</button>
        ))}
      </div>

      {/* ── WhatsApp ── */}
      {activeTab === 'whatsapp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ padding: 14, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)' }}>
            <p style={{ fontSize: 12, color: '#25D366' }}><Zap size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />Provider: <strong>Gupshup</strong> · New account required per spec. Templates need Gupshup + Meta approval before use.</p>
          </Card>
          {waTemplates.map(t => (
            <Card key={t.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MessageSquare size={16} style={{ color: '#25D366' }} />
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{t.name}</h4>
                  <Badge variant={t.status === 'Approved' ? 'success' : 'warm'}>{t.status}</Badge>
                  <Badge variant="gray" style={{ fontSize: 9 }}>{t.category}</Badge>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t.sends} sends</span>
              </div>
              <div style={{ padding: '14px 20px', background: 'var(--bg-main)' }}>
                <pre style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontFamily: 'inherit' }}>{t.body}</pre>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {t.variables.map((v, i) => <Badge key={i} variant="gray" style={{ fontSize: 9 }}>{'{{' + (i + 1) + '}}'} = {v}</Badge>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Email ── */}
      {activeTab === 'email' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ padding: 14, background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)' }}>
            <p style={{ fontSize: 12, color: '#60A5FA' }}><Mail size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />SMTP: <strong>SendGrid</strong> · Credentials required. From: crm@morphinteriors.com</p>
          </Card>
          {emailTemplates.map(t => (
            <Card key={t.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail size={16} style={{ color: '#60A5FA' }} />
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{t.name}</h4>
                  <Badge variant="success">{t.status}</Badge>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t.sends} sends</span>
              </div>
              <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Subject: </span>
                <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 500 }}>{t.subject}</span>
              </div>
              <div style={{ padding: '14px 20px', background: 'var(--bg-main)' }}>
                <pre style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontFamily: 'inherit' }}>{t.body}</pre>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── SMS ── */}
      {activeTab === 'sms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ padding: 14, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p style={{ fontSize: 12, color: '#FBBF24' }}><Phone size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />Provider: <strong>MSG91</strong> · DLT registration required. Entity ID and API details must be configured.</p>
          </Card>
          {smsTemplates.map(t => (
            <Card key={t.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Smartphone size={16} style={{ color: '#FBBF24' }} />
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{t.name}</h4>
                  <Badge variant="success">{t.status}</Badge>
                  <Badge variant="gray" style={{ fontSize: 9 }}>{t.dlt}</Badge>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t.sends} sends</span>
              </div>
              <div style={{ padding: '14px 20px', background: 'var(--bg-main)' }}>
                <pre style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontFamily: 'inherit' }}>{t.body}</pre>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {t.variables.map((v, i) => <Badge key={i} variant="gray" style={{ fontSize: 9 }}>Var {i + 1} = {v}</Badge>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Payment Links ── */}
      {activeTab === 'payment' && <PaymentLinkSection />}

      {/* ── Integration Config ── */}
      {activeTab === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(integrations).map(([key, cfg]) => (
            <Card key={key} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>{key} Integration</h3>
                <Badge variant={cfg.status === 'Connected' ? 'success' : 'hot'}>{cfg.status}</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {Object.entries(cfg).filter(([k]) => k !== 'status').map(([k, v]) => (
                  <div key={k} style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{k.replace(/([A-Z])/g, ' $1')}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, wordBreak: 'break-all' }}>{v}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Payment Link Generation ──
const PaymentLinkSection = () => {
  const [links, setLinks] = useState([
    { id: 'PL001', customer: 'Vijay Kumar', amount: 2550000, project: 'Embassy Lake Terraces', status: 'Sent', sentVia: 'WhatsApp + Email', ccavenueId: 'MORPH-PL001', createdAt: '2026-04-01T10:00:00', paidAt: '2026-04-01T14:00:00', mailSentToSales: true },
    { id: 'PL002', customer: 'Amit Hegde', amount: 823935, project: 'Godrej Eternity', status: 'Pending', sentVia: 'WhatsApp', ccavenueId: 'MORPH-PL002', createdAt: '2026-04-04T09:00:00', paidAt: null, mailSentToSales: false },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ customer: '', amount: '', project: '', via: 'WhatsApp + Email' });

  const handleCreate = () => {
    const newLink = {
      id: `PL-${Date.now()}`, customer: form.customer, amount: parseFloat(form.amount) * 100000,
      project: form.project, status: 'Sent', sentVia: form.via,
      ccavenueId: `MORPH-PL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(), paidAt: null, mailSentToSales: false,
    };
    setLinks(prev => [newLink, ...prev]);
    setShowCreate(false);
    setForm({ customer: '', amount: '', project: '', via: 'WhatsApp + Email' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card style={{ padding: 14, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
        <p style={{ fontSize: 12, color: '#34D399' }}><CreditCard size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          <strong>Flow:</strong> 1. Sales team creates link → 2. Customer receives via WhatsApp & Email → 3. After payment, mail sent to sales team</p>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={14} style={{ marginRight: 6 }} /> Create Payment Link
        </Button>
      </div>

      {showCreate && (
        <Card style={{ padding: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 14 }}>Create Payment Link</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Customer</label>
              <input value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} placeholder="Customer name" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Amount (₹L)</label>
              <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} type="number" placeholder="8.50" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Project</label>
              <input value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} placeholder="Project name" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Send Via</label>
              <select value={form.via} onChange={e => setForm(f => ({ ...f, via: e.target.value }))} style={inputStyle}>
                <option>WhatsApp + Email</option><option>WhatsApp</option><option>Email</option>
              </select>
            </div>
          </div>
          <Button variant="primary" style={{ marginTop: 14 }} onClick={handleCreate}>
            <LinkIcon size={14} style={{ marginRight: 6 }} /> Generate & Send Link
          </Button>
        </Card>
      )}

      {links.map(l => (
        <Card key={l.id} style={{ padding: 0, overflow: 'hidden', border: l.paidAt ? '1px solid rgba(52,211,153,0.2)' : '1px solid var(--border)' }}>
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {l.paidAt ? <CheckCircle size={18} style={{ color: '#34D399' }} /> : <Clock size={18} style={{ color: '#FBBF24' }} />}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{l.customer}</h4>
                <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{l.project} · {l.ccavenueId}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: l.paidAt ? '#34D399' : 'white' }}>₹{l.amount.toLocaleString()}</p>
              <Badge variant={l.paidAt ? 'success' : 'warm'}>{l.paidAt ? 'Paid' : 'Pending'}</Badge>
            </div>
          </div>
          <div style={{ padding: '10px 20px', display: 'flex', gap: 20, background: 'var(--bg-main)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Sent via: <strong style={{ color: 'var(--text-muted)' }}>{l.sentVia}</strong></span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Created: {new Date(l.createdAt).toLocaleDateString()}</span>
            {l.paidAt && <span style={{ fontSize: 11, color: '#34D399' }}>Paid: {new Date(l.paidAt).toLocaleDateString()}</span>}
            {l.mailSentToSales && <span style={{ fontSize: 11, color: '#60A5FA' }}>✉ Mail sent to sales</span>}
            {l.paidAt && !l.mailSentToSales && <Badge variant="warm" style={{ fontSize: 9 }}>Mail pending to sales</Badge>}
          </div>
        </Card>
      ))}
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13, outline: 'none' };

export default CommunicationHub;
