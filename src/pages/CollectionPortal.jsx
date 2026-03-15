import React, { useState } from 'react';
import { Package, Plus, QrCode, Hash, MapPin, Clock, Upload, FileText, Image, Video, CheckCircle } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { useAuth } from '../context/AuthContext';
import {
  SectionHeader, Card, Button, Input, Select, Textarea,
  HashDisplay, Badge, StatusBadge, Modal
} from '../components/common/UIComponents';
import EvidenceTable from '../components/common/EvidenceTable';
import QRCodeDisplay from '../components/common/QRCodeDisplay';
import { EVIDENCE_TYPES } from '../data/mockData';
import { format } from 'date-fns';

function generateHash() {
  const chars = '0123456789abcdef';
  return 'SHA256:' + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

export default function CollectionPortal() {
  const { evidence, cases, addEvidence } = useEvidence();
  const { user } = useAuth();
  const [tab, setTab] = useState('list');
  const [form, setForm] = useState({
    caseId: '', type: '', description: '', collectedBy: user?.name || '',
    location: { address: '', lat: '', lng: '' }, collectionDate: new Date().toISOString().slice(0, 16),
  });
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const myEvidence = evidence.filter(e => e.collectedBy === user?.name || user?.role === 'admin');

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.caseId || !form.type || !form.description) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newEv = addEvidence({
      ...form,
      files: files.map(f => ({ name: f.name, type: f.type.startsWith('image') ? 'image' : f.type.startsWith('video') ? 'video' : 'document', size: (f.size / 1024).toFixed(0) + 'KB' })),
    });
    setSubmitted(newEv);
    setLoading(false);
    setFiles([]);
  };

  const tabs = [
    { id: 'list', label: 'Evidence List' },
    { id: 'create', label: 'Create Evidence Entry' },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>
          Evidence Collection Portal
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Package className="w-4 h-4 text-cyan-400" />
          <p className="text-slate-400 text-sm">Crime Scene Evidence Collection & Registration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#1e293b] border border-[#1e3a5f] rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSubmitted(null); }}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${tab === t.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
            style={{ fontFamily: 'Exo 2' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <Card>
          <SectionHeader title="Collected Evidence" subtitle={`${myEvidence.length} items collected by ${user?.name}`} />
          <EvidenceTable evidence={myEvidence} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form */}
          <div className="xl:col-span-2 space-y-4">
            {submitted ? (
              <Card glowColor="green">
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Rajdhani' }}>Evidence Registered Successfully</h3>
                  <p className="text-slate-400 text-sm mb-6">Blockchain record created and signed</p>
                  <div className="space-y-3 text-left max-w-lg mx-auto">
                    <HashDisplay value={submitted.id} label="Evidence ID" />
                    <HashDisplay value={submitted.hash} label="Evidence Hash (SHA-256)" />
                    <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                      <div className="text-xs text-slate-500 font-mono mb-1">Digital Signature</div>
                      <div className="text-emerald-400 font-mono text-xs break-all">{submitted.signature}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 justify-center">
                    <Button variant="secondary" onClick={() => { setSubmitted(null); setForm({ caseId: '', type: '', description: '', collectedBy: user?.name || '', location: { address: '', lat: '', lng: '' }, collectionDate: new Date().toISOString().slice(0, 16) }); }}>
                      Register Another
                    </Button>
                    <Button onClick={() => setTab('list')}>View Evidence List</Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <SectionHeader title="New Evidence Entry" subtitle="Complete all fields accurately" />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Case ID *" value={form.caseId} onChange={e => setField('caseId', e.target.value)}>
                      <option value="">Select case...</option>
                      {cases.filter(c => c.status === 'active').map(c => (
                        <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
                      ))}
                    </Select>
                    <Select label="Evidence Type *" value={form.type} onChange={e => setField('type', e.target.value)}>
                      <option value="">Select type...</option>
                      {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </div>

                  <Textarea label="Description *" value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Detailed description of the evidence..." />

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Collector Name" value={form.collectedBy} onChange={e => setField('collectedBy', e.target.value)} />
                    <Input label="Date & Time" type="datetime-local" value={form.collectionDate} onChange={e => setField('collectionDate', e.target.value)} />
                  </div>

                  <Input label="Location / Address" value={form.location.address} onChange={e => setField('location', { ...form.location, address: e.target.value })} placeholder="Scene address or GPS coordinates" />

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="GPS Latitude (optional)" type="number" step="0.000001" value={form.location.lat} onChange={e => setField('location', { ...form.location, lat: e.target.value })} placeholder="40.7128" />
                    <Input label="GPS Longitude (optional)" type="number" step="0.000001" value={form.location.lng} onChange={e => setField('location', { ...form.location, lng: e.target.value })} placeholder="-74.0060" />
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Evidence Files</label>
                    <div className="border-2 border-dashed border-[#1e3a5f] rounded-xl p-6 text-center hover:border-cyan-500/40 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('file-upload').click()}>
                      <Upload className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Click to upload or drag files here</p>
                      <p className="text-slate-600 text-xs mt-1">Images, Videos, Documents</p>
                      <input id="file-upload" type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" className="hidden"
                        onChange={e => setFiles(Array.from(e.target.files))} />
                    </div>
                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                            {f.type.startsWith('image') ? <Image className="w-4 h-4 text-cyan-400" /> :
                              f.type.startsWith('video') ? <Video className="w-4 h-4 text-purple-400" /> :
                              <FileText className="w-4 h-4 text-amber-400" />}
                            <span className="text-sm text-slate-300 flex-1 truncate">{f.name}</span>
                            <span className="text-xs text-slate-500">{(f.size / 1024).toFixed(0)}KB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button onClick={handleSubmit} loading={loading} className="w-full" size="lg" icon={Package}>
                    Register Evidence & Generate Blockchain Record
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Hash Preview</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 font-mono mb-1">Algorithm</div>
                  <div className="text-cyan-400 font-mono text-sm">SHA-256 + ECDSA</div>
                </div>
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 font-mono mb-1">Block Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
                    <span className="text-emerald-400 font-mono text-sm">Chain Active</span>
                  </div>
                </div>
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 font-mono mb-1">Officer Signature</div>
                  <div className="text-emerald-400 font-mono text-xs">{user?.badge} — VALID</div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Collection Guidelines</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  'Photograph evidence before collection',
                  'Use appropriate gloves and containers',
                  'Seal evidence immediately after collection',
                  'Note exact GPS coordinates when possible',
                  'Document all witnesses present',
                  'Verify seal ID is recorded',
                ].map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-500 flex-shrink-0 font-mono">{String(i + 1).padStart(2, '0')}.</span>
                    {g}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
