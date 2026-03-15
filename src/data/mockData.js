// Mock data for the forensic evidence management system

export const ROLES = {
  CRIME_SCENE_OFFICER: 'crime_scene_officer',
  TRANSPORT_OFFICER: 'transport_officer',
  FORENSIC_SCIENTIST: 'forensic_scientist',
  INVESTIGATOR: 'investigator',
  COURT_OFFICIAL: 'court_official',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  crime_scene_officer: 'Crime Scene Officer',
  transport_officer: 'Transport Officer',
  forensic_scientist: 'Forensic Scientist',
  investigator: 'Investigator',
  court_official: 'Court Official',
  admin: 'Administrator',
};

export const ROLE_PORTALS = {
  crime_scene_officer: '/collection',
  transport_officer: '/transport',
  forensic_scientist: '/laboratory',
  investigator: '/investigator',
  court_official: '/court',
  admin: '/dashboard',
};

export const mockUsers = [
  { id: 'u001', username: 'officer.james', password: 'pass123', role: ROLES.CRIME_SCENE_OFFICER, name: 'James Carter', badge: 'CSO-4521', department: 'Crime Scene Unit' },
  { id: 'u002', username: 'transport.chen', password: 'pass123', role: ROLES.TRANSPORT_OFFICER, name: 'Linda Chen', badge: 'TO-7823', department: 'Evidence Transport Division' },
  { id: 'u003', username: 'sci.patel', password: 'pass123', role: ROLES.FORENSIC_SCIENTIST, name: 'Dr. Raj Patel', badge: 'FS-3341', department: 'Forensic Laboratory' },
  { id: 'u004', username: 'inv.morgan', password: 'pass123', role: ROLES.INVESTIGATOR, name: 'Sarah Morgan', badge: 'INV-2209', department: 'Criminal Investigations' },
  { id: 'u005', username: 'court.hayes', password: 'pass123', role: ROLES.COURT_OFFICIAL, name: 'Judge Robert Hayes', badge: 'CT-0011', department: 'District Court' },
  { id: 'u006', username: 'admin.sys', password: 'pass123', role: ROLES.ADMIN, name: 'System Admin', badge: 'ADM-0001', department: 'IT Systems' },
];

export const mockCases = [
  { id: 'CASE-2024-0081', title: 'Downtown Bank Robbery', status: 'active', priority: 'critical', openedDate: '2024-01-15', investigator: 'Sarah Morgan', evidenceCount: 12, location: 'Downtown, Sector 4' },
  { id: 'CASE-2024-0092', title: 'Harbor Narcotics Seizure', status: 'active', priority: 'high', openedDate: '2024-01-22', investigator: 'Sarah Morgan', evidenceCount: 8, location: 'Harbor District' },
  { id: 'CASE-2024-0103', title: 'Corporate Fraud Investigation', status: 'active', priority: 'medium', openedDate: '2024-02-01', investigator: 'Sarah Morgan', evidenceCount: 24, location: 'Business District' },
  { id: 'CASE-2024-0117', title: 'Homicide Case — Westside', status: 'active', priority: 'critical', openedDate: '2024-02-10', investigator: 'Sarah Morgan', evidenceCount: 18, location: 'Westside Residential' },
  { id: 'CASE-2023-0441', title: 'Cybercrime Ring Takedown', status: 'closed', priority: 'high', openedDate: '2023-11-05', investigator: 'Sarah Morgan', evidenceCount: 31, location: 'Various / Online' },
];

