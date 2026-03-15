import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff, ChevronDown, AlertCircle, Fingerprint } from 'lucide-react';
import { ROLE_LABELS, mockUsers } from '../data/mockData';

const ROLES = Object.entries(ROLE_LABELS);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    const result = login(username, password, role);
    setLoading(false);
    if (result.success) {
      navigate(result.portal);
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-4 glow-cyan">
            <Shield className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
            FORENSIC<span className="text-cyan-400">CHAIN</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            Blockchain Evidence Management System
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
            <span className="text-emerald-400 text-xs font-mono">SYSTEM ONLINE — SECURE</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-2xl p-8 hex-border">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-400 font-mono uppercase tracking-wider">Secure Authentication</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Access Level / Role</label>
              <div className="relative">
                <button type="button" onClick={() => setRoleOpen(!roleOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-left text-sm hover:border-cyan-500/50 transition-colors focus:outline-none focus:border-cyan-500">
                  <span className={role ? 'text-white' : 'text-slate-500'}>
                    {role ? ROLE_LABELS[role] : 'Select your role...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
                </button>
                {roleOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f172a] border border-[#1e3a5f] rounded-lg overflow-hidden z-10 shadow-xl">
                    {ROLES.map(([value, label]) => (
                      <button key={value} type="button"
                        onClick={() => { setRole(value); setRoleOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors text-slate-300">
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Badge / Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold text-sm uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'Rajdhani' }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  Authenticate & Access System
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400/70 font-mono">⚠ All access is logged and audited. Unauthorized access is prohibited.</p>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-6">
          <p className="text-center text-xs text-slate-500 font-mono mb-3">── DEMO ACCOUNTS ──</p>
          <div className="grid grid-cols-2 gap-2">
            {mockUsers.slice(0, 6).map(u => (
              <button key={u.id} onClick={() => fillDemo(u)}
                className="px-3 py-2 text-left bg-[#1e293b]/50 border border-[#1e3a5f] rounded-lg hover:border-cyan-500/40 transition-colors group">
                <div className="text-xs text-cyan-400 font-mono group-hover:text-cyan-300">{u.badge}</div>
                <div className="text-xs text-slate-400 truncate">{ROLE_LABELS[u.role]}</div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-2 font-mono">All demo passwords: pass123</p>
        </div>
      </div>
    </div>
  );
}
