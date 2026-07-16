'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Check, ChevronRight, FileText, Download, CreditCard, 
  CheckCircle2, ArrowRight, Loader2, Key, Info, HelpCircle
} from 'lucide-react';

const servicePricings = [
  { name: 'VA & Penetration Testing', tier: 'Professional', price: 'Rp 65.000.000', scope: '1 Web App + 1 Mobile App + 1 API' },
  { name: 'Standard Implementation (ISO 27001)', tier: 'SMKI Complete', price: 'Rp 145.000.000', scope: 'Analisis Gap, Pembuatan Kebijakan, Audit Internal, Sertifikasi' },
  { name: 'IT Governance, Risk & Compliance', tier: 'COBIT Maturity', price: 'Rp 85.000.000', scope: 'IT Maturity Level Audit & SOP Tata Kelola Baru' },
  { name: 'Cybersecurity Strategy Blueprint', tier: 'Enterprise Strategy', price: 'Rp 120.000.000', scope: 'Security Blueprint & 3-Year Implementation Roadmap' },
  { name: 'Cybersecurity Compliance Review (UU PDP)', tier: 'PDP Readiness', price: 'Rp 75.000.000', scope: 'Audit Kepatuhan UU PDP & Penyusunan DPIA/DPO framework' }
];

export default function OnlineOrder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(servicePricings[0]);
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    docName: '',
    paymentMethod: 'Bank Transfer (BCA Virtual Account)'
  });

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedService.name,
          companyName: formData.companyName,
          documentName: formData.docName || null
        })
      });

      if (response.ok) {
        setStep(6); // Final success
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

      <main className="flex-1 py-12">
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

            {/* Stepper progress */}
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className={step === 1 ? 'text-blue-600' : 'text-slate-500'}>1. Pilih Layanan</span>
              <ChevronRight className="w-4.5 h-4.5" />
              <span className={step === 2 ? 'text-blue-600' : 'text-slate-500'}>2. Isi Profil</span>
              <ChevronRight className="w-4.5 h-4.5" />
              <span className={step === 3 ? 'text-blue-600' : 'text-slate-500'}>3. Dokumen Scoping</span>
              <ChevronRight className="w-4.5 h-4.5" />
              <span className={step === 4 ? 'text-blue-600' : 'text-slate-500'}>4. Penawaran (Quotation)</span>
              <ChevronRight className="w-4.5 h-4.5" />
              <span className={step === 5 ? 'text-blue-600' : 'text-slate-500'}>5. Pembayaran</span>
              <ChevronRight className="w-4.5 h-4.5" />
              <span className={step === 6 ? 'text-blue-600' : 'text-slate-500'}>6. Tracking</span>
            </div>

            {/* Steps Body */}
            <div className="p-8">
              
              {/* Step 1: Select Service */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Pilih Layanan & Paket Transparan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {servicePricings.map((svc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedService(svc)}
                        className={`p-6 rounded-xl border text-left transition-all flex flex-col justify-between h-[180px] focus:outline-none cursor-pointer ${
                          selectedService.name === svc.name
                            ? 'bg-blue-50/10 border-blue-500 shadow-sm ring-1 ring-blue-500'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{svc.tier}</span>
                            {selectedService.name === svc.name && <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />}
                          </div>
                          <h3 className="font-display font-extrabold text-sm text-slate-800">{svc.name}</h3>
                          <p className="text-[10px] text-slate-500 leading-normal">{svc.scope}</p>
                        </div>
                        <div className="font-display font-extrabold text-base text-slate-900 border-t border-slate-100 pt-3 mt-3 w-full">
                          {svc.price} <span className="text-[10px] font-semibold text-slate-400">/ Project</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-end border-t border-slate-100">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
                        setStep(3);
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Lanjutkan ke Upload
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Document upload */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Upload Dokumen Scoping Proyek</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unggah lembar scoping awal, topologi jaringan, atau list target web/mobile (IP/URL) untuk mempercepat perhitungan proposal resmi. Anda bisa mengabaikan langkah ini jika ingin berkonsultasi scoping lewat online meeting terlebih dahulu.
                  </p>

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

                  <div className="pt-6 flex justify-between border-t border-slate-100">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Generate Quotation
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Quotation & Invoice Generation */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Quotation Resmi Project Anda</h2>
                  
                  <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                    <div className="flex justify-between items-start border-b pb-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Perusahaan Pemesan</div>
                        <div className="text-sm font-bold text-slate-800">{formData.companyName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Nomor Penawaran</div>
                        <div className="text-xs font-bold text-slate-800">QT-2026-{Math.floor(100 + Math.random() * 900)}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-700 border-b py-2">
                        <span>Layanan Keamanan</span>
                        <span>Biaya Penawaran</span>
                      </div>
                      <div className="flex justify-between py-2 text-slate-600">
                        <span>{selectedService.name} ({selectedService.tier})</span>
                        <span className="font-bold text-slate-800">{selectedService.price}</span>
                      </div>
                      <div className="flex justify-between py-2 text-slate-600">
                        <span>Scoping Dokumen: {formData.docName || 'Consultation Call Schedule'}</span>
                        <span className="text-[10px] italic text-slate-400">Included</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center">
                      <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span>Harga final sudah termasuk PPN 11% & Jasa Retest ulang gratis.</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => alert('Mengunduh draft penawaran resmi... (Mock File Download)')}
                        className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 focus:outline-none"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh Quotation (PDF)</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between border-t border-slate-100">
                    <button
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => setStep(5)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Lanjutkan ke Pembayaran
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Payment Gateway Simulation */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Simulasi Pembayaran Termin I (DP 50%)</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7 space-y-4">
                      <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white">
                        <div className="flex items-center space-x-3 text-slate-800 font-bold text-xs">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span>Pilih Bank Transfer Virtual Account</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <label className="flex items-center space-x-3 p-3 rounded-lg border border-blue-500 bg-blue-50/10 cursor-pointer">
                            <input type="radio" defaultChecked name="pay_bank" className="text-blue-600" />
                            <span className="font-bold">BCA Virtual Account</span>
                          </label>
                          <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                            <input type="radio" name="pay_bank" className="text-blue-600" />
                            <span className="font-bold">Mandiri Virtual Account</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                      <h3 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-widest">Detail Tagihan</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Total Kontrak</span>
                          <span className="font-bold text-slate-800">{selectedService.price}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Termin I (DP 50%)</span>
                          <span className="font-bold text-slate-800">
                            Rp {(parseInt(selectedService.price.replace(/[^\d]/g, '')) / 2).toLocaleString('id-ID')}.000
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-bold text-xs text-slate-800">
                        <span>Jumlah Harus Dibayar</span>
                        <span className="text-blue-600">
                          Rp {(parseInt(selectedService.price.replace(/[^\d]/g, '')) / 2).toLocaleString('id-ID')}.000
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between border-t border-slate-100">
                    <button
                      onClick={() => setStep(4)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>Bayar Termin I & Lacak Progres</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Checkout Success with tracking and credentials details */}
              {step === 6 && (
                <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900">Pemesanan Sukses Terkirim!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Terima kasih. Pesanan Anda telah tersimpan di sistem kami. Kami telah membuatkan akun di Customer Portal agar Anda bisa mengunggah deliverables, melacak milestones, dan mengunduh invoice resmi.
                  </p>

                  <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl text-left space-y-3 shadow-inner">
                    <div className="flex items-center space-x-2 text-white border-b border-slate-800 pb-2">
                      <Key className="w-4.5 h-4.5 text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Kredensial Portal Klien</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Alamat Email</span>
                        <span className="font-bold text-white">{formData.email || 'client@bankdki.co.id'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Default Password</span>
                        <span className="font-bold text-white">clientpassword123</span>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-500 italic mt-2">
                      * Silakan ganti password Anda setelah login pertama kali demi keamanan informasi.
                    </div>
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