export const mockEvidence = [
  {
    id: 'EV-2024-0081-001',
    caseId: 'CASE-2024-0081',
    type: 'Digital Device',
    description: 'Samsung Galaxy S23 recovered from suspect vehicle',
    status: 'in_lab',
    hash: 'SHA256:a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    collectedBy: 'James Carter',
    collectionDate: '2024-01-15T14:32:00',
    location: { lat: 40.7128, lng: -74.0060, address: '221 Bank Street, Downtown' },
    sealId: 'SEAL-20240115-A4',
    tampered: false,
    verified: true,
    signature: 'SIG:CSO4521:2024011514320000:VALID',
    files: [
      { name: 'evidence_photo_01.jpg', type: 'image', size: '2.4MB' },
      { name: 'evidence_photo_02.jpg', type: 'image', size: '1.8MB' },
    ],
    custody: [
      { officer: 'James Carter', role: 'Crime Scene Officer', timestamp: '2024-01-15T14:32:00', location: '221 Bank Street', action: 'Collected', verified: true },
      { officer: 'Linda Chen', role: 'Transport Officer', timestamp: '2024-01-15T16:45:00', location: 'Evidence Van #7', action: 'In Transit', verified: true },
      { officer: 'Dr. Raj Patel', role: 'Forensic Scientist', timestamp: '2024-01-15T18:20:00', location: 'Forensic Lab, Bay 3', action: 'Received', verified: true },
    ],
    analysisStatus: 'in_progress',
    analysisNotes: 'Extracting call logs and messages. Partial data recovery in progress.',
  },
  {
    id: 'EV-2024-0081-002',
    caseId: 'CASE-2024-0081',
    type: 'Firearm',
    description: '.45 Cal Glock 21 with suppressor, 3 magazines',
    status: 'in_lab',
    hash: 'SHA256:b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    collectedBy: 'James Carter',
    collectionDate: '2024-01-15T14:55:00',
    location: { lat: 40.7128, lng: -74.0060, address: '221 Bank Street, Downtown' },
    sealId: 'SEAL-20240115-B2',
    tampered: false,
    verified: true,
    signature: 'SIG:CSO4521:2024011514550000:VALID',
    files: [
      { name: 'firearm_front.jpg', type: 'image', size: '3.1MB' },
      { name: 'firearm_serial.jpg', type: 'image', size: '1.2MB' },
      { name: 'ballistics_report.pdf', type: 'document', size: '890KB' },
    ],
    custody: [
      { officer: 'James Carter', role: 'Crime Scene Officer', timestamp: '2024-01-15T14:55:00', location: '221 Bank Street', action: 'Collected', verified: true },
      { officer: 'Linda Chen', role: 'Transport Officer', timestamp: '2024-01-15T17:00:00', location: 'Evidence Van #7', action: 'In Transit', verified: true },
      { officer: 'Dr. Raj Patel', role: 'Forensic Scientist', timestamp: '2024-01-15T18:30:00', location: 'Forensic Lab, Bay 1', action: 'Received', verified: true },
    ],
    analysisStatus: 'completed',
    analysisNotes: 'Ballistics match to rounds fired at scene. Fingerprints lifted — 3 partial, 1 full match pending AFIS.',
    reportHash: 'SHA256:c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
  },
  {
    id: 'EV-2024-0092-001',
    caseId: 'CASE-2024-0092',
    type: 'Controlled Substance',
    description: '4.2kg crystalline substance in vacuum sealed bags',
    status: 'in_transit',
    hash: 'SHA256:d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    collectedBy: 'James Carter',
    collectionDate: '2024-01-22T09:15:00',
    location: { lat: 40.6892, lng: -74.0445, address: 'Harbor Pier 7, Shipping Container' },
    sealId: 'SEAL-20240122-C1',
    tampered: false,
    verified: true,
    signature: 'SIG:CSO4521:2024012209150000:VALID',
    files: [
      { name: 'substance_overview.jpg', type: 'image', size: '4.2MB' },
      { name: 'field_test_kit.jpg', type: 'image', size: '1.5MB' },
    ],
    custody: [
      { officer: 'James Carter', role: 'Crime Scene Officer', timestamp: '2024-01-22T09:15:00', location: 'Harbor Pier 7', action: 'Collected', verified: true },
      { officer: 'Linda Chen', role: 'Transport Officer', timestamp: '2024-01-22T11:00:00', location: 'Secure Evidence Van', action: 'In Transit', verified: true },
    ],
    analysisStatus: 'pending',
    analysisNotes: '',
  },
  {
    id: 'EV-2024-0103-001',
    caseId: 'CASE-2024-0103',
    type: 'Digital Evidence',
    description: 'Encrypted hard drives (x3) from executive offices',
    status: 'collected',
    hash: 'SHA256:e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    collectedBy: 'James Carter',
    collectionDate: '2024-02-01T11:30:00',
    location: { lat: 40.7549, lng: -73.9840, address: 'NexCorp HQ, 45th Floor' },
    sealId: 'SEAL-20240201-D5',
    tampered: false,
    verified: true,
    signature: 'SIG:CSO4521:2024020111300000:VALID',
    files: [
      { name: 'drives_unboxed.jpg', type: 'image', size: '2.8MB' },
      { name: 'chain_of_custody_form.pdf', type: 'document', size: '320KB' },
    ],
    custody: [
      { officer: 'James Carter', role: 'Crime Scene Officer', timestamp: '2024-02-01T11:30:00', location: 'NexCorp HQ', action: 'Collected', verified: true },
    ],
    analysisStatus: 'pending',
  },
  {
    id: 'EV-2024-0117-001',
    caseId: 'CASE-2024-0117',
    type: 'Biological Sample',
    description: 'Blood samples — 6 vials from primary scene',
    status: 'in_lab',
    hash: 'SHA256:f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    collectedBy: 'James Carter',
    collectionDate: '2024-02-10T03:20:00',
    location: { lat: 40.7282, lng: -74.0776, address: '17 Elm Street, Westside' },
    sealId: 'SEAL-20240210-E9',
    tampered: true,
    verified: false,
    signature: 'SIG:CSO4521:2024021003200000:HASH_MISMATCH',
    files: [],
    custody: [
      { officer: 'James Carter', role: 'Crime Scene Officer', timestamp: '2024-02-10T03:20:00', location: '17 Elm Street', action: 'Collected', verified: true },
      { officer: 'Linda Chen', role: 'Transport Officer', timestamp: '2024-02-10T05:10:00', location: 'Evidence Van #3', action: 'In Transit', verified: false },
      { officer: 'Dr. Raj Patel', role: 'Forensic Scientist', timestamp: '2024-02-10T06:45:00', location: 'Forensic Lab, Cold Storage', action: 'Received — HASH MISMATCH DETECTED', verified: false },
    ],
    analysisStatus: 'flagged',
    analysisNotes: 'ALERT: Hash mismatch detected upon receipt. Evidence integrity compromised. Case supervisor notified.',
  },
  {
    id: 'EV-2024-0117-002',
    caseId: 'CASE-2024-0117',
    type: 'Physical Evidence',
    description: 'Victim personal belongings — wallet, phone, keys',
    status: 'in_lab',
    hash: 'SHA256:a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    collectedBy: 'James Carter',
    collectionDate: '2024-02-10T04:05:00',
    location: { lat: 40.7282, lng: -74.0776, address: '17 Elm Street, Westside' },
    sealId: 'SEAL-20240210-E10',
    tampered: false,
    verified: true,
    signature: 'SIG:CSO4521:2024021004050000:VALID',
    files: [
      { name: 'belongings_photo.jpg', type: 'image', size: '3.5MB' },
    ],
    custody: [
      { officer: 'James Carter', role: 'Crime Scene Officer', timestamp: '2024-02-10T04:05:00', location: '17 Elm Street', action: 'Collected', verified: true },
      { officer: 'Linda Chen', role: 'Transport Officer', timestamp: '2024-02-10T05:15:00', location: 'Evidence Van #3', action: 'In Transit', verified: true },
      { officer: 'Dr. Raj Patel', role: 'Forensic Scientist', timestamp: '2024-02-10T06:50:00', location: 'Forensic Lab, Bay 2', action: 'Received', verified: true },
    ],
    analysisStatus: 'in_progress',
  },
];

