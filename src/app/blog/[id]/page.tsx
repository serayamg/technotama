'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, User, Tag, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/blogs/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Artikel tidak ditemukan atau terjadi kesalahan server.');
        }
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      REGULATION: 'Regulasi & Kepatuhan',
      THREAT: 'Ancaman Keamanan siber',
      TREND: 'Tren & Teknologi',
      NEWS: 'Riset & Berita'
    };
    return map[cat] || cat;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-xs font-bold text-slate-500">Memuat artikel...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="font-display font-extrabold text-sm text-slate-900">Gagal Memuat Artikel</h3>
                <p className="text-xs text-slate-500 mt-1">{error}</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}

          {!loading && !error && blog && (
            <article className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-400">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{getCategoryLabel(blog.category)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>RTI Research Team</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight tracking-tight">
                {blog.title}
              </h1>

              {/* Summary Block */}
              <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                {blog.summary}
              </div>

              {/* Content Body */}
              <div 
                className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-5 
                  prose-headings:font-display prose-headings:font-extrabold prose-headings:text-slate-950 prose-headings:tracking-tight 
                  prose-h2:text-lg sm:prose-h2:text-xl prose-h2:pt-4
                  prose-strong:text-slate-900 prose-strong:font-bold
                  prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-2
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2
                  prose-li:pl-1
                "
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Footer CTA */}
              <div className="border-t border-slate-100 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="font-display font-extrabold text-xs text-slate-800">Butuh bantuan konsultasi keamanan siber?</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Diskusikan perlindungan sistem organisasi Anda bersama tim RTI.</p>
                </div>
                <Link
                  href="/online-consultation?ref=blog"
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors text-center cursor-pointer"
                >
                  Jadwalkan Konsultasi Gratis
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
