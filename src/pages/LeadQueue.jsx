import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import {
  Search, Phone, Clock, ChevronRight, Filter, MapPin,
  ArrowUpDown, PhoneCall, SortAsc, Calendar, UserPlus,
  LayoutList, Columns3, GripVertical, Workflow
} from 'lucide-react';
import { regions, leadSources, leadStatuses, statusColors, configurations, mockProjects, projectPhases } from '../data/mockData.js';

const LeadQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leads, getNextFollowUp, getNextMeeting } = useLeads();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('value');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

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

      if (sortBy === 'value') return (b.value || 0) - (a.value || 0);
      if (sortBy === 'followup') {
        const aDate = getNextFollowUp(a) || getNextMeeting(a);
        const bDate = getNextFollowUp(b) || getNextMeeting(b);
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

  // Group leads by status for Kanban view
  const kanbanColumns = useMemo(() => {
    const columns = {};
    const statuses = statusFilter === 'All' ? leadStatuses : [statusFilter];
    statuses.forEach(s => { columns[s] = []; });
    sortedLeads.forEach(lead => {
      if (columns[lead.status]) {
        columns[lead.status].push(lead);
      }
    });
    return columns;
  }, [sortedLeads, statusFilter]);

  const getOverdueHours = (lead) => {
    if (lead.status !== 'Untouched') return null;
    const created = lead.statusHistory?.[0]?.date;
    if (!created) return null;
    return Math.floor((Date.now() - new Date(created).getTime()) / 3600000);
  };

  const totalValue = useMemo(() => {
    return sortedLeads.reduce((sum, l) => sum + (l.value || 0), 0);
  }, [sortedLeads]);

  // Helper: get project lifecycle phase for a lead
  const getProjectPhase = (leadId) => {
    const proj = mockProjects.find(p => p.leadId === leadId);
    if (!proj) return null;
    const phaseInfo = projectPhases.find(p => p.name === proj.currentPhase);
    return phaseInfo ? { name: proj.currentPhase, color: phaseInfo.color } : null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Lead Queue</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sortedLeads.length} leads · Sorted by {sortBy}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* ── VIEW TOGGLE ── */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: 3,
            gap: 2,
          }}>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.25s',
                background: viewMode === 'list'
                  ? 'linear-gradient(135deg, var(--primary-bg), rgba(168,137,68,0.25))'
                  : 'transparent',
                color: viewMode === 'list' ? 'var(--primary-light)' : 'var(--text-dim)',
                boxShadow: viewMode === 'list' ? '0 0 12px rgba(168,137,68,0.15)' : 'none',
              }}
            >
              <LayoutList size={14} /> List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.25s',
                background: viewMode === 'kanban'
                  ? 'linear-gradient(135deg, var(--primary-bg), rgba(168,137,68,0.25))'
                  : 'transparent',
                color: viewMode === 'kanban' ? 'var(--primary-light)' : 'var(--text-dim)',
                boxShadow: viewMode === 'kanban' ? '0 0 12px rgba(168,137,68,0.15)' : 'none',
              }}
            >
              <Columns3 size={14} /> Board
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={15} style={{ marginRight: 6 }} /> Filters
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/leads/new')}>
            <UserPlus size={15} style={{ marginRight: 6 }} /> Add Lead
          </Button>
        </div>
      </div>

      {/* Status Tabs — only show in List view */}
      {viewMode === 'list' && (
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
                fontFamily: 'inherit',
              }}>
                {s} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card style={{ padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'fadeIn 0.2s' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-dim)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, project..." style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'inherit' }} />
          </div>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'inherit' }}>
            <option>All</option>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'inherit' }}>
            <option>All</option>
            {leadSources.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'inherit' }}>
            <option value="value">Value (Highest)</option>
            <option value="followup">Follow-up Date</option>
            <option value="oldest">Oldest First</option>
          </select>
        </Card>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ── LIST VIEW ── */}
      {/* ══════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedLeads.map((lead) => {
            const sc = statusColors[lead.status] || {};
            const isInbound = ['Inbound Call', 'Website Inquiry'].includes(lead.source);
            const overdueH = getOverdueHours(lead);
            const projPhase = getProjectPhase(lead.id);

            return (
              <Card key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={{ padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s', border: overdueH && overdueH > 48 ? '1px solid rgba(248,113,113,0.4)' : '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                {/* Inbound indicator */}
                {isInbound && lead.status === 'Untouched' && <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#FBBF24' }} />}

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Avatar Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, border: `2px solid ${sc.color || '#9CA3AF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${sc.color || '#9CA3AF'}15`, fontWeight: 700, fontSize: 18, color: sc.color || 'var(--text-main)' }}>
                    {lead.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{lead.name}</span>
                      <Badge variant="outline" style={{ ...sc, fontSize: 9, padding: '2px 6px' }}>{lead.status}</Badge>
                      {isInbound && <Badge variant="warm" style={{ fontSize: 9, padding: '2px 6px' }}>⚡ INBOUND</Badge>}
                      {overdueH && overdueH > 48 && <Badge variant="hot" style={{ fontSize: 9, padding: '2px 4px' }}>OVERDUE {overdueH}h</Badge>}
                      {projPhase && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: `${projPhase.color}12`, color: projPhase.color, border: `1px solid ${projPhase.color}30`, letterSpacing: '0.03em' }}>
                          <Workflow size={9} /> {projPhase.name.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                      <span>{lead.project}</span>
                      <span>·</span>
                      <span>{lead.config} · {lead.area} sqft</span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {lead.region}</span>
                      {lead.assignedToName && <><span>·</span><span>→ {lead.assignedToName}</span></>}
                      {lead.coApplicants && lead.coApplicants.length > 0 && <><span>·</span><span style={{ color: 'var(--primary-light)' }}>+ {lead.coApplicants[0].name} {lead.coApplicants.length > 1 ? `(+${lead.coApplicants.length - 1})` : ''}</span></>}
                    </div>
                    {getNextFollowUp(lead) && (
                      <div style={{ marginTop: 4, fontSize: 10, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={10} /> Follow-up: {new Date(getNextFollowUp(lead)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  {/* Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: lead.value >= 20 ? '#34D399' : 'var(--text-main)' }}>₹{lead.value}L</p>
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
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ── KANBAN VIEW ── */}
      {/* ══════════════════════════════════════════════ */}
      {viewMode === 'kanban' && (
        <div className="kanban-scroll" style={{
          display: 'flex',
          gap: 14,
          paddingBottom: 20,
        }}>
          {Object.entries(kanbanColumns).map(([status, columnLeads]) => {
            const sc = statusColors[status] || {};
            const columnValue = columnLeads.reduce((sum, l) => sum + (l.value || 0), 0);

            return (
              <div key={status} style={{
                minWidth: 300,
                maxWidth: 320,
                flex: '0 0 300px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}>
                {/* Column Header */}
                <div style={{
                  padding: '14px 16px 10px',
                  borderBottom: `2px solid ${sc.color || 'var(--border)'}`,
                  background: sc.bg || 'transparent',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: sc.color || '#9CA3AF',
                        boxShadow: `0 0 8px ${sc.color || '#9CA3AF'}`,
                      }} />
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: sc.color || '#9CA3AF',
                        letterSpacing: '0.03em', textTransform: 'uppercase',
                      }}>
                        {status}
                      </span>
                    </div>
                    <span style={{
                      background: 'var(--bg-main)',
                      color: 'var(--text-muted)',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}>
                      {columnLeads.length}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>₹{columnValue.toFixed(1)}L total</span>
                    <span>{columnLeads.length} {columnLeads.length === 1 ? 'lead' : 'leads'}</span>
                  </div>
                </div>

                {/* Column Body */}
                <div style={{
                  flex: 1,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 340px)',
                }}>
                  {columnLeads.map(lead => {
                    const isInbound = ['Inbound Call', 'Website Inquiry'].includes(lead.source);
                    const overdueH = getOverdueHours(lead);

                    const projPhase = getProjectPhase(lead.id);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-main)',
                          border: overdueH && overdueH > 48
                            ? '1px solid rgba(248,113,113,0.4)'
                            : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.25s',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = sc.color || 'var(--border-highlight)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px ${sc.border || 'var(--border)'}`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = overdueH && overdueH > 48 ? 'rgba(248,113,113,0.4)' : 'var(--border)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Inbound glow strip */}
                        {isInbound && lead.status === 'Untouched' && (
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'linear-gradient(90deg, #FBBF24, transparent)' }} />
                        )}

                        {/* Top row: Name + Avatar */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {lead.name}
                              </span>
                              {isInbound && (
                                <span style={{
                                  fontSize: 8, fontWeight: 700, color: '#FBBF24',
                                  background: 'rgba(251,191,36,0.12)',
                                  border: '1px solid rgba(251,191,36,0.25)',
                                  padding: '1px 5px', borderRadius: 3,
                                }}>⚡</span>
                              )}
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {lead.project}
                            </p>
                          </div>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                            border: `2px solid ${sc.color || '#9CA3AF'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `${sc.color || '#9CA3AF'}15`,
                            fontWeight: 700, fontSize: 16, color: sc.color || 'var(--text-main)',
                          }}>
                            {lead.name.charAt(0)}
                          </div>
                        </div>

                        {/* Property info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-dim)', marginBottom: 8, flexWrap: 'wrap' }}>
                          <span>{lead.config}</span>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{lead.area} sqft</span>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <MapPin size={9} /> {lead.region}
                          </span>
                        </div>

                        {/* Project Lifecycle Phase */}
                        {projPhase && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                            background: `${projPhase.color}10`,
                            border: `1px solid ${projPhase.color}25`,
                            marginBottom: 6,
                          }}>
                            <Workflow size={10} style={{ color: projPhase.color }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: projPhase.color, letterSpacing: '0.03em' }}>
                              {projPhase.name}
                            </span>
                          </div>
                        )}

                        {/* Value + Source row */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--glass-light)',
                          border: '1px solid var(--glass-hover)',
                          marginBottom: 6,
                        }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: lead.value >= 20 ? '#34D399' : 'var(--text-main)' }}>
                            ₹{lead.value}L
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 500 }}>
                            {lead.source}
                          </span>
                        </div>

                        {/* Overdue warning */}
                        {overdueH && overdueH > 48 && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 10, color: '#F87171', fontWeight: 600,
                            padding: '3px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(248,113,113,0.08)',
                            border: '1px solid rgba(248,113,113,0.15)',
                            marginBottom: 6,
                          }}>
                            <Clock size={10} />
                            OVERDUE {overdueH}h — No contact
                          </div>
                        )}

                        {/* Follow-up date */}
                        {(getNextFollowUp(lead) || getNextMeeting(lead)) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#FBBF24' }}>
                            <Calendar size={9} />
                            {new Date(getNextFollowUp(lead) || getNextMeeting(lead)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}

                        {/* Assigned + bottom info */}
                        {lead.assignedToName && (
                          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                              → {lead.assignedToName}
                            </span>
                            <span style={{ fontSize: 9, color: 'var(--text-dim)', opacity: 0.6 }}>
                              {lead.id}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Empty column state */}
                  {columnLeads.length === 0 && (
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 16px',
                      color: 'var(--text-dim)',
                      fontSize: 12,
                      opacity: 0.5,
                    }}>
                      <Columns3 size={24} style={{ marginBottom: 8, opacity: 0.3 }} />
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeadQueue;
