'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Lock, User, Mail, ShieldAlert, CheckCircle2, ChevronRight, 
  FileText, Download, Clock, Activity, MessageSquare, AlertCircle, 
  PlusCircle, RefreshCw, Key
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'documents' | 'billing' | 'tickets'>('progress');

  // Login form state
  const [email, setEmail] = useState('client@bankdki.co.id');
  const [password, setPassword] = useState('clientpassword123');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Client Portal data states
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({
      num1,
      num2,
      answer: num1 + num2
    });
  };

  useEffect(() => {
    generateCaptcha();
    // Check if session is already active
    checkSession();
  }, []);

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
    setLoading(true);

    // Verify Captcha
    if (parseInt(captchaInput) !== captcha.answer) {
      setLoginError('Captcha verification failed. Please try again.');
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setIsLoggedIn(true);
        fetchPortalData(data.user.id);
      } else {
        setLoginError(data.error || 'Authentication failed.');
        generateCaptcha();
      }
    } catch (err) {
      setLoginError('Server error. Failed to establish connection.');
    } finally {
      setLoading(false);
    }
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
      setCaptchaInput('');
      generateCaptcha();
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
            /* Login panel */
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Portal Klien RTI</h1>
                <p className="text-xs text-slate-500 mt-1">Lacak milestones proyek dan download deliverables Anda secara aman.</p>
              </div>

              <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                
                {/* Credentials Helper for Reviewers */}
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs mb-6 space-y-2">
                  <div className="flex items-center space-x-1.5 text-white font-bold">
                    <Key className="w-4 h-4 text-blue-500" />
                    <span>Akses Portal Klien (Demo)</span>
                  </div>
                  <div className="font-mono space-y-0.5">
                    <div>Email: client@bankdki.co.id</div>
                    <div>Password: clientpassword123</div>
                  </div>
                </div>

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
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Captcha */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Verifikasi Captcha</label>
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg font-mono font-bold text-xs select-none">
                        {captcha.num1} + {captcha.num2} = ?
                      </div>
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-2.5 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 focus:outline-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Jawaban"
                        className="flex-1 text-xs font-bold text-center border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  </button>
                </form>
              </div>
            </div>
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
