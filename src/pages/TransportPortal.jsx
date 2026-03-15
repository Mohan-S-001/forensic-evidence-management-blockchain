import React, { useState } from 'react';
import { Truck, QrCode, MapPin, CheckCircle, AlertTriangle, Package, ArrowRight, Clock } from 'lucide-react';
import { useEvidence } from '../context/EvidenceContext';
import { useAuth } from '../context/AuthContext';
import { SectionHeader, Card, Button, StatusBadge, Badge, HashDisplay, VerifiedBadge } from '../components/common/UIComponents';
import QRScanner from '../components/common/QRScanner';
import ChainOfCustodyTimeline from '../components/common/ChainOfCustodyTimeline';
import { format } from 'date-fns';
import clsx from 'clsx';

const TRANSPORT_STEPS = [
  { id: 'scan', label: 'Scan Evidence', icon: QrCode },
  { id: 'verify', label: 'Verify Seal & Hash', icon: CheckCircle },
  { id: 'transport', label: 'Log Transport', icon: Truck },
  { id: 'confirm', label: 'Confirm Delivery', icon: CheckCircle },
];

export default function TransportPortal() {
  const { evidence, transportLogs, updateEvidenceStatus } = useEvidence();
  const { user } = useAuth();
  const [tab, setTab] = useState('scan');
  const [scanned, setScanned] = useState(null);
  const [step, setStep] = useState(0);
  const [sealOk, setSealOk] = useState(null);
  const [conditionOk, setConditionOk] = useState(null);
  const [destination, setDestination] = useState('Forensic Lab — Central');
  const [vehicle, setVehicle] = useState('EV-VAN-007');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const myTransports = transportLogs.filter(t => t.officer === user?.name || user?.role === 'admin');
  const activeTransports = evidence.filter(e => e.status === 'in_transit');

  const handleScan = (ev) => {
    setScanned(ev);
    setStep(1);
    setTab('process');
  };

  const handleVerify = () => setStep(2);

  const handleStartTransport = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    updateEvidenceStatus(scanned.id, 'in_transit', {
      officer: user?.name,
      role: 'Transport Officer',
      timestamp: new Date().toISOString(),
      location: vehicle,
      action: `In Transit → ${destination}`,
      verified: sealOk && conditionOk,
    });
    setStep(3);
    setLoading(false);
  };

  const handleConfirmDelivery = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    updateEvidenceStatus(scanned.id, 'in_lab', {
      officer: user?.name,
      role: 'Transport Officer',
      timestamp: new Date().toISOString(),
      location: destination,
      action: 'Delivered to ' + destination,
      verified: true,
    });
    setCompleted(true);
    setLoading(false);
  };

  const reset = () => {
    setScanned(null);
    setStep(0);
    setSealOk(null);
    setConditionOk(null);
    setCompleted(false);
    setTab('scan');
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>
          Transportation Portal
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Truck className="w-4 h-4 text-amber-400" />
          <p className="text-slate-400 text-sm">Secure Evidence Transport & Chain of Custody</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-[#1e293b] border border-[#1e3a5f] rounded-xl w-fit">
        {[{ id: 'scan', label: 'Scan & Transport' }, { id: 'active', label: `Active (${activeTransports.length})` }, { id: 'history', label: 'Transport History' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${tab === t.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'}`}
            style={{ fontFamily: 'Exo 2' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'scan' || tab === 'process' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            {completed ? (
              <Card glowColor="green">
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Rajdhani' }}>Delivery Confirmed</h3>
                  <p className="text-slate-400 text-sm mb-2">{scanned?.id} delivered to {destination}</p>
                  <p className="text-xs font-mono text-emerald-400">Blockchain record updated — Chain of Custody logged</p>
                  <Button onClick={reset} className="mt-6" variant="secondary">Scan Next Evidence</Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Progress steps */}
                <div className="flex items-center gap-0 mb-2">
                  {TRANSPORT_STEPS.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all',
                        i < step ? 'text-emerald-400' : i === step ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-600'
                      )}>
                        <s.icon className="w-3.5 h-3.5" />
                        <span className="font-mono hidden sm:inline">{s.label}</span>
                      </div>
                      {i < TRANSPORT_STEPS.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-700 mx-1" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step 0: Scan */}
                {step === 0 && (
                  <Card>
                    <SectionHeader title="Step 1: Scan Evidence Package" subtitle="Use camera or enter Evidence ID manually" />
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-48 h-48 border-2 border-dashed border-[#1e3a5f] rounded-xl flex flex-col items-center justify-center gap-3 text-slate-600">
                        <QrCode className="w-16 h-16 opacity-30" />
                        <span className="text-sm font-mono">Awaiting scan...</span>
                      </div>
                      <QRScanner onScan={handleScan} />
                    </div>
                  </Card>
                )}

                {/* Step 1: Verify */}
                {step === 1 && scanned && (
                  <Card>
                    <SectionHeader title="Step 2: Verify Seal & Integrity" />
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          ['Evidence ID', scanned.id, 'font-mono text-cyan-400'],
                          ['Case ID', scanned.caseId, 'font-mono text-slate-300'],
                          ['Seal ID', scanned.sealId, 'font-mono text-white'],
                          ['Type', scanned.type, 'text-white'],
                          ['Collected By', scanned.collectedBy, 'text-white'],
                        ].map(([k, v, cls]) => (
                          <div key={k} className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                            <div className="text-xs text-slate-500 font-mono mb-0.5">{k}</div>
                            <div className={clsx('text-sm', cls)}>{v}</div>
                          </div>
                        ))}
                        <div className="p-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg">
                          <div className="text-xs text-slate-500 font-mono mb-0.5">Current Status</div>
                          <StatusBadge status={scanned.status} />
                        </div>
                      </div>

                      <HashDisplay value={scanned.hash} label="Evidence Hash (SHA-256)" />

                      {scanned.tampered && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/40 rounded-xl alert-flash">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <div>
                            <p className="text-red-400 font-bold text-sm font-mono">⚠ TAMPER ALERT</p>
                            <p className="text-red-300 text-xs">Hash mismatch detected. Do NOT proceed with transport. Notify supervisor.</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Verification Checks</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-slate-500 mb-2">Seal Intact?</div>
                            <div className="flex gap-2">
                              <button onClick={() => setSealOk(true)} className={clsx('flex-1 py-2 rounded-lg text-xs font-mono border transition-all', sealOk === true ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-[#1e3a5f] text-slate-400 hover:border-emerald-500/30')}>✔ YES</button>
                              <button onClick={() => setSealOk(false)} className={clsx('flex-1 py-2 rounded-lg text-xs font-mono border transition-all', sealOk === false ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'border-[#1e3a5f] text-slate-400 hover:border-red-500/30')}>✘ NO</button>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-2">Package Condition OK?</div>
                            <div className="flex gap-2">
                              <button onClick={() => setConditionOk(true)} className={clsx('flex-1 py-2 rounded-lg text-xs font-mono border transition-all', conditionOk === true ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-[#1e3a5f] text-slate-400 hover:border-emerald-500/30')}>✔ YES</button>
                              <button onClick={() => setConditionOk(false)} className={clsx('flex-1 py-2 rounded-lg text-xs font-mono border transition-all', conditionOk === false ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'border-[#1e3a5f] text-slate-400 hover:border-red-500/30')}>✘ NO</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleVerify} disabled={sealOk === null || conditionOk === null} className="w-full" icon={CheckCircle}>
                        Proceed to Transport Logging
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Step 2: Transport */}
                {step === 2 && scanned && (
                  <Card>
                    <SectionHeader title="Step 3: Log Transport Event" />
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Vehicle / Unit</label>
                          <input value={vehicle} onChange={e => setVehicle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Destination</label>
                          <select value={destination} onChange={e => setDestination(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors">
                            <option>Forensic Lab — Central</option>
                            <option>Forensic Lab — North Wing</option>
                            <option>Evidence Storage — Vault A</option>
                            <option>Court Evidence Room</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                          placeholder="Any observations about the evidence condition or special handling instructions..."
                          className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <VerifiedBadge verified={!!sealOk} label="Seal Verified" />
                        <VerifiedBadge verified={!!conditionOk} label="Condition OK" />
                      </div>
                      <Button onClick={handleStartTransport} loading={loading} className="w-full" icon={Truck} size="lg">
                        Start Transport — Log to Blockchain
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && scanned && (
                  <Card>
                    <SectionHeader title="Step 4: Confirm Delivery" />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <Truck className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-amber-400 font-mono text-sm font-bold">IN TRANSIT</p>
                          <p className="text-slate-400 text-xs">{scanned.id} → {destination}</p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400 px-1">
                        Confirm that evidence package has been physically handed over to the receiving officer at <strong className="text-white">{destination}</strong>.
                      </div>
                      <Button onClick={handleConfirmDelivery} loading={loading} variant="success" className="w-full" icon={CheckCircle} size="lg">
                        Confirm Delivery & Close Transport Log
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Sidebar: Custody chain */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani' }}>
                {scanned ? 'Custody Timeline' : 'Awaiting Scan'}
              </h3>
              {scanned ? (
                <ChainOfCustodyTimeline custody={scanned.custody} />
              ) : (
                <div className="text-center py-8 text-slate-600">
                  <QrCode className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Scan evidence to view custody chain</p>
                </div>
              )}
            </Card>

            {/* Map placeholder */}
            <Card>
              <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'Rajdhani' }}>GPS Vehicle Tracker</h3>
              <div className="w-full h-40 bg-[#0f172a] border border-[#1e3a5f] rounded-xl overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 grid-bg opacity-50" />
                {/* Fake map grid */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="absolute border-[#06b6d4]/30 border-t w-full" style={{ top: `${i * 25}%` }} />
                  ))}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="absolute border-[#06b6d4]/30 border-l h-full" style={{ left: `${i * 25}%` }} />
                  ))}
                </div>
                {/* Moving dot */}
                <div className="relative z-10 text-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 glow-cyan status-pulse mx-auto mb-2" />
                  <p className="text-xs font-mono text-amber-400">EV-VAN-007</p>
                  <p className="text-xs text-slate-500">40.7128° N, 74.0060° W</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : tab === 'active' ? (
        <div className="space-y-4">
          {activeTransports.length === 0 ? (
            <Card>
              <div className="text-center py-12 text-slate-500">
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No evidence currently in transit</p>
              </div>
            </Card>
          ) : activeTransports.map(ev => (
            <Card key={ev.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-mono text-sm text-cyan-400">{ev.id}</div>
                    <div className="text-white font-medium">{ev.type}</div>
                  </div>
                </div>
                <StatusBadge status="in_transit" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="p-2 bg-[#0f172a] rounded-lg">
                  <div className="text-slate-500 mb-0.5">Case</div>
                  <div className="text-slate-300 font-mono">{ev.caseId}</div>
                </div>
                <div className="p-2 bg-[#0f172a] rounded-lg">
                  <div className="text-slate-500 mb-0.5">Seal</div>
                  <div className="text-slate-300 font-mono">{ev.sealId}</div>
                </div>
                <div className="p-2 bg-[#0f172a] rounded-lg">
                  <div className="text-slate-500 mb-0.5">Integrity</div>
                  <div className={ev.tampered ? 'text-red-400' : 'text-emerald-400'}>
                    {ev.tampered ? '⚠ FAIL' : '✔ OK'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <SectionHeader title="Transport History" subtitle="All transport events" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e3a5f]">
                  {['Log ID', 'Evidence', 'Officer', 'Vehicle', 'From', 'To', 'Seal', 'Condition'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-mono text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3a5f]/40">
                {transportLogs.map(log => (
                  <tr key={log.id} className="evidence-row">
                    <td className="px-4 py-3 text-xs font-mono text-cyan-400">{log.id}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-300">{log.evidenceId}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{log.officer}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{log.vehicle}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate">{log.from}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate">{log.to}</td>
                    <td className="px-4 py-3"><Badge variant={log.sealVerified ? 'emerald' : 'red'}>{log.sealVerified ? '✔' : '✘'}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={log.conditionOk ? 'emerald' : 'red'}>{log.conditionOk ? '✔' : '✘'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
