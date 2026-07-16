'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ChevronDown, Award, Lock, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const servicesList = [
  { id: 'tech-strategy', name: 'Technology Strategy' },
  { id: 'it-governance', name: 'IT Governance, Risk & Compliance' },
  { id: 'cyber-strategy', name: 'Cybersecurity Strategy' },
  { id: 'cyber-compliance', name: 'Cybersecurity Compliance Review' },
  { id: 'vapt', name: 'VA & Penetration Testing' },
  { id: 'standards', name: 'Standard Implementation (ISO)' },
  { id: 'training', name: 'CyberTroops Academy' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-lg border border-white/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight tracking-tight text-slate-900">
                PT Riset Teknologi Indonesia
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                RTI Cybersecurity
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-semibold transition-colors duration-200 ${
                pathname === '/' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
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
                    className="absolute left-0 mt-2 w-72 rounded-xl bg-white border border-slate-200/80 shadow-lg p-2.5"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1.5 border-b border-slate-100 mb-1">
                      Layanan Konsultansi & Audit
                    </div>
                    {servicesList.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="block px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all duration-150"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/case-studies" 
              className={`text-sm font-semibold transition-colors duration-200 ${
                pathname.startsWith('/case-studies') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Studi Kasus
            </Link>

            <Link 
              href="/online-order" 
              className={`text-sm font-semibold transition-colors duration-200 ${
                pathname === '/online-order' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pesan Layanan
            </Link>

            <Link 
              href="/portal" 
              className="flex items-center space-x-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Portal Klien</span>
            </Link>

            <Link 
              href="/admin" 
              className="flex items-center space-x-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Admin CMS</span>
            </Link>
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
              <Link
                href="/"
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                Beranda
              </Link>
              
              {/* Mobile Services List */}
              <div className="space-y-1">
                <span className="block px-3 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Layanan Kami
                </span>
                {servicesList.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="block px-6 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/case-studies"
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                Studi Kasus
              </Link>

              <Link
                href="/online-order"
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                Pesan Layanan Online
              </Link>

              <Link
                href="/portal"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                <Lock className="w-5 h-5 text-slate-400" />
                <span>Portal Klien</span>
              </Link>

              <Link
                href="/admin"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-5 h-5 text-slate-400" />
                <span>Admin CMS</span>
              </Link>

              <div className="pt-4 flex flex-col space-y-2 px-3">
                <Link
                  href="/online-consultation"
                  className="text-center font-bold text-slate-700 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Jadwalkan Konsultasi
                </Link>
                <Link
                  href="/request-proposal"
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
