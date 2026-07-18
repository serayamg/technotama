'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  BookOpen, Shield, Award, Terminal, Compass, 
  Cpu, Zap, CheckCircle2, ChevronRight, MessageSquare,
  Users, Check, Star, ArrowRight, GraduationCap
} from 'lucide-react';

export default function AcademyPage() {
  const [siteConfig, setSiteConfig] = useState<any>(null);

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

  const levels = [
    {
      title: 'Basic Level (Fondasi & Keamanan Dasar)',
      badge: 'Pemula',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: Compass,
      iconColor: 'text-emerald-500 bg-emerald-50',
      description: 'Langkah awal yang sempurna untuk memahami dunia cybersecurity dari dasar tanpa latar belakang IT formal sekalipun.',
      syllabus: [
        'Dasar-dasar Jaringan Komputer & Protokol TCP/IP',
        'Administrasi Dasar Sistem Operasi Linux & Command Line',
        'Konsep CIA Triad, Kriptografi, & Keamanan Informasi Dasar',
        'Pengenalan OWASP Top 10 & Analisis Celah Keamanan Dasar'
      ],
      duration: '4 Minggu',
      priceStatus: 'Cocok untuk Mahasiswa & Pemula IT'
    },
    {
      title: 'Intermediate Level (Ofensif & Defensif Praktis)',
      badge: 'Menengah',
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-100',
      icon: Terminal,
      iconColor: 'text-blue-500 bg-blue-50',
      description: 'Asah keterampilan praktis Anda dalam melakukan pengujian celah keamanan serta pertahanan infrastruktur siber.',
      syllabus: [
        'Vulnerability Assessment (VA) menggunakan Nessus & Nmap',
        'Dasar-dasar Penetration Testing (Web, Network & API)',
        'Operasional SOC (Security Operations Center) & Analisis Log',
        'Incident Response & Analisis Jejak Digital (Forensik Dasar)'
      ],
      duration: '6 Minggu',
      priceStatus: 'Lulusan Direkomendasikan Uji Sertifikasi Junior'
    },
    {
      title: 'Advance Level (Spesialisasi & Kesiapan Industri)',
      badge: 'Profesional',
      badgeColor: 'bg-purple-50 text-purple-600 border-purple-100',
      icon: Cpu,
      iconColor: 'text-purple-500 bg-purple-50',
      description: 'Tingkat ahli yang berfokus pada taktik canggih, mitigasi risiko siber korporasi, serta simulasi serangan terarah.',
      syllabus: [
        'Advanced Pentesting & Evasion Tactic (Bypass WAF/AV)',
        'Malware Analysis, Reverse Engineering & Ransomware Simulation',
        'Threat Hunting & Operasional Red Team vs Blue Team (Cyber Range)',
        'Persiapan Sertifikasi Profesional (OSCP, CEH, CISSP)'
      ],
      duration: '8 Minggu',
      priceStatus: 'Siap Kerja & Direferensikan ke Partner RTI'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>RTI Cybersecurity Academy</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight max-w-3xl mx-auto">
              Cetak Karir Profesional <span className="text-blue-500">Cybersecurity</span> Siap Kerja
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Program bootcamp intensif dengan kurikulum industri, praktikum berbasis lab siber nyata, dan bimbingan mentor berpengalaman untuk mencetak ahli siber masa depan.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#kurikulum"
                className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all text-center"
              >
                Lihat Kurikulum
              </a>
            </div>
          </div>
        </section>

        {/* Kurikulum Section */}
        <section id="kurikulum" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-display font-extrabold text-2xl text-slate-900">Program Bootcamp Terstruktur</h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Tingkatan kurikulum komprehensif yang dirancang untuk membimbing Anda dari nol hingga menjadi profesional yang siap bersaing di pasar kerja global.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {levels.map((level, idx) => {
              const Icon = level.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative hover:shadow-md transition-all duration-200"
                >
                  <div className="lg:w-7/12 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${level.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${level.badgeColor}`}>
                          {level.badge}
                        </span>
                        <h3 className="font-display font-extrabold text-base text-slate-800 mt-1">{level.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {level.description}
                    </p>
                    <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 uppercase pt-2">
                      <span className="flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                        <span>Durasi: {level.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        <span>{level.priceStatus}</span>
                      </span>
                    </div>
                  </div>

                  <div className="lg:w-5/12 bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3 w-full">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b pb-1">
                      Materi Pembelajaran
                    </span>
                    <ul className="space-y-2">
                      {level.syllabus.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start space-x-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <h2 className="font-display font-extrabold text-2xl text-slate-900">Mengapa Memilih RTI Academy?</h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Metode pembelajaran intensif kami disesuaikan dengan kebutuhan praktis industri keamanan informasi modern.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center md:text-left">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center mx-auto md:mx-0 shadow-sm border border-blue-100">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-sm text-slate-800">Kurikulum Sesuai Industri</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Materi ajar diperbarui secara berkala agar sejalan dengan framework regulasi terbaru dan metodologi serangan siber terkini.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center mx-auto md:mx-0 shadow-sm border border-blue-100">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-sm text-slate-800">Cyber Range Hands-on Lab</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  70% proses pembelajaran dilakukan melalui hands-on lab simulasi untuk melatih refleks operasional di lapangan.
                </p>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center mx-auto md:mx-0 shadow-sm border border-blue-100">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-sm text-slate-800 font-semibold">Program Penyaluran Kerja</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lulusan tingkat intermediate dan advance berkesempatan disalurkan langsung sebagai staf keamanan siber ke partner & klien strategis RTI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-tr from-slate-900 to-blue-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(59,130,246,0.15),transparent_100%)]" />
            <div className="relative space-y-4">
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl">Siap Memulai Langkah Anda di Dunia Siber?</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Hubungi tim pendaftaran kami untuk berkonsultasi mengenai tingkat yang sesuai untuk Anda, biaya pendaftaran, serta jadwal angkatan (batch) terdekat.
              </p>
              <div className="pt-4 flex justify-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center space-x-2"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Hubungi Advisor Pendaftaran</span>
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
