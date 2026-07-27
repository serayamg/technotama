import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

const DEFAULT_BLOGS = [
  {
    title: "Panduan Kepatuhan UU Pelindungan Data Pribadi (UU PDP) Indonesia",
    category: "REGULATION",
    summary: "Masa transisi berakhir dan denda administratif hingga 2% pendapatan siap menanti kelalaian pengelolaan data pribadi. Pelajari mitigasinya.",
    content: `<h2>Pendahuluan</h2><p>Masa transisi penyesuaian kepatuhan terhadap Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) telah resmi berakhir. Seluruh organisasi baik publik maupun privat yang bertindak sebagai Pengendali Data Pribadi (Data Controller) kini wajib mematuhi seluruh ketentuan di dalamnya, atau menghadapi sanksi administratif dan hukum yang sangat berat.</p><h2>Sanksi Administratif Hingga 2% Pendapatan</h2><p>Salah satu poin paling krusial dalam UU PDP adalah pengenaan denda administratif paling tinggi 2% dari pendapatan tahunan atau penerimaan tahunan terhadap variabel pelanggaran tertentu. Selain denda finansial, sanksi lain berupa peringatan tertulis, penghentian sementara kegiatan pemrosesan data pribadi, hingga pemusnahan data pribadi juga dapat dijatuhkan oleh Lembaga Penyelenggara Pelindungan Data Pribadi.</p><h2>Langkah Mitigasi Kepatuhan Utama</h2><p>Untuk menghindari risiko sanksi dan menjaga reputasi bisnis, berikut adalah 4 langkah utama yang harus segera diambil oleh manajemen organisasi:</p><ol><li><strong>Penunjukan Data Protection Officer (DPO):</strong> Menunjuk pejabat pelindung data pribadi yang memiliki kompetensi formal untuk mengawasi tata kelola data internal.</li><li><strong>Penyusunan Data Protection Impact Assessment (DPIA):</strong> Melakukan kajian dampak pelindungan data secara berkala, terutama untuk pemrosesan data berisiko tinggi.</li><li><strong>Pembaruan Kebijakan Privasi (Privacy Policy):</strong> Menyesuaikan consent form dan privacy notice pada aplikasi, website, dan kontrak kerja sama pihak ketiga.</li><li><strong>Hardening Keamanan Sistem & Enkripsi:</strong> Menerapkan enkripsi data baik saat transit (data in transit) maupun saat disimpan (data at rest), disertai audit penetration testing berkala.</li></ol><h2>Kesimpulan</h2><p>Kepatuhan terhadap UU PDP bukan lagi sekadar pemenuhan aspek legalitas formal, melainkan bagian integral dari ketahanan siber enterprise. Technotama siap mendampingi organisasi Anda melakukan gap analysis, menyusun kebijakan tata kelola data pribadi, hingga melatih kesiapan DPO internal Anda.</p>`,
    publishedAt: new Date("2026-07-01T00:00:00.000Z")
  },
  {
    title: "Analisis Ancaman Ransomware di Sektor Perbankan Nasional",
    category: "THREAT",
    summary: "Laporan Security Operations Center (SOC) RTI mengenai taktik pemerasan ganda (double extortion) yang menargetkan server cadangan/DRC.",
    content: `<h2>Tren Serangan Ransomware 2026</h2><p>Security Operations Center (SOC) Technotama mendeteksi lonjakan serangan ransomware tertarget (Targeted Ransomware) yang mengincar lembaga jasa keuangan, khususnya perbankan nasional. Taktik yang digunakan oleh kelompok peretas terorganisir kini berfokus pada metode <strong>Double Extortion</strong> (Pemerasan Ganda).</p><h2>Apa itu Double Extortion?</h2><p>Dalam skenario serangan tradisional, peretas hanya mengenkripsi data korban dan meminta tebusan untuk kunci dekripsi. Namun, dalam taktik Double Extortion:</p><ol><li><strong>Data Exfiltration (Pencurian Data):</strong> Peretas mencuri data sensitif nasabah terlebih dahulu sebelum melakukan enkripsi.</li><li><strong>Data Encryption (Enkripsi Sistem):</strong> Peretas mengunci sistem utama dan basis data operasional.</li><li><strong>Pemerasan Ganda:</strong> Korban diperas dua kali—pertama untuk membuka enkripsi sistem, dan kedua untuk mencegah peretas membocorkan data nasabah ke forum gelap (dark web) atau publik.</li></ol><h2>Menargetkan Backup & DRC</h2><p>Laporan intelijen ancaman kami menunjukkan bahwa pelaku serangan aktif mencari dan menghapus bayangan cadangan (volume shadow copies), serta menyusup ke infrastruktur DRC (Disaster Recovery Center) untuk mengunci server backup. Hal ini menyebabkan pemulihan mandiri menjadi hampir mustahil dilakukan oleh tim internal bank tanpa kunci dekripsi.</p><h2>Langkah Antisipasi & Hardening</h2><p>Tim Defensive Cybersecurity RTI merekomendasikan langkah pertahanan mendesak berikut:</p><ul><li>Menerapkan arsitektur <strong>Immutable Backup</strong> (cadangan data yang tidak dapat diubah atau dihapus dalam jangka waktu tertentu).</li><li>Melakukan pemantauan aktivitas mencurigakan 24/7 menggunakan SIEM yang terintegrasi dengan Endpoint Detection and Response (EDR).</li><li>Hardening konfigurasi Active Directory (AD) dan membatasi hak akses administrator menggunakan konsep Least Privilege.</li></ul>`,
    publishedAt: new Date("2026-07-05T00:00:00.000Z")
  },
  {
    title: "Mengapa Sertifikasi ISO/IEC 27001:2022 Penting untuk SPBE",
    category: "REGULATION",
    summary: "Bagaimana implementasi SMKI membantu instansi kementerian dan pemerintah daerah menaikkan tingkat kematangan indeks SPBE nasional.",
    content: `<h2>Pendahuluan</h2><p>Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE) mengamanatkan instansi kementerian, lembaga, dan pemerintah daerah untuk menyelenggarakan layanan digital yang aman dan andal. Standar baku internasional yang diakui untuk mencapai hal ini adalah penerapan Sistem Manajemen Keamanan Informasi (SMKI) berbasis standar ISO/IEC 27001:2022.</p><h2>Korelasi Indeks SPBE dengan Keamanan Informasi</h2><p>Dalam evaluasi berkala kematangan SPBE yang dilakukan oleh Kementerian PANRB, aspek keamanan informasi memegang bobot penilaian yang signifikan. Instansi yang telah mengantongi sertifikat ISO/IEC 27001:2022 secara otomatis mendapatkan nilai kematangan tertinggi pada indikator keamanan teknologi informasi dan komunikasi.</p><h2>Manfaat Utama ISO/IEC 27001:2022 bagi Instansi Pemerintah</h2><ol><li><strong>Perlindungan Data Publik:</strong> Menjamin kerahasiaan, keutuhan, dan ketersediaan data kependudukan maupun administrasi negara.</li><li><strong>Kesiapan Menghadapi Insiden:</strong> Memiliki prosedur penanggulangan insiden keamanan siber (SOP Incident Response) yang terarah.</li><li><strong>Kepercayaan Publik:</strong> Meningkatkan legitimasi dan reputasi layanan digital pemerintah di mata masyarakat luas.</li></ol><h2>Tahapan Implementasi</h2><p>Proses sertifikasi memerlukan komitmen kepemimpinan serta tahapan kerja yang disiplin:</p><ul><li><strong>Gap Analysis:</strong> Memetakan kondisi kontrol keamanan saat ini dibandingkan standar ISO 27001.</li><li><strong>Risk Assessment:</strong> Mengidentifikasi ancaman dan kerentanan aset informasi pemerintahan.</li><li><strong>Penyusunan Kebijakan:</strong> Menyusun dokumen kebijakan keamanan informasi, SOP operasional, dan Statement of Applicability (SoA).</li><li><strong>Internal Audit & Management Review:</strong> Melakukan evaluasi mandiri sebelum diaudit oleh badan sertifikasi independen.</li></ul>`,
    publishedAt: new Date("2026-07-10T00:00:00.000Z")
  },
  {
    title: "Mengapa DevSecOps Harus Mulai Diterapkan Sejak Awal Project",
    category: "NEWS",
    summary: "Pentingnya integrasi Automated SAST/DAST dalam pipa CI/CD untuk menghindari pengerjaan ulang (re-work) pasca pre-production audit.",
    content: `<h2>Pergeseran Paradigma Keamanan: Shift Left</h2><p>Dalam siklus pengembangan software tradisional (SDLC), keamanan siber sering kali baru diuji pada tahap akhir sebelum aplikasi dirilis (pre-production deployment). Hal ini menyebabkan temuan kerentanan kritis memaksa tim pengembang untuk menulis ulang kode (re-work) secara masif, menunda jadwal rilis produk, dan membengkakkan biaya proyek.</p><p>Pendekatan modern mengusung konsep <strong>Shift Left</strong>, yaitu mengintegrasikan keamanan sejak tahap awal desain dan penulisan kode melalui kerangka kerja <strong>DevSecOps</strong>.</p><h2>Integrasi Automated Security Testing</h2><p>Inti dari DevSecOps adalah mengotomatisasi pengujian keamanan siber ke dalam pipa CI/CD (Continuous Integration/Continuous Delivery):</p><ol><li><strong>SAST (Static Application Security Testing):</strong> Memindai source code secara otomatis saat developer melakukan push/commit untuk mendeteksi kerentanan sintaksis, hardcoded credentials, atau celah SQL Injection.</li><li><strong>SCA (Software Composition Analysis):</strong> Menganalisis pustaka pihak ketiga (open-source dependencies) dari celah keamanan yang diketahui (CVE).</li><li><strong>DAST (Dynamic Application Security Testing):</strong> Menguji aplikasi yang sedang berjalan secara dinamis untuk mendeteksi celah runtime seperti XSS atau miskonfigurasi keamanan.</li></ol><h2>Keuntungan Finansial dan Operasional</h2><ul><li><strong>Deteksi Dini Celah Keamanan:</strong> Menemukan kerentanan pada tahap coding 10x lebih murah untuk diperbaiki dibandingkan saat aplikasi sudah live di produksi.</li><li><strong>Rilis Cepat dan Aman:</strong> Tim pengembang dapat merilis pembaruan fitur secara cepat tanpa khawatir mengorbankan standar kepatuhan siber.</li><li><strong>Audit yang Lancar:</strong> Mempermudah pemenuhan standar audit keamanan siber eksternal atau kepatuhan regulasi finansial.</li></ul>`,
    publishedAt: new Date("2026-07-15T00:00:00.000Z")
  }
];

