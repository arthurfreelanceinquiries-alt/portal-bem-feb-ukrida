import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Download,
  Upload,
  Phone,
  Mail,
  Building,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  X,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AdminPageHeader, AdminBadge } from './common/AdminComponents';
import PaginationComponent from './common/PaginationComponent';
import { ROLES } from '../domain/rbac';

// Mock data fungsionaris BEM FEB UKRIDA 2026 autentik
const INITIAL_MEMBERS = [
  {
    id: 'M01',
    nim: '312023002',
    name: 'Arthur Reezan',
    email: 'arthur.312023002@civitas.ukrida.ac.id',
    phone: '6281234567890',
    prodi: 'S1 Manajemen',
    angkatan: '2023',
    divisi: 'BPH Inti',
    jabatan: 'Ketua Umum BEM FEB',
    status: 'Aktif',
    tugasSelesai: 24,
    tingkatKehadiran: 100,
  },
  {
    id: 'M02',
    nim: '322024025',
    name: 'Princess Auralia Barus',
    email: 'princess.322024025@civitas.ukrida.ac.id',
    phone: '6281234567891',
    prodi: 'S1 Akuntansi',
    angkatan: '2024',
    divisi: 'BPH Inti',
    jabatan: 'Wakil Ketua BEM FEB',
    status: 'Aktif',
    tugasSelesai: 21,
    tingkatKehadiran: 98,
  },
  {
    id: 'M03',
    nim: '312023015',
    name: 'Clara Michelle',
    email: 'clara.312023015@civitas.ukrida.ac.id',
    phone: '6281234567892',
    prodi: 'S1 Manajemen',
    angkatan: '2023',
    divisi: 'BPH Inti',
    jabatan: 'Sekretaris Umum',
    status: 'Aktif',
    tugasSelesai: 19,
    tingkatKehadiran: 100,
  },
  {
    id: 'M04',
    nim: '322023008',
    name: 'Sarah Amalia',
    email: 'sarah.322023008@civitas.ukrida.ac.id',
    phone: '6281234567893',
    prodi: 'S1 Akuntansi',
    angkatan: '2023',
    divisi: 'BPH Inti',
    jabatan: 'Bendahara Umum',
    status: 'Aktif',
    tugasSelesai: 18,
    tingkatKehadiran: 96,
  },
  {
    id: 'M05',
    nim: '312023044',
    name: 'Dimas Prasetyo',
    email: 'dimas.312023044@civitas.ukrida.ac.id',
    phone: '6281234567894',
    prodi: 'S1 Manajemen',
    angkatan: '2023',
    divisi: 'Pengembangan SDM (PSDM)',
    jabatan: 'Koordinator Divisi',
    status: 'Aktif',
    tugasSelesai: 15,
    tingkatKehadiran: 94,
  },
  {
    id: 'M06',
    nim: '322024011',
    name: 'Vania Stephanie',
    email: 'vania.322024011@civitas.ukrida.ac.id',
    phone: '6281234567895',
    prodi: 'S1 Akuntansi',
    angkatan: '2024',
    divisi: 'Pengembangan SDM (PSDM)',
    jabatan: 'Staf Divisi',
    status: 'Aktif',
    tugasSelesai: 12,
    tingkatKehadiran: 92,
  },
  {
    id: 'M07',
    nim: '312024019',
    name: 'Kevin Jonathan',
    email: 'kevin.312024019@civitas.ukrida.ac.id',
    phone: '6281234567896',
    prodi: 'S1 Manajemen',
    angkatan: '2024',
    divisi: 'Pengembangan SDM (PSDM)',
    jabatan: 'Staf Divisi',
    status: 'Aktif',
    tugasSelesai: 10,
    tingkatKehadiran: 88,
  },
  {
    id: 'M08',
    nim: '312023027',
    name: 'Jessica Tanuwijaya',
    email: 'jessica.312023027@civitas.ukrida.ac.id',
    phone: '6281234567897',
    prodi: 'S1 Manajemen',
    angkatan: '2023',
    divisi: 'Akademik & Penalaran',
    jabatan: 'Koordinator Divisi',
    status: 'Aktif',
    tugasSelesai: 16,
    tingkatKehadiran: 96,
  },
  {
    id: 'M09',
    nim: '322024033',
    name: 'Christian Wijaya',
    email: 'christian.322024033@civitas.ukrida.ac.id',
    phone: '6281234567898',
    prodi: 'S1 Akuntansi',
    angkatan: '2024',
    divisi: 'Akademik & Penalaran',
    jabatan: 'Staf Divisi',
    status: 'Aktif',
    tugasSelesai: 11,
    tingkatKehadiran: 90,
  },
  {
    id: 'M10',
    nim: '312023062',
    name: 'Michael Santoso',
    email: 'michael.312023062@civitas.ukrida.ac.id',
    phone: '6281234567899',
    prodi: 'S1 Manajemen',
    angkatan: '2023',
    divisi: 'Advokasi & Kesejahteraan Mahasiswa',
    jabatan: 'Koordinator Divisi',
    status: 'Aktif',
    tugasSelesai: 17,
    tingkatKehadiran: 95,
  },
  {
    id: 'M11',
    nim: '322024009',
    name: 'Stefani Chandra',
    email: 'stefani.322024009@civitas.ukrida.ac.id',
    phone: '6281234567810',
    prodi: 'S1 Akuntansi',
    angkatan: '2024',
    divisi: 'Advokasi & Kesejahteraan Mahasiswa',
    jabatan: 'Staf Divisi',
    status: 'Aktif',
    tugasSelesai: 13,
    tingkatKehadiran: 94,
  },
  {
    id: 'M12',
    nim: '312023038',
    name: 'Nathania Aurelia',
    email: 'nathania.312023038@civitas.ukrida.ac.id',
    phone: '6281234567811',
    prodi: 'S1 Manajemen',
    angkatan: '2023',
    divisi: 'Hubungan Masyarakat (Humas)',
    jabatan: 'Koordinator Divisi',
    status: 'Aktif',
    tugasSelesai: 14,
    tingkatKehadiran: 92,
  },
  {
    id: 'M13',
    nim: '312024051',
    name: 'David Kristanto',
    email: 'david.312024051@civitas.ukrida.ac.id',
    phone: '6281234567812',
    prodi: 'S1 Manajemen',
    angkatan: '2024',
    divisi: 'Media & Kreatif',
    jabatan: 'Koordinator Divisi',
    status: 'Aktif',
    tugasSelesai: 22,
    tingkatKehadiran: 98,
  },
  {
    id: 'M14',
    nim: '322023022',
    name: 'Amanda Felicia',
    email: 'amanda.322023022@civitas.ukrida.ac.id',
    phone: '6281234567813',
    prodi: 'S1 Akuntansi',
    angkatan: '2023',
    divisi: 'Kewirausahaan & Sponsorship',
    jabatan: 'Koordinator Divisi',
    status: 'Aktif',
    tugasSelesai: 13,
    tingkatKehadiran: 91,
  },
];

