'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  BookOpen, Shield, Award, Terminal, Compass, 
  Cpu, Zap, CheckCircle2, ChevronRight, 
  Users, Check, ArrowRight, GraduationCap,
  Target, TrendingUp, Layers, FileText, Settings,
  Briefcase, Activity, FileSpreadsheet, ShieldAlert
} from 'lucide-react';

export default function AcademyPage() {
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'methodology' | 'career'>('overview');
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setSiteConfig(data);
      })
      .catch(err => console.error(err));
  }, []);

  const getCleanWhatsAppNumber = () => {
    const rawNumber = siteConfig?.general?.whatsappNumber || '0856-6872-2734';
    const digitsOnly = rawNumber.replace(/\D/g, '');
    if (digitsOnly.startsWith('0')) {
      return '62' + digitsOnly.slice(1);
    }
    return digitsOnly;
  };

  const waLink = `https://wa.me/${getCleanWhatsAppNumber()}?text=Halo%20RTI%20Academy,%20saya%20tertarik%20untuk%20mengikuti%20Cybersecurity%20Bootcamp.%20Boleh%20minta%20informasi%20lebih%20lanjut?`;

  const targetParticipants = [
    'Fresh Graduate (Lulusan Baru)',
    'Mahasiswa Aktif (Minimal Semester 5)',
    'Profesional IT yang ingin beralih ke Cybersecurity (Career Switcher)',
    'Karyawan perusahaan yang dipersiapkan menjadi Cybersecurity Officer',
    'Aparatur Sipil Negara (ASN), BUMN, dan BUMD'
  ];

  const objectives = [
    'Memahami konsep keamanan informasi secara menyeluruh',
    'Mengoperasikan tools cybersecurity standar industri',
    'Melakukan monitoring & investigasi log SOC',
    'Melakukan Vulnerability Assessment & Pemetaan Risiko',
    'Melakukan respons cepat terhadap insiden siber (Incident Response)',
    'Membuat laporan keamanan profesional setara konsultan',
    'Memahami standar regulasi ISO 27001, NIST CSF, dan CIS Controls',
    'Siap langsung bekerja sebagai Cybersecurity Professional',
    'Siap menempuh ujian sertifikasi internasional terkemuka'
  ];

  const graduatesOutputs = [
    'SOC Analyst Level 1',
    'SOC Analyst Level 2',
    'Cybersecurity Analyst',
    'Vulnerability Assessment Engineer',
    'Junior Penetration Tester',
    'Incident Response Analyst',
    'Security Engineer',
    'GRC Analyst',
    'Threat Intelligence Analyst',
    'Security Operations Engineer',
    'Blue Team Engineer',
    'MSSP Analyst'
  ];

  const facilities = [
    'Learning Management System (LMS) modern',
    'Virtual Cyber Range (Simulasi serangan nyata)',
    'Enterprise SOC Lab dedicated',
    'Multi-cloud Lab (AWS, Azure, Alibaba)',
    'Sandbox Malware (Analisis malware aman)',
    'E-book dan Modul Digital lengkap',
    'Akses rekaman kelas selamanya',
    'Bimbingan mentor industri berpengalaman',
    'Program Career Coaching intensif',
    'Simulasi wawancara kerja (Mock Interview)',
    'Review CV Profesional & optimasi LinkedIn',
    'Job Matching dengan perusahaan partner RTI',
    'Akses komunitas alumni cybersecurity'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Banner Hero */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>RTI Cybersecurity Academy</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Versi 1.0
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Lulusan Siap Kerja (Job Ready)
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-blue-500 font-mono font-bold text-xs uppercase tracking-widest">
                "Industry Ready Cybersecurity Workforce Program"
              </p>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight max-w-4xl">
                Cybersecurity Professional Bootcamp
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Program pelatihan intensif berbasis kompetensi praktis yang dirancang khusus untuk memenuhi tingginya kebutuhan organisasi akan SDM siber handal dengan sertifikasi global.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/academy/register"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all text-center"
              >
                Konsultasi Pendaftaran (WA)
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Navigation Tabs */}
        <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-3 gap-2 scrollbar-none">
              {[
                { id: 'overview', label: 'Ringkasan & Fasilitas', icon: BookOpen },
                { id: 'curriculum', label: 'Kurikulum Tingkatan', icon: Terminal },
                { id: 'methodology', label: 'Metode & Penilaian', icon: Settings },
                { id: 'career', label: 'Jalur Karir & Kemitraan', icon: Briefcase }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tab Contents */}
        <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* TAB 1: OVERVIEW & FACILITIES */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Latar Belakang Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-extrabold text-lg text-slate-800">1. Latar Belakang Program</h2>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pertumbuhan ancaman siber dan tingginya kebutuhan tenaga Cybersecurity menyebabkan organisasi membutuhkan SDM yang tidak hanya memahami teori, tetapi juga memiliki kemampuan praktik, pengalaman menggunakan tools industri, serta memiliki sertifikasi internasional yang diakui.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  Bootcamp ini dirancang khusus untuk mempercepat penyiapan tenaga kerja siap kerja (Job Ready) melalui metode komprehensif terpadu:
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Interactive Learning', desc: 'Pemahaman konsep siber fundamental' },
                    { title: 'Hands-on Cyber Lab', desc: 'Latihan operasional tools nyata' },
                    { title: 'Real Case Study', desc: 'Analisis insiden asli industri' },
                    { title: 'Capture The Flag', desc: 'Asah insting pertahanan & eksploitasi' },
                    { title: 'Capstone Project', desc: 'Membangun infrastruktur SOC mini' },
                    { title: 'Internship Simulation', desc: 'Pengalaman kerja tim MSSP siber' },
                    { title: 'Career Coaching', desc: 'Bimbingan berkas lamaran & interview' },
                    { title: 'Global Cert Preparation', desc: 'Tryout intensif kelayakan ujian' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
                      <span className="block text-[11px] font-bold text-slate-800">{item.title}</span>
                      <span className="block text-[9px] text-slate-400 leading-tight">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target & Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sasaran Peserta */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2.5">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="font-display font-extrabold text-base text-slate-800">Sasaran & Target Peserta</h3>
                  </div>
                  <ul className="space-y-3">
                    {targetParticipants.map((p, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tujuan Pembelajaran */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2.5">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-display font-extrabold text-base text-slate-800">Tujuan Program</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                        <Check className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Target Output Lulusan */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-extrabold text-lg text-slate-800">Target Output Lulusan</h2>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Setelah menyelesaikan kurikulum bootcamp, lulusan memiliki profil kompetensi yang siap untuk menduduki posisi karir siber berikut:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {graduatesOutputs.map((out, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-xs font-bold text-slate-800">{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-extrabold text-lg text-slate-800">Fasilitas Peserta</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs text-slate-700 font-medium">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM LEVELS */}
          {activeTab === 'curriculum' && (
            <div className="space-y-8">
              {/* Level Selector Buttons */}
              <div className="flex border-b border-slate-200 mb-6 bg-white rounded-xl p-1.5 shadow-sm border justify-center max-w-md mx-auto">
                {[
                  { id: 1, label: 'Level 1: Basic' },
                  { id: 2, label: 'Level 2: Intermediate' },
                  { id: 3, label: 'Level 3: Advance' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id as any)}
                    className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg transition-all ${
                      selectedLevel === lvl.id 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              {/* LEVEL 1: BASIC DETAILS */}
              {selectedLevel === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                      LEVEL 1 – BASIC
                    </span>
                    <h3 className="font-display font-extrabold text-lg text-slate-800">Membangun Fondasi IT & Cybersecurity</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Mengajarkan konsep fundamental jaringan, operating system, scripting dasar, dan pengetahuan risiko keamanan siber umum untuk membekali career switcher maupun pemula.
                    </p>
                    
                    <div className="border-t pt-4 space-y-3 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Durasi:</span>
                        <span className="font-bold text-slate-800">8 Minggu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Total Waktu:</span>
                        <span className="font-bold text-slate-800">±120 Jam Belajar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Fokus Praktik:</span>
                        <span className="font-bold text-slate-800">Local Lab Setup</span>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                      <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                        Project Utama Level 1:
                      </span>
                      <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                        Membangun Secure Home Lab (Virtualisasi jaringan aman, setup Kali Linux & logging firewall dasar).
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">
                        Modul Kurikulum
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {[
                          'Fundamental IT & Komputasi',
                          'Operating System (Windows & Linux)',
                          'Computer Network & Model OSI',
                          'Protokol TCP/IP (Analisis Trafik)',
                          'Virtualization & Sandbox Environment',
                          'Cloud Computing Fundamental',
                          'Introduction to Cybersecurity',
                          'Cyber Threat Landscape',
                          'Malware & Social Engineering',
                          'Password Security & Cryptography Basic',
                          'Firewall & Identity Access Management (IAM)',
                          'Security Awareness & Standard Security',
                          'Python Basic for Security Scripting',
                          'Bash Scripting & Git Fundamental'
                        ].map((m, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">
                        Praktikum Lab Mandiri
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          'Install & Config Linux',
                          'VirtualBox Management',
                          'Kali Linux Operation',
                          'Wireshark Packet Analysis',
                          'Nmap Network Scanning',
                          'Basic Firewall Setup',
                          'Windows Hardening'
                        ].map((p, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                            <span className="block text-[11px] font-bold text-slate-700">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LEVEL 2: INTERMEDIATE DETAILS */}
              {selectedLevel === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                        LEVEL 2 – INTERMEDIATE
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-800">Implementasi Operasional Cybersecurity</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Mempelajari tata kelola, pemantauan log SOC, kerentanan sistem, hardening jaringan, cloud security, hingga tindakan respons insiden siber aktif secara komprehensif.
                      </p>
                      
                      <div className="border-t pt-4 space-y-3 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400 uppercase text-[10px]">Durasi:</span>
                          <span className="font-bold text-slate-800">10 Minggu</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400 uppercase text-[10px]">Total Waktu:</span>
                          <span className="font-bold text-slate-800">±180 Jam Belajar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400 uppercase text-[10px]">Fokus Praktik:</span>
                          <span className="font-bold text-slate-800">SOC & Threat Intel Lab</span>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                        <span className="block text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                          Capstone Project Level 2:
                        </span>
                        <p className="text-xs text-blue-700 leading-relaxed font-semibold">
                          Membangun mini Security Operation Center (SOC) menggunakan sistem SIEM terintegrasi dan monitoring agent real-time.
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                        Pembagian Modul & Topik
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Blue Team & Monitoring */}
                        <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <span className="text-xs font-extrabold text-blue-600 flex items-center space-x-1.5">
                            <Shield className="w-4 h-4 animate-pulse" />
                            <span>Blue Team & SOC Monitoring</span>
                          </span>
                          <ul className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
                            <li>• **Security Operation Center (SOC)**</li>
                            <li>• **SIEM**: FortiSIEM, MS Sentinel, Splunk, Wazuh</li>
                            <li>• **Monitoring**: Log Analysis, Threat Hunting, IOC</li>
                            <li>• **Framework**: MITRE ATT&CK & Sigma Rule</li>
                          </ul>
                        </div>

                        {/* Network & Endpoint */}
                        <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <span className="text-xs font-extrabold text-blue-600 flex items-center space-x-1.5">
                            <Settings className="w-4 h-4" />
                            <span>Network & Endpoint Security</span>
                          </span>
                          <ul className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
                            <li>• **Network**: Firewall, IDS, IPS, VPN, Proxy</li>
                            <li>• **Endpoint**: Antivirus, EDR, XDR</li>
                            <li>• **Vulnerability Assessment (VA)**: Nessus, OpenVAS</li>
                            <li>• **Scanning Tools**: Nmap, Nikto</li>
                          </ul>
                        </div>

                        {/* VA & Incident Response */}
                        <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <span className="text-xs font-extrabold text-blue-600 flex items-center space-x-1.5">
                            <Terminal className="w-4 h-4" />
                            <span>Incident Response & Forensics</span>
                          </span>
                          <ul className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
                            <li>• **DFIR**: Digital Forensics Basic</li>
                            <li>• **Analysis**: Memory Analysis, Timeline Analysis</li>
                            <li>• **Cloud Security**: AWS, Azure, Alibaba Cloud</li>
                          </ul>
                        </div>

                        {/* Cloud & GRC */}
                        <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <span className="text-xs font-extrabold text-blue-600 flex items-center space-x-1.5">
                            <Layers className="w-4 h-4" />
                            <span>Identity, GRC & DevSecOps</span>
                          </span>
                          <ul className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
                            <li>• **Identity**: Active Directory, IAM, MFA, PAM</li>
                            <li>• **GRC**: ISO 27001, NIST CSF, CIS Controls</li>
                            <li>• **Management**: Risk Assessment, Asset Management</li>
                            <li>• **Application**: Secure Coding, DevSecOps Intro</li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                          Praktikum Lab Tingkat Level 2:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['SOC Lab Simulation', 'Incident Simulation', 'Threat Hunting Lab', 'Vulnerability Assessment Lab', 'Firewall Configuration', 'EDR Forensic Investigation'].map((p, idx) => (
                            <span key={idx} className="px-2.5 py-1.5 rounded bg-slate-100 border text-[10px] font-semibold text-slate-700 text-center">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications Box */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 lg:p-8 space-y-6 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 opacity-30 blur-2xl pointer-events-none" />
                    
                    <div className="space-y-2 relative">
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-blue-500 text-white uppercase">
                        Program Persiapan Ujian
                      </span>
                      <h4 className="font-display font-extrabold text-base">Opsi Sertifikasi Internasional (Pasca Lulus Level 2)</h4>
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                        Setelah menuntaskan level Intermediate, peserta berhak mengikuti kelas bimbingan sertifikasi internasional untuk memperkuat berkas portfolio rekrutmen:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative text-xs">
                      <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <span className="block font-bold text-blue-400">Jalur Fondasi</span>
                        <span className="block text-[10px] text-slate-300">• CompTIA Security+<br />• Cisco CyberOps Associate</span>
                      </div>
                      <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <span className="block font-bold text-blue-400">Jalur Blue Team</span>
                        <span className="block text-[10px] text-slate-300">• CompTIA CySA+<br />• EC-Council CSA<br />• Microsoft SC-200</span>
                      </div>
                      <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <span className="block font-bold text-blue-400">Jalur Red Team</span>
                        <span className="block text-[10px] text-slate-300">• CompTIA PenTest+<br />• EC-Council CEH</span>
                      </div>
                      <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <span className="block font-bold text-blue-400">Jalur Vendor Security</span>
                        <span className="block text-[10px] text-slate-300">• Fortinet FCA / FCP<br />• Microsoft AZ-500<br />• Splunk Core User<br />• GIAC (Jalur Lanjutan)</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-400">
                      <span>• Bootcamp Review & Refresh</span>
                      <span>• Try Out / Simulasi Ujian</span>
                      <span>• Pembahasan Bank Soal</span>
                      <span>• Exam Coaching & Tips</span>
                      <span className="text-slate-300">• Voucher Ujian Resmi (Opsional sesuai Paket)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* LEVEL 3: ADVANCE DETAILS */}
              {selectedLevel === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-50 text-purple-600 border border-purple-100 uppercase">
                      LEVEL 3 – ADVANCE
                    </span>
                    <h3 className="font-display font-extrabold text-lg text-slate-800">Menyiapkan Cybersecurity Professional</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Membentuk keahlian spesialis siber tingkat tinggi dengan memilih fokus peminatan sesuai kebutuhan mutakhir operasional industri.
                    </p>
                    
                    <div className="border-t pt-4 space-y-3 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Durasi:</span>
                        <span className="font-bold text-slate-800">12 Minggu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Total Waktu:</span>
                        <span className="font-bold text-slate-800">±220 Jam Belajar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Spesialisasi:</span>
                        <span className="font-bold text-slate-800">Pilih 1 Jalur Utama</span>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2">
                      <span className="block text-[10px] font-bold text-purple-800 uppercase tracking-widest">
                        Real Enterprise Case & Project:
                      </span>
                      <p className="text-xs text-purple-700 leading-relaxed font-semibold">
                        Peserta wajib menyelesaikan Real Enterprise Case Study & Final Project yang dipresentasikan langsung di depan panel Asesor dari akademisi dan praktisi.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                      Pilihan Jalur Peminatan Spesialis
                    </h4>

                    <div className="space-y-4">
                      {/* SOC & Detection Engineering */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">A. SOC & Detection Engineering</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Fokus pada implementasi advanced, otomasi siber, dan rekayasa deteksi: Advanced SIEM, SOAR, Threat Intelligence, Purple Team, Detection Engineering, dan Security Automation.
                        </p>
                      </div>

                      {/* Offensive Security */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">B. Offensive Security (Red Teaming)</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Fokus pada eksploitasi sistem siber tingkat tinggi: Penetration Testing, Active Directory Attack, Web & API Security, Wireless Security, dan simulasi Red Team.
                        </p>
                      </div>

                      {/* DFIR */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">C. DFIR (Digital Forensics & Incident Response)</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Fokus pada penanganan insiden siber pasca serangan: Incident Handling, Malware Analysis, Reverse Engineering, Memory Forensics, dan Disk Forensics.
                        </p>
                      </div>

                      {/* Cloud Security */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">D. Cloud & Container Security</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Fokus pada keamanan cloud terdistribusi dan containerization: AWS Security, Azure Security, Alibaba Cloud, Kubernetes Security, Docker Security, dan Container Security.
                        </p>
                      </div>

                      {/* Governance Risk Compliance */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">E. Governance, Risk & Compliance (GRC)</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Fokus pada audit kepatuhan, manajemen risiko siber, hukum PDP, dan kelangsungan bisnis: ISO 27001 Lead Implementer, Risk Management, Audit, Compliance, Privacy, UU PDP, dan Business Continuity Management.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: METHODOLOGY & ASSESSMENTS */}
          {activeTab === 'methodology' && (
            <div className="space-y-12">
              
              {/* Komposisi & Metode */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Komposisi Pembelajaran */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-base text-slate-800">Komposisi Pembelajaran</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kurikulum dirancang berimbang dengan porsi praktikum siber yang sangat mendominasi demi membentuk insting refleks keamanan.
                    </p>
                  </div>
                  
                  <div className="space-y-3.5">
                    {[
                      { label: 'Hands-on Lab (Praktik Lab Siber)', percent: 60, color: 'bg-blue-600' },
                      { label: 'Teori & Konsep Fundamental', percent: 20, color: 'bg-emerald-500' },
                      { label: 'Studi Kasus Asli Industri', percent: 10, color: 'bg-purple-500' },
                      { label: 'Capstone Project Terintegrasi', percent: 10, color: 'bg-amber-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="text-slate-800">{item.percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t text-[10px] text-slate-400 uppercase font-bold text-center">
                    Kombinasi 80% Aspek Praktik & Proyek Mandiri
                  </div>
                </div>

                {/* Metode Pelatihan */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <h3 className="font-display font-extrabold text-base text-slate-800">Metode Pembelajaran</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Instructor Led Training', desc: 'Kelas interaktif live dibimbing instruktur siber senior.' },
                      { title: 'Hands-on Lab', desc: 'Akses cyber range virtual lab untuk menyelesaikan tantangan praktis.' },
                      { title: 'Challenge Based Learning', desc: 'Pemecahan masalah siber berbasis case-by-case.' },
                      { title: 'Capture The Flag (CTF)', desc: 'Kompetisi peretasan internal secara berkala untuk melatih insting.' },
                      { title: 'Team Project', desc: 'Kerja kelompok menyelesaikan simulasi infrastruktur pertahanan siber.' },
                      { title: 'Mentoring & Coaching', desc: 'Bimbingan tatap muka, konsultasi materi, dan arah karir.' },
                      { title: 'Career Development', desc: 'CV review, optimasi LinkedIn, simulasi wawancara, dan rekomendasi kerja.' }
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <span className="block text-xs font-bold text-slate-800">{m.title}</span>
                        <span className="block text-[11px] text-slate-500 leading-normal">{m.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assessment Awal (Placement Test) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-slate-800">Placement Test (Assessment Awal)</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Seluruh peserta diwajibkan mengisi **Cybersecurity Competency Assessment Form** sebelum memulai program. Asesmen ini bertujuan mengukur penguasaan awal serta menentukan level masuk yang sesuai agar program pembelajaran berjalan optimal.
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Komponen Penilaian:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs text-slate-600">
                    <div>• Data pribadi & latar belakang</div>
                    <div>• Pengalaman kerja IT / non-IT</div>
                    <div>• Pengalaman siber dasar</div>
                    <div>• Penguasaan sistem operasi</div>
                    <div>• Pengetahuan jaringan komputer</div>
                    <div>• Konsep keamanan informasi</div>
                    <div>• Kemampuan scripting / coding</div>
                    <div>• Pengalaman tools keamanan</div>
                    <div>• Kepemilikan sertifikat IT</div>
                    <div>• Tes pilihan ganda awal</div>
                    <div>• Tes studi kasus teoritis</div>
                    <div className="col-span-2 font-semibold text-blue-600">• Tes wawancara teknis (opsional)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider">Kategori Hasil Assessment</span>
                    <span className="block text-xs text-slate-300">Penetapan kelas masuk didasarkan pada total skor penilaian:</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold">Level Basic</span>
                    <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold">Level Intermediate</span>
                    <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-bold">Level Advance</span>
                  </div>
                </div>
              </div>

              {/* Evaluasi Kelulusan & Sertifikat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Evaluasi Kelulusan */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                    <h3 className="font-display font-extrabold text-base text-slate-800">Evaluasi Kelulusan</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">
                    Peserta dinyatakan lulus bootcamp apabila berhasil memenuhi seluruh kriteria kelulusan berikut:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Kehadiran kelas (live session) minimal 80%',
                      'Nilai evaluasi teori (kuis & ujian tulis) minimal 70',
                      'Nilai praktikum (hands-on lab challenges) minimal 75',
                      'Lulus presentasi Capstone Project akhir',
                      'Lulus penilaian simulasi studi kasus industri',
                      'Menyelesaikan penyusunan portofolio siber individu'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sertifikat Diterima */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h3 className="font-display font-extrabold text-base text-slate-800">Sertifikat yang Diterima</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">
                    Setiap alumni yang menyelesaikan program dibekali bundel verifikasi kompetensi siber formal:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Certificate of Completion (Sertifikat kelulusan formal)',
                      'Competency Transcript (Detail transkrip nilai keahlian lab)',
                      'Digital Badge (Verifikasi kredensial digital LinkedIn)',
                      'Portfolio Assessment (Lembar peninjauan portofolio siber)',
                      'Recommendation Letter (Surat rekomendasi kerja khusus bagi peserta berprestasi)',
                      'International Certification Preparation Certificate (Sertifikat kelas persiapan)'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAREER & PARTNERSHIP */}
          {activeTab === 'career' && (
            <div className="space-y-12">
              
              {/* Kerja Sama Skema */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-slate-800">Skema Kemitraan & Kerja Sama</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Program RTI Cybersecurity Bootcamp dapat diadaptasikan ke berbagai model kerja sama korporasi maupun instansi pendidikan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: '1. Corporate Class', desc: 'Pelatihan khusus privat terintegrasi untuk melatih karyawan / divisi IT internal perusahaan.' },
                    { title: '2. Public Bootcamp', desc: 'Kelas publik reguler terbuka bagi mahasiswa umum, profesional IT, maupun individu mandiri.' },
                    { title: '3. University Partnership', desc: 'Kerja sama perguruan tinggi untuk program magang siber, skema SKS, atau materi kurikulum terapan.' },
                    { title: '4. Fresh Graduate Program', desc: 'Program akselerasi penyerapan kerja intensif bagi lulusan baru siber untuk siap diterjunkan langsung.' },
                    { title: '5. Government & BUMN Academy', desc: 'Pelatihan siber pemenuhan standar regulasi bagi staf instansi pemerintah, BUMN, dan BUMD.' },
                    { title: '6. Reskilling & Upskilling IT', desc: 'Program pelatihan alih peran staf IT internal (sysadmin, developer) ke posisi tim cybersecurity.' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <span className="block text-xs font-bold text-slate-800">{item.title}</span>
                      <span className="block text-[11px] text-slate-500 leading-relaxed">{item.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <strong className="text-blue-950 font-bold block mb-1">Penyaluran Talent Pooling Partner:</strong>
                  Perusahaan mitra dapat mengirimkan karyawannya untuk peningkatan kompetensi terstruktur. Di sisi lain, lulusan terbaik dari kelas publik akan direkomendasikan langsung ke perusahaan mitra melalui program penempatan kerja (talent pooling).
                </div>
              </div>

              {/* Career Roadmap Timeline */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-slate-800">Roadmap Karier Lulusan</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Kurikulum RTI didesain secara bertahap agar alumni siap meniti tangga karir profesional siber secara matang:
                </p>

                <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-8">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Tahap 1: Fondasi</span>
                      <h4 className="text-xs font-bold text-slate-800">Lulusan Level 1 Basic → Junior IT Security / SOC Analyst L1</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Menguasai dasar sistem operasi Linux/Windows, troubleshooting jaringan komputer, serta pembacaan log dasar firewall.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Tahap 2: Operasional</span>
                      <h4 className="text-xs font-bold text-slate-800">Lulusan Level 2 Intermediate → SOC Analyst L2 / Cybersecurity Analyst / Vulnerability Assessment Engineer</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Menguasai log hunting, pemetaan kerangka MITRE ATT&CK, deployment SIEM/EDR, mitigasi kerentanan sistem, serta sertifikasi global pendukung (Security+, CEH, CSA).
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Tahap 3: Ahli (Spesialisasi)</span>
                      <h4 className="text-xs font-bold text-slate-800">Lulusan Level 3 Advance → Senior SOC / Security Engineer / Threat Hunter / DFIR Analyst / Penetration Tester / Security Consultant / GRC Consultant</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Memimpin respon insiden siber, malware analysis, pentesting web/API enterprise, audit ISO 27001, tata kelola GRC, serta penyusunan kelangsungan bisnis siber (BCM).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border rounded-xl text-xs text-slate-600 leading-relaxed">
                  Lulusan diarahkan untuk membangun portofolio solid dan disiapkan memasuki dunia kerja di sektor perbankan, instansi pemerintah, BUMN, telekomunikasi, energi, manufaktur, maupun penyedia Managed Security Service Provider (MSSP).
                </div>
              </div>
            </div>
          )}

        </section>

        {/* CTA Banner Section */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-tr from-slate-900 to-blue-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(59,130,246,0.15),transparent_100%)]" />
            <div className="relative space-y-4">
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl">Siap Menjadi Tenaga Kerja Siber Unggulan?</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Tentukan jalur karir siber Anda hari ini. Ambil Assessment awal gratis untuk memetakan individual learning plan Anda di RTI Academy.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/academy/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center space-x-2"
                >
                  <GraduationCap className="w-4.5 h-4.5" />
                  <span>Daftar Sekarang</span>
                </Link>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
                >
                  <span>Hubungi Advisor</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
      <WhatsAppButton />
    </div>
  );
}
