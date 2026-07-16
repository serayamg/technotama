'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Shield, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: string }[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lead Collection State Flow
  const [leadStep, setLeadStep] = useState(0); // 0 = not in flow, 1 = Name, 2 = Company, 3 = Service, 4 = Email, 5 = Phone, 6 = Budget/Timeline, 7 = Done
  const [leadData, setLeadData] = useState({
    name: '',
    company: '',
    role: '',
    service: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'Halo! Saya RTI Cyber Assistant. Ada yang bisa saya bantu terkait layanan tata kelola TI, VAPT, atau kepatuhan keamanan siber PT Riset Teknologi Indonesia?',
        options: [
          { label: '🔍 Tanya Layanan', action: 'services' },
          { label: '📊 Jelaskan Framework', action: 'frameworks' },
          { label: '💰 Estimasi Biaya Proyek', action: 'start_lead' },
          { label: '📞 Hubungi Konsultan', action: 'consultant' }
        ]
      }
    ]);
  }, []);

  const triggerBotResponse = async (userAction: string, userText: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTyping(false);

    let botText = '';
    let options: { label: string; action: string }[] | undefined = undefined;

    switch (userAction) {
      case 'services':
        botText = 'RTI menawarkan 5 pilar layanan utama:\n1. Technology Strategy (ITMP & Arsitektur SPBE)\n2. IT Governance, Risk & Compliance (COBIT & Manajemen Risiko)\n3. Cybersecurity Offense (VAPT & Red Teaming)\n4. Cybersecurity Defense (MDR & Managed SOC)\n5. Cyber Academy & Deployment (CyberTroops Bootcamp)';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '🔍 Detail VAPT', action: 'detail_vapt' },
          { label: '📘 Detail ISO 27001', action: 'detail_iso' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_vapt':
        botText = 'Layanan Cybersecurity Offense (VAPT) kami mencakup penetration testing untuk Web, Mobile, API, dan Jaringan berdasarkan standar OWASP, didukung laporan teknis & eksekutif untuk kepatuhan OJK/BI.';
        options = [
          { label: '💰 Estimasi Biaya Pentest', action: 'start_lead' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_iso':
        botText = 'Kami membantu penyusunan dokumen Kebijakan Keamanan (SMKI), analisis kesenjangan (Gap Analysis), hingga pendampingan audit sertifikasi ISO/IEC 27001:2022 untuk perbankan, fintech, dan instansi pemerintah.';
        options = [
          { label: '💰 Estimasi ISO', action: 'start_lead' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'frameworks':
        botText = 'Kami menggunakan kerangka kerja internasional berbasis best practice seperti COBIT 2019 (tata kelola TI), TOGAF 9.2 (arsitektur enterprise), ISO 27001 (SMKI), NIST CSF (cybersecurity), SABSA, PCI DSS, CIS Controls, dan MITRE ATT&CK.';
        options = [
          { label: '💰 Asesmen Kematangan', action: 'start_lead' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'consultant':
        botText = 'Anda dapat berkonsultasi langsung dengan Tim Konsultan Senior RTI. Silakan tinggalkan detail kontak Anda agar kami dapat menghubungi Anda dalam waktu 1x24 jam.';
        options = [
          { label: '✍ Mulai Isi Kontak', action: 'start_lead' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'main_menu':
        botText = 'Bagaimana saya bisa membantu organisasi Anda hari ini?';
        options = [
          { label: '🔍 Tanya Layanan', action: 'services' },
          { label: '📊 Jelaskan Framework', action: 'frameworks' },
          { label: '💰 Estimasi Biaya Proyek', action: 'start_lead' },
          { label: '📞 Hubungi Konsultan', action: 'consultant' }
        ];
        break;
      default:
        botText = 'Maaf, saya tidak mengerti perintah itu. Hubungi konsultan kami untuk diskusi lebih lanjut.';
        options = [{ label: '↩ Menu Utama', action: 'main_menu' }];
    }

    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: botText,
        options
      }
    ]);
  };

  // Lead collection flow
  const handleLeadFlow = async (text: string) => {
    let nextStep = leadStep;
    let botText = '';
    let options: { label: string; action: string }[] | undefined = undefined;

    const currentData = { ...leadData };

    if (leadStep === 1) {
      currentData.name = text;
      nextStep = 2;
      botText = `Terima kasih Pak/Bu ${text}. Apa nama Perusahaan/Instansi Anda dan apa Jabatan Anda?`;
    } else if (leadStep === 2) {
      currentData.company = text;
      nextStep = 3;
      botText = 'Layanan apa yang Anda butuhkan?';
      options = [
        { label: 'VA & Penetration Testing', action: 'lead_vapt' },
        { label: 'Sertifikasi ISO 27001', action: 'lead_iso' },
        { label: 'Tata Kelola TI (COBIT/SPBE)', action: 'lead_gov' },
        { label: 'Lainnya', action: 'lead_other' }
      ];
    } else if (leadStep === 4) {
      currentData.email = text;
      nextStep = 5;
      botText = 'Berapa nomor handphone/WhatsApp Anda agar kami bisa mengirim penawaran?';
    } else if (leadStep === 5) {
      currentData.phone = text;
      nextStep = 6;
      botText = 'Berapa perkiraan budget dan target timeline proyek ini?';
      options = [
        { label: '< Rp 50 Juta (1 Bulan)', action: 'budget_small' },
        { label: 'Rp 50Jt - Rp 150Jt (2 Bulan)', action: 'budget_med' },
        { label: 'Rp 150Jt+ (3-6 Bulan)', action: 'budget_large' }
      ];
    }

    setLeadData(currentData);
    setLeadStep(nextStep);

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTyping(false);

    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: botText,
        options
      }
    ]);
  };

  const handleOptionClick = async (label: string, action: string) => {
    // Add user message
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: label }
    ]);

    // Handle lead wizard actions
    if (action === 'start_lead') {
      setLeadStep(1);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Mari kita hitung estimasi biaya proyek Anda. Siapa nama lengkap Anda?'
        }
      ]);
      return;
    }

    if (leadStep === 3 && action.startsWith('lead_')) {
      const servicesMap: Record<string, string> = {
        lead_vapt: 'VA & Penetration Testing',
        lead_iso: 'Sertifikasi ISO 27001',
        lead_gov: 'Tata Kelola TI (COBIT/SPBE)',
        lead_other: 'Lainnya'
      };
      setLeadData(prev => ({ ...prev, service: servicesMap[action] }));
      setLeadStep(4);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Bagus. Silakan masukkan alamat email profesional Anda.'
        }
      ]);
      return;
    }

    if (leadStep === 6 && action.startsWith('budget_')) {
      const budgetMap: Record<string, { budget: string; timeline: string }> = {
        budget_small: { budget: '< Rp 50 Juta', timeline: '1 Bulan' },
        budget_med: { budget: 'Rp 50Jt - Rp 150Jt', timeline: '2 Bulan' },
        budget_large: { budget: 'Rp 150Jt+', timeline: '3-6 Bulan' }
      };

      const finalData = {
        ...leadData,
        budget: budgetMap[action].budget,
        timeline: budgetMap[action].timeline
      };

      setLeadData(finalData);
      setLeadStep(7);

      setIsTyping(true);
      // Save lead to database API
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: finalData.name,
            email: finalData.email,
            phone: finalData.phone,
            company: finalData.company,
            role: 'Client Portal Chat',
            needs: `Kebutuhan Layanan: ${finalData.service}. Budget: ${finalData.budget}. Timeline: ${finalData.timeline}.`,
            budget: finalData.budget,
            timeline: finalData.timeline,
            source: 'CHATBOT'
          })
        });
      } catch (err) {
        console.error('Failed to save chatbot lead:', err);
      }
      setIsTyping(false);

      // Generate WhatsApp Link
      const waText = `Halo RTI, saya tertarik menggunakan layanan berikut: ${finalData.service}.\nNama: ${finalData.name}\nPerusahaan: ${finalData.company}\nEmail: ${finalData.email}\nNomor HP: ${finalData.phone}\nTimeline: ${finalData.timeline}\nBudget: ${finalData.budget}`;
      const waLink = `https://wa.me/6285668722734?text=${encodeURIComponent(waText)}`;

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Terima kasih! Kami telah mencatat kebutuhan Anda.\n\nEstimasi awal untuk proyek ${finalData.service} dengan skala tersebut berkisar antara ${finalData.budget}. Konsultan kami akan menghubungi Anda segera melalui Email (${finalData.email}) atau WhatsApp (${finalData.phone}).\n\nUntuk respon cepat, Anda dapat langsung menghubungkan penawaran ini ke WhatsApp Business kami.`,
          options: [
            { label: '📲 Hubungkan ke WhatsApp RTI', action: `wa_link:${waLink}` },
            { label: '↩ Menu Utama', action: 'main_menu' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('wa_link:')) {
      const url = action.replace('wa_link:', '');
      window.open(url, '_blank');
      return;
    }

    // Default flow
    triggerBotResponse(action, label);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user text
    const text = inputText;
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text }
    ]);
    setInputText('');

    if (leadStep > 0 && leadStep < 7) {
      handleLeadFlow(text);
    } else {
      // Rule-based keyword matching
      const lowText = text.toLowerCase();
      if (lowText.includes('vapt') || lowText.includes('pentest') || lowText.includes('penetrasi')) {
        triggerBotResponse('detail_vapt', text);
      } else if (lowText.includes('iso') || lowText.includes('27001') || lowText.includes('kepatuhan')) {
        triggerBotResponse('detail_iso', text);
      } else if (lowText.includes('biaya') || lowText.includes('harga') || lowText.includes('estimasi') || lowText.includes('budget')) {
        handleOptionClick('💰 Estimasi Biaya Proyek', 'start_lead');
      } else {
        triggerBotResponse('main_menu', text);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none"
        aria-label="Chatbot RTI"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[500px] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                  <Shield className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-sm leading-tight">RTI Cyber Assistant</div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Aktif &bull; Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed whitespace-pre-line shadow-sm border ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none'
                          : 'bg-white text-slate-800 border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Render Options */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-9">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt.label, opt.action)}
                          className="text-[11px] font-bold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-full shadow-sm transition-all duration-150"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-3.5 py-3.5 shadow-sm">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="border-t border-slate-200 p-3 bg-white flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  leadStep === 1 ? 'Ketik nama lengkap Anda...' :
                  leadStep === 2 ? 'Ketik nama perusahaan Anda...' :
                  leadStep === 4 ? 'Ketik alamat email Anda...' :
                  leadStep === 5 ? 'Ketik nomor HP WhatsApp...' :
                  'Ketik pesan Anda...'
                }
                className="flex-1 text-xs font-semibold text-slate-800 border border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white rounded-lg px-3 py-2.5 focus:outline-none transition-all duration-200"
              />
              <button
                onClick={handleSend}
                className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-200 flex items-center justify-center focus:outline-none"
                aria-label="Kirim"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
