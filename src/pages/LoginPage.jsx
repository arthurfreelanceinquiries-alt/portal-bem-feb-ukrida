import React, { useState } from 'react';
import {
  Shield,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Mock credentials — bisa disambungkan ke Supabase nanti
const ADMIN_CREDENTIALS = [
  { nim: '312023002', password: 'ketua2026', name: 'Arthur Reezan', jabatan: 'Ketua Umum BEM FEB', role: 'BPH_KETUA' },
  { nim: '322024025', password: 'wakil2026', name: 'Princess Auralia Barus', jabatan: 'Wakil Ketua BEM FEB', role: 'BPH_KETUA' },
  { nim: '312023015', password: 'sekretaris2026', name: 'Clara Michelle', jabatan: 'Sekretaris Umum', role: 'BPH_KETUA' },
  { nim: '322023008', password: 'bendahara2026', name: 'Sarah Amalia', jabatan: 'Bendahara Umum', role: 'BENDAHARA' },
  // Dev quick access
  { nim: 'bph', password: 'dev123', name: 'Arthur Reezan (Dev)', jabatan: 'Ketua Umum BEM FEB', role: 'BPH_KETUA' },
];

const MEMBER_CREDENTIALS = [
  { nim: '312023044', password: 'psdm2026', name: 'Dimas Prasetyo', jabatan: 'Koordinator PSDM', divisi: 'Pengembangan SDM (PSDM)', role: 'KOOR_DIVISI' },
  { nim: '322024011', password: 'fungsionaris', name: 'Vania Stephanie', jabatan: 'Staf PSDM', divisi: 'Pengembangan SDM (PSDM)', role: 'ANGGOTA_STAF' },
  { nim: '312023027', password: 'akademik2026', name: 'Jessica Tanuwijaya', jabatan: 'Koordinator Akademik', divisi: 'Akademik & Penalaran', role: 'KOOR_DIVISI' },
  { nim: '312023062', password: 'advokasi2026', name: 'Michael Santoso', jabatan: 'Koordinator Advokasi', divisi: 'Advokasi & Kesejahteraan Mahasiswa', role: 'KOOR_DIVISI' },
  { nim: '312023038', password: 'humas2026', name: 'Nathania Aurelia', jabatan: 'Koordinator Humas', divisi: 'Hubungan Masyarakat (Humas)', role: 'KOOR_DIVISI' },
  { nim: '312024051', password: 'media2026', name: 'David Kristanto', jabatan: 'Koordinator Media', divisi: 'Media & Kreatif', role: 'KOOR_DIVISI' },
  { nim: '322023022', password: 'kwu2026', name: 'Amanda Felicia', jabatan: 'Koordinator Kewirausahaan', divisi: 'Kewirausahaan & Sponsorship', role: 'KOOR_DIVISI' },
  // Dev
  { nim: 'fungsionaris', password: 'dev123', name: 'Vania Stephanie (Dev)', jabatan: 'Staf PSDM', divisi: 'Pengembangan SDM (PSDM)', role: 'ANGGOTA_STAF' },
  { nim: 'koor', password: 'dev123', name: 'Dimas Prasetyo (Dev)', jabatan: 'Koordinator PSDM', divisi: 'Pengembangan SDM (PSDM)', role: 'KOOR_DIVISI' },
];

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState(null); // null | 'admin' | 'member'
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const db = mode === 'admin' ? ADMIN_CREDENTIALS : MEMBER_CREDENTIALS;
      const user = db.find(u => u.nim === nim.trim() && u.password === password);

      if (user) {
        onLogin({
          ...user,
          portalType: mode, // 'admin' | 'member'
        });
      } else {
        setError('NIM atau password salah. Periksa kembali kredensial Anda.');
      }
      setLoading(false);
    }, 700);
  };

  // ── LANDING: Pilih Portal ──────────────────────────────────────────────────
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col items-center justify-center p-4">
        {/* Header logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[#13539D] shadow-lg mb-4">
            <GraduationCap className="size-8 text-[#F7C828]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Resmi BEM FEB UKRIDA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Badan Eksekutif Mahasiswa — Fakultas Ekonomi &amp; Bisnis
            <span className="font-bold text-[#13539D]"> Periode 2026</span>
          </p>
        </div>

        {/* 2 kartu pilihan portal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
          {/* ADMIN / BPH */}
          <button
            type="button"
            onClick={() => setMode('admin')}
            className="group flex flex-col items-start gap-4 p-6 rounded-3xl border-2 border-slate-200 bg-white hover:border-[#13539D] hover:shadow-xl transition-all duration-200 cursor-pointer text-left"
          >
            <div className="size-12 rounded-2xl bg-[#13539D] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Shield className="size-6 text-[#F7C828]" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 group-hover:text-[#13539D] transition-colors">
                Portal Admin / BPH
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                Akses penuh manajemen BEM: program kerja, keuangan, divisi, audit, dan seluruh data fungsionaris.
              </div>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-[#13539D] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Masuk sebagai BPH</span>
              <ArrowRight className="size-3.5" />
            </div>
          </button>

          {/* ANGGOTA / FUNGSIONARIS */}
          <button
            type="button"
            onClick={() => setMode('member')}
            className="group flex flex-col items-start gap-4 p-6 rounded-3xl border-2 border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xl transition-all duration-200 cursor-pointer text-left"
          >
            <div className="size-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <User className="size-6 text-white" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Portal Anggota / Fungsionaris
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                Lihat tugas personal, absensi rapat, jadwal proker divisi Anda, dan kirim aspirasi ke BPH.
              </div>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-emerald-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Masuk sebagai Fungsionaris</span>
              <ArrowRight className="size-3.5" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[11px] text-slate-400 text-center">
          Jl. Tanjung Duren Raya No. 4, Jakarta Barat &nbsp;|&nbsp; Telp: 021 566 6952
        </p>
      </div>
    );
  }

  // ── FORM LOGIN ─────────────────────────────────────────────────────────────
  const isAdmin = mode === 'admin';
  const accentColor = isAdmin ? '#13539D' : '#059669';
  const accentHover = isAdmin ? '#0d417d' : '#047857';
  const labelPortal = isAdmin ? 'Admin & BPH' : 'Anggota & Fungsionaris';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Back button */}
        <button
          type="button"
          onClick={() => { setMode(null); setError(''); setNim(''); setPassword(''); }}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          ← Kembali ke Pilihan Portal
        </button>

        {/* Card login */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-7 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-7">
            <div
              className="size-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {isAdmin
                ? <Shield className="size-6 text-[#F7C828]" />
                : <User className="size-6 text-white" />
              }
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Masuk ke Portal {labelPortal}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">BEM FEB UKRIDA Periode 2026</p>
            </div>
          </div>

          {/* Info hint quick login */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">🔑 Quick Access (Dev / Demo):</p>
            {isAdmin
              ? <><p>NIM: <code className="font-mono bg-white px-1 rounded border border-slate-200">bph</code> &nbsp; Pass: <code className="font-mono bg-white px-1 rounded border border-slate-200">dev123</code></p><p className="mt-0.5 text-slate-400">Atau NIM asli + password resmi fungsionaris.</p></>
              : <><p>NIM: <code className="font-mono bg-white px-1 rounded border border-slate-200">fungsionaris</code> &nbsp; Pass: <code className="font-mono bg-white px-1 rounded border border-slate-200">dev123</code></p><p className="mt-0.5 text-slate-400">Koor: <code className="font-mono bg-white px-1 rounded border border-slate-200">koor</code> / <code className="font-mono bg-white px-1 rounded border border-slate-200">dev123</code></p></>
            }
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NIM (Nomor Induk Mahasiswa)
              </label>
              <input
                type="text"
                value={nim}
                onChange={e => setNim(e.target.value)}
                required
                placeholder={isAdmin ? 'Contoh: 312023002 atau bph' : 'Contoh: 312023044 atau fungsionaris'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#13539D] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan password Anda"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              style={{ backgroundColor: loading ? '#94a3b8' : accentColor }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Masuk ke Portal {labelPortal}
                </>
              )}
            </button>
          </form>

          {/* Footer info */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <p>Lupa password? Hubungi <span className="font-semibold text-slate-600">Sekretaris Umum BEM FEB</span></p>
            <p className="mt-1">BEM FEB UKRIDA &nbsp;•&nbsp; Periode Kepengurusan 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
