import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronUp, ChevronDown, Eye, ExternalLink } from 'lucide-react';
import { StatusBadge } from './UIComponents';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function EvidenceTable({ evidence = [], compact = false }) {
  const [sortCol, setSortCol] = useState('collectionDate');
  const [sortDir, setSortDir] = useState('desc');
  const [filter, setFilter] = useState('');

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = evidence
    .filter(e => !filter || e.id.toLowerCase().includes(filter.toLowerCase()) || e.caseId.toLowerCase().includes(filter.toLowerCase()) || e.type.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (sortDir === 'desc') [va, vb] = [vb, va];
      return va < vb ? -1 : va > vb ? 1 : 0;
    });

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-cyan-400" /> : <ChevronDown className="w-3 h-3 text-cyan-400" />;
  };

  const ColHeader = ({ col, label }) => (
    <th className="px-4 py-3 text-left cursor-pointer group" onClick={() => toggleSort(col)}>
      <div className="flex items-center gap-1">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">{label}</span>
        <SortIcon col={col} />
      </div>
    </th>
  );

  return (
    <div>
      {!compact && (
        <div className="mb-4">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter by Evidence ID, Case ID, or Type..."
            className="w-full max-w-sm px-4 py-2 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#1e3a5f]">
        <table className="w-full">
          <thead className="bg-[#0f172a]">
            <tr>
              <ColHeader col="id" label="Evidence ID" />
              {!compact && <ColHeader col="caseId" label="Case" />}
              <ColHeader col="type" label="Type" />
              <ColHeader col="status" label="Status" />
              {!compact && <ColHeader col="collectionDate" label="Collected" />}
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Integrity</span>
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]/50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">No evidence records found</td></tr>
            ) : filtered.map(ev => (
              <tr key={ev.id} className="evidence-row bg-[#1e293b]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {ev.tampered && <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                    <span className="font-mono text-xs text-cyan-400">{ev.id}</span>
                  </div>
                </td>
                {!compact && (
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-400">{ev.caseId}</span>
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-300">{ev.type}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ev.tampered ? 'flagged' : ev.status} />
                </td>
                {!compact && (
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 font-mono">
                      {(() => { try { return format(new Date(ev.collectionDate), 'MMM d, yyyy'); } catch { return ev.collectionDate; } })()}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3">
                  {ev.tampered ? (
                    <span className="text-xs text-red-400 font-mono">⚠ HASH FAIL</span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-mono">✔ OK</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link to={`/evidence/${ev.id}`}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!compact && (
        <div className="mt-3 text-xs text-slate-600 font-mono">
          Showing {filtered.length} of {evidence.length} records
        </div>
      )}
    </div>
  );
}
