/**
 * Shared mock data, localStorage helpers, and seed data for the
 * BEM FEB UKRIDA portal (ABMAS feature parity).
 *
 * Everything is persisted locally — there is no real API call.
 */

// ── MOCK FUNGSIONARIS (canonical list used across every new feature) ────────
export const MOCK_FUNGSIONARIS = [
  { nim: '312023001', nama: 'Arthur Reezan', divisi: 'BPH', jabatan: 'Ketua Umum', hp: '081234567890' },
  { nim: '322024025', nama: 'Princess Auralia Barus', divisi: 'BPH', jabatan: 'Wakil Ketua', hp: '081298765432' },
  { nim: '312023010', nama: 'Sarah Amalia', divisi: 'BPH', jabatan: 'Bendahara Umum', hp: '081398765432' },
  { nim: '312023015', nama: 'Dimas Prasetyo', divisi: 'Akademik', jabatan: 'Koordinator', hp: '081987654321' },
  { nim: '312023020', nama: 'Vania Stephanie', divisi: 'Akademik', jabatan: 'Staf', hp: '085712345678' },
  { nim: '312023025', nama: 'Kevin Hartanto', divisi: 'Sosmas', jabatan: 'Koordinator', hp: '081234509876' },
  { nim: '312023030', nama: 'Melinda Sari', divisi: 'Sosmas', jabatan: 'Staf', hp: '081876543210' },
  { nim: '312023035', nama: 'Ryan Putra', divisi: 'Kesmas', jabatan: 'Koordinator', hp: '082123456789' },
  { nim: '312023040', nama: 'Citra Dewi', divisi: 'Kesmas', jabatan: 'Staf', hp: '082234567890' },
  { nim: '312023045', nama: 'Bagas Nugroho', divisi: 'Minat Bakat', jabatan: 'Koordinator', hp: '083123456789' },
  { nim: '312023050', nama: 'Alicia Tan', divisi: 'Minat Bakat', jabatan: 'Staf', hp: '083234567890' },
  { nim: '312023055', nama: 'Fadhil Rahman', divisi: 'PSDM', jabatan: 'Koordinator', hp: '085612345678' },
  { nim: '312023060', nama: 'Nadia Kusuma', divisi: 'PSDM', jabatan: 'Staf', hp: '085723456789' },
  { nim: '312023065', nama: 'Benny Santoso', divisi: 'Hubungan Luar', jabatan: 'Koordinator', hp: '087812345678' },
  { nim: '312023070', nama: 'Ratna Wulandari', divisi: 'Hubungan Luar', jabatan: 'Staf', hp: '087923456789' },
  { nim: '312023075', nama: 'Gilang Ramadhan', divisi: 'Infokom', jabatan: 'Koordinator', hp: '089012345678' },
  { nim: '312023080', nama: 'Putri Rahayu', divisi: 'Infokom', jabatan: 'Staf', hp: '089123456789' },
];

export const DIVISION_COLORS = {
  BPH: '#13539D',
  Akademik: '#0284C7',
  Sosmas: '#16A34A',
  Kesmas: '#0D9488',
  'Minat Bakat': '#F59E0B',
  PSDM: '#7C3AED',
  'Hubungan Luar': '#DB2777',
  Infokom: '#EA580C',
};

export const DIVISION_DESCRIPTIONS = {
  BPH: 'Badan Pengurus Harian — koordinasi umum organisasi.',
  Akademik: 'Pengembangan akademik, penalaran, dan karier mahasiswa.',
  Sosmas: 'Pengabdian sosial masyarakat dan kepedulian lingkungan.',
  Kesmas: 'Kesehatan mahasiswa dan kampanye hidup sehat.',
  'Minat Bakat': 'Wadah olahraga, seni, dan pengembangan minat bakat.',
  PSDM: 'Pengembangan sumber daya manusia dan kaderisasi fungsionaris.',
  'Hubungan Luar': 'Relasi eksternal, alumni, dan kemitraan strategis.',
  Infokom: 'Informasi, komunikasi, media, dan kreatif digital.',
};