const DIVISIONS = [
  'Semua Divisi',
  'BPH Inti',
  'Pengembangan SDM (PSDM)',
  'Akademik & Penalaran',
  'Advokasi & Kesejahteraan Mahasiswa',
  'Hubungan Masyarakat (Humas)',
  'Media & Kreatif',
  'Kewirausahaan & Sponsorship',
];

export default function MembersDirectoryView({ activeRole }) {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua Divisi');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nim.includes(searchQuery) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.jabatan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDiv =
        selectedDivision === 'Semua Divisi' || m.divisi === selectedDivision;

      const matchStatus =
        selectedStatus === 'Semua' || m.status === selectedStatus;

      return matchSearch && matchDiv && matchStatus;
    });
  }, [members, searchQuery, selectedDivision, selectedStatus]);

  // Reset ke halaman pertama setiap filter/pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivision, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedMembers = filteredMembers.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['NIM', 'Nama Lengkap', 'Program Studi', 'Angkatan', 'Divisi', 'Jabatan', 'Email', 'No WhatsApp', 'Status', 'Kehadiran %'];
    const rows = filteredMembers.map((m) => [
      `"${m.nim}"`,
      `"${m.name}"`,
      `"${m.prodi}"`,
      `"${m.angkatan}"`,
      `"${m.divisi}"`,
      `"${m.jabatan}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.status}"`,
      `"${m.tingkatKehadiran}%"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DATA_FUNGSIONARIS_BEM_FEB_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick WhatsApp trigger
  const handleOpenWhatsApp = (phone, name) => {
    const text = encodeURIComponent(`Halo rekan ${name}, dari BEM FEB UKRIDA mengenai tindak lanjut koordinasi kepengurusan 2026.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* ABMAS Page Header */}
      <AdminPageHeader
        eyebrow="DATA FUNGSIONARIS & KEANGGOTAAN • ABMAS PATTERN"
        title="Database Fungsionaris BEM FEB UKRIDA"
        description="Direktori resmi fungsionaris BEM FEB Periode 2026. Pantau penugasan divisi, pencapaian KPI individu, kontak WhatsApp civitas, serta ekspor laporan data."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Download className="size-3.5 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <UserPlus className="size-3.5 text-[#F7C828]" />
              <span>Tambah Fungsionaris</span>
            </button>
          </div>
        }
      />

      {/* 4 Stat Cards Ringkasan ala ABMAS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="border border-slate-200/80 shadow-xs bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Fungsionaris</span>
            <Users className="size-4 text-slate-400 shrink-0" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">{members.length} Orang</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Terdaftar aktif di sistem</p>
          </div>
        </div>

        <div className="border border-slate-200/80 shadow-xs bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">Pimpinan & Koor</span>
            <ShieldCheck className="size-4 text-[#13539D] shrink-0" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">
              {members.filter(m => m.jabatan.includes('Ketua') || m.jabatan.includes('Koordinator')).length} Pejabat
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">BPH & 6 Koordinator Divisi</p>
          </div>
        </div>

        <div className="border border-slate-200/80 shadow-xs bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">Kehadiran Rata-rata</span>
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-700">95.2%</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Tingkat kuorum rapat pleno</p>
          </div>
        </div>

        <div className="border border-slate-200/80 shadow-xs bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">Tugas Diselesaikan</span>
            <Sparkles className="size-4 text-amber-500 shrink-0" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">
              {members.reduce((acc, m) => acc + (m.tugasSelesai || 0), 0)} Tugas
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Realisasi KPI 6 Divisi</p>
          </div>
        </div>
      </div>

      {/* Main Card with Filter Bar & Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari fungsionaris (NIM, Nama, Jabatan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Division Selector */}
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-700 focus:bg-white focus:outline-none focus:border-[#13539D] transition cursor-pointer font-medium"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-700 focus:bg-white focus:outline-none focus:border-[#13539D] transition cursor-pointer font-medium"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
            </select>
          </div>
        </div>

        {/* Member Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4 font-semibold">Fungsionaris</th>
                <th className="py-3 px-4 font-semibold">Prodi & Angkatan</th>
                <th className="py-3 px-4 font-semibold">Divisi & Jabatan</th>
                <th className="py-3 px-4 font-semibold text-center">Kehadiran</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Kontak & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Tidak ditemukan fungsionaris yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m) => {
                  const initials = m.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('');

                  const isBph = m.divisi === 'BPH Inti';
                  const isKoor = m.jabatan.includes('Koordinator');

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => setSelectedMember(m)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isBph
                              ? 'bg-[#13539D] text-white shadow-2xs'
                              : isKoor
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {isBph && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-[#13539D]">
                                  BPH
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[10px] text-slate-500">
                              NIM: {m.nim}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Prodi */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium">{m.prodi}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Angkatan {m.angkatan}</div>
                      </td>

                      {/* Divisi & Jabatan */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{m.jabatan}</div>
                        <div className="text-[10px] text-slate-500">{m.divisi}</div>
                      </td>

                      {/* Kehadiran */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-slate-800">{m.tingkatKehadiran}%</span>
                        <div className="w-16 bg-slate-100 h-1 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${m.tingkatKehadiran}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="size-1.5 rounded-full bg-emerald-500"></span>
                          {m.status}
                        </span>
                      </td>

                      {/* Aksi & WA */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(m.phone, m.name)}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                            title="Hubungi via WhatsApp"
                          >
                            <Phone className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & pagination */}
        <div className="pt-1">
          <PaginationComponent
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredMembers.length}
            itemsPerPage={itemsPerPage}
          />
          <div className="mt-2 flex flex-col gap-1 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Dari total {members.length} fungsionaris terdaftar</span>
            <span className="font-mono">Update Terakhir: Kepengurusan BEM FEB 2026</span>
          </div>
        </div>
      </div>

      {/* DETAIL MEMBER MODAL (ALA ABMAS MEMBER DETAIL) */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-up space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-[#13539D] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedMember.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMember.name}</h3>
                  <p className="text-xs text-slate-500">{selectedMember.jabatan} • {selectedMember.divisi}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Nomor Induk Mahasiswa (NIM)</span>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">{selectedMember.nim}</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Program Studi</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedMember.prodi} ({selectedMember.angkatan})</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Kampus:</span>
                  <span className="font-mono text-slate-800 font-medium">{selectedMember.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nomor WhatsApp:</span>
                  <span className="font-mono text-slate-800 font-medium">+{selectedMember.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tugas Diselesaikan:</span>
                  <span className="font-bold text-[#13539D]">{selectedMember.tugasSelesai} Subtugas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kehadiran Rapat Pleno:</span>
                  <span className="font-bold text-emerald-700">{selectedMember.tingkatKehadiran}%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(selectedMember.phone, selectedMember.name)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Phone className="size-4" />
                <span>Kirim WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="size-4 text-[#13539D]" />
                <span>Tambah Fungsionaris Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newM = {
                  id: `M${Date.now()}`,
                  nim: formData.get('nim'),
                  name: formData.get('name'),
                  email: `${formData.get('nim')}@civitas.ukrida.ac.id`,
                  phone: formData.get('phone') || '6281234567899',
                  prodi: formData.get('prodi'),
                  angkatan: formData.get('angkatan') || '2024',
                  divisi: formData.get('divisi'),
                  jabatan: formData.get('jabatan') || 'Staf Divisi',
                  status: 'Aktif',
                  tugasSelesai: 0,
                  tingkatKehadiran: 100,
                };
                setMembers([newM, ...members]);
                setIsAddModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  name="name"
                  required
                  placeholder="Contoh: Juan Emmanuel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIM (Nomor Induk Mahasiswa)</label>
                  <input
                    name="nim"
                    required
                    placeholder="Contoh: 312024010"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program Studi</label>
                  <select
                    name="prodi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D]"
                  >
                    <option value="S1 Manajemen">S1 Manajemen</option>
                    <option value="S1 Akuntansi">S1 Akuntansi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Divisi Penugasan</label>
                  <select
                    name="divisi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D]"
                  >
                    {DIVISIONS.filter(d => d !== 'Semua Divisi').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan</label>
                  <select
                    name="jabatan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D]"
                  >
                    <option value="Staf Divisi">Staf Divisi</option>
                    <option value="Wakil Koordinator">Wakil Koordinator</option>
                    <option value="Koordinator Divisi">Koordinator Divisi</option>
                    <option value="BPH Inti">BPH Inti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp (Awalan 62)</label>
                <input
                  name="phone"
                  placeholder="Contoh: 6281298765432"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Simpan Fungsionaris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
