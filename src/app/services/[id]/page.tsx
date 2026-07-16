'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Key, Award, FileText, Shield, CheckCircle2, Layout, Users, 
  ArrowLeft, Calendar, FileCheck, HelpCircle, Check, Play, Clock, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Complete detail profiles of the 7 core services based on profile
const servicesDetails: Record<string, {
  title: string;
  icon: any;
  overview: string;
  benefits: string[];
  methodology: string[];
  deliverables: string[];
  timeline: string;
  faq: { q: string; a: string }[];
}> = {
  vapt: {
    title: 'VA & Penetration Testing',
    icon: Key,
    overview: 'Layanan Cybersecurity Offense (VAPT) kami dirancang untuk menguji ketahanan infrastruktur digital, aplikasi web, mobile app, dan API dengan mensimulasikan serangan nyata di dunia nyata. Layanan ini memastikan kepatuhan penuh terhadap Surat Edaran Bank Indonesia dan Peraturan Otoritas Jasa Keuangan (POJK).',
    benefits: [
      'Mendeteksi dan memetakan kerentanan (vulnerabilities) sebelum disalahgunakan oleh pihak ketiga.',
      'Memenuhi syarat audit kepatuhan regulasi OJK (POJK APU-PPT) dan Bank Indonesia terkait sistem pembayaran.',
      'Melindungi reputasi merek dan mencegah kerugian finansial akibat kebocoran data.',
      'Mendapatkan panduan mitigasi celah teknis (remediation plan) yang sistematis.'
    ],
    methodology: [
      'Information Gathering & Reconnaissance - Pemetaan footprint sistem target.',
      'Vulnerability Assessment - Scanning otomatis mendeteksi celah keamanan standar.',
      'Exploitation & Penetration Testing - Upaya penetrasi manual (ethical hacking) untuk mengukur dampak.',
      'Reporting & Remediation Guidance - Penyusunan laporan temuan dan rapat penjelasan teknis.',
      'Re-testing (Validation) - Pengujian ulang gratis setelah pihak klien melakukan perbaikan.'
    ],
    deliverables: [
      'Executive Summary Report (Laporan Kepatuhan Manajemen / Non-Teknis).',
      'Technical Vulnerability Assessment & Pentest Report (Laporan Detail Celah Keamanan).',
      'Remediation Plan & Validation Report (Rencana Perbaikan & Hasil Tes Ulang).'
    ],
    timeline: '2 - 3 Minggu',
    faq: [
      { q: 'Berapa sering VAPT harus dilakukan?', a: 'Sesuai regulasi OJK dan praktik terbaik, VAPT minimal dilakukan 1 kali setahun, atau setiap kali ada perubahan arsitektur aplikasi mayor.' },
      { q: 'Apakah pengujian pentest dapat mengganggu operasional sistem?', a: 'RTI melakukan pengujian di lingkungan pementasan (staging/development). Jika terpaksa di production, kami menjadwalkannya di luar jam sibuk (window maintenance) dengan pengawasan ketat.' }
    ]
  },
  standards: {
    title: 'Standard Implementation (ISO)',
    icon: Award,
    overview: 'Pendampingan konsultansi dan sertifikasi standar manajemen kualitas internasional. Kami membantu organisasi Anda merancang, mengimplementasikan, dan mengaudit Sistem Manajemen Keamanan Informasi (ISO/IEC 27001), Manajemen Layanan TI (ISO 20000), serta Sistem Manajemen Kelangsungan Bisnis / DRC (ISO 22301).',
    benefits: [
      'Meningkatkan brand trust dan authority organisasi sebagai penyedia layanan berstandar internasional.',
      'Memenuhi regulasi pemerintah (Kominfo/BSSN) tentang kewajiban SMKI SPBE bagi penyelenggara sistem elektronik.',
      'Menyusun proses operasional TI yang terdokumentasi dengan baik, mengurangi kegagalan operasional.',
      'Meminimalkan waktu henti (downtime) bisnis melalui manajemen pemulihan bencana (DRC).'
    ],
    methodology: [
      'Gap Analysis & Assessment - Memetakan kondisi operasional saat ini terhadap standar ISO target.',
      'Awareness Training - Pelatihan pentingnya ISO untuk staf dan manajemen puncak.',
      'Document Design & Development - Penyusunan Kebijakan Keamanan, SOP, dan Dokumen Kontrol Kontribusi.',
      'Internal Audit & Management Review - Simulasi audit mandiri sebelum kedatangan auditor eksternal.',
      'Certification Audit Support - Pendampingan penuh saat audit Stage 1 & Stage 2 oleh Lembaga Sertifikasi.'
    ],
    deliverables: [
      'Dokumen Kebijakan & SOP Manajemen Layanan/Keamanan Informasi.',
      'Laporan Hasil Gap Analysis & Internal Audit Report.',
      'Sertifikat ISO Resmi dari Lembaga Sertifikasi Terakreditasi.'
    ],
    timeline: '3 - 6 Bulan',
    faq: [
      { q: 'Apakah sertifikat ISO berlaku selamanya?', a: 'Sertifikat ISO berlaku selama 3 tahun. Namun, organisasi wajib melakukan Audit Surveillance tahunan di tahun ke-1 dan ke-2 untuk memastikan kepatuhan yang berkelanjutan.' },
      { q: 'Apa perbedaan ISO 27001 versi 2013 dengan 2022?', a: 'Versi 2022 melakukan simplifikasi struktur kontrol keamanan (dari 14 klausul menjadi 4 tema utama) serta menambahkan kontrol baru seperti threat intelligence dan keamanan komputasi awan.' }
    ]
  },
  'it-governance': {
    title: 'IT Governance, Risk & Compliance',
    icon: FileText,
    overview: 'Asesmen tata kelola teknologi informasi berbasis framework COBIT 2019 dan SPBE. Layanan ini membantu auditor internal, manajemen puncak, dan tim teknis menyelaraskan inisiatif investasi TI dengan tujuan strategi bisnis perusahaan serta memitigasi risiko hukum operasional.',
    benefits: [
      'Menjembatani kesenjangan antara kebijakan bisnis, regulasi tata kelola, dan implementasi teknis.',
      'Meningkatkan nilai indeks kematangan SPBE (Sistem Pemerintahan Berbasis Elektronik) bagi kementerian/daerah.',
      'Mengurangi tumpang tindih anggaran TI dan meningkatkan efisiensi pembelanjaan infrastruktur.',
      'Membangun budaya kesadaran risiko siber di tingkat pimpinan direksi.'
    ],
    methodology: [
      'Identify Business Goals & IT Alignment - Pemetaan sasaran korporasi.',
      'Maturity Assessment - Pengukuran tingkat kematangan tata kelola TI as-is berbasis COBIT.',
      'Gap & Target Definition - Penetapan level target kematangan.',
      'Governance SOP Formulation - Pembuatan kebijakan kontrol tata kelola TI.',
      'Roadmap Implementation - Penetapan peta jalan perbaikan.'
    ],
    deliverables: [
      'Dokumen Asesmen Kematangan Tata Kelola TI (Maturity Assessment Report).',
      'Kebijakan & SOP Tata Kelola TI Baru.',
      'Peta Jalan (Roadmap) Peningkatan Kapabilitas Tata Kelola.'
    ],
    timeline: '2 - 3 Bulan',
    faq: [
      { q: 'Mengapa menggunakan COBIT 2019?', a: 'COBIT 2019 adalah standar global paling diterima untuk tata kelola I&T enterprise karena memberikan pedoman berorientasi bisnis yang dapat diadaptasikan sesuai ukuran organisasi.' }
    ]
  },
  'cyber-strategy': {
    title: 'Cybersecurity Strategy',
    icon: Shield,
    overview: 'Penyusunan Rencana Induk Keamanan Informasi (Cyber Security Blueprint & Roadmap). Layanan ini dirancang untuk memetakan arah investasi dan implementasi pertahanan siber organisasi Anda secara jangka panjang, selaras dengan arsitektur TOGAF / IT Master Plan.',
    benefits: [
      'Membangun cetak biru perlindungan siber jangka panjang (3 - 5 tahun).',
      'Menyelaraskan belanja keamanan siber dengan proses pertumbuhan bisnis perusahaan.',
      'Meningkatkan kesiapan penanganan insiden di seluruh unit organisasi.',
      'Mengadopsi pendekatan Zero Trust dan Secure by Design secara holistik.'
    ],
    methodology: [
      'Business & Threat Profile Mapping - Analisis profil ancaman khusus industri.',
      'Architecture Evaluation - Review arsitektur pertahanan saat ini berbasis SABSA/NIST.',
      'Target Blueprinting - Desain arsitektur to-be yang aman.',
      'Security Strategy Formulation - Formulasi inisiatif dan program keamanan.',
      'Roadmap & Capital Planning - Penyusunan anggaran dan prioritas eksekusi.'
    ],
    deliverables: [
      'Buku Cetak Biru Keamanan Siber (Cyber Security Blueprint).',
      'Peta Jalan Implementasi Program Keamanan Siber (Security Roadmap).',
      'Rencana Anggaran & Belanja Keamanan (Cyber CAPEX/OPEX Plan).'
    ],
    timeline: '3 Bulan',
    faq: [
      { q: 'Mengapa blueprint siber harus terpisah dari ITMP?', a: 'Keamanan siber bukan sekadar sub-divisi TI, melainkan manajemen risiko tata kelola. Blueprint siber yang mandiri memastikan pengawasan independen terhadap operasional TI.' }
    ]
  },
  'cyber-compliance': {
    title: 'Cybersecurity Compliance Review',
    icon: CheckCircle2,
    overview: 'Layanan audit kesenjangan kepatuhan terhadap peraturan perundang-undangan nasional, seperti UU Pelindungan Data Pribadi (UU PDP No. 27/2022), regulasi OJK (POJK APU-PPT), dan regulasi Bank Indonesia terkait sistem pembayaran digital.',
    benefits: [
      'Mencegah risiko denda administratif UU PDP hingga 2% dari total pendapatan tahunan.',
      'Membantu penyiapan pejabat DPO (Data Protection Officer) dan dokumen DPIA (Data Protection Impact Assessment).',
      'Memastikan seluruh sistem pembayaran e-channel memenuhi standar audit wajib Bank Indonesia.',
      'Memberikan ketenangan hukum bagi jajaran direksi dari gugatan kebocoran data pribadi.'
    ],
    methodology: [
      'Scope Definition - Pemetaan sistem penampung data pribadi / transaksi keuangan.',
      'Compliance Checklist Audit - Pengujian kepatuhan terhadap klausul UU PDP/Regulasi BI.',
      'Data Flow Analysis - Pemetaan aliran data masuk, proses, simpan, dan hapus.',
      'Policy Review & Advisory - Asesmen kebijakan privasi dan hak subjek data.',
      'Remediation Roadmap - Rekomendasi teknis penutupan celah kepatuhan.'
    ],
    deliverables: [
      'Laporan Audit Kepatuhan UU PDP (PDP Gap Assessment Report).',
      'Rancangan Kebijakan Privasi (Privacy Policy) & Dokumen DPIA.',
      'Daftar Perbaikan Kepatuhan Teknis (Compliance Remediation Checklist).'
    ],
    timeline: '1 - 2 Bulan',
    faq: [
      { q: 'Kapan sanksi UU PDP berlaku penuh?', a: 'Masa transisi UU PDP telah berakhir, artinya sanksi denda administratif, penghentian operasional, hingga tuntutan pidana terhadap korporasi yang lalai melindungi data pribadi sudah berlaku penuh sekarang.' }
    ]
  },
  'tech-strategy': {
    title: 'Technology Strategy',
    icon: Layout,
    overview: 'Penyusunan Cetak Biru Teknologi (IT Master Plan / ITMP) dan perancangan infrastruktur kapasitas. Kami mendampingi perancangan server core banking, pemulihan bencana (DRC), migrasi cloud, serta strategi transformasi digital yang hemat biaya dan andal.',
    benefits: [
      'Mencegah salah investasi pembelian kapasitas server dan infrastruktur TI.',
      'Memiliki rancangan topologi DRC (Disaster Recovery Center) yang tangguh dan teruji.',
      'Menyusun rencana pengembangan TI jangka panjang yang modular dan fleksibel.',
      'Mempercepat migrasi dari sistem legacy ke teknologi web modern/cloud.'
    ],
    methodology: [
      'Enterprise Analysis - Analisis kebutuhan proses bisnis organisasi.',
      'Application & Data Architecture Design - Perancangan struktur aplikasi.',
      'Infrastructure & Capacity Planning - Perhitungan spesifikasi server/cloud.',
      'Disaster Recovery Architecture - Perancangan redundansi DRC.',
      'IT Master Plan Formulation - Penyusunan dokumen final ITMP.'
    ],
    deliverables: [
      'Buku IT Master Plan (ITMP).',
      'Desain Arsitektur Infrastruktur & Kapasitas Server.',
      'Dokumen SOP Disaster Recovery & Business Continuity (DRC/BCP).'
    ],
    timeline: '3 Bulan',
    faq: [
      { q: 'Apakah RTI merekomendasikan merk hardware tertentu?', a: 'Tidak. RTI bersifat Vendor Independent. Kami memberikan rekomendasi kapasitas dan spesifikasi teknis objektif, bukan merekomendasikan merk produk tertentu.' }
    ]
  },
  training: {
    title: 'CyberTroops Academy',
    icon: Users,
    overview: 'Bootcamp intensif penyiapan talenta keamanan siber bersertifikasi. Kami menyelenggarakan pelatihan bagi tim internal organisasi maupun B2C untuk spesialisasi Ofensif (Red Team/Pentester) dan Defensif (Blue Team/SOC Analyst), dengan kurikulum selaras Peta Okupasi Keamanan Siber BSSN.',
    benefits: [
      'Mengatasi kelangkaan talenta keamanan siber internal organisasi Anda.',
      'Kurikulum praktek langsung di lab range, bukan sekadar teori kelas.',
      'Instruktur ahli yang merupakan praktisi pentester aktif bersertifikasi OSCP/CEH/CISA.',
      'Staf dibekali pemahaman mendalam insiden penanganan siber.'
    ],
    methodology: [
      'Curriculum Alignment - Penyelarasan materi sesuai okupasi BSSN.',
      'Hands-on Lab Practice - Latihan penyerangan & bertahan di Cyber Range simulator.',
      'Security Awareness Campaigns - Edukasi kepedulian keamanan untuk staf umum.',
      'Certification Assessment - Ujian kelayakan kompetensi siber.',
      'Talent Deployment - Penyaluran talenta handal langsung bekerja.'
    ],
    deliverables: [
      'Silabus & Modul Pelatihan Keamanan Siber (Red/Blue Team).',
      'Sertifikat Kompetensi Pelatihan Akademi RTI.',
      'Laporan Hasil Evaluasi Kompetensi Staf Peserta.'
    ],
    timeline: '1 - 2 Bulan (Tergantung Modul)',
    faq: [
      { q: 'Siapa saja yang bisa mengikuti pelatihan ini?', a: 'Mulai dari fresh graduate yang ingin berkarir di bidang siber, administrator sistem yang ingin meningkatkan keahlian, hingga tim keamanan internal korporasi.' }
    ]
  }
};

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  const service = servicesDetails[serviceId];

  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'deliverables' | 'faq'>('overview');

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto py-32 text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="font-display font-extrabold text-xl text-slate-800">Layanan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">Layanan yang Anda cari tidak terdaftar atau telah dipindahkan.</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl">
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComp = service.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Service Title Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                <div className="inline-flex p-3.5 bg-blue-50 text-blue-600 rounded-xl mb-4">
                  <IconComp className="w-8 h-8" />
                </div>
                <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight leading-tight">
                  {service.title}
                </h1>
                <div className="mt-4 flex items-center space-x-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Estimasi Proyek: <strong>{service.timeline}</strong></span>
                </div>
                
                {/* CTAs */}
                <div className="mt-8 space-y-3">
                  <Link
                    href={`/online-order?service=${encodeURIComponent(service.title)}`}
                    className="w-full text-center block py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Pesan Layanan Online
                  </Link>
                  <Link
                    href="/request-proposal"
                    className="w-full text-center block py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Minta Proposal Tender (RFP)
                  </Link>
                </div>
              </div>

              {/* Safety watermarks */}
              <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl space-y-3.5 shadow">
                <div className="flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Secure by Design</span>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-400">
                  PT Riset Teknologi Indonesia mengimplementasikan prinsip kerahasiaan data penuh (NDA) di setiap penugasan. Seluruh data asesmen disimpan terenkripsi dengan kontrol akses berlapis.
                </p>
              </div>
            </div>

            {/* Right Column: Content tabs & details */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              {/* Tabs nav */}
              <div className="flex border-b border-slate-200 bg-slate-50/50">
                {(['overview', 'methodology', 'deliverables', 'faq'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-center text-xs font-bold border-b-2 uppercase tracking-wider focus:outline-none transition-all ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'overview' ? 'Ringkasan' :
                     tab === 'methodology' ? 'Metodologi' :
                     tab === 'deliverables' ? 'Hasil Kerja' : 'FAQ'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="font-display font-extrabold text-base text-slate-900">Deskripsi Layanan</h3>
                      <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{service.overview}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display font-extrabold text-base text-slate-900">Manfaat Utama</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-start space-x-2.5">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-600 leading-normal">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'methodology' && (
                  <div className="space-y-6">
                    <h3 className="font-display font-extrabold text-base text-slate-900">Fase Pelaksanaan Proyek</h3>
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                      {service.methodology.map((m, idx) => {
                        const parts = m.split(' - ');
                        return (
                          <div key={idx} className="relative space-y-1">
                            {/* Dot icon */}
                            <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                            <div className="font-display font-bold text-xs text-slate-900">{parts[0]}</div>
                            {parts[1] && <p className="text-[11px] leading-relaxed text-slate-500">{parts[1]}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'deliverables' && (
                  <div className="space-y-6">
                    <h3 className="font-display font-extrabold text-base text-slate-900">Deliverables & Laporan Resmi</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Di akhir pengerjaan, RTI akan menyerahkan dokumen resmi berikut yang dapat digunakan untuk kepentingan audit internal maupun audit kepatuhan eksternal:
                    </p>
                    <div className="space-y-3">
                      {service.deliverables.map((d, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                          <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
                          <span className="text-xs text-slate-700 font-semibold">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h3 className="font-display font-extrabold text-base text-slate-900">Pertanyaan yang Sering Diajukan</h3>
                    {service.faq.length > 0 ? (
                      <div className="space-y-4">
                        {service.faq.map((f, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                            <h4 className="font-display font-bold text-xs text-slate-800 flex items-start space-x-1.5">
                              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <span>{f.q}</span>
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-500 pl-5">{f.a}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">FAQ khusus layanan ini sedang disusun oleh tim teknis kami.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating widgets */}
      <Chatbot />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}
