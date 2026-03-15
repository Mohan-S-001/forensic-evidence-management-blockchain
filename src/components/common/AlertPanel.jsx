import React from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { useEvidence } from '../../context/EvidenceContext';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { format } from 'date-fns';

const ALERT_STYLES = {
  critical: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400', icon: AlertTriangle, label: 'CRITICAL' },
  warning: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle, label: 'WARNING' },
  info: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', icon: Info, label: 'INFO' },
  success: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle, label: 'RESOLVED' },
};

export default function AlertPanel({ maxItems = 6 }) {
  const { alerts, resolveAlert } = useEvidence();
  const sorted = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, maxItems);

  return (
    <div className="space-y-2">
      {sorted.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No active alerts
        </div>
      )}
      {sorted.map(alert => {
        const style = ALERT_STYLES[alert.type] || ALERT_STYLES.info;
        const Icon = style.icon;
        return (
          <div key={alert.id}
            className={clsx('flex items-start gap-3 px-4 py-3 border rounded-xl transition-all', style.bg,
              alert.type === 'critical' && !alert.resolved && 'alert-flash'
            )}>
            <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', style.text)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={clsx('text-xs font-mono font-bold', style.text)}>{style.label}</span>
                {alert.resolved && <span className="text-xs text-slate-500 font-mono">· RESOLVED</span>}
              </div>
              <p className="text-sm text-slate-300 leading-snug">{alert.message}</p>
              <div className="flex items-center gap-3 mt-1">
                <Link to={`/evidence/${alert.evidenceId}`} className="text-xs text-cyan-500 hover:text-cyan-400 font-mono">{alert.evidenceId}</Link>
                <span className="text-xs text-slate-600 font-mono">
                  {(() => { try { return format(new Date(alert.timestamp), 'MMM d, HH:mm'); } catch { return ''; } })()}
                </span>
              </div>
            </div>
            {!alert.resolved && (
              <button onClick={() => resolveAlert(alert.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
