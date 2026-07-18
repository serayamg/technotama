import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PT Riset Teknologi Indonesia (RTI) | Enterprise Cybersecurity & IT Consulting",
  description: "PT Riset Teknologi Indonesia (RTI) membantu kementerian, lembaga pemerintah, BUMN, perbankan, dan korporasi swasta membangun tata kelola TI, keamanan siber, kepatuhan (ISO/PCI DSS), dan audit independen.",
  keywords: "PT Riset Teknologi Indonesia, RTI, cybersecurity indonesia, konsultan TI, VAPT, pentest, ISO 27001, tata kelola TI, audit OJK, kepatuhan UU PDP, cyber security jakarta",
  authors: [{ name: "Riset Teknologi Indonesia" }],
  metadataBase: new URL("https://risetin.co.id"),
  openGraph: {
    title: "PT Riset Teknologi Indonesia | Enterprise Cybersecurity & IT Consulting",
    description: "Layanan konsultansi tata kelola TI, strategi siber, penetration testing, dan sertifikasi ISO kelas dunia untuk sektor pemerintahan dan keuangan di Indonesia.",
    url: "https://risetin.co.id",
    siteName: "RTI",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Riset Teknologi Indonesia | Enterprise Cybersecurity & IT Consulting",
    description: "Layanan konsultansi tata kelola TI, strategi siber, penetration testing, dan sertifikasi ISO kelas dunia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
