import React, { createContext, useContext, useState } from 'react';
import { mockEvidence, mockCases, mockAlerts, mockTransportLogs, mockAnalysisReports } from '../data/mockData';

const EvidenceContext = createContext(null);

export const EvidenceProvider = ({ children }) => {
  const [evidence, setEvidence] = useState(mockEvidence);
  const [cases, setCases] = useState(mockCases);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [transportLogs, setTransportLogs] = useState(mockTransportLogs);
  const [reports, setReports] = useState(mockAnalysisReports);

  const addEvidence = (ev) => {
    const newEv = {
      ...ev,
      id: `EV-${Date.now()}`,
      status: 'collected',
      hash: `SHA256:${generateHash()}`,
      tampered: false,
      verified: true,
      signature: `SIG:CSO4521:${Date.now()}:VALID`,
      custody: [{
        officer: ev.collectedBy,
        role: 'Crime Scene Officer',
        timestamp: new Date().toISOString(),
        location: ev.location?.address || 'Unknown',
        action: 'Collected',
        verified: true,
      }],
      analysisStatus: 'pending',
    };
    setEvidence(prev => [newEv, ...prev]);
    return newEv;
  };

  const updateEvidenceStatus = (id, status, custodyEntry) => {
    setEvidence(prev => prev.map(ev => {
      if (ev.id !== id) return ev;
      return {
        ...ev,
        status,
        custody: custodyEntry ? [...ev.custody, custodyEntry] : ev.custody,
      };
    }));
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const addCase = (c) => {
    const newCase = { ...c, id: `CASE-${Date.now()}`, status: 'active', evidenceCount: 0 };
    setCases(prev => [newCase, ...prev]);
    return newCase;
  };

  const getEvidenceById = (id) => evidence.find(e => e.id === id);
  const getCaseById = (id) => cases.find(c => c.id === id);
  const getEvidenceByCase = (caseId) => evidence.filter(e => e.caseId === caseId);

  return (
    <EvidenceContext.Provider value={{
      evidence, cases, alerts, transportLogs, reports,
      addEvidence, updateEvidenceStatus, resolveAlert, addCase,
      getEvidenceById, getCaseById, getEvidenceByCase,
    }}>
      {children}
    </EvidenceContext.Provider>
  );
};

export const useEvidence = () => {
  const ctx = useContext(EvidenceContext);
  if (!ctx) throw new Error('useEvidence must be used within EvidenceProvider');
  return ctx;
};

function generateHash() {
  const chars = '0123456789abcdef';
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}
