import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLeads } from '../context/LeadContext.jsx';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  TrendingUp, Users, PhoneCall, Clock, ChevronRight, Filter, Zap,
  CheckCircle, IndianRupee, AlertTriangle, Phone, Star, ArrowRight,
  Calendar, Bell, Gauge, Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teamMembers, statusColors, leadStatuses, moengageEventLog } from '../data/mockData.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { leads, getPendingFirstCall, getOverdueFirstCall } = useLeads();
  const navigate = useNavigate();
  const isManager = ['Regional Manager', 'Sales Manager', 'CRM Head'].includes(user?.role);

  // Status counts
  const statusCounts = {};
  leadStatuses.forEach(s => { statusCounts[s] = leads.filter(l => l.status === s).length; });

  const pipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const pendingFirstCall = getPendingFirstCall();
  const overdueFirstCall = getOverdueFirstCall();

  // Possession wave
  const months = ['Apr 26','May 26','Jun 26','Jul 26','Aug 26','Sep 26','Oct 26','Nov 26','Dec 26','Jan 27','Feb 27','Mar 27'];
  const possessionData = months.map((month, i) => {
    const count = Math.max(1, Math.floor(Math.random() * 16));
    const type = i < 3 ? 'urgent' : i < 6 ? 'approaching' : 'plan';
    return { month, count, type };
  });
  const getBarColor = (type) => type === 'urgent' ? '#F87171' : type === 'approaching' ? '#FBBF24' : '#60A5FA';

  const priorityCalls = [...leads]
    .filter(l => ['Untouched', 'Attempted', 'Validated', 'Meeting Scheduled'].includes(l.status))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 6);

  const execTeam = teamMembers.filter(t => t.role === 'Pre-sales Executive' && t.active);
  const teamStats = execTeam.map(t => ({
    ...t, callsMade: Math.floor(Math.random() * 25) + 5, connectRate: Math.floor(Math.random() * 40) + 40,
    leadsQualified: Math.floor(Math.random() * 5), avgDuration: `${Math.floor(Math.random() * 8) + 3}m`,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
            {isManager ? 'Team Dashboard' : 'My Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Welcome back, <span style={{ color: 'var(--primary-light)' }}>{user?.name}</span> ({user?.role}).
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm"><Filter size={15} style={{ marginRight: 6 }} /> Filter View</Button>
          <Button variant="primary" size="sm"><Zap size={15} style={{ marginRight: 6 }} /> Morning Briefing</Button>
        </div>
      </div>

      {/* ── OPERATIONAL DASHBOARD CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <OpCard label="Pending First Call" sub="within 48 hours" value={pendingFirstCall.length} color="#FBBF24" icon={Timer}
          onClick={() => navigate('/leads?status=Untouched')} />
        <OpCard label="Overdue First Call" sub="exceeded 48h SLA" value={overdueFirstCall.length} color="#F87171" icon={AlertTriangle}
          onClick={() => navigate('/escalations')} />
        <OpCard label="Pipeline Value" sub="all active leads" value={`₹${pipelineValue.toFixed(0)}L`} color="#34D399" icon={IndianRupee}
          onClick={() => navigate('/analytics')} />
        <OpCard label="Meeting Scheduled" sub="upcoming meetings" value={statusCounts['Meeting Scheduled'] || 0} color="#A88944" icon={Calendar}
          onClick={() => navigate('/leads?status=Meeting Scheduled')} />
        <OpCard label="Converted" sub="this period" value={statusCounts['Converted'] || 0} color="#34D399" icon={CheckCircle}
          onClick={() => navigate('/leads?status=Converted')} />
      </div>

      {/* ── STATUS PIPELINE STRIP ── */}
      <Card style={{ padding: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Lead Pipeline</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
          {leadStatuses.map((s, i) => {
            const sc = statusColors[s];
            const count = statusCounts[s] || 0;
            return (
              <div key={s} onClick={() => navigate(`/leads?status=${encodeURIComponent(s)}`)} style={{ flex: 1, padding: '12px 10px', borderRadius: 'var(--radius-md)', background: sc.bg, border: `1px solid ${sc.border}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', position: 'relative' }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: sc.color }}>{count}</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.2 }}>{s}</p>
                {i < leadStatuses.length - 1 && <ArrowRight size={12} style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', color: 'var(--border)', zIndex: 1 }} />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Manager: Team Strip */}
      {isManager && (
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Team Performance</h3>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Today's stats</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${teamStats.length}, 1fr)`, gap: 12 }}>
            {teamStats.map(exec => (
              <div key={exec.id} style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{exec.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 10 }}>{exec.region}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <MiniStat label="Calls" value={exec.callsMade} target={exec.dailyTarget} />
                  <MiniStat label="Connect" value={`${exec.connectRate}%`} good={exec.connectRate >= 60} />
                  <MiniStat label="Qualified" value={exec.leadsQualified} good={exec.leadsQualified >= 2} />
                  <MiniStat label="Avg Dur" value={exec.avgDuration} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Priority Calls + Possession Wave */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Priority Calls</h3>
            <button onClick={() => navigate('/leads')} style={{ fontSize: 12, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ChevronRight size={14} /></button>
          </div>
          <div>
            {priorityCalls.map((lead, idx) => (
              <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', cursor: 'pointer', borderBottom: idx < priorityCalls.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <ScoreRing score={lead.score} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{lead.name}</span>
                    <Badge variant="outline" style={{ ...(statusColors[lead.status] || {}), fontSize: 9, padding: '2px 6px' }}>{lead.status}</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{lead.project} · {lead.config} · {lead.area} sq ft</p>
                  {lead.coApplicant && <p style={{ fontSize: 10, color: 'var(--primary-light)', marginTop: 2 }}>+ {lead.coApplicant.name} ({lead.coApplicant.relation})</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: lead.value >= 20 ? '#34D399' : 'white' }}>₹{lead.value}L</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{lead.possession ? new Date(lead.possession).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Possession Wave Forecast</h3>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 20 }}>Lead volume by expected possession date.</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={possessionData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" stroke="var(--text-dim)" fontSize={11} />
                <YAxis dataKey="month" type="category" width={55} stroke="var(--text-dim)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'white', fontSize: 12 }} />
                <Bar dataKey="count" barSize={18} radius={[0, 4, 4, 0]}>
                  {possessionData.map((entry, i) => <Cell key={i} fill={getBarColor(entry.type)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, justifyContent: 'center' }}>
            <Legend color="#F87171" label="0–3 Mo" />
            <Legend color="#FBBF24" label="3–6 Mo" />
            <Legend color="#60A5FA" label="6+ Mo" />
          </div>
        </Card>
      </div>

      {/* MoEngage Sync Status */}
      <Card style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gauge size={18} style={{ color: '#34D399' }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>MoEngage Integration</p>
            <p style={{ fontSize: 12, color: '#34D399' }}>All {moengageEventLog.length} events synced · Last push: {new Date(moengageEventLog[0]?.timestamp || Date.now()).toLocaleString()}</p>
          </div>
        </div>
        <Badge variant="success">LIVE</Badge>
      </Card>

      {/* Activity Feed */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Recent Activity</h3>
        </div>
        <div>
          {[
            { icon: Phone, color: '#34D399', name: 'Sneha G', action: 'Made a call to Rohan Krishnan', sub: 'Connected (12m 45s)', time: '10 mins ago' },
            { icon: Star, color: '#FBBF24', name: 'SYSTEM', action: 'Qualified Suresh Menon — Proposal Sent', sub: 'Score: 91', time: '1 hour ago' },
            { icon: ArrowRight, color: '#A88944', name: 'Vishal Reddy', action: 'Assigned Amit Hegde to Ankit Sharma', sub: 'Sales Executive', time: '2 hours ago' },
            { icon: CheckCircle, color: '#34D399', name: 'Divya Menon', action: 'Converted Vijay Kumar — ₹85L', sub: 'Full turnkey penthouse project', time: '3 hours ago' },
            { icon: AlertTriangle, color: '#F87171', name: 'SYSTEM', action: 'Escalation: Kavitha Nair not contacted', sub: 'SLA breach > 48h', time: '4 hours ago' },
            { icon: Bell, color: '#60A5FA', name: 'MoEngage', action: 'Pushed status update for Priya Sharma', sub: 'Event: status_validated', time: '5 hours ago' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${item.color}15`, color: item.color, flexShrink: 0 }}>
                <item.icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'white' }}><span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{item.name}</span> {item.action}</p>
                <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{item.sub}</p>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ── Components ── */
const OpCard = ({ label, sub, value, color, icon: Icon, onClick }) => (
  <div onClick={onClick} style={{ padding: 18, borderRadius: 'var(--radius-lg)', background: `${color}08`, border: `1px solid ${color}30`, cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 20px ${color}20`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.boxShadow = 'none'; }}>
    <div style={{ position: 'absolute', top: 14, right: 14, opacity: 0.12 }}><Icon size={32} /></div>
    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</p>
    <p style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>{value}</p>
    <p style={{ fontSize: 11, color, marginTop: 4 }}>{sub}</p>
  </div>
);

const MiniStat = ({ label, value, target, good }) => (
  <div>
    <p style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</p>
    <p style={{ fontSize: 14, fontWeight: 600, color: good === true ? '#34D399' : good === false ? '#F87171' : 'white' }}>
      {value}{target ? <span style={{ color: 'var(--text-dim)', fontSize: 10, fontWeight: 400 }}>/{target}</span> : null}
    </p>
  </div>
);

const ScoreRing = ({ score }) => {
  const color = score >= 75 ? '#F87171' : score >= 50 ? '#FBBF24' : '#60A5FA';
  const r = 16; const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
      <svg width={40} height={40} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={20} cy={20} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
        <circle cx={20} cy={20} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ - (circ * score / 100)} strokeLinecap="round" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>{score}</span>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{label}</span>
  </div>
);

export default Dashboard;
