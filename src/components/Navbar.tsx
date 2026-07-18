'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ChevronDown, Award, Lock, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const servicesList = [
  { id: 'cyber-blueprint', name: 'Cybersecurity Blueprint', cluster: 'governance' },
  { id: 'it-grc', name: 'Policy-SOP Development', cluster: 'governance' },
  { id: 'iso-implementation', name: 'ISO/IEC Implementation', cluster: 'governance' },
  { id: 'bcm-bcp-drp', name: 'BCM-BCP-DRP Services (Cyber Drill)', cluster: 'governance' },
  { id: 'digital-maturity', name: 'Digital Maturity Assessment & Security Risk Rating', cluster: 'governance' },
  { id: 'cyber-awareness', name: 'Awareness & Training', cluster: 'governance' },
  { id: 'it-audit', name: 'IT Audit', cluster: 'governance' },
  { id: 'vulnerability-assessment', name: 'Vulnerability Assessment (VA)', cluster: 'offensive' },
  { id: 'penetration-testing', name: 'Penetration Testing (Pen-Test)', cluster: 'offensive' },
  { id: 'secure-sdlc', name: 'Secure SDLC Implementation', cluster: 'offensive' },
  { id: 'red-teaming', name: 'Red Teaming', cluster: 'offensive' },
  { id: 'soc', name: 'Security Operation Center (SOC)', cluster: 'defensive' },
  { id: 'cyber-threat-intelligence', name: 'Cyber Threat Intelligence (CTI) Solution', cluster: 'defensive' },
  { id: 'network-endpoint-hardening', name: 'Network & Endpoint Hardening', cluster: 'defensive' },
  { id: 'incident-management', name: 'Cyber Security Incident Management', cluster: 'defensive' },
  { id: 'digital-forensic', name: 'Digital Forensic', cluster: 'defensive' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('Settings fallback used in Navbar.'));
  }, []);

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

  const activeServices = siteConfig?.services?.map((s: any) => ({ id: s.id, name: s.title, cluster: s.cluster })) || servicesList;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="Logo PT Riset Teknologi Indonesia" 
              className="h-14 sm:h-[72px] w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {siteConfig?.menus?.map((menu: any) => {
              if (menu.id === 'home') {
                return (
                  <React.Fragment key="home-group">
                    <Link 
                      href={menu.path} 
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        pathname === menu.path ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {menu.name}
                    </Link>
                    
                    {/* Services Dropdown */}
                    <div ref={dropdownRef}>
                      <button
                        onClick={() => setServicesOpen(!servicesOpen)}
                        onMouseEnter={() => setServicesOpen(true)}
                        className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200 focus:outline-none"
                      >
                        <span>Layanan</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            onMouseLeave={() => setServicesOpen(false)}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[850px] rounded-2xl bg-white border border-slate-200/80 shadow-xl p-6 grid grid-cols-3 gap-6"
                          >
                            {/* Column 1: Governance */}
                            <div className="space-y-3">
                              <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest border-b pb-1.5 mb-2">
                                Cybersecurity Governance
                              </div>
                              <div className="space-y-1">
                                {activeServices.filter((s: any) => s.cluster === 'governance').map((service: any) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.id}`}
                                    className="block px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Column 2: Offensive */}
                            <div className="space-y-3">
                              <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest border-b pb-1.5 mb-2">
                                Offensive Cybersecurity
                              </div>
                              <div className="space-y-1">
                                {activeServices.filter((s: any) => s.cluster === 'offensive').map((service: any) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.id}`}
                                    className="block px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Column 3: Defensive */}
                            <div className="space-y-3">
                              <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest border-b pb-1.5 mb-2">
                                Defensive Cybersecurity
                              </div>
                              <div className="space-y-1">
                                {activeServices.filter((s: any) => s.cluster === 'defensive').map((service: any) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.id}`}
                                    className="block px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </React.Fragment>
                );
              }

              return (
                <Link 
                  key={menu.id}
                  href={menu.path} 
                  className={`text-sm font-semibold transition-colors duration-200 flex items-center space-x-1 ${
                    pathname === menu.path || pathname.startsWith(menu.path) ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {menu.id === 'portal' && <Lock className="w-4 h-4 text-slate-400" />}
                  <span>{menu.name}</span>
                </Link>
              );
            }) || (
              <>
                <Link href="/" className="text-sm font-semibold text-slate-600">Beranda</Link>
                <Link href="/case-studies" className="text-sm font-semibold text-slate-600">Studi Kasus</Link>
                <Link href="/online-order" className="text-sm font-semibold text-slate-600">Pesan Layanan</Link>
                <Link href="/portal" className="text-sm font-semibold text-slate-600">Portal Klien</Link>
              </>
            )}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/online-consultation"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2.5 rounded-lg border border-slate-300/80 transition-all duration-200 hover:border-blue-200"
            >
              Jadwalkan Konsultasi
            </Link>
            <Link
              href="/request-proposal"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Minta Proposal (RFP)
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/request-proposal"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
            >
              RFP
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-inner"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {siteConfig?.menus?.map((menu: any) => {
                if (menu.id === 'home') {
                  return (
                    <React.Fragment key="home-group-mobile">
                      <Link
                        href={menu.path}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                      >
                        {menu.name}
                      </Link>
                      
                      {/* Mobile Services List */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        {/* Governance Group */}
                        <div>
                          <span className="block px-3 text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                            Governance & Strategy
                          </span>
                          <div className="space-y-0.5 mt-1.5">
                            {activeServices.filter((s: any) => s.cluster === 'governance').map((service: any) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Offensive Group */}
                        <div>
                          <span className="block px-3 text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">
                            Offensive Cybersecurity
                          </span>
                          <div className="space-y-0.5 mt-1.5">
                            {activeServices.filter((s: any) => s.cluster === 'offensive').map((service: any) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Defensive Group */}
                        <div>
                          <span className="block px-3 text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                            Defensive Cybersecurity
                          </span>
                          <div className="space-y-0.5 mt-1.5">
                            {activeServices.filter((s: any) => s.cluster === 'defensive').map((service: any) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

                return (
                  <Link
                    key={menu.id}
                    href={menu.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  >
                    {menu.id === 'portal' && <Lock className="w-5 h-5 text-slate-400" />}
                    <span>{menu.name}</span>
                  </Link>
                );
              }) || (
                <>
                  <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-slate-700">Beranda</Link>
                  <Link href="/case-studies" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-slate-700">Studi Kasus</Link>
                  <Link href="/online-order" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-slate-700">Pesan Layanan Online</Link>
                  <Link href="/portal" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-slate-700">Portal Klien</Link>
                </>
              )}

              <div className="pt-4 flex flex-col space-y-2 px-3">
                <Link
                  href="/online-consultation"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold text-slate-700 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Jadwalkan Konsultasi
                </Link>
                <Link
                  href="/request-proposal"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-bold text-white bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Minta Proposal (RFP)
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
