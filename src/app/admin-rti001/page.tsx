'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import WhatsAppButton from '@/components/WhatsAppButton';
import WysiwygEditor from '@/components/WysiwygEditor';
import { 
  Lock, Mail, AlertCircle, RefreshCw, LayoutDashboard, 
  Users, Briefcase, FileText, CheckCircle2, TrendingUp, 
  Activity, ArrowRight, Loader2, Plus, Calendar, BadgeInfo,
  Sparkles, Download, Send, Check, Edit3, ExternalLink, FileCode, Wand2, X, Trash2,
  Upload
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const fileType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(fileType, fileType === 'image/jpeg' ? 0.85 : undefined);
          resolve(dataUrl);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'bookings' | 'proposals' | 'orders' | 'blogs' | 'settings'>('analytics');

  // CMS Website Editor States
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // AI Proposal Builder States
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  
  // Proposal Editor States
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  
  // Email Dispatch States
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<{ success?: boolean; error?: string; simulated?: boolean; logPath?: string } | null>(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stats & Data states
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Blog publishing state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('NEWS');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSuccess, setBlogSuccess] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({
      num1,
      num2,
      answer: num1 + num2
    });
  };

  useEffect(() => {
    generateCaptcha();
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && (data.user.role === 'ADMIN' || data.user.role === 'ADMIN_SALES' || data.user.role === 'ADMIN_CUSTOMER_CARE')) {
          setAdminUser(data.user);
          setIsLoggedIn(true);
          fetchAdminData();
        }
      }
    } catch (err) {
      console.log('No admin session.');
    }
  };

  const fetchAdminData = async () => {
    try {
      // 1. Fetch dashboard stats
      const resStats = await fetch('/api/dashboard/stats');
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }

      // 2. Fetch all leads
      const resLeads = await fetch('/api/leads');
      if (resLeads.ok) {
        const dataLeads = await resLeads.json();
        setLeads(dataLeads);
      }

      // 3. Fetch all proposals
      const resProposals = await fetch('/api/proposals');
      if (resProposals.ok) {
        const dataProposals = await resProposals.json();
        setProposals(dataProposals);
      }

      // 4. Fetch all orders
      const resOrders = await fetch('/api/orders');
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }

      // 5. Fetch website settings
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        setSiteConfig(dataSettings);
      }

      // 6. Fetch all blogs
      const resBlogs = await fetch('/api/blogs');
      if (resBlogs.ok) {
        const dataBlogs = await resBlogs.json();
        setBlogs(dataBlogs);
      }

      // 7. Fetch all bookings
      const resBookings = await fetch('/api/bookings');
      if (resBookings.ok) {
        const dataBookings = await resBookings.json();
        setBookings(dataBookings);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    if (parseInt(captchaInput) !== captcha.answer) {
      setLoginError('Captcha verification failed. Please try again.');
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user.role !== 'ADMIN' && data.user.role !== 'ADMIN_SALES' && data.user.role !== 'ADMIN_CUSTOMER_CARE') {
          setLoginError('Access denied. Administrator privileges required.');
          generateCaptcha();
          setLoading(false);
          return;
        }
        setAdminUser(data.user);
        setIsLoggedIn(true);
        fetchAdminData();
      } else {
        setLoginError(data.error || 'Authentication failed.');
        generateCaptcha();
      }
    } catch (err) {
      setLoginError('Server error. Failed to establish connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setAdminUser(null);
      setEmail('');
      setPassword('');
      setCaptchaInput('');
      generateCaptcha();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate content
    const sanitizedContent = blogContent.replace(/<p><br><\/p>/g, '').trim();
    if (!sanitizedContent || sanitizedContent === '') {
      alert('Konten artikel tidak boleh kosong.');
      return;
    }

    try {
      const url = editingBlogId ? `/api/blogs/${editingBlogId}` : '/api/blogs';
      const method = editingBlogId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogTitle,
          category: blogCategory,
          summary: blogSummary,
          content: blogContent
        })
      });

      if (res.ok) {
        setBlogSuccess(true);
        setBlogTitle('');
        setBlogSummary('');
        setBlogContent('');
        setEditingBlogId(null);
        setIsAddingBlog(false);
        setTimeout(() => setBlogSuccess(false), 3000);
        
        // Refresh blogs list
        const resBlogs = await fetch('/api/blogs');
        if (resBlogs.ok) {
          const dataBlogs = await resBlogs.json();
          setBlogs(dataBlogs);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan artikel.');
      }
    } catch (err) {
      console.error('Failed to publish/update blog:', err);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const handleEditBlogClick = (b: any) => {
    setEditingBlogId(b.id);
    setBlogTitle(b.title);
    setBlogCategory(b.category);
    setBlogSummary(b.summary);
    setBlogContent(b.content);
    setIsAddingBlog(true);
  };

  const handleDeleteBlog = async (id: string) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus artikel ini secara permanen?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // Refresh blogs list
        const resBlogs = await fetch('/api/blogs');
        if (resBlogs.ok) {
          const dataBlogs = await resBlogs.json();
          setBlogs(dataBlogs);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus artikel.');
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const handleSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig)
      });

      if (res.ok) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddMenu = () => {
    if (!siteConfig) return;
    const newMenuId = `menu_${Date.now()}`;
    const newMenus = [
      ...(siteConfig.menus || []),
      { id: newMenuId, name: 'Menu Baru', path: '/new-path' }
    ];
    setSiteConfig({ ...siteConfig, menus: newMenus });
  };

  const handleDeleteMenu = (idToDelete: string) => {
    if (!siteConfig) return;
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus menu navigasi ini?');
    if (!confirmDelete) return;
    const newMenus = siteConfig.menus.filter((m: any) => m.id !== idToDelete);
    setSiteConfig({ ...siteConfig, menus: newMenus });
  };

  const handleAddPackage = () => {
    if (!siteConfig) return;
    const newPkgId = `pkg_${Date.now()}`;
    const newPackages = [
      ...(siteConfig.packages || []),
      { 
        id: newPkgId, 
        name: 'Paket Baru', 
        tier: 'Tier Baru', 
        scope: '1 Web App', 
        description: 'Deskripsi ringkas layanan.' 
      }
    ];
    setSiteConfig({ ...siteConfig, packages: newPackages });
  };

  const handleDeletePackage = (idToDelete: string) => {
    if (!siteConfig) return;
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus paket layanan ini?');
    if (!confirmDelete) return;
    const newPackages = siteConfig.packages.filter((p: any) => p.id !== idToDelete);
    setSiteConfig({ ...siteConfig, packages: newPackages });
  };

  const handleAddService = () => {
    if (!siteConfig) return;
    const newSvcId = `svc_${Date.now()}`;
    const newServices = [
      ...(siteConfig.services || []),
      {
        id: newSvcId,
        title: 'Layanan Baru',
        desc: 'Deskripsi lengkap layanan baru.',
        badge: 'New',
        cluster: 'governance',
        imageUrl: '/illustrations/governance.png'
      }
    ];
    setSiteConfig({ ...siteConfig, services: newServices });
  };

  const handleDeleteService = (idToDelete: string) => {
    if (!siteConfig) return;
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus layanan/fitur ini?');
    if (!confirmDelete) return;
    const newServices = siteConfig.services.filter((s: any) => s.id !== idToDelete);
    setSiteConfig({ ...siteConfig, services: newServices });
  };

  // AI Proposal Builder Helper Functions
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    let html = markdown;
    
    // Sanitize basic tags before adding html
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    html = html.replace(/^#\s+(.*?)$/gm, '<h1 style="color: #0f172a; font-size: 20px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">$1</h1>');
    html = html.replace(/^##\s+(.*?)$/gm, '<h2 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">$1</h2>');
    html = html.replace(/^###\s+(.*?)$/gm, '<h3 style="color: #1e293b; font-size: 14px; font-weight: 700; margin-top: 16px;">$1</h3>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*-\s+(.*?)$/gm, '<li style="margin-bottom: 6px;">$1</li>');
    html = html.replace(/^---$/gm, '<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />');
    
    // Basic Markdown Table Converter
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const cells = trimmed.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (trimmed.includes('---')) return '';
        inTable = true;
        const isHeader = !tableHtml.includes('<thead>');
        let row = '<tr>';
        cells.forEach(cell => {
          row += isHeader 
            ? `<th style="border: 1px solid #e2e8f0; padding: 10px; text-align: left; background-color: #f1f5f9; font-weight: bold; color: #334155;">${cell}</th>` 
            : `<td style="border: 1px solid #e2e8f0; padding: 10px; text-align: left;">${cell}</td>`;
        });
        row += '</tr>';
        if (isHeader) {
          tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;"><thead>${row}</thead><tbody>`;
          return 'TABLE_START';
        } else {
          return row;
        }
      } else {
        if (inTable) {
          inTable = false;
          return 'TABLE_END\n' + line;
        }
        return line;
      }
    });
    
    let finalHtml = '';
    let activeTable = '';
    processedLines.forEach(line => {
      if (line === 'TABLE_START') {
        activeTable = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">';
      } else if (line.startsWith('TABLE_END')) {
        activeTable += '</tbody></table>';
        finalHtml += activeTable + '\n' + line.substring(9);
        activeTable = '';
      } else if (activeTable && line) {
        if (line.includes('style="border: 1px solid #e2e8f0; padding: 10px; text-align: left; background-color: #f1f5f9; font-weight: bold; color: #334155;"')) {
          activeTable = activeTable.replace('<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">', '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;"><thead>' + line + '</thead><tbody>');
        } else {
          activeTable += line;
        }
      } else if (line !== '') {
        if (!line.startsWith('<h') && !line.startsWith('<li') && !line.startsWith('<hr') && !line.startsWith('<table')) {
          finalHtml += `<p style="margin-bottom: 14px; font-size: 14px; color: #334155;">${line}</p>\n`;
        } else {
          finalHtml += line + '\n';
        }
      }
    });
    
    finalHtml = finalHtml.replace(/(<li style="margin-bottom: 6px;">.*?<\/li>\n?)+/g, (match) => {
      return `<ul style="margin-bottom: 14px; padding-left: 20px;">\n${match}</ul>\n`;
    });
    
    return finalHtml;
  };

  const downloadWord = (title: string, markdownContent: string) => {
    const htmlContent = convertMarkdownToHtml(markdownContent);
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        h1 { color: #0f172a; font-size: 20pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
        h2 { color: #1e293b; font-size: 16pt; margin-top: 20px; }
        h3 { color: #334155; font-size: 14pt; }
        p, li { font-size: 11pt; color: #334155; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 10.5pt; }
        th { background-color: #f1f5f9; font-weight: bold; }
      </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = (title: string, markdownContent: string) => {
    const htmlContent = convertMarkdownToHtml(markdownContent);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              padding: 40px; 
              color: #334155; 
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
            }
            h1 { color: #0f172a; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; }
            h2 { color: #1e293b; font-size: 18px; margin-top: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
            h3 { color: #334155; font-size: 15px; margin-top: 20px; }
            p { margin-bottom: 15px; font-size: 14px; }
            li { margin-bottom: 8px; font-size: 14px; }
            ul { margin-bottom: 15px; }
            table { border-collapse: collapse; width: 100%; margin: 25px 0; font-size: 13px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; color: #1e293b; }
            blockquote {
              border-left: 4px solid #cbd5e1;
              padding-left: 15px;
              margin-left: 0;
              color: #64748b;
              font-style: italic;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px double #e2e8f0; padding-bottom: 20px;">
            <h1 style="border: none; margin: 0; font-size: 28px; text-transform: uppercase;">PT Risetin Teknologi Indonesia</h1>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b; letter-spacing: 2px;">CYBERSECURITY & TECHNOLOGY CONSULTING</p>
          </div>
          ${htmlContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleOpenProposalBuilder = (proposal: any) => {
    setSelectedProposal(proposal);
    setProposalTitle(proposal.proposalTitle || `Proposal Layanan Keamanan Siber ${proposal.serviceType} - ${proposal.company}`);
    setProposalContent(proposal.generatedContent || '');
    setAdditionalInstructions('');
    setEmailSubject(proposal.proposalTitle || `Penawaran Resmi: ${proposal.serviceType} - Technotama Neo`);
    setEmailBody(proposal.generatedContent ? convertMarkdownToHtml(proposal.generatedContent) : '');
    setEmailSendStatus(null);
    setIsBuilderOpen(true);
  };

  const handleGenerateProposal = async () => {
    if (!selectedProposal) return;
    setIsGenerating(true);
    setGenerationProgress('Menghubungi Gemini AI...');
    
    const steps = [
      'Menghubungi Gemini AI...',
      'Menganalisis profil perusahaan & sektor industri...',
      'Merancang cakupan pekerjaan (Scope of Work)...',
      'Menyusun metodologi pengerjaan...',
      'Menyusun timeline & hasil akhir (Deliverables)...',
      'Mematangkan draf proposal...'
    ];
    
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        stepIdx++;
        setGenerationProgress(steps[stepIdx]);
      }
    }, 2000);

    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: selectedProposal.id,
          additionalInstructions
        })
      });

      const data = await res.json();
      clearInterval(interval);

      if (res.ok) {
        setProposalTitle(data.title);
        setProposalContent(data.content);
        setEmailSubject(`Penawaran Resmi: ${selectedProposal.serviceType} - Technotama Neo`);
        setEmailBody(convertMarkdownToHtml(data.content));
        
        fetchAdminData();
      } else {
        alert(data.error || 'Gagal menghasilkan proposal.');
      }
    } catch (err) {
      clearInterval(interval);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedProposal) return;
    try {
      const res = await fetch('/api/proposals/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: selectedProposal.id,
          title: proposalTitle,
          content: proposalContent
        })
      });
      if (res.ok) {
        alert('Draf proposal berhasil disimpan.');
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan draf.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedProposal) return;
    setIsSendingEmail(true);
    setEmailSendStatus(null);

    try {
      const res = await fetch('/api/proposals/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: selectedProposal.id,
          emailSubject,
          emailBody,
          toEmail: selectedProposal.email
        })
      });

      const data = await res.json();
      if (res.ok) {
        setEmailSendStatus({
          success: true,
          simulated: data.simulated,
          logPath: data.logPath,
          error: data.error
        });
        
        fetchAdminData();
      } else {
        setEmailSendStatus({
          success: false,
          error: data.error || 'Gagal mengirim email.'
        });
      }
    } catch (err) {
      setEmailSendStatus({
        success: false,
        error: 'Terjadi kesalahan jaringan.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Status Color Mapper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'CONTACTED': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'CONVERTED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'PENDING': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'DOC_UPLOADED': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Recharts Chart Config
  const COLORS = ['#2563eb', '#06b6d4', '#d97706', '#10b981', '#6366f1'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!isLoggedIn ? (
            /* Login Admin */
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Technotama Administrator CMS</h1>
                <p className="text-xs text-slate-500 mt-1">Gunakan otentikasi admin untuk masuk ke konsol manajemen leads.</p>
              </div>

              <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />
                
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start space-x-2 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Admin</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email admin"
                      autoComplete="new-username"
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      autoComplete="new-password"
                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Captcha */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Verifikasi Captcha</label>
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg font-mono font-bold text-xs select-none whitespace-nowrap">
                        {captcha.num1} + {captcha.num2} = ?
                      </div>
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-2.5 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 focus:outline-none"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Jawaban"
                        className="flex-1 text-xs font-bold text-center border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Admin Workspace Dashboard */
            <div className="space-y-8">
              {/* Header profile */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-extrabold text-lg">
                    A
                  </div>
                  <div>
                    <h1 className="font-display font-extrabold text-lg text-slate-900 leading-tight">Console Administrator</h1>
                    <p className="text-[10px] font-semibold text-slate-500">Log In sebagai: <strong>{adminUser.email}</strong> (Role: ADMIN)</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 px-4 py-2 border border-slate-200 rounded-lg hover:border-red-100 transition-colors focus:outline-none cursor-pointer"
                >
                  Log Out
                </button>
              </div>

              {/* Layout workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left tab bar */}
                <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-thin max-w-full">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'analytics'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    <span>Analytics Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'leads'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4.5 h-4.5" />
                    <span>Lead Management</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'bookings'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4.5 h-4.5" />
                    <span>Konsultasi & Bookings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('proposals')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'proposals'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>Proposals</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'orders'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4.5 h-4.5" />
                    <span>Project Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('blogs')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'blogs'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Publish Insight/Blog</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`p-3 lg:p-4 rounded-xl text-left border text-xs font-bold transition-all focus:outline-none flex items-center space-x-2.5 shrink-0 ${
                      activeTab === 'settings'
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Wand2 className="w-4.5 h-4.5" />
                    <span>Pengaturan Web (CMS)</span>
                  </button>
                </div>

                {/* Right Content Tab Container */}
                <div className="lg:col-span-9 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8">
                  
                  {/* Analytics Dashboard */}
                  {activeTab === 'analytics' && stats && (
                    <div className="space-y-8">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Statistik Leads & Conversions</h2>
                      
                      {/* Metric cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Leads</span>
                          <span className="font-display font-extrabold text-xl text-slate-900">{stats.leadsCount}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Proposals</span>
                          <span className="font-display font-extrabold text-xl text-slate-900">{stats.proposalsCount}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Orders Aktif</span>
                          <span className="font-display font-extrabold text-xl text-slate-900">{stats.ordersCount}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Conversion Rate</span>
                          <span className="font-display font-extrabold text-xl text-blue-600">{stats.conversionRate}</span>
                        </div>
                      </div>

                      {/* Charts and Distributions */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
                        <div className="md:col-span-7 bg-slate-50/50 border border-slate-100 p-6 rounded-2xl">
                          <h3 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-widest mb-4">Distribusi Order Layanan</h3>
                          <div className="w-full h-[240px]">
                            {stats.chartData?.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={stats.chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {stats.chartData.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                                </PieChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex items-center justify-center text-xs text-slate-400">Belum ada statistik grafik pemesanan.</div>
                            )}
                          </div>
                        </div>

                        {/* Recent logs audit */}
                        <div className="md:col-span-5 space-y-4">
                          <h3 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-widest border-b pb-2">Audit Aktivitas Terbaru</h3>
                          <div className="space-y-3">
                            {stats.recentActivity?.map((act: any) => (
                              <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2 text-xs">
                                <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-bold text-slate-800">{act.title}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{act.detail}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leads Management */}
                  {activeTab === 'leads' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Daftar Qualified Leads</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Nama / Company</th>
                              <th className="py-3 px-4">Kontak</th>
                              <th className="py-3 px-4">Kebutuhan</th>
                              <th className="py-3 px-4">Source</th>
                              <th className="py-3 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leads.map((lead) => (
                              <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{lead.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{lead.company} ({lead.role})</div>
                                </td>
                                <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                                  <div>{lead.email}</div>
                                  <div>{lead.phone}</div>
                                </td>
                                <td className="py-4 px-4 max-w-[200px] leading-relaxed text-slate-600">{lead.needs}</td>
                                <td className="py-4 px-4">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                                    {lead.source}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Bookings Management */}
                  {activeTab === 'bookings' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Jadwal Konsultasi & Bookings Klien</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Klien / Perusahaan</th>
                              <th className="py-3 px-4">Kontak</th>
                              <th className="py-3 px-4">Topik Konsultasi</th>
                              <th className="py-3 px-4">Jadwal & Waktu</th>
                              <th className="py-3 px-4">Platform</th>
                              <th className="py-3 px-4">Deskripsi / Detail</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{booking.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{booking.company}</div>
                                </td>
                                <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                                  <div>{booking.email}</div>
                                  <div>{booking.phone}</div>
                                </td>
                                <td className="py-4 px-4 font-bold text-blue-600">{booking.topic}</td>
                                <td className="py-4 px-4 text-slate-700">
                                  <div className="font-bold">{booking.date}</div>
                                  <div className="text-[10px] text-slate-500">{booking.time}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded">
                                    {booking.platform}
                                  </span>
                                </td>
                                <td className="py-4 px-4 max-w-[200px] leading-relaxed text-slate-500 whitespace-pre-line">
                                  {booking.description || '-'}
                                </td>
                              </tr>
                            ))}
                            {bookings.length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                                  Belum ada jadwal konsultasi atau booking yang masuk.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Proposals Tracker */}
                  {activeTab === 'proposals' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Pelacakan Dokumen RFP/Tender</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Company / PIC</th>
                              <th className="py-3 px-4">Layanan</th>
                              <th className="py-3 px-4">Budget / Timeline</th>
                              <th className="py-3 px-4">Dokumen TOR</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proposals.map((prop) => (
                              <tr key={prop.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{prop.company}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{prop.name} ({prop.email})</div>
                                </td>
                                <td className="py-4 px-4 text-slate-600 font-semibold">{prop.serviceType}</td>
                                <td className="py-4 px-4 text-slate-600">
                                  <div>Budget: {prop.budget}</div>
                                  <div>Timeline: {prop.timeline}</div>
                                </td>
                                <td className="py-4 px-4">
                                  {prop.fileName ? (
                                    <button 
                                      onClick={() => alert(`Mengunduh dokumen: ${prop.fileName}`)}
                                      className="flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-700 underline focus:outline-none cursor-pointer"
                                    >
                                      <FileText className="w-4 h-4 shrink-0" />
                                      <span className="truncate max-w-[120px]">{prop.fileName}</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 italic">No Upload</span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getStatusColor(prop.status)}`}>
                                    {prop.status}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button 
                                    onClick={() => handleOpenProposalBuilder(prop)}
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                                  >
                                    <Sparkles className="w-3 h-3 text-blue-200" />
                                    <span>AI Builder</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Orders manager */}
                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      <h2 className="font-display font-extrabold text-base text-slate-900 border-b pb-3">Project Orders & Invoicing</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider bg-slate-50/50">
                              <th className="py-3 px-4">Company Name</th>
                              <th className="py-3 px-4">Service Type</th>
                              <th className="py-3 px-4">Invoice / Quotation</th>
                              <th className="py-3 px-4">Tanggal Order</th>
                              <th className="py-3 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((ord) => (
                              <tr key={ord.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="py-4 px-4 font-bold text-slate-800">{ord.companyName}</td>
                                <td className="py-4 px-4 text-slate-600 font-semibold">{ord.serviceType}</td>
                                <td className="py-4 px-4 font-mono text-[10px] text-slate-500">
                                  <div>Quote: {ord.quotationPath}</div>
                                  <div>Inv: {ord.invoicePath}</div>
                                </td>
                                <td className="py-4 px-4 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-4">
                                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${getStatusColor(ord.status)}`}>
                                    {ord.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Publish Blog */}
                  {activeTab === 'blogs' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h2 className="font-display font-extrabold text-base text-slate-900">CMS Pengelola Blog & Insight</h2>
                        {!isAddingBlog && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBlogId(null);
                              setBlogTitle('');
                              setBlogSummary('');
                              setBlogContent('');
                              setBlogCategory('NEWS');
                              setIsAddingBlog(true);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 cursor-pointer transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Artikel Baru</span>
                          </button>
                        )}
                      </div>

                      {blogSuccess && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start space-x-2 text-xs text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Artikel berhasil disimpan dan dipublikasikan ke halaman utama.</span>
                        </div>
                      )}

                      {!isAddingBlog ? (
                        /* Blog Posts List Table */
                        <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm bg-white">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                  <th className="py-3 px-4">Judul Artikel</th>
                                  <th className="py-3 px-4">Kategori</th>
                                  <th className="py-3 px-4">Tanggal Rilis</th>
                                  <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {blogs.map((b) => (
                                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4">
                                      <div className="font-bold text-slate-800 text-xs line-clamp-1">{b.title}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{b.summary}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                                        b.category === 'REGULATION' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        b.category === 'THREAT' ? 'bg-red-50 text-red-600 border-red-100' :
                                        b.category === 'TREND' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-purple-50 text-purple-600 border-purple-100'
                                      }`}>
                                        {b.category}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 text-slate-500 font-semibold">
                                      {new Date(b.publishedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </td>
                                    <td className="py-4 px-4 text-right space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleEditBlogClick(b)}
                                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteBlog(b.id)}
                                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {blogs.length === 0 && (
                                  <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                                      Belum ada artikel dipublikasikan. Klik tombol &quot;Tambah Artikel Baru&quot; di atas untuk memulai.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        /* Add/Edit Blog Form */
                        <form onSubmit={handlePublishBlog} className="space-y-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                          <h3 className="font-display font-extrabold text-sm text-slate-900 border-b pb-3 flex items-center justify-between">
                            <span>{editingBlogId ? '📝 Edit Artikel' : '✨ Buat Artikel Baru'}</span>
                            <span className="text-[10px] font-bold text-slate-400">Status: Draft &bull; Publish</span>
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-8">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Judul Artikel *</label>
                              <input
                                type="text"
                                required
                                value={blogTitle}
                                onChange={(e) => setBlogTitle(e.target.value)}
                                placeholder="Contoh: Analisis Ancaman Malware Lockbit Terhadap Layanan Publik"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori Artikel</label>
                              <select
                                value={blogCategory}
                                onChange={(e) => setBlogCategory(e.target.value)}
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:border-blue-500 transition-all"
                              >
                                <option value="NEWS">NEWS / UPDATE</option>
                                <option value="THREAT">THREAT INTELLIGENCE</option>
                                <option value="REGULATION">REGULATION UPDATE</option>
                                <option value="TREND">TECHNOLOGY TREND</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ringkasan Singkat (Snippet Deskripsi) *</label>
                            <input
                              type="text"
                              required
                              value={blogSummary}
                              onChange={(e) => setBlogSummary(e.target.value)}
                              placeholder="Tulis ringkasan singkat 1-2 kalimat untuk preview postingan..."
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Konten Artikel Lengkap *</label>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Mendukung WYSIWYG & HTML</span>
                            </div>
                            <WysiwygEditor
                              value={blogContent}
                              onChange={setBlogContent}
                              placeholder="Ketik isi lengkap artikel di sini..."
                            />
                          </div>

                          <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                            <button
                              type="submit"
                              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                            >
                              {editingBlogId ? 'Simpan Perubahan' : 'Publish Artikel'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingBlog(false);
                                setEditingBlogId(null);
                              }}
                              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Settings CMS View */}
                  {activeTab === 'settings' && siteConfig && (
                    <form onSubmit={handleSubmitSettings} className="space-y-8">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h2 className="font-display font-extrabold text-base text-slate-900">Pengaturan Konten Website Technotama</h2>
                        {settingsSuccess && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                            Pengaturan Berhasil Disimpan!
                          </span>
                        )}
                      </div>

                      {/* General parameters */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-700 border-b pb-1 uppercase tracking-wider">Parameter & Kontak Umum</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Perusahaan (Panjang)</label>
                            <input
                              type="text"
                              value={siteConfig.general.companyName || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, companyName: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Perusahaan (Pendek)</label>
                            <input
                              type="text"
                              value={siteConfig.general.companyShortName || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, companyShortName: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Resmi</label>
                            <input
                              type="email"
                              value={siteConfig.general.email || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, email: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Telepon</label>
                            <input
                              type="text"
                              value={siteConfig.general.phone || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, phone: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                            <div className="flex items-center space-x-2 mt-1.5">
                              <input
                                type="checkbox"
                                id="showPhone"
                                checked={!!siteConfig.general.showPhone}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  general: { ...siteConfig.general, showPhone: e.target.checked }
                                })}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                              />
                              <label htmlFor="showPhone" className="text-[10px] font-semibold text-slate-500 cursor-pointer select-none">
                                Tampilkan Nomor Telepon di Footer Halaman
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor WhatsApp Utama</label>
                            <input
                              type="text"
                              value={siteConfig.general.whatsappNumber || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, whatsappNumber: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>

                          <div className="md:col-span-2 border border-slate-200/80 p-5 rounded-2xl bg-slate-50/50 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Daftar Hubungan WhatsApp Terkoneksi</label>
                                <p className="text-[9px] text-slate-400 font-medium">Nomor WhatsApp departemen/kontak tambahan yang terhubung dengan website Technotama.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = siteConfig.general.whatsappNumbers || [];
                                  setSiteConfig({
                                    ...siteConfig,
                                    general: {
                                      ...siteConfig.general,
                                      whatsappNumbers: [...list, { label: 'Departemen Baru', number: '0878-8333-6017' }]
                                    }
                                  });
                                }}
                                className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-xl flex items-center space-x-1 cursor-pointer select-none transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Nomor</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(siteConfig.general.whatsappNumbers || []).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center space-x-3 bg-white p-3.5 border border-slate-200/60 rounded-xl shadow-sm">
                                  <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Nama Hubungan / Label</label>
                                      <input
                                        type="text"
                                        value={item.label || ''}
                                        onChange={(e) => {
                                          const list = JSON.parse(JSON.stringify(siteConfig.general.whatsappNumbers || []));
                                          list[idx].label = e.target.value;
                                          setSiteConfig({
                                            ...siteConfig,
                                            general: { ...siteConfig.general, whatsappNumbers: list }
                                          });
                                        }}
                                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Nomor WhatsApp</label>
                                      <input
                                        type="text"
                                        value={item.number || ''}
                                        onChange={(e) => {
                                          const list = JSON.parse(JSON.stringify(siteConfig.general.whatsappNumbers || []));
                                          list[idx].number = e.target.value;
                                          setSiteConfig({
                                            ...siteConfig,
                                            general: { ...siteConfig.general, whatsappNumbers: list }
                                          });
                                        }}
                                        className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = (siteConfig.general.whatsappNumbers || []).filter((_: any, i: number) => i !== idx);
                                      setSiteConfig({
                                        ...siteConfig,
                                        general: { ...siteConfig.general, whatsappNumbers: list }
                                      });
                                    }}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              {(siteConfig.general.whatsappNumbers || []).length === 0 && (
                                <div className="text-[11px] text-slate-400 italic text-center py-4 bg-white border border-dashed border-slate-200 rounded-xl">
                                  Belum ada nomor WhatsApp tambahan terdaftar.
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
                            <input
                              type="text"
                              value={siteConfig.general.linkedin || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, linkedin: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">YouTube URL</label>
                            <input
                              type="text"
                              value={siteConfig.general.youtube || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                general: { ...siteConfig.general, youtube: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alamat Kantor Resmi</label>
                          <textarea
                            rows={2}
                            value={siteConfig.general.address || ''}
                            onChange={(e) => setSiteConfig({
                              ...siteConfig,
                              general: { ...siteConfig.general, address: e.target.value }
                            })}
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Hero Section */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-700 border-b pb-1 uppercase tracking-wider">Konten Hero Landing Page</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Badge (Text Kecil Atas)</label>
                            <input
                              type="text"
                              value={siteConfig.hero.badge || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                hero: { ...siteConfig.hero, badge: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Judul Utama (Title)</label>
                            <input
                              type="text"
                              value={siteConfig.hero.title || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                hero: { ...siteConfig.hero, title: e.target.value }
                              })}
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sub-judul Deskripsi (Subtitle)</label>
                            <textarea
                              rows={3}
                              value={siteConfig.hero.subtitle || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                hero: { ...siteConfig.hero, subtitle: e.target.value }
                            })}
                            className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Menus Manager */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between border-b pb-1">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perubahan Menu Navigasi</h3>
                        <button
                          type="button"
                          onClick={handleAddMenu}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold rounded-lg border border-blue-200 flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Menu Navigasi</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        {siteConfig.menus && siteConfig.menus.map((menu: any, index: number) => (
                          <div key={menu.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                            <div className="sm:col-span-2 text-[10px] font-bold uppercase text-slate-400">ID: {menu.id}</div>
                            <div className="sm:col-span-4">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nama Menu</label>
                              <input
                                type="text"
                                value={menu.name}
                                onChange={(e) => {
                                  const updatedMenus = [...siteConfig.menus];
                                  updatedMenus[index] = { ...menu, name: e.target.value };
                                  setSiteConfig({ ...siteConfig, menus: updatedMenus });
                                }}
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Path / URL</label>
                              <input
                                type="text"
                                value={menu.path}
                                onChange={(e) => {
                                  const updatedMenus = [...siteConfig.menus];
                                  updatedMenus[index] = { ...menu, path: e.target.value };
                                  setSiteConfig({ ...siteConfig, menus: updatedMenus });
                                }}
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div className="sm:col-span-2 flex justify-end pt-2 sm:pt-0">
                              <button
                                type="button"
                                onClick={() => handleDeleteMenu(menu.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors cursor-pointer flex items-center space-x-1"
                                title="Hapus Menu"
                              >
                                <X className="w-4 h-4" />
                                <span className="sm:hidden text-xs font-semibold">Hapus</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Services Manager */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between border-b pb-1">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perubahan Fitur & Layanan Utama</h3>
                        <button
                          type="button"
                          onClick={handleAddService}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold rounded-lg border border-blue-200 flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Layanan Baru</span>
                        </button>
                      </div>
                      <div className="space-y-4">
                        {siteConfig.services && siteConfig.services.map((svc: any, index: number) => (
                          <div key={svc.id} className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 relative">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">ID: {svc.id}</span>
                              <div className="flex items-center space-x-3">
                                <span className="text-[9px] text-slate-400 font-medium">Layanan ke-{index + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteService(svc.id)}
                                  className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Hapus Layanan</span>
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                              <div className="sm:col-span-3">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Judul Layanan</label>
                                <input
                                  type="text"
                                  value={svc.title}
                                  onChange={(e) => {
                                    const updatedServices = [...siteConfig.services];
                                    updatedServices[index] = { ...svc, title: e.target.value };
                                    setSiteConfig({ ...siteConfig, services: updatedServices });
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Badge (Text Highlight)</label>
                                <input
                                  type="text"
                                  value={svc.badge}
                                  onChange={(e) => {
                                    const updatedServices = [...siteConfig.services];
                                    updatedServices[index] = { ...svc, badge: e.target.value };
                                    setSiteConfig({ ...siteConfig, services: updatedServices });
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Kategori (Cluster)</label>
                                <select
                                  value={svc.cluster}
                                  onChange={(e) => {
                                    const updatedServices = [...siteConfig.services];
                                    updatedServices[index] = { ...svc, cluster: e.target.value };
                                    setSiteConfig({ ...siteConfig, services: updatedServices });
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                >
                                  <option value="governance">Governance</option>
                                  <option value="offensive">Offensive</option>
                                  <option value="defensive">Defensive</option>
                                </select>
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Ilustrasi / Infografis</label>
                                <div className="space-y-2">
                                  {svc.imageUrl && (
                                    <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
                                      <img
                                        src={svc.imageUrl}
                                        alt="Preview"
                                        className="h-10 w-16 object-cover rounded-lg border border-slate-200 bg-white shadow-sm"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[8px] text-slate-400 truncate font-mono">
                                          {svc.imageUrl.startsWith('data:') ? 'Base64 Encoded Image' : svc.imageUrl}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedServices = [...siteConfig.services];
                                          updatedServices[index] = { ...svc, imageUrl: '' };
                                          setSiteConfig({ ...siteConfig, services: updatedServices });
                                        }}
                                        className="py-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-[9px] font-bold cursor-pointer"
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <label className="cursor-pointer bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center space-x-1.5 transition-colors shrink-0 shadow-sm">
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Unggah</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            try {
                                              const resizedBase64 = await resizeImage(file, 800, 450);
                                              const updatedServices = [...siteConfig.services];
                                              updatedServices[index] = { ...svc, imageUrl: resizedBase64 };
                                              setSiteConfig({ ...siteConfig, services: updatedServices });
                                            } catch (err) {
                                              alert('Gagal memproses gambar.');
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Atau masukkan URL gambar..."
                                      value={svc.imageUrl || ''}
                                      onChange={(e) => {
                                        const updatedServices = [...siteConfig.services];
                                        updatedServices[index] = { ...svc, imageUrl: e.target.value };
                                        setSiteConfig({ ...siteConfig, services: updatedServices });
                                      }}
                                      className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="text-[8px] text-slate-400 font-semibold leading-normal uppercase">
                                    💡 Gambar diunggah akan otomatis disesuaikan (maksimal lebar 800px).
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                              <textarea
                                rows={2}
                                value={svc.desc}
                                onChange={(e) => {
                                  const updatedServices = [...siteConfig.services];
                                  updatedServices[index] = { ...svc, desc: e.target.value };
                                  setSiteConfig({ ...siteConfig, services: updatedServices });
                                }}
                                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Packages Manager */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between border-b pb-1">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perubahan Paket & Layanan Transparan</h3>
                        <button
                          type="button"
                          onClick={handleAddPackage}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold rounded-lg border border-blue-200 flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Paket Baru</span>
                        </button>
                      </div>
                      <div className="space-y-4">
                        {siteConfig.packages && siteConfig.packages.map((pkg: any, index: number) => (
                          <div key={pkg.id} className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 relative">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">ID: {pkg.id}</span>
                              <div className="flex items-center space-x-3">
                                <span className="text-[9px] text-slate-400 font-medium">Paket ke-{index + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Hapus Paket</span>
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nama Paket</label>
                                <input
                                  type="text"
                                  value={pkg.name}
                                  onChange={(e) => {
                                    const updatedPkgs = [...siteConfig.packages];
                                    updatedPkgs[index] = { ...pkg, name: e.target.value };
                                    setSiteConfig({ ...siteConfig, packages: updatedPkgs });
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tier / Level</label>
                                <input
                                  type="text"
                                  value={pkg.tier}
                                  onChange={(e) => {
                                    const updatedPkgs = [...siteConfig.packages];
                                    updatedPkgs[index] = { ...pkg, tier: e.target.value };
                                    setSiteConfig({ ...siteConfig, packages: updatedPkgs });
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Cakupan (Scope)</label>
                                <input
                                  type="text"
                                  value={pkg.scope}
                                  onChange={(e) => {
                                    const updatedPkgs = [...siteConfig.packages];
                                    updatedPkgs[index] = { ...pkg, scope: e.target.value };
                                    setSiteConfig({ ...siteConfig, packages: updatedPkgs });
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Penjelasan / Deskripsi Ringkas</label>
                              <textarea
                                rows={2}
                                value={pkg.description}
                                onChange={(e) => {
                                  const updatedPkgs = [...siteConfig.packages];
                                  updatedPkgs[index] = { ...pkg, description: e.target.value };
                                  setSiteConfig({ ...siteConfig, packages: updatedPkgs });
                                }}
                                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* API & Connection Integrations */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-700 border-b pb-1 uppercase tracking-wider">Integrasi API & Koneksi Sistem</h3>
                      <div className="space-y-4">
                        {/* AI API Settings */}
                        <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <span>Konfigurasi API AI (Gemini)</span>
                          </h4>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Gemini API Key</label>
                            <input
                              type="password"
                              value={siteConfig.integrations?.geminiApiKey || ''}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                integrations: { ...siteConfig.integrations, geminiApiKey: e.target.value }
                              })}
                              placeholder="Masukkan Gemini API Key (e.g. AIzaSy...)"
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-[9px] text-slate-400 mt-1">Kosongkan jika ingin menggunakan API Key default dari server env (`GEMINI_API_KEY`).</p>
                          </div>
                        </div>

                        {/* Email Connection settings */}
                        <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span>Koneksi Email (SMTP Server)</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">SMTP Host</label>
                              <input
                                type="text"
                                value={siteConfig.integrations?.smtpHost || ''}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, smtpHost: e.target.value }
                                })}
                                placeholder="smtp.gmail.com"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">SMTP Port</label>
                              <input
                                type="text"
                                value={siteConfig.integrations?.smtpPort || '587'}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, smtpPort: e.target.value }
                                })}
                                placeholder="587"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Username / Email SMTP</label>
                              <input
                                type="text"
                                value={siteConfig.integrations?.smtpUser || ''}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, smtpUser: e.target.value }
                                })}
                                placeholder="customercare@risetin.co.id"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Password SMTP</label>
                              <input
                                type="password"
                                value={siteConfig.integrations?.smtpPassword || ''}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, smtpPassword: e.target.value }
                                })}
                                placeholder="••••••••••••"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Email Pengirim (SMTP From)</label>
                              <input
                                type="text"
                                value={siteConfig.integrations?.smtpFrom || ''}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, smtpFrom: e.target.value }
                                })}
                                placeholder="customercare@risetin.co.id"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Connection settings */}
                        <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <Send className="w-4 h-4 text-blue-500" />
                            <span>Koneksi WhatsApp Gateway</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">WhatsApp Gateway URL</label>
                              <input
                                type="text"
                                value={siteConfig.integrations?.whatsappGatewayUrl || ''}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, whatsappGatewayUrl: e.target.value }
                                })}
                                placeholder="https://api.whatsapp.com/v1"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">WhatsApp API Token</label>
                              <input
                                type="password"
                                value={siteConfig.integrations?.whatsappToken || ''}
                                onChange={(e) => setSiteConfig({
                                  ...siteConfig,
                                  integrations: { ...siteConfig.integrations, whatsappToken: e.target.value }
                                })}
                                placeholder="••••••••••••"
                                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1">Gunakan gateway WhatsApp untuk integrasi pengiriman notifikasi/proposal siber via pesan instan WhatsApp secara otomatis di masa mendatang.</p>
                        </div>
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="py-3 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-4"
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyimpan Perubahan...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Simpan Seluruh Pengaturan Web</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Proposal Builder Modal Workspace */}
      {isBuilderOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-y-auto lg:overflow-hidden border border-slate-100 relative animate-in fade-in-50 zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-display font-extrabold text-sm leading-tight text-white">AI Proposal Builder Workspace</h3>
                  <p className="text-[10px] text-slate-400">Merespon RFP dari {selectedProposal.company} secara cerdas</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBuilderOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xs p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
              >
                Tutup Panel
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
              
              {/* Left Column: Metadata & Actions */}
              <div className="w-full lg:w-96 border-r border-slate-200 p-6 overflow-y-auto bg-slate-50 space-y-6 flex-shrink-0">
                
                {/* Client RFP Details Card */}
                <div className="space-y-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <h4 className="font-display font-bold text-xs text-slate-800 border-b pb-2 uppercase tracking-wide">Detail Kebutuhan Client</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Perusahaan / Industri</span>
                      <strong className="text-slate-800">{selectedProposal.company}</strong>
                      <span className="text-slate-500 block text-[10px] mt-0.5">{selectedProposal.industry} ({selectedProposal.employees} Karyawan)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Kontak PIC</span>
                      <strong className="text-slate-800">{selectedProposal.name}</strong>
                      <span className="text-slate-500 block font-mono text-[10px]">{selectedProposal.email} | {selectedProposal.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Layanan Diajukan</span>
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] border border-blue-100">{selectedProposal.serviceType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimasi Budget & Timeline</span>
                      <span className="text-slate-700 block font-semibold">{selectedProposal.budget} | {selectedProposal.timeline}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Detail Pengajuan</span>
                      <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 text-[10px] max-h-24 overflow-y-auto leading-relaxed">
                        "{selectedProposal.details}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Configuration Section */}
                <div className="space-y-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <h4 className="font-display font-bold text-xs text-slate-800 border-b pb-2 uppercase tracking-wide flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Konfigurasi Gemini AI</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pilih Model AI</label>
                      <select className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none">
                        <option>Gemini 2.5 Flash (Medium - Rekomendasi)</option>
                        <option>Gemini 2.5 Pro (High - Detail & Kompleks)</option>
                        <option>Technotama Local Template Engine (Offline Fallback)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Instruksi Tambahan (Opsional)</label>
                      <textarea
                        rows={3}
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                        placeholder="Contoh: Berikan diskon 15%, tekankan kepatuhan regulasi OJK RI, tambahkan opsi retesting gratis..."
                        className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-all resize-none bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <button
                      onClick={handleGenerateProposal}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="truncate max-w-[150px]">{generationProgress}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Buat Proposal Baru (AI)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Proposal Status Badge */}
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Status Proposal Saat Ini</span>
                  <span className={`text-[10px] font-bold border px-3 py-1 rounded-full bg-white ${getStatusColor(selectedProposal.status)}`}>
                    {selectedProposal.status}
                  </span>
                </div>

              </div>

              {/* Right Column: Editor Workspace & Action tabs */}
              <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden bg-white">
                
                {isGenerating ? (
                  /* Loading Generation Panel */
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center animate-pulse shadow-sm">
                      <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-slate-900">Gemini AI Sedang Menulis Proposal...</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{generationProgress}</p>
                    </div>
                    <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-0 bg-blue-600 rounded-full animate-pulse w-full" />
                    </div>
                  </div>
                ) : !proposalContent ? (
                  /* Initial Empty Workspace */
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 bg-slate-50/50">
                    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shadow-xs">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-slate-800">Draf Proposal Kosong</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">Tekan tombol <strong>"Buat Proposal Baru (AI)"</strong> di panel kiri untuk memicu kecerdasan Gemini menyusun penawaran keamanan siber profesional.</p>
                    </div>
                  </div>
                ) : (
                  /* Editor and Delivery Tabs */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* Proposal Document Title & Download Toolbar */}
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-shrink-0">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={proposalTitle}
                          onChange={(e) => setProposalTitle(e.target.value)}
                          placeholder="Proposal Title..."
                          className="w-full bg-transparent font-display font-extrabold text-sm text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none pb-0.5"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Edit judul di atas untuk mengubah nama dokumen/subject</span>
                      </div>
                      
                      {/* Document Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={handleSaveDraft}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg transition-colors cursor-pointer bg-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan Draf</span>
                        </button>
                        
                        <button
                          onClick={() => downloadWord(proposalTitle, proposalContent)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-200" />
                          <span>Word (.doc)</span>
                        </button>

                        <button
                          onClick={() => downloadPdf(proposalTitle, proposalContent)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-200" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Main workspace container: editor + email */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
                      
                      {/* Editor Section */}
                      <div className="flex-1 flex flex-col p-6 overflow-hidden border-r border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-1">
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Konten Proposal (Format Markdown)</span>
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium">Bisa diedit secara bebas</span>
                        </div>
                        
                        <textarea
                          value={proposalContent}
                          onChange={(e) => {
                            setProposalContent(e.target.value);
                            setEmailBody(convertMarkdownToHtml(e.target.value));
                          }}
                          className="flex-1 w-full border border-slate-200 rounded-xl p-4 font-mono text-[11px] text-slate-700 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white resize-none leading-relaxed"
                          placeholder="Proposal content in Markdown..."
                        />
                      </div>

                      {/* Email Integration Panel */}
                      <div className="w-full md:w-80 p-6 bg-slate-50/50 overflow-y-auto flex-shrink-0 flex flex-col space-y-4">
                        <h4 className="font-display font-bold text-xs text-slate-800 border-b pb-2 uppercase tracking-wide flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <span>Kirim Proposal ke Client</span>
                        </h4>

                        {emailSendStatus && (
                          <div className={`p-3 rounded-lg border text-xs leading-relaxed space-y-1.5 ${
                            emailSendStatus.success 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                              : 'bg-red-50 border-red-100 text-red-800'
                          }`}>
                            <div className="font-bold flex items-center space-x-1">
                              {emailSendStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                              <span>{emailSendStatus.success ? 'Email Berhasil Terkirim!' : 'Email Gagal Terkirim'}</span>
                            </div>
                            
                            <p className="text-[10px]">{emailSendStatus.error || (emailSendStatus.simulated ? 'Disimulasikan berhasil (SMTP offline).' : 'Terkirim langsung via SMTP.')}</p>
                            
                            {emailSendStatus.success && emailSendStatus.simulated && emailSendStatus.logPath && (
                              <a 
                                href={emailSendStatus.logPath} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-0.5 font-bold text-blue-600 hover:text-blue-700 underline text-[10px]"
                              >
                                <span>Buka Simulasi Email</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kepada (Email Client)</label>
                            <input
                              type="email"
                              required
                              value={selectedProposal.email}
                              disabled
                              className="w-full text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-2 bg-slate-100 cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subjek Email</label>
                            <input
                              type="text"
                              required
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              placeholder="Masukkan subjek email..."
                              className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Catatan Pengantar Email (Opsional)</label>
                            <p className="text-[9px] text-slate-400 mb-1 leading-snug">Konten proposal otomatis terlampir di dalam badan email menggunakan desain Technotama resmi.</p>
                            <textarea
                              rows={4}
                              value={emailBody.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                              disabled
                              className="w-full text-[10px] font-semibold text-slate-400 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-100 cursor-not-allowed resize-none"
                            />
                          </div>

                          <button
                            onClick={handleSendEmail}
                            disabled={isSendingEmail}
                            className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                          >
                            {isSendingEmail ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Mengirim...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Kirim Proposal (Email)</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

      <Chatbot />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}
