import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvidence } from '../../context/EvidenceContext';
import {
  Shield, LayoutDashboard, Package, Truck, FlaskConical,
  Search, Gavel, LogOut, Bell, ChevronLeft, ChevronRight,
  Folder, AlertTriangle, User, Menu, X
} from 'lucide-react';
import { ROLE_LABELS } from '../../data/mockData';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'crime_scene_officer', 'transport_officer', 'forensic_scientist', 'investigator', 'court_official'] },
  { to: '/cases', icon: Folder, label: 'Cases', roles: ['admin', 'crime_scene_officer', 'transport_officer', 'forensic_scientist', 'investigator', 'court_official'] },
  { to: '/collection', icon: Package, label: 'Evidence Collection', roles: ['crime_scene_officer', 'admin'] },
  { to: '/transport', icon: Truck, label: 'Transportation', roles: ['transport_officer', 'admin'] },
  { to: '/laboratory', icon: FlaskConical, label: 'Forensic Lab', roles: ['forensic_scientist', 'admin'] },
  { to: '/investigator', icon: Search, label: 'Investigator', roles: ['investigator', 'admin'] },
  { to: '/court', icon: Gavel, label: 'Court Verification', roles: ['court_official', 'admin'] },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { alerts } = useEvidence();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unresolved = alerts.filter(a => !a.resolved);
  const visibleNav = NAV_ITEMS.filter(n => n.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 px-4 py-5 border-b border-[#1e3a5f]', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.05em' }}>
              FORENSIC<span className="text-cyan-400">CHAIN</span>
            </div>
            <div className="text-slate-500 text-xs font-mono">v2.4.1 — CLASSIFIED</div>
          </div>
        )}
      </div>

      {/* User info */}
      <div className={clsx('px-4 py-4 border-b border-[#1e3a5f]', collapsed && 'px-2 flex justify-center')}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <User className="w-4 h-4 text-cyan-400" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 text-sm font-bold">{user?.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-cyan-400 text-xs font-mono truncate">{user?.badge}</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {visibleNav.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => clsx(
              'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
              collapsed && 'justify-center px-2',
              isActive
                ? 'active bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
            )}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span style={{ fontFamily: 'Exo 2' }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 border-t border-[#1e3a5f]">
        <button onClick={handleLogout}
          className={clsx('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all', collapsed && 'justify-center')}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0f1e] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={clsx('hidden md:flex flex-col bg-[#0f172a] border-r border-[#1e3a5f] transition-all duration-300 flex-shrink-0', collapsed ? 'w-16' : 'w-60')}>
        <SidebarContent />
        {/* Collapse button */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-10 bg-[#1e293b] border border-[#1e3a5f] rounded-r-md flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors z-10"
          style={{ left: collapsed ? '64px' : '240px' }}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-[#0f172a] border-r border-[#1e3a5f] flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-[#0f172a] border-b border-[#1e3a5f] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
              <span className="text-xs font-mono text-emerald-400">BLOCKCHAIN SYNC: ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role badge */}
            <div className="hidden md:flex px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-xs font-mono text-cyan-400">{ROLE_LABELS[user?.role]}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-700/50 transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
                {unresolved.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unresolved.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#1e293b] border border-[#1e3a5f] rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1e3a5f] flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Alerts</span>
                    {unresolved.length > 0 && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">{unresolved.length} active</span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {alerts.slice(0, 6).map(a => (
                      <div key={a.id} className={clsx('px-4 py-3 border-b border-[#1e3a5f]/50 last:border-0',
                        a.type === 'critical' && 'bg-red-500/5',
                        a.type === 'warning' && 'bg-amber-500/5',
                      )}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={clsx('w-4 h-4 mt-0.5 flex-shrink-0',
                            a.type === 'critical' ? 'text-red-400' :
                            a.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                          )} />
                          <div>
                            <p className="text-sm text-slate-300">{a.message}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{a.evidenceId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto grid-bg p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
