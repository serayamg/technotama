'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Mail,
  Fingerprint,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  X,
  CheckCircle2,
  FileSpreadsheet,
  Activity,
  LogOut,
  FolderOpen,
  Layers
} from 'lucide-react';

interface BcmLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoAccount {
  username: string;
  email: string;
  name: string;
  role: string;
  org: string;
  mfaType: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'superadmin_sec',
    email: 'admin.security@jma-advisory.id',
    name: 'Muhammad Nadhil, CISA, CRISC',
    role: 'Super Administrator',
    org: 'PT JMA Solusi Konsultindo',
    mfaType: 'Hardware FIDO2 / TOTP'
  },
  {
    username: 'sarah_lead_bcm',
    email: 'sarah.wijaya@jma-advisory.id',
    name: 'Sarah Wijaya, CBCP, ISO 22301 LA',
    role: 'Lead BCM Consultant',
    org: 'PT JMA Solusi Konsultindo',
    mfaType: 'TOTP Authenticator'
  },
  {
    username: 'hendra_director',
    email: 'hendra.gunawan@jma-advisory.id',
    name: 'Dr. Hendra Gunawan, MM',
    role: 'Director / Principal Advisor',
    org: 'PT JMA Solusi Konsultindo',
    mfaType: 'TOTP Authenticator'
  },
  {
    username: 'rian_coord',
    email: 'rian.aditya@banknusantara.co.id',
    name: 'Rian Aditya',
    role: 'Client BCM Coordinator',
    org: 'PT Bank Nusantara Sejahtera Tbk',
    mfaType: 'SMS OTP'
  }
];

export default function BcmLoginModal({ isOpen, onClose }: BcmLoginModalProps) {
  // Login states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps: CREDENTIALS -> MFA_CHALLENGE -> LOGGED_IN
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA_CHALLENGE' | 'LOGGED_IN'>('CREDENTIALS');
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIdentifier('');
      setPassword('');
      setMfaCode('');
      setStep('CREDENTIALS');
      setErrorMessage(null);
      setRemainingAttempts(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRemainingAttempts(null);

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan username atau alamat email korporat.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi akun.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.username.toLowerCase() === identifier.trim().toLowerCase() ||
                 acc.email.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (password === 'BCM@SECURE2025!' || password.length >= 6) {
        const user = matched || {
          username: identifier.trim(),
          email: identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@bcm-enterprise.id`,
          name: identifier.trim(),
          role: 'BCM Consultant',
          org: 'PT Technotama Artha Raya',
          mfaType: 'TOTP Authenticator'
        };
        setCurrentUser(user);
        setStep('MFA_CHALLENGE');
      } else {
        setErrorMessage('Kombinasi kredensial tidak valid.');
        setRemainingAttempts(4);
      }
    }, 600);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mfaCode.trim()) {
      setErrorMessage('Silakan masukkan kode verifikasi MFA.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mfaCode === '123456' || mfaCode.length === 6) {
        setStep('LOGGED_IN');
      } else {
        setErrorMessage('Kode token MFA salah atau telah kedaluwarsa.');
      }
    }, 600);
  };

  const handleResetForm = () => {
    setStep('CREDENTIALS');
    setMfaCode('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup Form Login"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Branding Banner */}
        <div className="p-6 sm:p-8 bg-[#071527]/95 border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#00A9CE] to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/20 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>BCM NAV</span>
            <span className="text-[11px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#00A9CE]/20 text-cyan-300 border border-[#00A9CE]/40">
              ISO 22301:2019
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Sistem Konsultan Business Continuity Management & Resiliensi Operasional (OJK POJK 11/2022)
          </p>

          {/* Security Compliance Pills */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> TLS 1.3 Hardened
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <Fingerprint className="w-2.5 h-2.5" /> FIDO2 / MFA Enforced
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> RBAC Multi-Level
            </span>
          </div>
        </div>

        {/* Step Indicator Header */}
        <div className="px-6 sm:px-8 py-3 border-b border-slate-800/60 bg-slate-900/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-400">
            {step === 'CREDENTIALS' && 'Tahap 1: Kredensial Konsultan BCM'}
            {step === 'MFA_CHALLENGE' && 'Tahap 2: Verifikasi Dua Faktor (MFA)'}
            {step === 'LOGGED_IN' && 'Status: Sesi Konsultan Terverifikasi'}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            {step === 'CREDENTIALS' && 'Langkah 1 / 2'}
            {step === 'MFA_CHALLENGE' && 'Langkah 2 / 2'}
            {step === 'LOGGED_IN' && 'Autentikasi Aktif'}
          </span>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-start gap-2.5 text-red-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-red-300">Autentikasi Ditolak</div>
              <div className="mt-0.5 leading-relaxed">{errorMessage}</div>
              {remainingAttempts !== null && (
                <div className="mt-1 font-bold text-amber-300 text-[11px]">
                  Tersisa {remainingAttempts} percobaan sebelum akun otomatis terkunci.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: CREDENTIALS */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleCredentialsSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / Email Konsultan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="off"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kata Sandi (Password)
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00A9CE] to-sky-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Lanjut ke Verifikasi MFA</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: MFA CHALLENGE */}
        {step === 'MFA_CHALLENGE' && currentUser && (
          <form onSubmit={handleMfaSubmit} className="p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
            {/* User Target Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-black text-sm">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                    <span>{currentUser.role} &bull; {currentUser.mfaType}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Kode Verifikasi Otorisasi (MFA TOTP)
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Smartphone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-center text-xl tracking-widest font-mono font-bold text-white focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all"
                />
              </div>
            </div>

            {/* MFA Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Token MFA...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi & Masuk Sistem BCM</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: LOGGED IN / ACTIVE WORKSPACE DASHBOARD */}
        {step === 'LOGGED_IN' && currentUser && (
          <div className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Autentikasi Berhasil (Sesi Aktif)
                </div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  {currentUser.role} • {currentUser.org}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Modul BCM Navigator Aktif:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">BIA Assessment</div>
                    <div className="text-[10px] text-slate-400">MTPD, RTO & RPO Calculator</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">BCP Activation</div>
                    <div className="text-[10px] text-slate-400">Incident & Disaster Protocol</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">SPOF Radar</div>
                    <div className="text-[10px] text-slate-400">Dependency & IT Failure Analysis</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Audit Trail</div>
                    <div className="text-[10px] text-slate-400">ISO 22301 Compliance Logs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Path: <code>C:\Users\sasib\Downloads\BCM JMA\sistem Konsultan</code></span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ganti Akun</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Tutup Jendela</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Security Seal */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 px-6 sm:px-8">
          <span className="font-mono">BCM Navigator Engine v1.0.0</span>
          <span className="font-mono text-cyan-400/80">ISO 22301 & POJK 11/2022</span>
        </div>
      </div>
    </div>
  );
}