export const mockTransportLogs = [
  { id: 'TL-001', evidenceId: 'EV-2024-0081-001', officer: 'Linda Chen', vehicle: 'EV-VAN-007', startTime: '2024-01-15T16:45:00', endTime: '2024-01-15T18:20:00', from: 'Crime Scene — 221 Bank St', to: 'Forensic Lab — Central', sealVerified: true, conditionOk: true, notes: '' },
  { id: 'TL-002', evidenceId: 'EV-2024-0081-002', officer: 'Linda Chen', vehicle: 'EV-VAN-007', startTime: '2024-01-15T17:00:00', endTime: '2024-01-15T18:30:00', from: 'Crime Scene — 221 Bank St', to: 'Forensic Lab — Central', sealVerified: true, conditionOk: true, notes: '' },
  { id: 'TL-003', evidenceId: 'EV-2024-0092-001', officer: 'Linda Chen', vehicle: 'EV-VAN-004', startTime: '2024-01-22T11:00:00', endTime: null, from: 'Harbor Pier 7', to: 'Forensic Lab — Central', sealVerified: true, conditionOk: true, notes: 'In transit' },
  { id: 'TL-004', evidenceId: 'EV-2024-0117-001', officer: 'Linda Chen', vehicle: 'EV-VAN-003', startTime: '2024-02-10T05:10:00', endTime: '2024-02-10T06:45:00', from: '17 Elm Street', to: 'Forensic Lab — Cold Storage', sealVerified: false, conditionOk: false, notes: 'ALERT: Seal integrity questionable. Hash mismatch reported.' },
];

