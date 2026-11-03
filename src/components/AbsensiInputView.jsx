import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  Clock,
  Database,
  Filter,
  History,
  Info,
  Landmark,
  MapPin,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

const STORAGE_KEY = 'bem_absensi_sessions';

// Mock data 17 fungsionaris BEM FEB UKRIDA
const FUNGSIONARIS = [
  {
    id: 'M01',
    nama: 'Arthur Reezan',
    nim: '312023002',
    jabatan: 'Ketua Umum BEM FEB',
    divisi: 'BPH',
    level: 'bph',
  },
  {
    id: 'M02',
    nama: 'Princess Auralia Barus',
    nim: '322024025',
    jabatan: 'Wakil Ketua BEM FEB',
    divisi: 'BPH',
    level: 'bph',
  },
  {
    id: 'M03',
    nama: 'Clara Michelle',
    nim: '312023015',
    jabatan: 'Sekretaris Umum',
    divisi: 'BPH',
    level: 'bph',
  },
  {
    id: 'M04',
    nama: 'Sarah Amalia',
    nim: '322023008',
    jabatan: 'Bendahara Umum',
    divisi: 'BPH',
    level: 'bph',
  },
  {
    id: 'M05',
    nama: 'Dimas Prasetyo',
    nim: '312023044',
    jabatan: 'Koordinator Divisi PSDM',
    divisi: 'PSDM',
    level: 'koordinator',
  },
  {
    id: 'M06',
    nama: 'Vania Stephanie',
    nim: '322024011',
    jabatan: 'Staf Divisi PSDM',
    divisi: 'PSDM',
    level: 'staf',
  },
  {
    id: 'M07',
    nama: 'Kevin Jonathan',
    nim: '312024019',
    jabatan: 'Staf Divisi PSDM',
    divisi: 'PSDM',
    level: 'staf',
  },
  {
    id: 'M08',
    nama: 'Jessica Tanuwijaya',
    nim: '312023027',
    jabatan: 'Koordinator Divisi Akademik & Penalaran',
    divisi: 'Akademik',
    level: 'koordinator',
  },
  {
    id: 'M09',
    nama: 'Christian Wijaya',
    nim: '322024033',
    jabatan: 'Staf Divisi Akademik & Penalaran',
    divisi: 'Akademik',
    level: 'staf',
  },
  {
    id: 'M10',
    nama: 'Michael Santoso',
    nim: '312023062',
    jabatan: 'Koordinator Divisi Advokasi & Kesejahteraan Mahasiswa',
    divisi: 'Advokasi',
    level: 'koordinator',
  },
  {
    id: 'M11',
    nama: 'Stefani Chandra',
    nim: '322024009',
    jabatan: 'Staf Divisi Advokasi & Kesejahteraan Mahasiswa',
    divisi: 'Advokasi',
    level: 'staf',
  },
  {
    id: 'M12',
    nama: 'Nathania Aurelia',
    nim: '312023038',
    jabatan: 'Koordinator Divisi Hubungan Masyarakat',
    divisi: 'Humas',
    level: 'koordinator',
  },
  {
    id: 'M13',
    nama: 'David Kristanto',
    nim: '312024051',
    jabatan: 'Koordinator Divisi Media & Kreatif',
    divisi: 'Media & Kreatif',
    level: 'koordinator',
  },
  {
    id: 'M14',
    nama: 'Amanda Felicia',
    nim: '322023022',
    jabatan: 'Koordinator Divisi Kewirausahaan & Sponsorship',
    divisi: 'Kewirausahaan',
    level: 'koordinator',
  },
  {
    id: 'M15',
    nama: 'Gabriel Arya Pratama',
    nim: '312023071',
    jabatan: 'Koordinator Divisi Kerohanian',
    divisi: 'Kerohanian',
    level: 'koordinator',
  },
  {
    id: 'M16',
    nama: 'Chelsea Angelina Wijaya',
    nim: '322024046',
    jabatan: 'Koordinator Divisi Seni & Olahraga',
    divisi: 'Seni & Olahraga',
    level: 'koordinator',
  },
  {
    id: 'M17',
    nama: 'Rizky Bagas Saputra',
    nim: '312024058',
    jabatan: 'Staf Divisi Media & Kreatif',
    divisi: 'Media & Kreatif',
    level: 'staf',
  },
];

