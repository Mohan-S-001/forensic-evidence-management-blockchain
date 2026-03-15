import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EvidenceProvider } from './context/EvidenceContext';

import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/common/DashboardLayout';
import MainDashboard from './pages/MainDashboard';
import CollectionPortal from './pages/CollectionPortal';
import TransportPortal from './pages/TransportPortal';
import LaboratoryPortal from './pages/LaboratoryPortal';
import InvestigatorPortal from './pages/InvestigatorPortal';
import CourtPortal from './pages/CourtPortal';
import EvidenceDetailPage from './pages/EvidenceDetailPage';
import CasesPage from './pages/CasesPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<MainDashboard />} />
        <Route path="dashboard" element={<MainDashboard />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="evidence/:id" element={<EvidenceDetailPage />} />
        <Route path="collection" element={
          <ProtectedRoute allowedRoles={['crime_scene_officer', 'admin']}>
            <CollectionPortal />
          </ProtectedRoute>
        } />
        <Route path="transport" element={
          <ProtectedRoute allowedRoles={['transport_officer', 'admin']}>
            <TransportPortal />
          </ProtectedRoute>
        } />
        <Route path="laboratory" element={
          <ProtectedRoute allowedRoles={['forensic_scientist', 'admin']}>
            <LaboratoryPortal />
          </ProtectedRoute>
        } />
        <Route path="investigator" element={
          <ProtectedRoute allowedRoles={['investigator', 'admin']}>
            <InvestigatorPortal />
          </ProtectedRoute>
        } />
        <Route path="court" element={
          <ProtectedRoute allowedRoles={['court_official', 'admin']}>
            <CourtPortal />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EvidenceProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </EvidenceProvider>
    </AuthProvider>
  );
}
