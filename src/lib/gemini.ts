import fs from 'fs';
import path from 'path';
import { prisma } from './db';

function getDynamicApiKey(): string | undefined {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/site-content.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(data);
      if (config.integrations?.geminiApiKey) {
        return config.integrations.geminiApiKey;
      }
    }
  } catch (err) {
    console.error('Failed to read dynamic Gemini API key:', err);
  }
  return process.env.GEMINI_API_KEY;
}

interface ProposalData {
  company: string;
  name: string;
  email: string;
  serviceType: string;
  details: string;
  budget: string;
  timeline: string;
  industry?: string;
  employees?: string;
  location?: string;
}

export async function generateProposalWithAI(proposal: ProposalData, additionalInstructions?: string): Promise<{ title: string; content: string; isFallback: boolean }> {
  const apiKey = getDynamicApiKey();
  const isKeyAvailable = typeof apiKey === 'string' && apiKey.trim().length > 0;

  const defaultTitle = `Proposal Layanan Keamanan Siber ${proposal.serviceType} - ${proposal.company}`;

  const systemInstructions = `
Anda adalah Konsultan Senior Keamanan Siber di Technotama (Risetin Teknologi Indonesia) Neo.
Tugas Anda adalah membuat proposal penawaran formal yang profesional, mendalam, meyakinkan, dan terstruktur dengan sangat rapi menggunakan Markdown.

Gunakan data berikut untuk mengkustomisasi proposal:
- Nama Perusahaan Client: ${proposal.company}
- Sektor Industri: ${proposal.industry || 'Umum'}
- Jumlah Karyawan: ${proposal.employees || 'Tidak dispesifikasi'}
- Lokasi Kantor: ${proposal.location || 'Tidak dispesifikasi'}
- PIC / Kontak: ${proposal.name} (${proposal.email})
- Layanan yang diajukan: ${proposal.serviceType}
- Detail Kebutuhan: ${proposal.details}
- Budget Perkiraan: ${proposal.budget}
- Target Timeline: ${proposal.timeline}

${additionalInstructions ? `Instruksi Tambahan dari Tim Customer Care: ${additionalInstructions}` : ''}

Struktur Proposal yang harus diikuti:
1. **EXECUTIVE SUMMARY**: Ringkasan kebutuhan client, masalah keamanan siber yang dihadapi industri mereka, dan bagaimana solusi Technotama membantu.
2. **SCOPE OF WORK**: Rincian teknis cakupan pekerjaan disesuaikan dengan jenis layanan (${proposal.serviceType}).
3. **METODOLOGI**: Langkah-langkah pengerjaan terperinci (misal: Discovery, Assessment, Remediation, Reporting).
4. **TIMELINE & DELIVERABLES**: Rencana jadwal proyek dalam periode ${proposal.timeline} serta laporan/hasil akhir yang didapatkan client.
5. **TIM PROYEK & KUALIFIKASI**: Deskripsi singkat tim konsultan Technotama (misal: CEH, CISSP, ISO Lead Auditor).
6. **PENUTUP**: Langkah selanjutnya untuk negosiasi atau kick-off meeting.

Gunakan Bahasa Indonesia yang sangat formal, persuasif, taktis, dan terstruktur dengan rapi. Tambahkan tabel dan bullet points jika diperlukan untuk mempermudah pembacaan. Jangan sebutkan harga spesifik di luar kisaran budget yang diajukan, tawarkan estimasi bernilai tambah tinggi.
`;

  if (!isKeyAvailable) {
    console.log('[GEMINI AI] API Key not set. Generating template-based mock proposal.');
    const fallbackContent = generateFallbackProposal(proposal, additionalInstructions);
    return {
      title: defaultTitle,
      content: fallbackContent,
      isFallback: true
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemInstructions
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (status ${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return {
      title: defaultTitle,
      content: generatedText,
      isFallback: false
    };

  } catch (error) {
    console.error('[GEMINI AI ERROR] Failed to call API:', error);
    // Return fallback content on error
    const fallbackContent = generateFallbackProposal(proposal, additionalInstructions);
    return {
      title: defaultTitle,
      content: fallbackContent + '\n\n*(Catatan Tim: Proposal ini digenerate menggunakan generator template lokal karena kendala koneksi API)*',
      isFallback: true
    };
  }
}

function generateFallbackProposal(p: ProposalData, additional?: string): string {
  const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `# PROPOSAL PENAWARAN LAYANAN KEAMANAN SIBER
**Kategori Layanan:** ${p.serviceType}
**Untuk Client:** ${p.company}
**Tanggal:** ${dateStr}
**PIC Utama:** ${p.name} (${p.email})

---

## 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

PT Risetin Teknologi Indonesia (Technotama) Neo dengan bangga mengajukan proposal penawaran layanan teknologi dan keamanan siber ini untuk **${p.company}**. Di era digitalisasi yang sangat dinamis saat ini, khususnya pada sektor **${p.industry || 'Swasta/Industri'}**, perlindungan terhadap aset digital, data rahasia perusahaan, serta kepercayaan customer adalah prioritas utama.

Berdasarkan deskripsi kebutuhan yang Anda sampaikan:
> "${p.details}"

Technotama merancang program implementasi khusus guna menjawab tantangan tersebut dengan memperkirakan total pengerjaan sesuai dengan target waktu **${p.timeline}** dan kisaran anggaran **${p.budget}**.

---

## 2. RUANG LINGKUP PEKERJAAN (SCOPE OF WORK)

Cakupan pekerjaan dirancang untuk memastikan terpenuhinya kebutuhan spesifik **${p.company}** pada kategori **${p.serviceType}**:

${getScopeText(p.serviceType)}

---

## 3. METODOLOGI PENGERJAAN

Metodologi pengerjaan yang digunakan oleh tim Technotama didasarkan pada standar keamanan internasional (seperti OWASP, OSSTMM, NIST, atau ISO 27001) yang terbagi menjadi empat fase utama:

| Fase Pengerjaan | Aktivitas Utama | Output |
| :--- | :--- | :--- |
| **Fase 1: Discovery & Recon** | Pengumpulan informasi awal, identifikasi aset digital target, penentuan parameter pengujian. | Kick-off memo & daftar aset terverifikasi. |
| **Fase 2: Assessment & Analysis** | Pengujian kerentanan (VA/Pentest) atau gap assessment kebijakan keamanan sesuai standar terkait. | Log kerentanan / analisis kesenjangan (Gap Analysis). |
| **Fase 3: Reporting & Advisory** | Penyusunan laporan temuan beserta panduan teknis perbaikan (remediasi). | Draft Laporan Keamanan & Rekomendasi Mitigasi. |
| **Fase 4: Verification / Retest** | Pengujian ulang (re-testing) untuk memastikan seluruh temuan kritis telah diperbaiki dengan benar. | Laporan Akhir Keamanan (Final Report) & Sertifikat Kepatuhan Technotama. |

---

## 4. ESTIMASI JADWAL (TIMELINE) & DELIVERABLES

Proyek ini diproyeksikan selesai dalam jangka waktu **${p.timeline}** dengan rincian jadwal sebagai berikut:

- **Minggu 1 - 2**: Koordinasi Awal, Pengumpulan Informasi, & Pemetaan Target.
- **Minggu 3 - 5**: Proses Audit Teknis / Gap Analysis & Pengujian Intensif.
- **Minggu 6 - 7**: Penyusunan Laporan Temuan & Diskusi Rekomendasi Tim Teknis.
- **Minggu 8 (Atau Akhir Proyek)**: Retesting, Final Handover, & Penutupan Proyek.

**Dokumen Hasil Akhir (Deliverables):**
1. *Executive Summary Report* (Cocok untuk level Manajemen/C-Level).
2. *Technical Security Assessment Report* (Panduan detail perbaikan untuk tim Developer/IT).
3. *Certificate of Security Compliance* dari Technotama Neo.

---

## 5. PROFIL Technotama & TIM AHLI

Technotama Neo didukung oleh konsultan bersertifikasi internasional terkemuka di bidangnya, memastikan pengerjaan proyek berjalan sesuai standar terbaik industri global. Tim kami memegang sertifikasi:
- **CEH** (Certified Ethical Hacker)
- **CISSP** (Certified Information Systems Security Professional)
- **CHFI** (Computer Hacking Forensic Investigator)
- **ISO 27001 Lead Auditor**

---

## 6. PENUTUP & KELANJUTAN PROYEK

Kami berharap proposal penawaran ini dapat memperjelas pendekatan teknis dan metodologi Technotama Neo dalam meningkatkan postur keamanan siber di **${p.company}**. 

Jika terdapat pertanyaan lebih lanjut atau tim Anda ingin mengadakan rapat kick-off virtual, silakan menghubungi kami langsung melalui PIC Customer Care di email **customercare@risetin.co.id**.

${additional ? `\n--- \n### Catatan Tambahan (Kustomisasi Admin):\n*${additional}*` : ''}
`;
}

function getScopeText(serviceType: string): string {
  switch (serviceType) {
    case 'Offensive Cybersecurity (VA/Pentest)':
      return `- **Vulnerability Assessment**: Pemindaian kerentanan otomatis pada seluruh perimeter jaringan, IP address, server, dan domain.
- **Penetration Testing (Black/Gray/White Box)**: Simulasi peretasan manual terhadap aplikasi web, mobile app, API endpoints, serta network.
- **Secure SDLC & Code Review**: Integrasi pemeriksaan keamanan kode sejak awal siklus pengembangan.
- **Red Teaming Simulation**: Simulasi serangan siber nyata terkoordinasi untuk menguji sensor pertahanan dan respon tim internal.`;
    case 'Cybersecurity Governance (GRC/ISO)':
      return `- **Cybersecurity Blueprint & Roadmap**: Perancangan strategi jangka panjang 3-5 tahun dan alokasi anggaran CapEx/OpEx.
- **IT GRC Development**: Pengembangan tata kelola IT berbasis COBIT 2019 dan kebijakan tingkat tinggi.
- **ISO/IEC Implementation**: Pendampingan kesiapan sertifikasi ISO 27001 (Keamanan), ISO 20000 (Layanan), dan ISO 22301 (BCMS).
- **Business Continuity & BCP-DRP**: Penyusunan rencana tanggap darurat, analisis dampak bisnis (BIA), dan kesiapan infrastruktur DRC.
- **Cyber Drill Simulation**: Uji kesiapan insiden melalui Table-Top Exercise (TTE) dan simulasi phishing terukur.`;
    case 'Defensive Cybersecurity (SOC/CTI)':
      return `- **Managed SOC 24/7**: Pemantauan log keamanan real-time menggunakan korelasi SIEM dan tim analis siber Technotama.
- **Cyber Threat Intelligence (CTI)**: Pemantauan Dark Web dan threat feed global untuk mendeteksi kebocoran kredensial secara dini.
- **Network & Endpoint Hardening**: Pengetatan konfigurasi sistem operasi dan jaringan sesuai standar CIS Benchmarks.
- **Incident Response & Digital Forensics**: Penanganan darurat pemulihan pasca-serangan siber beserta pengumpulan bukti digital forensik.`;
    default:
      return `- **Analysis & Advisory**: Menganalisis kondisi sistem saat ini dan memetakan gap dengan best practices.
- **Security Baseline Check**: Melakukan pemindaian konfigurasi dan sistem pertahanan siber.
- **Rekomendasi Strategis**: Menghasilkan rencana tindak lanjut taktis terukur.`;
  }
}
