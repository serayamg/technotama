'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ShieldCheck, ArrowUpRight, Award, CheckCircle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

const caseStudies = [
  {
    id: 'lpdp',
    client: 'LPDP (Lembaga Pengelola Dana Pendidikan)',
    project: 'Implementasi ISO/IEC 27001:2022',
    category: 'Government & Compliance',
    challenge: 'Meningkatkan perlindungan data sensitif beasiswa nasional dan menjaga kepatuhan terhadap standar keamanan siber terbaru (ISO/IEC 27001:2022).',
    approach: 'Melakukan gap analysis dari ISO 27001:2013 ke ISO 27001:2022, perbaikan SOP, penyusunan dokumen SMKI, dan pendampingan audit sertifikasi eksternal.',
    deliverables: 'Kebijakan Keamanan Informasi baru, Risk Assessment Report, SOP Kepatuhan Aplikasi, Sertifikasi ISO 27001:2022.',
    impact: 'LPDP sukses mengadopsi kontrol keamanan versi terbaru, memastikan perlindungan data seluruh pendaftar beasiswa terlindungi aman.'
  },
  {
    id: 'bank-dki',
    client: 'Bank DKI',
    project: 'Audit Independen & Penetration Test',
    category: 'Banking & Offense',
    challenge: 'Memenuhi kepatuhan regulasi Otoritas Jasa Keuangan (OJK) dan mendeteksi kerentanan pada layanan digital banking.',
    approach: 'Offensive cybersecurity testing mencakup web application, mobile app, API pentest, serta review kontrol arsitektur server.',
    deliverables: 'Laporan Pentest Teknis, Laporan Eksekutif Kepatuhan OJK, Rencana Mitigasi (Remediation Plan).',
    impact: 'Meningkatkan ketahanan aplikasi perbankan dari fraud siber dan meloloskan audit kepatuhan OJK tanpa catatan temuan kritikal.'
  },
  {
    id: 'bssn',
    client: 'Badan Siber dan Sandi Negara (BSSN)',
    project: 'Rencana Induk Keamanan TIK SPBE',
    category: 'Government & Strategy',
    challenge: 'Menyusun standar instrumen kepatuhan dan peta jalan Keamanan Informasi untuk Sistem Pemerintahan Berbasis Elektronik (SPBE) nasional.',
    approach: 'Analisis gap implementasi SMKI di tingkat kementerian/lembaga pemerintah, penyusunan materi awareness, dan pembuatan instrumen ukur SPBE.',
    deliverables: 'Dokumen Rencana Induk Keamanan TIK SPBE, Instrumen Pengukuran Pemahaman SMKI.',
    impact: 'BSSN memiliki alat ukur dan roadmap terstandardisasi untuk mengevaluasi tingkat kematangan keamanan siber pemerintah daerah se-Indonesia.'
  },
  {
    id: 'bank-uob',
    client: 'Bank UOB Indonesia',
    project: 'Asesmen Risiko Siber BI & Sertifikasi ISO 27001',
    category: 'Banking & Compliance',
    challenge: 'Mengintegrasikan manajemen risiko keamanan informasi dengan kepatuhan Surat Edaran Bank Indonesia terkait Cyber Security Risk Management.',
    approach: 'Pendampingan terpadu penyusunan mitigasi risiko TI, audit gap SMKI, dan sinkronisasi kontrol internal dengan BI Framework.',
    deliverables: 'Cyber Risk Assessment Matrix, Dokumen Penyelarasan Kepatuhan Bank Indonesia, Pendampingan Sertifikasi ISO.',
    impact: 'Bank UOB Indonesia berhasil menyelaraskan pertahanan siber internal dengan regulasi BI dan mempertahankan sertifikasi ISO 27001.'
  },
  {
    id: 'asiapay',
    client: 'AsiaPay Indonesia',
    project: 'Sertifikasi PCI DSS & Pendampingan',
    category: 'Fintech & Transaction Security',
    challenge: 'Melindungi lalu lintas data transaksi kartu kredit (payment gateway) dan mempertahankan sertifikasi kepatuhan PCI DSS.',
    approach: 'Penerapan kontrol jaringan perimeter, enkripsi data in-transit/at-rest, audit log manajemen, dan vulnerability assessment berkala.',
    deliverables: 'Sertifikat Kepatuhan PCI DSS, Laporan Pengujian Celah Keamanan (VAPT), Dokumen Kebijakan Transaksi Aman.',
    impact: 'AsiaPay sukses mempertahankan status kepatuhan standar transaksi kartu global, menjaga integritas bisnis payment gateway di Indonesia.'
  }
];

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState<typeof caseStudies[0] | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Portfolio & Rekam Jejak</div>
            <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Studi Kasus Proyek Keamanan Siber
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Bagaimana kami mendampingi organisasi pemerintah, BUMN, perbankan, dan swasta menyelesaikan masalah keamanan kompleks dan mencapai kepatuhan regulasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <div
                key={cs.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[300px] p-6 relative group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                      {cs.category}
                    </span>
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900 text-base leading-snug">
                      {cs.client}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Proyek: {cs.project}
                    </p>
                    <p className="text-xs text-slate-500 mt-3 line-clamp-3">
                      {cs.challenge}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCase(cs)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                  >
                    <span>Lihat Detail Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Case Study Detail Modal Overlay */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">{selectedCase.category}</span>
                <h3 className="font-display font-extrabold text-lg leading-tight mt-0.5">{selectedCase.client}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none font-bold"
              >
                Tutup
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto bg-slate-50">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nama Proyek</span>
                <span className="text-sm font-bold text-slate-800">{selectedCase.project}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Business Challenge</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1.5">{selectedCase.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Approach & Solution</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1.5">{selectedCase.approach}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Key Deliverables</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1.5">{selectedCase.deliverables}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Project Impact</h4>
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg mt-1.5 text-xs leading-relaxed text-emerald-800 font-medium flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{selectedCase.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 bg-white flex justify-end space-x-3 shrink-0">
              <Link
                href="/request-proposal"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-1.5"
              >
                <span>Minta Proposal Serupa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

      <Chatbot />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}
