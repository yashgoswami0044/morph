import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/index.jsx';
import {
  Database, UploadCloud, Users, Bell, Search, Plus,
  Trash2, Edit, Save, FileText, CheckCircle, MapPin, Check,
  AlertTriangle, ArrowRightLeft, BookOpen, Zap, Target, Shield, Smartphone, Lock
} from 'lucide-react';
import { builders, projects, teamMembers, notificationRules, escalationMatrix, stickyRouting, masterFields } from '../data/mockData.js';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('team');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>System Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Configure teams, data masters, routing, escalation, and integrations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TabItem icon={Users} label="Team Management" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
          <TabItem icon={Database} label="Builder Master" active={activeTab === 'builder'} onClick={() => setActiveTab('builder')} />
          <TabItem icon={UploadCloud} label="CSV Upload" active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
          <TabItem icon={Bell} label="Notification Rules" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <TabItem icon={AlertTriangle} label="Escalation Matrix" active={activeTab === 'escalation'} onClick={() => setActiveTab('escalation')} />
          <TabItem icon={ArrowRightLeft} label="Sticky Routing" active={activeTab === 'sticky'} onClick={() => setActiveTab('sticky')} />
          <TabItem icon={FileText} label="Master Fields" active={activeTab === 'fields'} onClick={() => setActiveTab('fields')} />

          <TabItem icon={Shield} label="Access Management" active={activeTab === 'access'} onClick={() => setActiveTab('access')} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activeTab === 'team' && <TeamManagement />}
          {activeTab === 'builder' && <BuilderMaster />}
          {activeTab === 'upload' && <CSVUpload />}
          {activeTab === 'notifications' && <NotificationRules />}
          {activeTab === 'escalation' && <EscalationConfig />}
          {activeTab === 'sticky' && <StickyRoutingConfig />}
          {activeTab === 'fields' && <MasterFieldsList />}

          {activeTab === 'access' && <AccessManagement />}
        </div>
      </div>
    </div>
  );
};

