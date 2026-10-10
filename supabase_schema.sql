-- =======================================================
-- SKEMA DATABASE CLOUD SUPABASE UNTUK PORTAL LK FEB
-- Silakan jalankan script SQL ini di Supabase SQL Editor
-- =======================================================

-- 1. Tabel Program Kerja (Proker LK FEB)
CREATE TABLE IF NOT EXISTS proker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nama_proker TEXT NOT NULL,
  departemen TEXT NOT NULL,
  pj TEXT NOT NULL,
  target_selesai DATE,
  pagu_anggaran NUMERIC DEFAULT 0 NOT NULL,
  realisasi_anggaran NUMERIC DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'Diajukan' NOT NULL, -- 'Diajukan', 'Disetujui', 'Berjalan', 'Selesai', 'Ditolak'
  deskripsi TEXT,
  diajukan_oleh TEXT,
  disetujui_oleh TEXT
);

-- 2. Tabel Transaksi Buku Kas & Keuangan (LK)
CREATE TABLE IF NOT EXISTS transaksi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE NOT NULL,
  tipe TEXT NOT NULL, -- 'Pemasukan' atau 'Pengeluaran'
  kategori TEXT NOT NULL, -- 'Dana Dekanat', 'Iuran Mahasiswa', 'Sponsorship', 'Konsumsi', 'Logistik', 'Publikasi', dll
  jumlah NUMERIC NOT NULL,
  keterangan TEXT NOT NULL,
  proker_id UUID REFERENCES proker(id) ON DELETE SET NULL,
  nama_proker TEXT,
  dicatat_oleh TEXT NOT NULL,
  bukti_nota_url TEXT,
  status_verifikasi TEXT DEFAULT 'Terverifikasi' NOT NULL -- 'Terverifikasi', 'Menunggu Review'
);

-- 3. Tabel Riwayat Aktivitas & Approval Log
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT
);

-- 4. Aktifkan Row Level Security (RLS) & Kebijakan Publik untuk Memulai
ALTER TABLE proker ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read proker" ON proker FOR SELECT USING (true);
CREATE POLICY "Allow public insert proker" ON proker FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update proker" ON proker FOR UPDATE USING (true);

CREATE POLICY "Allow public read transaksi" ON transaksi FOR SELECT USING (true);
CREATE POLICY "Allow public insert transaksi" ON transaksi FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transaksi" ON transaksi FOR UPDATE USING (true);

CREATE POLICY "Allow public read activity_logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- 5. Data Awal Contoh (Seed Data FEB)
INSERT INTO proker (nama_proker, departemen, pj, target_selesai, pagu_anggaran, realisasi_anggaran, status, deskripsi, diajukan_oleh)
VALUES 
  ('FEB Career Expo & Seminar 2026', 'Departemen Akademik & Karier', 'Dimas Prasetyo', '2026-11-20', 15000000, 3200000, 'Berjalan', 'Job fair dan seminar nasional persiapan karier lulusan Fakultas Ekonomi & Bisnis.', 'Dimas Prasetyo'),
  ('Pekan Olahraga & Seni FEB (PORSENI)', 'Departemen Minat & Bakat', 'Siti Rahmawati', '2026-12-05', 12000000, 0, 'Disetujui', 'Kompetisi futsal, basket, catur, e-sports, dan musik antar angkatan dan program studi.', 'Siti Rahmawati'),
  ('LKMM-TD Latihan Kepemimpinan Manajemen Mahasiswa', 'BPH Inti', 'Arthur Reezan', '2026-10-28', 8500000, 8500000, 'Selesai', 'Pelatihan kader kepemimpinan organisasi untuk mahasiswa baru FEB.', 'Arthur Reezan'),
  ('Bakti Sosial & Desa Binaan FEB Peduli', 'Departemen Sosial Masyarakat', 'Kevin Sanjaya', '2026-11-15', 6000000, 0, 'Diajukan', 'Program pengabdian masyarakat, edukasi literasi keuangan UMKM, dan pembagian sembako.', 'Kevin Sanjaya');

INSERT INTO transaksi (tanggal, tipe, kategori, jumlah, keterangan, nama_proker, dicatat_oleh, bukti_nota_url)
VALUES
  ('2026-10-01', 'Pemasukan', 'Dana Dekanat', 35000000, 'Pencairan dana hibah kegiatan kemahasiswaan Semester Ganjil dari Dekanat FEB', 'Semua Proker', 'Bendahara Umum', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'),
  ('2026-10-05', 'Pemasukan', 'Iuran Kas Pengurus', 4500000, 'Iuran wajib kas bulanan seluruh fungsionaris dan anggota LK FEB', 'BPH Inti', 'Bendahara Umum', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'),
  ('2026-10-08', 'Pengeluaran', 'Konsumsi', 2800000, 'Konsumsi snack box dan makan siang peserta LKMM-TD', 'LKMM-TD Latihan Kepemimpinan Manajemen Mahasiswa', 'Bendahara Pelaksana', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'),
  ('2026-10-09', 'Pengeluaran', 'Logistik & Perlengkapan', 5700000, 'Sewa sound system, cetak banner backdrop, dan sertifikat LKMM-TD', 'LKMM-TD Latihan Kepemimpinan Manajemen Mahasiswa', 'Bendahara Pelaksana', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'),
  ('2026-10-10', 'Pengeluaran', 'Publikasi & Desain', 1200000, 'Down Payment (DP) cetak poster promosi dan id card Career Expo 2026', 'FEB Career Expo & Seminar 2026', 'Bendahara Pelaksana', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600');
