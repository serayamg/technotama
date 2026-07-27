'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FileText, Send, CheckCircle2, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';

export default function RequestProposal() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'Banking & Finance',
    employees: '100 - 500',
    location: '',
    serviceType: '',
    details: '',
    budget: 'Rp 50 Juta - Rp 150 Juta',
    timeline: '2 Bulan',
    fileName: '',
    captchaInput: ''
  });

  const [services, setServices] = useState<string[]>([]);

  // Math Captcha state
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({
      num1,
      num2,
      answer: num1 + num2
    });
  };

  useEffect(() => {
    generateCaptcha();
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.services && data.services.length > 0) {
          const names = data.services.map((s: any) => s.title);
          setServices(names);
          setFormData(prev => ({
            ...prev,
            serviceType: names[0]
          }));
        } else {
          const fallback = [
            'Cybersecurity Blueprint',
            'Policy-SOP Development',
            'ISO/IEC Implementation',
            'BCM-BCP-DRP Services (Cyber Drill)',
            'Digital Maturity Assessment & Security Risk Rating',
            'Awareness & Training',
            'IT Audit',
            'Vulnerability Assessment (VA)',
            'Penetration Testing (Pen-Test)',
            'Secure SDLC Implementation',
            'Red Teaming',
            'Security Operation Center (SOC)',
            'Cyber Threat Intelligence (CTI) Solution',
            'Network & Endpoint Hardening',
            'Cyber Security Incident Management',
            'Digital Forensic'
          ];
          setServices(fallback);
          setFormData(prev => ({
            ...prev,
            serviceType: fallback[0]
          }));
        }
      })
      .catch(err => {
        console.error(err);
        const fallback = [
          'Cybersecurity Blueprint',
          'Policy-SOP Development',
          'ISO/IEC Implementation',
          'BCM-BCP-DRP Services (Cyber Drill)',
          'Digital Maturity Assessment & Security Risk Rating',
          'Awareness & Training',
          'IT Audit',
          'Vulnerability Assessment (VA)',
          'Penetration Testing (Pen-Test)',
          'Secure SDLC Implementation',
          'Red Teaming',
          'Security Operation Center (SOC)',
          'Cyber Threat Intelligence (CTI) Solution',
          'Network & Endpoint Hardening',
          'Cyber Security Incident Management',
          'Digital Forensic'
        ];
        setServices(fallback);
        setFormData(prev => ({
          ...prev,
          serviceType: fallback[0]
        }));
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic MIME type validation (OWASP File Upload mitigation)
      const allowedExtensions = /(\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.zip)$/i;
      if (!allowedExtensions.exec(file.name)) {
        setErrorMsg('Tipe dokumen tidak diperbolehkan. Hanya file PDF, Word, Excel, atau ZIP yang aman.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        fileName: file.name
      }));
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    // Verify Captcha
    if (parseInt(formData.captchaInput) !== captcha.answer) {
      setErrorMsg('Jawaban Captcha tidak tepat. Silakan hitung ulang.');
      setSubmitting(false);
      generateCaptcha();
      return;
    }

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(result.error || 'Gagal mengirimkan proposal.');
        generateCaptcha();
      }
    } catch (err) {
      setErrorMsg('Koneksi internet bermasalah. Gagal menghubungi server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Request for Proposal (RFP)
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Kirimkan detail spesifikasi kebutuhan (TOR/RFP) teknologi dan keamanan siber Anda untuk mendapatkan analisis biaya & metodologi komprehensif dari konsultan senior kami.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-8 relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />

            {success ? (
              <div className="text-center py-12 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="font-display font-extrabold text-xl text-slate-900">Proposal Terkirim!</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Terima kasih. Permintaan proposal Anda telah aman tersimpan di database kami. Tim konsultan senior RTI akan mereview TOR/RFP Anda dan mengirimkan draft penawaran resmi dalam 1x24 jam kerja ke email: <strong>{formData.email}</strong>.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        industry: 'Banking & Finance',
                        employees: '100 - 500',
                        location: '',
                        serviceType: services[0] || '',
                        details: '',
                        budget: 'Rp 50 Juta - Rp 150 Juta',
                        timeline: '2 Bulan',
                        fileName: '',
                        captchaInput: ''
                      });
                      generateCaptcha();
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Kirim Form Baru
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-2 text-xs text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal info */}
                  <div className="space-y-4">
                    <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2">Detail Kontak Utama</h3>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama Anda"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Email Profesional *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nomor Telepon / WhatsApp *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Contoh: 08123456789"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Domisili Kantor (Kota) *</label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Contoh: Jakarta Selatan"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Company info */}
                  <div className="space-y-4">
                    <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2">Profil Perusahaan</h3>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Perusahaan / Instansi *</label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="PT Contoh Perusahaan"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Sektor Industri</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                        >
                          <option>Banking & Finance</option>
                          <option>Fintech & Payment Gateway</option>
                          <option>Government & Public Sector</option>
                          <option>BUMN / State-Owned Enterprise</option>
                          <option>Healthcare & Medical Services</option>
                          <option>Insurance & Actuarial</option>
                          <option>E-Commerce & Digital Retail</option>
                          <option>Telecommunications & Internet Services</option>
                          <option>IT Consulting & Software Development</option>
                          <option>Energy, Utilities & Resources</option>
                          <option>Manufacturing, Logistics & Supply Chain</option>
                          <option>Education & Academic Research</option>
                          <option>Lainnya (Other Sectors)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Jumlah Karyawan</label>
                        <select
                          name="employees"
                          value={formData.employees}
                          onChange={handleChange}
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                        >
                          <option>&lt; 100 Orang</option>
                          <option>100 - 500</option>
                          <option>500 - 1000</option>
                          <option>1000+</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Perkiraan Budget</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                        >
                          <option>&lt; Rp 50 Juta</option>
                          <option>Rp 50 Juta - Rp 150 Juta</option>
                          <option>Rp 150 Juta - Rp 500 Juta</option>
                          <option>Rp 500 Juta+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Target Timeline</label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                        >
                          <option>1 Bulan</option>
                          <option>2 Bulan</option>
                          <option>3 Bulan</option>
                          <option>6 Bulan+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-2">Spesifikasi Proyek</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Jenis Layanan Yang Dibutuhkan *</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      {services.map((svc) => (
                        <option key={svc} value={svc}>{svc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Detail Kebutuhan & Lingkup Pekerjaan *</label>
                    <textarea
                      name="details"
                      required
                      rows={4}
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Jelaskan detail spesifikasi target pengujian (jumlah aplikasi, domain, IP, dll) atau target compliance yang ingin diraih..."
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Mock file upload (OWASP File upload secure layout) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Upload Dokumen TOR / RFP (Opsional)</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 transition-colors p-6 rounded-xl text-center cursor-pointer relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      />
                      <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <div className="text-xs font-bold text-slate-700">
                        {formData.fileName ? `File Terpilih: ${formData.fileName}` : 'Pilih file TOR atau RFP Anda'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Format yang didukung: PDF, Word, Excel, ZIP (Max 10MB)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <input
                    type="checkbox"
                    id="pdp-consent"
                    required
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0 mt-0.5"
                  />
                  <label htmlFor="pdp-consent" className="text-[10px] leading-relaxed text-slate-500 font-semibold select-none">
                    Saya memberikan persetujuan kepada Technotama untuk mengumpulkan, menyimpan, dan memproses data pribadi yang saya isi di atas untuk keperluan pengajuan proposal RFP ini sesuai dengan regulasi UU Pelindungan Data Pribadi (UU PDP). *
                  </label>
                </div>

                {/* Math Captcha & Submit */}
                <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50 p-6 rounded-xl">
                  {/* Captcha */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="bg-slate-200 border border-slate-300 font-display font-extrabold text-sm px-4 py-2.5 rounded-lg select-none tracking-widest text-slate-800 flex items-center space-x-2">
                      <span>{captcha.num1} + {captcha.num2} =</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                      aria-label="Refresh Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      name="captchaInput"
                      required
                      value={formData.captchaInput}
                      onChange={handleChange}
                      placeholder="Jawaban"
                      className="w-24 text-xs font-bold text-center text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-colors cursor-pointer"
                  >
                    <span>{submitting ? 'Mengirim...' : 'Request Proposal'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Chatbot />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}
