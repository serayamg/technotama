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
  const [leadStep, setLeadStep] = useState(0); // 0 = none, 1 = Name, 2 = Company, 3 = Service, 4 = Scoping, 5 = Email, 6 = Phone, 7 = Budget, 8 = Timeline, 9 = Done
  const [leadData, setLeadData] = useState({
    name: '',
    company: '',
    role: '',
    service: '',
    scopingDetails: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
  });
  const [currentContextService, setCurrentContextService] = useState<string | null>(null);

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
          { label: '🎓 RTI Academy', action: 'academy_flow' },
          { label: '📞 Hubungi Konsultan', action: 'consultant' }
        ]
      }
    ]);
  }, []);

  const triggerBotResponse = async (userAction: string, userText: string) => {
    // Track context service
    if (['off_va', 'off_pentest', 'off_ssdlc', 'off_redteam', 'detail_off'].includes(userAction)) {
      setCurrentContextService('Offensive Cybersecurity (VA/Pentest)');
    } else if (['gov_blueprint', 'gov_policy', 'gov_iso', 'gov_bcm', 'gov_maturity', 'gov_awareness', 'gov_audit', 'detail_gov'].includes(userAction)) {
      setCurrentContextService('Cybersecurity Governance (GRC/ISO)');
    } else if (['def_soc', 'def_cti', 'def_hardening', 'def_incident', 'def_forensic', 'detail_def'].includes(userAction)) {
      setCurrentContextService('Defensive Cybersecurity (SOC/CTI)');
    } else if (['main_menu', 'services', 'frameworks', 'consultant'].includes(userAction)) {
      setCurrentContextService(null);
    }

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
        botText = 'Layanan Offensive Cybersecurity RTI mencakup berbagai metode pengujian keamanan siber proaktif. Layanan mana yang ingin Anda pelajari lebih lanjut?';
        options = [
          { label: '🔍 Vulnerability Assessment (VA)', action: 'off_va' },
          { label: '⚔️ Penetration Testing (Pentest)', action: 'off_pentest' },
          { label: '💻 Secure SDLC Implementation', action: 'off_ssdlc' },
          { label: '🛡️ Red Teaming', action: 'off_redteam' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'off_va':
        botText = '🔍 Vulnerability Assessment (VA) mengidentifikasi dan memetakan celah keamanan siber pada infrastruktur, server, dan jaringan organisasi Anda secara otomatis dan berkala.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Offensive', action: 'detail_off' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'off_pentest':
        botText = '⚔️ Penetration Testing (Web, Mobile, API, Network) melakukan simulasi peretasan terkontrol oleh ethical hacker kami untuk mengeksploitasi dan melaporkan kerentanan sistem Anda secara mendalam.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Offensive', action: 'detail_off' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'off_ssdlc':
        botText = '💻 Secure SDLC Implementation mengintegrasikan praktik dan pengujian keamanan siber (security checks) pada setiap tahap siklus pengembangan software Anda (DevSecOps).';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Offensive', action: 'detail_off' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'off_redteam':
        botText = '🛡️ Red Teaming mensimulasikan taktik serangan nyata (Advanced Persistent Threat) tanpa pemberitahuan sebelumnya untuk menguji kesiapan tim deteksi dan respons keamanan Anda.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Offensive', action: 'detail_off' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_gov':
        botText = 'Layanan Cybersecurity Governance RTI mencakup berbagai program strategis. Layanan mana yang ingin Anda pelajari lebih lanjut?';
        options = [
          { label: '📘 Cybersecurity Blueprint', action: 'gov_blueprint' },
          { label: '📜 Policy-SOP Development', action: 'gov_policy' },
          { label: '🔒 ISO/IEC Implementation', action: 'gov_iso' },
          { label: '🔄 BCM-BCP-DRP (Cyber Drill)', action: 'gov_bcm' },
          { label: '📊 Digital Maturity Assessment', action: 'gov_maturity' },
          { label: '🎓 Awareness & Training', action: 'gov_awareness' },
          { label: '🔎 IT Audit', action: 'gov_audit' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_blueprint':
        botText = '📘 Cybersecurity Blueprint membantu organisasi menyusun rencana induk (roadmap) jangka panjang pertahanan siber yang selaras dengan tata kelola TI dan tujuan bisnis Anda.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_policy':
        botText = '📜 Policy-SOP Development (Tata Kelola TI) merancang kebijakan keamanan informasi, pedoman kerja, dan Standar Operasional Prosedur (SOP) tata kelola siber organisasi Anda.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_iso':
        botText = '🔒 ISO/IEC Implementation membantu persiapan kepatuhan sertifikasi standar ISO/IEC 27001 (Sistem Manajemen Keamanan Informasi) secara end-to-end dari gap analisis hingga pendampingan audit.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_bcm':
        botText = '🔄 BCM-BCP-DRP Services (Cyber Drill) menguji ketahanan bisnis dan pemulihan bencana sistem melalui simulasi ancaman siber (cyber drill) nyata untuk memastikan kelangsungan operasional.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_maturity':
        botText = '📊 Digital Maturity Assessment mengukur indeks kematangan keamanan siber dan kesiapan digital organisasi Anda saat ini berdasarkan framework standar internasional.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_awareness':
        botText = '🎓 Awareness & Training mengedukasi seluruh staf mengenai ancaman siber terbaru, metode rekayasa sosial (phishing), serta melatih refleks kepatuhan siber dasar.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'gov_audit':
        botText = '🔎 IT Audit melakukan penilaian independen terhadap kepatuhan, keandalan kontrol internal sistem informasi, dan infrastruktur tata kelola TI organisasi Anda.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Governance', action: 'detail_gov' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'detail_def':
        botText = 'Layanan Defensive Cybersecurity RTI mencakup berbagai sistem pertahanan dan respons siber aktif. Layanan mana yang ingin Anda pelajari lebih lanjut?';
        options = [
          { label: '🛡️ Security Operation Center (SOC) 24/7', action: 'def_soc' },
          { label: '📡 Cyber Threat Intelligence (CTI)', action: 'def_cti' },
          { label: '🔒 Network & Endpoint Hardening', action: 'def_hardening' },
          { label: '🚨 Incident Management', action: 'def_incident' },
          { label: '🔎 Digital Forensic', action: 'def_forensic' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'def_soc':
        botText = '🛡️ Security Operation Center (SOC) 24/7 menyediakan pemantauan keamanan siber secara real-time non-stop untuk mendeteksi, menganalisis, dan merespons ancaman secara instan.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Defensive', action: 'detail_def' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'def_cti':
        botText = '📡 Cyber Threat Intelligence (CTI) mengumpulkan dan menganalisis data ancaman siber global untuk memprediksi, mencegah, dan mengantisipasi serangan sebelum terjadi pada organisasi Anda.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Defensive', action: 'detail_def' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'def_hardening':
        botText = '🔒 Network & Endpoint Hardening memperkuat pertahanan infrastruktur jaringan, server, dan perangkat kerja (endpoints) dengan menutup celah konfigurasi berbahaya.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Defensive', action: 'detail_def' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'def_incident':
        botText = '🚨 Cyber Security Incident Management memberikan penanganan dan penanggulangan cepat saat insiden serangan siber terjadi guna meminimalisir dampak kerugian bisnis.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Defensive', action: 'detail_def' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'def_forensic':
        botText = '🔎 Digital Forensic melakukan investigasi mendalam pasca-insiden untuk melacak asal-usul serangan, mengumpulkan bukti digital, dan menyusun laporan forensik formal.';
        options = [
          { label: '💰 Estimasi Proyek', action: 'start_lead' },
          { label: '↩ Layanan Defensive', action: 'detail_def' },
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
      case 'academy_flow':
        botText = '🎓 RTI Cybersecurity Academy menyediakan Program Cybersecurity Professional Bootcamp (Industry Ready Cybersecurity Workforce Program) untuk melatih SDM siber handal siap kerja.\n\nApakah Anda ingin mendaftar ke program Bootcamp ini atau berkonsultasi terlebih dahulu dengan tim Admisi RTI Academy?';
        options = [
          { label: '📝 Daftar Bootcamp Sekarang', action: 'go_academy_register' },
          { label: '💬 Konsultasi Admisi Academy', action: 'go_academy_consult' },
          { label: '↩ Menu Utama', action: 'main_menu' }
        ];
        break;
      case 'main_menu':
        botText = 'Bagaimana saya bisa membantu organisasi Anda hari ini?';
        options = [
          { label: '🔍 Tanya Layanan', action: 'services' },
          { label: '📊 Jelaskan Framework', action: 'frameworks' },
          { label: '💰 Estimasi Biaya Proyek', action: 'start_lead' },
          { label: '🎓 RTI Academy', action: 'academy_flow' },
          { label: '📞 Hubungi Konsultan', action: 'consultant' }
        ];
        break;
      case 'thank_you':
        botText = 'Senang bisa membantu Anda hari ini! Khusus untuk langkah awal Anda hari ini, kami menyertakan analisis risiko awal gratis di sesi pertama kita. Jangan lewatkan kesempatan ini—amankan slot Anda sekarang dengan klik [Schedule a Call] dan mari buat bisnis Anda selangkah lebih aman.';
        options = [
          { label: '📅 Schedule a Call', action: 'go_consultation' },
          { label: '↩ Menu Utama', action: 'main_menu' }
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
      if (currentData.service) {
        nextStep = 5;
        botText = `Baik, terkait layanan ${currentData.service} yang telah Anda pilih, selanjutnya untuk memudahkan tim RTI berkomunikasi lebih lanjut dengan Anda, mohon disampaikan alamat email profesional Anda.`;
      } else {
        nextStep = 3;
        botText = 'Layanan apa yang Anda butuhkan?';
        options = [
          { label: 'Offensive Cybersecurity (VA/Pentest)', action: 'lead_off' },
          { label: 'Cybersecurity Governance (GRC/ISO)', action: 'lead_gov' },
          { label: 'Defensive Cybersecurity (SOC/CTI)', action: 'lead_def' },
          { label: 'Lainnya', action: 'lead_other' }
        ];
      }
    } else if (leadStep === 5) {
      currentData.email = text;
      nextStep = 6;
      botText = 'Untuk memudahkan proses koordinasi lebih lanjut dan agar kami bisa mengirim penawaran, mohon disampaikan nomor handphone/WhatsApp Anda?';
    } else if (leadStep === 6) {
      currentData.phone = text;
      nextStep = 7;
      botText = 'Berapa perkiraan budget proyek ini?';
      options = [
        { label: '< Rp 50 Juta', action: 'budget_small' },
        { label: 'Rp 50Jt - Rp 150Jt', action: 'budget_med' },
        { label: 'Rp 150Jt+', action: 'budget_large' }
      ];
    } else if (leadStep === 3 || leadStep === 4 || leadStep === 7 || leadStep === 8) {
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
      setLeadData({
        name: '',
        company: '',
        role: '',
        service: currentContextService || '',
        scopingDetails: '',
        email: '',
        phone: '',
        budget: '',
        timeline: '',
      });
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Perkenankan kami memahami kebutuhan Anda dengan lebih baik. Siapa nama lengkap Anda?'
        }
      ]);
      return;
    }

    if (action === 'main_menu') {
      setLeadStep(0);
      triggerBotResponse('main_menu', label);
      return;
    }

    if (action === 'go_proposal') {
      window.location.href = '/request-proposal';
      return;
    }

    if (action === 'go_consultation') {
      window.location.href = '/online-consultation';
      return;
    }

    if (action === 'go_order') {
      window.location.href = '/online-order';
      return;
    }

    if (action === 'go_academy_register') {
      window.location.href = '/academy/register';
      return;
    }

    if (action === 'go_academy_consult') {
      const waText = 'Halo Tim Admisi RTI Academy, saya tertarik untuk berkonsultasi mengenai program Cybersecurity Professional Bootcamp.';
      const url = `https://wa.me/${getCleanWhatsAppNumber()}?text=${encodeURIComponent(waText)}`;
      window.open(url, '_blank');
      return;
    }

    if (leadStep === 3 && action.startsWith('lead_')) {
      const servicesMap: Record<string, string> = {
        lead_off: 'Offensive Cybersecurity (VA/Pentest)',
        lead_gov: 'Cybersecurity Governance (GRC/ISO)',
        lead_def: 'Defensive Cybersecurity (SOC/CTI)',
        lead_other: 'Lainnya'
      };
      const chosenService = servicesMap[action];
      setLeadData(prev => ({ ...prev, service: chosenService }));
      setLeadStep(5);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Baik, terkait layanan ${chosenService} yang telah Anda pilih, selanjutnya untuk memudahkan tim RTI berkomunikasi lebih lanjut dengan Anda, mohon disampaikan alamat email profesional Anda.`
        }
      ]);
      return;
    }

    if (leadStep === 4 && action.startsWith('scoping_')) {
      const scopingMap: Record<string, string> = {
        scoping_off_1_3: '1-3 Target Aplikasi/IP',
        scoping_off_4_10: '4-10 Target Aplikasi/IP',
        scoping_off_10: '10+ Target / Skala Enterprise',
        scoping_gov_iso: 'Sertifikasi ISO/IEC 27001',
        scoping_gov_reg: 'Kepatuhan Regulasi BI/OJK/UU PDP',
        scoping_gov_blue: 'Penyusunan Blueprint / Policy-SOP',
        scoping_def_soc: 'SOC Monitoring 24/7',
        scoping_def_hard: 'Hardening & Incident Response',
        scoping_def_cti: 'Threat Intelligence',
        scoping_oth_audit: 'Persiapan Audit Eksternal',
        scoping_oth_routine: 'Perlindungan Rutin Berkala',
        scoping_oth_general: 'Konsultasi Umum'
      };

      setLeadData(prev => ({ ...prev, scopingDetails: scopingMap[action] }));
      setLeadStep(5);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Baik, selanjutnya untuk memudahkan tim RTI berkomunikasi lebih lanjut dengan Anda, mohon disampaikan alamat email profesional Anda.'
        }
      ]);
      return;
    }

    if (leadStep === 7 && action.startsWith('budget_')) {
      const budgetMap: Record<string, string> = {
        budget_small: '< Rp 50 Juta',
        budget_med: 'Rp 50Jt - Rp 150Jt',
        budget_large: 'Rp 150Jt+'
      };
      setLeadData(prev => ({ ...prev, budget: budgetMap[action] }));
      setLeadStep(8);
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

    if (leadStep === 8 && action.startsWith('timeline_')) {
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
      setLeadStep(9);

      setIsTyping(true);
      // Save lead to database API
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: finalData.name,
            email: finalData.email,
            phone: finalData.phone,
            company: finalData.company,
            role: 'Client Portal Chat',
            needs: `Kebutuhan Layanan: ${finalData.service} (${finalData.scopingDetails || ''}). Budget: ${finalData.budget}. Timeline: ${finalData.timeline}.`,
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
      const waText = `Halo RTI, saya tertarik menggunakan layanan berikut: ${finalData.service} (${finalData.scopingDetails || ''}).\nNama: ${finalData.name}\nPerusahaan: ${finalData.company}\nEmail: ${finalData.email}\nNomor HP: ${finalData.phone}\nTimeline: ${finalData.timeline}\nBudget: ${finalData.budget}`;
      const waLink = `https://wa.me/${getCleanWhatsAppNumber()}?text=${encodeURIComponent(waText)}`;

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Terima kasih! Kami telah mencatat detail kebutuhan Anda:\n• Layanan: ${finalData.service} (${finalData.scopingDetails || ''})\n• Estimasi Budget: ${finalData.budget}\n• Target Timeline: ${finalData.timeline}\n\nUntuk memproses penawaran resmi atau konsultasi tatap muka, Anda dapat langsung melakukan estimasi formal dan memesan solusi dengan menjadwalkan konsultasi gratis atau mengirimkan request proposal di bawah ini.`,
          options: [
            { label: '📄 Request Proposal', action: 'go_proposal' },
            { label: '📅 Jadwalkan Konsultasi', action: 'go_consultation' },
            { label: '🛒 Order Solusi Instan', action: 'go_order' },
            { label: '📲 Hubungkan ke WhatsApp', action: `wa_link:${waLink}` },
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

    if (leadStep > 0 && leadStep < 9) {
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
      } else if (lowText.includes('academy') || lowText.includes('bootcamp') || lowText.includes('pelatihan') || lowText.includes('belajar') || lowText.includes('admisi') || lowText.includes('training')) {
        triggerBotResponse('academy_flow', text);
      } else if (lowText.includes('terima kasih') || lowText.includes('terimakasih') || lowText.includes('cukup') || lowText.includes('akhiri')) {
        triggerBotResponse('thank_you', text);
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
            className="fixed z-[60] bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-96 h-[500px] max-w-[calc(100vw-2rem)] sm:max-w-none flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
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
                  <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
                    Saya menyetujui pemrosesan data pribadi saya oleh RTI untuk keperluan kami memahami kebutuhan Anda dengan lebih baik sesuai regulasi UU Pelindungan Data Pribadi (UU PDP).
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
