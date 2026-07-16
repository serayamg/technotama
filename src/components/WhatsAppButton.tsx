'use client';

import React, { useState } from 'react';
import { Phone, X, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'VA & Penetration Testing',
    needs: '',
    timeline: '1 Bulan',
    budget: 'Rp 50 Juta - Rp 150 Juta'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Assemble text parameter for WhatsApp Business
    const text = `Halo RTI,
Saya tertarik menggunakan layanan berikut: ${formData.service}

Nama: ${formData.name}
Perusahaan: ${formData.company}
Email: ${formData.email}
Nomor HP: ${formData.phone}
Kebutuhan: ${formData.needs}
Timeline: ${formData.timeline}
Budget: ${formData.budget}`;

    const whatsappUrl = `https://wa.me/6285668722734?text=${encodeURIComponent(text)}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button (Placed on Left to not overlap Chatbot) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none"
        aria-label="Hubungi WhatsApp RTI"
      >
        <Phone className="w-6 h-6 animate-pulse" />
      </button>

      {/* WhatsApp Quick Form Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <h3 className="font-display font-extrabold text-sm leading-tight">Hubungi WhatsApp Business</h3>
                  <p className="text-[10px] text-emerald-100 font-semibold mt-0.5">Tanggapan instan dari Konsultan RTI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-emerald-700 transition-colors text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 max-h-[360px] overflow-y-auto bg-slate-50">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Perusahaan *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Perusahaan"
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Kerja *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812xxxxxx"
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Layanan yang Diminati</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option>VA & Penetration Testing</option>
                  <option>Standard Implementation (ISO 27001/etc)</option>
                  <option>Technology Strategy</option>
                  <option>IT Governance, Risk & Compliance</option>
                  <option>Cybersecurity Strategy</option>
                  <option>CyberTroops Training Academy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estimasi Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option> &lt; Rp 50 Juta </option>
                    <option>Rp 50 Juta - Rp 150 Juta</option>
                    <option>Rp 150 Juta - Rp 500 Juta</option>
                    <option> &gt; Rp 500 Juta </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Timeline Proyek</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>1 Bulan</option>
                    <option>2 Bulan</option>
                    <option>3 Bulan</option>
                    <option>6 Bulan+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detail Kebutuhan / Pesan *</label>
                <textarea
                  name="needs"
                  required
                  value={formData.needs}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ceritakan singkat kebutuhan keamanan siber Anda..."
                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>Kirim Ke WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
