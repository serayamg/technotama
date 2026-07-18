'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Shield, Loader2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
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
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('WhatsApp fallback used in Chatbot.'));
  }, []);

  const getCleanWhatsAppNumber = () => {
    const rawNumber = siteConfig?.general?.whatsappNumber || '0856-6872-2734';
    const clean = rawNumber.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      return '62' + clean.slice(1);
    }
    return clean.startsWith('62') ? clean : '62' + clean;
  };

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
        botText = 'RTI menawarkan 3 kluster layanan utama:\n1. Cybersecurity Governance RTI (Rencana Induk, Policy-SOP, ISO, BCM, Cyber Drill, Audit TI)\n2. Offensive Cybersecurity RTI (VA, Penetration Testing, Secure SDLC, Red Teaming)\n3. Defensive Cybersecurity (SOC, Threat Intelligence, Hardening, Incident Response, Forensik)';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '📋 Detail Governance', action: 'detail_gov' },
          { label: '⚔️ Detail Offensive', action: 'detail_off' },
          { label: '🛡️ Detail Defensive', action: 'detail_def' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_off':
        botText = 'Layanan Offensive Cybersecurity RTI mencakup Vulnerability Assessment (VA), Penetration Testing (Web, Mobile, API, Network), Secure SDLC Implementation, dan Red Teaming (Simulasi Serangan Nyata).';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_gov':
        botText = 'Layanan Cybersecurity Governance RTI mencakup Cybersecurity Blueprint, Policy-SOP Development (Tata Kelola TI), ISO/IEC Implementation, BCM-BCP-DRP Services (Cyber Drill), Digital Maturity Assessment, Awareness & Training, dan IT Audit.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_def':
        botText = 'Layanan Defensive Cybersecurity RTI mencakup Security Operation Center (SOC) 24/7, Cyber Threat Intelligence (CTI) Solution, Network & Endpoint Hardening, Cyber Security Incident Management, dan Digital Forensic.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
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
        { label: 'Offensive Cybersecurity (VA/Pentest)', action: 'lead_off' },
        { label: 'Cybersecurity Governance (GRC/ISO)', action: 'lead_gov' },
        { label: 'Defensive Cybersecurity (SOC/CTI)', action: 'lead_def' },
        { label: 'Lainnya', action: 'lead_other' }
      ];
    } else if (leadStep === 4) {
      currentData.email = text;
      nextStep = 5;
      botText = 'Berapa nomor handphone/WhatsApp Anda agar kami bisa mengirim penawaran?';
    } else if (leadStep === 5) {
      currentData.phone = text;
      nextStep = 6;
      botText = 'Berapa perkiraan budget proyek ini?';
      options = [
        { label: '< Rp 50 Juta', action: 'budget_small' },
        { label: 'Rp 50Jt - Rp 150Jt', action: 'budget_med' },
        { label: 'Rp 150Jt+', action: 'budget_large' }
      ];
    } else if (leadStep === 3 || leadStep === 6 || leadStep === 7) {
      botText = 'Mohon pilih salah satu opsi tombol di atas untuk melanjutkan.';
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

    if (action === 'main_menu') {
      setLeadStep(0);
      triggerBotResponse('main_menu', label);
      return;
    }

    if (leadStep === 3 && action.startsWith('lead_')) {
      const servicesMap: Record<string, string> = {
        lead_off: 'Offensive Cybersecurity (VA/Pentest)',
        lead_gov: 'Cybersecurity Governance (GRC/ISO)',
        lead_def: 'Defensive Cybersecurity (SOC/CTI)',
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
      const budgetMap: Record<string, string> = {
        budget_small: '< Rp 50 Juta',
        budget_med: 'Rp 50Jt - Rp 150Jt',
        budget_large: 'Rp 150Jt+'
      };
      setLeadData(prev => ({ ...prev, budget: budgetMap[action] }));
      setLeadStep(7);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Berapa target timeline proyek ini?',
          options: [
            { label: '1 Bulan', action: 'timeline_1m' },
            { label: '2 Bulan', action: 'timeline_2m' },
            { label: '3-6 Bulan', action: 'timeline_3_6m' }
          ]
        }
      ]);
      return;
    }

    if (leadStep === 7 && action.startsWith('timeline_')) {
      const timelineMap: Record<string, string> = {
        timeline_1m: '1 Bulan',
        timeline_2m: '2 Bulan',
        timeline_3_6m: '3-6 Bulan'
      };

      const finalData = {
        ...leadData,
        timeline: timelineMap[action]
      };

      setLeadData(finalData);
      setLeadStep(8);

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
      const waLink = `https://wa.me/${getCleanWhatsAppNumber()}?text=${encodeURIComponent(waText)}`;

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

    if (leadStep > 0 && leadStep < 8) {
      handleLeadFlow(text);
    } else {
      // Rule-based keyword matching
      const lowText = text.toLowerCase();
      if (lowText.includes('vapt') || lowText.includes('pentest') || lowText.includes('penetrasi') || lowText.includes('offensive') || lowText.includes('ofensif')) {
        triggerBotResponse('detail_off', text);
      } else if (lowText.includes('iso') || lowText.includes('27001') || lowText.includes('kepatuhan') || lowText.includes('governance') || lowText.includes('grc') || lowText.includes('kebijakan')) {
        triggerBotResponse('detail_gov', text);
      } else if (lowText.includes('soc') || lowText.includes('defensive') || lowText.includes('defensif') || lowText.includes('hardening')) {
        triggerBotResponse('detail_def', text);
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
        className="fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none"
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
            className="fixed bottom-24 right-6 z-[60] w-96 max-w-[calc(100vw-2rem)] h-[500px] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/logo.png" 
                  alt="Logo PT Riset Teknologi Indonesia" 
                  className="w-8 h-8 object-contain bg-white rounded-md p-0.5"
                />
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

                  {/* Render Options (Only for the latest message) */}
                  {msg.options && msg.options.length > 0 && messages[messages.length - 1].id === msg.id && (
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
            <div className="border-t border-slate-200 bg-white">
              {leadStep > 0 && (
                <div className="px-3 pt-2 pb-1.5 bg-slate-50/50 border-b border-slate-100 flex items-start space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
                    Saya menyetujui pemrosesan data pribadi saya oleh RTI untuk keperluan penghitungan estimasi biaya sesuai regulasi UU Pelindungan Data Pribadi (UU PDP).
                  </p>
                </div>
              )}
              <div className="p-3 flex items-center space-x-2">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