export const DEFAULT_DIVISIONS = [
  { id: 'div-bph', nama: 'BPH', warna: DIVISION_COLORS.BPH, deskripsi: DIVISION_DESCRIPTIONS.BPH, picNim: '312023001', picNama: 'Arthur Reezan' },
  { id: 'div-akademik', nama: 'Akademik', warna: DIVISION_COLORS.Akademik, deskripsi: DIVISION_DESCRIPTIONS.Akademik, picNim: '312023015', picNama: 'Dimas Prasetyo' },
  { id: 'div-sosmas', nama: 'Sosmas', warna: DIVISION_COLORS.Sosmas, deskripsi: DIVISION_DESCRIPTIONS.Sosmas, picNim: '312023025', picNama: 'Kevin Hartanto' },
  { id: 'div-kesmas', nama: 'Kesmas', warna: DIVISION_COLORS.Kesmas, deskripsi: DIVISION_DESCRIPTIONS.Kesmas, picNim: '312023035', picNama: 'Ryan Putra' },
  { id: 'div-minat', nama: 'Minat Bakat', warna: DIVISION_COLORS['Minat Bakat'], deskripsi: DIVISION_DESCRIPTIONS['Minat Bakat'], picNim: '312023045', picNama: 'Bagas Nugroho' },
  { id: 'div-psdm', nama: 'PSDM', warna: DIVISION_COLORS.PSDM, deskripsi: DIVISION_DESCRIPTIONS.PSDM, picNim: '312023055', picNama: 'Fadhil Rahman' },
  { id: 'div-hublu', nama: 'Hubungan Luar', warna: DIVISION_COLORS['Hubungan Luar'], deskripsi: DIVISION_DESCRIPTIONS['Hubungan Luar'], picNim: '312023065', picNama: 'Benny Santoso' },
  { id: 'div-infokom', nama: 'Infokom', warna: DIVISION_COLORS.Infokom, deskripsi: DIVISION_DESCRIPTIONS.Infokom, picNim: '312023075', picNama: 'Gilang Ramadhan' },
];

export const DEFAULT_ACTIVITY_CATEGORIES = [
  { id: 'cat-pleno', nama: 'Rapat Pleno', warna: '#13539D' },
  { id: 'cat-divisi', nama: 'Rapat Divisi', warna: '#0284C7' },
  { id: 'cat-proker', nama: 'Kegiatan Proker', warna: '#16A34A' },
  { id: 'cat-bph', nama: 'Rapat BPH', warna: '#7C3AED' },
];

// ── STORAGE HELPERS ─────────────────────────────────────────────────────────
export const STORAGE = {
  absensi: 'bem_absensi_sessions',
  activity: 'bem_activity_log',
  portalUsers: 'bem_portal_users',
  divisions: 'bem_divisi_pic',
  members: 'bem_members_data',
  importLogs: 'bem_import_logs',
  announcements: 'bem_announcements',
  pengajuan: 'bem_pengajuan',
  messages: 'bem_messages',
  profiles: 'bem_member_profiles',
  calendar: 'bem_calendar_events',
  notifications: 'bem_notifications',
  careRecords: 'bem_care_records',
  orgSettings: 'bem_org_settings',
  categories: 'bem_activity_categories',
};

