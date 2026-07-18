'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Check, ChevronRight, FileText, Download, CreditCard, 
  CheckCircle2, ArrowRight, Loader2, Key, Info, HelpCircle, Mail
} from 'lucide-react';

const servicePricings = [
  { 
    name: 'Cybersecurity Blueprint', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'IT Master Plan Alignment & 3-Year Security Roadmap',
    description: 'Perancangan arsitektur dan peta jalan keamanan siber jangka panjang untuk kepatuhan organisasi.'
  },
  { 
    name: 'Policy-SOP Development', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'COBIT Maturity Audit, High-Level Policy & Vendor Risk Management',
    description: 'Pengembangan tata kelola TI berbasis COBIT dan kerangka manajemen risiko operasional.'
  },
  { 
    name: 'ISO/IEC Implementation', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'ISO 27001 Gap Analysis, Policies Setup & Certification Support',
    description: 'Pendampingan implementasi Sistem Manajemen Keamanan Informasi (SMKI) ISO 27001.'
  },
  { 
    name: 'BCM-BCP-DRP Services (Cyber Drill)', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'Business Impact Analysis, Recovery Strategy & Incident Table-Top Exercise',
    description: 'Penyusunan rencana kelangsungan bisnis dan pemulihan bencana siber yang teruji.'
  },
  { 
    name: 'Digital Maturity Assessment & Security Risk Rating', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'Security Scorecard, Digital Maturity Audit & Stakeholder Report',
    description: 'Evaluasi independen tingkat kematangan digital dan postur risiko keamanan siber.'
  },
  { 
    name: 'Awareness & Training', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'Security Awareness Kit, Phishing Simulation & Employee E-Learning',
    description: 'Program pelatihan kesadaran keamanan informasi terukur untuk seluruh karyawan.'
  },
  { 
    name: 'IT Audit', 
    tier: 'Governance', 
    price: 'Hubungi Sales', 
    scope: 'Compliance Audit, IT Infrastructure Review & Regulatory Report',
    description: 'Audit independen infrastruktur TI, kepatuhan regulasi OJK/BI, dan tata kelola sistem.'
  },
  { 
    name: 'Vulnerability Assessment (VA)', 
    tier: 'Offensive', 
    price: 'Hubungi Sales', 
    scope: 'Automated & Manual Vulnerability Scan, Web/Network/API Assessment',
    description: 'Pemindaian kerentanan sistem siber secara komprehensif untuk mengidentifikasi celah keamanan.'
  },
  { 
    name: 'Penetration Testing (Pen-Test)', 
    tier: 'Offensive', 
    price: 'Hubungi Sales', 
    scope: 'Black/Gray/White Box testing for Web, Mobile, or API',
    description: 'Uji penetrasi mendalam untuk mensimulasikan eksploitasi celah keamanan sebelum diserang peretas.'
  },
  { 
    name: 'Secure SDLC Implementation', 
    tier: 'Offensive', 
    price: 'Hubungi Sales', 
    scope: 'Source Code Review (SAST/DAST) & Secure Coding Guidelines',
    description: 'Integrasi standar keamanan siber dalam setiap tahap pengembangan siklus hidup perangkat lunak.'
  },
  { 
    name: 'Red Teaming', 
    tier: 'Offensive', 
    price: 'Hubungi Sales', 
    scope: 'Multi-vector attack simulation & SOC evasion testing',
    description: 'Simulasi serangan siber nyata secara rahasia untuk menguji kesiapan tim pertahanan internal.'
  },
  { 
    name: 'Security Operation Center (SOC)', 
    tier: 'Defensive', 
    price: 'Hubungi Sales', 
    scope: '24/7 Security Monitoring, SIEM/SOAR Operations & Threat Detection',
    description: 'Pusat pemantauan keamanan siber 24/7 untuk mendeteksi dan merespons ancaman secara real-time.'
  },
  { 
    name: 'Cyber Threat Intelligence (CTI) Solution', 
    tier: 'Defensive', 
    price: 'Hubungi Sales', 
    scope: 'Dark Web Monitoring, IoC Feeds & Tactical Threat Reports',
    description: 'Analisis intelijen ancaman siber untuk memprediksi dan memitigasi serangan sebelum terjadi.'
  },
  { 
    name: 'Network & Endpoint Hardening', 
    tier: 'Defensive', 
    price: 'Hubungi Sales', 
    scope: 'Firewall Configuration, EDR Setup & System Security Hardening',
    description: 'Penguatan konfigurasi jaringan dan perangkat akhir (endpoint) untuk mempersempit permukaan serangan.'
  },
  { 
    name: 'Cyber Security Incident Management', 
    tier: 'Defensive', 
    price: 'Hubungi Sales', 
    scope: 'Incident Triage, Containment Strategy & Post-Incident Review',
    description: 'Penyusunan alur eskalasi, penahanan dampak (containment), dan pemulihan pasca insiden siber.'
  },
  { 
    name: 'Digital Forensic', 
    tier: 'Defensive', 
    price: 'Hubungi Sales', 
    scope: 'Evidence Preservation, Artifact Analysis & Expert Court Report',
    description: 'Identifikasi, pengumpulan, dan analisis bukti digital pasca-insiden yang memenuhi standar hukum.'
  }
];

