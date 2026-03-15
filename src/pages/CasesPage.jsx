import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, Plus, Search, Eye } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { useAuth } from '../context/AuthContext';
import { SectionHeader, Card, StatusBadge, Badge, Button, Modal, Input, Select, Textarea } from '../components/common/UIComponents';
import EvidenceTable from '../components/common/EvidenceTable';
import { format } from 'date-fns';

const PRIORITY_COLORS = { critical: 'red', high: 'amber', medium: 'blue', low: 'default' };

export default function CasesPage() {
  const { cases, evidence, addCase } = useEvidence();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'medium', location: '', investigator: user?.name || '' });

  const filtered = cases.filter(c =>
    !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.title) return;
    addCase({ ...form, openedDate: new Date().toISOString().split('T')[0] });
    setShowCreate(false);
    setForm({ title: '', priority: 'medium', location: '', investigator: user?.name || '' });
  };

  const caseEvidence = selectedCase ? evidence.filter(e => e.caseId === selectedCase.id) : [];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>Cases</h1>
          <p className="text-slate-400 text-sm mt-0.5">{cases.length} total cases — {cases.filter(c => c.status === 'active').length} active</p>
        </div>
        {(user?.role === 'crime_scene_officer' || user?.role === 'admin') && (
          <Button icon={Plus} onClick={() => setShowCreate(true)}>New Case</Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cases..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Cases grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <button key={c.id} onClick={() => setSelectedCase(c)}
            className="text-left bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5 hover:border-cyan-500/40 transition-all group fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Folder className="w-4 h-4 text-cyan-400" />
                </div>
                <Badge variant={PRIORITY_COLORS[c.priority] || 'default'}>{c.priority}</Badge>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="font-mono text-xs text-cyan-400 mb-1">{c.id}</div>
            <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2" style={{ fontFamily: 'Rajdhani', fontSize: '1.05rem' }}>
              {c.title}
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <div>📍 {c.location}</div>
              <div>👤 {c.investigator}</div>
              <div>📅 Opened {c.openedDate}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#1e3a5f] flex items-center justify-between">
              <span className="text-xs text-slate-500">{c.evidenceCount} evidence items</span>
              <span className="text-xs text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
            </div>
          </button>
        ))}
      </div>

      {/* Case detail modal */}
      <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={selectedCase?.id || 'Case Details'} size="lg">
        {selectedCase && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{selectedCase.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedCase.status} />
                  <Badge variant={PRIORITY_COLORS[selectedCase.priority]}>{selectedCase.priority} priority</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Location', selectedCase.location],
                ['Investigator', selectedCase.investigator],
                ['Opened', selectedCase.openedDate],
                ['Evidence Items', selectedCase.evidenceCount],
              ].map(([k, v]) => (
                <div key={k} className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 font-mono mb-0.5">{k}</div>
                  <div className="text-white font-medium">{v}</div>
                </div>
              ))}
            </div>
            {caseEvidence.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Evidence in this Case</div>
                <EvidenceTable evidence={caseEvidence} compact />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create case modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Case">
        <div className="space-y-4">
          <Input label="Case Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Downtown Robbery Investigation" />
          <Select label="Priority" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Primary scene location" />
          <Input label="Lead Investigator" value={form.investigator} onChange={e => setForm(f => ({ ...f, investigator: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowCreate(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} className="flex-1" icon={Plus}>Create Case</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
