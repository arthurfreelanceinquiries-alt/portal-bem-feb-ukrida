import { createClient } from '@supabase/supabase-js';

// Default mock initial state untuk LK FEB
const INITIAL_PROKER = [
  {
    id: 'pk-1',
    nama_proker: 'FEB Career Expo & Seminar 2026',
    departemen: 'Departemen Akademik & Karier',
    pj: 'Dimas Prasetyo',
    target_selesai: '2026-11-20',
    pagu_anggaran: 15000000,
    realisasi_anggaran: 4200000,
    status: 'Berjalan',
    deskripsi: 'Job fair dan seminar nasional persiapan karier lulusan Fakultas Ekonomi & Bisnis bersama 25 perusahaan mitra.',
    diajukan_oleh: 'Dimas Prasetyo',
    disetujui_oleh: 'Ketua Umum BPH'
  },
  {
    id: 'pk-2',
    nama_proker: 'Pekan Olahraga & Seni FEB (PORSENI)',
    departemen: 'Departemen Minat & Bakat',
    pj: 'Siti Rahmawati',
    target_selesai: '2026-12-05',
    pagu_anggaran: 12000000,
    realisasi_anggaran: 0,
    status: 'Disetujui',
    deskripsi: 'Kompetisi futsal, basket, badminton, catur, e-sports, dan festival musik antar prodi dan angkatan di FEB.',
    diajukan_oleh: 'Siti Rahmawati',
    disetujui_oleh: 'Ketua Umum BPH'
  },
  {
    id: 'pk-3',
    nama_proker: 'LKMM-TD Latihan Kepemimpinan Manajemen',
    departemen: 'BPH Inti',
    pj: 'Arthur Reezan',
    target_selesai: '2026-10-28',
    pagu_anggaran: 8500000,
    realisasi_anggaran: 8500000,
    status: 'Selesai',
    deskripsi: 'Pelatihan manajemen organisasi dan kepemimpinan wajib untuk mahasiswa fungsionaris baru FEB.',
    diajukan_oleh: 'Arthur Reezan',
    disetujui_oleh: 'Ketua Umum BPH'
  },
  {
    id: 'pk-4',
    nama_proker: 'Bakti Sosial & Edukasi UMKM FEB Peduli',
    departemen: 'Departemen Sosial Masyarakat',
    pj: 'Kevin Sanjaya',
    target_selesai: '2026-11-15',
    pagu_anggaran: 6000000,
    realisasi_anggaran: 0,
    status: 'Diajukan',
    deskripsi: 'Program pengabdian masyarakat, edukasi literasi keuangan dan pembukuan sederhana untuk UMKM binaan.',
    diajukan_oleh: 'Kevin Sanjaya',
    disetujui_oleh: null
  }
];

const INITIAL_TRANSAKSI = [
  {
    id: 'tx-1',
    tanggal: '2026-10-01',
    tipe: 'Pemasukan',
    kategori: 'Dana Dekanat',
    jumlah: 35000000,
    keterangan: 'Pencairan dana hibah kegiatan kemahasiswaan Semester Ganjil dari Dekanat FEB',
    proker_id: 'all',
    nama_proker: 'Kas Operasional LK',
    dicatat_oleh: 'Bendahara Umum',
    bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    status_verifikasi: 'Terverifikasi'
  },
  {
    id: 'tx-2',
    tanggal: '2026-10-05',
    tipe: 'Pemasukan',
    kategori: 'Iuran Pengurus',
    jumlah: 4500000,
    keterangan: 'Iuran wajib kas bulanan seluruh fungsionaris dan divisi LK FEB periode Oktober',
    proker_id: 'pk-3',
    nama_proker: 'BPH Inti',
    dicatat_oleh: 'Bendahara Umum',
    bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    status_verifikasi: 'Terverifikasi'
  },
  {
    id: 'tx-3',
    tanggal: '2026-10-08',
    tipe: 'Pengeluaran',
    kategori: 'Konsumsi',
    jumlah: 2800000,
    keterangan: 'Konsumsi snack box dan makan siang peserta dan pemateri LKMM-TD',
    proker_id: 'pk-3',
    nama_proker: 'LKMM-TD Latihan Kepemimpinan Manajemen',
    dicatat_oleh: 'Bendahara Pelaksana',
    bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    status_verifikasi: 'Terverifikasi'
  },
  {
    id: 'tx-4',
    tanggal: '2026-10-09',
    tipe: 'Pengeluaran',
    kategori: 'Logistik & Perlengkapan',
    jumlah: 5700000,
    keterangan: 'Sewa sound system, cetak banner backdrop aula, dan sertifikat peserta LKMM-TD',
    proker_id: 'pk-3',
    nama_proker: 'LKMM-TD Latihan Kepemimpinan Manajemen',
    dicatat_oleh: 'Bendahara Pelaksana',
    bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    status_verifikasi: 'Terverifikasi'
  },
  {
    id: 'tx-5',
    tanggal: '2026-10-10',
    tipe: 'Pengeluaran',
    kategori: 'Publikasi & Desain',
    jumlah: 1200000,
    keterangan: 'Down Payment (DP) cetak poster promosi dan ID Card panitia Career Expo 2026',
    proker_id: 'pk-1',
    nama_proker: 'FEB Career Expo & Seminar 2026',
    dicatat_oleh: 'Bendahara Pelaksana',
    bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    status_verifikasi: 'Terverifikasi'
  }
];

const INITIAL_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-10-10 14:15',
    user_name: 'Arthur Reezan',
    user_role: 'Ketua Umum BPH',
    action: 'Menyetujui Program Kerja',
    details: 'Pekan Olahraga & Seni FEB (PORSENI) disetujui dengan pagu Rp 12.000.000'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-10 11:30',
    user_name: 'Sarah Amalia',
    user_role: 'Bendahara Umum',
    action: 'Mencatat Pengeluaran Kas',
    details: 'Pengeluaran DP Publikasi Career Expo Rp 1.200.000'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-09 16:45',
    user_name: 'Kevin Sanjaya',
    user_role: 'Koordinator Divisi',
    action: 'Mengajukan Program Kerja Baru',
    details: 'Bakti Sosial & Edukasi UMKM diajukan dengan estimasi dana Rp 6.000.000'
  }
];

