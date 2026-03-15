import React, { useState } from 'react';
import { FlaskConical, QrCode, CheckCircle, Upload, FileText, AlertTriangle, User, Hash } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { useAuth } from '../context/AuthContext';
import { SectionHeader, Card, Button, HashDisplay, VerifiedBadge, StatusBadge, Input, Select, Textarea } from '../components/common/UIComponents';
import QRScanner from '../components/common/QRScanner';
import ChainOfCustodyTimeline from '../components/common/ChainOfCustodyTimeline';
import EvidenceTable from '../components/common/EvidenceTable';
import { format } from 'date-fns';
import clsx from 'clsx';

const ANALYSIS_TYPES = [
  'DNA Analysis', 'Fingerprint Analysis', 'Ballistics', 'Toxicology',
  'Digital Forensics', 'Trace Evidence', 'Serology', 'Document Examination',
  'Firearm Examination', 'Chemical Analysis', 'Biological Examination',
];

function generateHash() {
  const chars = '0123456789abcdef';
  return 'SHA256:' + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

export default function LaboratoryPortal() {
  const { evidence, reports, updateEvidenceStatus } = useEvidence();
  const { user } = useAuth();
  const [tab, setTab] = useState('inbox');
  const [scanned, setScanned] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [analysisForm, setAnalysisForm] = useState({ type: '', notes: '', conclusion: '' });
  const [reportGenerated, setReportGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

  const labEvidence = evidence.filter(e => e.status === 'in_lab' || e.status === 'in_transit');
  const inProgress = evidence.filter(e => e.analysisStatus === 'in_progress');
  const completed = evidence.filter(e => e.analysisStatus === 'completed');

  const handleScan = (ev) => { setScanned(ev); setTab('receive'); };

  const handleAccept = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    updateEvidenceStatus(scanned.id, 'in_lab', {
      officer: user?.name,
      role: 'Forensic Scientist',
      timestamp: new Date().toISOString(),
      location: 'Forensic Lab — Bay ' + Math.ceil(Math.random() * 5),
      action: 'Received at Laboratory',
      verified: !scanned.tampered,
    });
    setAccepted(true);
    setLoading(false);
  };

  const handleGenerateReport = async () => {
    if (!analysisForm.type || !analysisForm.notes || !analysisForm.conclusion) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const rpt = {
      id: `RPT-${Date.now()}`,
      evidenceId: scanned.id,
      scientist: user?.name,
      analysisType: analysisForm.type,
      observations: analysisForm.notes,
      conclusion: analysisForm.conclusion,
      completionDate: new Date().toISOString(),
      reportHash: generateHash(),
      scientistSignature: `SIG:${user?.badge}:${Date.now()}:VALID`,
    };
    updateEvidenceStatus(scanned.id, 'in_lab');
    setReportGenerated(rpt);
    setLoading(false);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>
          Forensic Laboratory Portal
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <p className="text-slate-400 text-sm">Evidence Analysis & Report Generation</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'In Lab', value: labEvidence.length, color: 'purple' },
          { label: 'In Progress', value: inProgress.length, color: 'blue' },
          { label: 'Completed', value: completed.length + reports.length, color: 'emerald' },
        ].map(s => (
          <div key={s.label} className={`p-4 bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-xl`}>
            <div className={`font-counter text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#1e293b] border border-[#1e3a5f] rounded-xl w-fit">
        {[
          { id: 'inbox', label: 'Lab Inbox' },
          { id: 'receive', label: 'Receive Evidence' },
          { id: 'reports', label: 'Analysis Reports' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${tab === t.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white'}`}
            style={{ fontFamily: 'Exo 2' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'inbox' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Laboratory Evidence Queue" subtitle="Evidence pending analysis" />
            <QRScanner onScan={handleScan} />
          </div>
          <EvidenceTable evidence={labEvidence} />
        </Card>
      )}

      {tab === 'receive' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            {!scanned ? (
              <Card>
                <SectionHeader title="Receive Evidence" subtitle="Scan QR code to begin reception process" />
                <div className="text-center py-10">
                  <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-40" />
                  <p className="text-slate-400 mb-4">Scan the evidence QR code to proceed</p>
                  <QRScanner onScan={handleScan} />
                </div>
              </Card>
            ) : reportGenerated ? (
              <Card glowColor="green">
                <div className="py-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Forensic Report Generated</h3>
                      <p className="text-sm text-slate-400">{reportGenerated.id}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <HashDisplay value={reportGenerated.reportHash} label="Report Hash (SHA-256)" />
                    <div className="p-3 bg-[#0f172a] border border-emerald-500/20 rounded-lg">
                      <div className="text-xs text-slate-500 font-mono mb-1">Scientist Signature</div>
                      <div className="text-emerald-400 font-mono text-xs break-all">{reportGenerated.scientistSignature}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-[#0f172a] rounded-lg">
                        <div className="text-slate-500 mb-0.5">Analysis Type</div>
                        <div className="text-white">{reportGenerated.analysisType}</div>
                      </div>
                      <div className="p-2 bg-[#0f172a] rounded-lg">
                        <div className="text-slate-500 mb-0.5">Completed</div>
                        <div className="text-white font-mono">{format(new Date(reportGenerated.completionDate), 'MMM d, HH:mm')}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Conclusion</div>
                      <div className="text-sm text-slate-300">{reportGenerated.conclusion}</div>
                    </div>
                  </div>
                  <Button onClick={() => { setScanned(null); setAccepted(false); setReportGenerated(null); setAnalysisForm({ type: '', notes: '', conclusion: '' }); setTab('inbox'); }}
                    className="mt-4 w-full" variant="secondary">
                    Return to Inbox
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Evidence verification */}
                <Card>
                  <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Evidence Verification</h3>
                  <div className="space-y-3">
                    {scanned.tampered && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/40 rounded-xl alert-flash">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-red-400 font-bold text-sm">⚠ TAMPER ALERT</p>
                          <p className="text-red-300 text-xs">This evidence has failed integrity checks. Proceed with extreme caution.</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <VerifiedBadge verified={!scanned.tampered} label="Hash Verified" />
                      <VerifiedBadge verified={scanned.verified} label="Signature Valid" />
                    </div>
                    <HashDisplay value={scanned.hash} label="Expected Hash" />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[['Seal ID', scanned.sealId], ['Case', scanned.caseId], ['Type', scanned.type], ['Collected By', scanned.collectedBy]].map(([k, v]) => (
                        <div key={k} className="p-2 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                          <div className="text-slate-500 mb-0.5">{k}</div>
                          <div className="text-slate-300 font-mono">{v}</div>
                        </div>
                      ))}
                    </div>
                    {!accepted ? (
                      <Button onClick={handleAccept} loading={loading} variant="success" className="w-full" icon={CheckCircle}>
                        Accept Evidence into Laboratory
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-mono">Evidence accepted — Ready for analysis</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Analysis form */}
                {accepted && (
                  <Card>
                    <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Analysis & Report</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                        <User className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs text-slate-500">Assigned Scientist</div>
                          <div className="text-sm text-white">{user?.name} <span className="text-purple-400 font-mono">({user?.badge})</span></div>
                        </div>
                      </div>
                      <Select label="Analysis Type *" value={analysisForm.type} onChange={e => setAnalysisForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="">Select analysis type...</option>
                        {ANALYSIS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Textarea label="Observation Notes *" value={analysisForm.notes} onChange={e => setAnalysisForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="Detailed observations during analysis..." />
                      <Textarea label="Conclusion *" value={analysisForm.conclusion} onChange={e => setAnalysisForm(f => ({ ...f, conclusion: e.target.value }))}
                        placeholder="Final conclusion of the analysis..." rows={3} />
                      <Button onClick={handleGenerateReport} loading={loading} className="w-full" icon={FileText} size="lg"
                        disabled={!analysisForm.type || !analysisForm.notes || !analysisForm.conclusion}>
                        Generate Forensic Report & Sign
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {scanned && (
              <Card>
                <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Custody Timeline</h3>
                <ChainOfCustodyTimeline custody={scanned.custody} />
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reports generated yet</p>
              </div>
            </Card>
          ) : reports.map(r => (
            <Card key={r.id} className="fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-sm text-purple-400 mb-1">{r.id}</div>
                  <div className="text-white font-bold" style={{ fontFamily: 'Rajdhani' }}>{r.analysisType}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                {[['Evidence', r.evidenceId], ['Case', r.caseId], ['Scientist', r.scientist], ['Completed', format(new Date(r.completionDate), 'MMM d, yyyy')]].map(([k, v]) => (
                  <div key={k} className="p-2 bg-[#0f172a] rounded-lg">
                    <div className="text-slate-500 mb-0.5">{k}</div>
                    <div className="text-slate-300 font-mono">{v}</div>
                  </div>
                ))}
              </div>
              <HashDisplay value={r.reportHash} label="Report Hash" />
              <div className="mt-3 p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Conclusion</div>
                <p className="text-sm text-slate-300">{r.conclusion}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
