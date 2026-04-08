import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '../components/ui/index.jsx';
import { useLeads } from '../context/LeadContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User, Phone,
  CheckCircle, AlertTriangle, Eye, Plus, XCircle
} from 'lucide-react';
import { teamMembers } from '../data/mockData.js';

const CalendarManagement = () => {
  const { leads, getNextFollowUp, getNextMeeting, getNextMeetingObj } = useLeads();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // month or week

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Get all scheduled visits from leads with meeting data
  const scheduledVisits = useMemo(() => {
    return leads.filter(l => getNextMeeting(l) || getNextFollowUp(l)).map(l => {
      const dtStr = getNextMeeting(l) || getNextFollowUp(l);
      const isMeeting = !!getNextMeeting(l);
      const mObj = getNextMeetingObj(l);
      return {
        id: l.id,
        name: l.name,
        phone: l.phone,
        date: new Date(dtStr),
        dateStr: dtStr,
        type: isMeeting ? 'Site Visit' : 'Follow-up',
        visitType: isMeeting && mObj ? mObj.visitType : 'Follow-up Call',
        location: isMeeting && mObj ? mObj.location : '—',
        status: l.status,
        assignedTo: l.assignedToName || 'Unassigned',
        project: l.project || l.builder || '—',
      };
    }).sort((a, b) => a.date - b.date);
  }, [leads, getNextFollowUp, getNextMeeting, getNextMeetingObj]);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getVisitsForDay = (day) => {
    if (!day) return [];
    return scheduledVisits.filter(v => v.date.getFullYear() === year && v.date.getMonth() === month && v.date.getDate() === day);
  };

  const isToday = (day) => {
    const t = new Date();
    return day === t.getDate() && month === t.getMonth() && year === t.getFullYear();
  };

  const selectedDayVisits = selectedDate ? getVisitsForDay(selectedDate) : [];

  // Check for conflicts on a given date
  const hasConflict = (day) => {
    const visits = getVisitsForDay(day);
    if (visits.length < 2) return false;
    for (let i = 0; i < visits.length; i++) {
      for (let j = i + 1; j < visits.length; j++) {
        const diff = Math.abs(visits[i].date - visits[j].date);
        if (diff < 3600000) return true; // within 1 hour
      }
    }
    return false;
  };

  // Next 7 days visits
  const today = new Date();
  const upcomingVisits = scheduledVisits.filter(v => v.date >= today && v.date <= new Date(today.getTime() + 7 * 86400000));

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Calendar Management</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>View scheduled site visits, check calendar conflicts, and manage appointments.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/leads')}>
          <Plus size={14} style={{ marginRight: 6 }} /> Schedule New Visit
        </Button>
      </div>

      {/* Calendar conflict warning */}
      {scheduledVisits.some(v => {
        const d = v.date;
        return hasConflict(d.getDate()) && d.getMonth() === month && d.getFullYear() === year;
      }) && (
        <Card style={{ padding: 12, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <p style={{ fontSize: 12, color: '#FBBF24' }}><AlertTriangle size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            <strong>Scheduling Conflict Detected:</strong> Some days have overlapping site visits within 1 hour. Review the calendar to resolve.</p>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Main Calendar */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft size={16} /></button>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', minWidth: 180, textAlign: 'center' }}>{monthName} {year}</h2>
              <button onClick={nextMonth} style={navBtnStyle}><ChevronRight size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
              <button onClick={() => setView('month')} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500, background: view === 'month' ? 'var(--primary)' : 'transparent', color: view === 'month' ? 'white' : 'var(--text-muted)', cursor: 'pointer' }}>Month</button>
              <button onClick={() => setView('week')} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500, background: view === 'week' ? 'var(--primary)' : 'transparent', color: view === 'week' ? 'white' : 'var(--text-muted)', cursor: 'pointer' }}>Week</button>
            </div>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((day, i) => {
              const visits = day ? getVisitsForDay(day) : [];
              const conflict = day ? hasConflict(day) : false;
              const selected = day === selectedDate;
              return (
                <div key={i} onClick={() => day && setSelectedDate(day)} style={{
                  minHeight: 80, padding: 6, borderRight: (i + 1) % 7 !== 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)', cursor: day ? 'pointer' : 'default',
                  background: selected ? 'rgba(168,137,68,0.08)' : isToday(day) ? 'rgba(52,211,153,0.04)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  {day && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{
                          fontSize: 12, fontWeight: isToday(day) ? 700 : 500,
                          color: isToday(day) ? '#34D399' : selected ? 'var(--primary)' : 'var(--text-muted)',
                          width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isToday(day) ? 'rgba(52,211,153,0.15)' : 'transparent',
                        }}>{day}</span>
                        {conflict && <AlertTriangle size={10} style={{ color: '#FBBF24' }} />}
                      </div>
                      {visits.slice(0, 2).map((v, vi) => (
                        <div key={vi} style={{
                          fontSize: 9, padding: '2px 5px', borderRadius: 3, marginBottom: 2,
                          background: v.type === 'Site Visit' ? 'rgba(168,137,68,0.15)' : 'rgba(96,165,250,0.15)',
                          color: v.type === 'Site Visit' ? 'var(--primary-light)' : '#60A5FA',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {v.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {v.name}
                        </div>
                      ))}
                      {visits.length > 2 && <p style={{ fontSize: 8, color: 'var(--text-dim)', textAlign: 'center' }}>+{visits.length - 2} more</p>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Selected Day Details */}
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
              {selectedDate ? `${monthName} ${selectedDate}, ${year}` : 'Select a Date'}
            </h3>
            {selectedDate ? (
              selectedDayVisits.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedDayVisits.map(v => (
                    <div key={v.id} onClick={() => navigate(`/leads/${v.id}`)} style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{v.name}</h4>
                        <Badge variant={v.type === 'Site Visit' ? 'warm' : 'nurture'} style={{ fontSize: 8 }}>{v.visitType}</Badge>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-dim)' }}>
                        <span><Clock size={10} style={{ marginRight: 3 }} />{v.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span><MapPin size={10} style={{ marginRight: 3 }} />{v.location}</span>
                      </div>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{v.project} · {v.assignedTo}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', padding: 20 }}>No visits scheduled</p>
              )
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', padding: 20 }}>Click a date to view scheduled visits</p>
            )}
          </Card>

          {/* Upcoming */}
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Upcoming (7 Days)</h3>
            {upcomingVisits.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: 16 }}>No upcoming visits</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {upcomingVisits.slice(0, 6).map(v => (
                  <div key={v.id} style={{ padding: '8px 10px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/leads/${v.id}`)}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{v.name}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-dim)' }}>{v.date.toLocaleDateString()} · {v.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Badge variant={v.type === 'Site Visit' ? 'warm' : 'nurture'} style={{ fontSize: 8 }}>{v.visitType}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Legend */}
          <Card style={{ padding: 14 }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>Legend</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(168,137,68,0.4)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Site Visit (Home/Experience Centre/Virtual)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(96,165,250,0.4)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Follow-up Call</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={10} style={{ color: '#FBBF24' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Scheduling Conflict</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const navBtnStyle = { width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' };

export default CalendarManagement;