// Kalender Kerja & Master Schedule BEM FEB UKRIDA
export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    judul: 'Rapat Pleno BPH & Koordinator Divisi',
    tanggal: '2026-10-18',
    waktu: '16:00 - 18:30 WIB',
    lokasi: 'Ruang Rapat Gedung A Lt. 3 Kampus Tanjung Duren',
    kategori: 'Rapat & Evaluasi',
    pj: 'Sekretaris Umum',
    status: 'Mendatang',
    deskripsi: 'Evaluasi mingguan serapan kas, perizinan gedung untuk FEB Career Expo, dan kesiapan rundown LKMM-TD.'
  },
  {
    id: 'evt-2',
    judul: 'LKMM-TD Tingkat Dasar BEM FEB 2026',
    tanggal: '2026-10-28',
    waktu: '08:00 - 16:30 WIB',
    lokasi: 'Auditorium Utama Kampus 1 Tanjung Duren',
    kategori: 'Eksekusi Acara',
    pj: 'Arthur Reezan (BPH Inti)',
    status: 'Mendatang',
    deskripsi: 'Pelatihan kepemimpinan dan manajemen organisasi mahasiswa angkatan baru FEB UKRIDA.'
  },
  {
    id: 'evt-3',
    judul: 'Batas Akhir Penyerahan LPJ LKMM-TD ke Dekanat',
    tanggal: '2026-11-04',
    waktu: '17:00 WIB',
    lokasi: 'Ruang Dekanat FEB UKRIDA',
    kategori: 'Tenggat Administrasi',
    pj: 'Bendahara Pelaksana & BPH',
    status: 'Mendatang',
    deskripsi: 'Serah terima berkas fisik LPJ, lembar pengesahan, dan kuitansi asli bermaterai ke Biro Kemahasiswaan.'
  },
  {
    id: 'evt-4',
    judul: 'FEB Career Expo & Seminar Nasional 2026',
    tanggal: '2026-11-20',
    waktu: '09:00 - 17:00 WIB',
    lokasi: 'Hall Utama Kampus 1 Tanjung Duren',
    kategori: 'Eksekusi Acara',
    pj: 'Dimas Prasetyo (Divisi Karier)',
    status: 'Mendatang',
    deskripsi: 'Job fair akuntansi dan manajemen mengundang 25+ industri ternama dan alumni sukses FEB UKRIDA.'
  },
  {
    id: 'evt-5',
    judul: 'Bakti Sosial & Edukasi UMKM BEM FEB Peduli',
    tanggal: '2026-11-28',
    waktu: '08:30 - 14:00 WIB',
    lokasi: 'RPTRA Kebon Jeruk & Lingkungan Kampus 2',
    kategori: 'Pengabdian Masyarakat',
    pj: 'Kevin Sanjaya (Sosmas)',
    status: 'Mendatang',
    deskripsi: 'Edukasi literasi keuangan dan pembukuan sederhana bagi UMKM binaan sekitar kampus.'
  },
  {
    id: 'evt-6',
    judul: 'PORSENI FEB UKRIDA 2026',
    tanggal: '2026-12-05',
    waktu: '09:00 - 18:00 WIB',
    lokasi: 'Sport Hall Kampus 1 Tanjung Duren',
    kategori: 'Eksekusi Acara',
    pj: 'Siti Rahmawati (Minat & Bakat)',
    status: 'Mendatang',
    deskripsi: 'Pekan olahraga & seni: Futsal, Basket, Catur, E-Sports, dan Festival Musik Mahasiswa FEB.'
  }
];

// Arsip Template Dokumen Resmi BEM FEB UKRIDA
export const OFFICIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    judul: 'Template Proposal Kegiatan Resmi BEM FEB UKRIDA 2026',
    kategori: 'Proposal & LPJ',
    format: 'DOCX / PDF',
    ukuran: '2.4 MB',
    diperbarui: 'Oktober 2026',
    deskripsi: 'Format standar Dekanat FEB: Latar belakang, landasan nilai Kristiani LEAD, susunan panitia, rundown, dan RAB.',
    unduhanUrl: '#',
    syarat: ['Disetujui Ketua BEM', 'Disetujui Dosen Pembina LK', 'Diajukan H-21 sebelum acara']
  },
  {
    id: 'doc-2',
    judul: 'Format Baku Laporan Pertanggungjawaban (LPJ) Dekanat FEB',
    kategori: 'Proposal & LPJ',
    format: 'DOCX / XLSX',
    ukuran: '3.1 MB',
    diperbarui: 'Oktober 2026',
    deskripsi: 'Format baku laporan keuangan LPJ, penempelan nota asli bermaterai, dan lembar evaluasi ketercapaian kegiatan.',
    unduhanUrl: '#',
    syarat: ['Diserahkan maksimal H+14 setelah acara', 'Wajib melampirkan nota asli terverifikasi']
  },
  {
    id: 'doc-3',
    judul: 'Surat Permohonan Izin Tempat & Fasilitas Kampus',
    kategori: 'Surat Perizinan',
    format: 'DOCX',
    ukuran: '850 KB',
    diperbarui: 'September 2026',
    deskripsi: 'Template peminjaman Auditorium Gedung A Tanjung Duren, Hall Kebon Jeruk, sound system, proyektor, dan AC.',
    unduhanUrl: '#',
    syarat: ['Diajukan H-7 kerja ke Bagian Sarpras & Kemahasiswaan']
  },
  {
    id: 'doc-4',
    judul: 'Surat Dispensasi Kuliah & Praktikum Panitia',
    kategori: 'Surat Perizinan',
    format: 'DOCX',
    ukuran: '520 KB',
    diperbarui: 'September 2026',
    deskripsi: 'Template surat dispensasi izin kuliah bagi panitia kegiatan yang ditandatangani Wakil Dekan Bidang Kemahasiswaan.',
    unduhanUrl: '#',
    syarat: ['Melampirkan daftar NIM panitia lengkap', 'Diajukan H-3 sebelum pelaksanaan']
  },
  {
    id: 'doc-5',
    judul: 'Brand & Media Kit Resmi BEM FEB UKRIDA',
    kategori: 'Media & Branding',
    format: 'ZIP (SVG, PNG, AI)',
    ukuran: '14.5 MB',
    diperbarui: 'Agustus 2026',
    deskripsi: 'Paket logo resmi BEM FEB UKRIDA resolusi tinggi, pedoman warna (Navy & Amber), dan template feed Instagram Canva.',
    unduhanUrl: '#',
    syarat: ['Wajib dicantumkan di backdrop dan poster seluruh proker BEM']
  },
  {
    id: 'doc-6',
    judul: 'Form Pengajuan Dana Awal (Panjar Kerja) Kegiatan',
    kategori: 'Keuangan',
    format: 'DOCX / PDF',
    ukuran: '420 KB',
    diperbarui: 'Oktober 2026',
    deskripsi: 'Formulir permohonan penarikan uang muka kas ke Bendahara Umum sebelum belanja operasional dimulai.',
    unduhanUrl: '#',
    syarat: ['Proposal sudah disetujui Ketua BEM', 'Disertai estimasi rincian belanja']
  }
];

