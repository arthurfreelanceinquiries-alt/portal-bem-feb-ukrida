import React, { useState } from 'react';
import {
  BarChart2,
  Clock,
  User,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function AuditLogView({ logs = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchAksi = (log.aksi || '').toLowerCase().includes(q);
    const matchUser = (log.user || '').toLowerCase().includes(q);
    const matchDetail = (log.detail || '').toLowerCase().includes(q);
    return matchAksi || matchUser || matchDetail;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="AKUNTABILITAS & AUDIT JEJAK SISTEM"
        title="Log Audit Aktivitas BEM FEB UKRIDA"
        description="Rekaman kronologis setiap perubahan data program kerja, transaksi keuangan, penugasan fungsionaris, dan pembuatan notulensi."
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Total Rekaman: {filteredLogs.length} aktivitas
            </span>
          </div>

          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aksi, pelaku, atau detail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] w-full sm:w-64"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Pelaku Aktivitas</th>
                <th className="py-3 px-4">Jenis Aksi</th>
                <th className="py-3 px-4">Detail Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {l.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-mono text-[10px]">
                      {l.user ? l.user[0] : 'U'}
                    </span>
                    <span>{l.user}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-[#13539D] border border-blue-200">
                      {l.aksi}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {l.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