const DIVISI_THEME = {
  BPH: {
    chip: 'border-[#13539D]/20 bg-[#13539D]/10 text-[#13539D]',
    avatar: 'from-[#0A2E5C] to-[#13539D]',
  },
  PSDM: {
    chip: 'border-rose-200 bg-rose-50 text-rose-700',
    avatar: 'from-rose-500 to-pink-600',
  },
  Akademik: {
    chip: 'border-violet-200 bg-violet-50 text-violet-700',
    avatar: 'from-violet-500 to-purple-600',
  },
  Advokasi: {
    chip: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    avatar: 'from-indigo-500 to-blue-700',
  },
  Humas: {
    chip: 'border-sky-200 bg-sky-50 text-sky-700',
    avatar: 'from-sky-500 to-blue-600',
  },
  'Media & Kreatif': {
    chip: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
    avatar: 'from-fuchsia-500 to-pink-600',
  },
  Kewirausahaan: {
    chip: 'border-amber-200 bg-amber-50 text-amber-700',
    avatar: 'from-amber-500 to-orange-600',
  },
  Kerohanian: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    avatar: 'from-emerald-500 to-teal-600',
  },
  'Seni & Olahraga': {
    chip: 'border-orange-200 bg-orange-50 text-orange-700',
    avatar: 'from-orange-500 to-rose-500',
  },
};

const DEFAULT_DIVISI_THEME = {
  chip: 'border-slate-200 bg-slate-100 text-slate-600',
  avatar: 'from-slate-500 to-slate-700',
};

const MEETING_CATEGORIES = [
  {
    id: 'pleno',
    label: 'Rapat Pleno',
    icon: Landmark,
    title: 'Rapat Pleno BEM FEB UKRIDA',
    agenda:
      'Sinkronisasi kebijakan, evaluasi tengah periode, dan penetapan agenda strategis organisasi.',
    time: '16.00 – 18.00 WIB',
    location: 'Ruang Rapat Dekanat Lt. 3',
    peserta: 'Seluruh Fungsionaris',
    invite: () => true,
  },
  {
    id: 'divisi',
    label: 'Rapat Divisi',
    icon: Users,
    title: 'Rapat Koordinasi Divisi',
    agenda:
      'Briefing program kerja divisi, pembagian tugas, dan monitoring progres terkini.',
    time: '15.30 – 17.00 WIB',
    location: 'Sekretariat BEM FEB UKRIDA',
    peserta: 'Seluruh Fungsionaris',
    invite: () => true,
  },
  {
    id: 'proker',
    label: 'Kegiatan Proker',
    icon: ClipboardCheck,
    title: 'Kegiatan Program Kerja',
    agenda:
      'Pencatatan kehadiran fungsionaris pada kegiatan dan eksekusi program kerja BEM FEB UKRIDA.',
    time: 'Sesuai rundown kegiatan',
    location: 'Lokasi kegiatan proker',
    peserta: 'Seluruh Fungsionaris',
    invite: () => true,
  },
  {
    id: 'bph',
    label: 'Rapat BPH',
    icon: CheckSquare,
    title: 'Rapat Badan Pengurus Harian',
    agenda:
      'Koordinasi internal BPH, validasi laporan divisi, dan pengambilan keputusan organisasi.',
    time: '17.00 – 19.00 WIB',
    location: 'Ruang BPH FEB UKRIDA',
    peserta: 'Seluruh Fungsionaris',
    invite: () => true,
  },
];

const CATEGORY_COUNTS = Object.fromEntries(
  MEETING_CATEGORIES.map((kategori) => [
    kategori.id,
    FUNGSIONARIS.filter(kategori.invite).length,
  ])
);

const STATUS_OPTIONS = [
  {
    id: 'hadir',
    label: 'Hadir',
    active:
      'border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20',
    hover: 'hover:border-emerald-300 hover:bg-emerald-50/70',
  },
  {
    id: 'tidak_hadir',
    label: 'Tidak Hadir',
    active:
      'border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-600/20',
    hover: 'hover:border-rose-300 hover:bg-rose-50/70',
  },
  {
    id: 'izin',
    label: 'Izin',
    active:
      'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/20',
    hover: 'hover:border-amber-300 hover:bg-amber-50/70',
  },
];

