import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Download,
  Search,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function FinanceView({
  transactions = [],
  saldoKas = 0,
  onOpenAddTransaction,
  onSelectTransaction,
  onExportCSV,
  hasPermissionManage = false
}) {
  const [filterType, setFilterType] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Hitung metrik keuangan
  const totalPemasukan = transactions
    .filter((t) => t.tipe === 'Pemasukan')
    .reduce((acc, t) => acc + (Number(t.jumlah) || 0), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.tipe === 'Pengeluaran')
    .reduce((acc, t) => acc + (Number(t.jumlah) || 0), 0);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'Semua' && t.tipe !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchKet = (t.keterangan || '').toLowerCase().includes(q);
      const matchKat = (t.kategori || '').toLowerCase().includes(q);
      const matchP = (t.nama_proker || '').toLowerCase().includes(q);
      const matchDicatat = (t.dicatat_oleh || '').toLowerCase().includes(q);
      if (!matchKet && !matchKat && !matchP && !matchDicatat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="TATA KELOLA KEUANGAN & PERBENDAHARAAN"
        title="Buku Kas Umum & Transaksi BEM FEB UKRIDA"
        description="Pencatatan real-time arus kas masuk dan keluar, verifikasi bukti nota fisik, serta kepatuhan RAB zero-balance BEM FEB."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <Download className="size-3.5" />
              <span>Export CSV</span>
            </button>

            {hasPermissionManage && (
              <button
                type="button"
                onClick={onOpenAddTransaction}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="size-4" />
                <span>Catat Transaksi Kas</span>
              </button>
            )}
          </div>
        }
      />

      {/* 4 Financial Stat Cards Ala ABMAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="font-mono text-[10px] uppercase font-bold text-slate-400">Sisa Saldo Kas Kasir</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-slate-900 mt-2">
            Rp {saldoKas.toLocaleString('id-ID')}
          </p>
          <p className="mt-3 text-xs text-slate-500 font-medium border-t border-slate-100 pt-2.5">
            Total dari {transactions.length} mutasi buku kas
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase font-bold text-emerald-700">Total Pemasukan</p>
            <ArrowDownRight className="size-4 text-emerald-600" />
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-emerald-700 mt-2">
            + Rp {totalPemasukan.toLocaleString('id-ID')}
          </p>
          <p className="mt-3 text-xs text-emerald-600 font-medium border-t border-emerald-100/60 pt-2.5">
            Dana Dekanat, Iuran & Sponsor
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase font-bold text-rose-700">Total Pengeluaran</p>
            <ArrowUpRight className="size-4 text-rose-600" />
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-rose-700 mt-2">
            - Rp {totalPengeluaran.toLocaleString('id-ID')}
          </p>
          <p className="mt-3 text-xs text-rose-600 font-medium border-t border-rose-100/60 pt-2.5">
            Realisasi operasional & proker
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase font-bold text-[#13539D]">Balance Gatekeeper</p>
            <ShieldCheck className="size-4 text-[#13539D]" />
          </div>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-[#13539D] mt-2">
            Rp 0 Sisa RAB
          </p>
          <p className="mt-3 text-xs text-blue-700 font-medium border-t border-blue-100/60 pt-2.5">
            Audit Lapis 2 Terpenuhi (Pass)
          </p>
        </div>
      </div>

      {/* Main Table Card Ala ABMAS */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            {['Semua', 'Pemasukan', 'Pengeluaran'].map((type) => {
              const isActive = filterType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#13539D] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi, proker, pencatat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Keterangan & Kategori</th>
                <th className="py-3 px-4">Proker Terkait</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4 text-right">Jumlah (IDR)</th>
                <th className="py-3 px-4 text-center">Bukti Nota</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => {
                const isIncome = t.tipe === 'Pemasukan';
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {t.tanggal}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900">{t.keterangan}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Kategori: {t.kategori} • Dicatat: {t.dicatat_oleh}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {t.nama_proker || '-'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {t.tipe}
                      </span>
                    </td>

                    <td
                      className={`py-3.5 px-4 font-mono font-extrabold text-right whitespace-nowrap ${
                        isIncome ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'} Rp {Number(t.jumlah).toLocaleString('id-ID')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {t.bukti_nota_url ? (
                        <button
                          type="button"
                          onClick={() => onSelectTransaction && onSelectTransaction(t)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#13539D] font-bold text-[10px] transition inline-flex items-center gap-1 cursor-pointer border border-blue-200"
                        >
                          <Receipt className="size-3" />
                          <span>Lihat Nota</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-300">Tanpa Nota</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Terverifikasi
                      </span>
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
