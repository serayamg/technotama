'use client';

import React, { useState, useEffect } from 'react';
import { Phone, X, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
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

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteConfig(data))
      .catch(err => console.log('WhatsApp fallback used in button.'));
  }, []);

  const getCleanWhatsAppNumber = () => {
    const rawNumber = siteConfig?.general?.whatsappNumber || '0856-6872-2734';
    const clean = rawNumber.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      return '62' + clean.slice(1);
    }
    return clean.startsWith('62') ? clean : '62' + clean;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Assemble text parameter for WhatsApp Business
    const text = `Halo Technotama,
Saya tertarik menggunakan layanan berikut: ${formData.service}

Nama: ${formData.name}
Perusahaan: ${formData.company}
Email: ${formData.email}
Nomor HP: ${formData.phone}
Kebutuhan: ${formData.needs}
Timeline: ${formData.timeline}
Budget: ${formData.budget}`;

    const whatsappUrl = `https://wa.me/${getCleanWhatsAppNumber()}?text=${encodeURIComponent(text)}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return null;
}
