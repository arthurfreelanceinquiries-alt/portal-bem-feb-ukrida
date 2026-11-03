import React, { useMemo, useState } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  X,
  Search,
  MessageSquare,
  User,
  CalendarDays,
  AlertCircle,
} from 'lucide-react';
import { AdminPageHeader, AdminBadge } from './common/AdminComponents';
import {
  STORAGE,
  readLocal,
  writeLocal,
  formatDateID,
  formatDateTimeID,
  logActivity,
  pushNotification,
  getCurrentActor,
  PENGAJUAN_STATUS_STYLES,
} from '../domain/mockData';

const STATUS_TABS = ['Semua', 'PENDING', 'APPROVED', 'REJECTED'];

export default function PengajuanView() {
  const [items, setItems] = useState(() => readLocal(STORAGE.pengajuan, []));
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [divisiFilter, setDivisiFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');

  const jenisOptions = useMemo(
    () => ['Semua', ...Array.from(new Set(items.map((i) => i.jenis).filter(Boolean)))],
    [items]
  );
  const divisiOptions = useMemo(
    () => ['Semua', ...Array.from(new Set(items.map((i) => i.divisi).filter(Boolean)))],
    [items]
  );

  const filtered = items
    .filter((item) => {
      if (statusFilter !== 'Semua' && item.status !== statusFilter) return false;
      if (jenisFilter !== 'Semua' && item.jenis !== jenisFilter) return false;
      if (divisiFilter !== 'Semua' && item.divisi !== divisiFilter) return false;
      const q = search.trim().toLowerCase();
      if (q) {
        return (
          String(item.nama || '').toLowerCase().includes(q) ||
          String(item.nim || '').toLowerCase().includes(q) ||
          String(item.alasan || '').toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const openDetail = (item) => {
    setSelected(item);
    setNote(item.catatan || '');
  };

  const review = (status) => {
    if (!selected) return;
    const actor = getCurrentActor();
    const updated = {
      ...selected,
      status,
      catatan: note.trim(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: actor,
    };
    const next = items.map((item) => (item.id === selected.id ? updated : item));
    setItems(next);
    writeLocal(STORAGE.pengajuan, next);
    setSelected(updated);

    logActivity({
      actor,
      type: 'pengajuan',
      text: `${status === 'APPROVED' ? 'Menyetujui' : 'Menolak'} pengajuan ${updated.jenis} dari ${updated.nama}.`,
    });
    pushNotification({
      type: status === 'APPROVED' ? 'approval' : 'rejected',
      text: `Pengajuan ${updated.jenis} ${updated.nama} ${status === 'APPROVED' ? 'diapprove' : 'ditolak'}.`,
    });
  };

  const pendingCount = items.filter((i) => i.status === 'PENDING').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const rejectedCount = items.filter((i) => i.status === 'REJECTED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="BIROKRASI & PERSETUJUAN • ABMAS PATTERN"
        title="Pengajuan & Approval"
        description="Tinjau pengajuan izin, dispensasi, dan surat keterangan dari fungsionaris. Berikan keputusan beserta catatan agar proses administrasi BEM tetap transparan."
        action={
          <AdminBadge variant={pendingCount > 0 ? 'warning' : 'green'}>
            {pendingCount} menunggu approval
          </AdminBadge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Total Pengajuan</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-amber-700">Pending</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-emerald-700">Approved</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{approvedCount}</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-rose-700">Rejected</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">{rejectedCount}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Filter className="size-3.5" /> Status
            </span>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === tab
                    ? 'border-[#13539D] bg-[#13539D] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, NIM, atau alasan pengajuan..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
              />
            </div>
            <select
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#13539D] focus:outline-none"
            >
              {jenisOptions.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis === 'Semua' ? 'Semua Jenis' : jenis}
                </option>
              ))}
            </select>
            <select
              value={divisiFilter}
              onChange={(e) => setDivisiFilter(e.target.value)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#13539D] focus:outline-none"
            >
              {divisiOptions.map((divisi) => (
                <option key={divisi} value={divisi}>
                  {divisi === 'Semua' ? 'Semua Divisi' : divisi}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Pemohon</th>
                <th className="px-4 py-3 font-semibold">Jenis Pengajuan</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Ringkasan Alasan</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada pengajuan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{item.nama}</p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {item.nim} • {item.divisi}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-700">{item.jenis}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                      {formatDateID(item.tanggal)}
                    </td>
                    <td className="max-w-[240px] px-4 py-3.5">
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600">{item.alasan}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${PENGAJUAN_STATUS_STYLES[item.status] || PENGAJUAN_STATUS_STYLES.PENDING}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(item);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                      >
                        <Eye className="size-3.5" /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          Menampilkan <b>{filtered.length}</b> dari {items.length} pengajuan
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#13539D] text-[#F7C828]">
                  <FileCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selected.jenis}</h3>
                  <p className="text-xs text-slate-500">
                    Diajukan {formatDateTimeID(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                  <p className="font-mono text-[9px] font-bold uppercase text-slate-400">Pemohon</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-900">
                    <User className="size-3.5 text-[#13539D]" /> {selected.nama}
                  </p>
                  <p className="font-mono text-[10px] text-slate-500">{selected.nim}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                  <p className="font-mono text-[9px] font-bold uppercase text-slate-400">Divisi</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900">{selected.divisi}</p>
                  <p className="flex items-center gap-1 text-[10px] text-slate-500">
                    <CalendarDays className="size-3" /> {formatDateID(selected.tanggal)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-3.5">
                <p className="font-mono text-[9px] font-bold uppercase text-slate-400">Isi Pengajuan</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">{selected.alasan}</p>
              </div>

              {selected.lampiran && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5">
                  <p className="font-mono text-[9px] font-bold uppercase text-[#13539D]">Lampiran</p>
                  <a
                    href={selected.lampiran}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#13539D] underline"
                  >
                    <Eye className="size-3.5" /> Buka lampiran
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Status Saat Ini</span>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${PENGAJUAN_STATUS_STYLES[selected.status] || PENGAJUAN_STATUS_STYLES.PENDING}`}>
                  {selected.status}
                </span>
              </div>

              {selected.status === 'PENDING' ? (
                <>
                  <div>
                    <label className="mb-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                      <MessageSquare className="size-3.5 text-slate-400" /> Catatan Review
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Tambahkan catatan persetujuan atau alasan penolakan..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => review('REJECTED')}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
                    >
                      <XCircle className="size-3.5" /> Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => review('APPROVED')}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5" /> Approve
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="flex items-center gap-1 font-mono text-[9px] font-bold uppercase text-slate-400">
                    <AlertCircle className="size-3" /> Catatan Review
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">
                    {selected.catatan || 'Tidak ada catatan.'}
                  </p>
                  <p className="mt-2 flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <Clock className="size-3" /> {formatDateTimeID(selected.reviewedAt)} • {selected.reviewedBy || '-'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
