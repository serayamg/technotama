'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import BcmLoginModal from './BcmLoginModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isBcmModalOpen, setIsBcmModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('Settings fallback used in Footer.'));
  }, []);

  const getCleanWhatsAppNumber = () => {
    const rawNumber = siteConfig?.general?.whatsappNumber || '0856-6872-2734';
    const clean = rawNumber.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      return '62' + clean.slice(1);
    }
    return clean.startsWith('62') ? clean : '62' + clean;
  };

  const getMenuName = (id: string, defaultName: string) => {
    if (!siteConfig?.menus) return defaultName;
    const found = siteConfig.menus.find((m: any) => m.id === id);
    return found ? found.name : defaultName;
  };

  const getMenuPath = (id: string, defaultPath: string) => {
    if (!siteConfig?.menus) return defaultPath;
    const found = siteConfig.menus.find((m: any) => m.id === id);
    return found ? found.path : defaultPath;
  };

  const servicesList = siteConfig?.services?.map((s: any) => ({ id: s.id, name: s.title })) || [
    { id: 'cyber-blueprint', name: 'Cybersecurity Blueprint' },
    { id: 'it-grc', name: 'IT GRC & Tata Kelola' },
    { id: 'iso-implementation', name: 'ISO/IEC Implementation' },
    { id: 'bcm-bcp-drp', name: 'BCM & BCP-DRP' },
    { id: 'penetration-testing', name: 'Penetration Testing (Pen-Test)' },
    { id: 'red-teaming', name: 'Red Teaming Simulation' },
    { id: 'soc', name: 'Managed SOC 24/7' },
    { id: 'cyber-threat-intelligence', name: 'Cyber Threat Intelligence' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Logo Technotama" 
                className="w-9 h-9 object-contain bg-white rounded-md p-0.5"
              />
              <span className="font-display font-bold text-white text-lg tracking-tight">
                {siteConfig?.general?.companyShortName || 'Technotama'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {siteConfig?.general?.companyName || 'Technotama'} adalah konsultan teknologi siber dan tata kelola TI nasional. Kami mendampingi pemerintah, sektor keuangan, dan korporasi mewujudkan kepatuhan dan ketahanan siber berbasis best practice internasional.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href={siteConfig?.general?.linkedin || "https://linkedin.com/company/technotama"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a 
                href={siteConfig?.general?.youtube || "https://youtube.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5 text-xs">
              {siteConfig?.menus?.map((menu: any) => (
                <li key={menu.id}>
                  <Link href={menu.path} className="hover:text-white transition-colors">
                    {menu.name}
                  </Link>
                </li>
              )) || (
                <>
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                  </li>
                  <li>
                    <Link href="/case-studies" className="hover:text-white transition-colors">Studi Kasus & Portofolio</Link>
                  </li>
                  <li>
                    <Link href="/online-order" className="hover:text-white transition-colors">Pemesanan Layanan</Link>
                  </li>
                  <li>
                    <Link href="/portal" className="hover:text-white transition-colors">Portal Pelanggan</Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/request-proposal" className="hover:text-white transition-colors">Minta Proposal</Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Layanan Utama
            </h3>
            <ul className="space-y-2.5 text-xs">
              {servicesList.map((service: any) => (
                <li key={service.id}>
                  <Link href={`/services/${service.id}`} className="hover:text-white transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Kontak Kami
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {siteConfig?.general?.address || 'Sudirman Central Business District (SCBD), Lantai 28, Senayan, Jakarta Selatan, 12190'}
                </span>
              </li>
              {siteConfig?.general?.showPhone && (
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{siteConfig?.general?.phone || '0856-6872-2734'}</span>
                </li>
              )}
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`mailto:${siteConfig?.general?.email || 'customercare@technotama.id'}`} className="hover:text-white transition-colors">
                  {siteConfig?.general?.email || 'customercare@technotama.id'}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <a 
                  href={`https://wa.me/${getCleanWhatsAppNumber()}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white text-slate-400 transition-colors"
                >
                  WhatsApp: {siteConfig?.general?.whatsappNumber || '0856-6872-2734'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Framework compliance logos/badges mock */}
        <div className="border-t border-slate-800/80 pt-8 pb-4 flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4 items-center text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
            <span>Frameworks:</span>
            <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900/50">ISO/IEC 27001</span>
            <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900/50">COBIT 2019</span>
            <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900/50">NIST CSF</span>
            <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900/50">PCI DSS</span>
            <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900/50">CIS Controls</span>
            <button
              type="button"
              onClick={() => setIsBcmModalOpen(true)}
              className="px-2.5 py-0.5 rounded border border-cyan-500/60 bg-cyan-950/40 text-cyan-400 font-bold hover:bg-cyan-900/60 hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/20 group"
              title="Akses Sistem Konsultan BCM Navigator"
            >
              <ShieldCheck className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>BCM NAV</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <span className="flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-1.5 text-center md:text-left">
            <span>&copy; {currentYear} {siteConfig?.general?.companyName || 'Technotama'}.</span>
            <span>Hak Cipta Dilindungi Undang-Undang.</span>
          </span>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Secure by Design | Zero Trust Ready
            </span>
          </div>
        </div>
      </div>

      <BcmLoginModal 
        isOpen={isBcmModalOpen} 
        onClose={() => setIsBcmModalOpen(false)} 
      />
    </footer>
  );
}