// Pelacak Isu & Advokasi Kampus Internal BEM FEB UKRIDA
export const INITIAL_ADVOKASI = [
  {
    id: 'adv-1',
    isu: 'Perbaikan Pendingin Ruangan (AC) & Proyektor Lab Akuntansi Gedung A',
    bidang: 'Sarana & Prasarana',
    pelapor: 'Mahasiswa Akuntansi Angkatan 2024',
    status: 'Audiensi Dekanat',
    urgensi: 'Tinggi',
    pj: 'Divisi Advokasi BEM',
    updateTerakhir: '10 Okt 2026',
    tindakLanjut: 'Nota dinas permohonan pemeliharaan telah diajukan ke Bagian Sarpras & Wakil Dekan II.'
  },
  {
    id: 'adv-2',
    isu: 'Dispensasi Perpanjangan Batas Pembayaran BPP/SPP Semester Ganjil',
    bidang: 'Finansial Mahasiswa',
    pelapor: 'Forum Aspirasi Mahasiswa FEB',
    status: 'Terselesaikan',
    urgensi: 'Tinggi',
    pj: 'Ketua Umum BPH',
    updateTerakhir: '08 Okt 2026',
    tindakLanjut: 'Dekanat menyetujui dispensasi cicilan SPP diperpanjang sampai 25 Oktober 2026 tanpa denda.'
  },
  {
    id: 'adv-3',
    isu: 'Optimalisasi Bandwidth Wi-Fi Kampus Tanjung Duren saat Ujian Online',
    bidang: 'Akademik & TI',
    pelapor: 'Mahasiswa Manajemen Angkatan 2023 & 2024',
    status: 'Kajian & Survei BEM',
    urgensi: 'Sedang',
    pj: 'Divisi Advokasi BEM',
    updateTerakhir: '09 Okt 2026',
    tindakLanjut: 'Survei kecepatan internet disebarkan ke 140 responden untuk bahan audiensi bersama Biro TI Ukrida.'
  },
  {
    id: 'adv-4',
    isu: 'Penyelarasan Kebijakan Konversi SKS Magang MBKM Mandiri',
    bidang: 'Akademik',
    pelapor: 'Mahasiswa FEB Semester 7',
    status: 'Isu Masuk',
    urgensi: 'Sedang',
    pj: 'Divisi Akademik & Karier',
    updateTerakhir: '05 Okt 2026',
    tindakLanjut: 'Mengumpulkan daftar perusahaan mitra magang mandiri yang belum terakomodasi dalam kurikulum prodi.'
  }
];

// Daftar Divisi Resmi BEM FEB UKRIDA
export const INITIAL_DIVISIONS = [
  {
    id: 'akademik',
    nama: 'Divisi Akademik & Pengembangan Karier',
    singkatan: 'Akad-Karier',
    koordinator: 'Dimas Prasetyo',
    kontakKoor: '6281234567890',
    deskripsi: 'Menangani FEB Career Expo, bimbingan akademik, webinar karier, dan kemitraan magang industri.',
    targetKpiRataRata: 80,
    warna: '#3b82f6'
  },
  {
    id: 'minat-bakat',
    nama: 'Divisi Minat & Bakat (Olahraga & Seni)',
    singkatan: 'Mikad',
    koordinator: 'Siti Rahmawati',
    kontakKoor: '6281234567891',
    deskripsi: 'Menyelenggarakan PORSENI FEB, kompetisi e-sports, klub basket, futsal, dan pertunjukan seni musik.',
    targetKpiRataRata: 80,
    warna: '#10b981'
  },
  {
    id: 'sosmas',
    nama: 'Divisi Sosial Masyarakat (Pengmas)',
    singkatan: 'Sosmas',
    koordinator: 'Kevin Sanjaya',
    kontakKoor: '6281234567892',
    deskripsi: 'Mengkoordinir bakti sosial, edukasi literasi keuangan UMKM binaan sekitar kampus, dan tanggap bencana.',
    targetKpiRataRata: 80,
    warna: '#f59e0b'
  },
  {
    id: 'humas',
    nama: 'Divisi Hubungan Masyarakat & Kominfo',
    singkatan: 'Humas-IT',
    koordinator: 'Amanda Putri',
    kontakKoor: '6281234567893',
    deskripsi: 'Pengelolaan sosial media resmi Instagram/LinkedIn BEM, dokumentasi multimedia, dan relasi eksternal.',
    targetKpiRataRata: 80,
    warna: '#8b5cf6'
  },
  {
    id: 'advokasi',
    nama: 'Divisi Advokasi & Kesejahteraan Mahasiswa',
    singkatan: 'Adkesma',
    koordinator: 'Jonathan Wijaya',
    kontakKoor: '6281234567894',
    deskripsi: 'Menghimpun aspirasi mahasiswa FEB, audiensi ke Dekanat, pengawalan kebijakan SPP, dan fasilitas kampus.',
    targetKpiRataRata: 80,
    warna: '#f43f5e'
  },
  {
    id: 'bph',
    nama: 'Badan Pengurus Harian (BPH Inti)',
    singkatan: 'BPH',
    koordinator: 'Arthur Reezan',
    kontakKoor: '6281234567895',
    deskripsi: 'Pengawasan kebijakan umum, persetujuan proposal anggaran dekanat, tata kelola kas, dan legalitas kepengurusan.',
    targetKpiRataRata: 85,
    warna: '#38bdf8'
  }
];

