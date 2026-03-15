import React from 'react';
import { Package, Truck, FlaskConical, Search, Gavel, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

const STEP_ICONS = {
  'Crime Scene Officer': Package,
  'Transport Officer': Truck,
  'Forensic Scientist': FlaskConical,
  'Investigator': Search,
  'Court Official': Gavel,
};

const STEP_COLORS = {
  'Crime Scene Officer': 'cyan',
  'Transport Officer': 'amber',
  'Forensic Scientist': 'purple',
  'Investigator': 'blue',
  'Court Official': 'emerald',
};

const colorMap = {
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', line: '#06b6d4' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', line: '#f59e0b' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', line: '#8b5cf6' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', line: '#3b82f6' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', line: '#10b981' },
};

function TimelineStep({ step, index, isLast }) {
  const color = STEP_COLORS[step.role] || 'cyan';
  const colors = colorMap[color];
  const Icon = STEP_ICONS[step.role] || Package;

  const ts = (() => {
    try { return format(new Date(step.timestamp), 'MMM d, yyyy — HH:mm'); } catch { return step.timestamp; }
  })();

  return (
    <div className="relative flex gap-4">
      {/* Left column: icon + line */}
      <div className="flex flex-col items-center">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 z-10', colors.bg, colors.border)}>
          <Icon className={clsx('w-5 h-5', colors.text)} />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 mb-1" style={{ background: `linear-gradient(to bottom, ${colors.line}, transparent)`, minHeight: '32px' }} />
        )}
      </div>

      {/* Right column: content */}
      <div className={clsx('flex-1 pb-6', isLast && 'pb-0')}>
        <div className={clsx('rounded-xl border p-4 relative', colors.bg, colors.border)}>
          {/* Verification status */}
          <div className="absolute top-3 right-3">
            {step.verified ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-mono">VERIFIED</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-mono">UNVERIFIED</span>
              </div>
            )}
          </div>

          <div className={clsx('text-xs font-mono uppercase tracking-wider mb-1', colors.text)}>{step.role}</div>
          <div className="text-white font-semibold">{step.officer}</div>
          <div className="text-slate-400 text-sm mt-1">{step.action}</div>

          <div className="mt-3 flex flex-wrap gap-3">
            <div className="text-xs text-slate-500">
              <span className="text-slate-400 font-mono">📍</span> {step.location}
            </div>
            <div className="text-xs text-slate-500">
              <span className="text-slate-400 font-mono">🕐</span> {ts}
            </div>
          </div>

          {!step.verified && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400 font-mono">INTEGRITY FAILURE DETECTED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChainOfCustodyTimeline({ custody = [] }) {
  if (!custody.length) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No custody records</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Chain of Custody — {custody.length} transfers</span>
      </div>
      {custody.map((step, i) => (
        <TimelineStep key={i} step={step} index={i} isLast={i === custody.length - 1} />
      ))}
    </div>
  );
}
