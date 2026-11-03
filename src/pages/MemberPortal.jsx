import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  ChevronRight,
  Clock,
  Target,
  BookOpen,
  Wallet,
  Phone,
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  User,
  FileText,
  Megaphone,
} from 'lucide-react';

// Data tugas mock — nanti tersambung ke Supabase
const MY_TASKS = [
  { id: 'T1', judul: 'Buat konten Instagram PSDM Bulan November', status: 'Dalam Proses', deadline: '10 Nov 2026', prioritas: 'Tinggi', dari: 'Dimas Prasetyo' },
  { id: 'T2', judul: 'Rekap daftar hadir rapat koordinasi divisi', status: 'Belum Mulai', deadline: '15 Nov 2026', prioritas: 'Sedang', dari: 'Arthur Reezan' },
  { id: 'T3', judul: 'Desain poster Seminar Kewirausahaan', status: 'Selesai', deadline: '5 Nov 2026', prioritas: 'Tinggi', dari: 'Dimas Prasetyo' },
  { id: 'T4', judul: 'Kirim proposal kolaborasi ke Himpunan Manajemen', status: 'Dalam Proses', deadline: '20 Nov 2026', prioritas: 'Sedang', dari: 'Arthur Reezan' },
];

const MY_ATTENDANCE = [
  { id: 'A1', namaRapat: 'Rapat Pleno BEM FEB Bulan Oktober', tanggal: '28 Okt 2026', status: 'Hadir', ket: '-' },
  { id: 'A2', namaRapat: 'Rapat Koordinasi Proker PSDM', tanggal: '15 Okt 2026', status: 'Hadir', ket: '-' },
  { id: 'A3', namaRapat: 'Rapat Evaluasi Divisi Bulanan', tanggal: '5 Okt 2026', status: 'Izin', ket: 'Ujian Tengah Semester' },
  { id: 'A4', namaRapat: 'Rapat Pleno BEM FEB Bulan September', tanggal: '25 Sep 2026', status: 'Hadir', ket: '-' },
  { id: 'A5', namaRapat: 'Kick-Off Meeting Kepengurusan 2026', tanggal: '1 Sep 2026', status: 'Hadir', ket: '-' },
];

const PROKER_DIVISI = [
  { nama: 'Pelatihan Leadership & Public Speaking', status: 'Berjalan', tanggal: '20 Nov 2026', anggaran: 'Rp. 2.500.000' },
  { nama: 'Seminar Kewirausahaan Mahasiswa FEB', status: 'Perencanaan', tanggal: '5 Des 2026', anggaran: 'Rp. 5.000.000' },
  { nama: 'PSDM Cup – Turnamen Olahraga Divisi', status: 'Selesai', tanggal: '10 Okt 2026', anggaran: 'Rp. 3.000.000' },
];

const BPH_KONTAK = [
  { name: 'Arthur Reezan', jabatan: 'Ketua Umum', phone: '6281234567890', nim: '312023002' },
  { name: 'Princess Auralia Barus', jabatan: 'Wakil Ketua', phone: '6281234567891', nim: '322024025' },
  { name: 'Clara Michelle', jabatan: 'Sekretaris Umum', phone: '6281234567892', nim: '312023015' },
  { name: 'Sarah Amalia', jabatan: 'Bendahara Umum', phone: '6281234567893', nim: '322023008' },
];

const PENGUMUMAN = [
  { id: 'P1', judul: 'Jadwal Rapat Pleno November 2026', isi: 'Rapat Pleno BEM FEB bulan November akan dilaksanakan pada Senin, 25 November 2026 pukul 15.00 WIB di Ruang Seminar FEB Lt. 3.', tanggal: '1 Nov 2026', penting: true },
  { id: 'P2', judul: 'Batas Akhir Laporan KPI Divisi Q3', isi: 'Seluruh koordinator divisi wajib mengumpulkan laporan KPI Triwulan 3 paling lambat 10 November 2026 kepada Sekretaris Umum.', tanggal: '30 Okt 2026', penting: true },
  { id: 'P3', judul: 'Info Seragam Resmi BEM FEB 2026', isi: 'Seragam almamater BEM FEB sudah tersedia. Hubungi Bendahara Umum untuk konfirmasi ukuran.', tanggal: '20 Okt 2026', penting: false },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    'Hadir': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Izin': 'bg-amber-50 text-amber-700 border-amber-200',
    'Alfa': 'bg-rose-50 text-rose-700 border-rose-200',
    'Terlambat': 'bg-orange-50 text-orange-700 border-orange-200',
    'Selesai': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Dalam Proses': 'bg-blue-50 text-blue-700 border-blue-200',
    'Belum Mulai': 'bg-slate-100 text-slate-600 border-slate-200',
    'Berjalan': 'bg-blue-50 text-blue-700 border-blue-200',
    'Perencanaan': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
}