// Anggota & Evaluasi KPI per Divisi
export const INITIAL_DIVISION_MEMBERS = [
  // Divisi Akademik
  {
    id: 'mbr-1',
    divisiId: 'akademik',
    nama: 'Dimas Prasetyo',
    nim: '112023001',
    role: 'Koordinator Divisi',
    phone: '6281234567890',
    tugasSelesai: 6,
    totalTugas: 6,
    kehadiranRapat: 95,
    kpiScore: 96,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: null
  },
  {
    id: 'mbr-2',
    divisiId: 'akademik',
    nama: 'Raymond Hartono',
    nim: '112023045',
    role: 'Staf Divisi',
    phone: '6281234567801',
    tugasSelesai: 4,
    totalTugas: 5,
    kehadiranRapat: 90,
    kpiScore: 82,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: 'Konfirmasi Jadwal 5 Pembicara Seminar Nasional'
  },
  {
    id: 'mbr-3',
    divisiId: 'akademik',
    nama: 'Vania Stephanie',
    nim: '112024012',
    role: 'Staf Divisi',
    phone: '6281234567802',
    tugasSelesai: 1,
    totalTugas: 4,
    kehadiranRapat: 65,
    kpiScore: 48,
    statusKpi: 'Belum Memenuhi KPI',
    tugasPendingUtama: 'Penyusunan Formulir Registrasi Perusahaan Mitra Career Expo'
  },

  // Divisi Minat & Bakat
  {
    id: 'mbr-4',
    divisiId: 'minat-bakat',
    nama: 'Siti Rahmawati',
    nim: '122023015',
    role: 'Koordinator Divisi',
    phone: '6281234567891',
    tugasSelesai: 5,
    totalTugas: 5,
    kehadiranRapat: 100,
    kpiScore: 98,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: null
  },
  {
    id: 'mbr-5',
    divisiId: 'minat-bakat',
    nama: 'Bryan Pratama',
    nim: '122023088',
    role: 'Staf Divisi',
    phone: '6281234567803',
    tugasSelesai: 3,
    totalTugas: 4,
    kehadiranRapat: 85,
    kpiScore: 78,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: 'Penyusunan Bagan Turnamen Futsal & E-Sports'
  },
  {
    id: 'mbr-6',
    divisiId: 'minat-bakat',
    nama: 'Jessica Tan',
    nim: '122024031',
    role: 'Staf Divisi',
    phone: '6281234567804',
    tugasSelesai: 1,
    totalTugas: 3,
    kehadiranRapat: 50,
    kpiScore: 42,
    statusKpi: 'Belum Memenuhi KPI',
    tugasPendingUtama: 'Peminjaman Sound System & Lapangan PORSENI'
  },

  // Divisi Sosial Masyarakat
  {
    id: 'mbr-7',
    divisiId: 'sosmas',
    nama: 'Kevin Sanjaya',
    nim: '112023077',
    role: 'Koordinator Divisi',
    phone: '6281234567892',
    tugasSelesai: 4,
    totalTugas: 4,
    kehadiranRapat: 90,
    kpiScore: 90,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: null
  },
  {
    id: 'mbr-8',
    divisiId: 'sosmas',
    nama: 'Daniel Kusuma',
    nim: '112024090',
    role: 'Staf Divisi',
    phone: '6281234567805',
    tugasSelesai: 2,
    totalTugas: 4,
    kehadiranRapat: 60,
    kpiScore: 52,
    statusKpi: 'Belum Memenuhi KPI',
    tugasPendingUtama: 'Survei Lapangan & Izin RPTRA Kebon Jeruk Baksos UMKM'
  },

  // Divisi Humas & Kominfo
  {
    id: 'mbr-9',
    divisiId: 'humas',
    nama: 'Amanda Putri',
    nim: '122023062',
    role: 'Koordinator Divisi',
    phone: '6281234567893',
    tugasSelesai: 5,
    totalTugas: 5,
    kehadiranRapat: 95,
    kpiScore: 95,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: null
  },
  {
    id: 'mbr-10',
    divisiId: 'humas',
    nama: 'Michelle Angela',
    nim: '122024044',
    role: 'Staf Divisi',
    phone: '6281234567806',
    tugasSelesai: 4,
    totalTugas: 4,
    kehadiranRapat: 95,
    kpiScore: 92,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: null
  },

  // Divisi Advokasi
  {
    id: 'mbr-11',
    divisiId: 'advokasi',
    nama: 'Jonathan Wijaya',
    nim: '112023023',
    role: 'Koordinator Divisi',
    phone: '6281234567894',
    tugasSelesai: 4,
    totalTugas: 4,
    kehadiranRapat: 100,
    kpiScore: 95,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: null
  },
  {
    id: 'mbr-12',
    divisiId: 'advokasi',
    nama: 'Clara Patricia',
    nim: '112024018',
    role: 'Staf Divisi',
    phone: '6281234567807',
    tugasSelesai: 3,
    totalTugas: 4,
    kehadiranRapat: 80,
    kpiScore: 78,
    statusKpi: 'Memenuhi KPI',
    tugasPendingUtama: 'Penyusunan Kuesioner Evaluasi Fasilitas Lab Komputer'
  }
];

