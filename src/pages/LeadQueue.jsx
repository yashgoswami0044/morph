import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import {
  Search, Phone, Clock, ChevronRight, Filter, MapPin,
  ArrowUpDown, PhoneCall, SortAsc, Calendar, UserPlus
} from 'lucide-react';
import { regions, leadSources, leadStatuses, statusColors, configurations } from '../data/mockData.js';

const LeadQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leads } = useLeads();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [showFilters, setShowFilters] = useState(false);

  const sortedLeads = useMemo(() => {
    let filtered = [...leads];

    // Search
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.project?.toLowerCase().includes(q) || l.id.includes(q)
      );
    }

    // Filters
    if (statusFilter !== 'All') filtered = filtered.filter(l => l.status === statusFilter);
    if (regionFilter !== 'All') filtered = filtered.filter(l => l.region === regionFilter);
    if (sourceFilter !== 'All') filtered = filtered.filter(l => l.source === sourceFilter);

    // Sort
    filtered.sort((a, b) => {
      // Inbound + Website leads always on top for Untouched/Attempted
      const inboundSources = ['Inbound Call', 'Website Inquiry'];
      if (['Untouched', 'Attempted'].includes(a.status) || ['Untouched', 'Attempted'].includes(b.status)) {
        const aInbound = inboundSources.includes(a.source) ? 1 : 0;
        const bInbound = inboundSources.includes(b.source) ? 1 : 0;
        if (aInbound !== bInbound) return bInbound - aInbound;
      }

      if (sortBy === 'priority') return (b.score || 0) - (a.score || 0);
      if (sortBy === 'followup') {
        const aDate = a.followUpDate || a.followUpSalesDate;
        const bDate = b.followUpDate || b.followUpSalesDate;
        if (aDate && bDate) return new Date(aDate) - new Date(bDate);
        if (aDate) return -1;
        if (bDate) return 1;
        return 0;
      }
      if (sortBy === 'value') return (b.value || 0) - (a.value || 0);
      if (sortBy === 'oldest') return new Date(a.lastContact || 0) - new Date(b.lastContact || 0);
      return 0;
    });

    return filtered;
  }, [leads, search, statusFilter, regionFilter, sourceFilter, sortBy]);

  const statusCounts = useMemo(() => {
    const counts = { All: leads.length };
    leadStatuses.forEach(s => { counts[s] = leads.filter(l => l.status === s).length; });
    return counts;
  }, [leads]);

  const getOverdueHours = (lead) => {
    if (lead.status !== 'Untouched') return null;
    const created = lead.statusHistory?.[0]?.date;
    if (!created) return null;
    return Math.floor((Date.now() - new Date(created).getTime()) / 3600000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>Lead Queue</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sortedLeads.length} leads · Sorted by {sortBy}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={15} style={{ marginRight: 6 }} /> Filters
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/leads/new')}>
            <UserPlus size={15} style={{ marginRight: 6 }} /> Add Lead
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {['All', ...leadStatuses].map(s => {
          const sc = statusColors[s];
          const count = statusCounts[s] || 0;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500,
              background: statusFilter === s ? (sc?.bg || 'var(--primary-bg)') : 'transparent',
              color: statusFilter === s ? (sc?.color || 'var(--primary-light)') : 'var(--text-muted)',
              border: `1px solid ${statusFilter === s ? (sc?.border || 'var(--primary)') : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card style={{ padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'fadeIn 0.2s' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-dim)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, project..." style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13 }} />
          </div>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13 }}>
            <option>All</option>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13 }}>
            <option>All</option>
            {leadSources.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: 13 }}>
            <option value="priority">Score (Highest)</option>
            <option value="followup">Follow-up Date</option>
            <option value="value">Value (Highest)</option>
            <option value="oldest">Oldest First</option>
          </select>
        </Card>
      )}

      {/* ── LIST ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedLeads.map((lead) => {
          const sc = statusColors[lead.status] || {};
          const isInbound = ['Inbound Call', 'Website Inquiry'].includes(lead.source);
          const overdueH = getOverdueHours(lead);

          return (
            <Card key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={{ padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s', border: overdueH && overdueH > 48 ? '1px solid rgba(248,113,113,0.4)' : '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              {/* Inbound indicator */}
              {isInbound && lead.status === 'Untouched' && <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#FBBF24' }} />}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Score */}
                <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, border: `2px solid ${sc.color || '#9CA3AF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', fontWeight: 700, fontSize: 14, color: 'white' }}>
                  {lead.score || 0}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{lead.name}</span>
                    <Badge variant="outline" style={{ ...sc, fontSize: 9, padding: '2px 6px' }}>{lead.status}</Badge>
                    {isInbound && <Badge variant="warm" style={{ fontSize: 9, padding: '2px 6px' }}>⚡ INBOUND</Badge>}
                    {overdueH && overdueH > 48 && <Badge variant="hot" style={{ fontSize: 9, padding: '2px 4px' }}>OVERDUE {overdueH}h</Badge>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                    <span>{lead.project}</span>
                    <span>·</span>
                    <span>{lead.config} · {lead.area} sqft</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {lead.region}</span>
                    {lead.assignedToName && <><span>·</span><span>→ {lead.assignedToName}</span></>}
                    {lead.coApplicant && <><span>·</span><span style={{ color: 'var(--primary-light)' }}>+ {lead.coApplicant.name}</span></>}
                  </div>
                  {lead.followUpDate && (
                    <div style={{ marginTop: 4, fontSize: 10, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={10} /> Follow-up: {new Date(lead.followUpDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: lead.value >= 20 ? '#34D399' : 'white' }}>₹{lead.value}L</p>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{lead.source}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); navigate(`/leads/${lead.id}`); }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-bg)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}>
                    <Phone size={16} />
                  </button>
                  <ChevronRight size={18} style={{ color: 'var(--border)', flexShrink: 0 }} />
                </div>
              </div>
            </Card>
          );
        })}

        {sortedLeads.length === 0 && (
          <Card style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--border)', background: 'var(--bg-main)' }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-muted)' }}>No leads match your filters</p>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8 }}>Adjust the status, region, or search criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadQueue;
