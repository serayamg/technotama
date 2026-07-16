import React from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, Award, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                RTI Cybersecurity
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              PT Riset Teknologi Indonesia (RTI) adalah konsultan teknologi siber dan tata kelola TI nasional. Kami mendampingi pemerintah, sektor keuangan, dan korporasi mewujudkan kepatuhan dan ketahanan siber berbasis best practice internasional.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://linkedin.com/company/riset-teknologi-indonesia" 
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
                href="https://youtube.com" 
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
                <Link href="/request-proposal" className="hover:text-white transition-colors">Minta Proposal (RFP)</Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">Portal Pelanggan</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">CMS Administrator</Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Layanan Utama
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/services/vapt" className="hover:text-white transition-colors">Vulnerability Assessment & Pentest</Link>
              </li>
              <li>
                <Link href="/services/standards" className="hover:text-white transition-colors">Implementasi ISO 27001 / 20000</Link>
              </li>
              <li>
                <Link href="/services/it-governance" className="hover:text-white transition-colors">Tata Kelola TI (COBIT & SPBE)</Link>
              </li>
              <li>
                <Link href="/services/cyber-strategy" className="hover:text-white transition-colors">Cybersecurity Strategy Blueprint</Link>
              </li>
              <li>
                <Link href="/services/cyber-compliance" className="hover:text-white transition-colors">Compliance & UU PDP Review</Link>
              </li>
              <li>
                <Link href="/services/training" className="hover:text-white transition-colors">CyberTroops Training Academy</Link>
              </li>
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
                  Sudirman Central Business District (SCBD), Lantai 28, Senayan, Jakarta Selatan, 12190
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>0856-6872-2734</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href="mailto:admin@risetin.co.id" className="hover:text-white transition-colors">
                  admin@risetin.co.id
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
          </div>
          <div className="text-xs text-slate-500">
            Kepatuhan Regulasi: <strong className="text-slate-400">OJK, Bank Indonesia, UU PDP No. 27/2022</strong>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <span>
            &copy; {currentYear} PT Riset Teknologi Indonesia (RTI). Hak Cipta Dilindungi Undang-Undang.
          </span>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Secure by Design | Zero Trust Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
