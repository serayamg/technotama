'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  GitMerge,
  Search,
  BookOpen,
  Award,
  Layers,
  Users,
  Activity,
  ChevronRight,
  Database,
  Briefcase,
  FileCheck,
  TrendingUp,
  BrainCircuit,
  UserCheck,
  Clock,
  Building2,
  FolderLock,
  AlertOctagon,
  Menu,
  X,
  Smartphone,
  CheckSquare,
  Bell,
  Plus,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Sliders,
  Check,
  FileSearch,
  Zap,
  CheckCircle,
  FileCheck2,
  Calendar,
  BarChart3,
  Upload,
  ExternalLink
} from 'lucide-react';

interface UserContext {
  id: string;
  name: string;
  jlLevel: 'JL7' | 'JL8' | 'JL9';
  title: string;
  department: string;
}

const USERS: UserContext[] = [
  { id: 'usr-101', name: 'Budi Santoso', jlLevel: 'JL7', title: 'Compliance Analyst', department: 'Compliance Operations' },
  { id: 'usr-102', name: 'Siti Rahma', jlLevel: 'JL8', title: 'Compliance Reviewer & Manager', department: 'Compliance Advisory & Quality' },
  { id: 'usr-103', name: 'Dewi Lestari', jlLevel: 'JL9', title: 'Head of Compliance', department: 'Group Compliance Governance' }
];

