import React, { useState } from 'react';
import { Card, Badge, Button } from '../components/ui/index.jsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Users, Target, Award, ArrowUpRight, 
  MapPin, Calendar, Download, Building, PhoneCall, CheckCircle, Percent
} from 'lucide-react';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('Last 30 Days');

  // Spec 8.1: Funnel
  const funnelData = [
    { name: 'Builder List Received', count: 2450, fill: '#374151' },
    { name: 'Contacted', count: 2205, fill: '#4B5563' },
    { name: 'Connected', count: 1323, fill: '#A88944' },
    { name: 'Interest Shown', count: 595, fill: '#C5A96A' },
    { name: 'Qualified (Hot+Warm)', count: 410, fill: '#FBBF24' },
    { name: 'Handoff to Sales', count: 345, fill: '#F87171' },
    { name: 'Site Visit Booked', count: 290, fill: '#10B981' },
    { name: 'Design Sign-up', count: 160, fill: '#059669' },
  ];

  // Spec 8.2: Builder-wise
  const builderData = [
    { name: 'Prestige Lakeside Habitat', builder: 'Prestige Group', leads: 420, contact: '94%', qual: '22%' },
    { name: 'Godrej Eternity', builder: 'Godrej Properties', leads: 310, contact: '88%', qual: '19%' },
    { name: 'Sobha Dream Gardens', builder: 'Sobha Limited', leads: 280, contact: '91%', qual: '15%' },
    { name: 'Brigade Woods', builder: 'Brigade Group', leads: 190, contact: '82%', qual: '14%' },
  ];

  // Spec 8.3: Regional
  const regionalData = [
    { name: 'Bangalore East', leads: 850, contact: '92%', qual: '19%' },
    { name: 'Bangalore North', leads: 620, contact: '88%', qual: '18%' },
    { name: 'Mumbai', leads: 420, contact: '85%', qual: '15%' },
    { name: 'Hyderabad', leads: 380, contact: '89%', qual: '17%' },
    { name: 'NCR', leads: 180, contact: '78%', qual: '12%' },
  ];
  const COLORS = ['#A88944', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

  // Spec 8.4: Executive Scorecards
  const execs = [
    { name: 'Rahul V', region: 'Bangalore East', calls: 840, connect: '65%', duration: '6m 20s', cpl: 2.1, qualRate: '21%', avgValue: '28L', approvalRate: '94%', convVisit: '82%', convSignUp: '55%' },
    { name: 'Sneha G', region: 'Bangalore North', calls: 910, connect: '58%', duration: '5m 45s', cpl: 2.4, qualRate: '18%', avgValue: '35L', approvalRate: '88%', convVisit: '76%', convSignUp: '48%' },
    { name: 'Meera K', region: 'Mumbai', calls: 760, connect: '61%', duration: '7m 10s', cpl: 1.8, qualRate: '16%', avgValue: '25L', approvalRate: '90%', convVisit: '79%', convSignUp: '51%' },
  ];

  // Spec 8.5: 12-Month Possession Wave
  const months = ['Apr 26','May 26','Jun 26','Jul 26','Aug 26','Sep 26','Oct 26','Nov 26','Dec 26','Jan 27','Feb 27','Mar 27'];
  const waveData = months.map((m, i) => {
    let base = 40 + Math.random() * 60;
    if (i === 2 || i === 8) base += 80; // Peak months
    return { month: m, leads: Math.floor(base), type: i < 3 ? 'urgent' : i < 6 ? 'approaching' : 'plan' };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Pipeline Analytics</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Strategic performance overview across all regions.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select value={timeframe} onChange={e => setTimeframe(e.target.value)}
            style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 13 }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <Button variant="primary">
            <Download size={16} style={{ marginRight: 8 }} /> Export Report
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <KPIItem label="Incoming Leads" value="2,450" sub="Builder Lists (85%), Organic (15%)" icon={Building} up />
        <KPIItem label="Overall Qualification" value="16.7%" sub="Target: 15% (Hot + Warm)" icon={Target} up />
        <KPIItem label="Handoff to Booked" value="46.3%" sub="Target: 50%" icon={Award} up={false} />
      </div>

      {/* Row: Funnel & Regions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Conversion Funnel</h3>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Drop-off analysis</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={11} stroke="var(--text-muted)" width={120} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'var(--glass-light)' }} contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 12 }} />
                <Bar dataKey="count" barSize={24} radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Regional Breakdown</h3>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Top 5 Regions</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionalData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="leads" stroke="none">
                  {regionalData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {regionalData.map((region, idx) => (
              <div key={region.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                  <span style={{ color: 'var(--text-muted)' }}>{region.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ color: 'var(--text-dim)', width: 60, textAlign: 'right' }}>{region.leads} leads</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600, width: 40, textAlign: 'right' }}>{region.qual}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Builder-wise conversion */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Builder Project Performance</h3>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Identify high-converting projects for partnership investment.</p>
        </div>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              {['Project & Builder', 'Volume', 'Contact Rate', 'Qual Rate'].map(h => (
                <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {builderData.map(b => (
              <tr key={b.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{b.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{b.builder}</p>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-main)' }}>{b.leads}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--primary-light)' }}>{b.contact}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#34D399', fontWeight: 600 }}>{b.qual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Executive Scorecards */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Executive Scorecards</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {execs.map(exec => (
            <Card key={exec.name} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>
                  {exec.name[0]}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{exec.name}</h4>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {exec.region}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <MetricGroup title="Activity">
                  <MiniMetric label="Calls" value={exec.calls} />
                  <MiniMetric label="Connect" value={exec.connect} />
                  <MiniMetric label="Avg Dur" value={exec.duration} />
                  <MiniMetric label="CPL" value={exec.cpl} />
                </MetricGroup>
                <MetricGroup title="Quality">
                  <MiniMetric label="Qual Rate" value={exec.qualRate} />
                  <MiniMetric label="Avg Value" value={exec.avgValue} />
                  <MiniMetric label="Approval" value={exec.approvalRate} />
                </MetricGroup>
                <MetricGroup title="Outcome (Closed Loop)" highlight>
                  <MiniMetric label="Site Visit" value={exec.convVisit} />
                  <MiniMetric label="Sign-up" value={exec.convSignUp} />
                </MetricGroup>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Possession Wave */}
      <Card>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>12-Month Possession Wave Forecast</h3>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Capacity planning based on upcoming builder handovers across all regions.</p>
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waveData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-dim)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-dim)" fontSize={11} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--glass-light)' }} contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 12 }} />
              <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                {waveData.map((entry, index) => (
                  <Cell key={index} fill={entry.type === 'urgent' ? '#F87171' : entry.type === 'approaching' ? '#FBBF24' : '#60A5FA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

const KPIItem = ({ label, value, sub, icon: Icon, up }) => (
  <Card style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)' }}>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</p>
      <h3 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{value}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: up ? '#34D399' : '#F87171' }}>
        {up ? <TrendingUp size={12} /> : <TrendingUp size={12} style={{ transform: 'rotate(180deg)' }} />}
        <span>{sub}</span>
      </div>
    </div>
    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
      <Icon size={20} />
    </div>
  </Card>
);

const MetricGroup = ({ title, children, highlight }) => (
  <div style={{ padding: 12, background: highlight ? 'rgba(52,211,153,0.05)' : 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: `1px solid ${highlight ? 'rgba(52,211,153,0.2)' : 'var(--border)'}` }}>
    <p style={{ fontSize: 10, color: highlight ? '#34D399' : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>{title}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {children}
    </div>
  </div>
);

const MiniMetric = ({ label, value }) => (
  <div>
    <p style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{value}</p>
  </div>
);

export default Analytics;
