import React, { useState } from 'react';
import { QrCode, Scan, AlertCircle } from 'lucide-react';
import { Modal, Button } from './UIComponents';
import { useEvidence } from '../../context/EvidenceContext';
import clsx from 'clsx';

// Simulated QR scanner (since we can't access camera in all environments)
export default function QRScanner({ onScan, trigger }) {
  const [open, setOpen] = useState(false);
  const [manualId, setManualId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { evidence } = useEvidence();

  const simulateScan = async () => {
    setScanning(true);
    setError('');
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    // Simulate scanning a random piece of evidence
    const randomEv = evidence[Math.floor(Math.random() * evidence.length)];
    setScanning(false);
    setResult(randomEv);
  };

  const handleManualSearch = () => {
    if (!manualId.trim()) { setError('Enter an Evidence ID'); return; }
    const found = evidence.find(e => e.id.toLowerCase().includes(manualId.toLowerCase()));
    if (found) {
      setResult(found);
      setError('');
    } else {
      setError('No evidence found with that ID');
      setResult(null);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onScan(result);
      setOpen(false);
      setResult(null);
      setManualId('');
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button icon={QrCode} variant="primary">Scan QR Code</Button>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Evidence QR Scanner">
        <div className="space-y-5">
          {/* Simulated scanner view */}
          <div className="relative w-full h-56 bg-[#0f172a] border border-[#1e3a5f] rounded-xl overflow-hidden flex items-center justify-center">
            {scanning ? (
              <>
                <div className="scan-overlay" />
                <div className="relative w-40 h-40 qr-frame">
                  <div className="absolute inset-4 border border-dashed border-cyan-500/40 rounded" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 spinner mx-auto mb-2" />
                      <p className="text-xs text-cyan-400 font-mono">SCANNING...</p>
                    </div>
                  </div>
                </div>
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />
              </>
            ) : result ? (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-400 text-2xl">✔</span>
                </div>
                <p className="text-emerald-400 font-mono text-sm">QR CODE MATCHED</p>
                <p className="text-white font-bold mt-1">{result.id}</p>
              </div>
            ) : (
              <div className="text-center text-slate-600">
                <QrCode className="w-16 h-16 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-mono">Position QR code in frame</p>
              </div>
            )}
          </div>

          <Button onClick={simulateScan} icon={Scan} variant="primary" className="w-full" loading={scanning}>
            {scanning ? 'Scanning...' : 'Simulate Camera Scan'}
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#1e3a5f]" />
            <span className="text-xs text-slate-500 font-mono">OR ENTER MANUALLY</span>
            <div className="flex-1 h-px bg-[#1e3a5f]" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
              placeholder="Enter Evidence ID (e.g. EV-2024-0081-001)"
              className="flex-1 px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
            <Button onClick={handleManualSearch} variant="secondary">Search</Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-[#0f172a] border border-cyan-500/30 rounded-xl space-y-2">
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">Evidence Found</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-slate-500 text-xs">Evidence ID</div>
                  <div className="text-cyan-400 font-mono text-xs">{result.id}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Case ID</div>
                  <div className="text-white text-xs font-mono">{result.caseId}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Type</div>
                  <div className="text-white text-xs">{result.type}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Seal ID</div>
                  <div className="text-white text-xs font-mono">{result.sealId}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-500 text-xs">Status</div>
                  <div className={clsx('text-xs font-mono mt-0.5', result.tampered ? 'text-red-400' : 'text-emerald-400')}>
                    {result.tampered ? '⚠ TAMPERED — ALERT' : '✔ INTEGRITY OK'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <Button onClick={handleConfirm} variant="primary" className="w-full">
              Confirm — Load Evidence
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
