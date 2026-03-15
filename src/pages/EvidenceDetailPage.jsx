import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Image, FileText, Video, Download, ExternalLink } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { Card, HashDisplay, VerifiedBadge, StatusBadge, Badge, Button } from '../components/common/UIComponents';
import ChainOfCustodyTimeline from '../components/common/ChainOfCustodyTimeline';
import QRCodeDisplay from '../components/common/QRCodeDisplay';
import { format } from 'date-fns';

function FileIcon({ type }) {
  if (type === 'image') return <Image className="w-5 h-5 text-cyan-400" />;
  if (type === 'video') return <Video className="w-5 h-5 text-purple-400" />;
  return <FileText className="w-5 h-5 text-amber-400" />;
}

export default function EvidenceDetailPage() {
  const { id } = useParams();
  const { evidence, cases, reports } = useEvidence();
  const ev = evidence.find(e => e.id === id);
  const theCase = ev ? cases.find(c => c.id === ev.caseId) : null;
  const report = ev ? reports.find(r => r.evidenceId === ev.id) : null;

  if (!ev) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Rajdhani' }}>Evidence Not Found</h2>
        <p className="text-slate-400 mb-6">No record found for ID: <span className="font-mono text-cyan-400">{id}</span></p>
        <Link to="/cases">
          <Button icon={ArrowLeft} variant="secondary">Back to Cases</Button>
        </Link>
      </div>
    );
  }

  const ts = (() => { try { return format(new Date(ev.collectionDate), 'MMMM d, yyyy — HH:mm:ss'); } catch { return ev.collectionDate; } })();

  return (
    <div className="space-y-6 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/cases" className="text-slate-500 hover:text-slate-300 transition-colors">Cases</Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-500 font-mono">{ev.caseId}</span>
        <span className="text-slate-700">/</span>
        <span className="text-cyan-400 font-mono">{ev.id}</span>
      </div>

      {/* Tamper alert */}
      {ev.tampered && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/40 rounded-xl alert-flash">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-400 font-bold font-mono">CRITICAL TAMPER ALERT</p>
            <p className="text-red-300 text-sm">Hash mismatch detected. Evidence integrity cannot be guaranteed. This evidence may be inadmissible.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-4">
          {/* Evidence header */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-sm text-cyan-400 mb-1">{ev.id}</div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>{ev.type}</h1>
                <p className="text-slate-400 mt-1">{ev.description}</p>
              </div>
              <StatusBadge status={ev.tampered ? 'flagged' : ev.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                ['Case ID', ev.caseId, 'font-mono text-cyan-400'],
                ['Collected By', ev.collectedBy, 'text-white'],
                ['Seal ID', ev.sealId, 'font-mono text-white'],
                ['Collection Date', ts, 'text-white'],
                ['Location', ev.location?.address || 'N/A', 'text-white'],
                ['Analysis Status', ev.analysisStatus, 'capitalize text-white'],
              ].map(([k, v, cls]) => (
                <div key={k} className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 font-mono mb-0.5">{k}</div>
                  <div className={`text-sm ${cls}`}>{v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Files */}
          {ev.files?.length > 0 && (
            <Card>
              <h2 className="text-base font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Evidence Files</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ev.files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-[#0f172a] border border-[#1e3a5f] rounded-xl hover:border-cyan-500/30 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <FileIcon type={f.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-300 truncate">{f.name}</div>
                      <div className="text-xs text-slate-600">{f.size} · {f.type}</div>
                    </div>
                    <Button variant="ghost" size="sm" icon={f.type === 'image' ? ExternalLink : Download} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {f.type === 'image' ? 'Preview' : 'Download'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Cryptographic verification */}
          <Card>
            <h2 className="text-base font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Cryptographic Verification</h2>
            <div className="space-y-3">
              <HashDisplay value={ev.hash} label="Evidence Hash (SHA-256)" />
              <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                <div className="text-xs text-slate-500 font-mono mb-1">Collector Digital Signature</div>
                <div className={`font-mono text-xs break-all ${ev.verified ? 'text-emerald-400' : 'text-red-400'}`}>{ev.signature}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <VerifiedBadge verified={!ev.tampered} label="Hash Verified" />
                <VerifiedBadge verified={ev.verified} label="Signature Valid" />
              </div>
              {/* Blockchain status */}
              <div className="flex items-center gap-3 p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ev.tampered ? 'bg-red-400' : 'bg-emerald-400 status-pulse'}`} />
                <div>
                  <div className="text-xs text-slate-500 font-mono">Blockchain Status</div>
                  <div className={`text-sm font-mono font-bold ${ev.tampered ? 'text-red-400' : 'text-emerald-400'}`}>
                    {ev.tampered ? 'INTEGRITY FAILURE — BLOCK FLAGGED' : 'CONFIRMED — IMMUTABLE RECORD'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Forensic report */}
          {report && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Rajdhani' }}>Forensic Analysis Report</h2>
                <Button icon={Download} variant="secondary" size="sm">Download PDF</Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[['Analysis Type', report.analysisType], ['Scientist', report.scientist], ['Status', report.status], ['Completed', (() => { try { return format(new Date(report.completionDate), 'MMM d, yyyy'); } catch { return ''; } })()]].map(([k, v]) => (
                    <div key={k} className="p-2 bg-[#0f172a] rounded-lg">
                      <div className="text-slate-500 mb-0.5">{k}</div>
                      <div className="text-slate-300 capitalize">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Observations</div>
                  <p className="text-sm text-slate-300">{report.observations}</p>
                </div>
                <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Conclusion</div>
                  <p className="text-sm text-slate-300 font-medium">{report.conclusion}</p>
                </div>
                <HashDisplay value={report.reportHash} label="Report Hash (SHA-256)" />
                <div className="p-3 bg-[#0f172a] border border-emerald-500/20 rounded-lg">
                  <div className="text-xs text-slate-500 font-mono mb-1">Scientist Digital Signature</div>
                  <div className="text-emerald-400 font-mono text-xs break-all">{report.scientistSignature}</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* QR Code */}
          <Card>
            <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Evidence QR Code</h3>
            <QRCodeDisplay value={JSON.stringify({ id: ev.id, caseId: ev.caseId, hash: ev.hash, seal: ev.sealId })} size={160} label={ev.id} />
            <Button variant="secondary" size="sm" icon={Download} className="w-full mt-3">Download QR Label</Button>
          </Card>

          {/* Case info */}
          {theCase && (
            <Card>
              <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>Associated Case</h3>
              <div className="font-mono text-sm text-cyan-400 mb-1">{theCase.id}</div>
              <div className="text-white font-medium mb-2">{theCase.title}</div>
              <div className="space-y-1 text-xs text-slate-500">
                <div>📍 {theCase.location}</div>
                <div>👤 {theCase.investigator}</div>
                <div>📅 {theCase.openedDate}</div>
              </div>
              <Link to="/cases">
                <Button variant="secondary" size="sm" className="w-full mt-3">View Case Details</Button>
              </Link>
            </Card>
          )}

          {/* Chain of custody */}
          <Card>
            <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>Chain of Custody</h3>
            <ChainOfCustodyTimeline custody={ev.custody || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
