import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ value, size = 160, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: '#06b6d4', light: '#0f172a' },
    });
  }, [value, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 bg-[#0f172a] border border-cyan-500/30 rounded-xl inline-block">
        <canvas ref={canvasRef} />
      </div>
      {label && <p className="text-xs text-slate-400 font-mono text-center">{label}</p>}
    </div>
  );
}
