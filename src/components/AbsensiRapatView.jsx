import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Users,
  Search,
  Calendar,
  Clock,
  MapPin,
  Save,
  Download,
  AlertCircle,
  FileCheck,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function AbsensiRapatView({ members = [] }) {
  // Sesi Rapat BEM FEB UKRIDA ala Sesi Ibadah ABMAS
  const meetingSessions = [
    {
      id: 'pleno_bph',
      title: 'Rapat Pleno BPH & Koordinator',
      category: 'PLENO MINGGUAN',
      time: '16:00 - 18:00 WIB',
      day: 'Setiap Senin',
      location: 'Ruang Rapat Dekanat Lt. 3',
      color: '#13539D',
      requiredRoles: 'BPH & Seluruh Koordinator Divisi'
    },
    {
      id: 'koordinasi_divisi',
      title: 'Rapat Koordinasi & Briefing Divisi',
      category: 'INTERNAL DIVISI',
      time: '15:30 - 17:00 WIB',
      day: 'Setiap Rabu',
      location: 'Sekretariat BEM FEB UKRIDA',
      color: '#0284C7',
      requiredRoles: 'Koordinator & Staf Divisi'
    },
    {
      id: 'evaluasi_proker',
      title: 'Evaluasi Proker & Validasi LPJ',
      category: 'EVALUASI BIROKRASI',
      time: '17:00 - 19:00 WIB',
      day: 'Setiap Jumat',
      location: 'Hall B Tanjung Duren',
      color: '#F59E0B',
      requiredRoles: 'Panitia Pelaksana & BPH'
    },
    {
      id: 'pleno_terbuka',
      title: 'Pleno Terbuka Mahasiswa FEB',
      category: 'SIDANG TERBUKA',
      time: '10:00 - 13:00 WIB',
      day: 'Sabtu Bulanan',
      location: 'Auditorium Gd. E Lt. 7',
      color: '#10B981',
      requiredRoles: 'Seluruh Fungsionaris & Perwakilan Kelas'
    }
  ];

  const [selectedSessionId, setSelectedSessionId] = useState('pleno_bph');
  const [meetingDate, setMeetingDate] = useState('2026-11-03');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('Semua');
  const [savedNotice, setSavedNotice] = useState(false);

  // Status Presensi State { [memberId]: { status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa', note: '' } }
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const initial = {};
    members.forEach((m, idx) => {
      // Default sample values
      const sampleStatuses = ['Hadir', 'Hadir', 'Hadir', 'Izin', 'Hadir'];
      initial[m.id] = {
        status: sampleStatuses[idx % sampleStatuses.length] || 'Hadir',
        note: (idx % sampleStatuses.length === 3) ? 'Kuliah Pengganti' : ''
      };
    });
    return initial;
  });

  const selectedSession = meetingSessions.find((s) => s.id === selectedSessionId) || meetingSessions[0];

  // Set status helper
  const handleSetStatus = (memberId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        status
      }
    }));
  };

  const handleSetNote = (memberId, note) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        note
      }
    }));
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchNim = (m.nim || '').toLowerCase().includes(q);
      if (!matchName && !matchNim) return false;
    }
    if (filterDivisi !== 'Semua') {
      if (m.divisiId !== filterDivisi) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalCount = members.length || 1;
  const hadirCount = Object.values(attendanceRecords).filter((r) => r.status === 'Hadir').length;
  const izinCount = Object.values(attendanceRecords).filter((r) => r.status === 'Izin').length;
  const sakitCount = Object.values(attendanceRecords).filter((r) => r.status === 'Sakit').length;
  const alpaCount = Object.values(attendanceRecords).filter((r) => r.status === 'Alpa').length;
  const attendanceRate = Math.round((hadirCount / totalCount) * 100);

  const handleSaveAttendance = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="SISTEM PRESENSI & KEDISIPLINAN ORGANISASI"
        title="Presensi Rapat & Evaluasi BEM FEB UKRIDA"
        description="Pencatatan kehadiran rapat pleno, rapat koordinasi divisi, evaluasi program kerja, dan rekapitulasi poin keaktifan fungsionaris."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="size-4" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        }
      />

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Presensi berhasil disimpan ke sistem dan disinkronkan ke Rekap Nilai KPI Fungsionaris!</span>
        </div>
      )}

      {/* Sesi Rapat Cards (Mirrored 1:1 from ABMAS ChurchAdminAbsensiPage) */}
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
          Pilih Sesi Rapat Aktif
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {meetingSessions.map((session) => {
            const isSelected = selectedSessionId === session.id;
            return (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`relative rounded-3xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#13539D] bg-white shadow-md ring-2 ring-[#13539D]/10'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase text-white"
                      style={{ backgroundColor: session.color }}
                    >
                      {session.category}
                    </span>
                    {isSelected && (
                      <span className="size-2 rounded-full bg-[#13539D] animate-ping" />
                    )}
                  </div>
                  <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900 leading-snug">
                    {session.title}
                  </h4>
                  <div className="mt-3 space-y-1 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-slate-400" />
                      <span>{session.day}, {session.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-slate-400" />
                      <span className="truncate">{session.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 text-[10px] font-mono">Wajib:</span>
                  <span className="font-bold text-slate-700 truncate max-w-[130px]">{session.requiredRoles}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Stats Cards Ala ABMAS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="font-mono text-[10px] uppercase font-bold text-slate-400">Total Peserta</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-slate-900 mt-1">
            {totalCount}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Fungsionaris Terdaftar</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <p className="font-mono text-[10px] uppercase font-bold text-emerald-700">Hadir</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-emerald-700 mt-1">
            {hadirCount}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">{attendanceRate}% Kehadiran</span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
          <p className="font-mono text-[10px] uppercase font-bold text-amber-700">Izin</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-amber-700 mt-1">
            {izinCount}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Disertai Keterangan</span>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4 shadow-2xs">
          <p className="font-mono text-[10px] uppercase font-bold text-sky-700">Sakit</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-sky-700 mt-1">
            {sakitCount}
          </p>
          <span className="text-[10px] text-sky-600 font-medium">Surat Dokter</span>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-2xs col-span-2 sm:col-span-1">
          <p className="font-mono text-[10px] uppercase font-bold text-rose-700">Alpa</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-rose-700 mt-1">
            {alpaCount}
          </p>
          <span className="text-[10px] text-rose-600 font-medium">Poin KPI Berkurang</span>
        </div>
      </div>

      {/* Main Presensi Sheet Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckSquare className="size-4 text-[#13539D]" />
              Presensi: {selectedSession.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tanggal Rapat: <strong className="text-slate-800">{meetingDate}</strong> • Lokasi: {selectedSession.location}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama fungsionaris / NIM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] w-52"
              />
            </div>

            <select
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-[#13539D]"
            >
              <option value="Semua">Semua Divisi</option>
              <option value="bph">BPH</option>
              <option value="akademik">Akademik</option>
              <option value="kerohanian">Kerohanian</option>
              <option value="seni_olahraga">Seni & Olahraga</option>
              <option value="humas">Humas</option>
              <option value="psdm">PSDM</option>
              <option value="advokasi">Advokasi</option>
            </select>
          </div>
        </div>

        {/* Member Attendance Table Ala ABMAS */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Nama & NIM Fungsionaris</th>
                <th className="py-3 px-4">Divisi & Jabatan</th>
                <th className="py-3 px-4 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => {
                const record = attendanceRecords[m.id] || { status: 'Hadir', note: '' };
                const curStatus = record.status;

                return (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                          alt={m.name}
                          className="size-8 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{m.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">NIM: {m.nim || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{m.role || 'Fungsionaris'}</span>
                      <p className="text-[10px] text-slate-400 capitalize">{m.divisiId || 'BEM FEB'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                        <button
                          type="button"
                          onClick={() => handleSetStatus(m.id, 'Hadir')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            curStatus === 'Hadir'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(m.id, 'Izin')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            curStatus === 'Izin'
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Izin
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(m.id, 'Sakit')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            curStatus === 'Sakit'
                              ? 'bg-sky-500 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Sakit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetStatus(m.id, 'Alpa')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            curStatus === 'Alpa'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Alpa
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        placeholder="Tambahkan catatan (opsional)..."
                        value={record.note}
                        onChange={(e) => handleSetNote(m.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#13539D]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