// Master Timeline Tugas Kerja Per Divisi & Kalender Anggota
export const INITIAL_DIVISION_TASKS = [
  {
    id: 'tsk-1',
    divisiId: 'akademik',
    divisiNama: 'Divisi Akademik & Karier',
    kategoriProker: 'Kemitraan & Sponsor',
    judul: 'Penyusunan Formulir Registrasi Perusahaan Mitra Career Expo',
    assignedTo: 'Vania Stephanie',
    assignedToNim: '112024012',
    role: 'Staf Divisi',
    deadline: '2026-10-18',
    prioritas: 'Tinggi',
    bobotKpi: 25,
    status: 'Sedang Berjalan',
    keterangan: 'Buat Google Form pendaftaran sponsorship 25 perusahaan mitra dan kirim draft ke Koordinator Dimas.',
    deliverableLink: 'https://docs.google.com/forms/d/career-expo-mitra',
    catatanKoor: 'Harap pastikan field paket sponsorship Platinum & Gold sudah menyertakan benefit logo photowall.',
    subtasks: [
      { id: 'st-1-1', text: 'Buat formulir registrasi via Google Forms dengan field paket booth', completed: true },
      { id: 'st-1-2', text: 'Penyusunan term sheet proposal kemitraan sponsorship 2026', completed: true },
      { id: 'st-1-3', text: 'Validasi draft form bersama Koordinator Dimas', completed: false },
      { id: 'st-1-4', text: 'Broadcast link form ke 25 kontak HRD mitra perusahaan', completed: false }
    ]
  },
  {
    id: 'tsk-2',
    divisiId: 'akademik',
    divisiNama: 'Divisi Akademik & Karier',
    kategoriProker: 'Acara & Narasumber',
    judul: 'Konfirmasi Jadwal 5 Pembicara Seminar Nasional Karier',
    assignedTo: 'Raymond Hartono',
    assignedToNim: '112023045',
    role: 'Staf Divisi',
    deadline: '2026-10-22',
    prioritas: 'Tinggi',
    bobotKpi: 25,
    status: 'Sedang Berjalan',
    keterangan: 'Follow up konfirmasi via email dan WA untuk 5 alumni FEB pembicara seminar persiapan dunia kerja.',
    deliverableLink: 'https://drive.google.com/drive/folders/narasumber-feb-2026',
    catatanKoor: '3 dari 5 pembicara sudah konfirmasi hadir fisik di Auditorium Tanjung Duren.',
    subtasks: [
      { id: 'st-2-1', text: 'Penyusunan daftar kurasi 5 alumni sukses FEB UKRIDA', completed: true },
      { id: 'st-2-2', text: 'Pengiriman surat undangan resmi bertanda tangan Ketua BEM', completed: true },
      { id: 'st-2-3', text: 'Konfirmasi ketersediaan tanggal & pengumpulan CV narasumber', completed: true },
      { id: 'st-2-4', text: 'Briefing teknis materi slide & gladi bersih rundown', completed: false }
    ]
  },
  {
    id: 'tsk-3',
    divisiId: 'akademik',
    divisiNama: 'Divisi Akademik & Karier',
    kategoriProker: 'Publikasi & Desain',
    judul: 'Penyusunan Booklet Rundown & Tata Tertib Peserta Career Expo',
    assignedTo: 'Dimas Prasetyo',
    assignedToNim: '112023001',
    role: 'Koordinator Divisi',
    deadline: '2026-10-25',
    prioritas: 'Sedang',
    bobotKpi: 20,
    status: 'Menunggu Review Koor',
    keterangan: 'Review panduan format PDF booklet digital untuk pengunjung job fair FEB.',
    deliverableLink: 'https://canva.com/design/booklet-career-expo-2026',
    catatanKoor: 'Draft siap diajukan ke Wakil Dekan III untuk persetujuan final tata tertib.',
    subtasks: [
      { id: 'st-3-1', text: 'Desain layout cover booklet digital Career Expo ukuran A5', completed: true },
      { id: 'st-3-2', text: 'Penyusunan peta denah 30 booth di Auditorium Gedung A', completed: true },
      { id: 'st-3-3', text: 'Integrasi barcode registrasi masuk pengunjung', completed: true }
    ]
  },
  {
    id: 'tsk-4',
    divisiId: 'minat-bakat',
    divisiNama: 'Divisi Minat & Bakat (Mikad)',
    kategoriProker: 'Logistik & Sarpras',
    judul: 'Peminjaman Sound System & Lapangan PORSENI ke Sarpras',
    assignedTo: 'Jessica Tan',
    assignedToNim: '122024031',
    role: 'Staf Divisi',
    deadline: '2026-10-19',
    prioritas: 'Tinggi',
    bobotKpi: 30,
    status: 'Belum Selesai',
    keterangan: 'Serahkan surat permohonan peminjaman Sport Hall Kampus 1 Tanjung Duren ke Kasubag Rumah Tangga.',
    deliverableLink: '',
    catatanKoor: 'Mendesak: Lapangan harus di-booking sebelum tanggal 20 agar tidak bentrok dengan UKM lain.',
    subtasks: [
      { id: 'st-4-1', text: 'Cetak surat izin peminjaman Sport Hall dari Dekanat', completed: true },
      { id: 'st-4-2', text: 'Temui Kasubag Rumah Tangga Kampus Tanjung Duren', completed: false },
      { id: 'st-4-3', text: 'Cek kondisi sound system 4 channel & mic wireless', completed: false },
      { id: 'st-4-4', text: 'Simpan tanda terima peminjaman tempat di binder sekretariat', completed: false }
    ]
  },
  {
    id: 'tsk-5',
    divisiId: 'minat-bakat',
    divisiNama: 'Divisi Minat & Bakat (Mikad)',
    kategoriProker: 'Operasional Pertandingan',
    judul: 'Penyusunan Bagan Turnamen Futsal, Basket, & E-Sports',
    assignedTo: 'Bryan Pratama',
    assignedToNim: '122023088',
    role: 'Staf Divisi',
    deadline: '2026-10-24',
    prioritas: 'Sedang',
    bobotKpi: 25,
    status: 'Sedang Berjalan',
    keterangan: 'Finalisasi skema pertandingan sistem gugur untuk 16 tim perwakilan kelas FEB.',
    deliverableLink: 'https://challonge.com/porseni-feb-2026',
    catatanKoor: 'Bagan futsal & basket sudah disetujui perwakilan kapten kelas.',
    subtasks: [
      { id: 'st-5-1', text: 'Rekapitulasi 16 tim peserta futsal per angkatan', completed: true },
      { id: 'st-5-2', text: 'Drafting bagan sistem gugur turnamen', completed: true },
      { id: 'st-5-3', text: 'Briefing wasit mahasiswa & jadwal pertandingan', completed: false }
    ]
  },
  {
    id: 'tsk-6',
    divisiId: 'sosmas',
    divisiNama: 'Divisi Sosial Masyarakat (Sosmas)',
    kategoriProker: 'Pengabdian Masyarakat',
    judul: 'Survei Lapangan & Izin RPTRA Kebon Jeruk Baksos UMKM',
    assignedTo: 'Daniel Kusuma',
    assignedToNim: '112024090',
    role: 'Staf Divisi',
    deadline: '2026-10-20',
    prioritas: 'Tinggi',
    bobotKpi: 35,
    status: 'Belum Selesai',
    keterangan: 'Temui pengelola RPTRA dekat Kampus 2 Kebon Jeruk untuk pemetaan 20 UMKM sasaran pelatihan kas.',
    deliverableLink: '',
    catatanKoor: 'Pastikan surat pengantar dari Dekan FEB sudah dibawa saat survei.',
    subtasks: [
      { id: 'st-6-1', text: 'Kunjungan koordinasi ke pengelola RPTRA Kebon Jeruk', completed: true },
      { id: 'st-6-2', text: 'Pendataan 20 UMKM binaan peserta pelatihan kas mini', completed: false },
      { id: 'st-6-3', text: 'Penyusunan modul sederhana pembukuan digital', completed: false }
    ]
  },
  {
    id: 'tsk-7',
    divisiId: 'humas',
    divisiNama: 'Divisi Hubungan Masyarakat & Kominfo',
    kategoriProker: 'Publikasi & Desain',
    judul: 'Publikasi Poster Digital & Teaser Feed Instagram BEM',
    assignedTo: 'Michelle Angela',
    assignedToNim: '122024044',
    role: 'Staf Divisi',
    deadline: '2026-10-17',
    prioritas: 'Sedang',
    bobotKpi: 25,
    status: 'Selesai',
    keterangan: 'Upload micro-content edukasi seputar persiapan LKMM-TD dan reminder proker.',
    deliverableLink: 'https://instagram.com/p/teaser-lkmm-2026',
    catatanKoor: 'Terverifikasi selesai. Engagement mencapai 340+ likes dan 52 shares.',
    subtasks: [
      { id: 'st-7-1', text: 'Desain feed teaser 3 slide di Canva brand kit resmi', completed: true },
      { id: 'st-7-2', text: 'Penyusunan copywriting caption ber-hashtag resmi', completed: true },
      { id: 'st-7-3', text: 'Publish ke feed Instagram @bemfeb_ukrida & broadcast grup angkatan', completed: true }
    ]
  },
  {
    id: 'tsk-8',
    divisiId: 'advokasi',
    divisiNama: 'Divisi Advokasi & Kesejahteraan Mahasiswa',
    kategoriProker: 'Advokasi & Riset',
    judul: 'Penyusunan Kuesioner Evaluasi Fasilitas Lab Komputer Akuntansi',
    assignedTo: 'Clara Patricia',
    assignedToNim: '112024018',
    role: 'Staf Divisi',
    deadline: '2026-10-21',
    prioritas: 'Tinggi',
    bobotKpi: 25,
    status: 'Sedang Berjalan',
    keterangan: 'Sebarkan form aspirasi fasilitas ke mahasiswa prodi Akuntansi untuk bahan audiensi Dekanat.',
    deliverableLink: 'https://docs.google.com/forms/d/aspirasi-lab-feb',
    catatanKoor: 'Sudah terkumpul 85 responden per tanggal 10 Oktober.',
    subtasks: [
      { id: 'st-8-1', text: 'Drafting 10 butir pertanyaan survei fasilitas Lab Komputer', completed: true },
      { id: 'st-8-2', text: 'Sebarkan Google Forms ke grup angkatan Akuntansi', completed: true },
      { id: 'st-8-3', text: 'Rekapitulasi 100 respon mahasiswa untuk bahan nota dinas Dekanat', completed: false }
    ]
  }
];

