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
  FileCheck,
  Inbox,
  Mail,
  MailOpen,
  Send,
  X,
  Save,
  MapPin,
  PhoneCall,
  Plus,
} from 'lucide-react';
import {
  STORAGE,
  readLocal,
  writeLocal,
  uid,
  formatDateID,
  formatDateTimeID,
  PENGAJUAN_STATUS_STYLES,
  logActivity,
  pushNotification,
} from '../domain/mockData';

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

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isReadBy(message, user) {
  return (message.readBy || []).includes(user.nim);
}

function getInboxMessages(messages, user) {
  const userDivisi = String(user.divisi || '').toLowerCase();
  return messages
    .filter((msg) => {
      if (msg.audience === 'all' || !msg.audience) return true;
      if (msg.audience === 'divisi') {
        const target = String(msg.divisi || '').toLowerCase();
        return Boolean(target) && (userDivisi.includes(target) || target.includes(userDivisi));
      }
      return false;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

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
    'PENDING': 'bg-amber-50 text-amber-700 border-amber-200',
    'APPROVED': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'REJECTED': 'bg-rose-50 text-rose-700 border-rose-200',
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
  { id: 'pengajuan', label: 'Pengajuan Saya', icon: FileCheck },
  { id: 'pesan', label: 'Pesan & Inbox', icon: MessageSquare },
  { id: 'kontak', label: 'Kontak BPH & Divisi', icon: Phone },
  { id: 'profil', label: 'Profil Fungsionaris', icon: User },
];

function MemberSidebar({ activeTab, setActiveTab, user, unreadCount = 0 }) {
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
            {item.id === 'pesan' && unreadCount > 0 && (
              <span className={`ml-auto min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold grid place-items-center ${
                activeTab === item.id ? 'bg-white text-emerald-700' : 'bg-rose-100 text-rose-700 border border-rose-200'
              }`}>
                {unreadCount}
              </span>
            )}
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

function PengajuanTab({ user }) {
  const [items, setItems] = useState(() => readLocal(STORAGE.pengajuan, []));
  const [form, setForm] = useState({ jenis: 'Izin Tidak Hadir', tanggal: todayISO(), alasan: '' });
  const [notice, setNotice] = useState(null);

  const personal = items
    .filter((item) => item.nim === user.nim)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const pending = personal.filter((item) => item.status === 'PENDING').length;
  const approved = personal.filter((item) => item.status === 'APPROVED').length;
  const rejected = personal.filter((item) => item.status === 'REJECTED').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const alasan = form.alasan.trim();
    if (!alasan) {
      setNotice({ tone: 'error', text: 'Alasan pengajuan wajib diisi terlebih dahulu.' });
      return;
    }

    const newItem = {
      id: uid('req'),
      nim: user.nim,
      nama: user.name,
      divisi: user.divisi || 'BPH',
      jenis: form.jenis,
      tanggal: form.tanggal || todayISO(),
      alasan,
      status: 'PENDING',
      catatan: '',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
    };

    const next = [newItem, ...items];
    setItems(next);
    writeLocal(STORAGE.pengajuan, next);
    logActivity({
      actor: user.name,
      type: 'pengajuan',
      text: `Mengajukan ${newItem.jenis} untuk tanggal ${formatDateID(newItem.tanggal)}.`,
    });
    pushNotification({
      type: 'info',
      text: `Pengajuan ${newItem.jenis} dari ${newItem.nama} menunggu review BPH.`,
    });

    setForm({ jenis: 'Izin Tidak Hadir', tanggal: todayISO(), alasan: '' });
    setNotice({ tone: 'success', text: 'Pengajuan berhasil dikirim dan menunggu review BPH.' });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ADMINISTRASI FUNGSIONARIS</p>
        <h1 className="text-xl font-extrabold text-slate-900">Pengajuan Saya</h1>
        <p className="text-xs text-slate-500 mt-0.5">Ajukan izin, dispensasi kuliah, atau surat keterangan dan pantau status persetujuannya.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Pengajuan', value: personal.length, color: 'text-slate-900', bg: 'bg-white border-slate-200' },
          { label: 'Menunggu', value: pending, color: 'text-amber-700', bg: 'bg-amber-50/50 border-amber-200' },
          { label: 'Disetujui', value: approved, color: 'text-emerald-700', bg: 'bg-emerald-50/50 border-emerald-200' },
          { label: 'Ditolak', value: rejected, color: 'text-rose-700', bg: 'bg-rose-50/50 border-rose-200' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-4 shadow-xs ${stat.bg}`}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <FileCheck className="size-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Buat Pengajuan Baru</h3>
            <p className="text-[10px] text-slate-500">Lengkapi data di bawah ini, lalu kirim ke BPH untuk direview.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis Pengajuan</label>
            <select
              value={form.jenis}
              onChange={(e) => setForm((prev) => ({ ...prev, jenis: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="Izin Tidak Hadir">Izin Tidak Hadir</option>
              <option value="Dispensasi Kuliah">Dispensasi Kuliah</option>
              <option value="Surat Keterangan (SK)">Surat Keterangan (SK)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Pengajuan</label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm((prev) => ({ ...prev, tanggal: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Alasan / Keterangan</label>
          <textarea
            value={form.alasan}
            onChange={(e) => setForm((prev) => ({ ...prev, alasan: e.target.value }))}
            rows={3}
            placeholder="Jelaskan alasan pengajuan secara singkat dan jelas..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 resize-none focus:bg-white focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {notice && (
          <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${
            notice.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}>
            {notice.tone === 'success' ? <CheckCircle2 className="size-4 shrink-0 mt-0.5" /> : <AlertCircle className="size-4 shrink-0 mt-0.5" />}
            <span>{notice.text}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
          >
            <Send className="size-3.5" /> Kirim Pengajuan
          </button>
        </div>
      </form>

      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Riwayat Pengajuan Personal</h3>
            <p className="text-[10px] text-slate-500">Hanya menampilkan pengajuan dengan NIM Anda.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{personal.length} pengajuan</span>
        </div>

        {personal.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="size-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">Belum ada pengajuan. Silakan buat pengajuan pertama Anda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {personal.map((item) => (
              <div key={item.id} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{item.jenis}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${PENGAJUAN_STATUS_STYLES[item.status] || PENGAJUAN_STATUS_STYLES.PENDING}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Tanggal: {formatDateID(item.tanggal)} • Diajukan: {formatDateTimeID(item.createdAt)}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.divisi}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{item.alasan}</p>
                {item.catatan && (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Catatan BPH</p>
                    <p className="text-xs text-slate-600 mt-0.5">{item.catatan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PesanTab({ user, messages, onMarkRead, onSendMessage }) {
  const [selected, setSelected] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ subject: '', body: '', audience: 'all' });
  const [error, setError] = useState('');

  const canSend = user.role === 'KOOR_DIVISI';
  const unread = messages.filter((msg) => !isReadBy(msg, user)).length;

  const openMessage = (msg) => {
    setSelected(msg);
    if (!isReadBy(msg, user)) onMarkRead(msg.id);
  };

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!compose.subject.trim() || !compose.body.trim()) {
      setError('Subjek dan isi pesan wajib diisi.');
      return;
    }
    onSendMessage({
      subject: compose.subject.trim(),
      body: compose.body.trim(),
      audience: compose.audience,
      divisi: compose.audience === 'divisi' ? user.divisi : null,
    });
    setCompose({ subject: '', body: '', audience: 'all' });
    setError('');
    setIsComposeOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">KOMUNIKASI INTERNAL</p>
          <h1 className="text-xl font-extrabold text-slate-900">Pesan &amp; Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pesan masuk dari BPH dan koordinasi internal divisi Anda.</p>
        </div>
        {canSend && (
          <button
            type="button"
            onClick={() => { setIsComposeOpen(true); setError(''); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" /> Kirim Pesan
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="size-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Mail className="size-4 text-blue-700" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total Pesan</p>
            <p className="text-xl font-extrabold text-slate-900">{messages.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <MailOpen className="size-4 text-amber-700" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Belum Dibaca</p>
            <p className="text-xl font-extrabold text-amber-700">{unread}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        {messages.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="size-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">Belum ada pesan masuk untuk Anda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => {
              const unreadMessage = !isReadBy(msg, user);
              return (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 sm:p-5 transition cursor-pointer flex items-start gap-3 ${
                    unreadMessage ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`size-9 rounded-xl border flex items-center justify-center shrink-0 ${
                    unreadMessage ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {unreadMessage ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm ${unreadMessage ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}>
                        {msg.subject}
                      </p>
                      {unreadMessage && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-bold">
                          BARU
                        </span>
                      )}
                      {msg.audience === 'divisi' && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold">
                          {msg.divisi}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Dari: {msg.fromName} • {formatDateTimeID(msg.createdAt)}
                    </p>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{msg.body}</p>
                  </div>
                  <ChevronRight className="size-4 text-slate-300 shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <MailOpen className="size-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selected.subject}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Dari: {selected.fromName} • {formatDateTimeID(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 grid place-items-center cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isComposeOpen && canSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form onSubmit={handleComposeSubmit} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Send className="size-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Kirim Pesan Baru</h3>
                  <p className="text-[10px] text-slate-500">Koordinator dapat mengirim instruksi ke fungsionaris.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 grid place-items-center cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Penerima</label>
                <select
                  value={compose.audience}
                  onChange={(e) => setCompose((prev) => ({ ...prev, audience: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="all">Seluruh Fungsionaris</option>
                  <option value="divisi">Divisi Saya ({user.divisi || 'Divisi'})</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subjek</label>
                <input
                  type="text"
                  value={compose.subject}
                  onChange={(e) => setCompose((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Contoh: Koordinasi persiapan rapat divisi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Pesan</label>
                <textarea
                  value={compose.body}
                  onChange={(e) => setCompose((prev) => ({ ...prev, body: e.target.value }))}
                  rows={4}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 resize-none focus:bg-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <Send className="size-3.5" /> Kirim Pesan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ProfilTab({ user, onSave }) {
  const storedProfile = readLocal(STORAGE.profiles, {})[user.nim] || {};
  const [form, setForm] = useState(() => ({
    nim: user.nim || '',
    name: user.name || '',
    phone: user.phone || user.hp || storedProfile.phone || '',
    email: user.email || storedProfile.email || '',
    address: user.address || storedProfile.address || '',
    emergencyName: user.emergencyName || storedProfile.emergencyName || '',
    emergencyPhone: user.emergencyPhone || storedProfile.emergencyPhone || '',
    emergencyRelation: user.emergencyRelation || storedProfile.emergencyRelation || 'Orang Tua',
  }));
  const [notice, setNotice] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setNotice(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const nim = form.nim.trim();

    if (!name || !nim) {
      setNotice({ tone: 'error', text: 'NIM dan nama lengkap wajib diisi.' });
      return;
    }

    const updated = {
      ...user,
      nim,
      name,
      phone: form.phone.trim(),
      hp: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      emergencyName: form.emergencyName.trim(),
      emergencyPhone: form.emergencyPhone.trim(),
      emergencyRelation: form.emergencyRelation,
    };

    const saved = writeLocal('bem_logged_user', updated);
    if (!saved) {
      setNotice({ tone: 'error', text: 'Gagal menyimpan profil. Coba kembali.' });
      return;
    }

    onSave?.(updated);
    setForm((prev) => ({ ...prev, name, nim }));
    setNotice({ tone: 'success', text: 'Profil berhasil disimpan ke perangkat ini.' });
    logActivity({ actor: name, type: 'profil', text: `${name} memperbarui profil fungsionaris.` });
  };

  const inputClass = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition';
  const readOnlyClass = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-100/70 text-xs font-semibold text-slate-500';

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">DATA DIRI FUNGSIONARIS</p>
        <h1 className="text-xl font-extrabold text-slate-900">Profil Fungsionaris</h1>
        <p className="text-xs text-slate-500 mt-0.5">Perbarui data kontak dan informasi darurat Anda. Perubahan disimpan di perangkat ini.</p>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-5 text-white shadow-md flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-lg font-extrabold shrink-0">
          {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <div className="min-w-0">
          <p className="text-base font-extrabold truncate">{user.name}</p>
          <p className="text-xs text-emerald-100">{user.jabatan}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] font-mono text-emerald-100">
            <span>NIM: {user.nim}</span>
            {user.divisi && <span>• {user.divisi}</span>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <User className="size-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Informasi Pribadi</h3>
            <p className="text-[10px] text-slate-500">Pastikan data yang Anda isi aktif dan dapat dihubungi.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">NIM</label>
            <input value={form.nim} onChange={(e) => updateField('nim', e.target.value)} className={`${inputClass} font-mono`} placeholder="Nomor Induk Mahasiswa" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="Nama lengkap" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">No. HP / WhatsApp</label>
            <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={`${inputClass} font-mono`} placeholder="628xxxxxxxxxx" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="nama@civitas.ukrida.ac.id" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Domisili</label>
            <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Alamat lengkap" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Jabatan</label>
            <input value={user.jabatan || '-'} readOnly className={readOnlyClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Divisi</label>
            <input value={user.divisi || 'BPH'} readOnly className={readOnlyClass} />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <PhoneCall className="size-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Kontak Darurat</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kontak</label>
              <input value={form.emergencyName} onChange={(e) => updateField('emergencyName', e.target.value)} className={inputClass} placeholder="Nama keluarga / wali" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">No. HP Kontak</label>
              <input value={form.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} className={`${inputClass} font-mono`} placeholder="628xxxxxxxxxx" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Hubungan</label>
              <select
                value={form.emergencyRelation}
                onChange={(e) => updateField('emergencyRelation', e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Orang Tua">Orang Tua</option>
                <option value="Wali">Wali</option>
                <option value="Saudara">Saudara</option>
                <option value="Kerabat">Kerabat</option>
              </select>
            </div>
          </div>
        </div>

        {notice && (
          <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${
            notice.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}>
            {notice.tone === 'success' ? <CheckCircle2 className="size-4 shrink-0 mt-0.5" /> : <AlertCircle className="size-4 shrink-0 mt-0.5" />}
            <span>{notice.text}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-100 pt-4">
          <p className="flex items-center gap-1 text-[10px] text-slate-400">
            <MapPin className="size-3" /> Tersimpan lokal di browser ini (bem_logged_user)
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
          >
            <Save className="size-3.5" /> Simpan Profil
          </button>
        </div>
      </form>
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

export default function MemberPortal({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState(() => readLocal(STORAGE.messages, []));

  const inboxMessages = getInboxMessages(messages, user);
  const unreadCount = inboxMessages.filter((msg) => !isReadBy(msg, user)).length;

  const handleMarkMessageRead = (messageId) => {
    const next = messages.map((msg) => {
      if (msg.id !== messageId) return msg;
      if ((msg.readBy || []).includes(user.nim)) return msg;
      return { ...msg, readBy: [...(msg.readBy || []), user.nim] };
    });
    setMessages(next);
    writeLocal(STORAGE.messages, next);
  };

  const handleSendMessage = (payload) => {
    const newMessage = {
      id: uid('msg'),
      fromName: user.name,
      fromNim: user.nim,
      audience: payload.audience,
      divisi: payload.divisi || null,
      subject: payload.subject,
      body: payload.body,
      createdAt: new Date().toISOString(),
      readBy: [user.nim],
    };
    const next = [newMessage, ...messages];
    setMessages(next);
    writeLocal(STORAGE.messages, next);
    logActivity({
      actor: user.name,
      type: 'pesan',
      text: `Mengirim pesan "${newMessage.subject}" ke ${newMessage.audience === 'all' ? 'seluruh fungsionaris' : newMessage.divisi}.`,
    });
    pushNotification({
      type: 'info',
      text: `Pesan baru dari ${newMessage.fromName}: ${newMessage.subject}.`,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab user={user} />;
      case 'tugas': return <TugasTab />;
      case 'absensi': return <AbsensiTab />;
      case 'proker': return <ProkerTab user={user} />;
      case 'pengumuman': return <PengumumanTab />;
      case 'pengajuan': return <PengajuanTab user={user} />;
      case 'pesan': return (
        <PesanTab
          user={user}
          messages={inboxMessages}
          onMarkRead={handleMarkMessageRead}
          onSendMessage={handleSendMessage}
        />
      );
      case 'kontak': return <KontakTab />;
      case 'profil': return <ProfilTab user={user} onSave={onUpdateUser} />;
      default: return <DashboardTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <MemberSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} unreadCount={unreadCount} />

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
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 border-t border-slate-200 z-50 flex lg:hidden items-center justify-start sm:justify-around px-1 backdrop-blur shadow-lg overflow-x-auto">
          {MEMBER_NAV.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold py-1 px-2 rounded-xl transition cursor-pointer shrink-0 min-w-[54px] ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <item.icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
              {item.id === 'pesan' && unreadCount > 0 && (
                <span className="absolute top-0 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[8px] font-bold grid place-items-center">
                  {unreadCount}
                </span>
              )}
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
