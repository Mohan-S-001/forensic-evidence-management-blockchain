import React, { useState } from 'react';
import { Search, FileText, Eye, Download, Folder, Shield, Hash } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { SectionHeader, Card, HashDisplay, StatusBadge, VerifiedBadge, Button, Badge } from '../components/common/UIComponents';
import ChainOfCustodyTimeline from '../components/common/ChainOfCustodyTimeline';
import EvidenceTable from '../components/common/EvidenceTable';
import { format } from 'date-fns';

export default function InvestigatorPortal() {
  const { evidence, cases, reports } = useEvidence();
  const [tab, setTab] = useState('cases');
  const [search, setSearch] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const filteredCases = cases.filter(c =>
    !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
  );
  const filteredEvidence = evidence.filter(e =>
    !search || e.id.toLowerCase().includes(search.toLowerCase()) || e.caseId.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase())
  );
  const caseEvidence = selectedCase ? evidence.filter(e => e.caseId === selectedCase.id) : [];
  const evReport = selectedEvidence ? reports.find(r => r.evidenceId === selectedEvidence.id) : null;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>
          Investigator Portal
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Search className="w-4 h-4 text-blue-400" />
          <p className="text-slate-400 text-sm">Read-only evidence review and case management</p>
          <Badge variant="blue">READ ONLY</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cases, evidence ID, or type..."
          className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-[#1e3a5f] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#1e293b] border border-[#1e3a5f] rounded-xl w-fit">
        {[{ id: 'cases', label: 'Cases' }, { id: 'evidence', label: 'All Evidence' }, { id: 'reports', label: 'Forensic Reports' }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelectedEvidence(null); setSelectedCase(null); }}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${tab === t.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'}`}
            style={{ fontFamily: 'Exo 2' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'cases' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-3">
            {filteredCases.map(c => (
              <button key={c.id} onClick={() => { setSelectedCase(c); setSelectedEvidence(null); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCase?.id === c.id ? 'bg-blue-500/10 border-blue-500/40' : 'bg-[#1e293b] border-[#1e3a5f] hover:border-blue-500/30'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-blue-400">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-white font-medium text-sm" style={{ fontFamily: 'Rajdhani' }}>{c.title}</div>
                <div className="text-slate-500 text-xs mt-1">{c.evidenceCount} items · {c.location}</div>
              </button>
            ))}
          </div>

          <div className="xl:col-span-2">
            {selectedCase ? (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-mono text-sm text-blue-400 mb-1">{selectedCase.id}</div>
                      <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{selectedCase.title}</h2>
                    </div>
                    <StatusBadge status={selectedCase.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[['Location', selectedCase.location], ['Investigator', selectedCase.investigator], ['Opened', selectedCase.openedDate], ['Priority', selectedCase.priority]].map(([k, v]) => (
                      <div key={k} className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                        <div className="text-xs text-slate-500 font-mono mb-0.5">{k}</div>
                        <div className="text-white">{v}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <SectionHeader title="Evidence in this Case" />
                  <EvidenceTable evidence={caseEvidence} compact />
                </Card>
              </div>
            ) : (
              <Card>
                <div className="text-center py-20 text-slate-600">
                  <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a case to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === 'evidence' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <Card>
              <SectionHeader title="Evidence Records" subtitle={`${filteredEvidence.length} items`} />
              <div className="space-y-2">
                {filteredEvidence.map(ev => (
                  <button key={ev.id} onClick={() => setSelectedEvidence(ev)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedEvidence?.id === ev.id ? 'bg-blue-500/10 border-blue-500/40' : 'bg-[#0f172a] border-[#1e3a5f] hover:border-blue-500/30'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-cyan-400">{ev.id}</span>
                      {ev.tampered && <span className="text-xs text-red-400">⚠</span>}
                    </div>
                    <div className="text-sm text-slate-300 mt-0.5 truncate">{ev.type}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{ev.caseId}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="xl:col-span-2">
            {selectedEvidence ? (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="font-mono text-sm text-cyan-400">{selectedEvidence.id}</span>
                      <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Rajdhani' }}>{selectedEvidence.type}</h2>
                      <p className="text-slate-400 text-sm mt-1">{selectedEvidence.description}</p>
                    </div>
                    <StatusBadge status={selectedEvidence.tampered ? 'flagged' : selectedEvidence.status} />
                  </div>

                  {/* File previews */}
                  {selectedEvidence.files?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Evidence Files</div>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedEvidence.files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                            <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs text-slate-300 truncate">{f.name}</div>
                              <div className="text-xs text-slate-600">{f.size}</div>
                            </div>
                            <Button variant="ghost" size="sm" icon={Eye} className="ml-auto flex-shrink-0">View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <HashDisplay value={selectedEvidence.hash} label="Evidence Hash (SHA-256)" />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <VerifiedBadge verified={!selectedEvidence.tampered} label="Hash Verified" />
                    <VerifiedBadge verified={selectedEvidence.verified} label="Signature Valid" />
                  </div>
                </Card>

                <Card>
                  <SectionHeader title="Chain of Custody" />
                  <ChainOfCustodyTimeline custody={selectedEvidence.custody} />
                </Card>

                {evReport && (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <SectionHeader title="Forensic Report" />
                      <Button icon={Download} variant="secondary" size="sm">Download</Button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[['Scientist', evReport.scientist], ['Type', evReport.analysisType], ['Status', evReport.status], ['Completed', format(new Date(evReport.completionDate), 'MMM d, yyyy')]].map(([k, v]) => (
                          <div key={k} className="p-2 bg-[#0f172a] rounded-lg">
                            <div className="text-slate-500 mb-0.5">{k}</div>
                            <div className="text-slate-300">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Conclusion</div>
                        <p className="text-sm text-slate-300">{evReport.conclusion}</p>
                      </div>
                      <HashDisplay value={evReport.reportHash} label="Report Hash" />
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <div className="text-center py-20 text-slate-600">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select evidence to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-4">
          {reports.map(r => (
            <Card key={r.id} className="fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-sm text-purple-400 mb-1">{r.id}</div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{r.analysisType}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  <Button icon={Download} variant="secondary" size="sm">PDF</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                {[['Report ID', r.id], ['Evidence', r.evidenceId], ['Scientist', r.scientist], ['Case', r.caseId]].map(([k, v]) => (
                  <div key={k} className="p-2 bg-[#0f172a] rounded-lg">
                    <div className="text-slate-500 mb-0.5">{k}</div>
                    <div className="text-slate-300 font-mono truncate">{v}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Observations</div>
                  <p className="text-slate-300 text-xs">{r.observations}</p>
                </div>
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Conclusion</div>
                  <p className="text-slate-300 text-xs">{r.conclusion}</p>
                </div>
              </div>
              <HashDisplay value={r.reportHash} label="Report Hash (SHA-256)" />
              <div className="mt-3 p-3 bg-[#0f172a] border border-emerald-500/20 rounded-lg">
                <div className="text-xs text-slate-500 font-mono mb-1">Scientist Digital Signature</div>
                <div className="text-emerald-400 font-mono text-xs break-all">{r.scientistSignature}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
