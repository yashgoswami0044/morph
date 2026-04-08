import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, List, Plus, CheckCircle, BarChart2, Settings, LogOut, Search, Bell,
  FileText, AlertTriangle, BookOpen, ArrowRightLeft, MapPin, IndianRupee, Layers, PieChart, MessageSquare,
  ChevronLeft, ChevronRight, ChevronDown, Sun, Moon,
  Phone, Calendar, GitMerge
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
    { name: 'Unified Pipeline', icon: GitMerge, path: '/pipeline', roles: ['Sales Manager', 'Regional Manager', 'CRM Head'] },
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
        <img src={logo} alt="Morph" className="sidebar-logo" style={{
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
              opacity: isCollapsed ? 0 : 1, width: '100%',
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
        .sidebar-item:hover { color: #A88944; background: var(--glass-hover); }
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
  const [theme, setTheme] = useState('dark');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <header className="app-header">
      {/* Search Bar */}
      <div style={{ position: 'relative', width: 380, flexShrink: 0 }}>
        <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--primary)' : 'var(--text-dim)', transition: 'color 0.2s ease' }} size={16} />
        <input
          type="text"
          placeholder="Search leads, projects..."
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          style={{
            width: '100%', paddingLeft: 40, paddingRight: 64, height: 40,
            background: isSearchFocused ? 'var(--bg-elevated)' : 'var(--bg-main)',
            border: `1px solid ${isSearchFocused ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', color: 'var(--text-main)', fontSize: 13,
            outline: 'none', transition: 'all 0.2s ease',
            boxShadow: isSearchFocused ? 'var(--shadow-gold)' : 'none'
          }}
        />
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'inherit', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>Ctrl K</kbd>
        </div>
      </div>

      <div style={{ flex: 1 }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Region Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--glass-light)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <span className="status-dot pulsing"></span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{user?.region || 'Bangalore East'}</span>
        </div>

        <div className="header-divider"></div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="header-icon-btn" title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotifs(!showNotifs); setShowProfileMenu(false); }} className={`header-icon-btn ${showNotifs ? 'active' : ''}`} title="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div className="header-dropdown animate-fade-in" style={{ right: -60, width: 340 }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Notifications</h4>
                <Badge variant="hot" style={{ fontSize: 10 }}>{unreadCount} New</Badge>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }} className="custom-scrollbar">
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} onClick={() => markNotificationRead(n.id)} className="dropdown-item" style={{ background: n.read ? 'transparent' : 'var(--primary-bg)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : 'var(--primary)', marginTop: 4, flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: n.read ? 'var(--text-muted)' : 'var(--text-main)', marginBottom: 4, lineHeight: 1.4 }}>{n.message}</p>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div style={{ padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Bell size={24} style={{ color: 'var(--text-dim)', opacity: 0.5 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>You're all caught up!</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div style={{ padding: '10px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                  <button style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Mark all as read</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* <div className="header-divider"></div> */}

        {/* Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }} className={`profile-trigger ${showProfileMenu ? 'active' : ''}`}>
            <div className="avatar">
              {user?.name?.[0]?.toUpperCase() || 'D'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>{user?.name || 'Demo'}</span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.2 }}>{user?.role || 'CRM Head'}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="header-dropdown animate-fade-in" style={{ right: 0, width: 240 }}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                  {user?.name?.[0]?.toUpperCase() || 'D'}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>{user?.name || 'Demo User'}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email || 'admin@morph.com'}</p>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <div style={{ padding: '8px' }}>
                <button className="dropdown-menu-item">
                  <Settings size={16} /> Account Settings
                </button>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <button onClick={logout} className="dropdown-menu-item danger">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .header-icon-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--glass-light); border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .header-icon-btn:hover { background: var(--glass-hover); color: var(--text-main); border-color: var(--border-highlight); transform: translateY(-1px); }
        .header-icon-btn.active { background: var(--primary-bg); color: var(--primary); border-color: var(--primary); }

        .header-divider { width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, var(--border), transparent); }

        .notif-badge { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; background: var(--status-hot); border-radius: 9px; border: 2px solid var(--bg-header); font-size: 10px; font-weight: 700; color: white; display: flex; align-items: center; justify-content: center; padding: 0 4px; animation: popIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--status-success); }
        .status-dot.pulsing { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); animation: pulseGreen 2s infinite; }

        .profile-trigger { display: flex; align-items: center; gap: 10px; background: transparent; border: 1px solid transparent; cursor: pointer; padding: 4px 10px 4px 4px; border-radius: var(--radius-lg); transition: all 0.2s; }
        .profile-trigger:hover, .profile-trigger.active { background: var(--glass-hover); border-color: var(--border); }

        .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-bg); border: 1px solid var(--border-highlight); display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 700; font-size: 13px; }

        .header-dropdown { position: absolute; top: calc(100% + 12px); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg), var(--shadow-gold); z-index: 100; overflow: hidden; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transform-origin: top right; }

        .dropdown-item { padding: 12px 16px; display: flex; gap: 12px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid var(--border); }
        .dropdown-item:last-child { border-bottom: none; }
        .dropdown-item:hover { background: var(--glass-hover) !important; }

        .dropdown-menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; background: transparent; color: var(--text-main); border: none; border-radius: var(--radius-md); cursor: pointer; text-align: left; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .dropdown-menu-item:hover { background: var(--glass-hover); color: var(--primary); transform: translateX(2px); }
        .dropdown-menu-item.danger { color: var(--status-hot); text-decoration: none !important; }
        .dropdown-menu-item.danger:hover { background: rgba(248, 113, 113, 0.1); color: var(--status-hot); transform: translateX(2px); }

        @keyframes pulseGreen { 0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); } 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); } }
        @keyframes popIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
      `}</style>
    </header>
  );
};

export { PageTransition } from './PageTransition.jsx';
