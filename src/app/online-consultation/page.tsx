'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  Calendar as CalendarIcon, Clock, Video, User, CheckCircle2, 
  HelpCircle, ChevronRight, Laptop, VideoOff
} from 'lucide-react';

const timeSlots = [
  '09:00 - 10:00 WIB',
  '10:30 - 11:30 WIB',
  '13:30 - 14:30 WIB',
  '15:00 - 16:00 WIB'
];

const topics = [
  { id: 'vapt', name: 'Keamanan Teknis & VA/Pentest' },
  { id: 'iso', name: 'Kesiapan Kepatuhan ISO (27001/22301)' },
  { id: 'governance', name: 'COBIT & SPBE Governance' },
  { id: 'pdp', name: 'UU Pelindungan Data Pribadi (DPO)' }
];

export default function OnlineConsultation() {
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    topic: 'Keamanan Teknis & VA/Pentest',
    date: '2026-07-20', // Default date
    time: '10:30 - 11:30 WIB',
    platform: 'Google Meet',
    name: '',
    email: '',
    company: '',
    phone: '',
    description: ''
  });

  const handleSelectTopic = (name: string) => {
    setBookingDetails(prev => ({ ...prev, topic: name }));
    setStep(2);
  };

  const handleSelectDateTime = (date: string, time: string) => {
    setBookingDetails(prev => ({ ...prev, date, time }));
    setStep(3);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBookingDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
    console.log('[AUDIT LOG] Meeting booked: topic=', bookingDetails.topic, 'date=', bookingDetails.date, 'time=', bookingDetails.time, 'platform=', bookingDetails.platform);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Booking Virtual Consultation
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Pilih topik konsultasi dan jadwalkan tatap muka virtual dengan Konsultan TI & Ahli Cybersecurity Senior PT Riset Teknologi Indonesia.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[450px]">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

            {/* Stepper Header */}
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between text-xs font-bold text-slate-400">
              <span className={step === 1 ? 'text-blue-600' : 'text-slate-500'}>1. Pilih Topik</span>
              <ChevronRight className="w-4 h-4" />
              <span className={step === 2 ? 'text-blue-600' : 'text-slate-500'}>2. Jadwal & Waktu</span>
              <ChevronRight className="w-4 h-4" />
              <span className={step === 3 ? 'text-blue-600' : 'text-slate-500'}>3. Detail Kontak</span>
              <ChevronRight className="w-4 h-4" />
              <span className={step === 4 ? 'text-blue-600' : 'text-slate-500'}>4. Konfirmasi</span>
            </div>

            {/* Steps Body */}
            <div className="p-8">
              {/* Step 1: Choose Topic */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Pilih Topik Konsultasi Awal</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topics.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTopic(t.name)}
                        className="p-6 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/10 text-left transition-all shadow-sm flex items-center justify-between group focus:outline-none cursor-pointer"
                      >
                        <div>
                          <h3 className="font-display font-extrabold text-sm text-slate-800">{t.name}</h3>
                          <p className="text-[10px] text-slate-400 mt-1">Konsultansi awal gratis selama 45 menit.</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time Select */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Pilih Tanggal & Jam Pertemuan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Calendar select placeholder */}
                    <div className="md:col-span-6 space-y-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pilih Tanggal</label>
                      <input
                        type="date"
                        min="2026-07-16"
                        value={bookingDetails.date}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500"
                      />
                      <div className="text-[10px] text-slate-500 italic">
                        * Hari kerja Senin - Jumat pukul 09.00 - 17.00 WIB.
                      </div>
                    </div>

                    {/* Time slots */}
                    <div className="md:col-span-6 space-y-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slot Waktu Tersedia</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {timeSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectDateTime(bookingDetails.date, slot)}
                            className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                              bookingDetails.time === slot
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
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
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Form */}
              {step === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <h2 className="font-display font-extrabold text-base text-slate-900">Lengkapi Informasi Kontak Anda</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={bookingDetails.name}
                        onChange={handleChange}
                        placeholder="Nama Anda"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nama Perusahaan *</label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={bookingDetails.company}
                        onChange={handleChange}
                        placeholder="PT Contoh Perusahaan"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Email Kerja *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={bookingDetails.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nomor Handphone / WhatsApp *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={bookingDetails.phone}
                        onChange={handleChange}
                        placeholder="0812xxxxxx"
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Platform Video Conference</label>
                      <select
                        name="platform"
                        value={bookingDetails.platform}
                        onChange={handleChange}
                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option>Google Meet</option>
                        <option>Zoom Meeting</option>
                        <option>Microsoft Teams</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Catatan Masalah / Kebutuhan (Opsional)</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={bookingDetails.description}
                      onChange={handleChange}
                      placeholder="Ceritakan singkat kendala teknis atau kebutuhan sertifikasi yang ingin dicapai..."
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="pt-6 flex justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                    >
                      Jadwalkan Pertemuan
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Success confirmation */}
              {step === 4 && (
                <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900">Jadwal Konsultasi Dikonfirmasi!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pertemuan Anda dengan Konsultan Senior RTI telah dijadwalkan secara otomatis. Kami telah mengirimkan undangan Google Calendar ke email Anda beserta tautan virtual room:
                  </p>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left text-xs space-y-2.5 font-medium">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Topik Diskusi</span>
                      <span className="text-slate-800 font-bold">{bookingDetails.topic}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] block">Tanggal</span>
                        <span className="text-slate-800 font-bold">{bookingDetails.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] block">Waktu</span>
                        <span className="text-slate-800 font-bold">{bookingDetails.time}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Platform & Link</span>
                      <div className="flex items-center space-x-1.5 text-blue-600 font-bold">
                        <Video className="w-4 h-4" />
                        <a href="https://meet.google.com/mock-rti-meeting" target="_blank" rel="noreferrer" className="underline hover:text-blue-700">
                          {bookingDetails.platform} Link (Klik untuk bergabung)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                    >
                      Kembali ke Beranda
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
