import React, { useState } from 'react';
import {
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Filter,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Building,
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function ProkerManagementView({
  prokerList = [],
  onOpenAddProker,
  hasPermissionApprove = false
}) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProkerDetail, setSelectedProkerDetail] = useState(null);

  // Statistics calculation
  const totalPagu = prokerList.reduce((acc, p) => acc + (Number(p.pagu_anggaran) || 0), 0);
  const totalRealisasi = prokerList.reduce((acc, p) => acc + (Number(p.realisasi_anggaran) || 0), 0);
  const serapanPersen = totalPagu > 0 ? Math.round((totalRealisasi / totalPagu) * 100) : 0;
  const runningCount = prokerList.filter((p) => p.status === 'Berjalan').length;
  const pendingCount = prokerList.filter((p) => p.status === 'Diajukan' || p.status === 'Perlu Approval').length;

  const filteredProker = prokerList.filter((p) => {
    if (filterStatus !== 'Semua') {
      if (filterStatus === 'Berjalan' && p.status !== 'Berjalan') return false;
      if (filterStatus === 'Disetujui' && p.status !== 'Disetujui') return false;
      if (filterStatus === 'Diajukan' && p.status !== 'Diajukan' && p.status !== 'Perlu Approval') return false;
      if (filterStatus === 'Selesai' && p.status !== 'Selesai') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.nama_proker || '').toLowerCase().includes(q);
      const matchDept = (p.departemen || '').toLowerCase().includes(q);
      const matchPj = (p.pj || '').toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchPj) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="TATA KELOLA OPERASIONAL & BIROKRASI DEKANAT"
        title="Master Program Kerja (Proker) BEM FEB UKRIDA"
        description="Pengawasan siklus hidup program kerja, proposal 6 Bab Romawi, persetujuan Dekanat, alokasi anggaran, dan pelaporan pertanggungjawaban (LPJ)."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddProker}
              className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="size-4" />
              <span>Usulkan Proker Baru</span>
            </button>
          </div>
        }
      />

      {/* Top Stat Cards Ala ABMAS Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="font-mono text-[10px] uppercase font-bold text-slate-400">Total Pagu Anggaran</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-slate-900 mt-2">
            Rp {totalPagu.toLocaleString('id-ID')}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Realisasi Kas</span>
            <span className="font-bold text-slate-800">Rp {totalRealisasi.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs">
          <p className="font-mono text-[10px] uppercase font-bold text-[#13539D]">Persentase Serapan</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-[#13539D] mt-2">
            {serapanPersen}%
          </p>
          <div className="mt-3 w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#13539D] h-full rounded-full transition-all" style={{ width: `${serapanPersen}%` }}></div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <p className="font-mono text-[10px] uppercase font-bold text-emerald-700">Proker Berjalan</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-emerald-700 mt-2">
            {runningCount} Proker
          </p>
          <p className="mt-3 text-xs text-emerald-600 font-medium border-t border-emerald-100/60 pt-2.5">
            Tahap eksekusi & kepanitiaan
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <p className="font-mono text-[10px] uppercase font-bold text-amber-700">Menunggu Approval</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-amber-700 mt-2">
            {pendingCount} Usulan
          </p>
          <p className="mt-3 text-xs text-amber-600 font-medium border-t border-amber-100/60 pt-2.5">
            Verifikasi Dekanat & BPH
          </p>
        </div>
      </div>

      {/* Main Proker Container Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['Semua', 'Diajukan', 'Disetujui', 'Berjalan', 'Selesai'].map((status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#13539D] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari program kerja, divisi, PJ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Proker Card Grid Ala ABMAS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProker.map((p) => {
            const percent = Math.min(
              Math.round(((p.realisasi_anggaran || 0) / (p.pagu_anggaran || 1)) * 100),
              100
            );

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Berjalan'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : p.status === 'Disetujui' || p.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.status}
                    </span>

                    <span className="font-mono text-xs font-extrabold text-slate-900">
                      Rp {Number(p.pagu_anggaran || 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900 group-hover:text-[#13539D] transition line-clamp-1 mb-1">
                    {p.nama_proker}
                  </h4>

                  <p className="text-[11px] text-slate-500 font-medium mb-2.5">
                    {p.departemen} • PJ: <span className="text-slate-800 font-semibold">{p.pj}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {p.deskripsi}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Serapan Anggaran</span>
                    <span className="font-mono font-bold text-slate-800">
                      {percent}% (Rp {Number(p.realisasi_anggaran || 0).toLocaleString('id-ID')})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#13539D] h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <FileText className="size-3 text-[#13539D]" />
                      Format 6 Bab Romawi
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedProkerDetail(p)}
                      className="text-xs font-bold text-[#13539D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Detail</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Detail Proker */}
      {selectedProkerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#13539D] px-2 py-0.5 rounded bg-blue-50">
                  {selectedProkerDetail.departemen}
                </span>
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-slate-900 mt-1">
                  {selectedProkerDetail.nama_proker}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProkerDetail(null)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
              <p><strong>Penanggung Jawab:</strong> {selectedProkerDetail.pj}</p>
              <p><strong>Pagu Anggaran Disetujui:</strong> Rp {Number(selectedProkerDetail.pagu_anggaran).toLocaleString('id-ID')}</p>
              <p><strong>Realisasi Anggaran:</strong> Rp {Number(selectedProkerDetail.realisasi_anggaran || 0).toLocaleString('id-ID')}</p>
              <p><strong>Status Birokrasi:</strong> {selectedProkerDetail.status}</p>
              <p><strong>Deskripsi Acara:</strong> {selectedProkerDetail.deskripsi}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Standar Dokumen Terpenuhi (6 Bab Romawi)</p>
                <p className="text-[11px] text-emerald-700">Margin Google Docs 4-3-3-3, TTD Dekanat terverifikasi, RAB zero-balance.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProkerDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
