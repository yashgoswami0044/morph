import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, List, Plus, CheckCircle, BarChart2, Settings, LogOut, Search, Bell,
  FileText, AlertTriangle, BookOpen, ArrowRightLeft, MapPin, IndianRupee, Layers, PieChart, MessageSquare,
  ChevronLeft, ChevronRight, ChevronDown,
  Phone, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLeads } from '../../context/LeadContext.jsx';
import { Badge } from '../ui/index.jsx';
import logo from '../../assets/morph-logo-white.png';
import collapsedLogo from '/morph-logo-colleps.png';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { leads, notifications } = useLeads();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed);
    document.documentElement.style.setProperty('--sidebar-w', isCollapsed ? '72px' : '240px');
  }, [isCollapsed]);

  const pendingReviews = leads.filter(l => l.status === 'Not Qualified' || (l.status === 'Validated' && l.assignedRole === 'Sales Manager')).length;
  const overdueQueue = leads.filter(l => l.status === 'Untouched' && l.statusHistory?.[0]?.date && (Date.now() - new Date(l.statusHistory[0].date).getTime()) > 48 * 3600000).length;
  const escalationCount = leads.filter(l => l.status === 'Untouched' && l.statusHistory?.[0]?.date && (Date.now() - new Date(l.statusHistory[0].date).getTime()) > 48 * 3600000).length;

  const allRoles = ['Pre-sales Executive', 'Regional Manager', 'Sales Manager', 'Sales Executive', 'CRM Head'];

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/', roles: allRoles },
    { name: 'Lead Queue', icon: List, path: '/leads', roles: allRoles, badge: overdueQueue > 0 ? overdueQueue : null, badgeVariant: 'hot' },
    { name: 'Add Lead', icon: Plus, path: '/leads/new', roles: ['Pre-sales Executive', 'Regional Manager', 'Sales Manager', 'CRM Head'] },
    { name: 'Review Queue', icon: CheckCircle, path: '/review', roles: ['Regional Manager', 'Sales Manager', 'CRM Head'], badge: pendingReviews > 0 ? pendingReviews : null, badgeVariant: 'warm' },
    { name: 'Escalations', icon: AlertTriangle, path: '/escalations', roles: ['Regional Manager', 'Sales Manager', 'CRM Head'], badge: escalationCount > 0 ? escalationCount : null, badgeVariant: 'hot' },
    { name: 'Catalogues', icon: BookOpen, path: '/catalogues', roles: allRoles },
    { name: 'Site Visits', icon: MapPin, path: '/site-visits', roles: ['Sales Manager', 'Sales Executive', 'Regional Manager', 'CRM Head'] },
    { name: 'Sales Process', icon: IndianRupee, path: '/sales-process', roles: ['Sales Manager', 'Sales Executive', 'Regional Manager', 'CRM Head'] },
    { name: 'Projects', icon: Layers, path: '/projects', roles: ['Sales Manager', 'Sales Executive', 'Regional Manager', 'CRM Head'] },
    { name: 'Reports', icon: PieChart, path: '/reports', roles: ['Regional Manager', 'Sales Manager', 'CRM Head'] },
    { name: 'Communication', icon: MessageSquare, path: '/communication', roles: ['Sales Manager', 'Sales Executive', 'Regional Manager', 'CRM Head'] },
    { name: 'Telephony', icon: Phone, path: '/telephony', roles: ['Pre-sales Executive', 'Regional Manager', 'CRM Head'] },
    { name: 'Calendar', icon: Calendar, path: '/calendar', roles: allRoles },
    { name: 'Pipeline', icon: BarChart2, path: '/analytics', roles: ['Regional Manager', 'Sales Manager', 'CRM Head'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['Regional Manager', 'CRM Head'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="app-sidebar" style={{
      background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 64, position: 'relative', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <img src={collapsedLogo} alt="Morph" style={{
          height: 28, objectFit: 'contain', position: 'absolute', top: '50%', left: '50%',
          transform: isCollapsed ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.5)',
          opacity: isCollapsed ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
        <img src={logo} alt="Morph" style={{
          height: 32, objectFit: 'contain', position: 'absolute', top: '50%', left: 24,
          transform: isCollapsed ? 'translateY(-50%) translateX(-20px)' : 'translateY(-50%) translateX(0)',
          opacity: isCollapsed ? 0 : 1, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowX: 'hidden' }}>
        {filteredNav.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
            title={isCollapsed ? item.name : undefined}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 20 }}>
              <item.icon size={20} />
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap',
              maxWidth: isCollapsed ? 0 : 200, opacity: isCollapsed ? 0 : 1,
              marginLeft: isCollapsed ? 0 : 12, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge != null && (
                <Badge variant={item.badgeVariant || 'gray'} style={{ fontSize: 10, padding: '2px 6px', lineHeight: 1 }}>{item.badge}</Badge>
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ChevronLeft size={20} style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </button>
      </div>

      <style>{`
        .sidebar-item { display: flex; align-items: center; padding: 0.625rem 0.875rem; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; color: var(--text-muted); transition: all 0.2s; text-decoration: none; }
        .sidebar-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .sidebar-item--active { color: var(--primary-light) !important; background: var(--primary-bg) !important; border-left: 3px solid var(--primary); }
      `}</style>
    </aside>
  );
};

export const Header = () => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useLeads();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="app-header">
      <div style={{ position: 'relative', maxWidth: 420, flex: 1 }}>
        <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={18} />
        <input type="text" placeholder="Search leads, projects (Ctrl+K)" style={{ width: '100%', paddingLeft: 42, paddingRight: 16, height: 40, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'white', fontSize: 13, outline: 'none' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{ position: 'relative', padding: 8, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, background: '#EF4444', borderRadius: '50%', border: '2px solid var(--bg-content)', fontSize: 9, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position: 'absolute', right: 0, top: 48, width: 380, maxHeight: 400, overflowY: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', zIndex: 100 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Notifications</h4>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{unreadCount} unread</span>
              </div>
              {notifications.slice(0, 15).map(n => (
                <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(168,137,68,0.05)', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <p style={{ fontSize: 12, color: n.read ? 'var(--text-muted)' : 'white', marginBottom: 2 }}>{n.message}</p>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{new Date(n.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              {notifications.length === 0 && <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-dim)' }}>No notifications</p>}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 28, background: 'var(--border)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399' }}></span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{user?.region || 'All Regions'}</span>
        </div>

        <div style={{ width: 1, height: 28, background: 'var(--border)' }}></div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-md)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-content)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{user?.name}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{user?.role}</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-dim)', marginLeft: 4 }} />
          </button>

          {showProfileMenu && (
            <div style={{ position: 'absolute', right: 0, top: 48, width: 220, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', zIndex: 100, padding: 8, animation: 'fadeIn 0.2s' }}>
              <div style={{ padding: '8px 12px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email || 'admin@morph.com'}</p>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 12px', background: 'transparent', color: '#F87171', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left', fontSize: 13 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { PageTransition } from './PageTransition.jsx';
