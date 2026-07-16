'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Lock, Mail, AlertCircle, RefreshCw, LayoutDashboard, 
  Users, Briefcase, FileText, CheckCircle2, TrendingUp, 
  Activity, ArrowRight, Loader2, Plus, Calendar, BadgeInfo, Key
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'proposals' | 'orders' | 'blogs'>('analytics');

  // Login form state
  const [email, setEmail] = useState('admin@risetin.co.id');
  const [password, setPassword] = useState('adminpassword123');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stats & Data states
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Blog publishing state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('NEWS');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSuccess, setBlogSuccess] = useState(false);

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
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user.role === 'ADMIN') {
          setAdminUser(data.user);
          setIsLoggedIn(true);
          fetchAdminData();
        }
      }
    } catch (err) {
      console.log('No admin session.');
    }
  };

  const fetchAdminData = async () => {
    try {
      // 1. Fetch dashboard stats
      const resStats = await fetch('/api/dashboard/stats');
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }

      // 2. Fetch all leads
      const resLeads = await fetch('/api/leads');
      if (resLeads.ok) {
        const dataLeads = await resLeads.json();
        setLeads(dataLeads);
      }

      // 3. Fetch all proposals
      const resProposals = await fetch('/api/proposals');
      if (resProposals.ok) {
        const dataProposals = await resProposals.json();
        setProposals(dataProposals);
      }

      // 4. Fetch all orders
      const resOrders = await fetch('/api/orders');
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

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
        if (data.user.role !== 'ADMIN') {
          setLoginError('Access denied. Administrator privileges required.');
          generateCaptcha();
          setLoading(false);
          return;
        }
        setAdminUser(data.user);
        setIsLoggedIn(true);
        fetchAdminData();
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
      setAdminUser(null);
      setEmail('');
      setPassword('');
      setCaptchaInput('');
      generateCaptcha();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handlePublishBlog = (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSuccess(true);
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setTimeout(() => setBlogSuccess(false), 3000);
  };

  // Status Color Mapper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'CONTACTED': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'CONVERTED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'PENDING': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'DOC_UPLOADED': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Recharts Chart Config
  const COLORS = ['#2563eb', '#06b6d4', '#d97706', '#10b981', '#6366f1'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!isLoggedIn ? (
            /* Login Admin */
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">RTI Administrator CMS</h1>
                <p className="text-xs text-slate-500 mt-1">Gunakan otentikasi admin untuk masuk ke konsol manajemen leads.</p>
              </div>

              <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                
                {/* Admin credentials tips */}
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs mb-6 space-y-2">
                  <div className="flex items-center space-x-1.5 text-white font-bold">
                    <Key className="w-4 h-4 text-blue-500" />
                    <span>Akses Administrator (Demo)</span>
                  </div>
                  <div className="font-mono space-y-0.5">
                    <div>Email: admin@risetin.co.id</div>
                    <div>Password: adminpassword123</div>
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
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Admin</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@risetin.co.id"
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                    />
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
                    <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Admin Workspace Dashboard */
            <div className="space-y-8">
              {/* Header profile */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-extrabold text-lg">
                    A
                  </div>
                  <div>
                    <h1 className="font-display font-extrabold text-lg text-slate-900 leading-tight">Console Administrator</h1>
                    <p className="text-[10px] font-semibold text-slate-500">Log In sebagai: <strong>{adminUser.email}</strong> (Role: ADMIN)</p>
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
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 ${
                      activeTab === 'analytics'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    <span>Analytics Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 ${
                      activeTab === 'leads'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4.5 h-4.5" />
                    <span>Lead Management</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('proposals')}
                    className={`p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 ${
                      activeTab === 'proposals'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>Proposals (RFP)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 ${
                      activeTab === 'orders'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4.5 h-4.5" />
                    <span>Project Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('blogs')}
                    className={`p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 ${
                      activeTab === 'blogs'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Publish Insight/Blog</span>
                  </button>
                </div>

                {/* Right Content Tab Container */}
                <div className="lg:col-span-9 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8">
                  
                  {/* Analytics Dashboard */}
                  {activeTab === 'analytics' && stats && (
                    <div className="space-y-8">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Statistik Leads & Conversions</h2>
                      
                      {/* Metric cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Leads</span>
                          <span className="font-display font-extrabold text-xl text-slate-900">{stats.leadsCount}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Proposals</span>
                          <span className="font-display font-extrabold text-xl text-slate-900">{stats.proposalsCount}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Orders Aktif</span>
                          <span className="font-display font-extrabold text-xl text-slate-900">{stats.ordersCount}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Conversion Rate</span>
                          <span className="font-display font-extrabold text-xl text-blue-600">{stats.conversionRate}</span>
                        </div>
                      </div>

                      {/* Charts and Distributions */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
                        <div className="md:col-span-7 bg-slate-50/50 border border-slate-100 p-6 rounded-2xl">
                          <h3 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-widest mb-4">Distribusi Order Layanan</h3>
                          <div className="w-full h-[240px]">
                            {stats.chartData?.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={stats.chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {stats.chartData.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                                </PieChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex items-center justify-center text-xs text-slate-400">Belum ada statistik grafik pemesanan.</div>
                            )}
                          </div>
                        </div>

                        {/* Recent logs audit */}
                        <div className="md:col-span-5 space-y-4">
                          <h3 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-widest border-b pb-2">Audit Aktivitas Terbaru</h3>
                          <div className="space-y-3">
                            {stats.recentActivity?.map((act: any) => (
                              <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2 text-xs">
                                <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-bold text-slate-800">{act.title}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{act.detail}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leads Management */}
                  {activeTab === 'leads' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Daftar Qualified Leads</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Nama / Company</th>
                              <th className="py-3 px-4">Kontak</th>
                              <th className="py-3 px-4">Kebutuhan</th>
                              <th className="py-3 px-4">Source</th>
                              <th className="py-3 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leads.map((lead) => (
                              <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{lead.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{lead.company} ({lead.role})</div>
                                </td>
                                <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                                  <div>{lead.email}</div>
                                  <div>{lead.phone}</div>
                                </td>
                                <td className="py-4 px-4 max-w-[200px] leading-relaxed text-slate-600">{lead.needs}</td>
                                <td className="py-4 px-4">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                                    {lead.source}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Proposals Tracker */}
                  {activeTab === 'proposals' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Pelacakan Dokumen RFP/Tender</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Company / PIC</th>
                              <th className="py-3 px-4">Layanan</th>
                              <th className="py-3 px-4">Budget / Timeline</th>
                              <th className="py-3 px-4">Dokumen TOR</th>
                              <th className="py-3 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proposals.map((prop) => (
                              <tr key={prop.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{prop.company}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{prop.name} ({prop.email})</div>
                                </td>
                                <td className="py-4 px-4 text-slate-600 font-semibold">{prop.serviceType}</td>
                                <td className="py-4 px-4 text-slate-600">
                                  <div>Budget: {prop.budget}</div>
                                  <div>Timeline: {prop.timeline}</div>
                                </td>
                                <td className="py-4 px-4">
                                  {prop.fileName ? (
                                    <button 
                                      onClick={() => alert(`Mengunduh dokumen: ${prop.fileName}`)}
                                      className="flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-700 underline focus:outline-none cursor-pointer"
                                    >
                                      <FileText className="w-4 h-4 shrink-0" />
                                      <span className="truncate max-w-[120px]">{prop.fileName}</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 italic">No Upload</span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getStatusColor(prop.status)}`}>
                                    {prop.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Orders manager */}
                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Project Orders & Invoicing</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Company Name</th>
                              <th className="py-3 px-4">Service Type</th>
                              <th className="py-3 px-4">Invoice / Quotation</th>
                              <th className="py-3 px-4">Tanggal Order</th>
                              <th className="py-3 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((ord) => (
                              <tr key={ord.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4 font-bold text-slate-800">{ord.companyName}</td>
                                <td className="py-4 px-4 text-slate-600 font-semibold">{ord.serviceType}</td>
                                <td className="py-4 px-4 font-mono text-[10px] text-slate-500">
                                  <div>Quote: {ord.quotationPath}</div>
                                  <div>Inv: {ord.invoicePath}</div>
                                </td>
                                <td className="py-4 px-4 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-4">
                                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getStatusColor(ord.status)}`}>
                                    {ord.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Publish Blog */}
                  {activeTab === 'blogs' && (
                    <form onSubmit={handlePublishBlog} className="space-y-6 max-w-xl">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Buat Artikel Baru (Insight / Threat Warning)</h2>
                      {blogSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start space-x-2 text-xs text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Artikel sukses dipublikasikan ke halaman utama.</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Judul Artikel *</label>
                          <input
                            type="text"
                            required
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            placeholder="Contoh: Ancaman Malware Terbaru"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori Artikel</label>
                          <select
                            value={blogCategory}
                            onChange={(e) => setBlogCategory(e.target.value)}
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                          >
                            <option value="NEWS">NEWS / UPDATE</option>
                            <option value="THREAT">THREAT INTELLIGENCE</option>
                            <option value="REGULATION">REGULATION UPDATE</option>
                            <option value="TREND">TECHNOLOGY TREND</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ringkasan Singkat (SEO Meta Description) *</label>
                        <input
                          type="text"
                          required
                          value={blogSummary}
                          onChange={(e) => setBlogSummary(e.target.value)}
                          placeholder="Ringkasan 1-2 kalimat untuk snippet pencarian..."
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Isi Artikel Lengkap *</label>
                        <textarea
                          required
                          rows={6}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          placeholder="Ketik konten artikel secara lengkap..."
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                      >
                        Publish Artikel
                      </button>
                    </form>
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
