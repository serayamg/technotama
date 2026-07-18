'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import dynamic from 'next/dynamic';

const CanvasNetwork = dynamic(() => import('@/components/CanvasNetwork'), { ssr: false });
import { 
  Shield, CheckCircle2, ChevronRight, FileText, Users, Award, 
  HelpCircle, Star, Calendar, ArrowRight, Zap, Target, BookOpen, 
  Lock, Key, Eye, Layout, Server, AlertCircle, X, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Services
const services = [
  {
    id: 'cyber-blueprint',
    title: 'Cybersecurity Blueprint',
    desc: 'Perancangan strategi dan peta jalan (roadmap) keamanan TI yang terintegrasi secara jangka panjang.',
    icon: Shield,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'it-grc',
    title: 'Policy-SOP Development',
    desc: 'Pengembangan kerangka kerja tata kelola TI, struktur kebijakan (High-Level Policy), serta manajemen risiko pihak ketiga.',
    icon: FileText,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'iso-implementation',
    title: 'ISO/IEC Implementation',
    desc: 'Pendampingan implementasi standar internasional (seperti ISO/IEC 27001) menggunakan siklus PDCA.',
    icon: Award,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'bcm-bcp-drp',
    title: 'BCM-BCP-DRP Services (Cyber Drill)',
    desc: 'Penyusunan Business Continuity Plan (BCP), Disaster Recovery Plan (DRP), dan simulasi kesiapan penanganan insiden siber (Table-Top Exercise/Cyber Drill).',
    icon: Server,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'digital-maturity',
    title: 'Digital Maturity Assessment & Security Risk Rating',
    desc: 'Evaluasi tingkat kematangan digital dan kuantifikasi postur keamanan organisasi secara terukur.',
    icon: Zap,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'cyber-awareness',
    title: 'Awareness & Training',
    desc: 'Program pelatihan, phishing simulation, dan kampanye keamanan untuk staf non-teknis.',
    icon: BookOpen,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'it-audit',
    title: 'IT Audit',
    desc: 'Audit menyeluruh terkait tata kelola, infrastruktur, sistem perdagangan (trading), dan kepatuhan regulasi (seperti POJK).',
    icon: CheckCircle2,
    badge: 'Governance',
    cluster: 'governance'
  },
  {
    id: 'vulnerability-assessment',
    title: 'Vulnerability Assessment (VA)',
    desc: 'Pemetaan dan pemindaian kerentanan sistem atau jaringan secara otomatis dan berkala.',
    icon: Eye,
    badge: 'Offensive',
    cluster: 'offensive'
  },
  {
    id: 'penetration-testing',
    title: 'Penetration Testing (Pen-Test)',
    desc: 'Simulasi eksploitasi keamanan menggunakan metode Black Box, Gray Box, maupun White Box.',
    icon: Key,
    badge: 'Offensive',
    cluster: 'offensive'
  },
  {
    id: 'secure-sdlc',
    title: 'Secure SDLC Implementation',
    desc: 'Integrasi keamanan sejak tahap awal pemrograman dengan pendekatan Shift Left atau DevSecOps.',
    icon: Lock,
    badge: 'Offensive',
    cluster: 'offensive'
  },
  {
    id: 'red-teaming',
    title: 'Red Teaming',
    desc: 'Simulasi serangan siber multi-vektor secara riil untuk menguji ketahanan sistem dan tim keamanan internal.',
    icon: Target,
    badge: 'Offensive',
    cluster: 'offensive'
  },
  {
    id: 'soc',
    title: 'Security Operation Center (SOC)',
    desc: 'Pemantauan keamanan siber 24/7 real-time berbasis infrastruktur SIEM dan tim analis terlatih.',
    icon: Shield,
    badge: 'Defensive',
    cluster: 'defensive'
  },
  {
    id: 'cyber-threat-intelligence',
    title: 'Cyber Threat Intelligence (CTI) Solution',
    desc: 'Integrasi data ancaman global secara real-time untuk mendeteksi kebocoran data dan kredensial secara dini.',
    icon: Zap,
    badge: 'Defensive',
    cluster: 'defensive'
  },
  {
    id: 'network-endpoint-hardening',
    title: 'Network & Endpoint Hardening',
    desc: 'Reinforcement konfigurasi sistem, penutupan port, dan penguatan perangkat jaringan serta endpoint.',
    icon: Server,
    badge: 'Defensive',
    cluster: 'defensive'
  },
  {
    id: 'incident-management',
    title: 'Cyber Security Incident Management',
    desc: 'Kerangka respons darurat untuk mendeteksi, mengisolasi, dan membasmi ancaman berdasarkan NIST IR Life Cycle.',
    icon: AlertCircle,
    badge: 'Defensive',
    cluster: 'defensive'
  },
  {
    id: 'digital-forensic',
    title: 'Digital Forensic',
    desc: 'Identifikasi, pengumpulan, dan analisis bukti digital pasca-insiden yang memenuhi standar hukum dan regulasi.',
    icon: FileCheck,
    badge: 'Defensive',
    cluster: 'defensive'
  }
];

// Mock Client Logos Grouped
const clients = {
  Government: ['Badan Siber dan Sandi Negara (BSSN)', 'Kementerian Komunikasi dan Digital', 'Kejaksaan RI Jamintel', 'Kemenkumham Ditjen AHU', 'Ditjenpas Kemenkumham', 'Pusdatin Kemenkes', 'Kemen PANRB', 'Bawaslu RI', 'Lembaga Sandi Negara'],
  Financial: ['Bank UOB Indonesia', 'Bank DKI', 'Bank Sumsel Babel', 'Alto Network', 'Wirecard Indonesia', 'Cashfazz', 'Flip', 'Kaspro', 'ATMi', 'Payhere'],
  Enterprise: ['Perum BULOG', 'PT Jasa Marga', 'PT Delameta Bilano', 'PT Lawang Sewu Teknologi', 'AsiaPay Teknologi Indonesia'],
  Education: ['Politeknik Siber dan Sandi Negara', 'UIN Syarif Hidayatullah'],
  BUMN: ['PT Berdikari (Persero)', 'Asuransi Jasindo', 'Asuransi Kitabisa', 'Tanoto Foundation']
};

// Framework data for Popups
const frameworks = [
  { name: 'COBIT', desc: 'Control Objectives for Information and Related Technologies. Standar tata kelola TI untuk menyelaraskan TI dengan tujuan bisnis organisasi. RTI menggunakan COBIT 2019 untuk asesmen kematangan TI klien.' },
  { name: 'TOGAF', desc: 'The Open Group Architecture Framework. Metodologi arsitektur enterprise untuk merancang arsitektur TI dan arsitektur bisnis organisasi agar terintegrasi dengan baik.' },
  { name: 'ISO 27001', desc: 'Standar Sistem Manajemen Keamanan Informasi (SMKI) global. RTI mendampingi instansi dari analisis kesenjangan (gap assessment), pembuatan kebijakan, penyusunan SOP, hingga kelulusan sertifikasi.' },
  { name: 'ISO 20000', desc: 'Standar internasional untuk manajemen layanan TI (ITIL-aligned). Membantu meningkatkan kehandalan operasional layanan teknologi informasi perusahaan.' },
  { name: 'ISO 22301', desc: 'Standar internasional untuk Business Continuity Management System (BCMS). Membantu organisasi mempersiapkan diri dari bencana siber/fisik (DRC/BCP).' },
  { name: 'NIST CSF', desc: 'National Institute of Standards and Technology Cybersecurity Framework. Kerangka kerja siber (Identify, Protect, Detect, Respond, Recover) untuk mengelola risiko keamanan informasi.' },
  { name: 'CIS Controls', desc: 'Center for Internet Security Controls. Kumpulan 18 tindakan defensif siber prioritas tinggi untuk menangkis vektor serangan yang paling sering terjadi.' },
  { name: 'OWASP', desc: 'Open Web Application Security Project. Metodologi pengujian kerentanan untuk keamanan aplikasi web, mobile, dan API. RTI menggunakan OWASP Top 10 sebagai parameter utama VAPT.' },
  { name: 'SABSA', desc: 'Sherwood Applied Business Security Architecture. Kerangka kerja arsitektur siber terintegrasi yang menghubungkan sasaran bisnis organisasi dengan kontrol keamanan teknis.' },
  { name: 'MITRE ATT&CK', desc: 'Kerangka kerja taktis yang mendokumentasikan teknik serangan siber di dunia nyata. RTI menggunakannya dalam skenario adversary emulation oleh Red Team kami.' },
  { name: 'PCI DSS', desc: 'Payment Card Industry Data Security Standard. Standar wajib untuk keamanan transaksi kartu kredit. RTI mendampingi payment gateway dan fintech meraih sertifikasi ini.' }
];

// Project Methodology Phases with detailed bullet points and outcomes to avoid layout squishing
const methodology = [
  { 
    step: '01', 
    title: 'Discover', 
    desc: 'Melakukan pemetaan awal infrastruktur siber, kondisi tata kelola saat ini (as-is), serta penentuan ruang lingkup asesmen.',
    activities: [
      'Identifikasi seluruh aset kritis, proses bisnis utama, dan regulasi kepatuhan.',
      'Kick-off meeting bersama pemangku kepentingan (C-Level & IT Team).',
      'Penentuan ruang lingkup proyek (scoping) dan penyusunan Project Charter.'
    ],
    output: 'Project Charter & Scope Definition Document'
  },
  { 
    step: '02', 
    title: 'Assess', 
    desc: 'Melakukan gap analysis kepatuhan standar, vulnerability assessment, penetration testing, serta asesmen risiko siber.',
    activities: [
      'Pengujian penetrasi ofensif (VAPT) untuk menemukan kerentanan sistem.',
      'Analisis kesenjangan (gap analysis) terhadap standar industri (ISO/PCI DSS/UU PDP).',
      'Asesmen risiko TI untuk memetakan ancaman dan dampaknya bagi bisnis.'
    ],
    output: 'Gap Analysis Report & VAPT Vulnerability Findings'
  },
  { 
    step: '03', 
    title: 'Design', 
    desc: 'Merancang arsitektur keamanan (to-be), menyusun kebijakan/SOP tata kelola, dan menyusun roadmap peningkatan kapabilitas.',
    activities: [
      'Penyusunan draf kebijakan keamanan informasi dan standar operasional prosedur (SOP).',
      'Perancangan arsitektur jaringan aman dan perimeter pertahanan siber.',
      'Penyusunan rencana aksi taktis dan jangka panjang (3-year Cybersecurity Roadmap).'
    ],
    output: 'Security Architecture Blueprint & SOP Drafts'
  },
  { 
    step: '04', 
    title: 'Implement', 
    desc: 'Mendampingi implementasi kontrol siber teknis & organisasional, serta penyusunan Business Continuity Plan (BCP).',
    activities: [
      'Pendampingan konfigurasi kontrol keamanan di server dan infrastruktur cloud.',
      'Penerapan kebijakan baru di tingkat operasional dan manajemen SDM.',
      'Penyusunan Business Continuity Plan (BCP) & Disaster Recovery Plan (DRP).'
    ],
    output: 'BCP/DRP Policy & Deployed Security Controls'
  },
  { 
    step: '05', 
    title: 'Validate', 
    desc: 'Melakukan re-test (audit surveillance) untuk memastikan seluruh temuan celah keamanan telah ditutup.',
    activities: [
      'Audit internal independen terhadap kepatuhan SOP yang telah berjalan.',
      'Pengujian ulang (re-test VAPT) untuk memvalidasi efektivitas perbaikan (remediation).',
      'Surveilans kesiapan sertifikasi sebelum audit final eksternal.'
    ],
    output: 'Internal Audit Report & Remediation Validation Report'
  },
  { 
    step: '06', 
    title: 'Train', 
    desc: 'Memberikan awareness pelatihan keamanan informasi bagi staf umum hingga pelatihan teknis bagi tim TI (Red/Blue Team).',
    activities: [
      'Penyelenggaraan Security Awareness Training untuk seluruh jajaran staf non-teknis.',
      'Pelatihan teknis intensif (VAPT, Incident Response) untuk tim operasional TI.',
      'Kampanye kesadaran keamanan informasi (phishing simulation berkala).'
    ],
    output: 'Security Training Certificates & Awareness Analytics'
  },
  { 
    step: '07', 
    title: 'Support', 
    desc: 'Mendampingi audit sertifikasi oleh Lembaga Sertifikasi independen serta menyediakan retainer support kepatuhan tahunan.',
    activities: [
      'Pendampingan penuh selama proses audit sertifikasi resmi (sertifikasi ISO/PCI).',
      'Dukungan kepatuhan regulasi tahunan (retainer security consultant).',
      'Review dan peningkatan berkelanjutan (continuous improvement) sistem tata kelola siber.'
    ],
    output: 'ISO/PCI DSS Certificate & Annual Retainer SLA'
  }
];

// Case Studies based on profile
const caseStudies = [
  {
    id: 'lpdp',
    client: 'LPDP (Lembaga Pengelola Dana Pendidikan)',
    project: 'Implementasi ISO/IEC 27001:2022',
    challenge: 'Meningkatkan perlindungan data sensitif beasiswa nasional dan menjaga kepatuhan terhadap standar keamanan siber terbaru.',
    approach: 'Melakukan gap analysis dari ISO 27001:2013 ke ISO 27001:2022, perbaikan SOP, penyusunan dokumen SMKI, dan pendampingan audit eksternal.',
    deliverables: 'Kebijakan Keamanan Informasi baru, Risk Assessment Report, SOP Kepatuhan Aplikasi, Sertifikasi ISO 27001:2022.',
    impact: 'LPDP sukses mengadopsi kontrol keamanan versi terbaru, memastikan perlindungan data seluruh pendaftar beasiswa terlindungi aman.'
  },
  {
    id: 'bank-dki',
    client: 'Bank DKI',
    project: 'Audit Independen & Penetration Test',
    challenge: 'Memenuhi kepatuhan regulasi Otoritas Jasa Keuangan (OJK) dan mendeteksi kerentanan pada layanan digital banking.',
    approach: 'Offensive cybersecurity testing mencakup web application, mobile app, API pentest, serta review kontrol arsitektur server.',
    deliverables: 'Laporan Pentest Teknis, Laporan Eksekutif Kepatuhan OJK, Rencana Mitigasi (Remediation Plan).',
    impact: 'Meningkatkan ketahanan aplikasi perbankan dari fraud siber dan meloloskan audit kepatuhan OJK tanpa catatan temuan kritikal.'
  },
  {
    id: 'bssn',
    client: 'Badan Siber dan Sandi Negara (BSSN)',
    project: 'Rencana Induk Keamanan TIK SPBE',
    challenge: 'Menyusun standar instrumen kepatuhan dan peta jalan Keamanan Informasi untuk Sistem Pemerintahan Berbasis Elektronik (SPBE) nasional.',
    approach: 'Analisis gap implementasi SMKI di tingkat kementerian/lembaga pemerintah, penyusunan materi awareness, dan pembuatan instrumen ukur SPBE.',
    deliverables: 'Dokumen Rencana Induk Keamanan TIK SPBE, Instrumen Pengukuran Pemahaman SMKI.',
    impact: 'BSSN memiliki alat ukur dan roadmap terstandardisasi untuk mengevaluasi tingkat kematangan keamanan siber pemerintah daerah se-Indonesia.'
  },
  {
    id: 'bank-uob',
    client: 'Bank UOB Indonesia',
    project: 'Asesmen Risiko Siber BI & Sertifikasi ISO 27001',
    challenge: 'Mengintegrasikan manajemen risiko keamanan informasi dengan kepatuhan Surat Edaran Bank Indonesia terkait Cyber Security Risk Management.',
    approach: 'Pendampingan terpadu penyusunan mitigasi risiko TI, audit gap SMKI, dan sinkronisasi kontrol internal dengan BI Framework.',
    deliverables: 'Cyber Risk Assessment Matrix, Dokumen Penyelarasan Kepatuhan Bank Indonesia, Pendampingan Sertifikasi ISO.',
    impact: 'Bank UOB Indonesia berhasil menyelaraskan pertahanan siber internal dengan regulasi BI dan mempertahankan sertifikasi ISO 27001.'
  },
  {
    id: 'asiapay',
    client: 'AsiaPay Indonesia',
    project: 'Sertifikasi PCI DSS & Pendampingan',
    challenge: 'Melindungi lalu lintas data transaksi kartu kredit (payment gateway) dan mempertahankan sertifikasi kepatuhan PCI DSS.',
    approach: 'Penerapan kontrol jaringan perimeter, enkripsi data in-transit/at-rest, audit log manajemen, dan vulnerability assessment berkala.',
    deliverables: 'Sertifikat Kepatuhan PCI DSS, Laporan Pengujian Celah Keamanan (VAPT), Dokumen Kebijakan Transaksi Aman.',
    impact: 'AsiaPay sukses mempertahankan status kepatuhan standar transaksi kartu global, menjaga integritas bisnis payment gateway di Indonesia.'
  }
];

export default function Home() {
  const [activeClientGroup, setActiveClientGroup] = useState<keyof typeof clients>('Government');
  const [selectedFramework, setSelectedFramework] = useState<typeof frameworks[0] | null>(null);
  const [activeCaseStudyIdx, setActiveCaseStudyIdx] = useState(0);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [activeMethodologyStep, setActiveMethodologyStep] = useState(0);
  const [selectedServiceTab, setSelectedServiceTab] = useState('all');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('Settings fallback used on Home.'));
  }, []);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'cyber-blueprint': return Shield;
      case 'it-grc': return FileText;
      case 'iso-implementation': return Award;
      case 'bcm-bcp-drp': return Server;
      case 'cyber-drill': return Target;
      case 'digital-maturity': return Zap;
      case 'cyber-awareness': return BookOpen;
      case 'it-audit': return CheckCircle2;
      case 'vulnerability-assessment': return Eye;
      case 'penetration-testing': return Key;
      case 'secure-sdlc': return Lock;
      case 'red-teaming': return Target;
      case 'soc': return Shield;
      case 'cyber-threat-intelligence': return Zap;
      case 'network-endpoint-hardening': return Server;
      case 'incident-management': return AlertCircle;
      case 'digital-forensic': return FileCheck;
      default: return Shield;
    }
  };

  const activeServices = siteConfig?.services?.map((s: any) => ({
    id: s.id,
    title: s.title,
    desc: s.desc,
    badge: s.badge,
    cluster: s.cluster,
    icon: getServiceIcon(s.id)
  })) || services;

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-slate-50 cyber-grid">
        {/* Background Glowing Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] aurora-blue opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] aurora-cyan opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] aurora-gold opacity-30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-full">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  {siteConfig?.hero?.badge || 'Partner Keamanan Siber Terpercaya Sejak 2014'}
                </span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-slate-900 tracking-tight">
                {siteConfig?.hero?.title ? (
                  siteConfig.hero.title
                ) : (
                  <>
                    Secure Your Digital Future with{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500 bg-clip-text text-transparent">
                      Enterprise Cybersecurity Excellence
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl mx-auto lg:mx-0">
                {siteConfig?.hero?.subtitle || 'PT Riset Teknologi Indonesia membantu kementerian, lembaga pemerintah, BUMN, perbankan, fintech, dan perusahaan swasta membangun tata kelola TI, keamanan siber, kepatuhan regulasi, serta mitigasi insiden berbasis standar internasional.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/request-proposal"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 hover:shadow transition-all duration-200"
                >
                  <span>Mulai Konsultasi Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/online-consultation"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
                >
                  <span>Jadwalkan Konsultasi</span>
                </Link>
                <Link
                  href="/online-order"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
                >
                  <span>Order Solusi Online</span>
                </Link>
              </div>

              {/* Quick Assessments Link */}
              <div className="pt-2 text-xs text-slate-500 font-semibold flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Kepatuhan UU PDP & OJK</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Konsultan Bersertifikasi</span>
                </span>
              </div>
            </div>

            {/* Hero Right Canvas Visualization */}
            <div className="lg:col-span-6 w-full">
              <CanvasNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Counter Section */}
      <section className="bg-white border-y border-slate-200 py-10 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x md:divide-slate-100">
            <div>
              <div className="font-display font-extrabold text-3xl lg:text-4xl text-blue-600">12+ Tahun</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pengalaman Industri</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-3xl lg:text-4xl text-blue-600">65+ Proyek</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Sukses Diselesaikan</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-3xl lg:text-4xl text-blue-600">100%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Rasio Kepatuhan OJK/BI</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-3xl lg:text-4xl text-blue-600">ISO & PCI DSS</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Konsultan Penguji Ahli</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              Dipercaya oleh Institusi Terkemuka di Indonesia
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-semibold">
              RTI telah mendampingi proyek kepatuhan dan keamanan siber di berbagai sektor:
            </p>
          </div>

          {/* Group Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {(Object.keys(clients) as Array<keyof typeof clients>).map((group) => (
              <button
                key={group}
                onClick={() => setActiveClientGroup(group)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeClientGroup === group
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Client Names Grid with Hover Micro-interact */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {clients[activeClientGroup].map((clientName, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 px-4 py-6 rounded-xl flex items-center justify-center text-center text-xs font-bold text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-default select-none"
              >
                {clientName}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Layanan Komprehensif</div>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
                Solusi End-to-End Tata Kelola TI & <span className="whitespace-nowrap">Keamanan Siber</span>
              </h2>
            </div>
          </div>

          {/* Tabs for clusters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: 'all', name: 'Semua Layanan' },
              { id: 'governance', name: 'Governance & Strategy' },
              { id: 'offensive', name: 'Offensive Cybersecurity' },
              { id: 'defensive', name: 'Defensive Cybersecurity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedServiceTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-200 focus:outline-none cursor-pointer border ${
                  selectedServiceTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeServices
              .filter((svc: any) => selectedServiceTab === 'all' || svc.cluster === selectedServiceTab)
              .map((svc: any) => {
                const IconComp = svc.icon || Shield;
                return (
                  <div 
                    key={svc.id}
                    className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between h-[260px] transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          {svc.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-xs text-slate-900 mb-1.5 line-clamp-1">
                          {svc.title}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                          {svc.desc}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      <Link
                        href={`/services/${svc.id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>Pelajari Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/online-order?service=${encodeURIComponent(svc.title)}`}
                        className="text-[10px] font-bold text-slate-700 hover:text-blue-600"
                      >
                        Order
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Why Choose RTI Section */}
      <section className="py-20 bg-slate-50 cyber-grid relative">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] aurora-cyan opacity-25 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Mengapa Memilih Kami</div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Kombinasi Reputasi Sektor Publik & <span className="whitespace-nowrap">Pengalaman Industri Finansial</span>
            </h2>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Kami membawa pendekatan holistik yang berbasis regulasi nasional dan kerangka kerja terbaik dunia untuk memastikan kepatuhan yang berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900">Konsultan Bersertifikasi</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Seluruh tim ahli kami memiliki sertifikasi internasional terkemuka seperti CISSP, OSCP, CEH, CISA, COBIT, dan Auditor Utama ISO 27001.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900">Pengalaman Pemerintah</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Dipercaya oleh BSSN, Kejaksaan Agung, dan Kemenkumham untuk menyusun peta jalan dan audit keamanan siber SPBE nasional.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900">Pengalaman Perbankan & Fintech</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Memiliki rekam jejak mendampingi Bank UOB, Bank DKI, payment gateway, dan fintech memenuhi kepatuhan regulasi OJK & Bank Indonesia.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900">Vendor Independent</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Kami memberikan rekomendasi audit yang objektif tanpa berafiliasi dengan vendor hardware/software tertentu, fokus murni pada kepentingan Anda.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900">Kerangka Kerja Praktik Terbaik</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Semua deliverables konsultansi disusun mengikuti standardisasi internasional seperti NIST, CIS Controls, ISO, dan COBIT.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900">Dukungan End-to-End</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Mulai dari identifikasi celah teknis (VAPT), tata kelola kebijakan, pelatihan SDM, hingga kelulusan sertifikasi eksternal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kepatuhan Standardisasi</div>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight leading-tight">
                Integrasi Standar & <span className="whitespace-nowrap">Framework Siber Internasional</span>
              </h2>
              <p className="text-sm leading-relaxed text-slate-500">
                Seluruh metodologi asesmen dan audit kami menyelaraskan kerangka kerja keamanan siber kelas dunia agar sesuai dengan regulasi kepatuhan Indonesia.
              </p>
              <div className="text-xs font-bold text-slate-400 uppercase">
                Klik logo framework untuk penjelasan detail:
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2.5">
                {frameworks.map((fw, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFramework(fw)}
                    className="bg-slate-50 border border-slate-200/80 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 shadow-sm transition-all focus:outline-none cursor-pointer"
                  >
                    {fw.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Framework Detail Modal Overlay */}
        <AnimatePresence>
          {selectedFramework && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 relative overflow-hidden"
              >
                <button
                  onClick={() => setSelectedFramework(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-slate-900">
                    Framework: {selectedFramework.name}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 mb-6 whitespace-pre-line">
                  {selectedFramework.desc}
                </p>
                <button
                  onClick={() => setSelectedFramework(null)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Project Methodology Section */}
      <section className="py-20 bg-slate-50 cyber-grid overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Metodologi Proyek</div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Siklus Implementasi Proyek Berbasis <span className="whitespace-nowrap">Siklus Hidup PDCA</span>
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Pendekatan terstruktur dan terukur untuk memastikan kualitas implementasi tata kelola dan perlindungan siber Anda.
            </p>
          </div>

          {/* Interactive Timeline pipeline */}
          <div className="relative mb-10 pb-6 border-b border-slate-200">
            {/* Connection line background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0 hidden lg:block" />
            
            {/* Grid layout of timeline nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
              {methodology.map((m, idx) => {
                const isActive = activeMethodologyStep === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMethodologyStep(idx)}
                    className="flex flex-col items-center text-center focus:outline-none cursor-pointer group"
                  >
                    {/* Circle Node */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-extrabold text-base border-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' 
                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500'
                    }`}>
                      {m.step}
                    </div>
                    {/* Circle Label */}
                    <span className={`text-xs font-bold mt-2.5 transition-colors ${
                      isActive ? 'text-blue-600 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                    }`}>
                      {m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed methodology step card view with animations */}
          <div className="min-h-[250px]">
            <AnimatePresence mode="wait">
              {methodology.map((m, idx) => {
                if (activeMethodologyStep !== idx) return null;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
                  >
                    {/* Left Column: Number, Title, Desc */}
                    <div className="md:col-span-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-display font-extrabold text-4xl text-blue-600/20">{m.step}</span>
                        <h3 className="font-display font-extrabold text-xl text-slate-900">{m.title} Phase</h3>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                        {m.desc}
                      </p>
                      
                      <div className="border-t border-slate-100 pt-4 mt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Output</span>
                        <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5 bg-blue-50/55 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{m.output}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Key Activities List */}
                    <div className="md:col-span-6 bg-slate-50 border border-slate-100 rounded-xl p-5 sm:p-6 space-y-3.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80 pb-2">
                        Aktivitas Kunci (Key Activities)
                      </h4>
                      <ul className="space-y-3">
                        {m.activities.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start space-x-2.5 text-xs text-slate-600 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Case Studies / Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Kisah Sukses</div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Studi Kasus Proyek Enterprise & <span className="whitespace-nowrap">Sektor Publik</span>
            </h2>
          </div>

          {/* Case switcher UI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Switcher list */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {caseStudies.map((cs, idx) => (
                <button
                  key={cs.id}
                  onClick={() => setActiveCaseStudyIdx(idx)}
                  className={`p-4 rounded-xl text-left border transition-all focus:outline-none flex items-center justify-between ${
                    activeCaseStudyIdx === idx
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="text-[9px] font-bold uppercase opacity-80">{cs.project}</div>
                    <div className="font-display font-bold text-xs mt-0.5">{cs.client}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              ))}
            </div>

            {/* Case Study Details card */}
            <div className="lg:col-span-8 bg-slate-50 border border-slate-200/80 p-8 rounded-2xl relative shadow-inner overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
                {caseStudies[activeCaseStudyIdx].project}
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-6">
                Client: {caseStudies[activeCaseStudyIdx].client}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3.5">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Business Challenge</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1">{caseStudies[activeCaseStudyIdx].challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Approach & Solution</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1">{caseStudies[activeCaseStudyIdx].approach}</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Key Deliverables</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1">{caseStudies[activeCaseStudyIdx].deliverables}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Project Impact</h4>
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg mt-1 text-xs leading-relaxed text-emerald-800 font-medium">
                      {caseStudies[activeCaseStudyIdx].impact}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Testimoni Klien</div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Apa Kata Pemimpin TI <span className="whitespace-nowrap">Tentang RTI</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200/80 p-8 rounded-2xl relative shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-slate-600 mb-6">
                &quot;RTI membantu kami merancang tata kelola SMKI dan meloloskan sertifikasi ISO 27001 versi terbaru tepat waktu. Pemahaman mereka akan infrastruktur perbankan dan kepatuhan siber sangat mendalam.&quot;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-display font-bold text-xs text-slate-900">Kepala Divisi Keamanan Informasi</div>
                <div className="text-[10px] font-semibold text-slate-500">Sektor Jasa Keuangan Nasional</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-8 rounded-2xl relative shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-slate-600 mb-6">
                &quot;Hasil pengujian VAPT dari RTI sangat detail dan memberikan langkah perbaikan yang konkrit. Rekomendasinya objektif karena mereka tidak mencoba menjual lisensi software tertentu.&quot;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-display font-bold text-xs text-slate-900">Head of Technology Operations</div>
                <div className="text-[10px] font-semibold text-slate-500">Penyedia Layanan Payment Gateway (Fintech)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Pusat Informasi & Riset</div>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
                Riset Siber, Kepatuhan Regulasi & <span className="whitespace-nowrap">Update Ancaman</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow">
              <div className="p-6 space-y-3.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  REGULATION
                </span>
                <h3 className="font-display font-extrabold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                  Panduan Kepatuhan UU Pelindungan Data Pribadi (UU PDP) Indonesia
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Masa transisi berakhir dan denda administratif hingga 2% pendapatan siap menanti kelalaian pengelolaan data pribadi. Pelajari mitigasinya.
                </p>
                <div className="text-[10px] font-bold text-slate-400">1 Juli 2026</div>
              </div>
            </article>

            <article className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow">
              <div className="p-6 space-y-3.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded">
                  THREAT INTEL
                </span>
                <h3 className="font-display font-extrabold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                  Analisis Ancaman Ransomware di Sektor Perbankan Nasional
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Laporan Security Operations Center (SOC) RTI mengenai taktik pemerasan ganda (double extortion) yang menargetkan server cadangan/DRC.
                </p>
                <div className="text-[10px] font-bold text-slate-400">5 Juli 2026</div>
              </div>
            </article>

            <article className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow">
              <div className="p-6 space-y-3.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
                  TRENDS
                </span>
                <h3 className="font-display font-extrabold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                  Mengapa Sertifikasi ISO/IEC 27001:2022 Penting untuk SPBE
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Bagaimana implementasi SMKI membantu instansi kementerian dan pemerintah daerah menaikkan tingkat kematangan indeks SPBE nasional.
                </p>
                <div className="text-[10px] font-bold text-slate-400">10 Juli 2026</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Floating Chatbot Assistant */}
      <Chatbot />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      <Footer />
    </>
  );
}