export const mockAlerts = [
  { id: 'ALT-001', type: 'critical', message: 'Hash mismatch detected on EV-2024-0117-001', evidenceId: 'EV-2024-0117-001', caseId: 'CASE-2024-0117', timestamp: '2024-02-10T06:45:00', resolved: false },
  { id: 'ALT-002', type: 'warning', message: 'Seal ID verification failed — EV-2024-0117-001', evidenceId: 'EV-2024-0117-001', caseId: 'CASE-2024-0117', timestamp: '2024-02-10T06:48:00', resolved: false },
  { id: 'ALT-003', type: 'info', message: 'Transport overdue — EV-2024-0092-001 exceeds estimated arrival', evidenceId: 'EV-2024-0092-001', caseId: 'CASE-2024-0092', timestamp: '2024-01-22T14:00:00', resolved: false },
  { id: 'ALT-004', type: 'success', message: 'Evidence EV-2024-0081-002 analysis complete — report ready', evidenceId: 'EV-2024-0081-002', caseId: 'CASE-2024-0081', timestamp: '2024-01-18T10:30:00', resolved: true },
];

export const mockAnalysisReports = [
  {
    id: 'RPT-2024-0081-002',
    evidenceId: 'EV-2024-0081-002',
    caseId: 'CASE-2024-0081',
    scientist: 'Dr. Raj Patel',
    analysisType: 'Ballistics & Fingerprint',
    startDate: '2024-01-16T09:00:00',
    completionDate: '2024-01-18T10:00:00',
    status: 'completed',
    observations: 'Ballistic striations match rounds fired at scene. Three partial fingerprints recovered, one full print. AFIS query returned positive match.',
    conclusion: 'Firearm confirmed as weapon used in robbery. Fingerprints link suspect to weapon.',
    reportHash: 'SHA256:c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    scientistSignature: 'SIG:FS3341:2024011810000000:VALID',
    files: [{ name: 'ballistics_analysis.pdf', type: 'document', size: '2.1MB' }],
  },
];

export const dashboardStats = {
  totalActiveCases: 4,
  totalEvidence: 42,
  evidenceInTransit: 3,
  evidenceInLab: 18,
  tamperAlerts: 2,
  recentTransfers: 6,
  verifiedThisWeek: 28,
  pendingAnalysis: 11,
};

export const evidenceDistributionData = [
  { name: 'CASE-0081', count: 12, fill: '#06b6d4' },
  { name: 'CASE-0092', count: 8, fill: '#3b82f6' },
  { name: 'CASE-0103', count: 24, fill: '#8b5cf6' },
  { name: 'CASE-0117', count: 18, fill: '#f59e0b' },
  { name: 'CASE-0441', count: 31, fill: '#10b981' },
];

export const evidenceStatusData = [
  { name: 'Collected', value: 8, fill: '#06b6d4' },
  { name: 'In Transit', value: 3, fill: '#f59e0b' },
  { name: 'In Lab', value: 18, fill: '#8b5cf6' },
  { name: 'Analysis Done', value: 9, fill: '#10b981' },
  { name: 'Court Review', value: 4, fill: '#3b82f6' },
];

export const transportTimelineData = [
  { date: 'Jan 15', transfers: 4, incidents: 0 },
  { date: 'Jan 16', transfers: 2, incidents: 0 },
  { date: 'Jan 17', transfers: 1, incidents: 0 },
  { date: 'Jan 18', transfers: 3, incidents: 0 },
  { date: 'Jan 19', transfers: 0, incidents: 0 },
  { date: 'Jan 20', transfers: 2, incidents: 0 },
  { date: 'Jan 21', transfers: 1, incidents: 0 },
  { date: 'Jan 22', transfers: 5, incidents: 1 },
  { date: 'Jan 23', transfers: 2, incidents: 0 },
  { date: 'Feb 10', transfers: 6, incidents: 1 },
];

export const STATUS_COLORS = {
  collected: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40', label: 'Collected' },
  in_transit: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', label: 'In Transit' },
  in_lab: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40', label: 'In Laboratory' },
  analysis_complete: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', label: 'Analysis Complete' },
  court_review: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', label: 'Court Review' },
  flagged: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', label: 'FLAGGED — Tampered' },
};

export const EVIDENCE_TYPES = [
  'Digital Device', 'Firearm', 'Controlled Substance', 'Digital Evidence',
  'Biological Sample', 'Physical Evidence', 'Document', 'Trace Evidence',
  'Fingerprint', 'Photograph', 'Audio Recording', 'Video Recording',
];
