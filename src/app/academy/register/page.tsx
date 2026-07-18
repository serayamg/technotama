'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  GraduationCap, ArrowLeft, ShieldCheck, CheckCircle2, 
  User, Mail, Phone, Briefcase, Award, BookOpen, AlertCircle 
} from 'lucide-react';

export default function AcademyRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    background: 'Mahasiswa',
    bootcampLevel: 'Basic Level (Fondasi & Keamanan Dasar)',
    certRequired: 'Ya, saya membutuhkan persiapan sertifikasi internasional (CompTIA Security+, CEH, dll)',
    prepRequired: 'Ya, saya membutuhkan pembekalan intensif langsung dari Tim Senior RTI',
  });

  const [pdpConsent, setPdpConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'certRequired' && value === 'Tidak, saya hanya fokus pada keterampilan praktis') {
        updated.prepRequired = 'Tidak, saya cukup dengan materi bootcamp reguler';
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdpConsent) {
      alert('Mohon setujui persetujuan pelindungan data pribadi untuk melanjutkan.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/academy/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(result.error || 'Terjadi kesalahan saat mengirim pendaftaran.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal terhubung ke server. Harap coba lagi beberapa saat.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/academy" 
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke RTI Academy</span>
          </Link>
        </div>

        {/* Card Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
          
          <div className="p-6 sm:p-10">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <GraduationCap className="w-6 h-6" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">Pendaftaran Peserta</span>
                  </div>
                  <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    Bootcamp RTI Cybersecurity Academy
                  </h1>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Silakan lengkapi formulir di bawah ini dengan data yang valid untuk mendaftarkan diri Anda pada program pelatihan siber intensif RTI.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-2.5 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-semibold">{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: Profil Pendaftar */}
                <div className="space-y-4">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2">Profil Pendaftar</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nama Lengkap Anda"
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Email Aktif *</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nomor HP / WhatsApp *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Contoh: 08123456789"
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Latar Belakang Saat Ini *</label>
                      <div className="relative">
                        <select
                          name="background"
                          value={formData.background}
                          onChange={handleChange}
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all appearance-none"
                        >
                          <option>Mahasiswa</option>
                          <option>Pencari Kerja (Jobseeker)</option>
                          <option>Profesional IT</option>
                          <option>Profesional Non-IT</option>
                        </select>
                        <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Pilihan Program */}
                <div className="space-y-4">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2">Program Pelatihan</h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Tingkat Bootcamp Yang Diminati *</label>
                    <div className="space-y-2">
                      {[
                        'Basic Level (Fondasi & Keamanan Dasar)',
                        'Intermediate Level (Ofensif & Defensif Praktis)',
                        'Advanced Level (Spesialisasi & Kesiapan Industri)'
                      ].map((lvl) => (
                        <label 
                          key={lvl}
                          onClick={() => handleRadioChange('bootcampLevel', lvl)}
                          className={`flex items-start space-x-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                            formData.bootcampLevel === lvl 
                              ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                              : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="bootcampLevel"
                            checked={formData.bootcampLevel === lvl}
                            onChange={() => {}}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0 mt-0.5"
                          />
                          <span className="text-xs">{lvl}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Kebutuhan Khusus */}
                <div className="space-y-4">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2">Kebutuhan Khusus Pendaftar</h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                      Apakah Anda membutuhkan sertifikasi cybersecurity berbasis internasional? *
                    </label>
                    <div className="space-y-2">
                      {[
                        'Ya, saya membutuhkan persiapan sertifikasi internasional (CompTIA Security+, CEH, dll)',
                        'Tidak, saya hanya fokus pada keterampilan praktis'
                      ].map((option) => (
                        <label 
                          key={option}
                          onClick={() => handleRadioChange('certRequired', option)}
                          className={`flex items-start space-x-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                            formData.certRequired === option 
                              ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                              : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="certRequired"
                            checked={formData.certRequired === option}
                            onChange={() => {}}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0 mt-0.5"
                          />
                          <span className="text-xs">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.certRequired === 'Ya, saya membutuhkan persiapan sertifikasi internasional (CompTIA Security+, CEH, dll)' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                        Apakah Anda membutuhkan pembekalan khusus dari Tim RTI? *
                      </label>
                      <div className="space-y-2">
                        {[
                          'Ya, saya membutuhkan pembekalan intensif langsung dari Tim Senior RTI',
                          'Tidak, saya cukup dengan materi bootcamp reguler'
                        ].map((option) => (
                          <label 
                            key={option}
                            onClick={() => handleRadioChange('prepRequired', option)}
                            className={`flex items-start space-x-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                              formData.prepRequired === option 
                                ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="prepRequired"
                              checked={formData.prepRequired === option}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0 mt-0.5"
                            />
                            <span className="text-xs">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4: Persetujuan Pelindungan Data */}
                <div className="flex items-start space-x-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <input
                    type="checkbox"
                    id="pdp-consent"
                    required
                    checked={pdpConsent}
                    onChange={(e) => setPdpConsent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0 mt-0.5"
                  />
                  <label htmlFor="pdp-consent" className="text-[10px] leading-relaxed text-slate-500 font-semibold select-none">
                    Saya memberikan persetujuan kepada RTI Academy untuk mengumpulkan, menyimpan, dan memproses data pendaftaran saya di atas untuk keperluan seleksi dan administrasi program bootcamp ini sesuai regulasi UU Pelindungan Data Pribadi (UU PDP). *
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <span>{submitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-10 space-y-5 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display font-extrabold text-lg text-slate-900">Pendaftaran Berhasil Terkirim!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Terima kasih telah mendaftar di <strong>RTI Cybersecurity Academy</strong>. Tim akademik kami akan meninjau kualifikasi Anda dan menghubungi Anda via WhatsApp/Email dalam 1x24 jam kerja untuk proses seleksi administrasi.
                  </p>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/academy"
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors inline-block"
                  >
                    Kembali ke RTI Academy
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
      <WhatsAppButton />
    </div>
  );
}
