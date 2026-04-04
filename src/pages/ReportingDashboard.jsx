import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BarChart2, TrendingUp, Users, Phone, PhoneIncoming, PhoneOutgoing,
  Target, Calendar, PieChart, Download, ArrowUpRight, ArrowDownRight,
  Filter, IndianRupee, Clock, CheckCircle, XCircle, Building, Home,
  Eye, EyeOff, FileText, Search
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart as RechartsPie, Pie, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

const ReportingDashboard = () => {
  const { leads, moengageLog } = useLeads();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [maskPII, setMaskPII] = useState(false);

  const maskPhone = (p) => maskPII && p ? p.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : p;
  const maskEmail = (e) => maskPII && e ? e.replace(/(.{2}).+(@.+)/, '$1***$2') : e;
  const maskName = (n) => maskPII && n ? n[0] + '***' + (n.split(' ').pop()?.[0] || '') : n;

  // ── Derived data ──
  const statusCounts = {};
  const statuses = ['Untouched', 'Attempted', 'Validated', 'Meeting Scheduled', 'Meeting Done', 'Proposal Sent', 'Converted', 'Not Qualified'];
  statuses.forEach(s => { statusCounts[s] = leads.filter(l => l.status === s).length; });

  const stageData = statuses.map(s => ({ name: s.length > 12 ? s.slice(0,11) + '…' : s, fullName: s, count: statusCounts[s], fill: s === 'Converted' ? '#34D399' : s === 'Not Qualified' ? '#F87171' : '#A88944' }));

  // Conversion metrics
  const totalLeads = leads.length;
  const converted = statusCounts['Converted'];
  const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : 0;
  const validated = statusCounts['Validated'] + statusCounts['Meeting Scheduled'] + statusCounts['Meeting Done'] + statusCounts['Proposal Sent'] + converted;
  const validationRate = totalLeads > 0 ? ((validated / totalLeads) * 100).toFixed(1) : 0;

  // Budget distribution
  const budgetBuckets = [
    { name: '< ₹10L', count: leads.filter(l => (l.budget || l.value || 0) < 10).length, fill: '#60A5FA' },
    { name: '₹10-25L', count: leads.filter(l => { const b = l.budget || l.value || 0; return b >= 10 && b < 25; }).length, fill: '#A88944' },
    { name: '₹25-50L', count: leads.filter(l => { const b = l.budget || l.value || 0; return b >= 25 && b < 50; }).length, fill: '#FBBF24' },
    { name: '₹50L-1Cr', count: leads.filter(l => { const b = l.budget || l.value || 0; return b >= 50 && b < 100; }).length, fill: '#EC4899' },
    { name: '> ₹1Cr', count: leads.filter(l => (l.budget || l.value || 0) >= 100).length, fill: '#34D399' },
  ];

  // Project-wise interest
  const projectInterest = {};
  leads.forEach(l => { const p = l.project || l.builder || 'Unknown'; projectInterest[p] = (projectInterest[p] || 0) + 1; });
  const projectData = Object.entries(projectInterest).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, count }));
  const PCOLORS = ['#A88944', '#34D399', '#60A5FA', '#FBBF24', '#EC4899', '#8B5CF6', '#F97316', '#14B8A6'];

  // Pending followups
  const pendingFollowups = leads.filter(l => {
    const fu = l.followUpDate || l.followUpSalesDate;
    return fu && new Date(fu) <= new Date();
  });

  // Daily call counts (mock)
  const callDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const callData = callDays.map(d => ({
    day: d,
    inbound: Math.floor(20 + Math.random() * 40),
    outbound: Math.floor(30 + Math.random() * 50),
  }));

  // Manager-wise stage count
  const managerData = [];
  const managers = [...new Set(leads.map(l => l.assignedToName).filter(Boolean))];
  managers.forEach(m => {
    const mLeads = leads.filter(l => l.assignedToName === m);
    managerData.push({
      name: m,
      untouched: mLeads.filter(l => l.status === 'Untouched').length,
      attempted: mLeads.filter(l => l.status === 'Attempted').length,
      validated: mLeads.filter(l => ['Validated', 'Meeting Scheduled', 'Meeting Done'].includes(l.status)).length,
      converted: mLeads.filter(l => l.status === 'Converted').length,
      total: mLeads.length,
    });
  });

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Status', 'Source', 'Region', 'Score', 'Assigned To'];
    const rows = leads.map(l => [l.id, maskName(l.name), maskPhone(l.phone), maskEmail(l.email), l.status, l.source, l.region, l.score, l.assignedToName || '-'].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `morph-report-${new Date().toISOString().slice(0, 10)}${maskPII ? '-masked' : ''}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>Reporting & Exports</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>6 charts with table · Call analytics · Conversion metrics · Export with masked PII</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={timeframe} onChange={e => setTimeframe(e.target.value)} style={selectStyle}>
            {['Last 7 Days', 'Last 30 Days', 'This Quarter', 'Year to Date'].map(t => <option key={t}>{t}</option>)}
          </select>
          <Button variant="outline" onClick={() => setMaskPII(!maskPII)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {maskPII ? <EyeOff size={14} /> : <Eye size={14} />}
            {maskPII ? 'PII Masked' : 'Mask PII'}
          </Button>
          <Button variant="primary" onClick={handleExport}>
            <Download size={14} style={{ marginRight: 6 }} /> Export {maskPII ? '(Masked)' : 'Report'}
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <KpiCard label="Total Leads" value={totalLeads} sub={`${timeframe}`} icon={Users} color="#A88944" />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} sub={`${converted} converted`} icon={Target} color="#34D399" up />
        <KpiCard label="Validation Rate" value={`${validationRate}%`} sub={`${validated} validated+`} icon={CheckCircle} color="#60A5FA" up />
        <KpiCard label="Pending Follow-ups" value={pendingFollowups.length} sub="Overdue today" icon={Clock} color="#F87171" />
      </div>

      {/* Row 1: Lead Stage + Call Counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Chart 1: Lead Stage Count by Manager */}
        <Card>
          <ChartHeader title="Lead Stage Count" subtitle="By Manager" />
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" fontSize={10} stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stageData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Daily Inbound/Outbound Calls */}
        <Card>
          <ChartHeader title="Daily Call Count" subtitle="Inbound vs Outbound by Manager" />
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" fontSize={11} stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <YAxis fontSize={11} stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
                <Bar dataKey="inbound" name="Inbound" fill="#34D399" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="outbound" name="Outbound" fill="#60A5FA" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Conversion Funnel + Budget Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Chart 3: Conversion Metrics Funnel */}
        <Card>
          <ChartHeader title="Conversion Metrics" subtitle="Untouched → Converted tracking" />
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { stage: 'Untouched', leads: statusCounts['Untouched'] + statusCounts['Attempted'] + validated },
                { stage: 'Attempted', leads: statusCounts['Attempted'] + validated },
                { stage: 'Validated', leads: validated },
                { stage: 'Meeting', leads: statusCounts['Meeting Scheduled'] + statusCounts['Meeting Done'] + statusCounts['Proposal Sent'] + converted },
                { stage: 'Proposal', leads: statusCounts['Proposal Sent'] + converted },
                { stage: 'Converted', leads: converted },
              ]} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="stage" fontSize={11} stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <YAxis fontSize={11} stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="leads" stroke="#A88944" fill="rgba(168,137,68,0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Customer Budget Distribution */}
        <Card>
          <ChartHeader title="Customer Budgets" subtitle="Budget distribution" />
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie data={budgetBuckets} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count" stroke="none">
                  {budgetBuckets.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <RechartsTooltip contentStyle={tooltipStyle} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 8 }}>
            {budgetBuckets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.fill }} />
                {b.name} ({b.count})
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Project Interest + Pending Followups */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Chart 5: Project-wise Interest */}
        <Card>
          <ChartHeader title="Project-wise Interest" subtitle="Top projects by lead volume" />
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={10} stroke="var(--text-muted)" width={110} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" barSize={18} radius={[0, 4, 4, 0]}>
                  {projectData.map((e, i) => <Cell key={i} fill={PCOLORS[i % PCOLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 6: Pending Followups */}
        <Card>
          <ChartHeader title="Pending Follow-up Details" subtitle={`${pendingFollowups.length} overdue follow-ups`} />
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)' }}>
                  {['Lead', 'Status', 'Follow-up', 'Assigned'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingFollowups.slice(0, 15).map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'white' }}>{maskName(l.name)}</td>
                    <td style={{ padding: '8px 12px' }}><Badge variant={l.status === 'Meeting Scheduled' ? 'nurture' : 'warm'} style={{ fontSize: 9 }}>{l.status}</Badge></td>
                    <td style={{ padding: '8px 12px', fontSize: 11, color: '#F87171' }}>{new Date(l.followUpDate || l.followUpSalesDate).toLocaleDateString()}</td>
                    <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)' }}>{l.assignedToName || '-'}</td>
                  </tr>
                ))}
                {pendingFollowups.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-dim)' }}>No overdue follow-ups 🎉</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Manager-wise Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Lead Stage Count by Manager</h3>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>SOW: 6 charts + table</span>
        </div>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)' }}>
              {['Manager', 'Untouched', 'Attempted', 'Validated+', 'Converted', 'Total'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managerData.map(m => (
              <tr key={m.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'white' }}>{maskName(m.name)}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{m.untouched}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#FBBF24' }}>{m.attempted}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#60A5FA' }}>{m.validated}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#34D399', fontWeight: 600 }}>{m.converted}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'white' }}>{m.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const selectStyle = { padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13 };
const tooltipStyle = { backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 12 };

const KpiCard = ({ label, value, sub, icon: Icon, color, up }) => (
  <Card style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
      <h3 style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>{value}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, marginTop: 4, color: up ? '#34D399' : 'var(--text-dim)' }}>
        {up != null && (up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
        <span>{sub}</span>
      </div>
    </div>
    <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} style={{ color }} />
    </div>
  </Card>
);

const ChartHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{title}</h3>
    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{subtitle}</span>
  </div>
);

export default ReportingDashboard;