/* ── TEAM ── */
const TeamManagement = () => (
  <Card style={{ padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Team Management</h3>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>All roles: Pre-sales, Sales, Regional Manager, CRM Head.</p>
      </div>
      <Button variant="primary" size="sm"><Plus size={16} style={{ marginRight: 6 }} /> Add Member</Button>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {teamMembers.map(member => (
        <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', opacity: member.active ? 1 : 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>{member.name[0]}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{member.name}</h4>
                {!member.active && <Badge variant="gray">Inactive</Badge>}
                <Badge variant={member.role === 'CRM Head' ? 'hot' : member.role.includes('Manager') ? 'warm' : member.role.includes('Sales') && !member.role.includes('Pre') ? 'nurture' : 'success'} style={{ fontSize: 9 }}>{member.role}</Badge>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MapPin size={10} /> {member.region} · {member.email}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="outline" size="sm" style={{ padding: '6px 10px' }}><Edit size={12} /></Button>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

/* ── BUILDER ── */
const BuilderMaster = () => (
  <Card style={{ padding: 24, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Builder Project Master</h3>
      <Button variant="primary" size="sm"><Plus size={16} /> Add Project</Button>
    </div>
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
          <tr>{['Project Name', 'Builder', 'Region', 'Configs', 'Status'].map(h => <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={p.id} style={{ borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</td>
              <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{p.builder}</td>
              <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-dim)' }}>{p.region}</td>
              <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--primary-light)' }}>{p.configs?.join(', ')}</td>
              <td style={{ padding: '12px 16px' }}><Badge variant={p.status === 'Active' ? 'success' : 'gray'}>{p.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

/* ── CSV ── */
const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [mapping, setMapping] = useState(false);
  return (
    <Card style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Bulk Builder List Upload</h3>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4, marginBottom: 24 }}>Upload CSV lists from offline sources or channel partners.</p>
      {!mapping ? (
        <div style={{ padding: 40, border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-main)', cursor: 'pointer' }}
          onClick={() => { setFile(true); setTimeout(() => setMapping(true), 800); }}>
          {!file ? (<><UploadCloud size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 16px' }} /><h4 style={{ color: 'var(--text-main)', marginBottom: 8 }}>Click to browse or drag & drop</h4><p style={{ fontSize: 12, color: 'var(--text-dim)' }}>CSV or Excel files only</p></>) :
            (<><FileText size={40} style={{ color: 'var(--primary)', margin: '0 auto 16px' }} /><h4 style={{ color: 'var(--text-main)' }}>Reading File...</h4></>)}
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#34D399', display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={16} /> File Loaded: prestige_expo_leads.csv (420 rows)</span>
          </div>
          <Button variant="primary"><UploadCloud size={16} style={{ marginRight: 6 }} /> Process 420 Leads</Button>
        </div>
      )}
    </Card>
  );
};

/* ── NOTIFICATIONS ── */
const NotificationRules = () => (
  <Card style={{ padding: 24 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Notification Rules</h3>
    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 24 }}>Internal SLAs and system alerts.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {notificationRules.map(rule => (
        <div key={rule.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>{rule.name}</h4>
            <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{rule.trigger} → {rule.recipients}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--primary)' }}>{rule.channel}</span>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: rule.active ? 'var(--primary)' : 'var(--border)', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-card)', position: 'absolute', top: 3, left: rule.active ? 23 : 3, transition: 'all 0.2s' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant="primary"><Save size={16} style={{ marginRight: 6 }} /> Save Rules</Button>
    </div>
  </Card>
);

/* ── ESCALATION MATRIX ── */
const EscalationConfig = () => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Escalation Matrix</h3>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>SLA-based multi-level escalation rules.</p>
    </div>
    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: 'var(--bg-main)' }}>
          {['Scenario', 'Level 1', 'Level 2', 'Level 3', 'SLA', 'Action'].map(h => (
            <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {escalationMatrix.map((rule, i) => (
          <tr key={rule.id} style={{ borderBottom: i < escalationMatrix.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-main)', fontWeight: 500, maxWidth: 250 }}>{rule.scenario}</td>
            <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{rule.level1}</td>
            <td style={{ padding: '14px 16px', fontSize: 12, color: '#FBBF24' }}>{rule.level2}</td>
            <td style={{ padding: '14px 16px', fontSize: 12, color: '#F87171' }}>{rule.level3}</td>
            <td style={{ padding: '14px 16px' }}><Badge variant="hot">{rule.slaHours}h</Badge></td>
            <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--primary-light)' }}>{rule.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

/* ── STICKY ROUTING ── */
const StickyRoutingConfig = () => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Sticky Routing Rules</h3>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Auto-assignment based on region, project, language.</p>
      </div>
      <Button variant="primary" size="sm"><Plus size={14} style={{ marginRight: 6 }} /> Add Rule</Button>
    </div>
    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: 'var(--bg-main)' }}>
          {['Type', 'Match Criteria', 'Assign To', 'Priority'].map(h => (
            <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {stickyRouting.map((rule, i) => (
          <tr key={rule.id} style={{ borderBottom: i < stickyRouting.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <td style={{ padding: '14px 16px' }}><Badge variant={rule.type === 'Region' ? 'success' : rule.type === 'Language' ? 'nurture' : 'warm'}>{rule.type}</Badge></td>
            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>{rule.match}</td>
            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-light)' }}>{rule.assignName} ({rule.assignTo})</td>
            <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-dim)' }}>P{rule.priority}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

/* ── MASTER FIELDS ── */
const MasterFieldsList = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {Object.entries(masterFields).map(([group, fields]) => (
      <Card key={group} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'capitalize' }}>{group.replace(/([A-Z])/g, ' $1')}</h4>
        </div>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Field', 'Type', 'Required', 'Values'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={f.field} style={{ borderBottom: i < fields.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{f.field}</td>
                <td style={{ padding: '10px 16px', fontSize: 11, color: 'var(--primary-light)' }}>{f.type}</td>
                <td style={{ padding: '10px 16px' }}>{f.required ? <Badge variant="success" style={{ fontSize: 9 }}>Required</Badge> : <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Optional</span>}</td>
                <td style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text-dim)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.values || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    ))}
  </div>
);

/* ── TAB ── */
const TabItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--radius-md)',
    fontSize: 13, fontWeight: 600, transition: 'all 0.2s', width: '100%', textAlign: 'left',
    background: active ? 'var(--primary-bg)' : 'transparent',
    color: active ? 'var(--primary-light)' : 'var(--text-muted)',
    border: `1px solid ${active ? 'var(--primary)' : 'transparent'}`
  }}>
    <Icon size={18} />{label}
  </button>
);

/* ── ACCESS MANAGEMENT ── */
const AccessManagement = () => (
  <Card style={{ padding: 24 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Access Management</h3>
    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 20 }}>Portal authentication, SSO configuration, and employee management (Admin only).</p>

    {/* Authentication Methods */}
    <Card style={{ padding: 16, background: 'var(--bg-main)', border: '1px solid var(--border)', marginBottom: 16 }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Authentication Methods</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Shield size={16} style={{ color: '#34D399' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>SSO Login</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Single Sign-On via corporate identity provider.</p>
          <Badge variant="success" style={{ marginTop: 8 }}>Enabled</Badge>
        </div>
        <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Smartphone size={16} style={{ color: '#60A5FA' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>EMP ID + OTP</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Employee ID login with mobile OTP verification.</p>
          <Badge variant="success" style={{ marginTop: 8 }}>Enabled</Badge>
        </div>
        <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Lock size={16} style={{ color: 'var(--text-dim)' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Email + Password</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>Fallback authentication method.</p>
          <Badge variant="gray" style={{ marginTop: 8 }}>Fallback</Badge>
        </div>
      </div>
    </Card>

    {/* Employee Management */}
    <Card style={{ padding: 16, background: 'var(--bg-main)', border: '1px solid var(--border)', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Employee Management</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="warm" style={{ fontSize: 9 }}>Admin Only</Badge>
          <Button variant="primary" size="sm"><Plus size={14} style={{ marginRight: 4 }} /> Add Employee</Button>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, padding: 10, background: 'rgba(251,191,36,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251,191,36,0.15)' }}>
        ⚠ Employee creation/update can only be performed by Admin person.
      </p>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['EMP ID', 'Name', 'Role', 'Region', 'Auth', 'Status'].map(h => (
              <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamMembers.map(m => (
            <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--primary-light)', fontFamily: 'monospace' }}>{m.id}</td>
              <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{m.name}</td>
              <td style={{ padding: '8px 12px' }}><Badge variant={m.role.includes('Manager') ? 'warm' : 'success'} style={{ fontSize: 9 }}>{m.role}</Badge></td>
              <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)' }}>{m.region}</td>
              <td style={{ padding: '8px 12px', fontSize: 11, color: '#60A5FA' }}>SSO + OTP</td>
              <td style={{ padding: '8px 12px' }}><Badge variant={m.active ? 'success' : 'gray'}>{m.active ? 'Active' : 'Inactive'}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

    {/* Role Permissions */}
    <Card style={{ padding: 16, background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Role-Based Access Control</h4>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Role', 'Lead Queue', 'Lead Create', 'Assign', 'Site Visits', 'Sales Process', 'Projects', 'Reports', 'Settings'].map(h => (
              <th key={h} style={{ padding: '8px 10px', fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { role: 'Pre-sales Executive', perms: ['✅', '✅', '❌', '❌', '❌', '❌', '📊', '❌'] },
            { role: 'Sales Executive', perms: ['✅', '✅', '❌', '✅', '✅', '✅', '📊', '❌'] },
            { role: 'Sales Manager', perms: ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '❌'] },
            { role: 'Regional Manager', perms: ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'] },
            { role: 'CRM Head', perms: ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'] },
          ].map(r => (
            <tr key={r.role} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{r.role}</td>
              {r.perms.map((p, i) => <td key={i} style={{ padding: '8px 10px', fontSize: 14, textAlign: 'center' }}>{p}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </Card>
);

export default Settings;