// Helper untuk membaca konfigurasi Supabase (dari env atau localStorage)
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('LK_FEB_SUPABASE_URL');
  const localKey = localStorage.getItem('LK_FEB_SUPABASE_KEY');

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';

  return { url, key, isConfigured: Boolean(url && key && url.includes('supabase.co')) };
}

export function saveSupabaseCredentials(url, key) {
  if (url && key) {
    localStorage.setItem('LK_FEB_SUPABASE_URL', url.trim());
    localStorage.setItem('LK_FEB_SUPABASE_KEY', key.trim());
  } else {
    localStorage.removeItem('LK_FEB_SUPABASE_URL');
    localStorage.removeItem('LK_FEB_SUPABASE_KEY');
  }
}

// Inisialisasi Supabase Client jika kredensial ada
let supabaseClient = null;
export function getSupabase() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (isConfigured) {
    if (!supabaseClient) {
      supabaseClient = createClient(url, key);
    }
    return supabaseClient;
  }
  return null;
}

// Data Service Layer (Mendukung Supabase Cloud & Local Offline Storage)
export const dataService = {
  // 1. Program Kerja
  async getProker() {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('proker')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch error, fallback to local:', err);
      }
    }
    
    // Fallback local
    const saved = localStorage.getItem('LK_FEB_PROKER');
    if (!saved) {
      localStorage.setItem('LK_FEB_PROKER', JSON.stringify(INITIAL_PROKER));
      return INITIAL_PROKER;
    }
    return JSON.parse(saved);
  },

  async addProker(prokerItem, user) {
    const newItem = {
      ...prokerItem,
      id: 'pk-' + Date.now(),
      created_at: new Date().toISOString(),
      realisasi_anggaran: 0,
      status: 'Diajukan',
      diajukan_oleh: user.name,
      disetujui_oleh: null
    };

    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client.from('proker').insert([newItem]).select();
        if (!error && data) {
          await this.addLog(user, 'Mengajukan Program Kerja Baru', `${newItem.nama_proker} (Pagu: Rp ${Number(newItem.pagu_anggaran).toLocaleString('id-ID')})`);
          return data[0];
        }
      } catch (err) {
        console.warn('Supabase insert proker error:', err);
      }
    }

    // Local storage
    const list = await this.getProker();
    const updated = [newItem, ...list];
    localStorage.setItem('LK_FEB_PROKER', JSON.stringify(updated));
    await this.addLog(user, 'Mengajukan Program Kerja Baru', `${newItem.nama_proker} (Pagu: Rp ${Number(newItem.pagu_anggaran).toLocaleString('id-ID')})`);
    return newItem;
  },

  async updateProkerStatus(prokerId, newStatus, user) {
    const client = getSupabase();
    if (client) {
      try {
        await client
          .from('proker')
          .update({ status: newStatus, disetujui_oleh: newStatus === 'Disetujui' ? user.name : null })
          .eq('id', prokerId);
      } catch (err) {
        console.warn('Supabase update proker error:', err);
      }
    }

    const list = await this.getProker();
    const updated = list.map(item => {
      if (item.id === prokerId) {
        return {
          ...item,
          status: newStatus,
          disetujui_oleh: newStatus === 'Disetujui' ? user.name : item.disetujui_oleh
        };
      }
      return item;
    });
    localStorage.setItem('LK_FEB_PROKER', JSON.stringify(updated));
    await this.addLog(user, `Mengubah Status Proker`, `Proker diubah menjadi "${newStatus}"`);
    return updated;
  },

  // 2. Transaksi Kas
  async getTransactions() {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('transaksi')
          .select('*')
          .order('tanggal', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch transaksi error:', err);
      }
    }

    const saved = localStorage.getItem('LK_FEB_TRANSAKSI');
    if (!saved) {
      localStorage.setItem('LK_FEB_TRANSAKSI', JSON.stringify(INITIAL_TRANSAKSI));
      return INITIAL_TRANSAKSI;
    }
    return JSON.parse(saved);
  },

  async addTransaction(txItem, user) {
    const newItem = {
      ...txItem,
      id: 'tx-' + Date.now(),
      created_at: new Date().toISOString(),
      dicatat_oleh: user.name,
      status_verifikasi: 'Terverifikasi'
    };

    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client.from('transaksi').insert([newItem]).select();
        if (!error && data) {
          // Update realisasi proker bila ada
          if (newItem.tipe === 'Pengeluaran' && newItem.proker_id && newItem.proker_id !== 'all') {
            await this.updateProkerRealisasi(newItem.proker_id, Number(newItem.jumlah));
          }
          await this.addLog(user, `Mencatat ${newItem.tipe} Kas`, `${newItem.kategori}: Rp ${Number(newItem.jumlah).toLocaleString('id-ID')} (${newItem.keterangan})`);
          return data[0];
        }
      } catch (err) {
        console.warn('Supabase insert transaction error:', err);
      }
    }

    const list = await this.getTransactions();
    const updated = [newItem, ...list];
    localStorage.setItem('LK_FEB_TRANSAKSI', JSON.stringify(updated));

    if (newItem.tipe === 'Pengeluaran' && newItem.proker_id && newItem.proker_id !== 'all') {
      await this.updateProkerRealisasi(newItem.proker_id, Number(newItem.jumlah));
    }

    await this.addLog(user, `Mencatat ${newItem.tipe} Kas`, `${newItem.kategori}: Rp ${Number(newItem.jumlah).toLocaleString('id-ID')} (${newItem.keterangan})`);
    return newItem;
  },

  async updateProkerRealisasi(prokerId, amount) {
    const prokerList = await this.getProker();
    const updated = prokerList.map(p => {
      if (p.id === prokerId) {
        return {
          ...p,
          realisasi_anggaran: Number(p.realisasi_anggaran || 0) + amount
        };
      }
      return p;
    });
    localStorage.setItem('LK_FEB_PROKER', JSON.stringify(updated));
  },

  // 3. Activity Logs
  async getActivityLogs() {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch logs error:', err);
      }
    }

    const saved = localStorage.getItem('LK_FEB_LOGS');
    if (!saved) {
      localStorage.setItem('LK_FEB_LOGS', JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(saved);
  },

  async addLog(user, action, details) {
    const now = new Date();
    const timestamp = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp,
      user_name: user.name,
      user_role: user.role,
      action,
      details
    };

    const client = getSupabase();
    if (client) {
      try {
        await client.from('activity_logs').insert([{
          user_name: user.name,
          user_role: user.role,
          action,
          details
        }]);
      } catch (e) {}
    }

    const currentLogs = await this.getActivityLogs();
    const updated = [newLog, ...currentLogs.slice(0, 25)];
    localStorage.setItem('LK_FEB_LOGS', JSON.stringify(updated));
  },

  // 4. Kalender & Master Schedule BEM FEB
  async getEvents() {
    const saved = localStorage.getItem('BEM_FEB_EVENTS');
    if (!saved) {
      localStorage.setItem('BEM_FEB_EVENTS', JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(saved);
  },

  async addEvent(eventItem, user) {
    const newEvent = {
      ...eventItem,
      id: 'evt-' + Date.now(),
      status: eventItem.status || 'Mendatang'
    };
    const current = await this.getEvents();
    const updated = [newEvent, ...current];
    localStorage.setItem('BEM_FEB_EVENTS', JSON.stringify(updated));
    await this.addLog(user, 'Menambah Agenda Kalender BEM', `${newEvent.judul} (${newEvent.tanggal})`);
    return newEvent;
  },

  // 5. Advokasi & Isu Kampus BEM FEB
  async getAdvokasi() {
    const saved = localStorage.getItem('BEM_FEB_ADVOKASI');
    if (!saved) {
      localStorage.setItem('BEM_FEB_ADVOKASI', JSON.stringify(INITIAL_ADVOKASI));
      return INITIAL_ADVOKASI;
    }
    return JSON.parse(saved);
  },

  async updateAdvokasiStatus(id, newStatus, catatanBaru, user) {
    const current = await this.getAdvokasi();
    const item = current.find((a) => a.id === id);
    const updated = current.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          updateTerakhir: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          tindakLanjut: catatanBaru || a.tindakLanjut
        };
      }
      return a;
    });
    localStorage.setItem('BEM_FEB_ADVOKASI', JSON.stringify(updated));
    if (item) {
      await this.addLog(user, 'Update Status Advokasi Kampus', `${item.isu} ➔ ${newStatus}`);
    }
    return updated;
  },

  async addAdvokasi(advokasiItem, user) {
    const newItem = {
      ...advokasiItem,
      id: 'adv-' + Date.now(),
      status: 'Isu Masuk',
      updateTerakhir: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const current = await this.getAdvokasi();
    const updated = [newItem, ...current];
    localStorage.setItem('BEM_FEB_ADVOKASI', JSON.stringify(updated));
    await this.addLog(user, 'Mencatat Isu Advokasi Baru', `${newItem.isu} (${newItem.bidang})`);
    return newItem;
  },

  // 6. Template Dokumen Resmi
  getDocuments() {
    return OFFICIAL_DOCUMENTS;
  },

  // 7. Workspace Divisi & Evaluasi KPI
  async getDivisions() {
    return INITIAL_DIVISIONS;
  },

  async getDivisionMembers(divisiId = null) {
    const saved = localStorage.getItem('BEM_FEB_MEMBERS');
    let members = INITIAL_DIVISION_MEMBERS;
    if (saved) {
      members = JSON.parse(saved);
    } else {
      localStorage.setItem('BEM_FEB_MEMBERS', JSON.stringify(INITIAL_DIVISION_MEMBERS));
    }
    if (divisiId && divisiId !== 'all') {
      return members.filter((m) => m.divisiId === divisiId);
    }
    return members;
  },

  async getDivisionTasks(divisiId = null) {
    const saved = localStorage.getItem('BEM_FEB_TASKS');
    let tasks = INITIAL_DIVISION_TASKS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Jika data lama belum ada subtasks, refresh dengan INITIAL_DIVISION_TASKS yang kaya data
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].subtasks) {
          tasks = parsed;
        } else {
          tasks = INITIAL_DIVISION_TASKS;
          localStorage.setItem('BEM_FEB_TASKS', JSON.stringify(INITIAL_DIVISION_TASKS));
        }
      } catch {
        tasks = INITIAL_DIVISION_TASKS;
      }
    } else {
      localStorage.setItem('BEM_FEB_TASKS', JSON.stringify(INITIAL_DIVISION_TASKS));
    }
    if (divisiId && divisiId !== 'all') {
      return tasks.filter((t) => t.divisiId === divisiId);
    }
    return tasks;
  },

  async addDivisionTask(taskItem, user) {
    const newTask = {
      ...taskItem,
      id: 'tsk-' + Date.now(),
      status: taskItem.status || 'Belum Selesai',
      subtasks: taskItem.subtasks || [
        { id: 'st-' + Date.now() + '-1', text: 'Analisis kebutuhan & koordinasi awal', completed: false },
        { id: 'st-' + Date.now() + '-2', text: 'Eksekusi pengerjaan tugas', completed: false },
        { id: 'st-' + Date.now() + '-3', text: 'Penyusunan laporan / submit bukti ke Koor', completed: false }
      ]
    };
    const current = await this.getDivisionTasks();
    const updated = [newTask, ...current];
    localStorage.setItem('BEM_FEB_TASKS', JSON.stringify(updated));
    await this.addLog(user, 'Menugaskan Tugas Divisi Baru', `${newTask.judul} ➔ ${newTask.assignedTo} (${newTask.divisiNama})`);
    return newTask;
  },

  async updateDivisionTaskStatus(taskId, newStatus, user) {
    const current = await this.getDivisionTasks();
    let targetTask = null;
    const updated = current.map((t) => {
      if (t.id === taskId) {
        targetTask = t;
        return { ...t, status: newStatus };
      }
      return t;
    });
    localStorage.setItem('BEM_FEB_TASKS', JSON.stringify(updated));

    // Update KPI member if completed
    if (targetTask) {
      const members = await this.getDivisionMembers();
      const updatedMembers = members.map((m) => {
        if (m.nama === targetTask.assignedTo) {
          const completedCount = updated.filter((x) => x.assignedTo === m.nama && x.status === 'Selesai').length;
          const totalCount = updated.filter((x) => x.assignedTo === m.nama).length || 1;
          const newScore = Math.round((completedCount / totalCount) * 100);
          return {
            ...m,
            tugasSelesai: completedCount,
            totalTugas: totalCount,
            kpiScore: newScore,
            statusKpi: newScore >= 75 ? 'Memenuhi KPI' : 'Belum Memenuhi KPI'
          };
        }
        return m;
      });
      localStorage.setItem('BEM_FEB_MEMBERS', JSON.stringify(updatedMembers));
      await this.addLog(user, 'Update Status Tugas Divisi', `${targetTask.judul} (${targetTask.assignedTo}) ➔ ${newStatus}`);
    }
    return updated;
  },

  async updateDivisionTaskSubtask(taskId, subtaskId, completed, user) {
    const current = await this.getDivisionTasks();
    let updatedTask = null;
    const updated = current.map((t) => {
      if (t.id === taskId) {
        const subtasks = (t.subtasks || []).map((st) => (st.id === subtaskId ? { ...st, completed } : st));
        const allDone = subtasks.length > 0 && subtasks.every((st) => st.completed);
        let newStatus = t.status;
        if (allDone && t.status === 'Belum Selesai') {
          newStatus = 'Menunggu Review Koor';
        } else if (!allDone && t.status === 'Belum Selesai') {
          newStatus = 'Sedang Berjalan';
        }
        updatedTask = { ...t, subtasks, status: newStatus };
        return updatedTask;
      }
      return t;
    });
    localStorage.setItem('BEM_FEB_TASKS', JSON.stringify(updated));
    if (updatedTask) {
      await this.addLog(user, 'Update Subtugas Divisi', `${updatedTask.judul} (${completed ? 'Selesai' : 'Belum'})`);
    }
    return updated;
  },

  async updateDivisionTaskFull(taskId, updatedFields, user) {
    const current = await this.getDivisionTasks();
    let targetTask = null;
    const updated = current.map((t) => {
      if (t.id === taskId) {
        targetTask = { ...t, ...updatedFields };
        return targetTask;
      }
      return t;
    });
    localStorage.setItem('BEM_FEB_TASKS', JSON.stringify(updated));

    if (targetTask && updatedFields.status) {
      const members = await this.getDivisionMembers();
      const updatedMembers = members.map((m) => {
        if (m.nama === targetTask.assignedTo) {
          const completedCount = updated.filter((x) => x.assignedTo === m.nama && x.status === 'Selesai').length;
          const totalCount = updated.filter((x) => x.assignedTo === m.nama).length || 1;
          const newScore = Math.round((completedCount / totalCount) * 100);
          return {
            ...m,
            tugasSelesai: completedCount,
            totalTugas: totalCount,
            kpiScore: newScore,
            statusKpi: newScore >= 75 ? 'Memenuhi KPI' : 'Belum Memenuhi KPI'
          };
        }
        return m;
      });
      localStorage.setItem('BEM_FEB_MEMBERS', JSON.stringify(updatedMembers));
      await this.addLog(user, 'Modifikasi Detail Tugas Divisi', `${targetTask.judul} ➔ Status: ${targetTask.status}`);
    }
    return updated;
  },

  async sendMemberReminder(member, taskTitle, user) {
    await this.addLog(
      user,
      'Mengirimkan Reminder KPI Tugas',
      `Reminder dikirim ke ${member.nama} (${member.role}) untuk tugas: "${taskTitle || 'Tugas Pending Divisi'}"`
    );

    const waText = encodeURIComponent(
      `*REMINDER TUGAS & EVALUASI KPI BEM FEB UKRIDA*\n\nHalo ${member.nama},\nKami dari Koordinator / BPH BEM FEB UKRIDA ingin mengingatkan terkait tugas divisi:\n📌 *Tugas*: ${taskTitle || 'Penyelesaian target proker divisi'}\n📊 *Status KPI*: Saat ini capaian Anda ${member.kpiScore}% (${member.statusKpi})\n\nMohon segera menyelesaikan dan memperbarui progres tugas Anda di Portal BEM FEB UKRIDA. Terima kasih atas dedikasi dan semangat *Lead to Impact*!\n\n_BEM FEB UKRIDA_`
    );

    return `https://wa.me/${member.phone}?text=${waText}`;
  }
};


