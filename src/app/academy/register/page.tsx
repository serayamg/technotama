'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  GraduationCap, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, 
  User, Mail, Phone, Briefcase, Award, BookOpen, AlertCircle,
  FileText, CreditCard, Plus, Trash2, Check, PenTool
} from 'lucide-react';

interface CertificationEntry {
  name: string;
  year: string;
  certNumber: string;
}

export default function AcademyRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // A. Informasi Program
    classOption: 'Basic Level',
    participantType: 'Individu',

    // B. Data Pribadi
    name: '',
    nikPaspor: '',
    birthPlaceDate: '',
    gender: 'Laki-laki',
    address: '',
    domicile: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',

    // C. Latar Belakang Pendidikan
    educationLevel: 'S1',
    school: '',
    major: '',
    gpa: '',
    employmentStatus: 'Mahasiswa Aktif',

    // D. Pengalaman Kerja
    workCompany: '',
    workJobTitle: '',
    workDuration: '',
    workDescription: '',

    // E. Pengalaman IT (Array stored as stringified JSON)
    itExperience: [] as string[],

    // F. Pengalaman Cybersecurity (Array stored as stringified JSON)
    cyberExperience: [] as string[],

    // G. Sertifikasi Yang Dimiliki
    certifications: [] as CertificationEntry[],

    // H. Tujuan Mengikuti Bootcamp
    bootcampGoals: [] as string[],

    // I. Pilihan Paket
    packageOption: 'Bootcamp Saja',

    // J. Dokumen (Filenames simulated)
    uploadedDocuments: {
      ktpPaspor: '',
      pasFoto: '',
      cv: '',
      ijazahTranskripKtm: '',
      sertifikatPendukung: ''
    },

    // K. Metode Pembayaran
    paymentMethod: 'Transfer Bank',

    // Q. Tanda Tangan & Corporate
    signatureName: '',
    signatureDate: new Date().toISOString().split('T')[0],
    corpName: '',
    corpPic: '',
    corpJobTitle: ''
  });

  const [pdpConsent, setPdpConsent] = useState(false);
  const [rulesConsent, setRulesConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [certInput, setCertInput] = useState<CertificationEntry>({ name: '', year: '', certNumber: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckboxListChange = (listName: 'itExperience' | 'cyberExperience' | 'bootcampGoals', item: string) => {
    setFormData(prev => {
      const currentList = prev[listName] as string[];
      const exists = currentList.includes(item);
      let updatedList: string[];
      if (exists) {
        updatedList = currentList.filter(i => i !== item);
      } else {
        updatedList = [...currentList, item];
      }
      return {
        ...prev,
        [listName]: updatedList
      };
    });
  };

  const handleAddCertification = () => {
    if (!certInput.name || !certInput.year) {
      alert('Nama Sertifikasi dan Tahun wajib diisi.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, certInput]
    }));
    setCertInput({ name: '', year: '', certNumber: '' });
  };

  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== index)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docKey: keyof typeof formData.uploadedDocuments) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setFormData(prev => ({
        ...prev,
        uploadedDocuments: {
          ...prev.uploadedDocuments,
          [docKey]: fileName
        }
      }));
    }
  };

  const nextStep = () => {
    // Basic validation per step before proceeding
    if (step === 1) {
      if (!formData.name || !formData.nikPaspor || !formData.birthPlaceDate || !formData.address || !formData.domicile || !formData.email || !formData.phone || !formData.linkedin) {
        alert('Mohon isi semua data pribadi yang bertanda bintang (*).');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Format email tidak valid.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.school || !formData.major) {
        alert('Mohon isi nama Universitas/Sekolah dan Jurusan Anda.');
        return;
      }
    }
    if (step === 4) {
      const docs = formData.uploadedDocuments;
      if (!docs.ktpPaspor || !docs.pasFoto || !docs.cv || !docs.ijazahTranskripKtm) {
        alert('Mohon unggah dokumen wajib (Foto KTP, Pas Foto, CV, dan Ijazah/Transkrip/KTM).');
        return;
      }
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdpConsent || !rulesConsent) {
      alert('Mohon setujui persetujuan peserta dan syarat & ketentuan untuk melanjutkan.');
      return;
    }
    if (!formData.signatureName) {
      alert('Tanda tangan nama lengkap wajib diisi.');
      return;
    }
    if (formData.participantType === 'Corporate' && (!formData.corpName || !formData.corpPic || !formData.corpJobTitle)) {
      alert('Informasi PIC Corporate dan Stempel wajib diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/academy/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          itExperience: JSON.stringify(formData.itExperience),
          cyberExperience: JSON.stringify(formData.cyberExperience),
          certifications: JSON.stringify(formData.certifications),
          bootcampGoals: JSON.stringify(formData.bootcampGoals),
          uploadedDocuments: JSON.stringify(formData.uploadedDocuments)
        })
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

  // Static content lists for UI
  const itExperienceOptions = [
    'Windows Administration', 'Linux', 'Networking', 'Firewall', 
    'Cloud', 'Programming', 'Database', 'Virtualization', 
    'Docker', 'Kubernetes', 'Belum Ada'
  ];

  const cyberExperienceOptions = [
    'SOC', 'Vulnerability Assessment', 'Penetration Testing', 
    'Incident Response', 'Digital Forensics', 'Threat Hunting', 
    'GRC', 'ISO 27001', 'SIEM', 'EDR', 'Belum Pernah'
  ];

  const bootcampGoalOptions = [
    'Persiapan Kerja', 'Career Switching', 'Kebutuhan Perusahaan', 
    'Kenaikan Jabatan', 'Menambah Skill', 'Persiapan Sertifikasi Internasional', 'Lainnya'
  ];

  const paymentMethods = [
    'Transfer Bank', 'Virtual Account', 'QRIS', 
    'Kartu Kredit', 'Cicilan 0%', 'Purchase Order (Corporate)', 'Termin Perusahaan'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
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

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-blue-600">
            <GraduationCap className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">FORM PENDAFTARAN</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Bootcamp Cybersecurity Professional
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Silakan lengkapi formulir pendaftaran secara bertahap. Data Anda dijamin kerahasiaannya dan diproses secara aman.
          </p>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="relative mb-10">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
          
          <div className="relative flex justify-between z-10">
            {[1, 2, 3, 4, 5].map((s) => {
              const label = s === 1 ? 'Program & Personal' : s === 2 ? 'Latar Belakang' : s === 3 ? 'Kualifikasi' : s === 4 ? 'Metode & Dokumen' : 'Persetujuan';
              const isActive = step === s;
              const isCompleted = step > s;
              
              return (
                <div key={s} className="flex flex-col items-center">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold text-xs transition-all ${
                      isActive 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' 
                        : isCompleted 
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className="hidden sm:block text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wide">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
          
          <div className="p-6 sm:p-10">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {!success ? (
              <div className="space-y-8">
                {/* STEP 1: INFORMASI PROGRAM & DATA PRIBADI */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* A. Informasi Program */}
                    <div className="space-y-4">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>A. Informasi Program</span>
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Program</label>
                          <input
                            type="text"
                            disabled
                            value="Cybersecurity Professional Bootcamp"
                            className="w-full text-xs font-bold text-slate-500 border border-slate-200 rounded-xl px-4 py-3 bg-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Pilihan Kelas *</label>
                          <select
                            name="classOption"
                            value={formData.classOption}
                            onChange={handleChange}
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          >
                            <option value="Basic Level">Basic Level (Fondasi & Keamanan Dasar)</option>
                            <option value="Intermediate Level">Intermediate Level (Ofensif & Defensif Praktis)</option>
                            <option value="Advanced Level">Advanced Level (Spesialisasi & Kesiapan Industri)</option>
                            <option value="Belum Mengetahui">Belum Mengetahui (Mengikuti Placement Assessment)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Jenis Peserta *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {['Individu', 'Corporate', 'Mahasiswa', 'Fresh Graduate', 'Instansi Pemerintah', 'BUMN/BUMD'].map((type) => (
                            <label
                              key={type}
                              onClick={() => setFormData(prev => ({ ...prev, participantType: type }))}
                              className={`flex items-center space-x-2.5 p-3 border rounded-xl cursor-pointer transition-all ${
                                formData.participantType === type 
                                  ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="participantType"
                                checked={formData.participantType === type}
                                onChange={() => {}}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
                              />
                              <span className="text-[11px]">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* B. Data Pribadi */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>B. Data Pribadi</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nama Lengkap sesuai KTP/Paspor"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">NIK / Nomor Paspor *</label>
                          <input
                            type="text"
                            name="nikPaspor"
                            required
                            value={formData.nikPaspor}
                            onChange={handleChange}
                            placeholder="Nomor Identitas Kependudukan / Paspor"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tempat & Tanggal Lahir *</label>
                          <input
                            type="text"
                            name="birthPlaceDate"
                            required
                            value={formData.birthPlaceDate}
                            onChange={handleChange}
                            placeholder="Contoh: Jakarta, 17 Agustus 1998"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Jenis Kelamin *</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Alamat Lengkap (KTP) *</label>
                          <textarea
                            name="address"
                            required
                            rows={2}
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Alamat lengkap sesuai identitas resmi"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Domisili Saat Ini *</label>
                          <textarea
                            name="domicile"
                            required
                            rows={2}
                            value={formData.domicile}
                            onChange={handleChange}
                            placeholder="Kota/Provinsi tempat tinggal saat ini"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Email Aktif *</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@domain.com"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nomor WhatsApp *</label>
                          <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Contoh: 087883336017"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Profil LinkedIn *</label>
                          <input
                            type="text"
                            name="linkedin"
                            required
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Github Link (Opsional)</label>
                          <input
                            type="text"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            placeholder="https://github.com/username"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: LATAR BELAKANG PENDIDIKAN & PENGALAMAN KERJA */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* C. Latar Belakang Pendidikan */}
                    <div className="space-y-4">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>C. Latar Belakang Pendidikan</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Pendidikan Terakhir *</label>
                          <select
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          >
                            <option value="SMA/SMK">SMA / SMK / Sederajat</option>
                            <option value="D3">Diploma 3 (D3)</option>
                            <option value="D4/S1">Diploma 4 / Sarjana 1 (S1)</option>
                            <option value="S2">Pascasarjana 2 (S2)</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Universitas / Sekolah *</label>
                          <input
                            type="text"
                            name="school"
                            required
                            value={formData.school}
                            onChange={handleChange}
                            placeholder="Nama Lembaga Pendidikan"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Jurusan *</label>
                          <input
                            type="text"
                            name="major"
                            required
                            value={formData.major}
                            onChange={handleChange}
                            placeholder="Contoh: Teknik Informatika / Rekayasa Perangkat Lunak"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">IPK Terakhir (Opsional)</label>
                          <input
                            type="text"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            placeholder="Contoh: 3.50"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Status Saat Ini *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {['Mahasiswa Aktif', 'Fresh Graduate', 'Karyawan', 'Freelancer', 'Lainnya'].map((status) => (
                            <label
                              key={status}
                              onClick={() => setFormData(prev => ({ ...prev, employmentStatus: status }))}
                              className={`flex items-center space-x-2.5 p-3 border rounded-xl cursor-pointer transition-all ${
                                formData.employmentStatus === status 
                                  ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="employmentStatus"
                                checked={formData.employmentStatus === status}
                                onChange={() => {}}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
                              />
                              <span className="text-[11px]">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* D. Pengalaman Kerja */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>D. Pengalaman Kerja (Opsional / Terakhir)</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Perusahaan</label>
                          <input
                            type="text"
                            name="workCompany"
                            value={formData.workCompany}
                            onChange={handleChange}
                            placeholder="Nama Perusahaan"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Jabatan / Role</label>
                          <input
                            type="text"
                            name="workJobTitle"
                            value={formData.workJobTitle}
                            onChange={handleChange}
                            placeholder="Contoh: IT Support / Staff"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Lama Bekerja</label>
                          <input
                            type="text"
                            name="workDuration"
                            value={formData.workDuration}
                            onChange={handleChange}
                            placeholder="Contoh: 2 Tahun"
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Deskripsi Pekerjaan</label>
                        <textarea
                          name="workDescription"
                          rows={2}
                          value={formData.workDescription}
                          onChange={handleChange}
                          placeholder="Jelaskan ringkas tanggung jawab dan tugas pekerjaan Anda sebelumnya"
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PENGALAMAN IT, CYBERSECURITY, SERTIFIKASI & TUJUAN */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* E. Pengalaman IT */}
                    <div className="space-y-4">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>E. Pengalaman IT (Kemampuan IT)</span>
                      </h2>
                      <p className="text-[10px] text-slate-500 mt-1">Centang seluruh kemampuan teknis IT yang telah Anda miliki saat ini:</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {itExperienceOptions.map((item) => {
                          const isChecked = formData.itExperience.includes(item);
                          return (
                            <label
                              key={item}
                              className={`flex items-center space-x-2 p-2.5 border rounded-lg cursor-pointer transition-all ${
                                isChecked 
                                  ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-600'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxListChange('itExperience', item)}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-[10px]">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* F. Pengalaman Cybersecurity */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>F. Pengalaman Cybersecurity</span>
                      </h2>
                      <p className="text-[10px] text-slate-500 mt-1">Centang area keamanan siber yang pernah Anda pelajari atau praktekkan:</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {cyberExperienceOptions.map((item) => {
                          const isChecked = formData.cyberExperience.includes(item);
                          return (
                            <label
                              key={item}
                              className={`flex items-center space-x-2 p-2.5 border rounded-lg cursor-pointer transition-all ${
                                isChecked 
                                  ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-600'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxListChange('cyberExperience', item)}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-[10px]">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* G. Sertifikasi Yang Dimiliki */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>G. Sertifikasi Yang Dimiliki</span>
                      </h2>

                      {formData.certifications.length > 0 && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              <tr>
                                <th className="px-4 py-2.5">Nama Sertifikasi</th>
                                <th className="px-4 py-2.5">Tahun</th>
                                <th className="px-4 py-2.5">Nomor Sertifikat</th>
                                <th className="px-4 py-2.5 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                              {formData.certifications.map((c, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2.5 font-semibold">{c.name}</td>
                                  <td className="px-4 py-2.5">{c.year}</td>
                                  <td className="px-4 py-2.5 font-mono text-[10px]">{c.certNumber || '-'}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCertification(idx)}
                                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Input Sertifikasi Baru</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <input
                              type="text"
                              value={certInput.name}
                              onChange={(e) => setCertInput(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Nama Sertifikasi (e.g. CEH / CCNA)"
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={certInput.year}
                              onChange={(e) => setCertInput(prev => ({ ...prev, year: e.target.value }))}
                              placeholder="Tahun Perolehan (e.g. 2024)"
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={certInput.certNumber}
                              onChange={(e) => setCertInput(prev => ({ ...prev, certNumber: e.target.value }))}
                              placeholder="Nomor Sertifikat (Opsional)"
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={handleAddCertification}
                              className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* H. Tujuan Mengikuti Bootcamp */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>H. Tujuan Mengikuti Bootcamp</span>
                      </h2>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {bootcampGoalOptions.map((item) => {
                          const isChecked = formData.bootcampGoals.includes(item);
                          return (
                            <label
                              key={item}
                              className={`flex items-center space-x-2 p-2.5 border rounded-lg cursor-pointer transition-all ${
                                isChecked 
                                  ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-600'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxListChange('bootcampGoals', item)}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-[10px]">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PILIHAN PAKET, DOKUMEN & METODE PEMBAYARAN */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* I. Pilihan Paket */}
                    <div className="space-y-4">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>I. Pilihan Paket Bootcamp</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { name: 'Bootcamp Saja', desc: 'Akses penuh ke kelas materi, laboratorium siber siber praktis, dan e-sertifikat.' },
                          { name: 'Bootcamp + Voucher Sertifikasi', desc: 'Termasuk voucher ujian sertifikasi internasional kompetensi siber terkemuka.' },
                          { name: 'Bootcamp + Sertifikasi + Career Coaching', desc: 'Pendampingan CV, portofolio, simulasi wawancara siber, dan penyaluran kerja.' },
                          { name: 'Corporate Training', desc: 'Kurikulum kustomisasi, jadwal fleksibel, dan sertifikasi khusus instansi/BUMN.' }
                        ].map((pkg) => (
                          <label
                            key={pkg.name}
                            onClick={() => setFormData(prev => ({ ...prev, packageOption: pkg.name }))}
                            className={`p-4 border rounded-xl cursor-pointer text-left transition-all flex flex-col justify-between ${
                              formData.packageOption === pkg.name 
                                ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500 text-blue-900 font-bold' 
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 mb-1.5">
                              <input
                                type="radio"
                                name="packageOption"
                                checked={formData.packageOption === pkg.name}
                                onChange={() => {}}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
                              />
                              <span className="text-xs font-extrabold">{pkg.name}</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-slate-500 font-normal ml-6">{pkg.desc}</p>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* J. Dokumen Wajib Upload */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>J. Dokumen Yang Wajib Diupload</span>
                      </h2>
                      <p className="text-[10px] text-red-500 font-semibold mb-3">* Seluruh berkas harus diunggah dalam format PDF/Gambar (maks. 5MB) untuk verifikasi akademik.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: 'ktpPaspor', label: 'Foto KTP / Paspor *' },
                          { key: 'pasFoto', label: 'Pas Foto Terbaru *' },
                          { key: 'cv', label: 'CV Terbaru (PDF) *' },
                          { key: 'ijazahTranskripKtm', label: 'Ijazah / Transkrip Nilai / KTM *' },
                        ].map((doc) => (
                          <div key={doc.key} className="border border-dashed border-slate-300 rounded-xl p-3.5 bg-slate-50 hover:bg-slate-100/50 transition-colors flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-600 block">{doc.label}</span>
                              <span className="text-[9px] font-mono text-slate-400 block max-w-[200px] truncate">
                                {formData.uploadedDocuments[doc.key as keyof typeof formData.uploadedDocuments] || 'Belum ada berkas dipilih'}
                              </span>
                            </div>
                            <label className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer text-[10px] font-bold text-slate-700 shadow-sm shrink-0">
                              Pilih Berkas
                              <input 
                                type="file" 
                                required
                                accept=".pdf,image/*"
                                onChange={(e) => handleFileUpload(e, doc.key as keyof typeof formData.uploadedDocuments)} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="border border-dashed border-slate-300 rounded-xl p-3.5 bg-slate-50 hover:bg-slate-100/50 transition-colors flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 block">Sertifikat Pendukung (Opsional)</span>
                          <span className="text-[9px] font-mono text-slate-400 block max-w-[400px] truncate">
                            {formData.uploadedDocuments.sertifikatPendukung || 'Belum ada berkas dipilih'}
                          </span>
                        </div>
                        <label className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer text-[10px] font-bold text-slate-700 shadow-sm shrink-0">
                          Pilih Berkas
                          <input 
                            type="file" 
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileUpload(e, 'sertifikatPendukung')} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>

                    {/* K. Metode Pembayaran */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>K. Pilihan Metode Pembayaran</span>
                      </h2>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {paymentMethods.map((method) => {
                          const isSelected = formData.paymentMethod === method;
                          return (
                            <label
                              key={method}
                              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                              className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              <span className="text-[10px]">{method}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: SYARAT KETENTUAN, PERSETUJUAN & TANDA TANGAN */}
                {step === 5 && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alur, Ketentuan, Pembatalan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 border-b pb-1.5 uppercase text-[10px] tracking-wide text-blue-700">L. Alur Pendaftaran</h4>
                        <ol className="list-decimal pl-4 space-y-1 text-[10px] leading-relaxed">
                          <li>Mengisi formulir pendaftaran lengkap.</li>
                          <li>Mengikuti Placement Assessment menentukan level.</li>
                          <li>Akademik memverifikasi berkas persyaratan.</li>
                          <li>Peserta menerima hasil & rekomendasi kelas.</li>
                          <li>Invoice tagihan resmi diterbitkan.</li>
                          <li>Pembayaran sesuai metode & verifikasi admin.</li>
                          <li>Menerima LMS, jadwal kelas, & akses lab siber.</li>
                        </ol>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 border-b pb-1.5 uppercase text-[10px] tracking-wide text-blue-700">M. Ketentuan Pembayaran</h4>
                        <ul className="list-disc pl-4 space-y-1 text-[10px] leading-relaxed">
                          <li>Invoice berlaku selama 7 hari kalender.</li>
                          <li>Kursi kelas terkonfirmasi setelah pembayaran terverifikasi.</li>
                          <li>Tersedia pembayaran penuh maupun skema cicilan resmi.</li>
                          <li>Corporate training mengikuti kontrak kerja sama.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 border-b pb-1.5 uppercase text-[10px] tracking-wide text-blue-700">N. Kebijakan Pembatalan</h4>
                        <ul className="list-disc pl-4 space-y-1 text-[10px] leading-relaxed">
                          <li>Pembatalan &gt; 14 hari: pengembalian dana 80%.</li>
                          <li>Pembatalan 7–14 hari: pengembalian dana 50%.</li>
                          <li>Pembatalan &lt; 7 hari sebelum kelas: dana hangus.</li>
                          <li>Jika kelas dibatalkan panitia: refund dana 100%.</li>
                        </ul>
                      </div>
                    </div>

                    {/* O & P. Persetujuan & T&C */}
                    <div className="space-y-4">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>O & P. Kebijakan, Syarat & Ketentuan Peserta</span>
                      </h2>

                      <div className="h-40 overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50 text-[10px] leading-relaxed text-slate-500 space-y-3 font-semibold shadow-inner">
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">PERSETUJUAN PESERTA:</span>
                          <p>1. Seluruh data identitas, pendidikan, dan dokumen yang saya berikan adalah benar dan valid.</p>
                          <p>2. Bersedia mengikuti seluruh aturan akademik dan tata tertib praktikum laboratorium siber.</p>
                          <p>3. Tidak akan menyalahgunakan materi pelatihan atau laboratorium siber untuk aktivitas yang melanggar hukum.</p>
                          <p>4. Memahami bahwa sertifikat kompetensi kelulusan diberikan setelah memenuhi seluruh persyaratan akademik.</p>
                          <p>5. Memahami bahwa kepesertaan dalam kelas persiapan sertifikasi internasional tidak menjamin kelulusan ujian sertifikasi.</p>
                          <p>6. Memberikan izin kepada penyelenggara untuk menggunakan data pribadi sesuai ketentuan perlindungan data yang berlaku (UU PDP).</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">TERMS AND CONDITIONS (KETENTUAN HUKUM):</span>
                          <p>• Seluruh materi pelatihan merupakan hak kekayaan intelektual (HAKI) PT Riset Teknologi Indonesia.</p>
                          <p>• Akun Learning Management System (LMS) hanya boleh digunakan oleh peserta terdaftar secara eksklusif.</p>
                          <p>• Rekaman kelas tidak boleh diperjualbelikan, disebarluaskan, atau dipublikasikan ke publik.</p>
                          <p>• Kehadiran minimal 80% kelas interaktif merupakan syarat kelulusan program.</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="flex items-start space-x-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl cursor-pointer select-none">
                          <input
                            type="checkbox"
                            required
                            checked={pdpConsent}
                            onChange={(e) => setPdpConsent(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0 mt-0.5"
                          />
                          <span className="text-[10px] leading-relaxed text-slate-500 font-bold">
                            Saya memberikan persetujuan kepada PT Riset Teknologi Indonesia untuk mengumpulkan, menyimpan, dan memproses data pribadi yang saya isi di atas untuk keperluan pendaftaran program bootcamp RTI Academy ini sesuai dengan regulasi UU Pelindungan Data Pribadi (UU PDP). *
                          </span>
                        </label>

                        <label className="flex items-start space-x-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl cursor-pointer select-none">
                          <input
                            type="checkbox"
                            required
                            checked={rulesConsent}
                            onChange={(e) => setRulesConsent(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0 mt-0.5"
                          />
                          <span className="text-[10px] leading-relaxed text-slate-500 font-bold">
                            Saya menyetujui seluruh Terms and Conditions (poin P) yang diberlakukan oleh penyelenggara RTI Academy. *
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Q. Tanda Tangan */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h2 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2 flex items-center space-x-2">
                        <PenTool className="w-4 h-4 text-blue-600" />
                        <span>Q. Tanda Tangan Persetujuan</span>
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Participant Signature Box */}
                        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b pb-1.5">TANDA TANGAN PESERTA</span>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap Peserta *</label>
                            <input
                              type="text"
                              name="signatureName"
                              required
                              value={formData.signatureName}
                              onChange={handleChange}
                              placeholder="Ketik Nama Lengkap Anda (E-Signature)"
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 font-display"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tanggal Penandatanganan *</label>
                            <input
                              type="date"
                              name="signatureDate"
                              required
                              value={formData.signatureDate}
                              onChange={handleChange}
                              className="w-full text-xs font-semibold text-slate-850 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-white text-center">
                            <span className="font-signature text-xl text-blue-600/90 italic tracking-wider block mb-1">
                              {formData.signatureName || '[ E-Signature ]'}
                            </span>
                            <span className="text-[8px] font-semibold text-slate-400 block">SISTEM VALIDASI DIGITAL RTI ACADEMY</span>
                          </div>
                        </div>

                        {/* Corporate PIC Box */}
                        {formData.participantType === 'Corporate' && (
                          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b pb-1.5">UNTUK CORPORATE (PIC PERUSAHAAN)</span>
                            
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Perusahaan *</label>
                              <input
                                type="text"
                                name="corpName"
                                required
                                value={formData.corpName}
                                onChange={handleChange}
                                placeholder="Nama Lengkap Perusahaan"
                                className="w-full text-xs font-semibold text-slate-850 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3.5">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">PIC Perusahaan *</label>
                                <input
                                  type="text"
                                  name="corpPic"
                                  required
                                  value={formData.corpPic}
                                  onChange={handleChange}
                                  placeholder="Nama PIC"
                                  className="w-full text-xs font-semibold text-slate-850 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Jabatan PIC *</label>
                                <input
                                  type="text"
                                  name="corpJobTitle"
                                  required
                                  value={formData.corpJobTitle}
                                  onChange={handleChange}
                                  placeholder="Jabatan"
                                  className="w-full text-xs font-semibold text-slate-850 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-white text-center">
                              <span className="text-[9px] font-bold text-slate-500 block">Stempel Perusahaan & Tanda Tangan PIC</span>
                              <span className="text-[8px] font-semibold text-slate-400 block mt-1">(Pembayaran melalui invoice tagihan korporat / PO resmi)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                )}

                {/* Navigation Buttons inside footer card */}
                <div className="border-t border-slate-100 pt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Sebelumnya</span>
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Selanjutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>{submitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Resmi'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-10 space-y-5 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm animate-pulse">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display font-extrabold text-xl text-slate-900">Pendaftaran Bootcamp Terkirim!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Terima kasih telah mendaftar di <strong>RTI Cybersecurity Academy</strong>. Dokumen pendaftaran dan identitas Anda telah masuk ke sistem kami.
                  </p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Tim akademik kami akan segera melakukan verifikasi dokumen dan mengirimkan tautan <strong>Placement Assessment</strong> ke nomor WhatsApp atau email Anda dalam 1x24 jam kerja.
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