export async function GET() {
  try {
    let blogs = await prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' }
    });

    // Auto-seed if empty
    if (blogs.length === 0) {
      console.log('[INFO] Seeding default blog posts...');
      await prisma.blog.createMany({
        data: DEFAULT_BLOGS
      });
      blogs = await prisma.blog.findMany({
        orderBy: { publishedAt: 'desc' }
      });
    }

    return NextResponse.json(blogs, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch blogs:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, category, content, summary } = body;

    if (!title || !category || !content || !summary) {
      return NextResponse.json(
        { error: 'Title, category, content, and summary are required.' },
        { status: 400 }
      );
    }

    const sanitizeHtml = (htmlStr: string) => {
      // Simple HTML tags sanitizer to keep basic formatting tags like p, h2, strong, etc.
      // but prevent script injection.
      if (!htmlStr) return '';
      return htmlStr
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Strip script tags completely
        .replace(/on\w+="[^"]*"/g, '') // Strip inline JS handlers
        .replace(/javascript:/gi, ''); // Strip javascript href protocol
    };

    const newBlog = await prisma.blog.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        content: sanitizeHtml(content),
        summary: summary.trim(),
        publishedAt: new Date()
      }
    });

    console.log(`[AUDIT LOG] Blog post created: id=${newBlog.id} title=${newBlog.title}`);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to create blog:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
