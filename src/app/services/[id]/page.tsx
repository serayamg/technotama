'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Key, Award, FileText, Shield, CheckCircle2, Layout, Users, BookOpen,
  ArrowLeft, Calendar, FileCheck, HelpCircle, Check, Play, Clock, AlertCircle,
  Eye, Server, Target, Zap, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

// Complete detail profiles of the 17 new services based on profile
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
  'cyber-blueprint': {
    title: 'Cybersecurity Blueprint',
    icon: Shield,
    overview: 'Layanan Cybersecurity Blueprint menyusun rencana induk keamanan informasi jangka panjang (3-5 tahun) yang selaras dengan arsitektur TOGAF/IT Master Plan korporasi Anda untuk memastikan investasi pertahanan siber yang strategis dan terarah.',
    benefits: [
      'Memetakan postur keamanan informasi saat ini terhadap target perlindungan di masa depan.',
      'Menyelaraskan investasi teknologi siber dengan peta jalan pertumbuhan bisnis korporasi.',
      'Memastikan arsitektur pertahanan mengadopsi prinsip Zero Trust dan Defense-in-Depth.'
    ],
    methodology: [
      'Assess - Evaluasi mendalam terhadap arsitektur keamanan siber saat ini.',
      'Blueprint Design - Merancang cetak biru arsitektur target siber.',
      'Roadmap & CapEx Planning - Menyusun prioritas implementasi beserta estimasi anggaran belanja.'
    ],
    deliverables: [
      'Buku Cetak Biru Keamanan Siber (Cybersecurity Blueprint).',
      'Peta Jalan Implementasi Program Keamanan (Security Roadmap).',
      'Rencana Anggaran Belanja (Cyber CAPEX/OPEX Plan).'
    ],
    timeline: '2 - 3 Bulan',
    faq: [
      { q: 'Mengapa memerlukan Cybersecurity Blueprint terpisah dari ITMP?', a: 'Keamanan siber bukan sekadar sub-divisi TI, melainkan manajemen risiko tata kelola. Blueprint siber yang mandiri memastikan pengawasan independen terhadap operasional TI.' }
    ]
  },
  'it-grc': {
    title: 'Policy-SOP Development',
    icon: FileText,
    overview: 'Layanan pengembangan tata kelola TI berbasis COBIT 2019, perancangan kebijakan tingkat tinggi (High-Level Policy), audit kematangan TI SPBE, serta manajemen risiko pihak ketiga (Third-Party Risk Management) untuk memitigasi risiko hukum dan operasional.',
    benefits: [
      'Menjembatani kesenjangan antara kebijakan bisnis, regulasi tata kelola, dan kepatuhan hukum.',
      'Mengurangi tumpang tindih anggaran TI serta meningkatkan efisiensi operasional.',
      'Meminimalisir risiko siber dari vendor dan penyedia jasa luar (pihak ketiga).'
    ],
    methodology: [
      'Identify Goals - Pemetaan sasaran korporasi dan penyelarasan TI.',
      'Maturity Audit - Asesmen kematangan tata kelola TI as-is berbasis COBIT.',
      'Framework Development - Penyusunan dokumen kebijakan tingkat tinggi (SOP).',
      'Third-Party Review - Asesmen risiko vendor pihak ketiga secara komparatif.'
    ],
    deliverables: [
      'Laporan Asesmen Kematangan Tata Kelola TI (Maturity Assessment Report).',
      'Buku Kebijakan & SOP Tata Kelola TI Baru.',
      'Kerangka Manajemen Risiko Vendor Pihak Ketiga.'
    ],
    timeline: '2 - 3 Bulan',
    faq: [
      { q: 'Bagaimana RTI menilai kematangan tata kelola TI?', a: 'Kami menggunakan metrik COBIT 2019 yang mengklasifikasikan tingkat kematangan dari Level 0 (Incomplete) hingga Level 5 (Optimizing).' }
    ]
  },
  'iso-implementation': {
    title: 'ISO/IEC Implementation',
    icon: Award,
    overview: 'Pendampingan implementasi standar internasional manajemen kualitas keamanan informasi (seperti ISO/IEC 27001, ISO 20000, ISO 22301) secara holistik menggunakan siklus Plan-Do-Check-Act (PDCA) untuk kesiapan sertifikasi resmi.',
    benefits: [
      'Meningkatkan reputasi korporasi dan brand trust di tingkat global.',
      'Memenuhi kewajiban SMKI SPBE bagi penyelenggara sistem pemerintahan dan keuangan.',
      'Menyusun proses bisnis yang terdokumentasi rapi untuk mengurangi kegagalan operasional.'
    ],
    methodology: [
      'Gap Analysis (Plan) - Memetakan kondisi operasional saat ini terhadap standar ISO.',
      'Awareness & Design (Do) - Pelatihan staf dan pembuatan dokumen kebijakan.',
      'Internal Audit (Check) - Simulasi audit mandiri sebelum audit eksternal.',
      'Certification (Act) - Pendampingan audit oleh badan sertifikasi resmi.'
    ],
    deliverables: [
      'Dokumen Kebijakan & SOP ISMS (Sistem Manajemen Keamanan Informasi).',
      'Laporan Hasil Gap Analysis & Internal Audit.',
      'Sertifikat ISO Resmi dari Lembaga Akreditasi Terpercaya.'
    ],
    timeline: '3 - 6 Bulan',
    faq: [
      { q: 'Berapa lama sertifikat ISO berlaku?', a: 'Sertifikat ISO berlaku selama 3 tahun dengan kewajiban audit surveillance tahunan untuk memastikan standar tetap dijalankan.' }
    ]
  },
  'bcm-bcp-drp': {
    title: 'BCM-BCP-DRP Services (Cyber Drill)',
    icon: Server,
    overview: 'Layanan penyusunan Business Continuity Plan (BCP) dan Disaster Recovery Plan (DRP) terpadu berdasarkan analisis dampak bisnis (BIA) yang dikombinasikan dengan pengujian kesiapan insiden melalui simulasi Cyber Drill (Table-Top Exercise, Phishing Simulation, dan Cyber Range).',
    benefits: [
      'Meminimalisir downtime operasional saat terjadi bencana fisik atau serangan siber ransomware.',
      'Melatih kesiapan tim penanganan insiden siber (CSIRT) merespons serangan secara taktis.',
      'Menentukan Recovery Time Objective (RTO) and Recovery Point Objective (RPO) yang terukur.',
      'Menjamin kepatuhan terhadap regulasi Bank Indonesia/OJK tentang keandalan operasional.'
    ],
    methodology: [
      'BIA (Business Impact Analysis) - Pemetaan dampak bisnis dari kegagalan sistem.',
      'Risk Assessment & Scenario Design - Analisis ancaman bencana alam/siber dan penyusunan skenario simulasi.',
      'Strategy & Planning - Desain dokumen BCP, DRP, dan struktur redundansi.',
      'Cyber Drill & Simulation - Pelaksanaan Table-Top Exercise dan simulasi serangan siber nyata.'
    ],
    deliverables: [
      'Dokumen Analisis Dampak Bisnis (BIA Report).',
      'Buku Rencana Kelangsungan Bisnis (BCP) & Rencana Pemulihan Bencana (DRP).',
      'Laporan Evaluasi Simulasi Uji Coba Kesiapan Insiden (Cyber Drill & Phishing Report).'
    ],
    timeline: '2 - 3 Bulan',
    faq: [
      { q: 'Apa perbedaan BCP dan DRP?', a: 'BCP berfokus pada keberlanjutan proses bisnis secara holistik (staf, komunikasi, lokasi alternatif), sedangkan DRP berfokus pada aspek pemulihan teknis infrastruktur IT (server, database, cloud).' },
      { q: 'Apa itu Table-Top Exercise (TTE) dalam Cyber Drill?', a: 'TTE adalah simulasi berbasis diskusi di mana tim kunci berkumpul untuk membedah skenario serangan siber dan menguji alur eskalasi keputusan tanpa mengganggu sistem operasional.' }
    ]
  },
  'digital-maturity': {
    title: 'Digital Maturity Assessment & Security Risk Rating',
    icon: Zap,
    overview: 'Evaluasi independen terhadap tingkat kematangan digital organisasi dan kuantifikasi postur risiko keamanan siber menggunakan metrik terukur untuk memberi pemahaman yang jelas bagi direksi.',
    benefits: [
      'Mendapatkan penilaian objektif kematangan digital dibanding industri sejenis.',
      'Mengidentifikasi celah tata kelola siber yang paling mendesak untuk diperbaiki.',
      'Memperoleh potret metrik risiko (Security Risk Rating) untuk laporan dewan komisaris.'
    ],
    methodology: [
      'Data Gathering - Pengumpulan metrik TI dan kuesioner wawancara.',
      'Evaluation Framework - Penilaian tingkat kematangan menggunakan standar BSSN/NIST.',
      'Risk Quantification - Kuantifikasi probabilitas dan dampak finansial risiko.',
      'Reporting - Penyusunan dasbor postur keamanan siber.'
    ],
    deliverables: [
      'Laporan Kematangan Digital (Digital Maturity Assessment Report).',
      'Dasbor Security Risk Rating.',
      'Rekomendasi Strategis Peningkatan Kematangan.'
    ],
    timeline: '1 - 2 Bulan',
    faq: [
      { q: 'Siapa yang memerlukan penilaian ini?', a: 'Sektor perbankan, perusahaan energi, dan startup e-commerce yang ingin mengukur postur siber mereka di mata regulator maupun investor.' }
    ]
  },
  'cyber-awareness': {
    title: 'Awareness & Training',
    icon: BookOpen,
    overview: 'Program edukasi kesadaran keamanan siber yang komprehensif bagi staf non-teknis, mencakup modul e-learning interaktif, simulasi phishing berkala, dan kampanye budaya sadar keamanan.',
    benefits: [
      'Mengurangi tingkat keberhasilan serangan social engineering hingga 90%.',
      'Membangun pertahanan lapis pertama (human firewall) yang kuat di organisasi Anda.',
      'Memenuhi klausul kepatuhan standar keamanan informasi ISO 27001 dan regulasi PDP.'
    ],
    methodology: [
      'Baseline Test - Uji coba awal kerawanan phishing karyawan.',
      'E-Learning Training - Pelatihan kesadaran siber berbasis modul interaktif.',
      'Phishing Simulation - Uji coba email phishing jebakan berkala.',
      'Reporting - Penyusunan dasbor kelulusan dan nilai kewaspadaan staf.'
    ],
    deliverables: [
      'Modul E-learning & Kuis Interaktif.',
      'Laporan Hasil Simulasi Phishing Karyawan.',
      'Materi Kampanye Sadar Keamanan (Security Awareness Kit).'
    ],
    timeline: 'Rutin (1 - 3 Bulan)',
    faq: [
      { q: 'Mengapa fokus pada non-IT?', a: 'Lebih dari 90% kebocoran data berawal dari kesalahan manusia (human error) seperti mengklik tautan mencurigakan. Melatih staf non-IT memitigasi celah terbesar ini.' }
    ]
  },
  'it-audit': {
    title: 'IT Audit',
    icon: CheckCircle2,
    overview: 'Audit independen menyeluruh terhadap infrastruktur TI, aplikasi, tata kelola, sistem perdagangan (trading system), serta kepatuhan kepatuhan regulasi OJK (POJK).',
    benefits: [
      'Memastikan trading system atau core business berjalan stabil tanpa anomali.',
      'Menjamin kepatuhan penuh terhadap audit wajib OJK/BI untuk industri jasa keuangan.',
      'Mendeteksi celah kebocoran keuangan atau inefisiensi arsitektur TI.'
    ],
    methodology: [
      'Pre-Audit - Penentuan ruang lingkup dan checklist kepatuhan regulasi.',
      'Fieldwork - Audit langsung ke server, database, dan kebijakan konfigurasi.',
      'Analysis - Pencocokan temuan dengan regulasi standar.',
      'Reporting - Penyusunan laporan temuan audit formal.'
    ],
    deliverables: [
      'Laporan Audit TI Resmi (IT Audit Report).',
      'Daftar Temuan & Status Kepatuhan Regulasi (Compliance Checklist).',
      'Rencana Aksi Korektif (Corrective Action Plan).'
    ],
    timeline: '1 - 2 Bulan',
    faq: [
      { q: 'Apakah IT Audit sama dengan VAPT?', a: 'Tidak. VAPT fokus pada pengujian celah keamanan teknis (hacking), sedangkan IT Audit mengevaluasi kepatuhan operasional, kelayakan kontrol internal, stabilitas sistem, dan kesesuaian kebijakan regulasi.' }
    ]
  },
  'vulnerability-assessment': {
    title: 'Vulnerability Assessment (VA)',
    icon: Eye,
    overview: 'Pemindaian kerentanan sistem komputer, jaringan, dan aplikasi web secara otomatis menggunakan pemindai terpercaya untuk mendeteksi kelemahan konfigurasi dasar.',
    benefits: [
      'Mengidentifikasi celah keamanan standar secara cepat dan efisien.',
      'Memberikan laporan inventarisasi aset yang rentan terhadap eksploitasi.',
      'Menjaga postur keamanan dasar secara berkala dengan biaya ekonomis.'
    ],
    methodology: [
      'Target Scope - Mendefinisikan IP Address atau domain target.',
      'Automated Scanning - Menjalankan pemindaian kerentanan otomatis.',
      'Result Filtering - Menyaring temuan false-positive oleh analis siber RTI.',
      'Prioritization - Mengklasifikasikan celah dari High, Medium, ke Low.'
    ],
    deliverables: [
      'Laporan Hasil Pemindaian Kerentanan (VA Report).',
      'Daftar Prioritas Mitigasi Teknis.'
    ],
    timeline: '1 Minggu',
    faq: [
      { q: 'Apakah pemindaian kerentanan sama dengan pentest?', a: 'VA adalah pemindaian otomatis untuk mencari celah yang diketahui tanpa mencoba mengeksploitasinya, sedangkan pentest (Penetration Testing) melibatkan upaya aktif manusia untuk menembus pertahanan.' }
    ]
  },
  'penetration-testing': {
    title: 'Penetration Testing (Pen-Test)',
    icon: Key,
    overview: 'Simulasi serangan siber aktif secara terkendali oleh ethical hacker RTI untuk menembus pertahanan aplikasi web, mobile app, API, dan jaringan internal/eksternal klien.',
    benefits: [
      'Menguji ketahanan sistem secara nyata terhadap skenario eksploitasi canggih.',
      'Memenuhi kepatuhan regulasi OJK terkait audit keamanan berkala sistem keuangan.',
      'Menemukan celah logika bisnis (business logic flaws) yang tidak terdeteksi mesin.'
    ],
    methodology: [
      'Reconnaissance - Pengumpulan informasi target.',
      'Vulnerability Scanning - Pemetaan celah potensial.',
      'Manual Exploitation - Upaya menembus sistem dan mengambil alih hak akses.',
      'Reporting & Remediation - Rapat penjelasan teknis dan penyerahan dokumentasi temuan.'
    ],
    deliverables: [
      'Executive Summary Report (Laporan Manajemen).',
      'Technical Penetration Testing Report (Laporan Detail Eksploitasi).',
      'Validation Report (Laporan Tes Ulang Pasca-Mitigasi).'
    ],
    timeline: '2 - 3 Minggu',
    faq: [
      { q: 'Apakah pentest mengganggu operasional?', a: 'Kami mengutamakan pengujian di staging. Jika dilakukan di production, pengujian dijadwalkan di luar jam sibuk dengan pengawasan ketat.' }
    ]
  },
  'secure-sdlc': {
    title: 'Secure SDLC Implementation',
    icon: Lock,
    overview: 'Integrasi kontrol keamanan di setiap tahapan siklus pengembangan perangkat lunak (SDLC) menggunakan pendekatan Shift Left dan praktek DevSecOps untuk memastikan aplikasi aman dari baris kode pertama.',
    benefits: [
      'Memperbaiki celah keamanan perangkat lunak saat biaya perbaikan masih murah (tahap coding).',
      'Membangun budaya pemrogaman aman (secure coding) bagi tim developer internal.',
      'Mengotomatiskan pemindaian kode (SAST/DAST) di dalam pipeline CI/CD.'
    ],
    methodology: [
      'Requirement Assessment - Menentukan standar keamanan aplikasi.',
      'Threat Modeling - Desain pemodelan ancaman sebelum coding dimulai.',
      'Static & Dynamic Scan (SAST/DAST) - Pemindaian kode sumber otomatis.',
      'Secure Code Review - Review manual baris kode kritis (misal: otentikasi).'
    ],
    deliverables: [
      'Buku Panduan Pemrograman Aman (Secure Coding Guidelines).',
      'Laporan Audit CI/CD Pipeline & DevSecOps Setup.',
      'Laporan Source Code Review (SAST/DAST Report).'
    ],
    timeline: '1 - 2 Bulan',
    faq: [
      { q: 'Apa itu pendekatan Shift Left?', a: 'Shift Left berarti memindahkan pengujian keamanan ke tahap seawal mungkin dalam siklus pengembangan (ke kiri pada timeline), bukan menguji keamanan hanya saat aplikasi sudah selesai dikembangkan.' }
    ]
  },
  'red-teaming': {
    title: 'Red Teaming',
    icon: Target,
    overview: 'Simulasi serangan siber rahasia multi-vektor secara riil (termasuk physical intrusion, social engineering, dan cyber attack) untuk menguji ketahanan tim pertahanan internal (Blue Team) dan sensor pertahanan Anda.',
    benefits: [
      'Menguji respon deteksi dan eskalasi tim keamanan internal (SOC/CSIRT) di dunia nyata.',
      'Menilai efektivitas pertahanan fisik, teknologi, dan kewaspadaan karyawan sekaligus.',
      'Menguji respon mitigasi insiden siber secara holistik tanpa pemberitahuan staf.'
    ],
    methodology: [
      'Scoping & Rules of Engagement - Penentuan batas pengujian yang aman.',
      'Recon & Intelligence - Intelijen terbuka terhadap staf dan infrastruktur.',
      'Active Intrusion - Serangan siber rahasia dan upaya bypass sistem deteksi.',
      'Post-Simulation Debrief - Rekonsiliasi temuan serangan bersama tim Blue Team klien.'
    ],
    deliverables: [
      'Laporan Simulasi Serangan Red Team (Red Team Report).',
      'Laporan Kinerja Deteksi Blue Team (Detection Matrix Report).',
      'Rekomendasi Peningkatan Sensor Deteksi (SIEM/EDR rule updates).'
    ],
    timeline: '1 - 2 Bulan',
    faq: [
      { q: 'Apakah karyawan akan tahu tentang simulasi ini?', a: 'Tidak. Simulasi Red Team dilakukan secara rahasia, hanya manajemen puncak (sponsor proyek) yang mengetahuinya untuk mengukur respon riil staf.' }
    ]
  },
  'soc': {
    title: 'Security Operation Center (SOC)',
    icon: Shield,
    overview: 'Layanan pemantauan keamanan siber 24/7 real-time berbasis Security Information and Event Management (SIEM) untuk mendeteksi, menganalisis, dan melaporkan ancaman keamanan secara cepat.',
    benefits: [
      'Pemantauan siber real-time 24 jam penuh tanpa menguras sumber daya internal.',
      'Deteksi dini upaya serangan ransomware, malware, atau pembobolan data.',
      'Analisis insiden oleh tim bersertifikasi siber profesional.'
    ],
    methodology: [
      'Ingestion - Menghubungkan log server, firewall, dan endpoint ke SIEM.',
      'Correlation - Menulis aturan deteksi korelasi ancaman.',
      'Monitoring - Analisis siaga 24/7 oleh tim Security Analyst.',
      'Triage & Alert - Notifikasi eskalasi cepat untuk insiden tingkat kritis.'
    ],
    deliverables: [
      'Dasbor Pemantauan Keamanan SIEM.',
      'Laporan Insiden Siber Real-time (Incident Alerts).',
      'Laporan Kepatuhan Keamanan Bulanan (Monthly Security Report).'
    ],
    timeline: 'Layanan Berkelanjutan (Tahunan)',
    faq: [
      { q: 'Bagaimana tim SOC merespon serangan?', a: 'Saat mendeteksi serangan, tim SOC kami akan melakukan triage, memblokir IP penyerang di firewall klien (sesuai persetujuan), mengisolasi host yang terinfeksi, dan memandu tim internal klien melakukan penanganan.' }
    ]
  },
  'cyber-threat-intelligence': {
    title: 'Cyber Threat Intelligence (CTI) Solution',
    icon: Zap,
    overview: 'Layanan pengumpulan dan analisis data ancaman siber global secara real-time dari Dark Web, forum peretas, dan repositori malware untuk mendeteksi kebocoran kredensial atau rencana serangan terhadap organisasi Anda secara dini.',
    benefits: [
      'Mengetahui rencana serangan peretas sebelum eksploitasi terjadi.',
      'Mendeteksi kebocoran data rahasia atau kredensial karyawan di forum Dark Web.',
      'Meningkatkan kesiapan filter firewall dengan data ancaman global (IoC feeds).'
    ],
    methodology: [
      'Collection - Mengumpulkan data feeds dari Dark Web dan threat database.',
      'Analysis - Menyaring info untuk menemukan korelasi nama domain/klien.',
      'Dissemination - Mengirim laporan intelijen ancaman yang mendesak.',
      'Integration - Memasukkan daftar IP/domain berbahaya ke firewall klien.'
    ],
    deliverables: [
      'Laporan Intelijen Kebocoran Data (Dark Web Leak Report).',
      'Feed Indikator Serangan (IoC Feeds Integration).',
      'Laporan Profil Ancaman Industri Berkala.'
    ],
    timeline: 'Layanan Berkelanjutan (Tahunan)',
    faq: [
      { q: 'Apa itu IoC (Indicator of Compromise)?', a: 'IoC adalah bukti digital seperti hash file malware, alamat IP penyerang, atau domain phishing yang menunjukkan bahwa suatu sistem telah disusupi.' }
    ]
  },
  'network-endpoint-hardening': {
    title: 'Network & Endpoint Hardening',
    icon: Server,
    overview: 'Layanan penguatan konfigurasi sistem operasi, penutupan port tidak aman, pembatasan hak akses administrative, serta pengetatan konfigurasi perangkat jaringan dan endpoint (EDR).',
    benefits: [
      'Memperkecil celah serangan (attack surface) pada server dan perangkat kerja.',
      'Mencegah penyebaran malware secara lateral (lateral movement) di jaringan internal.',
      'Memastikan kepatuhan konfigurasi dasar sistem terhadap standar industri CIS Benchmarks.'
    ],
    methodology: [
      'Baseline Audit - Evaluasi konfigurasi saat ini terhadap CIS Benchmarks.',
      'Hardening Execution - Pengetatan kebijakan grup (GPO), firewall host, dan registry.',
      'Port & Service Cleanup - Mematikan layanan dan port yang tidak diperlukan.',
      'Validation - Uji coba fungsional pasca-hardening untuk mencegah kegagalan aplikasi.'
    ],
    deliverables: [
      'Dokumen Panduan Penguatan Sistem (Hardening Guidelines).',
      'Laporan Hasil Audit CIS Benchmarks.',
      'Laporan Konfigurasi Hasil Akhir Hardening.'
    ],
    timeline: '2 - 3 Minggu',
    faq: [
      { q: 'Apakah hardening bisa merusak fungsi aplikasi?', a: 'Tindakan hardening dilakukan secara bertahap di lingkungan tes, lalu divalidasi fungsinya sebelum diterapkan ke lingkungan produksi untuk menghindari gangguan layanan.' }
    ]
  },
  'incident-management': {
    title: 'Cyber Security Incident Management',
    icon: AlertCircle,
    overview: 'Penyusunan kerangka kerja respons insiden siber berdasarkan standar NIST Incident Response Life Cycle, serta penanganan insiden darurat untuk mengisolasi, menyelidiki, dan membasmi ancaman siber aktif.',
    benefits: [
      'Memiliki alur penanganan insiden siber yang terstruktur untuk membatasi kerusakan.',
      'Mengurangi downtime sistem dan memulihkan operasional bisnis dengan aman dan cepat.',
      'Mencegah terjadinya insiden siber yang serupa di masa mendatang.'
    ],
    methodology: [
      'Preparation - Penyusunan SOP penanganan dan pembentukan tim CSIRT.',
      'Detection & Analysis - Identifikasi jenis serangan dan cakupan infeksinya.',
      'Containment & Eradication - Mengisolasi host terinfeksi dan menghapus malware.',
      'Recovery & Post-Incident - Pemulihan sistem secara aman dan evaluasi pembelajaran.'
    ],
    deliverables: [
      'Buku Panduan Respons Insiden (Incident Response Playbook).',
      'Laporan Analisis Penanganan Insiden Pasca-Serangan (Post-Mortem Report).',
      'Laporan Evaluasi Kerentanan & Saran Pencegahan Ulang.'
    ],
    timeline: '1 - 2 Bulan (Penyusunan SOP) / Respon Cepat (Saat Insiden)',
    faq: [
      { q: 'Berapa cepat tim respon insiden RTI merespon?', a: 'Untuk insiden aktif (ransomware/data breach), tim tanggap darurat kami siap berkoordinasi dalam waktu kurang dari 2 jam setelah laporan diterima.' }
    ]
  },
  'digital-forensic': {
    title: 'Digital Forensic',
    icon: FileCheck,
    overview: 'Layanan identifikasi, akuisisi, preservasi, dan analisis bukti digital dari harddisk, memori, log server, atau perangkat seluler pasca-insiden siber secara forensik untuk keperluan hukum.',
    benefits: [
      'Memperoleh bukti digital yang sah dan tidak rusak (memenuhi standar hukum).',
      'Menemukan akar penyebab (root cause) pembobolan data dan jejak peretas.',
      'Mendapatkan laporan forensik resmi untuk kebutuhan kepatuhan hukum / asuransi.'
    ],
    methodology: [
      'Acquisition - Kloning media penyimpanan secara forensik (write-blocked).',
      'Preservation - Pemeliharaan integritas data menggunakan nilai hash (MD5/SHA256).',
      'Analysis - Pencarian bukti tersembunyi, log yang dihapus, dan artefak malware.',
      'Reporting - Penyusunan laporan keterangan ahli forensik digital.'
    ],
    deliverables: [
      'Laporan Analisis Forensik Digital (Digital Forensic Report).',
      'Bukti Digital Terpreservasi & Bersertifikasi hash.',
      'Laporan Keterangan Ahli untuk Keperluan Hukum.'
    ],
    timeline: '2 - 3 Minggu',
    faq: [
      { q: 'Mengapa kloning harus menggunakan write-blocker?', a: 'Write-blocker mencegah perubahan sekecil apapun pada media bukti asli saat dianalisis, menjaga keabsahannya sebagai alat bukti sah di pengadilan.' }
    ]
  }
};

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  const service = servicesDetails[serviceId];

  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'deliverables' | 'faq'>('overview');
  const [siteConfig, setSiteConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('Settings load error'));
  }, []);

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

  const serviceIdToCluster = (id: string) => {
    const gov = ['cyber-blueprint', 'it-grc', 'iso-implementation', 'bcm-bcp-drp', 'digital-maturity', 'cyber-awareness', 'it-audit'];
    const off = ['vulnerability-assessment', 'penetration-testing', 'secure-sdlc', 'red-teaming'];
    if (gov.includes(id)) return 'governance';
    if (off.includes(id)) return 'offensive';
    return 'defensive';
  };

  const getDefaultImageUrl = (cluster: string) => {
    if (cluster === 'governance') return '/illustrations/governance.png';
    if (cluster === 'offensive') return '/illustrations/offensive.png';
    return '/illustrations/defensive.png';
  };

  const dynamicService = siteConfig?.services?.find((s: any) => s.id === serviceId);
  const imageUrl = dynamicService?.imageUrl || getDefaultImageUrl(dynamicService?.cluster || serviceIdToCluster(serviceId));

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
                    Order Solusi Online
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
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left/Main Column: Description & Benefits */}
                    <div className="lg:col-span-7 space-y-8">
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

                    {/* Right/Sidebar Column: Illustration */}
                    <div className="lg:col-span-5 space-y-4">
                      <h3 className="font-display font-extrabold text-base text-slate-900">Ilustrasi & Infografis</h3>
                      <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-sm bg-slate-50 relative group">
                        <img 
                          src={imageUrl} 
                          alt={`Ilustrasi ${service.title}`}
                          className="w-full h-auto object-cover max-h-[250px] mx-auto hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-slate-400 italic text-center font-medium">
                        *Visualisasi sistem ini dapat disesuaikan di Panel Admin
                      </p>
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
