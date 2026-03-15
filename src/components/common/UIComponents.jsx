import React from 'react';
import clsx from 'clsx';

export function StatCard({ icon: Icon, label, value, sub, color = 'cyan', trend }) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  };
  return (
    <div className={clsx('bg-gradient-to-br border rounded-xl p-5 fade-in', colors[color])}>
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br border', colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={clsx('text-xs font-mono px-2 py-0.5 rounded-full', trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-counter text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-semibold text-slate-300" style={{ fontFamily: 'Exo 2' }}>{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

export function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  const sizes = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };
  return (
    <span className={clsx('inline-flex items-center rounded-full border font-mono font-medium', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.03em' }}>{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className, glowColor }) {
  return (
    <div className={clsx('bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5', glowColor && `glow-${glowColor}`, className)}>
      {children}
    </div>
  );
}

export function HashDisplay({ value, label }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
      {label && <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">{label}</div>}
      <div className="flex items-center gap-2">
        <div className="hash-display text-emerald-400 flex-1 text-xs break-all">{value}</div>
        <button onClick={copy} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex-shrink-0 font-mono">
          {copied ? '✓' : 'COPY'}
        </button>
      </div>
    </div>
  );
}

export function VerifiedBadge({ verified, label }) {
  return (
    <div className={clsx(
      'flex items-center gap-2 px-3 py-2 rounded-lg border',
      verified
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 verified-badge'
        : 'bg-red-500/10 border-red-500/30 text-red-400'
    )}>
      <span className="text-base">{verified ? '✔' : '✘'}</span>
      <span className="text-sm font-mono">{label || (verified ? 'Verified' : 'Failed')}</span>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    collected: { v: 'cyan', l: 'Collected' },
    in_transit: { v: 'amber', l: 'In Transit' },
    in_lab: { v: 'purple', l: 'In Laboratory' },
    analysis_complete: { v: 'emerald', l: 'Analysis Done' },
    court_review: { v: 'blue', l: 'Court Review' },
    flagged: { v: 'red', l: '⚠ FLAGGED' },
    active: { v: 'emerald', l: 'Active' },
    closed: { v: 'default', l: 'Closed' },
    pending: { v: 'amber', l: 'Pending' },
    in_progress: { v: 'blue', l: 'In Progress' },
    completed: { v: 'emerald', l: 'Completed' },
    critical: { v: 'red', l: 'Critical' },
    high: { v: 'amber', l: 'High' },
    medium: { v: 'blue', l: 'Medium' },
    low: { v: 'default', l: 'Low' },
  };
  const s = map[status] || { v: 'default', l: status };
  return <Badge variant={s.v}>{s.l}</Badge>;
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-8">
      <div className={clsx('spinner', sizes[size])} />
    </div>
  );
}

export function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="w-12 h-12 text-slate-600 mb-4" />}
      <p className="text-slate-400 font-medium">{message}</p>
      {sub && <p className="text-slate-600 text-sm mt-1">{sub}</p>}
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">{label}</label>}
      <input
        className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">{label}</label>}
      <select
        className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">{label}</label>}
      <textarea
        className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
        rows={4}
        {...props}
      />
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', loading, icon: Icon, ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500',
    secondary: 'bg-[#1e293b] border border-[#1e3a5f] text-slate-300 hover:border-cyan-500/50 hover:text-white',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
    success: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-700/50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  };
  return (
    <button
      className={clsx('inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size])}
      style={{ fontFamily: 'Rajdhani', letterSpacing: '0.03em' }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <div className="w-4 h-4 spinner" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full bg-[#1e293b] border border-[#1e3a5f] rounded-2xl shadow-2xl', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f]">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white text-xl transition-colors">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
