import React, { useState } from 'react';
import { Gavel, Search, Shield, CheckCircle, XCircle, Hash, FileText, AlertTriangle } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { Card, Button, HashDisplay, VerifiedBadge, StatusBadge, Badge } from '../components/common/UIComponents';
import ChainOfCustodyTimeline from '../components/common/ChainOfCustodyTimeline';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function CourtPortal() {
  const { evidence, cases, reports } = useEvidence();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEv, setSelectedEv] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    await new Promise(r => setTimeout(r, 1200));

    const q = query.trim().toLowerCase();
    const matchedEvidence = evidence.filter(e =>
      e.id.toLowerCase().includes(q) ||
      e.caseId.toLowerCase().includes(q)
    );
    const matchedCase = cases.find(c =>
      c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
    const matchedReports = reports.filter(r =>
      matchedEvidence.some(e => e.id === r.evidenceId) ||
      (matchedCase && r.caseId === matchedCase.id)
    );

    setResults({ evidence: matchedEvidence, case: matchedCase, reports: matchedReports });
    setSearched(true);
    setLoading(false);
    if (matchedEvidence.length > 0) setSelectedEv(matchedEvidence[0]);
  };

  const allVerified = selectedEv && !selectedEv.tampered && selectedEv.verified;
  const evReport = selectedEv ? reports.find(r => r.evidenceId === selectedEv.id) : null;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>
          Court Verification Portal
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Gavel className="w-4 h-4 text-emerald-400" />
          <p className="text-slate-400 text-sm">Official evidence authenticity verification for court proceedings</p>
          <Badge variant="emerald">COURT AUTHORITY</Badge>
        </div>
      </div>

      {/* Verification search */}
      <Card className="border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Evidence Authenticity Verification</h2>
            <p className="text-xs text-slate-400">Enter Case ID or Evidence ID to verify blockchain integrity</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. CASE-2024-0081 or EV-2024-0081-002"
            className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#1e3a5f] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
          />
          <Button onClick={handleSearch} loading={loading} icon={Search} size="lg">
            Verify
          </Button>
        </div>

        {/* Quick search buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-slate-600 font-mono self-center">Quick verify:</span>
          {['CASE-2024-0081', 'EV-2024-0081-002', 'CASE-2024-0117'].map(id => (
            <button key={id} onClick={() => { setQuery(id); }}
              className="px-3 py-1 text-xs font-mono bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
              {id}
            </button>
          ))}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 spinner mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm">Querying blockchain records...</p>
          <p className="text-slate-600 text-xs mt-1">Verifying cryptographic signatures...</p>
        </div>
      )}

      {/* Results */}
      {searched && results && (
        <div className="space-y-6 fade-in">
          {/* Case info */}
          {results.case && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Gavel className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-mono text-slate-400 uppercase tracking-wider">Case Record</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-sm text-emerald-400">{results.case.id}</div>
                  <h3 className="text-xl font-bold text-white mt-1" style={{ fontFamily: 'Rajdhani' }}>{results.case.title}</h3>
                </div>
                <StatusBadge status={results.case.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[['Location', results.case.location], ['Investigator', results.case.investigator], ['Opened', results.case.openedDate], ['Evidence Items', results.case.evidenceCount]].map(([k, v]) => (
                  <div key={k} className="p-2 bg-[#0f172a] rounded-lg">
                    <div className="text-slate-500 mb-0.5">{k}</div>
                    <div className="text-slate-300">{v}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Evidence selector */}
          {results.evidence.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  {results.evidence.length} Evidence Item{results.evidence.length > 1 ? 's' : ''} Found
                </div>
                {results.evidence.map(ev => (
                  <button key={ev.id} onClick={() => setSelectedEv(ev)}
                    className={clsx('w-full text-left p-3 rounded-xl border transition-all',
                      selectedEv?.id === ev.id ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#1e293b] border-[#1e3a5f] hover:border-emerald-500/30'
                    )}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-cyan-400">{ev.id}</span>
                      {ev.tampered ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-sm text-slate-300 mt-0.5">{ev.type}</div>
                  </button>
                ))}
              </div>

              {/* Verification details */}
              {selectedEv && (
                <div className="xl:col-span-2 space-y-4">
                  {/* Verification status banner */}
                  <div className={clsx('flex items-center gap-3 px-5 py-4 rounded-xl border',
                    allVerified ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-red-500/10 border-red-500/40'
                  )}>
                    {allVerified ? (
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                    <div>
                      <div className={clsx('text-lg font-bold', allVerified ? 'text-emerald-400' : 'text-red-400')} style={{ fontFamily: 'Rajdhani' }}>
                        {allVerified ? '✔ EVIDENCE AUTHENTIC' : '✘ INTEGRITY FAILURE'}
                      </div>
                      <p className="text-sm text-slate-400">
                        {allVerified ? 'All blockchain verification checks passed. Evidence is admissible.' : 'Hash mismatch or signature failure detected. Evidence may be inadmissible.'}
                      </p>
                    </div>
                  </div>

                  {/* Verification badges */}
                  <div className="grid grid-cols-3 gap-3">
                    <VerifiedBadge verified={!selectedEv.tampered} label="Hash Verified" />
                    <VerifiedBadge verified={selectedEv.verified} label="Sig. Verified" />
                    <VerifiedBadge verified={selectedEv.custody?.every(c => c.verified)} label="Chain Intact" />
                  </div>

                  {/* Evidence metadata */}
                  <Card>
                    <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Evidence Metadata</h3>
                    <div className="space-y-3">
                      <HashDisplay value={selectedEv.hash} label="Evidence Hash (SHA-256)" />
                      <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                        <div className="text-xs text-slate-500 font-mono mb-1">Collector Signature</div>
                        <div className={clsx('font-mono text-xs break-all', selectedEv.verified ? 'text-emerald-400' : 'text-red-400')}>
                          {selectedEv.signature}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          ['Seal ID', selectedEv.sealId],
                          ['Collector', selectedEv.collectedBy],
                          ['Type', selectedEv.type],
                          ['Case ID', selectedEv.caseId],
                          ['Collection Date', (() => { try { return format(new Date(selectedEv.collectionDate), 'MMM d, yyyy HH:mm'); } catch { return selectedEv.collectionDate; } })()],
                          ['Location', selectedEv.location?.address || 'N/A'],
                        ].map(([k, v]) => (
                          <div key={k} className="p-2 bg-[#0f172a] rounded-lg">
                            <div className="text-slate-500 mb-0.5">{k}</div>
                            <div className="text-slate-300 break-words">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Report */}
                  {evReport && (
                    <Card>
                      <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Forensic Analysis Report</h3>
                      <div className="space-y-3">
                        <HashDisplay value={evReport.reportHash} label="Report Hash (SHA-256)" />
                        <div className="p-3 bg-[#0f172a] border border-emerald-500/20 rounded-lg">
                          <div className="text-xs text-slate-500 font-mono mb-1">Scientist Signature</div>
                          <div className="text-emerald-400 font-mono text-xs break-all">{evReport.scientistSignature}</div>
                        </div>
                        <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">Forensic Conclusion</div>
                          <p className="text-sm text-slate-300">{evReport.conclusion}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Chain of custody */}
                  <Card>
                    <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Chain of Custody Timeline</h3>
                    <ChainOfCustodyTimeline custody={selectedEv.custody} />
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {results.evidence.length === 0 && !results.case && (
            <Card>
              <div className="text-center py-16 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium text-slate-400">No records found</p>
                <p className="text-sm mt-1">No evidence or case matching "{query}" was found in the blockchain</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty state */}
      {!searched && !loading && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-emerald-400 opacity-60" />
          </div>
          <h3 className="text-xl font-bold text-slate-400" style={{ fontFamily: 'Rajdhani' }}>Awaiting Verification Request</h3>
          <p className="text-slate-600 text-sm mt-2">Enter a Case ID or Evidence ID above to begin blockchain verification</p>
        </div>
      )}
    </div>
  );
}