export default function OnlineOrder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([servicePricings[0]]);
  const [activeCluster, setActiveCluster] = useState('ALL');
  const [pdpConsent, setPdpConsent] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    docName: '',
    projectDetails: '',
    paymentMethod: 'Bank Transfer (BCA Virtual Account)'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSiteConfig(data);
          if (data.packages && data.packages.length > 0) {
            setSelectedServices([data.packages[0]]);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        docName: e.target.files![0].name
      }));
    }
  };

  const handleSubmitOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.projectDetails || !formData.projectDetails.trim()) {
      alert('Mohon isi deskripsi Rencana & Kebutuhan Proyek Anda terlebih dahulu.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedServices.map(s => s.name).join(', '),
          companyName: formData.companyName,
          documentName: formData.docName || null,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          projectDetails: formData.projectDetails || null
        })
      });

      if (response.ok) {
        setStep(4); // Final success is now step 4
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Order Service Online
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Sistem pengadaan layanan siber instan RTI. Dapatkan quotation, lakukan approval dokumen, dan lacak progres pekerjaan Anda secara transparan.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

            {/* Mobile Stepper progress */}
            <div className="md:hidden border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Langkah {step} dari 4</span>
              <span className="text-blue-600 uppercase tracking-wider">
                {step === 1 && 'Pilih Layanan'}
                {step === 2 && 'Isi Profil'}
                {step === 3 && 'Dokumen Scoping'}
                {step === 4 && 'Tracking & Akun'}
              </span>
            </div>

            {/* Desktop Stepper progress */}
            <div className="hidden md:flex border-b border-slate-100 bg-slate-50/30 py-5 items-center justify-center px-4">
              {[
                { number: 1, label: 'Pilih Layanan' },
                { number: 2, label: 'Isi Profil' },
                { number: 3, label: 'Dokumen Scoping' },
                { number: 4, label: 'Tracking & Akun' }
              ].map((s, idx) => {
                const isActive = step === s.number;
                const isCompleted = step > s.number;
                return (
                  <React.Fragment key={s.number}>
                    <div className="flex items-center space-x-2.5 shrink-0">
                      {/* Step Number Circle */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                          : isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {isCompleted ? '✓' : s.number}
                      </div>
                      
                      {/* Step Label */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                        isActive 
                          ? 'text-blue-600 font-extrabold' 
                          : isCompleted 
                            ? 'text-slate-700' 
                            : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    
                    {/* Connecting line */}
                    {idx < 3 && (
                      <div className={`w-8 lg:w-16 h-0.5 mx-3 lg:mx-6 rounded transition-colors duration-500 shrink-0 ${
                        step > s.number ? 'bg-emerald-400' : 'bg-slate-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Steps Body */}
            <div className="p-8">
              
              {/* Step 1: Select Service */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="font-display font-extrabold text-base text-slate-900">Pilih Solusi RTI</h2>
                    
                    {/* Cluster Filter Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {['ALL', 'GOVERNANCE', 'OFFENSIVE', 'DEFENSIVE'].map((cluster) => {
                        const label = cluster === 'ALL' ? 'Semua' : cluster.charAt(0) + cluster.slice(1).toLowerCase();
                        const isActive = activeCluster === cluster;
                        return (
                          <button
                            key={cluster}
                            type="button"
                            onClick={() => setActiveCluster(cluster)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border focus:outline-none cursor-pointer ${
                              isActive
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(siteConfig?.packages || servicePricings)
                      .filter((svc: any) => activeCluster === 'ALL' || svc.tier?.toUpperCase() === activeCluster)
                      .map((svc: any, idx: number) => {
                        const isSelected = selectedServices.some(s => s.name === svc.name);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedServices(prev => {
                                const exists = prev.some(s => s.name === svc.name);
                                if (exists) {
                                  if (prev.length <= 1) return prev; // Enforce at least 1 selection
                                  return prev.filter(s => s.name !== svc.name);
                                }
                                return [...prev, svc];
                              });
                            }}
                            className={`p-6 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[170px] focus:outline-none cursor-pointer select-none w-full ${
                              isSelected
                                ? 'bg-blue-50/10 border-blue-500 shadow-sm ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="space-y-1 w-full">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{svc.tier}</span>
                                {isSelected && <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />}
                              </div>
                              <h3 className="font-display font-extrabold text-sm text-slate-800">{svc.name}</h3>
                              <p className="text-[10px] text-slate-500 leading-normal font-semibold">{svc.scope}</p>
                              {svc.description && (
                                <p className="text-[10px] text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-100/50">
                                  {svc.description}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>

                  <div className="pt-6 flex justify-end border-t border-slate-100">
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedServices.length === 0}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Lanjutkan ke Profil
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Form Profile */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Masukkan Data Koordinator Proyek</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Perusahaan *</label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="PT Contoh Perusahaan"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Penghubung Proyek (PIC) *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama Lengkap Anda"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Email Kerja PIC *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="pic@company.com"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nomor Handphone PIC *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0812xxxxxx"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                    <input
                      type="checkbox"
                      id="pdp-consent"
                      checked={pdpConsent}
                      onChange={(e) => setPdpConsent(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0 mt-0.5"
                    />
                    <label htmlFor="pdp-consent" className="text-[10px] leading-relaxed text-slate-500 font-semibold select-none">
                      Saya memberikan persetujuan kepada PT Riset Teknologi Indonesia untuk mengumpulkan, menyimpan, dan memproses data pribadi koordinator proyek (PIC) di atas untuk kepentingan pemesanan layanan ini sesuai dengan regulasi UU Pelindungan Data Pribadi (UU PDP). *
                    </label>
                  </div>

                  <div className="pt-6 flex justify-between border-t border-slate-100">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => {
                        if (!formData.companyName || !formData.name || !formData.email || !formData.phone) {
                          alert('Mohon lengkapi seluruh field wajib (*)');
                          return;
                        }
                        if (!pdpConsent) {
                          alert('Mohon setujui pemrosesan data pribadi Anda (*)');
                          return;
                        }
                        setStep(3);
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Document upload */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Deskripsi Kebutuhan & Dokumen Scoping</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Berikan rincian deskripsi mengenai rencana proyek Anda atau unggah file scoping pendukung (seperti topologi jaringan atau daftar target IP/URL) untuk mempermudah konsultan RTI menyusun proposal teknis.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Rencana & Kebutuhan Proyek *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      placeholder="Jelaskan secara singkat rencana pekerjaan (misal: pengujian berkala website e-commerce) dan hasil atau kebutuhan spesifik yang ingin dicapai melalui penugasan RTI..."
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Upload Dokumen Scoping / TOR (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 transition-colors p-8 rounded-xl text-center relative cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      />
                      <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <div className="text-xs font-bold text-slate-700">
                        {formData.docName ? `Terpilih: ${formData.docName}` : 'Pilih file scoping Anda (Optional)'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Format: PDF, Word, Excel, ZIP (Max 10MB)
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between border-t border-slate-100">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => handleSubmitOrder()}
                      disabled={loading}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      {loading ? 'Memproses...' : 'Kirim Pemesanan & Selesai'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Checkout Success with tracking and credentials details */}
              {step === 4 && (
                <div className="text-center py-10 space-y-5 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900">Pemesanan Sukses Terkirim!</h2>
                  
                  <div className="space-y-3.5 text-xs text-slate-500 leading-relaxed">
                    <p>
                      Terima kasih banyak atas kepercayaan Anda bermitra dengan <strong>RTI</strong>.
                    </p>
                    <p>
                      Pesanan Anda telah aman terdaftar di database kami. Sebagai langkah awal kolaborasi strategis ini, kami telah membuatkan akun akses resmi Anda untuk masuk ke <strong>Portal Klien RTI</strong>.
                    </p>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-left text-blue-900 space-y-1.5 shadow-sm">
                      <div className="font-bold flex items-center space-x-1.5">
                        <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Kredensial Akses Telah Dikirim!</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-blue-700">
                        Kami telah mengirimkan detail username dan password sementara untuk login ke email terdaftar Anda: <strong className="font-semibold text-blue-900">{formData.email}</strong>. Harap periksa folder kotak masuk atau spam Anda.
                      </p>
                    </div>
                    <p className="pt-2">
                      Melalui Portal Klien, Anda dapat langsung mengunggah berkas scoping teknis, memantau milestones pengerjaan proyek secara real-time 24/7, serta mengunduh quotation dan invoice resmi.
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/portal"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-2 w-full"
                    >
                      <span>Masuk ke Portal Klien</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}
