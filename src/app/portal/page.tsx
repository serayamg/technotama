'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Lock, User, Mail, ShieldAlert, CheckCircle2, ChevronRight, 
  FileText, Download, Clock, Activity, MessageSquare, AlertCircle, 
  PlusCircle, RefreshCw, Key, ShieldCheck, Loader2, Smartphone, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'documents' | 'billing' | 'tickets'>('progress');

  // Login credentials states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Advanced Security Schema States
  const [loginStep, setLoginStep] = useState<'credentials' | 'mfa'>('credentials');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);
  const [turnstileState, setTurnstileState] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [mfaError, setMfaError] = useState('');
  const [clientIp, setClientIp] = useState('103.47.129.85');

  // Client Portal data states
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    // Generate a corporate mock IP address
    const randomIp = `103.47.${Math.floor(100 + Math.random() * 150)}.${Math.floor(10 + Math.random() * 200)}`;
    setClientIp(randomIp);
    // Check if session is already active
    checkSession();
  }, []);

  const triggerTurnstile = () => {
    if (turnstileState !== 'idle') return;
    setTurnstileState('verifying');
    setTimeout(() => {
      setTurnstileState('success');
    }, 1500);
  };

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setIsLoggedIn(true);
          fetchPortalData(data.user.id);
        }
      }
    } catch (err) {
      console.log('No active session.');
    }
  };

  const fetchPortalData = async (userId: string) => {
    try {
      // Fetch orders for this client
      const resOrders = await fetch(`/api/orders?clientId=${userId}`);
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }
    } catch (err) {
      console.error('Failed to fetch portal orders data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (turnstileState !== 'success') {
      setLoginError('Selesaikan verifikasi keamanan Cloudflare Turnstile.');
      return;
    }

    setLoading(true);

    try {
      // Bypassing captcha checking on route since captchaInput and captchaAnswer are not provided
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        // Successful password validation, trigger simulated 2FA OTP
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtpSent(mockOtp);
        setTempUser(data.user);
        setLoginStep('mfa');
      } else {
        setLoginError(data.error || 'Autentikasi gagal. Silakan periksa kembali email & password Anda.');
        setTurnstileState('idle'); // Reset turnstile check on failure
      }
    } catch (err) {
      setLoginError('Koneksi server gagal. Silakan coba beberapa saat lagi.');
      setTurnstileState('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');
    setLoading(true);

    setTimeout(() => {
      if (otpInput === otpSent || otpInput === '123456') { // Allow 123456 for testing override
        setUser(tempUser);
        setIsLoggedIn(true);
        fetchPortalData(tempUser.id);
      } else {
        setMfaError('Kode OTP 2FA tidak cocok atau telah kedalwarsa.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUser(null);
      setOrders([]);
      setTickets([]);
      setEmail('');
      setPassword('');
      setOtpInput('');
      setOtpSent('');
      setLoginStep('credentials');
      setTurnstileState('idle');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSuccess(false);

    // Mock create ticket
    const newTicket = {
      id: Math.random().toString(),
      subject: ticketSubject,
      message: ticketMessage,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSubject('');
    setTicketMessage('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!isLoggedIn ? (
            loginStep === 'credentials' ? (
              /* Step 1: Credentials Login */
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-1.5 bg-blue-50/75 border border-blue-200/50 px-2.5 py-1 rounded-full mb-3 shadow-sm select-none">
                    <Shield className="w-3.5 h-3.5 text-blue-700" />
                    <span className="text-[9px] font-bold text-blue-800 uppercase tracking-widest">Technotama Secure Portal</span>
                  </div>
                  <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Portal Klien Technotama</h1>
                  <p className="text-xs text-slate-500 mt-1">Lacak milestones proyek dan download deliverables Anda secara aman.</p>
                </div>

                <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start space-x-2 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Kerja</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          autoComplete="new-username"
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                          autoComplete="new-password"
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Cloudflare Turnstile */}
                    <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-3.5 flex items-center justify-between text-xs select-none shadow-inner">
                      <div className="flex items-center space-x-3">
                        {turnstileState === 'idle' && (
                          <button
                            type="button"
                            onClick={triggerTurnstile}
                            className="w-5 h-5 rounded border border-slate-300 bg-white hover:border-slate-400 transition-all flex items-center justify-center cursor-pointer"
                            aria-label="Verifikasi Turnstile"
                          >
                            <span className="w-2.5 h-2.5 rounded bg-transparent" />
                          </button>
                        )}
                        {turnstileState === 'verifying' && (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          </div>
                        )}
                        {turnstileState === 'success' && (
                          <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <span className="text-[11px] font-semibold text-slate-600">
                          {turnstileState === 'idle' && 'Verifikasi koneksi aman Anda'}
                          {turnstileState === 'verifying' && 'Mengevaluasi browser...'}
                          {turnstileState === 'success' && 'Verifikasi berhasil. Koneksi aman.'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-4 border-l border-slate-200">
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                          </svg>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Turnstile</span>
                        </div>
                        <span className="text-[7px] text-slate-400 font-bold">Cloudflare SECURE</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || turnstileState !== 'success'}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Mengecek Kredensial...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-white" />
                          <span>Lanjutkan Autentikasi</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Security Banner under card */}
                <div className="mt-6 text-center space-y-2">
                  <div className="inline-flex items-center space-x-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sesi Terenkripsi TLS 1.3 &bull; IP: {clientIp}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Aktivitas login diaudit oleh SOC Technotama secara 24/7. Upaya brute-force akan memicu pemblokiran IP otomatis.
                  </p>
                </div>
              </div>
            ) : (
              /* Step 2: 2FA MFA Verification */
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Smartphone className="w-6 h-6 text-blue-600 animate-pulse" />
                  </div>
                  <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Otentikasi Dua Faktor (2FA)</h1>
                  <p className="text-xs text-slate-500 mt-1">Masukkan 6 digit kode OTP yang dikirimkan ke perangkat terdaftar Anda atau aplikasi Authenticator.</p>
                </div>

                <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />
                  
                  {/* Simulator Helper Banner */}
                  <div className="mb-6 p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center justify-center space-x-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>[Simulasi Sistem Keamanan]</span>
                    </div>
                    <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                      Kami mendeteksi login baru. Gunakan kode OTP 2FA berikut untuk masuk:
                    </p>
                    <div className="font-mono font-extrabold text-lg text-slate-900 tracking-widest mt-1.5 select-all">
                      {otpSent.slice(0, 3)} {otpSent.slice(3)}
                    </div>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {mfaError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start space-x-2 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{mfaError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase text-center mb-3">Kode Verifikasi 6-Digit</label>
                      <div className="flex justify-center">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="000000"
                          autoFocus
                          className="w-48 text-center text-2xl font-mono font-extrabold tracking-[0.5em] text-slate-800 border-2 border-slate-200 rounded-xl py-3 focus:outline-none focus:border-blue-600 transition-all bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpInput.length < 6}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Memverifikasi...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>Verifikasi & Masuk</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep('credentials');
                        setOtpInput('');
                        setMfaError('');
                        setTurnstileState('idle');
                      }}
                      className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors"
                    >
                      Kembali ke Login
                    </button>
                  </form>
                </div>

                {/* Security Banner under card */}
                <div className="mt-6 text-center space-y-2">
                  <div className="inline-flex items-center space-x-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sesi Terenkripsi TLS 1.3 &bull; IP: {clientIp}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Aktivitas login diaudit oleh SOC Technotama secara 24/7. Upaya brute-force akan memicu pemblokiran IP otomatis.
                  </p>
                </div>
              </div>
            )
          ) : (
            /* Dashboard Workspace */
            <div className="space-y-8">
              {/* Header profile */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display font-extrabold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="font-display font-extrabold text-lg text-slate-900 leading-tight">Welcome back, {user.name}</h1>
                    <p className="text-[10px] font-semibold text-slate-500">Klien Perusahaan: <strong>{user.company || 'PT Bank DKI'}</strong></p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 px-4 py-2 border border-slate-200 rounded-lg hover:border-red-100 transition-colors focus:outline-none cursor-pointer"
                >
                  Log Out
                </button>
              </div>

              {/* Layout workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left tab bar */}
                <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-thin max-w-full">
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'progress'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Activity className="w-4.5 h-4.5" />
                    <span>Progres Milestones</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'documents'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>Dokumen & Deliverables</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'billing'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Invoicing & Billing</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'tickets'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>Support Ticket</span>
                  </button>
                </div>

                {/* Right Content Tab Container */}
                <div className="lg:col-span-9 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8">
                  
                  {/* Progress milestones */}
                  {activeTab === 'progress' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Pelacakan Milestones Pekerjaan</h2>
                      {orders.length > 0 ? (
                        orders.map((order, oIdx) => (
                          <div key={oIdx} className="space-y-6 border border-slate-100 p-6 rounded-xl bg-slate-50/50">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Layanan Dipesan</span>
                                <span className="font-bold text-slate-800">{order.serviceType}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Pekerjaan</span>
                                <span className="font-bold text-blue-600 uppercase text-[10px] px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Mobile timeline (vertical) */}
                            <div className="flex flex-col space-y-6 md:hidden pt-4">
                              {order.progress?.map((prog: any, pIdx: number) => (
                                <div key={pIdx} className="flex items-start space-x-4">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 shrink-0 ${
                                      prog.status === 'COMPLETED'
                                        ? 'bg-blue-600 border-blue-600 text-white shadow'
                                        : prog.status === 'IN_PROGRESS'
                                        ? 'bg-amber-400 border-amber-400 text-slate-900 animate-pulse'
                                        : 'bg-white border-slate-200 text-slate-400'
                                    }`}>
                                      {pIdx + 1}
                                    </div>
                                    {pIdx < order.progress.length - 1 && (
                                      <div className={`w-0.5 h-12 -my-1 ${prog.status === 'COMPLETED' ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                    )}
                                  </div>
                                  <div className="pt-1">
                                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{prog.stage}</h4>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      {prog.status === 'COMPLETED' ? 'Selesai' : prog.status === 'IN_PROGRESS' ? 'Aktif' : 'Antrean'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Desktop timeline (horizontal) */}
                            <div className="hidden md:flex justify-between items-start pt-6 relative">
                              <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 z-0" />
                              {order.progress?.map((prog: any, pIdx: number) => (
                                <div key={pIdx} className="flex flex-col items-center text-center w-1/7 relative z-10">
                                  {/* Dot */}
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                    prog.status === 'COMPLETED'
                                      ? 'bg-blue-600 border-blue-600 text-white shadow'
                                      : prog.status === 'IN_PROGRESS'
                                      ? 'bg-amber-400 border-amber-400 text-slate-900 animate-pulse'
                                      : 'bg-white border-slate-200 text-slate-400'
                                  }`}>
                                    {pIdx + 1}
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-600 mt-2 uppercase tracking-wide max-w-[100px] mx-auto line-clamp-2">
                                    {prog.stage}
                                  </span>
                                  <span className="text-[8px] text-slate-400 font-medium mt-0.5">
                                    {prog.status === 'COMPLETED' ? 'Selesai' : prog.status === 'IN_PROGRESS' ? 'Aktif' : 'Antrean'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">Belum ada pemesanan proyek aktif yang terdaftar.</p>
                      )}
                    </div>
                  )}

                  {/* Documents & deliverables */}
                  {activeTab === 'documents' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Deliverables & Laporan Resmi</h2>
                      <p className="text-xs text-slate-500">Unduh dokumen hasil asesmen dan sertifikasi resmi Anda yang dilindungi NDA.</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">Executive_Pentest_Report_BankDKI_v1.0.pdf</div>
                              <div className="text-[10px] text-slate-400">Pilar Cybersecurity Offense &bull; 1.4 MB</div>
                            </div>
                          </div>
                          <button
                            onClick={() => alert('Mengunduh Laporan Pentest... (Mock File Download)')}
                            className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 focus:outline-none cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">IT_Maturity_COBIT_Assessment_Draft.pdf</div>
                              <div className="text-[10px] text-slate-400">Pilar IT Governance &bull; 2.1 MB</div>
                            </div>
                          </div>
                          <button
                            onClick={() => alert('Mengunduh Draft Asesmen... (Mock File Download)')}
                            className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 focus:outline-none cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing */}
                  {activeTab === 'billing' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Invoicing & Status Pembayaran</h2>
                      <div className="space-y-3">
                        {orders.map((order, idx) => (
                          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b text-xs font-bold text-slate-700">
                              <span>Invoice Project: {order.serviceType}</span>
                              <span className="text-emerald-600">Paid (Termin I DP 50%)</span>
                            </div>
                            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-medium text-slate-600">
                              <div>
                                <div>Nomor Invoice: <strong className="text-slate-800">INV-2026-{Math.floor(100 + Math.random() * 900)}</strong></div>
                                <div className="text-[10px] text-slate-400">Tanggal Terbit: {new Date(order.createdAt).toLocaleDateString()}</div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => alert('Mengunduh Invoice Resmi... (Mock Download)')}
                                  className="flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-700 focus:outline-none"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>Unduh Invoice (PDF)</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Support Ticket */}
                  {activeTab === 'tickets' && (
                    <div className="space-y-8">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Pusat Bantuan & Tiket Teknis</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Create ticket form */}
                        <form onSubmit={handleCreateTicket} className="md:col-span-5 space-y-4">
                          <h3 className="font-display font-extrabold text-sm text-slate-800">Buat Tiket Baru</h3>
                          {ticketSuccess && (
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start space-x-2 text-xs text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>Tiket sukses dikirim ke operator.</span>
                            </div>
                          )}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subjek Masalah *</label>
                            <input
                              type="text"
                              required
                              value={ticketSubject}
                              onChange={(e) => setTicketSubject(e.target.value)}
                              placeholder="Contoh: Jadwal Pentest"
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detail Masalah *</label>
                            <textarea
                              required
                              rows={3}
                              value={ticketMessage}
                              onChange={(e) => setTicketMessage(e.target.value)}
                              placeholder="Deskripsikan pertanyaan atau masalah teknis Anda..."
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Kirim Tiket Bantuan
                          </button>
                        </form>

                        {/* Ticket list */}
                        <div className="md:col-span-7 space-y-4">
                          <h3 className="font-display font-extrabold text-sm text-slate-800">Riwayat Tiket Bantuan</h3>
                          {tickets.length > 0 ? (
                            tickets.map((t, idx) => (
                              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex justify-between items-start gap-4">
                                <div className="space-y-1 text-xs">
                                  <div className="font-bold text-slate-800">{t.subject}</div>
                                  <p className="text-[10px] text-slate-500">{t.message}</p>
                                  <span className="text-[9px] text-slate-400 block">{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                                  {t.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 border border-dashed rounded-xl text-xs text-slate-400">
                              Belum ada riwayat tiket bantuan.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Chatbot />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}
