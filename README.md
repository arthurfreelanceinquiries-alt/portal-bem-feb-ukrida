# 🏛️ Portal Operasional & Manajemen BEM FEB UKRIDA
> **Badan Eksekutif Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Kristen Krida Wacana**  
> *"Lead to Impact"* • Periode 2026/2027

Sistem portal manajemen terpadu internal pengurus BEM FEB UKRIDA untuk tata kelola program kerja, penugasan divisi berbasis peran (*role-based*), kalender kerja terpusat, pengawalan advokasi mahasiswa, administrasi resmi Dekanat, dan transparansi keuangan kas.

---

## 🌟 Fitur Utama

### 1. 💼 Workspace Divisi & Pembagian Tugas Detail
- **Selector 6 Divisi BEM FEB**:
  - Divisi Akademik & Pengembangan Karier (*FEB Career Expo, Seminar Karier*)
  - Divisi Minat & Bakat (*PORSENI FEB, Turnamen Olahraga & E-Sports*)
  - Divisi Sosial Masyarakat (*Bakti Sosial UMKM Kampus*)
  - Divisi Humas & Kominfo (*Publikasi Instagram & Media Kit*)
  - Divisi Advokasi & Kesejahteraan Mahasiswa (*Pengawalan Isu & Fasilitas*)
  - Badan Pengurus Harian / BPH Inti (*Pengawasan & Anggaran*)
- **3 Mode Tampilan Tugas (View Switcher)**:
  - 🗂️ **Mode Kartu Grid (Kanban)**: Dilengkapi lencana prioritas, bobot poin KPI, dan **interactive sub-tasks checklist** yang dapat diceklis langsung dari kartu.
  - 📅 **Mode Kalender Interaktif (Oktober 2026)**: Menandai tanggal deadline dengan dot indikator warna (*Tinggi, Review Koor, Selesai*). Filter tugas instan berdasarkan tanggal yang diklik.
  - 📊 **Mode Tabel Matriks (Data-Dense)**: Tampilan padat eksekutif untuk evaluasi cepat seluruh tugas oleh Koordinator & BPH.
- **Monitoring Capaian KPI Anggota**:
  - Skor KPI otomatis (0-100%) berdasarkan penyelesaian tugas dan kehadiran rapat (standar Dekanat minimal 75%).
  - Tombol **"Ingatkan KPI via WhatsApp"** otomatis dengan template personalisasi resmi ke kontak staf.

### 2. 📅 Kalender Kerja & Master Schedule BEM FEB
- Kalender master timeline kegiatan: rapat pleno, tenggat pengumpulan proposal & LPJ ke Dekanat, dan hari-H pelaksanaan acara.
- Filter kategori agenda: *Semua*, *Rapat & Evaluasi*, *Eksekusi Acara*, *Tenggat Administrasi*, *Pengabdian Masyarakat*.
- Penanda lokasi kampus (*Auditorium Tanjung Duren / Ruang Seminar Kebon Jeruk*).

### 3. 📂 Pusat Dokumen Resmi & Template Dekanat (Resource Hub)
- Standar dokumen baku siap pakai:
  - Format Proposal Resmi Dekanat FEB UKRIDA (Nilai LEAD & RAB)
  - Format Baku LPJ (Laporan Pertanggungjawaban) Kegiatan
  - Surat Permohonan Izin Tempat & Fasilitas Kampus
  - Surat Dispensasi Kuliah & Praktikum Panitia
  - Official Brand Kit BEM FEB (Logo Vector, Hex Color, Feed Canva)
  - Formulir Pengajuan Dana Awal (Panjar Kerja)

### 4. 📢 Pelacak Isu & Advokasi Mahasiswa FEB
- Dashboard alur penyelesaian advokasi kampus: `Isu Masuk` ➔ `Kajian & Survei BEM` ➔ `Audiensi Dekanat` ➔ `Terselesaikan`.
- Monitoring fasilitas sarpras, perpanjangan cicilan SPP, dan konversi SKS magang MBKM.

### 5. 💰 Manajemen Keuangan & Pagu Anggaran Kas
- Pencatatan pemasukan & pengeluaran kas dengan filter kategori.
- Viewer kuitansi/nota digital.
- Fitur ekspor laporan pembukuan ke format CSV.

---

## 🎨 Arsitektur Desain & UI/UX

Aplikasi ini dibangun dengan mengadopsi standar **UI/UX Pro Max** dan estetika institusional:
- **Gaya Visual**: *Corporate Civic & Executive Bento-Grid* dengan palet warna Navy UKRIDA (`#0B192C` / `#1E3E62`), Aksen Emas Amber (`#D4AF37` / `#F1C40F`), dan Slate Neutral (`#F8FAFC`).
- **Aksesibilitas WCAG 2.1**: Rasio kontras teks di atas 4.5:1, keyboard navigable, dan feedback status interaktif.
- **Tipografi**: Heading *Plus Jakarta Sans*, Body *Inter*, dan Monospace *JetBrains Mono* untuk metrik numerik.

---

## 🚀 Panduan Menjalankan Aplikasi

### Cara 1: Menggunakan File Batch (Rekomendasi untuk Windows)
Cukup klik ganda file berikut di folder root:
```bash
JALANKAN_PORTAL_BEM_FEB.bat
```
File ini akan otomatis menyalakan server lokal dan membuka browser ke `http://localhost:5173/`.

### Cara 2: Menjalankan via Terminal
```bash
# 1. Install dependensi
npm install

# 2. Jalankan server lokal
npm run dev

# 3. Build untuk produksi
npm run build
```

---

## ☁️ Konfigurasi Cloud Supabase (Opsional)

Aplikasi ini mendukung mode **Offline/Local-First** (`localStorage`) serta mode **Cloud Sync** multi-perangkat via Supabase.
Untuk mengaktifkan cloud:
1. Jalankan query SQL di file `supabase_schema.sql` pada SQL Editor Supabase.
2. Masukkan URL dan Anon Key melalui modal **Status Cloud** di kanan atas header portal.

---

*Dikembangkan untuk kemajuan fungsionaris Badan Eksekutif Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Kristen Krida Wacana (UKRIDA).*
