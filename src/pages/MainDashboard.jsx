import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Truck, FlaskConical, AlertTriangle,
  ShieldCheck, BarChart3, ArrowRightLeft, Clock
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { useEvidence } from '../context/EvidenceContext';
import { useAuth } from '../context/AuthContext';
import { StatCard, SectionHeader, Card } from '../components/common/UIComponents';
import AlertPanel from '../components/common/AlertPanel';
import EvidenceTable from '../components/common/EvidenceTable';
import {
  dashboardStats, evidenceDistributionData,
  evidenceStatusData, transportTimelineData
} from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 font-mono mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function MainDashboard() {
  const { evidence, alerts, cases } = useEvidence();
  const { user } = useAuth();
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const tampered = evidence.filter(e => e.tampered);
  const inTransit = evidence.filter(e => e.status === 'in_transit');
  const inLab = evidence.filter(e => e.status === 'in_lab');

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani', letterSpacing: '0.04em' }}>
          System Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Welcome back, <span className="text-cyan-400">{user?.name}</span> — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Tamper alert banner */}
      {tampered.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/40 rounded-xl alert-flash">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <span className="text-red-400 font-bold font-mono text-sm">TAMPER ALERT: </span>
            <span className="text-red-300 text-sm">{tampered.length} evidence item{tampered.length > 1 ? 's' : ''} flagged for integrity failure.</span>
          </div>
          <Link to={`/evidence/${tampered[0].id}`} className="ml-auto text-xs text-red-400 hover:text-red-300 font-mono border border-red-500/40 px-3 py-1 rounded-lg">
            REVIEW →
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Active Cases" value={cases.filter(c => c.status === 'active').length} sub="4 high priority" color="cyan" trend={12} />
        <StatCard icon={ShieldCheck} label="Total Evidence" value={evidence.length} sub="Across all cases" color="blue" trend={8} />
        <StatCard icon={Truck} label="In Transit" value={inTransit.length} sub="Active transports" color="amber" />
        <StatCard icon={FlaskConical} label="In Laboratory" value={inLab.length} sub="Under analysis" color="purple" trend={5} />
        <StatCard icon={AlertTriangle} label="Tamper Alerts" value={unresolvedAlerts.filter(a => a.type === 'critical').length} sub="Require immediate action" color="red" />
        <StatCard icon={ArrowRightLeft} label="Custody Transfers" value={dashboardStats.recentTransfers} sub="Last 7 days" color="emerald" trend={3} />
        <StatCard icon={ShieldCheck} label="Verified" value={dashboardStats.verifiedThisWeek} sub="This week" color="cyan" />
        <StatCard icon={Clock} label="Pending Analysis" value={dashboardStats.pendingAnalysis} sub="Awaiting lab" color="blue" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evidence by case */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Evidence Distribution by Case</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={evidenceDistributionData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Evidence Items" radius={[4, 4, 0, 0]}>
                {evidenceDistributionData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status pie */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Evidence Status</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={evidenceStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {evidenceStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {evidenceStatusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transport timeline */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Rajdhani' }}>Transport Activity Timeline</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={transportTimelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
            <Line type="monotone" dataKey="transfers" name="Transfers" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
            <Line type="monotone" dataKey="incidents" name="Incidents" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent evidence */}
        <Card>
          <SectionHeader
            title="Recent Evidence"
            subtitle="Latest collected items"
            action={<Link to="/cases" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">View all →</Link>}
          />
          <EvidenceTable evidence={evidence.slice(0, 5)} compact />
        </Card>

        {/* Alert panel */}
        <Card>
          <SectionHeader title="Active Alerts" subtitle="Tamper & system alerts" />
          <AlertPanel maxItems={5} />
        </Card>
      </div>
    </div>
  );
}