function PriorityDot({ prioritas }) {
  const map = { 'Tinggi': 'bg-rose-500', 'Sedang': 'bg-amber-400', 'Rendah': 'bg-emerald-400' };
  return <span className={`size-2 rounded-full ${map[prioritas] || 'bg-slate-400'} inline-block`} />;
}

// ─── SIDEBAR MEMBER ───────────────────────────────────────────────────────────

const MEMBER_NAV = [
  { id: 'dashboard', label: 'Dashboard Saya', icon: LayoutDashboard },
  { id: 'tugas', label: 'Tugas Personal', icon: CheckSquare },
  { id: 'absensi', label: 'Riwayat Presensi', icon: Calendar },
  { id: 'proker', label: 'Proker Divisi Saya', icon: Target },
  { id: 'pengumuman', label: 'Pengumuman BPH', icon: Megaphone },
  { id: 'kontak', label: 'Kontak BPH & Divisi', icon: Phone },
];

function MemberSidebar({ activeTab, setActiveTab, user }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs shrink-0">
            <GraduationCap className="size-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 leading-tight">Portal Anggota</div>
            <div className="text-[10px] text-slate-500 leading-tight">BEM FEB UKRIDA 2026</div>
          </div>
        </div>
      </div>

      {/* User profile mini */}
      <div className="p-4 mx-3 mt-4 rounded-2xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
            <div className="text-[10px] text-emerald-700 font-medium truncate">{user.jabatan}</div>
            <div className="text-[10px] text-slate-500 font-mono">NIM: {user.nim}</div>
          </div>
        </div>
        {user.divisi && (
          <div className="mt-2 pt-2 border-t border-emerald-200">
            <p className="text-[10px] text-slate-500">Divisi:</p>
            <p className="text-[10px] font-bold text-emerald-700 leading-tight">{user.divisi}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="p-3 flex-1 space-y-0.5 mt-2">
        {MEMBER_NAV.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
        BEM FEB UKRIDA • Periode 2026
      </div>
    </aside>
  );
}

// ─── TAB COMPONENTS ───────────────────────────────────────────────────────────

function DashboardTab({ user }) {
  const total = MY_TASKS.length;
  const selesai = MY_TASKS.filter(t => t.status === 'Selesai').length;
  const proses = MY_TASKS.filter(t => t.status === 'Dalam Proses').length;
  const hadir = MY_ATTENDANCE.filter(a => a.status === 'Hadir').length;
  const kehadiran = Math.round((hadir / MY_ATTENDANCE.length) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-1">Selamat Datang</p>
            <h2 className="text-xl font-extrabold">{user.name} 👋</h2>
            <p className="text-sm text-emerald-100 mt-1">{user.jabatan} {user.divisi ? `• ${user.divisi}` : ''}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-emerald-200 font-mono">NIM: {user.nim}</span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              {user.role === 'KOOR_DIVISI' ? '🎖 Koordinator Divisi' : '⭐ Staf Fungsionaris'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Tugas Aktif', value: total - selesai, sub: 'Perlu diselesaikan', icon: CheckSquare, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Tugas Selesai', value: selesai, sub: `Dari ${total} total tugas`, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Tingkat Kehadiran', value: `${kehadiran}%`, sub: `${hadir} dari ${MY_ATTENDANCE.length} rapat`, icon: Calendar, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Proker Divisi', value: PROKER_DIVISI.length, sub: 'Program kerja aktif', icon: Target, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{card.label}</p>
              <div className={`size-8 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center shrink-0`}>
                <card.icon className={`size-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 2 kolom: Tugas Terbaru & Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tugas aktif */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Tugas Aktif Saya</h3>
            <span className="text-[10px] text-slate-500 font-mono">{proses} sedang berjalan</span>
          </div>
          <div className="space-y-3">
            {MY_TASKS.filter(t => t.status !== 'Selesai').slice(0, 3).map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <PriorityDot prioritas={task.prioritas} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">{task.judul}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={task.status} />
                    <span className="text-[10px] text-slate-400 font-mono">Deadline: {task.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pengumuman terbaru */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Pengumuman BPH Terbaru</h3>
            <span className="text-[10px] text-slate-500 font-mono">{PENGUMUMAN.length} informasi</span>
          </div>
          <div className="space-y-3">
            {PENGUMUMAN.slice(0, 3).map(p => (
              <div key={p.id} className={`p-3 rounded-xl border ${p.penting ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className="flex items-start gap-2">
                  {p.penting && <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.judul}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{p.tanggal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TugasTab() {
  const [filter, setFilter] = useState('Semua');
  const filtered = filter === 'Semua' ? MY_TASKS : MY_TASKS.filter(t => t.status === filter);
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TUGAS PERSONAL • DUTY ROSTER</p>
          <h1 className="text-xl font-extrabold text-slate-900">Tugas Saya</h1>
          <p className="text-xs text-slate-500 mt-0.5">Daftar seluruh tugas yang ditugaskan kepada Anda oleh BPH atau Koordinator Divisi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Semua', 'Belum Mulai', 'Dalam Proses', 'Selesai'].map(f => (
            <button key={f} type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <PriorityDot prioritas={task.prioritas} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-tight">{task.judul}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <StatusBadge status={task.status} />
                  <span className="text-[10px] text-slate-400 font-mono">Deadline: {task.deadline}</span>
                  <span className="text-[10px] text-slate-400">Dari: {task.dari}</span>
                </div>
              </div>
            </div>
            {task.status !== 'Selesai' && (
              <button type="button" className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition">
                Tandai Selesai
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AbsensiTab() {
  const hadir = MY_ATTENDANCE.filter(a => a.status === 'Hadir').length;
  const kehadiran = Math.round((hadir / MY_ATTENDANCE.length) * 100);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RIWAYAT PRESENSI RAPAT</p>
        <h1 className="text-xl font-extrabold text-slate-900">Presensi Saya</h1>
        <p className="text-xs text-slate-500 mt-0.5">Rekap kehadiran rapat BEM FEB yang telah Anda ikuti selama kepengurusan 2026.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Rapat', val: MY_ATTENDANCE.length, color: 'text-slate-900' },
          { label: 'Hadir', val: hadir, color: 'text-emerald-700' },
          { label: 'Kehadiran', val: `${kehadiran}%`, color: 'text-blue-700' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-[10px] font-mono uppercase">
              <th className="py-3 px-4">Nama Rapat</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {MY_ATTENDANCE.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-medium text-slate-800">{a.namaRapat}</td>
                <td className="py-3 px-4 text-slate-500 font-mono">{a.tanggal}</td>
                <td className="py-3 px-4"><StatusBadge status={a.status} /></td>
                <td className="py-3 px-4 text-slate-500">{a.ket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProkerTab({ user }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PROGRAM KERJA DIVISI</p>
        <h1 className="text-xl font-extrabold text-slate-900">Proker {user.divisi || 'Divisi Saya'}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Daftar program kerja yang sedang dirancang dan dijalankan oleh divisi Anda.</p>
      </div>

      <div className="space-y-3">
        {PROKER_DIVISI.map((p, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={p.status} />
              </div>
              <p className="text-sm font-bold text-slate-900">{p.nama}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                <span>📅 {p.tanggal}</span>
                <span>💰 {p.anggaran}</span>
              </div>
            </div>
            <button type="button" className="shrink-0 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition">
              Lihat Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PengumumanTab() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">INFO & PENGUMUMAN</p>
        <h1 className="text-xl font-extrabold text-slate-900">Pengumuman BPH</h1>
        <p className="text-xs text-slate-500 mt-0.5">Informasi dan pengumuman resmi dari Badan Pengurus Harian BEM FEB UKRIDA.</p>
      </div>

      <div className="space-y-3">
        {PENGUMUMAN.map(p => (
          <div key={p.id} className={`rounded-3xl border p-5 shadow-xs ${p.penting ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-start gap-3">
              {p.penting
                ? <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                : <Bell className="size-4 text-slate-400 shrink-0 mt-0.5" />
              }
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-slate-900">{p.judul}</p>
                  {p.penting && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold">PENTING</span>}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.isi}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-2">{p.tanggal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KontakTab() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">KONTAK & KOORDINASI</p>
        <h1 className="text-xl font-extrabold text-slate-900">Kontak BPH & Divisi</h1>
        <p className="text-xs text-slate-500 mt-0.5">Hubungi langsung pimpinan BEM FEB UKRIDA via WhatsApp untuk koordinasi resmi.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BPH_KONTAK.map(k => (
          <div key={k.nim} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#13539D] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {k.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{k.name}</p>
              <p className="text-[10px] text-slate-500">{k.jabatan}</p>
              <p className="text-[10px] text-slate-400 font-mono">NIM: {k.nim}</p>
            </div>
            <button
              type="button"
              onClick={() => window.open(`https://wa.me/${k.phone}?text=${encodeURIComponent(`Halo Kak ${k.name}, saya fungsionaris BEM FEB 2026 ingin berkoordinasi.`)}`, '_blank')}
              className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
            >
              <Phone className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN MEMBER PORTAL ───────────────────────────────────────────────────────

export default function MemberPortal({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab user={user} />;
      case 'tugas': return <TugasTab />;
      case 'absensi': return <AbsensiTab />;
      case 'proker': return <ProkerTab user={user} />;
      case 'pengumuman': return <PengumumanTab />;
      case 'kontak': return <KontakTab />;
      default: return <DashboardTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <MemberSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap className="size-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">Portal Anggota BEM FEB</span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2">/ {MEMBER_NAV.find(n => n.id === activeTab)?.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500">{user.name}</span>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-600 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 border-t border-slate-200 z-50 flex lg:hidden items-center justify-around px-1 backdrop-blur shadow-lg">
          {MEMBER_NAV.slice(0, 5).map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold py-1 px-1 rounded-xl transition cursor-pointer ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <item.icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 lg:pb-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