export function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function initials(name = '') {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const pad = (n) => String(n).padStart(2, '0');

export function toISODate(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function shiftDate(days, base = new Date()) {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + Number(days));
  return toISODate(d);
}

export function isoMinutesAgo(minutes) {
  return new Date(Date.now() - Number(minutes) * 60 * 1000).toISOString();
}

export function formatDateID(value) {
  if (!value) return '-';
  const d = value instanceof Date ? value : new Date(String(value).length <= 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTimeID(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatMonthID(value) {
  if (!value) return '-';
  const d = new Date(String(value).length <= 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return '-';
  return `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function monthKey(value) {
  if (!value) return '';
  const d = new Date(String(value).length <= 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function timeAgo(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const diff = Math.max(0, Date.now() - d.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDateID(d);
}

export function memberEmail(nim) {
  return `${nim}@civitas.ukrida.ac.id`;
}

export function logActivity({ actor = 'Sistem', type = 'umum', text = '', meta = null }) {
  const logs = readLocal(STORAGE.activity, []);
  logs.unshift({
    id: uid('act'),
    timestamp: new Date().toISOString(),
    actor,
    type,
    text,
    meta,
  });
  writeLocal(STORAGE.activity, logs.slice(0, 60));
}

export function pushNotification({ type = 'info', text = 'Notifikasi baru', meta = null }) {
  const list = readLocal(STORAGE.notifications, []);
  list.unshift({
    id: uid('notif'),
    type,
    text,
    meta,
    read: false,
    timestamp: new Date().toISOString(),
  });
  writeLocal(STORAGE.notifications, list.slice(0, 50));
}

export function getCurrentActor() {
  try {
    const user = JSON.parse(localStorage.getItem('bem_logged_user') || 'null');
    return user?.name || 'Admin Portal';
  } catch {
    return 'Admin Portal';
  }
}

// ── SEED BUILDERS ───────────────────────────────────────────────────────────
function buildMembersData() {
  return MOCK_FUNGSIONARIS.map((m, idx) => ({
    id: `M${String(idx + 1).padStart(2, '0')}`,
    nim: m.nim,
    nama: m.nama,
    name: m.nama,
    divisi: m.divisi,
    jabatan: m.jabatan,
    hp: m.hp,
    phone: m.hp,
    email: memberEmail(m.nim),
    prodi: idx % 2 === 0 ? 'S1 Manajemen' : 'S1 Akuntansi',
    angkatan: m.nim.startsWith('32') ? '2024' : '2023',
    status: 'Aktif',
  }));
}

function buildPortalUsers() {
  return [
    {
      id: 'usr-arthur',
      username: '312023002',
      email: 'arthur.reezan@civitas.ukrida.ac.id',
      name: 'Arthur Reezan',
      password: 'ketua2026',
      role: 'ADMIN_UTAMA',
      active: true,
      createdAt: isoMinutesAgo(60 * 24 * 30),
    },
    {
      id: 'usr-princess',
      username: '322024025',
      email: 'princess.barus@civitas.ukrida.ac.id',
      name: 'Princess Auralia Barus',
      password: 'wakil2026',
      role: 'TIM_ABSENSI',
      active: true,
      createdAt: isoMinutesAgo(60 * 24 * 22),
    },
  ];
}

function buildAbsensiSessions() {
  const meta = [
    { tanggal: shiftDate(-35), kategori: 'Rapat Pleno', judul: 'Rapat Pleno Bulanan September' },
    { tanggal: shiftDate(-28), kategori: 'Rapat Divisi', judul: 'Rapat Koordinasi Divisi' },
    { tanggal: shiftDate(-21), kategori: 'Kegiatan Proker', judul: 'Evaluasi Proker Bulanan' },
    { tanggal: shiftDate(-14), kategori: 'Rapat BPH', judul: 'Rapat BPH & Koordinator' },
    { tanggal: shiftDate(-7), kategori: 'Rapat Pleno', judul: 'Rapat Pleno Evaluasi Oktober' },
    { tanggal: shiftDate(0), kategori: 'Rapat Pleno', judul: 'Rapat Pleno November' },
  ];

  // Members with a streak of consecutive absences (for Care Tracker demo)
  const absenceStreak = {
    '312023030': 6, // Melinda Sari
    '312023050': 4, // Alicia Tan
    '312023070': 3, // Ratna Wulandari
  };

  return meta.map((session, sessionIdx) => {
    const records = MOCK_FUNGSIONARIS.map((m) => {
      const streak = absenceStreak[m.nim] || 0;
      const isAbsent = streak > 0 && sessionIdx >= meta.length - streak;
      if (isAbsent) {
        return {
          nim: m.nim,
          nama: m.nama,
          divisi: m.divisi,
          status: 'Tidak Hadir',
          keterangan: 'Tanpa keterangan',
        };
      }
      if (sessionIdx === 2 && m.nim === '312023020') {
        return {
          nim: m.nim,
          nama: m.nama,
          divisi: m.divisi,
          status: 'Izin',
          keterangan: 'Ujian susulan',
        };
      }
      if (sessionIdx === 4 && m.nim === '312023060') {
        return {
          nim: m.nim,
          nama: m.nama,
          divisi: m.divisi,
          status: 'Izin',
          keterangan: 'Kegiatan keluarga',
        };
      }
      return {
        nim: m.nim,
        nama: m.nama,
        divisi: m.divisi,
        status: 'Hadir',
        keterangan: '',
      };
    });

    return {
      id: `sesi-${sessionIdx + 1}`,
      tanggal: session.tanggal,
      kategori: session.kategori,
      judul: session.judul,
      savedAt: `${session.tanggal}T17:30:00`,
      savedBy: 'Arthur Reezan',
      records,
    };
  });
}

function buildActivityLog() {
  return [
    { id: 'act-1', timestamp: isoMinutesAgo(6), actor: 'Arthur Reezan', type: 'absensi', text: 'Absensi Rapat Pleno November berhasil disimpan (17 peserta).' },
    { id: 'act-2', timestamp: isoMinutesAgo(42), actor: 'Princess Auralia Barus', type: 'pengumuman', text: 'Menerbitkan pengumuman jadwal rapat pleno November.' },
    { id: 'act-3', timestamp: isoMinutesAgo(95), actor: 'Sarah Amalia', type: 'keuangan', text: 'Memverifikasi 4 bukti nota kas kegiatan LKMM-TD.' },
    { id: 'act-4', timestamp: isoMinutesAgo(60 * 5), actor: 'Dimas Prasetyo', type: 'proker', text: 'Mengajukan revisi anggaran FEB Career Expo 2026.' },
    { id: 'act-5', timestamp: isoMinutesAgo(60 * 26), actor: 'Kevin Hartanto', type: 'pengajuan', text: 'Menyetujui pengajuan dispensasi kuliah fungsionaris Sosmas.' },
  ];
}

function buildAnnouncements() {
  return [
    {
      id: 'ann-1',
      judul: 'Jadwal Rapat Pleno November 2026',
      kategori: 'Umum',
      isi: 'Rapat Pleno BEM FEB bulan November dilaksanakan pada Selasa, 3 November 2026 pukul 16.00 WIB di Ruang Seminar FEB Lt. 3. Seluruh fungsionaris wajib hadir tepat waktu.',
      status: 'Published',
      tanggal: isoMinutesAgo(120),
      author: 'BPH Arthur',
    },
    {
      id: 'ann-2',
      judul: 'Batas Akhir Laporan KPI Divisi Triwulan 3',
      kategori: 'Urgent',
      isi: 'Seluruh koordinator divisi wajib mengumpulkan laporan KPI Triwulan 3 paling lambat 10 November 2026 kepada Sekretaris Umum melalui folder Drive BEM FEB.',
      status: 'Published',
      tanggal: isoMinutesAgo(60 * 20),
      author: 'Princess Auralia Barus',
    },
    {
      id: 'ann-3',
      judul: 'Draft Panduan FEB Career Expo 2026',
      kategori: 'Proker',
      isi: 'Draft rundown dan pembagian job desk FEB Career Expo 2026 masih dalam tahap finalisasi bersama divisi Akademik. Mohon masukan sebelum 8 November 2026.',
      status: 'Draft',
      tanggal: isoMinutesAgo(60 * 30),
      author: 'Dimas Prasetyo',
    },
  ];
}

function buildPengajuan() {
  return [
    {
      id: 'req-1',
      nim: '312023044',
      nama: 'Dimas Prasetyo',
      divisi: 'PSDM',
      jenis: 'Izin Tidak Hadir',
      tanggal: shiftDate(2),
      alasan: 'Mengikuti seminar nasional karier di luar kampus dan tidak dapat menghadiri rapat pleno divisi.',
      status: 'PENDING',
      catatan: '',
      createdAt: isoMinutesAgo(180),
      reviewedAt: null,
      reviewedBy: null,
    },
    {
      id: 'req-2',
      nim: '322024011',
      nama: 'Vania Stephanie',
      divisi: 'Akademik',
      jenis: 'Dispensasi Kuliah',
      tanggal: shiftDate(-1),
      alasan: 'Mendampingi dosen dalam kegiatan pengabdian masyarakat dan membutuhkan dispensasi untuk dua mata kuliah.',
      status: 'APPROVED',
      catatan: 'Disetujui. Silakan koordinasikan tugas yang tertinggal dengan koordinator divisi.',
      createdAt: isoMinutesAgo(60 * 26),
      reviewedAt: isoMinutesAgo(60 * 20),
      reviewedBy: 'Princess Auralia Barus',
    },
    {
      id: 'req-3',
      nim: '312023001',
      nama: 'Arthur Reezan',
      divisi: 'BPH',
      jenis: 'SK Aktif',
      tanggal: shiftDate(-3),
      alasan: 'Permohonan penerbitan SK aktif kepengurusan untuk keperluan pengajuan beasiswa prestasi.',
      status: 'REJECTED',
      catatan: 'Berkas belum lengkap. Mohon lampirkan transkrip nilai terbaru dan ajukan kembali.',
      createdAt: isoMinutesAgo(60 * 52),
      reviewedAt: isoMinutesAgo(60 * 48),
      reviewedBy: 'Princess Auralia Barus',
    },
  ];
}

function buildMessages() {
  return [
    {
      id: 'msg-1',
      fromName: 'BPH Arthur',
      fromNim: '312023001',
      audience: 'all',
      divisi: null,
      subject: 'Rapat Pleno November',
      body: 'Halo rekan-rekan fungsionaris! Rapat Pleno BEM FEB November dilaksanakan hari ini pukul 16.00 WIB di Ruang Seminar FEB Lt. 3. Mohon hadir tepat waktu dan membawa laporan singkat divisi masing-masing.',
      createdAt: isoMinutesAgo(35),
      readBy: [],
    },
    {
      id: 'msg-2',
      fromName: 'Princess Auralia Barus',
      fromNim: '322024025',
      audience: 'all',
      divisi: null,
      subject: 'Pengumpulan Laporan KPI',
      body: 'Diingatkan kembali bahwa batas akhir laporan KPI Triwulan 3 adalah 10 November 2026. Gunakan template terbaru di Pusat Dokumen dan unggah melalui koordinator divisi.',
      createdAt: isoMinutesAgo(60 * 4),
      readBy: [],
    },
    {
      id: 'msg-3',
      fromName: 'BPH Arthur',
      fromNim: '312023001',
      audience: 'divisi',
      divisi: 'PSDM',
      subject: 'Persiapan Pelatihan Leadership',
      body: 'Khusus teman-teman PSDM, tolong siapkan rundown pelatihan leadership dan public speaking. Kita review draft-nya besok pukul 15.00 WIB di sekretariat.',
      createdAt: isoMinutesAgo(60 * 9),
      readBy: [],
    },
  ];
}

function buildProfiles() {
  const profiles = {};
  MOCK_FUNGSIONARIS.forEach((m, idx) => {
    profiles[m.nim] = {
      nim: m.nim,
      name: m.nama,
      gender: idx % 2 === 0 ? 'Laki-laki' : 'Perempuan',
      birthDate: `2004-${pad((idx % 12) + 1)}-${pad((idx % 27) + 1)}`,
      phone: m.hp,
      email: memberEmail(m.nim),
      address: 'Jl. Tanjung Duren Raya No. 4, Jakarta Barat',
      emergencyName: idx % 2 === 0 ? 'Bapak Santoso' : 'Ibu Wulandari',
      emergencyPhone: m.hp,
      emergencyRelation: 'Orang Tua',
      divisi: m.divisi,
      jabatan: m.jabatan,
      joinedAt: '2026-09-01',
    };
  });
  return profiles;
}

function buildCalendarEvents() {
  return [
    {
      id: 'cal-1',
      judul: 'Rapat Pleno BEM FEB November',
      tanggal: shiftDate(0),
      waktu: '16:00 - 18:00 WIB',
      lokasi: 'Ruang Seminar FEB Lt. 3',
      kategori: 'Rapat & Evaluasi',
      divisi: 'BPH',
      assignedTo: ['312023044', '322024011', '312023001', '312023015'],
    },
    {
      id: 'cal-2',
      judul: 'Rapat Koordinasi Divisi PSDM',
      tanggal: shiftDate(2),
      waktu: '15:00 - 16:30 WIB',
      lokasi: 'Sekretariat BEM FEB',
      kategori: 'Rapat & Evaluasi',
      divisi: 'PSDM',
      assignedTo: ['312023044', '322024011', '312023055', '312023060'],
    },
    {
      id: 'cal-3',
      judul: 'Batas Akhir LPJ LKMM-TD',
      tanggal: shiftDate(4),
      waktu: '17:00 WIB',
      lokasi: 'Ruang Dekanat FEB',
      kategori: 'Tenggat Administrasi',
      divisi: 'BPH',
      assignedTo: ['312023010', '312023001'],
    },
    {
      id: 'cal-4',
      judul: 'FEB Career Expo & Seminar Nasional',
      tanggal: shiftDate(10),
      waktu: '09:00 - 17:00 WIB',
      lokasi: 'Hall Utama Kampus 1 Tanjung Duren',
      kategori: 'Eksekusi Acara',
      divisi: 'Akademik',
      assignedTo: ['312023001', '312023015', '312023020', '312023044'],
    },
    {
      id: 'cal-5',
      judul: 'Bakti Sosial & Edukasi UMKM',
      tanggal: shiftDate(21),
      waktu: '08:30 - 14:00 WIB',
      lokasi: 'RPTRA Kebon Jeruk',
      kategori: 'Pengabdian Masyarakat',
      divisi: 'Sosmas',
      assignedTo: ['312023025', '312023030', '312023044'],
    },
    {
      id: 'cal-6',
      judul: 'PORSENI FEB UKRIDA 2026',
      tanggal: shiftDate(32),
      waktu: '09:00 - 18:00 WIB',
      lokasi: 'Sport Hall Kampus 1 Tanjung Duren',
      kategori: 'Eksekusi Acara',
      divisi: 'Minat Bakat',
      assignedTo: ['312023045', '312023050', '322024011'],
    },
  ];
}

function buildNotifications() {
  return [
    { id: 'notif-1', type: 'approval', text: 'Pengajuan izin diapprove oleh BPH.', read: false, timestamp: isoMinutesAgo(12) },
    { id: 'notif-2', type: 'announcement', text: 'Pengumuman baru dari BPH: Rapat Pleno November.', read: false, timestamp: isoMinutesAgo(48) },
    { id: 'notif-3', type: 'success', text: 'Absensi berhasil disimpan (17 peserta hadir).', read: false, timestamp: isoMinutesAgo(120) },
  ];
}

function buildOrgSettings() {
  return {
    nama: 'Badan Eksekutif Mahasiswa Fakultas Ekonomi & Bisnis UKRIDA',
    singkatan: 'BEM FEB UKRIDA',
    periode: '2026/2027',
    dekan: 'Dr. Ir. Yohanes Eko Widodo, M.M.',
    logo: '',
    visi: 'Mewujudkan BEM FEB UKRIDA sebagai organisasi yang adaptif, kolaboratif, dan berdampak nyata bagi mahasiswa serta masyarakat.',
    misi: '1. Meningkatkan pelayanan dan advokasi mahasiswa FEB.\n2. Mengembangkan kompetensi fungsionaris melalui kaderisasi berkelanjutan.\n3. Membangun kolaborasi strategis dengan alumni, industri, dan mitra eksternal.\n4. Menjalankan program kerja yang transparan, akuntabel, dan berkelanjutan.',
    updatedAt: isoMinutesAgo(60 * 24 * 10),
  };
}

function setIfMissing(key, valueOrBuilder) {
  try {
    if (localStorage.getItem(key) !== null) return;
    const value = typeof valueOrBuilder === 'function' ? valueOrBuilder() : valueOrBuilder;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode) — the UI still works in-memory.
  }
}

/**
 * Seeds every localStorage key used by the new ABMAS features once.
 * Existing user data is never overwritten.
 */
export function ensureSeedData() {
  setIfMissing(STORAGE.members, buildMembersData);
  setIfMissing(STORAGE.portalUsers, buildPortalUsers);
  setIfMissing(STORAGE.divisions, DEFAULT_DIVISIONS);
  setIfMissing(STORAGE.categories, DEFAULT_ACTIVITY_CATEGORIES);
  setIfMissing(STORAGE.absensi, buildAbsensiSessions);
  setIfMissing(STORAGE.activity, buildActivityLog);
  setIfMissing(STORAGE.announcements, buildAnnouncements);
  setIfMissing(STORAGE.pengajuan, buildPengajuan);
  setIfMissing(STORAGE.messages, buildMessages);
  setIfMissing(STORAGE.profiles, buildProfiles);
  setIfMissing(STORAGE.calendar, buildCalendarEvents);
  setIfMissing(STORAGE.notifications, buildNotifications);
  setIfMissing(STORAGE.careRecords, []);
  setIfMissing(STORAGE.orgSettings, buildOrgSettings);
  setIfMissing(STORAGE.importLogs, []);
}

// ── STATUS / STYLE HELPERS ───────────────────────────────────────────────────
export const ATTENDANCE_STATUS_STYLES = {
  Hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Izin: 'bg-amber-50 text-amber-700 border-amber-200',
  'Tidak Hadir': 'bg-rose-50 text-rose-700 border-rose-200',
  Alfa: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const PENGAJUAN_STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const ANNOUNCEMENT_CATEGORY_STYLES = {
  Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  Akademik: 'bg-blue-50 text-[#13539D] border-blue-200',
  Proker: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Umum: 'bg-slate-100 text-slate-600 border-slate-200',
};
