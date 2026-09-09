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
  FolderLock,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  GitMerge,
  BrainCircuit,
  Building2,
  FileCheck
} from 'lucide-react';

interface IsoXLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoIsoUser {
  id: string;
  name: string;
  jlLevel: 'JL7' | 'JL8' | 'JL9' | 'CONSULTANT';
  title: string;
  department: string;
  username: string;
  email: string;
  authority: string;
}

const DEMO_USERS: DemoIsoUser[] = [
  {
    id: 'usr-101',
    name: 'Budi Santoso',
    jlLevel: 'JL7',
    title: 'Compliance Analyst',
    department: 'Compliance Operations',
    username: 'budi_jl7',
    email: 'budi.santoso@bank-artha.co.id',
    authority: 'Execute (Data Entry, Finding Logging, Evidence Upload)'
  },
  {
    id: 'usr-102',
    name: 'Siti Rahma',
    jlLevel: 'JL8',
    title: 'Compliance Reviewer & Manager',
    department: 'Compliance Advisory & Quality',
    username: 'siti_jl8',
    email: 'siti.rahma@bank-artha.co.id',
    authority: 'Review & Validate (Advisory Workflow, Risk Assessment Sign-off)'
  },
  {
    id: 'usr-103',
    name: 'Dewi Lestari',
    jlLevel: 'JL9',
    title: 'Head of Compliance',
    department: 'Group Compliance Governance',
    username: 'dewi_jl9',
    email: 'dewi.lestari@bank-artha.co.id',
    authority: 'Full Governance Approval (Policy Endorsement, OJK Reporting)'
  },
  {
    id: 'usr-lead',
    name: 'Senior GRC Consultant',
    jlLevel: 'CONSULTANT',
    title: 'Lead ISO Auditor & GRC Consultant',
    department: 'Technotama GRC Advisory',
    username: 'consultant_grc',
    email: 'consultant@technotama.id',
    authority: 'Advisory Engine, Gap Analysis & Audit Framework Implementation'
  }
];

export default function IsoXLoginModal({ isOpen, onClose }: IsoXLoginModalProps) {
  const [step, setStep] = useState<'credentials' | 'mfa' | 'authenticated'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoIsoUser>(DEMO_USERS[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setMfaCode('');
      setStep('credentials');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectDemo = (user: DemoIsoUser) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword('ISOX@COMPLIANCE2026!');
    setErrorMessage('');
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Harap isi username / email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('mfa');
    }, 600);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!mfaCode.trim() || mfaCode.length < 6) {
      setErrorMessage('Masukkan 6-digit kode otorisasi MFA yang valid.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('authenticated');
    }, 700);
  };

  const handleReset = () => {
    setStep('credentials');
    setMfaCode('');
    setErrorMessage('');
  };

  const getJlBadgeColor = (jl: string) => {
    switch (jl) {
      case 'JL9':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'JL8':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'JL7':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-blue-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP STATUS BAR */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">ISO-X</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ENTERPRISE GRC
                </span>
              </div>
              <p className="text-xs text-slate-400">Integrated Management & Compliance Platform (POJK & ISO 27001)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: CREDENTIALS */}
          {step === 'credentials' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Autentikasi Konsultan & Personel Kepatuhan
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Akses portal manajemen regulasi, audit ISO, dan matriks wewenang JL7/JL8/JL9.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Tahap 1 dari 2
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username / Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="off"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Kata Sandi Keamanan
                    </label>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-400" />
                    <span>Three Lines of Defense &bull; POJK 38/2016 Compliant</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Memverifikasi...</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjut ke Otorisasi MFA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: MFA CHALLENGE */}
          {step === 'mfa' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-teal-400" />
                    Validasi Otorisasi MFA & Matriks Wewenang
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verifikasi level kewenangan <span className="font-bold text-white">{selectedUser.jlLevel}</span> untuk personel <span className="text-white font-medium">{selectedUser.name}</span>.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Tahap 2 dari 2
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{selectedUser.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${getJlBadgeColor(selectedUser.jlLevel)}`}>
                      {selectedUser.jlLevel}
                    </span>
                  </div>
                  <div className="text-slate-400">{selectedUser.title} &bull; {selectedUser.department}</div>
                  <div className="text-[11px] text-teal-300/80 font-mono">
                    Wewenang: {selectedUser.authority}
                  </div>
                </div>
              </div>

              <form onSubmit={handleMfaSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Masukkan Kode Otorisasi Authenticator
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] font-mono text-teal-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                    Token otorisasi terenkripsi time-based (TOTP RFC 6238) atau Hardware Security Key.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    &larr; Kembali Ubah Kredensial
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Memvalidasi Token...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Validasi & Masuk Portal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: AUTHENTICATED ACTIVE SESSION */}
          {step === 'authenticated' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/40 text-teal-200 text-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Sesi Konsultan ISO-X Berhasil Diotentikasi!</div>
                  <p className="text-slate-300 mt-0.5">
                    Token JWT aktif diterbitkan untuk <span className="text-teal-300 font-semibold">{selectedUser.name}</span> ({selectedUser.jlLevel}). Matriks wewenang telah disinkronkan.
                  </p>
                </div>
              </div>

              {/* Quick Modules Overview from ISO-X Platform */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Modul Sistem ISO-X Siap Diakses:</span>
                  <span className="text-[10px] text-teal-400 font-mono">v2.4 Enterprise</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-semibold text-slate-200">ISO 27001 & 9001</div>
                      <div className="text-[10px] text-slate-500">Management System</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="font-semibold text-slate-200">POJK & BI Rules</div>
                      <div className="text-[10px] text-slate-500">Regulatory Tracker</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Advisory Desk</div>
                      <div className="text-[10px] text-slate-500">Workflow JL7/8/9</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Risk & Control</div>
                      <div className="text-[10px] text-slate-500">Residual Matrix</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <FolderLock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Doc & Evidence</div>
                      <div className="text-[10px] text-slate-500">Encrypted Vault</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-semibold text-slate-200">ISO-X AI Engine</div>
                      <div className="text-[10px] text-slate-500">POJK Gap Analysis</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Ganti Akun / Keluar Sesi</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="/iso-x"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 text-center"
                  >
                    <span>Masuk Halaman Penuh ISO-X</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              ISO 27001:2022
            </span>
            <span>&bull;</span>
            <span>POJK 38/2016 Compliant</span>
            <span>&bull;</span>
            <span>Zero Trust Hardened</span>
          </div>

          <div className="text-slate-400 font-mono text-[10px]">
            PT Technotama Artha Raya &bull; ISO-X Advisory
          </div>
        </div>
      </div>
    </div>
  );
}