export default function IsoXPageClient() {
  const [activeUser, setActiveUser] = useState<UserContext>(USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  // Modals & Interactive States
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [showNewAdvisoryModal, setShowNewAdvisoryModal] = useState<boolean>(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState<boolean>(false);
  const [showNewFindingModal, setShowNewFindingModal] = useState<boolean>(false);
  
  const [selectedAdvisoryStep, setSelectedAdvisoryStep] = useState<string>('MANAGER_REVIEW');
  const [advisoryStatusMessage, setAdvisoryStatusMessage] = useState<string | null>(null);
  const [findingStatus, setFindingStatus] = useState<string>('IN_PROGRESS');

  // Risk Calculator Interactive State
  const [likelihood, setLikelihood] = useState<number>(3);
  const [impact, setImpact] = useState<number>(5);
  const [controlEffectiveness, setControlEffectiveness] = useState<'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE'>('EFFECTIVE');

  // Authority Matrix Checker
  const checkAuthority = (action: 'EXECUTE' | 'REVIEW' | 'APPROVE', capability: string) => {
    if (activeUser.jlLevel === 'JL7') return action === 'EXECUTE';
    if (activeUser.jlLevel === 'JL8') return action === 'EXECUTE' || action === 'REVIEW';
    if (activeUser.jlLevel === 'JL9') return true;
    return false;
  };

  const handleRunAiAssistant = () => {
    setAiOutput(
      `[AI COMPLIANCE ASSESSMENT - ISO-X RAG ENGINE v1.0]\n\n` +
      `📌 Target Regulation: POJK No. 38/POJK.03/2016 & ISO 27001:2022 (A.8.24)\n` +
      `🎯 Impacted Business Units: IT Operations, Cybersecurity, Digital Banking, Compliance Advisory\n` +
      `⚠️ Identified Gap: Policy 'POL-IT-004' (Kebijakan Pengamanan Aset Informasi) was last reviewed in 2022 (>3 years old). Obsolete policy risk detected per Compliance Culture Framework.\n` +
      `💡 Action Recommendation: Initiate policy review workflow, update key rotation SLA to 24h, and forward draft to JL8 Manager.\n\n` +
      `Confidence Score: 98.2% | Reference: POJK 38/2016 Article 12, ISO 27001 Annex A.5.1 & A.8.24\n` +
      `🔒 Guardrail Notice: This AI output is advisory only. Final approval requires human sign-off by JL8 Manager or JL9 Head of Compliance.`
    );
  };

  // Risk Scores calculation
  const inherentScore = likelihood * impact;
  const reductionFactor = controlEffectiveness === 'EFFECTIVE' ? 0.6 : controlEffectiveness === 'PARTIALLY_EFFECTIVE' ? 0.3 : 0;
  const residualScore = Math.max(1, Math.round(inherentScore * (1 - reductionFactor)));

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: TrendingUp },
    { id: 'iso', label: 'Management System (ISO)', icon: Layers },
    { id: 'regulatory', label: 'Regulatory & Changes', icon: BookOpen },
    { id: 'advisory', label: 'Compliance Advisory', icon: Briefcase },
    { id: 'risk', label: 'Compliance Risk & Control', icon: AlertTriangle },
    { id: 'culture', label: 'Culture & Competency', icon: Award },
    { id: 'governance', label: 'Governance & GCG', icon: Building2 },
    { id: 'findings', label: 'Issues & Action Plans', icon: FileCheck },
    { id: 'evidence', label: 'Evidence & Doc Vault', icon: FolderLock },
    { id: 'traceability', label: '360° Traceability Map', icon: GitMerge },
    { id: 'ai', label: 'ISO-X AI Assistant', icon: BrainCircuit }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* TOP RESPONSIVE HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none bg-slate-800 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-1.5 md:p-2 rounded-lg text-white shadow-lg">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-base md:text-lg text-white tracking-wide">ISO-X</h1>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 hidden sm:block">Integrated Management & Compliance Platform</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="360° Search regulation, requirement, risk, control, finding, evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User Context Selector */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda Technotama</span>
          </Link>
          <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700/70 px-2 md:px-3 py-1.5 rounded-lg">
            <UserCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <span>{activeUser.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  activeUser.jlLevel === 'JL9' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  activeUser.jlLevel === 'JL8' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {activeUser.jlLevel}
                </span>
              </div>
            </div>
            <select
              value={activeUser.id}
              onChange={(e) => {
                const found = USERS.find((u) => u.id === e.target.value);
                if (found) setActiveUser(found);
              }}
              className="bg-slate-900 text-xs text-slate-300 border border-slate-700 rounded px-1 py-1 focus:outline-none font-bold cursor-pointer"
            >
              {USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.jlLevel} ({u.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-sm text-white">ISO-X Navigation</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Main Navigation</p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">System Admin</p>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setActiveTab('authority')}
                  className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded text-xs ${
                    activeTab === 'authority' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Authority Matrix (JL7-9)</span>
                </button>
                <button
                  onClick={() => setActiveTab('auditlog')}
                  className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded text-xs ${
                    activeTab === 'auditlog' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Immutable Audit Log</span>
                </button>
              </div>
            </div>
          </div>

          {/* Authority Capability Status Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Authority Limits</span>
              <span className="font-mono text-teal-400">{activeUser.jlLevel}</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Can Draft & Execute:</span>
                <span className="text-emerald-400 font-bold">YES</span>
              </div>
              <div className="flex justify-between">
                <span>Can Review (JL8+):</span>
                <span className={checkAuthority('REVIEW', 'ANY') ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {checkAuthority('REVIEW', 'ANY') ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Can Approve (JL9):</span>
                <span className={checkAuthority('APPROVE', 'ANY') ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {checkAuthority('APPROVE', 'ANY') ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 bg-slate-950 p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 pb-20 md:pb-6">
          {/* AUTOMATED COMPLIANCE GAP ALERT BANNER */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
            <div className="flex items-start space-x-3">
              <AlertOctagon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-300">Automated Compliance Gap Detected</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Internal Policy <strong className="text-amber-200">POL-IT-004 (Kebijakan Pengamanan Aset Informasi)</strong> was last reviewed in 2022 (&gt;3 years ago). Mandatory review required per Compliance Culture Framework.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResolveModal(true)}
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 md:py-1.5 rounded shadow transition text-center flex-shrink-0"
            >
              Resolve Gap
            </button>
          </div>

          {/* RESOLVE GAP MODAL */}
          {showResolveModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                    <AlertOctagon className="w-4 h-4 text-amber-400" />
                    <span>Initiate Policy Review Workflow (POL-IT-004)</span>
                  </h3>
                  <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <p><strong>Target Policy:</strong> POL-IT-004 - Kebijakan Pengamanan Aset Informasi</p>
                  <p><strong>Mapped Requirement:</strong> POJK No. 38/POJK.03/2016 (Pasal 12)</p>
                  <p><strong>Reason:</strong> Obsolete Policy Alert (&gt;3 Years Review Age)</p>
                  <div className="bg-slate-800 p-3 rounded space-y-1">
                    <label className="font-semibold text-slate-200">Assign Reviewer (JL8 Manager):</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none">
                      <option>Siti Rahma (JL8 - Compliance Advisory Manager)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button onClick={() => setShowResolveModal(false)} className="px-3 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('Workflow Task Created: Policy Review Task assigned to Siti Rahma (JL8 Manager). Audit Log Recorded.');
                      setShowResolveModal(false);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-1.5 rounded shadow"
                  >
                    Submit Policy Review Task
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">Executive Compliance Dashboard</h2>
                  <p className="text-xs text-slate-400">Integrated Closed-Loop Governance Metrics across 18 Platform Modules</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live System Status: Healthy</span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: 'Overall Compliance Score', value: '94.8%', change: '+1.2%', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400' },
                  { label: 'Regulatory Coverage Rate', value: '98.5%', change: '100% POJK/BI', color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400' },
                  { label: 'Critical Open Findings', value: '2 Issues', change: 'Action Plan Active', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400' },
                  { label: 'GCG Rating (Self-Assessment)', value: '92.4 (Sangat Baik)', change: '100% SLA Met', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${kpi.color} border p-4 rounded-xl shadow-md`}>
                    <p className="text-xs font-medium text-slate-300">{kpi.label}</p>
                    <p className="text-xl md:text-2xl font-extrabold text-white mt-1 font-mono">{kpi.value}</p>
                    <p className="text-[11px] mt-1 text-slate-400">{kpi.change}</p>
                  </div>
                ))}
              </div>

              {/* Active ISO Standards Grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-bold text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Configured ISO Management System Standards</span>
                  </h3>
                  <span className="text-[10px] md:text-xs text-slate-400">Vendor Neutral Engine</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  {[
                    { code: 'ISO 27001:2022', title: 'Information Security Management System', clauses: 11, reqs: 93, compliance: '96%' },
                    { code: 'ISO 37001:2016', title: 'Anti-Bribery Management System', clauses: 10, reqs: 48, compliance: '98%' },
                    { code: 'ISO 22301:2019', title: 'Business Continuity Management System', clauses: 10, reqs: 62, compliance: '91%' }
                  ].map((std, i) => (
                    <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-400 text-xs font-mono">{std.code}</span>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">{std.compliance}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{std.title}</p>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                        <span>{std.clauses} Clauses</span>
                        <span>{std.reqs} Requirements</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GOVERNANCE & GCG (EXPANDED FULLY) */}
          {activeTab === 'governance' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Governance & GCG Self Assessment Management</h2>
                  <p className="text-xs text-slate-400">Integrated Scorecards, Regulatory Commitments, and Policy Governance</p>
                </div>
                <button
                  onClick={() => alert('New GCG Self-Assessment Cycle Triggered')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-lg font-semibold shadow transition"
                >
                  + Start GCG Assessment Cycle
                </button>
              </div>

              {/* Annual GCG Scorecard Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Annual GCG Self-Assessment Scorecard (Year 2025)</h3>
                    <p className="text-xs text-slate-400">Composite Governance Score: <strong className="text-emerald-400 text-base font-mono">92.4 / 100</strong></p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded font-bold border border-emerald-500/30 self-start sm:self-auto">
                    Rating: SANGAT BAIK (VERY GOOD)
                  </span>
                </div>

                {/* 5 Key Criteria Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Assessment Criteria Category</th>
                        <th className="p-3">Weight</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Weighted Value</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-semibold text-white">1. Pelaksanaan Tugas & Tanggung Jawab Direksi & Dewan Komisaris</td>
                        <td className="p-3 font-mono text-slate-400">25%</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">94.0</td>
                        <td className="p-3 font-mono text-slate-200">23.50</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">VALIDATED</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">2. Kelengkapan & Pelaksanaan Komite (Audit, Risk, Nomination)</td>
                        <td className="p-3 font-mono text-slate-400">15%</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">91.5</td>
                        <td className="p-3 font-mono text-slate-200">13.725</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">VALIDATED</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">3. Penerapan Fungsi Kepatuhan, Audit Internal & Eksternal</td>
                        <td className="p-3 font-semibold text-white">20%</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">93.8</td>
                        <td className="p-3 font-mono text-slate-200">18.76</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">VALIDATED</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">4. Penerapan Manajemen Risiko & Pengendalian Intern</td>
                        <td className="p-3 font-mono text-slate-400">25%</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">90.2</td>
                        <td className="p-3 font-mono text-slate-200">22.55</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">VALIDATED</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">5. Transparansi Kondisi Keuangan & Non-Keuangan</td>
                        <td className="p-3 font-mono text-slate-400">15%</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">92.5</td>
                        <td className="p-3 font-mono text-slate-200">13.875</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">VALIDATED</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regulatory Commitments SLA Tracker */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Regulator Commitments & SLA Tracker</span>
                  </h3>
                  <span className="text-xs text-slate-400">Automated Reminders: 30d, 14d, 7d, Due Date</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Commitment Title</th>
                        <th className="p-3">Regulator</th>
                        <th className="p-3">Requirement Link</th>
                        <th className="p-3">Target Due Date</th>
                        <th className="p-3">SLA Days Left</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-semibold text-white">Penyampaian Laporan Self-Assessment Risk & POJK 38</td>
                        <td className="p-3 font-bold text-blue-400">OJK</td>
                        <td className="p-3 font-mono text-slate-400">POJK38-P12-A1</td>
                        <td className="p-3 font-mono text-slate-300">2026-09-30</td>
                        <td className="p-3 font-mono text-amber-400 font-bold">42 Days</td>
                        <td className="p-3"><span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">IN_PROGRESS</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Laporan Audit Sertifikasi ISO 27001 Penyelenggara QRIS</td>
                        <td className="p-3 font-bold text-blue-400">Bank Indonesia</td>
                        <td className="p-3 font-mono text-slate-400">PBI22-P8-A1</td>
                        <td className="p-3 font-mono text-slate-300">2026-11-15</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">88 Days</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">ON_TRACK</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CULTURE & COMPETENCY (EXPANDED FULLY) */}
          {activeTab === 'culture' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Compliance Culture, Campaign & Competency Management</h2>
                  <p className="text-xs text-slate-400">Socializations, Quizzes, Certification Matrix & Training Material</p>
                </div>
                <button
                  onClick={() => alert('New Campaign Created')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-lg font-semibold shadow transition"
                >
                  + Launch New Campaign
                </button>
              </div>

              {/* Culture Overview Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400">Active Campaign</span>
                  <p className="text-base font-bold text-white">Anti-Bribery Month 2026</p>
                  <p className="text-xs text-emerald-400 font-mono">87.5% Participation Coverage</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400">Mandatory Quiz Pass Rate</span>
                  <p className="text-base font-bold text-white">94.2% Passed</p>
                  <p className="text-xs text-blue-400 font-mono">1,450 Employee Participants</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400">Average Employee Test Score</span>
                  <p className="text-base font-bold text-white">88.5 / 100</p>
                  <p className="text-xs text-purple-400 font-mono">Passing Grade Threshold: 80</p>
                </div>
              </div>

              {/* Regulatory Socialization Schedule Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
                <h3 className="text-sm font-bold text-white">Regulatory Socialization Schedule & Attendance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Socialization Program</th>
                        <th className="p-3">Target Audience</th>
                        <th className="p-3">Material Version</th>
                        <th className="p-3">Schedule Date</th>
                        <th className="p-3">Attendance Rate</th>
                        <th className="p-3">Assessment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-semibold text-white">POJK 38/2016 IT Risk Control Refresher Briefing</td>
                        <td className="p-3 text-slate-300">IT Operations & Branch Ops</td>
                        <td className="p-3 font-mono text-teal-400">v2.1 PDF</td>
                        <td className="p-3 font-mono text-slate-400">2026-08-10</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">96.4%</td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">COMPLETED</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">ISO 37001 Anti-Bribery Code of Conduct Workshop</td>
                        <td className="p-3 text-slate-300">Credit Approvers & Procurement</td>
                        <td className="p-3 font-mono text-teal-400">v1.4 Video</td>
                        <td className="p-3 font-mono text-slate-400">2026-08-25</td>
                        <td className="p-3 font-mono text-amber-400 font-bold">Scheduled</td>
                        <td className="p-3"><span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">UPCOMING</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ISSUES & ACTION PLANS (EXPANDED FULLY) */}
          {activeTab === 'findings' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Common Issue & Action Management Repository</h2>
                  <p className="text-xs text-slate-400">Centralized Finding Remediation Lifecycle across all 18 platform modules</p>
                </div>
                <button onClick={() => setShowNewFindingModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-lg font-semibold shadow">
                  + Log New Finding
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Finding ID</th>
                        <th className="p-3">Source Module</th>
                        <th className="p-3">Severity</th>
                        <th className="p-3">Finding Description</th>
                        <th className="p-3">Action Owner</th>
                        <th className="p-3">Target Due</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-mono text-blue-400">FND-2026-001</td>
                        <td className="p-3 text-slate-300">COMPLIANCE_MONITORING</td>
                        <td className="p-3"><span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">HIGH</span></td>
                        <td className="p-3 font-semibold text-white">SOP pengamanan kunci enkripsi database belum dimutakhirkan per POJK 38.</td>
                        <td className="p-3 text-slate-300">Budi Santoso (JL7)</td>
                        <td className="p-3 font-mono text-slate-400">2026-09-30</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                            findingStatus === 'CLOSED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {findingStatus}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Finding Action Control Panel */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setFindingStatus('PENDING_VALIDATION');
                      alert('Evidence submitted for validation. Forwarded to JL8 Manager (Siti Rahma).');
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded font-semibold"
                  >
                    Submit Evidence for Validation (JL7)
                  </button>
                  <button
                    disabled={!checkAuthority('REVIEW', 'ANY')}
                    onClick={() => {
                      setFindingStatus('CLOSED');
                      alert('Finding validated & closed by Manager (JL8/JL9). Immutable Audit Log recorded.');
                    }}
                    className={`text-xs px-3.5 py-2 rounded font-semibold ${
                      checkAuthority('REVIEW', 'ANY') ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Validate & Close Finding (Requires JL8+)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NEW FINDING MODAL */}
          {showNewFindingModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    <span>Log New Compliance Finding</span>
                  </h3>
                  <button onClick={() => setShowNewFindingModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Source Module:</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200">
                      <option>ISO_AUDIT</option>
                      <option>COMPLIANCE_MONITORING</option>
                      <option>REGULATORY_EXAMINATION</option>
                      <option>GCG_ASSESSMENT</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Severity Tiers:</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200">
                      <option>CRITICAL</option>
                      <option>HIGH</option>
                      <option>MEDIUM</option>
                      <option>LOW</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Finding Description:</label>
                    <textarea rows={3} placeholder="Describe non-compliance observation..." className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200"></textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button onClick={() => setShowNewFindingModal(false)} className="px-3 py-1.5 text-slate-400">Cancel</button>
                  <button onClick={() => { alert('Finding Logged and Action Plan assigned.'); setShowNewFindingModal(false); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-1.5 rounded shadow">Log Finding</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: EVIDENCE VAULT (EXPANDED FULLY) */}
          {activeTab === 'evidence' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Centralized Evidence & Document Vault</h2>
                  <p className="text-xs text-slate-400">Cryptographic Checksums (SHA-256) & Classification Security Control</p>
                </div>
                <button
                  onClick={() => setShowUploadEvidenceModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-lg font-semibold shadow transition"
                >
                  + Upload Cryptographic Evidence
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Document Name</th>
                        <th className="p-3">Classification</th>
                        <th className="p-3">SHA-256 Checksum</th>
                        <th className="p-3">Entity Mapping</th>
                        <th className="p-3">Access Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-semibold text-white">Encryption_Key_Policy_v2.pdf</td>
                        <td className="p-3"><span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">CONFIDENTIAL</span></td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">a591a6d40bf4204...146e</td>
                        <td className="p-3 text-blue-400 font-mono">ActionPlan (act-001)</td>
                        <td className="p-3">
                          {checkAuthority('REVIEW', 'ANY') ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /> <span>Authorized ({activeUser.jlLevel})</span></span>
                          ) : (
                            <span className="text-red-400 font-bold flex items-center space-x-1"><Lock className="w-3.5 h-3.5" /> <span>Restricted (Requires JL8+)</span></span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD EVIDENCE MODAL */}
          {showUploadEvidenceModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <FolderLock className="w-4 h-4 text-blue-400" />
                    <span>Upload Cryptographic Evidence File</span>
                  </h3>
                  <button onClick={() => setShowUploadEvidenceModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Select File:</label>
                    <input type="file" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Classification Tiers:</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200">
                      <option>CONFIDENTIAL (Requires JL8+)</option>
                      <option>INTERNAL</option>
                      <option>STRICTLY_CONFIDENTIAL (Requires JL9)</option>
                      <option>PUBLIC</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button onClick={() => setShowUploadEvidenceModal(false)} className="px-3 py-1.5 text-slate-400">Cancel</button>
                  <button onClick={() => { alert('Evidence Uploaded & SHA-256 Checksum Computed.'); setShowUploadEvidenceModal(false); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-1.5 rounded shadow">Upload Document</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: TRACEABILITY */}
          {activeTab === 'traceability' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">360° Closed-Loop Traceability Graph</h2>
                <p className="text-xs text-slate-400">Complete End-to-End Linkage from Regulation to Validated Evidence</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-1">
                  <span className="font-mono text-blue-400">Regulation ID: POJK-38-2016</span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-semibold">Traceability Status: 100% Linked</span>
                </div>

                <div className="relative pl-6 border-l-2 border-blue-500/40 space-y-4 md:space-y-6">
                  {[
                    { step: '1. Standard / Regulation', title: 'POJK No. 38/POJK.03/2016 (Pasal 12)', color: 'border-blue-500 text-blue-300' },
                    { step: '2. Regulatory Requirement', title: 'REQ-POJK38-P12-A1: IT Security & Risk Control Implementation', color: 'border-indigo-500 text-indigo-300' },
                    { step: '3. Compliance Risk', title: 'RSK-REG-001: Regulatory fine due to IT security incident report delay (Inherent Risk: 15)', color: 'border-amber-500 text-amber-300' },
                    { step: '4. Internal Control', title: 'CTL-IT-001: Automated SIEM 24/7 Monitoring & Escalation Protocol', color: 'border-teal-500 text-teal-300' },
                    { step: '5. Compliance Test / Finding', title: 'FND-2026-001: Encryption key rotation SOP update delay (Severity: HIGH)', color: 'border-red-500 text-red-300' },
                    { step: '6. Action Plan', title: 'ACT-001: Update Key Rotation SOP & Conduct Team Briefing (Due: 30 Sep 2026)', color: 'border-purple-500 text-purple-300' },
                    { step: '7. Cryptographic Evidence', title: 'Encryption_Key_Policy_v2.pdf (SHA256: a591a6d40bf4...)', color: 'border-emerald-500 text-emerald-300' }
                  ].map((node, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-400 group-hover:bg-blue-500 transition"></div>
                      <div className={`bg-slate-800/70 border p-3 rounded-lg ${node.color}`}>
                        <span className="text-[10px] uppercase tracking-wider font-bold block">{node.step}</span>
                        <span className="text-xs font-semibold">{node.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center space-x-2">
                  <BrainCircuit className="w-5 h-5 text-teal-400" />
                  <span>ISO-X AI Compliance & Regulatory RAG Assistant</span>
                </h2>
                <p className="text-xs text-slate-400">Automated Regulation Summarizer, Impact Analysis & Control Suggestion Engine</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Enter Query or Regulation Text for Analysis:</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Analyze impact of POJK 38/2016 Pasal 12 on IT Operations and Database Encryption SOPs..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  ></textarea>
                </div>

                <button
                  onClick={handleRunAiAssistant}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white text-xs px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-md transition"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Run AI Impact & Compliance Analysis</span>
                </button>

                {aiOutput && (
                  <div className="bg-slate-950 border border-teal-500/30 rounded-lg p-3 md:p-4 font-mono text-xs text-teal-300 space-y-2 whitespace-pre-wrap">
                    {aiOutput}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 12: AUTHORITY MATRIX ADMIN */}
          {activeTab === 'authority' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">Authority Matrix Configuration (JL7 / JL8 / JL9)</h2>
                <p className="text-xs text-slate-400">Configurable Position Levels & Capability Approval Limits</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Capability Code</th>
                        <th className="p-3">JL7 (Analyst)</th>
                        <th className="p-3">JL8 (Manager)</th>
                        <th className="p-3">JL9 (Head)</th>
                        <th className="p-3">Financial Approval Threshold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-mono text-blue-400">COMPLIANCE_OPINION</td>
                        <td className="p-3 text-emerald-400 font-semibold">Execute / Draft</td>
                        <td className="p-3 text-indigo-400 font-semibold">Review & Recommend</td>
                        <td className="p-3 text-amber-400 font-semibold">Final Approval</td>
                        <td className="p-3 text-slate-300 font-mono">Rp 100.000.000 (JL9)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-blue-400">REGULATORY_MAPPING</td>
                        <td className="p-3 text-emerald-400 font-semibold">Execute / Map</td>
                        <td className="p-3 text-indigo-400 font-semibold">Review Gap</td>
                        <td className="p-3 text-amber-400 font-semibold">Approve Exemption</td>
                        <td className="p-3 text-slate-300 font-mono">N/A</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-blue-400">RISK_SCORE_OVERRIDE</td>
                        <td className="p-3 text-slate-500 font-semibold">Restricted</td>
                        <td className="p-3 text-indigo-400 font-semibold">Review Override</td>
                        <td className="p-3 text-amber-400 font-semibold">Approve Override</td>
                        <td className="p-3 text-slate-300 font-mono">N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: IMMUTABLE AUDIT LOG */}
          {activeTab === 'auditlog' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">Immutable Audit Trail Log</h2>
                <p className="text-xs text-slate-400">Cryptographically Recorded System Transactions & Security Logs</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Target Entity</th>
                        <th className="p-3">User</th>
                        <th className="p-3">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-mono text-slate-400">2026-08-19 11:24:10</td>
                        <td className="p-3 font-bold text-emerald-400">APPROVE_OPINION</td>
                        <td className="p-3 text-blue-400 font-mono">ADVISORY_CASE (ADV-2026-001)</td>
                        <td className="p-3 font-semibold text-white">Siti Rahma (JL8)</td>
                        <td className="p-3 font-mono text-slate-400">127.0.0.1</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-slate-400">2026-08-19 10:15:02</td>
                        <td className="p-3 font-bold text-blue-400">LOGIN</td>
                        <td className="p-3 text-slate-300 font-mono">USER (usr-101)</td>
                        <td className="p-3 font-semibold text-white">Budi Santoso (JL7)</td>
                        <td className="p-3 font-mono text-slate-400">127.0.0.1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM QUICK NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 px-2 py-1.5 flex justify-around items-center z-50 backdrop-blur-md">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'advisory', label: 'Advisory', icon: Briefcase },
          { id: 'regulatory', label: 'Regulatory', icon: BookOpen },
          { id: 'traceability', label: 'Trace 360°', icon: GitMerge },
          { id: 'ai', label: 'AI Assist', icon: BrainCircuit }
        ].map((btn) => {
          const Icon = btn.icon;
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive ? 'text-blue-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="mt-0.5">{btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