const STATUS_BREAKDOWN = [
  {
    id: 'hadir',
    label: 'Hadir',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
  {
    id: 'tidak_hadir',
    label: 'Tidak Hadir',
    dot: 'bg-rose-500',
    text: 'text-rose-700',
  },
  {
    id: 'izin',
    label: 'Izin',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
  },
];

const STATUS_DOT = {
  hadir: 'bg-emerald-500',
  tidak_hadir: 'bg-rose-500',
  izin: 'bg-amber-500',
};

// Label kanonik dipakai bersama AbsensiRapatView, DashboardTrends, dan CareTrackerView.
const STATUS_LABEL = {
  hadir: 'Hadir',
  tidak_hadir: 'Tidak Hadir',
  izin: 'Izin',
};

const EMPTY_RECORDS = {};

const TOAST_THEME = {
  success: {
    icon: CheckCircle2,
    wrapper: 'border-emerald-200 bg-white',
    iconWrapper: 'bg-emerald-50 text-emerald-600',
    title: 'text-emerald-900',
  },
  error: {
    icon: AlertCircle,
    wrapper: 'border-rose-200 bg-white',
    iconWrapper: 'bg-rose-50 text-rose-600',
    title: 'text-rose-900',
  },
  info: {
    icon: Info,
    wrapper: 'border-sky-200 bg-white',
    iconWrapper: 'bg-sky-50 text-sky-600',
    title: 'text-sky-900',
  },
};

function parseSessions(rawValue) {
  try {
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readSavedSessions() {
  if (typeof window === 'undefined') return [];
  try {
    return parseSessions(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatLongDate(date) {
  const formatted = date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatSessionDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Waktu tidak tersedia';

  return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getSessionSummary(session) {
  if (session.ringkasan) {
    return {
      hadir: session.ringkasan.hadir ?? 0,
      total: session.ringkasan.total ?? 0,
    };
  }

  const list = session.records || session.detail || [];
  return {
    hadir: list.filter((item) => item.status === 'Hadir' || item.status === 'hadir')
      .length,
    total: list.length,
  };
}

function getInitials(nama) {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata.charAt(0))
    .join('')
    .toUpperCase();
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
      </span>
      <div>
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Live · Waktu Indonesia Barat
        </p>
        <p className="font-mono text-sm font-bold tabular-nums text-slate-900">
          {time}
        </p>
      </div>
    </div>
  );
}

export default function AbsensiInputView() {
  const [activeCategoryId, setActiveCategoryId] = useState('pleno');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceByCategory, setAttendanceByCategory] = useState({});
  const [savedSessions, setSavedSessions] = useState(readSavedSessions);
  const [toast, setToast] = useState(null);
  const [today] = useState(() => new Date());

  const activeCategory = useMemo(
    () =>
      MEETING_CATEGORIES.find((kategori) => kategori.id === activeCategoryId) ||
      MEETING_CATEGORIES[0],
    [activeCategoryId]
  );

  const invitedMembers = useMemo(
    () => FUNGSIONARIS.filter((member) => activeCategory.invite(member)),
    [activeCategory]
  );

  const records = attendanceByCategory[activeCategoryId] || EMPTY_RECORDS;

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return invitedMembers;

    return invitedMembers.filter((member) =>
      [member.nama, member.nim, member.jabatan, member.divisi].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [invitedMembers, searchQuery]);

  const summary = useMemo(() => {
    const counts = { hadir: 0, tidak_hadir: 0, izin: 0, belum: 0 };

    invitedMembers.forEach((member) => {
      const status = records[member.id];
      if (status === 'hadir') counts.hadir += 1;
      else if (status === 'tidak_hadir') counts.tidak_hadir += 1;
      else if (status === 'izin') counts.izin += 1;
      else counts.belum += 1;
    });

    return counts;
  }, [invitedMembers, records]);

  const total = invitedMembers.length;
  const filledCount = total - summary.belum;
  const hadirPercent = total > 0 ? Math.round((summary.hadir / total) * 100) : 0;
  const progressPercent =
    total > 0 ? Math.round((filledCount / total) * 100) : 0;

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setSavedSessions(parseSessions(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleStatusChange = (memberId, statusId) => {
    setAttendanceByCategory((prev) => {
      const currentRecords = prev[activeCategoryId] || {};
      const nextRecords = { ...currentRecords };

      // Checkbox diklik ulang untuk membatalkan pilihan.
      if (currentRecords[memberId] === statusId) {
        delete nextRecords[memberId];
      } else {
        nextRecords[memberId] = statusId;
      }

      return { ...prev, [activeCategoryId]: nextRecords };
    });
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    invitedMembers.forEach((member) => {
      allPresent[member.id] = 'hadir';
    });

    setAttendanceByCategory((prev) => ({
      ...prev,
      [activeCategoryId]: allPresent,
    }));

    showToast(
      'success',
      'Semua ditandai hadir',
      `${total} fungsionaris pada kategori ${activeCategory.label} ditandai hadir.`
    );
  };

  const handleClear = () => {
    setAttendanceByCategory((prev) => ({
      ...prev,
      [activeCategoryId]: {},
    }));
  };

  const handleSubmit = () => {
    if (summary.belum > 0) {
      showToast(
        'error',
        'Absensi belum lengkap',
        `Masih ada ${summary.belum} fungsionaris yang belum ditandai. Lengkapi semua status sebelum menyimpan.`
      );
      return;
    }

    const now = new Date();
    const detail = invitedMembers.map((member) => ({
      id: member.id,
      nama: member.nama,
      nim: member.nim,
      jabatan: member.jabatan,
      divisi: member.divisi,
      status: records[member.id],
    }));

    const session = {
      id: `sesi-${now.getTime()}`,
      kategoriId: activeCategory.id,
      kategoriLabel: activeCategory.label,
      kategori: activeCategory.label,
      judul: activeCategory.title,
      tanggal: toDateKey(now),
      disimpanPada: now.toISOString(),
      savedAt: now.toISOString(),
      ringkasan: {
        hadir: summary.hadir,
        tidak_hadir: summary.tidak_hadir,
        izin: summary.izin,
        total,
      },
      detail,
      // Format kanonik yang dibaca DashboardTrends & CareTrackerView.
      records: detail.map((item) => ({
        nim: item.nim,
        nama: item.nama,
        divisi: item.divisi,
        status: STATUS_LABEL[item.status] || 'Tidak Hadir',
        keterangan: '',
      })),
    };

    try {
      const nextSessions = [session, ...readSavedSessions()].slice(0, 50);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions));
      setSavedSessions(nextSessions);

      showToast(
        'success',
        'Absensi berhasil disimpan',
        `${summary.hadir} dari ${total} fungsionaris hadir pada kategori ${activeCategory.label}.`
      );
    } catch (error) {
      console.error('Gagal menyimpan absensi ke localStorage:', error);
      showToast(
        'error',
        'Gagal menyimpan absensi',
        'Penyimpanan lokal tidak tersedia atau penuh. Silakan coba kembali.'
      );
    }
  };

  const toastTheme = toast ? TOAST_THEME[toast.type] || TOAST_THEME.info : null;
  const ToastIcon = toastTheme?.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        eyebrow="Presensi Real-Time · BEM FEB UKRIDA"
        title="Input Absensi Rapat"
        description={`Catat kehadiran ${FUNGSIONARIS.length} fungsionaris per kategori rapat. Rekap hadir, tidak hadir, dan izin diperbarui langsung saat status dipilih.`}
        action={<LiveClock />}
      />

      {/* Filter tab kategori rapat */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3.5 py-2.5">
          <Filter className="size-3.5 text-[#13539D]" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Filter Kategori Rapat
          </p>
        </div>
        <div className="p-1.5">
          <div
            role="tablist"
            aria-label="Filter kategori rapat"
            className="flex items-center gap-1 overflow-x-auto scrollbar-none"
          >
            {MEETING_CATEGORIES.map((kategori) => {
              const Icon = kategori.icon;
              const isActive = kategori.id === activeCategoryId;

              return (
                <button
                  key={kategori.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="absensi-panel"
                  id={`tab-${kategori.id}`}
                  onClick={() => setActiveCategoryId(kategori.id)}
                  className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
                    isActive
                      ? 'bg-[#13539D] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`size-3.5 ${
                      isActive ? 'text-[#F7C828]' : 'text-slate-400'
                    }`}
                  />
                  <span>{kategori.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {CATEGORY_COUNTS[kategori.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kartu detail sesi */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E5C] via-[#13539D] to-[#1D6DBD] p-5 text-white shadow-lg shadow-[#13539D]/20 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-16 size-48 rounded-full bg-[#F7C828]/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-blue-50">
                <Sparkles className="size-3" />
                Kategori Rapat
              </span>
              <span className="inline-flex items-center rounded-full bg-[#F7C828] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#0A2E5C]">
                {activeCategory.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-100">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-300" />
                </span>
                Sesi Real-Time
              </span>
            </div>

            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {activeCategory.title}
            </p>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-blue-100/90">
              {activeCategory.agenda}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-blue-50/90">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-[#F7C828]" />
                {formatLongDate(today)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#F7C828]" />
                {activeCategory.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#F7C828]" />
                {activeCategory.location}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-stretch gap-2 sm:gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100/80">
                Peserta
              </p>
              <p className="mt-1 text-2xl font-black leading-none text-white">
                {total}
              </p>
              <p className="mt-1 text-[9px] font-medium text-blue-100/75">
                {activeCategory.peserta}
              </p>
            </div>
            <div className="rounded-2xl border border-[#F7C828]/30 bg-[#F7C828]/10 px-4 py-3 backdrop-blur-sm">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#F7C828]">
                Terisi
              </p>
              <p className="mt-1 text-2xl font-black leading-none text-[#F7C828]">
                {filledCount}
              </p>
              <p className="mt-1 text-[9px] font-medium text-blue-100/75">
                dari {total} peserta
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Panel daftar fungsionaris */}
        <div
          id="absensi-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeCategoryId}`}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#13539D]/10 text-[#13539D]">
                <CheckSquare className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Daftar Fungsionaris
                </h2>
                <p className="text-[11px] text-slate-500">
                  {invitedMembers.length} peserta diundang · {filledCount}{' '}
                  sudah ditandai
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama, NIM, atau divisi..."
                aria-label="Cari fungsionaris"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-9 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#13539D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#13539D]/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
              <Info className="size-3.5 shrink-0 text-slate-400" />
              Pilih status kehadiran. Klik ulang untuk membatalkan pilihan.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <UserCheck className="size-3.5" />
                Tandai Hadir Semua
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={filledCount === 0}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="size-3.5" />
                Bersihkan
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredMembers.map((member) => {
              const status = records[member.id];
              const theme = DIVISI_THEME[member.divisi] || DEFAULT_DIVISI_THEME;
              const statusDot = status ? STATUS_DOT[status] : null;

              return (
                <div
                  key={member.id}
                  className={`px-4 py-4 transition sm:px-5 ${
                    status
                      ? 'bg-white'
                      : 'bg-amber-50/20 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        className={`relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${theme.avatar} text-[10px] font-extrabold tracking-wide text-white shadow-sm`}
                      >
                        {getInitials(member.nama)}
                        {statusDot && (
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white ${statusDot}`}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="truncate text-[13px] font-bold text-slate-900">
                            {member.nama}
                          </p>
                          <span
                            className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.08em] ${theme.chip}`}
                          >
                            {member.divisi}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                          {member.jabatan}
                          <span className="mx-1 text-slate-300">·</span>
                          <span className="font-mono text-slate-400">
                            NIM {member.nim}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div
                      role="group"
                      aria-label={`Status kehadiran ${member.nama}`}
                      className="grid grid-cols-3 gap-2 xl:w-[310px] xl:shrink-0"
                    >
                      {STATUS_OPTIONS.map((option) => {
                        const isActive = status === option.id;

                        return (
                          <label
                            key={option.id}
                            className={`flex cursor-pointer select-none items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[10px] font-bold transition focus-within:ring-2 focus-within:ring-[#13539D]/25 sm:px-3 sm:text-[11px] ${
                              isActive
                                ? option.active
                                : `border-slate-200 bg-white text-slate-500 ${option.hover}`
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isActive}
                              onChange={() =>
                                handleStatusChange(member.id, option.id)
                              }
                              aria-label={`${member.nama}: ${option.label}`}
                            />
                            <span
                              className={`grid size-3.5 shrink-0 place-items-center rounded-[4px] border transition ${
                                isActive
                                  ? 'border-white/70 bg-white/20'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isActive && (
                                <Check
                                  className="size-2.5"
                                  strokeWidth={3.5}
                                />
                              )}
                            </span>
                            <span className="whitespace-nowrap">
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search className="size-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-700">
                  Tidak ada fungsionaris yang cocok
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Coba kata kunci lain atau pilih kategori rapat yang berbeda.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Hapus pencarian
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-[10px] font-medium text-slate-500 sm:px-5">
            <span>
              Menampilkan {filteredMembers.length} dari {total} peserta
            </span>
            <span
              className={
                summary.belum > 0 ? 'text-amber-600' : 'text-emerald-600'
              }
            >
              {summary.belum > 0
                ? `${summary.belum} belum ditandai`
                : 'Semua status terisi'}
            </span>
          </div>
        </div>

        {/* Panel rekap & submit */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#13539D]">
                    Rekap Kehadiran
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    Ringkasan Sesi
                  </p>
                </div>
                <span className="grid size-9 place-items-center rounded-xl bg-[#13539D]/10 text-[#13539D]">
                  <ClipboardCheck className="size-4" />
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 text-white shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-100">
                      Total Hadir
                    </p>
                    <p className="mt-1 text-3xl font-black leading-none text-white">
                      {summary.hadir}
                      <span className="text-sm font-semibold text-emerald-100">
                        /{total}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-emerald-100">
                      fungsionaris · {hadirPercent}% kehadiran
                    </p>
                  </div>

                  <div className="relative grid size-16 shrink-0 place-items-center rounded-full bg-white/10">
                    <svg
                      viewBox="0 0 40 40"
                      className="absolute inset-0 size-16 -rotate-90"
                      aria-hidden="true"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="17"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="17"
                        fill="none"
                        stroke="#F7C828"
                        strokeWidth="4"
                        strokeLinecap="round"
                        pathLength="100"
                        strokeDasharray={`${hadirPercent} 100`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="text-sm font-black text-white">
                      {hadirPercent}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-[#F7C828] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[9px] font-medium text-emerald-100">
                  {filledCount} dari {total} status terisi
                </p>
              </div>

              <div className="mt-3 space-y-2">
                {STATUS_BREAKDOWN.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className={`size-2 rounded-full ${item.dot}`} />
                      {item.label}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${item.text}`}
                    >
                      {summary[item.id]}
                    </span>
                  </div>
                ))}

                {summary.belum > 0 && (
                  <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-amber-700">
                      <AlertCircle className="size-3.5" />
                      Belum ditandai
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-700">
                      {summary.belum}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#13539D] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#13539D]/20 transition hover:bg-[#0D417D] active:scale-[0.99]"
              >
                <Save className="size-4" />
                Submit Absensi
              </button>

              <p
                className={`mt-2 flex items-center justify-center gap-1.5 text-[10px] font-medium ${
                  summary.belum > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {summary.belum > 0 ? (
                  <>
                    <AlertCircle className="size-3" />
                    {summary.belum} status belum diisi
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3" />
                    Semua status siap disimpan
                  </>
                )}
              </p>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-slate-400">
                <Database className="size-3" />
                Tersimpan lokal:
                <code className="font-mono">bem_absensi_sessions</code>
              </div>
            </div>
          </div>

          {/* Riwayat sesi tersimpan */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
                  <History className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">
                    Riwayat Tersimpan
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Sinkron antar-tab
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#13539D]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#13539D]">
                {savedSessions.length}
              </span>
            </div>

            {savedSessions.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center">
                <Database className="mx-auto size-5 text-slate-300" />
                <p className="mt-2 text-[11px] font-semibold text-slate-500">
                  Belum ada sesi tersimpan
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Lengkapi absensi lalu tekan Simpan.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {savedSessions.slice(0, 3).map((session, index) => {
                  const sessionSummary = getSessionSummary(session);

                  return (
                    <div
                      key={session.id || `${session.disimpanPada}-${index}`}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5"
                    >
                      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[11px] font-bold text-slate-800">
                            {session.kategoriLabel ||
                              session.kategori ||
                              'Sesi Absensi'}
                          </p>
                          <span className="shrink-0 font-mono text-[9px] text-slate-400">
                            {sessionSummary.hadir}/{sessionSummary.total}
                          </span>
                        </div>
                        <p className="truncate text-[9px] text-slate-400">
                          {session.judul || 'Absensi fungsionaris'}
                        </p>
                        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-wide text-slate-400">
                          {formatSessionDate(
                            session.disimpanPada || session.savedAt
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-400">
              <Info className="size-3 shrink-0" />
              Riwayat diperbarui otomatis saat tab lain menyimpan.
            </p>
          </div>
        </aside>
      </div>

      {/* Toast notifikasi */}
      {toast && toastTheme && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[100] animate-scale-up sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl ${toastTheme.wrapper}`}
          >
            <div
              className={`grid size-9 shrink-0 place-items-center rounded-xl ${toastTheme.iconWrapper}`}
            >
              <ToastIcon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-extrabold ${toastTheme.title}`}>
                {toast.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Tutup notifikasi"
              className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
