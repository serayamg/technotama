'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, Shield, Loader2, ArrowRight, ExternalLink, 
  Home, Calendar, Phone, Check, ChevronLeft, ChevronRight, User, Briefcase, Mail, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: string }[];
  isCalendar?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom Flow States
  const [flowType, setFlowType] = useState<'idle' | 'qualification' | 'booking_date' | 'booking_time' | 'contact_collect' | 'exit_capture' | 'completed' | 'academy_who' | 'academy_goal' | 'academy_upgrade' | 'academy_cert' | 'academy_switch' | 'academy_assessment' | 'academy_enroll'>('idle');
  
  // For contact collection step
  const [contactStep, setContactStep] = useState(1); // 1: Name, 2: Company, 3: Email, 4: Phone, 5: Title
  const [contactData, setContactData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    title: '',
  });
  const [contactPurpose, setContactPurpose] = useState<'booking' | 'proposal' | 'academic_booking'>('proposal');

  // Academy Flow States
  const [preQualIntent, setPreQualIntent] = useState<'solutions' | 'academy' | null>(null);
  const [acadGoal, setAcadGoal] = useState<string | null>(null);
  const [acadAssessmentStep, setAcadAssessmentStep] = useState(1); // 1: Usia, 2: Pendidikan, 3: Pengalaman IT, 4: Target
  const [acadAssessmentData, setAcadAssessmentData] = useState({
    age: '',
    education: '',
    experience: '',
    target: '',
  });
  const [acadEnrollStep, setAcadEnrollStep] = useState(1); // 1: Nama, 2: Email, 3: WhatsApp, 4: Domisili, 5: Pendidikan, 6: Pekerjaan, 7: Kelas, 8: Target mulai
  const [acadEnrollData, setAcadEnrollData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    domisili: '',
    pendidikan: '',
    pekerjaan: '',
    kelas: '',
    targetMulai: '',
  });

  // Qualification State
  const [qualStep, setQualStep] = useState(1); // 1: Industry, 2: Karyawan, 3: Tantangan, 4: Timeline
  const [qualData, setQualData] = useState({
    industry: '',
    employees: '',
    challenge: '',
    timeline: '',
    targetService: '',
  });

  // Booking State
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [bookingTopic, setBookingTopic] = useState('Cybersecurity Consultation');

  // Exit Capture State
  const [showExitCapture, setShowExitCapture] = useState(false);
  const [exitCaptureType, setExitCaptureType] = useState<'email' | 'whatsapp' | null>(null);

  // Active service selection context
  const [currentContextService, setCurrentContextService] = useState<string | null>(null);

  // Idle Timer State
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Terima kasih telah mengunjungi Technotama.\n\nJika di kemudian hari Anda membutuhkan informasi mengenai Cybersecurity, IT Governance, Audit, SOC, Penetration Testing, Digital Forensic, ataupun Cyber Academy, cukup buka kembali chatbot ini. Tim kami siap membantu kapan saja.\n\nSemoga hari Anda menyenangkan, dan sampai bertemu kembali.'
        }
      ]);
      setFlowType('completed');
    }, 60000); // 60 seconds
  };

  const stopIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const [existingBookings, setExistingBookings] = useState<{ date: string; time: string }[]>([]);

  const fetchBookings = () => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExistingBookings(data);
        }
      })
      .catch(err => console.error('Failed to load bookings:', err));
  };

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('WhatsApp fallback used in Chatbot.'));
    fetchBookings();
  }, []);

  const getCleanWhatsAppNumber = () => {
    const rawNumber = siteConfig?.general?.whatsappNumber || '0856-6872-2734';
    const clean = rawNumber.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      return '62' + clean.slice(1);
    }
    return clean.startsWith('62') ? clean : '62' + clean;
  };

  const getWhatsAppLink = (customText?: string) => {
    const phone = getCleanWhatsAppNumber();
    if (customText) {
      return `https://wa.me/${phone}?text=${encodeURIComponent(customText)}`;
    }

    const serviceText = currentContextService || qualData.targetService || 'Solusi Cybersecurity';
    const nameText = contactData.name || '';
    const companyText = contactData.company || '';
    
    let needsText = '';
    if (qualData.challenge) {
      needsText = `Tantangan: ${qualData.challenge}. Timeline: ${qualData.timeline}`;
    }

    const defaultMessage = `Halo Technotama,\n\nSaya tertarik dengan layanan: ${serviceText}\n\nPerusahaan: ${companyText}\nNama: ${nameText}\nKebutuhan: ${needsText}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;
  };

  const getGoogleCalendarLink = (dateStr: string, timeStr: string) => {
    const cleanedTime = timeStr.replace('.', ':'); // "09:00"
    const [hours, minutes] = cleanedTime.split(':');
    
    // Create Date in local time (WIB / UTC+7)
    const startLocal = new Date(`${dateStr}T${hours}:${minutes}:00`);
    const endLocal = new Date(startLocal.getTime() + 60 * 60 * 1000); // 1 hour
    
    const formatUTC = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const datesStr = `${formatUTC(startLocal)}/${formatUTC(endLocal)}`;
    const title = encodeURIComponent("Cybersecurity Consultation - Technotama");
    const details = encodeURIComponent(`Konsultasi virtual cybersecurity dengan Technotama. Topik: ${bookingTopic}. Dijadwalkan via Google Meet.`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesStr}&details=${details}&location=Google+Meet`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, flowType]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: '👋 Selamat datang di Technotama – Technotama.\n\nSaya adalah Technotama AI Cybersecurity Consultant.\n\nSaya siap membantu menemukan solusi cybersecurity maupun program pembelajaran yang paling sesuai untuk Anda.',
        options: [
          { label: '🛡 Explore Solutions', action: 'explore_solutions' },
          { label: '🎓 Cyber Academy', action: 'menu_academy' },
          { label: '📅 Book Consultation', action: 'book_consultation_start' },
          { label: '💬 WhatsApp', action: 'chat_whatsapp' }
        ]
      }
    ]);
  }, []);

  const triggerBotResponse = async (userAction: string, userText: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsTyping(false);

    let botText = '';
    let options: { label: string; action: string }[] | undefined = undefined;
    let isCalendar = false;

    // Track context services for WhatsApp/leads
    if (userAction.startsWith('prod_')) {
      const serviceName = userAction.replace('prod_', '').replace(/_/g, ' ');
      setCurrentContextService(serviceName);
    }

    switch (userAction) {
      case 'explore_solutions':
        setPreQualIntent('solutions');
        botText = 'Sebelum kita mulai, siapakah Anda?';
        options = [
          { label: '🏢 Saya Mewakili Perusahaan', action: 'who_corporate' },
          { label: '👨💻 Saya Individu / Profesional', action: 'who_individual' },
          { label: '🎓 Saya Mahasiswa', action: 'who_student' },
          { label: '👨🎓 Saya Fresh Graduate', action: 'who_fresh_grad' }
        ];
        break;

      case 'menu_solutions_corporate_direct':
        botText = 'Solusi apa yang sedang Anda cari?';
        options = [
          { label: '🛡 Cybersecurity Strategy', action: 'menu_strategy' },
          { label: '🔎 Assessment & Testing', action: 'menu_assessment' },
          { label: '🛡 Security Operations', action: 'menu_secops' },
          { label: '📖 Training & Academy', action: 'menu_academy' },
          { label: '⚙ Governance & Compliance', action: 'menu_gov' }
        ];
        break;

      // Menu Level 1
      case 'menu_strategy':
        botText = 'Bangun fondasi keamanan siber yang selaras dengan tujuan bisnis Anda.';
        options = [
          { label: 'Cybersecurity Blueprint', action: 'prod_blueprint' },
          { label: 'Digital Maturity Assessment', action: 'prod_maturity' },
          { label: 'Security Risk Rating', action: 'prod_risk_rating' }
        ];
        break;

      case 'menu_gov':
        botText = 'Tingkatkan tata kelola TI dan kepatuhan organisasi Anda.';
        options = [
          { label: 'IT Governance / IT GRC', action: 'prod_it_grc' },
          { label: 'ISO/IEC Implementation', action: 'prod_iso_impl' },
          { label: 'BCM / BCP / DRP', action: 'prod_bcm_bcp' },
          { label: 'IT Audit', action: 'prod_it_audit' }
        ];
        break;

      case 'menu_assessment':
        botText = 'Temukan kelemahan sebelum penyerang menemukannya.';
        options = [
          { label: 'Vulnerability Assessment', action: 'prod_va' },
          { label: 'Penetration Testing', action: 'prod_pentest' },
          { label: 'Red Teaming', action: 'prod_redteaming' },
          { label: 'Secure SDLC', action: 'prod_secure_sdlc' },
          { label: 'Cyber Drill', action: 'prod_cyberdrill' }
        ];
        break;

      case 'menu_secops':
        botText = 'Lindungi bisnis Anda 24x7 dengan layanan operasi keamanan Technotama.';
        options = [
          { label: 'Managed SOC', action: 'prod_soc' },
          { label: 'CTI', action: 'prod_cti' },
          { label: 'Incident Management', action: 'prod_incident' },
          { label: 'Digital Forensic', action: 'prod_forensic' },
          { label: 'Network Hardening', action: 'prod_hardening' }
        ];
        break;

      case 'menu_academy':
        setPreQualIntent('academy');
        botText = 'Sebelum kita mulai, siapakah Anda?';
        options = [
          { label: '🏢 Saya Mewakili Perusahaan', action: 'who_corporate' },
          { label: '👨💻 Saya Individu / Profesional', action: 'who_individual' },
          { label: '🎓 Saya Mahasiswa', action: 'who_student' },
          { label: '👨🎓 Saya Fresh Graduate', action: 'who_fresh_grad' }
        ];
        break;

      case 'menu_academy_corporate_direct':
        botText = 'Tingkatkan kompetensi SDM melalui program pelatihan cybersecurity Technotama.';
        options = [
          { label: 'Cyber Awareness', action: 'prod_academy_awareness' },
          { label: 'Technical Training', action: 'prod_academy_technical' },
          { label: 'Bootcamp', action: 'prod_academy_bootcamp' },
          { label: 'Certification', action: 'prod_academy_certification' },
          { label: 'Corporate Training', action: 'prod_academy_corporate' }
        ];
        break;

      // Menu Level 2 Strategy
      case 'prod_blueprint':
        botText = 'Kami membantu menyusun roadmap keamanan siber yang sesuai dengan regulasi dan kebutuhan bisnis.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_maturity':
        botText = 'Mengukur tingkat kematangan keamanan siber organisasi berdasarkan framework global (NIST CSF, COBIT, CIS Controls).\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_risk_rating':
        botText = 'Evaluasi risiko siber pihak ketiga dan penilaian postur keamanan eksternal organisasi Anda secara kontinu.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      // Menu Level 2 Governance
      case 'prod_iso_impl':
        botText = 'Technotama mendampingi implementasi ISO/IEC menggunakan pendekatan PDCA hingga proses sertifikasi.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_it_grc':
        botText = 'Penyusunan kerangka kerja tata kelola TI, manajemen risiko, dan kepatuhan (IT GRC) sesuai standar COBIT dan NIST.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_bcm_bcp':
        botText = 'Merancang strategi Business Continuity Plan (BCP) dan Disaster Recovery Plan (DRP) untuk menjaga kelangsungan operasional.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_it_audit':
        botText = 'Audit TI independen untuk menilai keamanan sistem informasi, kontrol internal, dan kepatuhan regulasi.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      // Menu Level 2 Assessment
      case 'prod_va':
        botText = 'Pemindaian otomatis terhadap server, aplikasi, cloud, maupun jaringan untuk menemukan celah keamanan.';
        options = [
          { label: 'View Methodology', action: 'view_methodology' },
          { label: 'Get Quotation', action: 'start_qualification:Vulnerability Assessment' },
          { label: 'Book Consultation', action: 'book_consultation_start:Vulnerability Assessment' }
        ];
        break;

      case 'prod_pentest':
        botText = 'Simulasi serangan menggunakan metode Black Box, Gray Box, atau White Box.';
        options = [
          { label: 'Web Application', action: 'start_qualification:Penetration Testing (Web App)' },
          { label: 'Mobile Application', action: 'start_qualification:Penetration Testing (Mobile App)' },
          { label: 'API Testing', action: 'start_qualification:Penetration Testing (API)' },
          { label: 'Network', action: 'start_qualification:Penetration Testing (Network)' },
          { label: 'Cloud', action: 'start_qualification:Penetration Testing (Cloud)' }
        ];
        break;

      case 'prod_redteaming':
        botText = 'Simulasi Advanced Persistent Threat (APT) untuk menguji kesiapan sistem siber dan tim keamanan Anda.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_secure_sdlc':
        botText = 'Integrasikan keamanan ke dalam proses pengembangan software sejak tahap desain (Shift Left / DevSecOps).\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_cyberdrill':
        botText = 'Uji kesiapan organisasi melalui Tabletop Exercise, Cyber Range, Social Engineering, dan Attack Simulation.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      // Menu Level 2 SecOps
      case 'prod_soc':
        botText = 'Monitoring ancaman keamanan secara real-time menggunakan SIEM, SOAR, Threat Intelligence dan AI Analytics.';
        options = [
          { label: 'SOC Demo', action: 'start_qualification:Managed SOC Demo' },
          { label: 'Pricing', action: 'start_qualification:Managed SOC Pricing' },
          { label: 'Book Consultation', action: 'book_consultation_start:Managed SOC' }
        ];
        break;

      case 'prod_cti':
        botText = 'Deteksi kebocoran data dan ancaman global sebelum berdampak terhadap bisnis Anda.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_incident':
        botText = 'Tim Technotama membantu mendeteksi, mengisolasi dan memulihkan insiden keamanan sesuai NIST Incident Response Framework.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_forensic':
        botText = 'Investigasi bukti digital yang memenuhi standar hukum dan regulasi.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_hardening':
        botText = 'Penguatan konfigurasi server, cloud, firewall, endpoint dan perangkat jaringan.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      // Menu Level 2 Academy
      case 'prod_academy_awareness':
        botText = 'Edukasi keamanan siber untuk seluruh karyawan disertai simulasi phishing.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_academy_technical':
        botText = 'Pelatihan praktis bagi engineer, SOC Analyst, Security Engineer, dan Auditor.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_academy_bootcamp':
        botText = 'Program bootcamp intensif hingga siap kerja. Silakan pilih level program:';
        options = [
          { label: 'Basic', action: 'start_qualification:Academy Bootcamp (Basic)' },
          { label: 'Intermediate', action: 'start_qualification:Academy Bootcamp (Intermediate)' },
          { label: 'Advanced', action: 'start_qualification:Academy Bootcamp (Advanced)' }
        ];
        break;

      case 'prod_academy_certification':
        botText = 'Persiapan sertifikasi internasional cybersecurity.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'prod_academy_corporate':
        botText = 'Program pelatihan siber kustom yang disesuaikan dengan kebutuhan dan skala organisasi Anda.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      // Other actions
      case 'view_methodology':
        botText = 'Metodologi Vulnerability Assessment Technotama mencakup:\n1. Reconnaissance & Asset Discovery\n2. Vulnerability Scanning (Nessus, OpenVAS)\n3. Risk Analysis & Prioritization\n4. Reporting & Remediation Guidance\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?';
        options = [
          { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
          { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
        ];
        break;

      case 'chat_whatsapp':
        botText = 'Apakah Anda ingin berbicara langsung dengan konsultan kami?';
        options = [
          { label: '💬 Open WhatsApp', action: 'open_whatsapp_now' }
        ];
        break;

      case 'book_consultation_start':
        fetchBookings();
        setBookingTopic('General Cybersecurity Consultation');
        setFlowType('booking_date');
        botText = 'Pilih tanggal konsultasi.';
        isCalendar = true;
        break;

      default:
        botText = 'Maaf, saya tidak mengerti tindakan itu. Silakan pilih menu di bawah ini untuk bantuan:';
        options = [
          { label: '🔍 Explore Solutions', action: 'explore_solutions' },
          { label: '🏠 Menu Utama', action: 'go_home' }
        ];
    }

    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: botText,
        options,
        isCalendar
      }
    ]);
  };

  const getRecommendations = (challenge: string, targetService: string): string[] => {
    const recs: string[] = [];
    const lowChallenge = challenge ? challenge.toLowerCase() : '';

    if (lowChallenge.includes('iso') || lowChallenge.includes('compliance')) {
      recs.push('ISO/IEC 27001 Implementation');
      recs.push('IT Governance / IT GRC');
    } else if (lowChallenge.includes('vulner') || lowChallenge.includes('celah') || lowChallenge.includes('lemah')) {
      recs.push('Vulnerability Assessment');
      recs.push('Penetration Testing');
    } else if (lowChallenge.includes('soc') || lowChallenge.includes('monitor') || lowChallenge.includes('siem')) {
      recs.push('Managed SOC 24/7');
      recs.push('Network & Endpoint Hardening');
    } else if (lowChallenge.includes('incident') || lowChallenge.includes('ransom') || lowChallenge.includes('serang') || lowChallenge.includes('tanggul')) {
      recs.push('Cyber Security Incident Management');
      recs.push('Digital Forensic');
      recs.push('Cyber Threat Intelligence (CTI)');
    } else if (lowChallenge.includes('audit')) {
      recs.push('IT Audit');
      recs.push('IT Governance / IT GRC');
    } else if (lowChallenge.includes('train') || lowChallenge.includes('didik') || lowChallenge.includes('academy') || lowChallenge.includes('sadar')) {
      recs.push('Cyber Security Awareness Training');
      recs.push('Technical Security Training');
    }

    if (targetService && !recs.includes(targetService)) {
      recs.unshift(targetService);
    }

    if (recs.length === 0) {
      recs.push('Penetration Testing');
      recs.push('ISO/IEC 27001 Implementation');
      recs.push('Managed SOC 24/7');
    }

    return Array.from(new Set(recs)).slice(0, 3);
  };

  const handleOptionClick = async (label: string, action: string) => {
    stopIdleTimer();
    // Add user message for UI trace
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: label }
    ]);

    // Handle Quick Links or Menu Redirects
    if (action === 'go_home') {
      setFlowType('idle');
      setQualStep(1);
      setContactStep(1);
      setBookingDate(null);
      setBookingTime(null);
      setCurrentContextService(null);
      setPreQualIntent(null);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: '👋 Selamat datang di Technotama – Technotama.\n\nSaya adalah Technotama AI Cybersecurity Consultant.\n\nSaya siap membantu menemukan solusi cybersecurity maupun program pembelajaran yang paling sesuai untuk Anda.',
          options: [
            { label: '🛡 Explore Solutions', action: 'explore_solutions' },
            { label: '🎓 Cyber Academy', action: 'menu_academy' },
            { label: '📅 Book Consultation', action: 'book_consultation_start' },
            { label: '💬 WhatsApp', action: 'chat_whatsapp' }
          ]
        }
      ]);
      return;
    }

    if (action === 'explore_solutions') {
      setPreQualIntent('solutions');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Sebelum kita mulai, siapakah Anda?',
          options: [
            { label: '🏢 Saya Mewakili Perusahaan', action: 'who_corporate' },
            { label: '👨💻 Saya Individu / Profesional', action: 'who_individual' },
            { label: '🎓 Saya Mahasiswa', action: 'who_student' },
            { label: '👨🎓 Saya Fresh Graduate', action: 'who_fresh_grad' }
          ]
        }
      ]);
      return;
    }

    if (action === 'menu_academy') {
      setPreQualIntent('academy');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Sebelum kita mulai, siapakah Anda?',
          options: [
            { label: '🏢 Saya Mewakili Perusahaan', action: 'who_corporate' },
            { label: '👨💻 Saya Individu / Profesional', action: 'who_individual' },
            { label: '🎓 Saya Mahasiswa', action: 'who_student' },
            { label: '👨🎓 Saya Fresh Graduate', action: 'who_fresh_grad' }
          ]
        }
      ]);
      return;
    }

    if (action === 'who_corporate') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      
      if (preQualIntent === 'academy') {
        triggerBotResponse('menu_academy_corporate_direct', label);
      } else {
        triggerBotResponse('menu_solutions_corporate_direct', label);
      }
      return;
    }

    if (action === 'who_individual' || action === 'who_student' || action === 'who_fresh_grad') {
      setFlowType('academy_goal');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Senang bertemu dengan Anda.\n\nApa tujuan Anda mengikuti Cyber Academy?',
          options: [
            { label: '🚀 Ingin Berkarir di Cybersecurity', action: 'acad_goal:career' },
            { label: '📈 Upgrade Skill', action: 'acad_goal:upgrade' },
            { label: '🏆 Persiapan Sertifikasi', action: 'acad_goal:cert' },
            { label: '🔄 Alih Karir (Career Switch)', action: 'acad_goal:switch' },
            { label: '🤔 Masih Bingung', action: 'acad_goal:confused' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_goal:career') {
      setAcadGoal('career');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Pilihan yang tepat.\n\nCyber Academy memiliki Bootcamp yang dirancang untuk mempersiapkan peserta menjadi tenaga cybersecurity yang siap bekerja.',
          options: [
            { label: 'Lihat Bootcamp', action: 'acad_view_bootcamps' },
            { label: 'Lihat Roadmap Belajar', action: 'acad_view_roadmap' },
            { label: 'Konsultasi Karir', action: 'acad_career_consultation' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_goal:upgrade') {
      setAcadGoal('upgrade');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Bidang cybersecurity apa yang ingin Anda tingkatkan?',
          options: [
            { label: 'SOC Analyst', action: 'acad_upgrade_field:SOC Analyst' },
            { label: 'Penetration Testing', action: 'acad_upgrade_field:Penetration Testing' },
            { label: 'Digital Forensic', action: 'acad_upgrade_field:Digital Forensic' },
            { label: 'Cloud Security', action: 'acad_upgrade_field:Cloud Security' },
            { label: 'Threat Intelligence', action: 'acad_upgrade_field:Threat Intelligence' },
            { label: 'Governance Risk Compliance', action: 'acad_upgrade_field:Governance Risk Compliance' },
            { label: 'Network Security', action: 'acad_upgrade_field:Network Security' },
            { label: 'DevSecOps', action: 'acad_upgrade_field:DevSecOps' },
            { label: 'Belum Tahu', action: 'acad_upgrade_field:Belum Tahu' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_upgrade_field:')) {
      const field = action.replace('acad_upgrade_field:', '');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);

      if (field === 'Belum Tahu') {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Saya akan membantu menentukan jalur belajar yang paling sesuai.',
            options: [
              { label: 'Mulai Career Assessment', action: 'acad_goal:confused' }
            ]
          }
        ]);
        return;
      }

      let recText = '';
      if (field === 'SOC Analyst') {
        recText = '✅ Intermediate SOC Analyst\n✅ Threat Hunting\n✅ FortiSIEM Training';
      } else if (field === 'Penetration Testing') {
        recText = '✅ Basic Ethical Hacking\n✅ Advanced Penetration Testing\n✅ Active Directory Attack';
      } else if (field === 'Digital Forensic') {
        recText = '✅ Digital Forensic\n✅ Advanced Malware Analysis';
      } else if (field === 'Cloud Security') {
        recText = '✅ Cloud Security Fundamentals\n✅ AWS/GCP Cloud Pentesting';
      } else if (field === 'Threat Intelligence') {
        recText = '✅ Threat Intelligence Specialist\n✅ Cyber Threat Hunting';
      } else if (field === 'Governance Risk Compliance') {
        recText = '✅ ISO/IEC 27001 Lead Implementer\n✅ IT GRC Development';
      } else if (field === 'Network Security') {
        recText = '✅ Practical Network Security\n✅ Firewall Configuration';
      } else if (field === 'DevSecOps') {
        recText = '✅ Secure SDLC & DevSecOps\n✅ Container Security';
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Berdasarkan pilihan Anda, kami merekomendasikan:\n\n${recText}\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?`,
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_goal:cert') {
      setAcadGoal('cert');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Sertifikasi apa yang ingin Anda capai?',
          options: [
            { label: 'CompTIA Security+', action: 'acad_cert_select:CompTIA Security+' },
            { label: 'CompTIA CySA+', action: 'acad_cert_select:CompTIA CySA+' },
            { label: 'CEH', action: 'acad_cert_select:CEH' },
            { label: 'CHFI', action: 'acad_cert_select:CHFI' },
            { label: 'ISO 27001 Lead Implementer', action: 'acad_cert_select:ISO 27001 Lead Implementer' },
            { label: 'ISO 27001 Lead Auditor', action: 'acad_cert_select:ISO 27001 Lead Auditor' },
            { label: 'CISSP', action: 'acad_cert_select:CISSP' },
            { label: 'Belum Menentukan', action: 'acad_cert_select:Belum Menentukan' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_cert_select:')) {
      const cert = action.replace('acad_cert_select:', '');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);

      if (cert === 'Belum Menentukan') {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Tidak masalah.\n\nSaya akan membantu memilih sertifikasi yang sesuai dengan pengalaman Anda.',
            options: [
              { label: 'Mulai Career Assessment', action: 'acad_goal:confused' }
            ]
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: `Pilihan sertifikasi yang sangat baik. Kami menyediakan kelas persiapan sertifikasi ${cert} dengan kurikulum resmi, instruktur berpengalaman, serta latihan soal komprehensif.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?`,
            options: [
              { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
              { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
            ]
          }
        ]);
      }
      return;
    }

    if (action === 'acad_goal:switch') {
      setAcadGoal('switch');
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Apakah Anda memiliki pengalaman di bidang IT?',
          options: [
            { label: 'Ya', action: 'acad_switch_exp:yes' },
            { label: 'Tidak', action: 'acad_switch_exp:no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_switch_exp:yes') {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Bagus sekali. Pengalaman IT Anda akan mempermudah akselerasi belajar Anda. Mari lakukan assessment singkat.',
          options: [
            { label: 'Mulai Assessment', action: 'acad_goal:confused' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_switch_exp:no') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Tidak perlu khawatir.\n\nBootcamp Technotama dimulai dari level Basic sehingga peserta tanpa pengalaman cybersecurity tetap dapat mengikuti.',
          options: [
            { label: 'Lihat Detail Bootcamp', action: 'acad_view_bootcamps' },
            { label: 'Mulai Career Assessment', action: 'acad_goal:confused' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_goal:confused') {
      setAcadGoal('confused');
      setFlowType('academy_assessment');
      setAcadAssessmentStep(1);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Saya akan membantu menentukan jalur belajar yang paling sesuai.\n\nBerapa usia Anda?',
          options: [
            { label: '18-22', action: 'acad_assess_q1:18-22' },
            { label: '23-30', action: 'acad_assess_q1:23-30' },
            { label: '31-40', action: 'acad_assess_q1:31-40' },
            { label: '40+', action: 'acad_assess_q1:40+' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_assess_q1:')) {
      const val = action.replace('acad_assess_q1:', '');
      setAcadAssessmentData(prev => ({ ...prev, age: val }));
      setAcadAssessmentStep(2);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Pendidikan terakhir?',
          options: [
            { label: 'SMA', action: 'acad_assess_q2:SMA' },
            { label: 'D3', action: 'acad_assess_q2:D3' },
            { label: 'S1', action: 'acad_assess_q2:S1' },
            { label: 'S2', action: 'acad_assess_q2:S2' },
            { label: 'Lainnya', action: 'acad_assess_q2:Lainnya' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_assess_q2:')) {
      const val = action.replace('acad_assess_q2:', '');
      setAcadAssessmentData(prev => ({ ...prev, education: val }));
      setAcadAssessmentStep(3);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Apakah memiliki pengalaman kerja di bidang IT?',
          options: [
            { label: 'Belum Ada', action: 'acad_assess_q3:Belum Ada' },
            { label: 'Helpdesk', action: 'acad_assess_q3:Helpdesk' },
            { label: 'Network', action: 'acad_assess_q3:Network' },
            { label: 'System Administrator', action: 'acad_assess_q3:System Administrator' },
            { label: 'Developer', action: 'acad_assess_q3:Developer' },
            { label: 'IT Support', action: 'acad_assess_q3:IT Support' },
            { label: 'Lainnya', action: 'acad_assess_q3:Lainnya' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_assess_q3:')) {
      const val = action.replace('acad_assess_q3:', '');
      setAcadAssessmentData(prev => ({ ...prev, experience: val }));
      setAcadAssessmentStep(4);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Target Anda?',
          options: [
            { label: 'Mendapatkan pekerjaan', action: 'acad_assess_q4:Mendapatkan pekerjaan' },
            { label: 'Naik jabatan', action: 'acad_assess_q4:Naik jabatan' },
            { label: 'Pindah divisi', action: 'acad_assess_q4:Pindah divisi' },
            { label: 'Freelancer', action: 'acad_assess_q4:Freelancer' },
            { label: 'Membangun bisnis', action: 'acad_assess_q4:Membangun bisnis' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_assess_q4:')) {
      const val = action.replace('acad_assess_q4:', '');
      const finalAssessment = { ...acadAssessmentData, target: val };
      setAcadAssessmentData(finalAssessment);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Berdasarkan jawaban Anda, jalur belajar yang kami rekomendasikan adalah:\n\nTechnotama Bootcamp Roadmap\n\n🟢 Basic Bootcamp\n↓\n🔵 Intermediate Bootcamp\n↓\n🟣 Advanced Bootcamp\n↓\n🏆 International Certification\n↓\n💼 Job Ready Program'
        }
      ]);

      await new Promise(resolve => setTimeout(resolve, 600));
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Estimasi waktu belajar: 6–9 bulan.\n\nTingkat keberhasilan sangat bergantung pada komitmen belajar dan praktik. Cyber Academy menyediakan pembelajaran berbasis proyek, simulasi, dan pendampingan agar peserta memiliki pengalaman yang relevan dengan kebutuhan industri.',
          options: [
            { label: 'Basic', action: 'acad_detail:basic' },
            { label: 'Intermediate', action: 'acad_detail:intermediate' },
            { label: 'Advanced', action: 'acad_detail:advanced' },
            { label: 'International Certification', action: 'acad_detail:cert' },
            { label: 'Informasi Biaya', action: 'acad_detail:cost' },
            { label: 'Pendaftaran', action: 'acad_enroll_start' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_view_bootcamps') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Berikut adalah program Bootcamp di Cyber Academy:',
          options: [
            { label: '🟢 Basic Bootcamp', action: 'acad_detail:basic' },
            { label: '🔵 Intermediate Bootcamp', action: 'acad_detail:intermediate' },
            { label: '🟣 Advanced Bootcamp', action: 'acad_detail:advanced' },
            { label: '🏠 Menu Utama', action: 'go_home' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_view_roadmap') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Rekomendasi Jalur Belajar (Roadmap):\n\n🟢 Basic (8 minggu) -> Fundamental & Linux\n↓\n🔵 Intermediate (12 minggu) -> SOC, SIEM & Pentesting\n↓\n🟣 Advanced (16 minggu) -> Red Team & Incident Response\n↓\n🏆 Persiapan Sertifikasi Internasional\n↓\n💼 Pendampingan Kerja (Job Ready)\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_career_consultation') {
      fetchBookings();
      setContactPurpose('academic_booking');
      setFlowType('booking_date');
      setBookingTopic('Cyber Academy Career Consultation');
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Pilih tanggal untuk konsultasi karir Anda.',
          isCalendar: true
        }
      ]);
      return;
    }

    if (action === 'acad_detail:basic') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Anda akan mempelajari:\n\n✅ Fundamental Cybersecurity\n✅ Networking\n✅ Linux\n✅ Windows Security\n✅ Ethical Hacking Introduction\n✅ Web Security\n✅ Security Awareness\n\nDurasi: 8 Minggu',
          options: [
            { label: 'Lihat Kurikulum', action: 'acad_curriculum:basic' },
            { label: 'Daftar Sekarang', action: 'acad_enroll_start:Basic Bootcamp' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_detail:intermediate') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Materi:\n\nSOC\nSIEM\nThreat Hunting\nVA\nPen-Test\nIncident Response\nCloud Security\n\nDurasi: 12 Minggu',
          options: [
            { label: 'Lihat Kurikulum', action: 'acad_curriculum:intermediate' },
            { label: 'Daftar', action: 'acad_enroll_start:Intermediate Bootcamp' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_detail:advanced') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Materi:\n\nRed Team\nPurple Team\nDigital Forensic\nMalware Analysis\nThreat Intelligence\nAdvanced Pentest\nActive Directory Attack\nCloud Pentest\nDevSecOps\n\nDurasi: 16 Minggu',
          options: [
            { label: 'Lihat Kurikulum', action: 'acad_curriculum:advanced' },
            { label: 'Daftar', action: 'acad_enroll_start:Advanced Bootcamp' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_detail:cert') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Setelah menyelesaikan Bootcamp Intermediate, peserta dapat mengikuti kelas persiapan sertifikasi internasional sesuai jalur karier yang dipilih.\n\nPilihan sertifikasi meliputi:\n\n🏅 CompTIA Security+\n🏅 CompTIA CySA+\n🏅 CEH\n🏅 CHFI\n🏅 ISO/IEC 27001 Lead Implementer\n🏅 ISO/IEC 27001 Lead Auditor\n🏅 CISSP (bagi peserta yang telah memenuhi persyaratan pengalaman)\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_detail:cost') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Informasi biaya akan disesuaikan dengan kelas yang dipilih.',
          options: [
            { label: 'Lihat Paket', action: 'acad_cost_package' },
            { label: 'Promo', action: 'acad_cost_promo' },
            { label: 'Cicilan', action: 'acad_cost_installment' },
            { label: 'Corporate Class', action: 'acad_cost_corporate' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_curriculum:basic') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Kurikulum Basic Bootcamp:\nMinggu 1-2: Fundamental OS & Networking\nMinggu 3-4: Linux Administration & Security\nMinggu 5-6: Web Fundamentals & OWASP Top 10\nMinggu 7-8: Intro to Ethical Hacking & Security Awareness.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_curriculum:intermediate') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Kurikulum Intermediate Bootcamp:\nMinggu 1-3: Security Operations Center (SOC) & SIEM\nMinggu 4-6: Vulnerability Assessment & Penetration Testing\nMinggu 7-9: Incident Response & Threat Hunting\nMinggu 10-12: Cloud Security Fundamentals.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_curriculum:advanced') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Kurikulum Advanced Bootcamp:\nMinggu 1-4: Red Teaming & Active Directory Attacks\nMinggu 5-8: Digital Forensics & Incident Response (DFIR)\nMinggu 9-12: Threat Intelligence & Malware Analysis\nMinggu 13-16: DevSecOps & Cloud Pentesting.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_cost_package') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Paket Belajar Cyber Academy:\n- Basic Bootcamp: Rp 3.500.000\n- Intermediate Bootcamp: Rp 6.000.000\n- Advanced Bootcamp: Rp 8.500.000\n- Bundle Complete: Rp 15.000.000\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_cost_promo') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Diskon Early Bird 10% untuk pendaftaran 2 minggu sebelum kelas dimulai, serta diskon kelompok sebesar 15% (minimal 3 orang).\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_cost_installment') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Tersedia cicilan tanpa bunga (0%) hingga 3x pembayaran atau opsi pembiayaan cicilan bulanan melalui mitra kami.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'acad_cost_corporate') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Paket pelatihan khusus untuk peningkatan kompetensi tim IT & Security korporasi dengan materi dan jadwal yang fleksibel.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action.startsWith('acad_enroll_start')) {
      const selectedClass = action.includes(':') ? action.split(':')[1] : '';
      setAcadEnrollData(prev => ({ ...prev, kelas: selectedClass }));
      setFlowType('academy_enroll');
      setAcadEnrollStep(1);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Siap bergabung bersama Cyber Academy?\n\nMari isi form pendaftaran singkat.\n\nSiapa nama lengkap Anda?'
        }
      ]);
      return;
    }

    if (action === 'acad_consultation_start') {
      fetchBookings();
      setContactPurpose('academic_booking');
      setFlowType('booking_date');
      setBookingTopic('Academic Consultation');
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Pilih tanggal untuk konsultasi akademik Anda.',
          isCalendar: true
        }
      ]);
      return;
    }

    if (action === 'acad_download_brochure') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Anda dapat men-download Brosur Lengkap Bootcamp Cyber Academy melalui link di bawah ini:\n\n📄 [Download Brosur Bootcamp (PDF)](https://Technotama.co.id/academy-brochure.pdf)\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait program pembelajaran di Cyber Academy?',
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    if (action === 'ask_more_yes') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Dengan senang hati.\n\nSilakan pilih topik yang ingin Anda bahas berikutnya.',
          options: [
            { label: '🛡 Cybersecurity Strategy', action: 'menu_strategy' },
            { label: '⚙ Governance & Compliance', action: 'menu_gov' },
            { label: '🔍 Assessment & Testing', action: 'menu_assessment' },
            { label: '🛡 Security Operations', action: 'menu_secops' },
            { label: '🎓 Cyber Academy', action: 'menu_academy' },
            { label: '💬 Tulis Pertanyaan Sendiri', action: 'write_own_question' }
          ]
        }
      ]);
      return;
    }

    if (action === 'write_own_question') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Silakan ketik pertanyaan Anda terkait cybersecurity secara bebas pada kolom chat di bawah. Saya akan siap membantu memberikan rekomendasi.'
        }
      ]);
      return;
    }

    if (action === 'ask_more_no') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);
      
      const isAcademyUser = preQualIntent === 'academy' || flowType.startsWith('academy') || contactPurpose === 'academic_booking' || acadGoal !== null;

      if (isAcademyUser) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Terima kasih telah mengunjungi Cyber Academy.\n\nCybersecurity merupakan salah satu bidang dengan pertumbuhan karier yang sangat pesat. Melalui kurikulum berbasis praktik, studi kasus industri, dan pendampingan dari para praktisi, Cyber Academy membantu Anda membangun kompetensi yang relevan dengan kebutuhan dunia kerja.\n\nJika Anda ingin mendiskusikan jalur belajar yang paling sesuai atau membutuhkan informasi lebih lanjut mengenai kelas, jadwal, maupun sertifikasi, kami siap membantu.',
            options: [
              { label: '🚀 Daftar Bootcamp Sekarang', action: 'acad_enroll_start' },
              { label: '📅 Book Free Academic Consultation', action: 'acad_consultation_start' },
              { label: '🎓 Lihat Roadmap Karier Cybersecurity', action: 'acad_view_roadmap' },
              { label: '💬 Chat Cyber Academy', action: 'open_whatsapp_now' }
            ]
          }
        ]);
        setFlowType('completed');
        startIdleTimer();
        return;
      }

      const closingOptions = [
        {
          text: "Terima kasih telah berkonsultasi dengan Technotama AI Cybersecurity Consultant.\n\nSetiap organisasi memiliki tantangan keamanan siber yang berbeda. Tim konsultan Technotama siap membantu Anda merancang solusi yang tepat, efektif, dan sesuai dengan kebutuhan bisnis maupun regulasi industri.",
          options: [
            { label: '📅 Book Free Consultation', action: 'book_consultation_start' },
            { label: '📄 Request Proposal', action: 'qual_request_proposal' },
            { label: '💬 Chat with Technotama Expert', action: 'open_whatsapp_now' }
          ]
        },
        {
          text: "Keamanan siber bukan hanya tentang teknologi, tetapi tentang menjaga keberlangsungan bisnis, kepercayaan pelanggan, dan kepatuhan terhadap regulasi.\n\nTechnotama siap menjadi mitra strategis dalam membangun ketahanan siber organisasi Anda.",
          options: [
            { label: '📅 Jadwalkan Konsultasi Gratis', action: 'book_consultation_start' },
            { label: '📄 Minta Penawaran', action: 'qual_request_proposal' },
            { label: '☎ Hubungi Konsultan Technotama', action: 'open_whatsapp_now' }
          ]
        },
        {
          text: "Terima kasih atas waktu Anda.\n\nTim Technotama telah membantu berbagai organisasi dalam meningkatkan tata kelola keamanan siber, memperkuat pertahanan digital, serta memenuhi berbagai kebutuhan kepatuhan dan audit.\n\nKami siap mendiskusikan solusi yang paling sesuai untuk organisasi Anda.",
          options: [
            { label: '🚀 Mulai Diskusi', action: 'open_whatsapp_now' },
            { label: '📅 Book Consultation', action: 'book_consultation_start' },
            { label: '💬 WhatsApp Consultant', action: 'open_whatsapp_now' }
          ]
        },
        {
          text: "Terima kasih telah menggunakan Technotama AI Cybersecurity Consultant.\n\nDalam banyak kasus, konsultasi singkat selama 30 menit sudah cukup untuk mengidentifikasi area risiko utama dan memberikan rekomendasi awal yang dapat segera ditindaklanjuti.\n\nTidak ada biaya konsultasi awal, dan seluruh diskusi dijaga kerahasiaannya melalui komitmen profesional Technotama.",
          options: [
            { label: '📅 Book Free 30-Minute Consultation', action: 'book_consultation_start' },
            { label: '📄 Request Solution Proposal', action: 'qual_request_proposal' },
            { label: '💬 Diskusi dengan Cybersecurity Expert', action: 'open_whatsapp_now' }
          ]
        },
        {
          text: "Sebelum mengakhiri percakapan ini, izinkan kami membantu Anda mengambil langkah berikutnya.\n\nTim Technotama siap memberikan assessment awal, rekomendasi solusi, hingga estimasi implementasi yang disesuaikan dengan kondisi organisasi Anda tanpa komitmen awal.\n\nMari bangun pertahanan siber yang lebih kuat bersama Technotama.",
          options: [
            { label: '🛡 Free Security Consultation', action: 'book_consultation_start' },
            { label: '📅 Schedule Meeting', action: 'book_consultation_start' },
            { label: '📄 Request Proposal', action: 'qual_request_proposal' },
            { label: '💬 WhatsApp Sales Consultant', action: 'open_whatsapp_now' }
          ]
        }
      ];
      
      const randomOption = closingOptions[Math.floor(Math.random() * closingOptions.length)];
      
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: randomOption.text,
          options: randomOption.options
        }
      ]);
      
      setFlowType('completed');
      startIdleTimer();
      return;
    }

    // WhatsApp Triggers
    if (action === 'open_whatsapp_now') {
      window.open(getWhatsAppLink(), '_blank');
      return;
    }
    if (action === 'chat_whatsapp_booking_done') {
      const text = `Halo Technotama,\n\nSaya telah menjadwalkan konsultasi pada tanggal ${bookingDate} pukul ${bookingTime} WIB.\n\nNama: ${contactData.name}\nPerusahaan: ${contactData.company}\nJabatan: ${contactData.title}`;
      window.open(getWhatsAppLink(text), '_blank');
      return;
    }
    if (action === 'chat_whatsapp_proposal_done') {
      const text = `Halo Technotama,\n\nSaya tertarik dengan proposal untuk layanan: ${currentContextService || qualData.targetService || 'Cybersecurity Solutions'}.\n\nNama: ${contactData.name}\nPerusahaan: ${contactData.company}\nJabatan: ${contactData.title}`;
      window.open(getWhatsAppLink(text), '_blank');
      return;
    }
    if (action === 'chat_whatsapp_qual_done') {
      const text = `Halo Technotama,\n\nSaya tertarik dengan layanan: ${qualData.targetService || 'Cybersecurity Solutions'}.\n\nNama: ${contactData.name || 'N/A'}\nPerusahaan: ${contactData.company || 'N/A'}\nKebutuhan: Tantangan: ${qualData.challenge}. Timeline: ${qualData.timeline}`;
      window.open(getWhatsAppLink(text), '_blank');
      return;
    }
    if (action.startsWith('chat_whatsapp:')) {
      const service = action.replace('chat_whatsapp:', '');
      const text = `Halo Technotama,\n\nSaya tertarik dengan layanan: ${service}\n\nPerusahaan:\nNama:\nKebutuhan:`;
      window.open(getWhatsAppLink(text), '_blank');
      return;
    }

    // Google Calendar Trigger
    if (action.startsWith('gcal:')) {
      const link = action.replace('gcal:', '');
      window.open(link, '_blank');
      return;
    }

    // Book Consultation Trigger
    if (action.startsWith('book_consultation_start')) {
      fetchBookings();
      const parts = action.split(':');
      const serviceName = parts[1] || 'General Cybersecurity Consultation';
      setBookingTopic(serviceName);
      setFlowType('booking_date');
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Pilih tanggal konsultasi.',
          isCalendar: true
        }
      ]);
      return;
    }

    // AI Qualification Flow start
    if (action.startsWith('start_qualification')) {
      const parts = action.split(':');
      const serviceName = parts[1] || 'Technotama Solution';
      
      setQualStep(1);
      setQualData({
        industry: '',
        employees: '',
        challenge: '',
        timeline: '',
        targetService: serviceName
      });
      setFlowType('qualification');

      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Industri perusahaan Anda? (Langkah 1 dari 4)',
          options: [
            { label: '🏦 Banking', action: 'qual_q1:Banking' },
            { label: '🏢 Enterprise', action: 'qual_q1:Enterprise' },
            { label: '🏭 Manufacturing', action: 'qual_q1:Manufacturing' },
            { label: '🏥 Healthcare', action: 'qual_q1:Healthcare' },
            { label: '🏛 Government', action: 'qual_q1:Government' },
            { label: '📦 Others', action: 'qual_q1:Others' }
          ]
        }
      ]);
      return;
    }

    // AI Qualification Q1
    if (action.startsWith('qual_q1:')) {
      const val = action.replace('qual_q1:', '');
      setQualData(prev => ({ ...prev, industry: val }));
      setQualStep(2);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Jumlah karyawan? (Langkah 2 dari 4)',
          options: [
            { label: '1-100', action: 'qual_q2:1-100' },
            { label: '100-500', action: 'qual_q2:100-500' },
            { label: '500-1000', action: 'qual_q2:500-1000' },
            { label: '1000+', action: 'qual_q2:1000+' }
          ]
        }
      ]);
      return;
    }

    // AI Qualification Q2
    if (action.startsWith('qual_q2:')) {
      const val = action.replace('qual_q2:', '');
      setQualData(prev => ({ ...prev, employees: val }));
      setQualStep(3);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Apa tantangan utama Anda? (Langkah 3 dari 4)',
          options: [
            { label: 'Compliance', action: 'qual_q3:Compliance' },
            { label: 'ISO 27001', action: 'qual_q3:ISO 27001' },
            { label: 'Vulnerability', action: 'qual_q3:Vulnerability' },
            { label: 'SOC', action: 'qual_q3:SOC' },
            { label: 'Incident', action: 'qual_q3:Incident' },
            { label: 'Audit', action: 'qual_q3:Audit' },
            { label: 'Training', action: 'qual_q3:Training' },
            { label: 'Others', action: 'qual_q3:Others' }
          ]
        }
      ]);
      return;
    }

    // AI Qualification Q3
    if (action.startsWith('qual_q3:')) {
      const val = action.replace('qual_q3:', '');
      setQualData(prev => ({ ...prev, challenge: val }));
      setQualStep(4);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Kapan proyek akan dimulai? (Langkah 4 dari 4)',
          options: [
            { label: 'ASAP', action: 'qual_q4:ASAP' },
            { label: '1 Month', action: 'qual_q4:1 Month' },
            { label: '3 Months', action: 'qual_q4:3 Months' },
            { label: 'Just Exploring', action: 'qual_q4:Just Exploring' }
          ]
        }
      ]);
      return;
    }

    // AI Qualification Q4 (Recommend Solutions)
    if (action.startsWith('qual_q4:')) {
      const val = action.replace('qual_q4:', '');
      const finalQualData = { ...qualData, timeline: val };
      setQualData(finalQualData);
      setQualStep(5);
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(false);

      const recommendations = getRecommendations(finalQualData.challenge, finalQualData.targetService);
      const recText = recommendations.map((r: string) => `✅ ${r}`).join('\n');

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Terima kasih.\n\nBerdasarkan jawaban Anda, solusi yang kami rekomendasikan adalah:\n\n${recText}\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?`,
          options: [
            { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
            { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
          ]
        }
      ]);
      return;
    }

    // Request Proposal Trigger from Qualification
    if (action === 'qual_request_proposal') {
      setContactPurpose('proposal');
      setFlowType('contact_collect');
      setContactStep(1);

      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Mohon isi data kontak Anda untuk pengiriman proposal.\n\nSiapa nama lengkap Anda?'
        }
      ]);
      return;
    }

    // Booking time select
    if (action.startsWith('book_time:')) {
      const timeVal = action.replace('book_time:', '');
      setBookingTime(timeVal);
      setContactPurpose('booking');
      setFlowType('contact_collect');
      setContactStep(1);

      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Hampir selesai. Mohon isi data berikut.\n\nSiapa nama lengkap Anda?'
        }
      ]);
      return;
    }

    // Default bot routing
    triggerBotResponse(action, label);
  };

  const handleDateSelect = (dateStr: string) => {
    setBookingDate(dateStr);
    setFlowType('booking_time');
    
    // Find booked slots for this date
    const bookedForDate = existingBookings.filter(b => b.date === dateStr);
    const bookedTimes = bookedForDate.map(b => b.time.replace(' WIB', '').trim());

    const allSlots = [
      { label: '09.00', action: 'book_time:09.00' },
      { label: '10.00', action: 'book_time:10.00' },
      { label: '13.00', action: 'book_time:13.00' },
      { label: '15.00', action: 'book_time:15.00' }
    ];

    // Filter out slots that are already booked
    const availableSlots = allSlots.filter(slot => {
      const slotTime = slot.label;
      const colonTime = slotTime.replace('.', ':');
      return !bookedTimes.includes(slotTime) && !bookedTimes.includes(colonTime);
    });

    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: `📅 Tanggal: ${dateStr}` },
      {
        id: Math.random().toString(),
        sender: 'bot',
        text: availableSlots.length > 0
          ? 'Pilih Jam'
          : 'Maaf, semua slot waktu pada tanggal ini sudah penuh. Silakan pilih tanggal yang lain.',
        options: availableSlots
      }
    ]);
  };

  const handleContactCollection = async (text: string) => {
    const updatedData = { ...contactData };
    let nextStep = contactStep + 1;
    let botText = '';
    let isLast = false;

    if (contactStep === 1) {
      updatedData.name = text;
      botText = 'Apa nama Perusahaan Anda?';
    } else if (contactStep === 2) {
      updatedData.company = text;
      botText = 'Mohon masukkan alamat Email Anda:';
    } else if (contactStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Format email kurang sesuai. Mohon masukkan email yang valid (contoh: nama@perusahaan.com):'
          }
        ]);
        return;
      }
      updatedData.email = text;
      botText = 'Mohon masukkan Nomor HP/WhatsApp Anda:';
    } else if (contactStep === 4) {
      updatedData.phone = text;
      botText = 'Apa Jabatan Anda?';
    } else if (contactStep === 5) {
      updatedData.title = text;
      isLast = true;
    }

    setContactData(updatedData);

    if (isLast) {
      setFlowType('completed');
      setIsTyping(true);

      if (contactPurpose === 'proposal') {
        try {
          const needsStr = `Request Proposal untuk: ${currentContextService || qualData.targetService || 'Technotama Solution'}. Industri: ${qualData.industry || 'N/A'}. Karyawan: ${qualData.employees || 'N/A'}. Tantangan: ${qualData.challenge || 'N/A'}. Mulai Proyek: ${qualData.timeline || 'N/A'}.`;
          
          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: updatedData.name,
              email: updatedData.email,
              phone: updatedData.phone,
              company: updatedData.company,
              role: updatedData.title,
              needs: needsStr,
              budget: 'Unspecified',
              timeline: qualData.timeline || 'Unspecified',
              source: 'CHATBOT'
            })
          });
        } catch (err) {
          console.error('Failed to save lead:', err);
        }
        setIsTyping(false);

        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: `Terima kasih.\n\nBerdasarkan jawaban Anda, proposal sedang kami siapkan. Konsultan Technotama akan menghubungi Anda di ${updatedData.email} atau ${updatedData.phone}.\n\nApakah ada hal lain yang bisa kami bantu?`,
            options: [
              { label: '💬 Chat WhatsApp', action: 'chat_whatsapp_proposal_done' },
              { label: '🏠 Menu Utama', action: 'go_home' }
            ]
          }
        ]);
      } else {
        // Submit booking
        try {
          const descStr = contactPurpose === 'academic_booking'
            ? `Konsultasi Akademik/Karir Cyber Academy. Pekerjaan: ${updatedData.company || 'N/A'}. Pendidikan: ${updatedData.title || 'N/A'}.`
            : `Jabatan: ${updatedData.title}. Industri: ${qualData.industry || 'N/A'}. Tantangan: ${qualData.challenge || 'N/A'}.`;
          
          await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: bookingTopic || currentContextService || 'Cybersecurity Consultation',
              date: bookingDate,
              time: bookingTime + ' WIB',
              platform: 'Google Meet',
              name: updatedData.name,
              email: updatedData.email,
              company: contactPurpose === 'academic_booking' ? 'Individu' : updatedData.company,
              phone: updatedData.phone,
              description: descStr
            })
          });
        } catch (err) {
          console.error('Failed to save booking:', err);
        }
        setIsTyping(false);

        const gCalLink = getGoogleCalendarLink(bookingDate!, bookingTime!);

        const successText = contactPurpose === 'academic_booking'
          ? `Terima kasih.\n\nKonsultan Akademik Cyber Academy akan menghubungi Anda sesuai jadwal yang dipilih:\n\n📅 Tanggal: ${bookingDate}\n⏰ Waktu: ${bookingTime} WIB\n📍 Platform: Google Meet`
          : `Terima kasih.\n\nKonsultan Technotama akan menghubungi Anda sesuai jadwal yang dipilih:\n\n📅 Tanggal: ${bookingDate}\n⏰ Waktu: ${bookingTime} WIB\n📍 Platform: Google Meet`;

        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: successText,
            options: [
              { label: '✔ Add to Google Calendar', action: `gcal:${gCalLink}` },
              { label: '💬 Chat WhatsApp', action: 'chat_whatsapp_booking_done' },
              { label: '🏠 Menu Utama', action: 'go_home' }
            ]
          }
        ]);
      }
    } else {
      setContactStep(nextStep);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: botText
        }
      ]);
    }
  };

  const handleExitCaptureSubmit = async (text: string) => {
    if (exitCaptureType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Format email kurang sesuai. Mohon masukkan email yang valid (contoh: nama@perusahaan.com):'
          }
        ]);
        return;
      }
      
      setIsTyping(true);
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Prospek Web (Exit Capture)',
            email: text,
            phone: '08000000000',
            company: 'Unspecified',
            role: 'Exit Prospect',
            needs: `Katalog/Brosur Request. Layanan yang diminati: ${currentContextService || 'Cybersecurity Solutions'}.`,
            budget: 'Unspecified',
            timeline: 'Unspecified',
            source: 'CHATBOT'
          })
        });
      } catch (err) {
        console.error('Failed to save exit lead:', err);
      }
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Terima kasih! Brosur dan katalog layanan Technotama akan dikirimkan ke email Anda sebentar lagi. Semoga hari Anda menyenangkan!'
        }
      ]);
      setFlowType('completed');
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    }
  };

  const handleFreeTextInput = (text: string) => {
    const lowText = text.toLowerCase();
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (lowText.includes('iso') || lowText.includes('27001') || lowText.includes('sertifikasi') || lowText.includes('kepatuhan')) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Saya merekomendasikan layanan ISO/IEC Implementation, yang dapat dilengkapi dengan IT GRC Development untuk memperkuat tata kelola serta IT Audit sebagai kesiapan sebelum sertifikasi.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?',
            options: [
              { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
              { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
            ]
          }
        ]);
      } else if (lowText.includes('website') && (lowText.includes('serang') || lowText.includes('hack') || lowText.includes('dihack') || lowText.includes('ddos') || lowText.includes('hacked'))) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Untuk kondisi tersebut, saya menyarankan kombinasi Vulnerability Assessment, Penetration Testing, dan Managed Security Operation Center (SOC) agar kerentanan dapat ditemukan, diuji, serta dipantau secara berkelanjutan.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?',
            options: [
              { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
              { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
            ]
          }
        ]);
      } else if (lowText.includes('ransomware') || lowText.includes('virus') || lowText.includes('malware') || lowText.includes('terinfeksi') || lowText.includes('insiden') || lowText.includes('terserang')) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Situasi ini memerlukan respons segera. Tim Technotama dapat membantu melalui Cyber Security Incident Management, Digital Forensic, dan Cyber Threat Intelligence (CTI) untuk investigasi, pemulihan, dan pencegahan insiden lanjutan.\n\nApakah masih ada hal lain yang ingin Anda tanyakan terkait kebutuhan cybersecurity perusahaan Anda?',
            options: [
              { label: '✅ Ya, Saya Punya Pertanyaan Lain', action: 'ask_more_yes' },
              { label: '❌ Tidak, Sudah Cukup', action: 'ask_more_no' }
            ]
          }
        ]);
      } else if (lowText.includes('vapt') || lowText.includes('pentest') || lowText.includes('penetration') || lowText.includes('va')) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Technotama menawarkan layanan Vulnerability Assessment (VA) dan Penetration Testing (Pentest) untuk menguji kerentanan pada Web App, Mobile App, API, Network, maupun Cloud Anda.',
            options: [
              { label: '🛡️ Vulnerability Assessment', action: 'prod_va' },
              { label: '⚔️ Penetration Testing', action: 'prod_pentest' },
              { label: '📅 Book Consultation', action: 'book_consultation_start:VAPT' }
            ]
          }
        ]);
      } else if (lowText.includes('soc') || lowText.includes('siem') || lowText.includes('monitoring') || lowText.includes('soar')) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Technotama menyediakan layanan Managed SOC 24/7 untuk mendeteksi dan merespons ancaman keamanan siber secara real-time dengan teknologi SIEM, SOAR, dan AI Analytics.',
            options: [
              { label: '🛡️ Managed SOC', action: 'prod_soc' },
              { label: '📅 Book Consultation', action: 'book_consultation_start:Managed SOC' }
            ]
          }
        ]);
      } else if (lowText.includes('academy') || lowText.includes('bootcamp') || lowText.includes('training') || lowText.includes('pelatihan') || lowText.includes('sertifikasi')) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Meningkatkan kompetensi SDM melalui program pelatihan cybersecurity Cyber Academy. Tersedia Cyber Awareness, Technical Training, Bootcamp, dan Sertifikasi.',
            options: [
              { label: '📖 Explore Cyber Academy', action: 'menu_academy' },
              { label: '🏠 Menu Utama', action: 'go_home' }
            ]
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Saya Technotama AI Cybersecurity Consultant. Saya dapat membantu merekomendasikan solusi keamanan siber terbaik untuk organisasi Anda. Silakan ketik pertanyaan Anda secara spesifik atau gunakan menu di bawah ini:',
            options: [
              { label: '🔍 Explore Solutions', action: 'explore_solutions' },
              { label: '📅 Book Consultation', action: 'book_consultation_start' },
              { label: '💬 Chat via WhatsApp', action: 'chat_whatsapp' }
            ]
          }
        ]);
      }
    }, 600);
  };

  const handleAcademyEnrollment = async (text: string) => {
    const step = acadEnrollStep;
    let nextData = { ...acadEnrollData };
    
    if (step === 1) nextData.name = text;
    else if (step === 2) nextData.email = text;
    else if (step === 3) nextData.whatsapp = text;
    else if (step === 4) nextData.domisili = text;
    else if (step === 5) nextData.pendidikan = text;
    else if (step === 6) nextData.pekerjaan = text;
    else if (step === 7) nextData.kelas = text;
    else if (step === 8) nextData.targetMulai = text;

    setAcadEnrollData(nextData);

    let nextStep = step + 1;
    // If they pre-selected a class, skip class selection step
    if (nextStep === 7 && nextData.kelas) {
      nextStep = 8;
    }

    setAcadEnrollStep(nextStep);

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsTyping(false);

    if (nextStep === 2) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Apa alamat email Anda?' }
      ]);
    } else if (nextStep === 3) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Berapa nomor WhatsApp aktif Anda?' }
      ]);
    } else if (nextStep === 4) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Di kota mana domisili Anda saat ini?' }
      ]);
    } else if (nextStep === 5) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Apa tingkat pendidikan terakhir Anda? (contoh: SMA, S1)' }
      ]);
    } else if (nextStep === 6) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Apa pekerjaan Anda saat ini?' }
      ]);
    } else if (nextStep === 7) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Kelas/Bootcamp apa yang paling Anda minati?' }
      ]);
    } else if (nextStep === 8) {
      setMessages(prev => [
        ...prev,
        { id: Math.random().toString(), sender: 'bot', text: 'Kapan target Anda untuk mulai belajar?' }
      ]);
    } else {
      // Submit Academy lead
      try {
        const leadPayload = {
          name: nextData.name,
          email: nextData.email,
          phone: nextData.whatsapp,
          company: `Domisili: ${nextData.domisili}`,
          role: nextData.pekerjaan,
          needs: `Kelas: ${nextData.kelas || text}. Pendidikan: ${nextData.pendidikan}. Target mulai: ${text}`,
          budget: 'Academy Student',
          timeline: text,
          source: 'CHATBOT_ACADEMY'
        };

        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        });
      } catch (err) {
        console.error('Failed to submit academy enrollment to backend.', err);
      }

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Terima kasih.\n\nTim Cyber Academy akan menghubungi Anda untuk membantu proses pendaftaran, menjelaskan jadwal kelas, metode pembelajaran, pilihan pembayaran, serta menjawab pertanyaan yang mungkin masih Anda miliki.',
          options: [
            { label: '📅 Jadwalkan Konsultasi Akademik', action: 'acad_consultation_start' },
            { label: '📘 Download Brosur Bootcamp', action: 'acad_download_brochure' },
            { label: '💬 Chat Admin Cyber Academy', action: 'open_whatsapp_now' }
          ]
        }
      ]);
      setFlowType('completed');
    }
  };

  const handleSend = () => {
    stopIdleTimer();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text }
    ]);
    setInputText('');

    if (flowType === 'contact_collect') {
      handleContactCollection(text);
    } else if (flowType === 'exit_capture') {
      handleExitCaptureSubmit(text);
    } else if (flowType === 'academy_enroll') {
      handleAcademyEnrollment(text);
    } else {
      handleFreeTextInput(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleCloseClick = () => {
    const hasContact = contactData.email || contactData.phone;
    if (messages.length > 2 && !hasContact && flowType !== 'completed') {
      setShowExitCapture(true);
    } else {
      setIsOpen(false);
    }
  };

  const handlePersistentMenuClick = (action: string) => {
    stopIdleTimer();
    setFlowType('idle');
    setQualStep(1);
    setContactStep(1);
    setBookingDate(null);
    setBookingTime(null);

    const labels: Record<string, string> = {
      home: '🏠 Home',
      solutions: '🛡 Solutions',
      academy: '🎓 Academy',
      consultation: '📅 Consultation',
      whatsapp: '☎ WhatsApp'
    };

    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: labels[action] }
    ]);

    if (action === 'home') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: '👋 Selamat datang di Technotama – Technotama.\n\nSaya adalah Technotama AI Cybersecurity Consultant.\n\nSaya siap membantu menemukan solusi cybersecurity maupun program pembelajaran yang paling sesuai untuk Anda.',
            options: [
              { label: '🛡 Explore Solutions', action: 'explore_solutions' },
              { label: '🎓 Cyber Academy', action: 'menu_academy' },
              { label: '📅 Book Consultation', action: 'book_consultation_start' },
              { label: '💬 WhatsApp', action: 'chat_whatsapp' }
            ]
          }
        ]);
      }, 500);
    } else if (action === 'solutions') {
      triggerBotResponse('explore_solutions', labels[action]);
    } else if (action === 'academy') {
      triggerBotResponse('menu_academy', labels[action]);
    } else if (action === 'consultation') {
      triggerBotResponse('book_consultation_start', labels[action]);
    } else if (action === 'whatsapp') {
      triggerBotResponse('chat_whatsapp', labels[action]);
    }
  };

  const CalendarWidget = ({ onSelect }: { onSelect: (d: string) => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells: React.ReactNode[] = [];
    
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    const isDateFullyBooked = (dateStr: string) => {
      const bookedSlotsForDate = existingBookings.filter(b => b.date === dateStr);
      const normalizedTimes = bookedSlotsForDate.map(b => b.time.replace(' WIB', '').trim());
      const slots = ['09.00', '10.00', '13.00', '15.00'];
      return slots.every(s => 
        normalizedTimes.includes(s) || 
        normalizedTimes.includes(s.replace('.', ':'))
      );
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const isPast = dateObj < today;
      const isSunday = dateObj.getDay() === 0;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isFullyBooked = isDateFullyBooked(dateStr);
      const isDisabled = isPast || isSunday || isFullyBooked;

      cells.push(
        <button
          key={`day-${day}`}
          disabled={isDisabled}
          onClick={() => onSelect(dateStr)}
          className={`w-8 h-8 text-[11px] font-bold rounded-full flex items-center justify-center transition-all ${
            isDisabled
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-100 shadow-sm'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-md max-w-[280px] mt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <button 
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))} 
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold text-slate-800">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))} 
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1 font-extrabold text-[10px] text-slate-400">
          <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells}
        </div>
        <div className="mt-2 text-[9px] text-slate-400 font-semibold text-center border-t border-slate-100 pt-2">
          Hari Minggu libur. Silakan pilih hari kerja.
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none"
        aria-label="Chatbot Technotama"
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
            className="fixed z-[60] bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-96 h-[520px] max-w-[calc(100vw-2rem)] sm:max-w-none flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Exit intent dialog */}
            {showExitCapture && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
                <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 max-w-[300px] text-center space-y-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">Boleh kami hubungi Anda?</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Sebelum Anda menutup chat, boleh kami kirimkan brosur layanan atau menghubungkan Anda dengan konsultan kami?
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setExitCaptureType('email');
                        setShowExitCapture(false);
                        setFlowType('exit_capture');
                        setMessages(prev => [
                          ...prev,
                          {
                            id: Math.random().toString(),
                            sender: 'bot',
                            text: "Silakan masukkan alamat Email Anda agar kami dapat mengirimkan penawaran dan katalog layanan Technotama:"
                          }
                        ]);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>✉ Kirim via Email</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowExitCapture(false);
                        setIsOpen(false);
                        const waUrl = getWhatsAppLink("Halo Technotama, saya ingin mendapatkan brosur dan katalog layanan cybersecurity.");
                        window.open(waUrl, '_blank');
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>💬 Hubungi via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowExitCapture(false);
                        setIsOpen(false);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                    >
                      Tutup Percakapan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/logo.png" 
                  alt="Logo Technotama" 
                  className="w-8 h-8 object-contain bg-slate-950 rounded-md p-0.5 border border-slate-800"
                />
                <div>
                  <div className="font-display font-extrabold text-sm leading-tight">Technotama AI Consultant</div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Cybersecurity Expert &bull; Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseClick}
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

                  {msg.isCalendar && flowType === 'booking_date' && messages[messages.length - 1].id === msg.id && (
                    <div className="pl-9">
                      <CalendarWidget onSelect={handleDateSelect} />
                    </div>
                  )}

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

            {/* Persistent Navigation Menu */}
            <div className="flex border-t border-slate-100 bg-white justify-around py-2 shrink-0 shadow-inner">
              <button
                onClick={() => handlePersistentMenuClick('home')}
                className="flex flex-col items-center justify-center flex-1 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-[9px] font-extrabold mt-0.5">Home</span>
              </button>
              <button
                onClick={() => handlePersistentMenuClick('solutions')}
                className="flex flex-col items-center justify-center flex-1 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="text-[9px] font-extrabold mt-0.5">Solutions</span>
              </button>
              <button
                onClick={() => handlePersistentMenuClick('academy')}
                className="flex flex-col items-center justify-center flex-1 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-[9px] font-extrabold mt-0.5">Academy</span>
              </button>
              <button
                onClick={() => handlePersistentMenuClick('consultation')}
                className="flex flex-col items-center justify-center flex-1 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-[9px] font-extrabold mt-0.5">Consult</span>
              </button>
              <button
                onClick={() => handlePersistentMenuClick('whatsapp')}
                className="flex flex-col items-center justify-center flex-1 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-[9px] font-extrabold mt-0.5">WhatsApp</span>
              </button>
            </div>

            {/* Input Footer */}
            <div className="border-t border-slate-200 bg-white shrink-0">
              {flowType === 'contact_collect' && (
                <div className="px-3 pt-2 pb-1.5 bg-slate-50/50 border-b border-slate-100 flex items-start space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
                    Saya menyetujui pemrosesan data pribadi saya oleh Technotama untuk keperluan memahami kebutuhan layanan sesuai regulasi UU Pelindungan Data Pribadi (UU PDP).
                  </p>
                </div>
              )}
              
              {flowType === 'qualification' && qualStep < 5 && (
                <div className="px-3 py-1 bg-blue-50 border-b border-blue-100 text-[10px] text-blue-600 font-bold text-center">
                  Progres Kualifikasi: Langkah {qualStep} dari 4
                </div>
              )}

              {flowType === 'contact_collect' && (
                <div className="px-3 py-1 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-600 font-bold text-center">
                  Form Kontak: Langkah {contactStep} dari 5
                </div>
              )}

              <div className="p-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    flowType === 'contact_collect'
                      ? contactStep === 1 ? 'Ketik nama lengkap Anda...'
                        : contactStep === 2 ? 'Ketik nama perusahaan Anda...'
                        : contactStep === 3 ? 'Ketik alamat email Anda...'
                        : contactStep === 4 ? 'Ketik nomor HP/WhatsApp...'
                        : 'Ketik jabatan Anda...'
                      : flowType === 'exit_capture' ? 'Ketik alamat email Anda...'
                      : 'Ketik pesan Anda...'
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

