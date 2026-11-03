import React, { useState } from 'react';
import {
  MessageSquareCheck,
  Plus,
  CheckCircle,
  X,
  AlertTriangle,
  User,
  Clock,
  Send
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function AdvokasiTracker({
  advokasiList = [],
  onUpdateStatus,
  onAddAdvokasi,
  activeRole
}) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [catatanBaru, setCatatanBaru] = useState('');

  const [formData, setFormData] = useState({
    isu: '',
    bidang: 'Sarana & Prasarana',
    pelapor: '',
    urgensi: 'Sedang',
    pj: activeRole?.name || 'Divisi Advokasi BEM',
    tindakLanjut: ''
  });

  const statuses = ['Semua', 'Isu Masuk', 'Kajian & Survei BEM', 'Audiensi Dekanat', 'Terselesaikan'];

  const filteredList = advokasiList.filter((a) => {
    if (filterStatus === 'Semua') return true;
    return a.status === filterStatus;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.isu.trim()) return;
    onAddAdvokasi(formData);
    setIsAddOpen(false);
    setFormData({
      isu: '',
      bidang: 'Sarana & Prasarana',
      pelapor: '',
      urgensi: 'Sedang',
      pj: activeRole?.name || 'Divisi Advokasi BEM',
      tindakLanjut: ''
    });
  };

  const handleSaveStatus = (id, newStatus) => {
    onUpdateStatus(id, newStatus, catatanBaru);
    setSelectedIssue(null);
    setCatatanBaru('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Isu Masuk':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Kajian & Survei BEM':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Audiensi Dekanat':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Terselesaikan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="ASPIRASI & ADVOKASI MAHASISWA"
        title="Pelacak Isu Advokasi & Audiensi Dekanat"
        description="Pengawalan aspirasi sarana, akademik, dan fasilitas mahasiswa FEB UKRIDA langsung ke Pimpinan Dekanat & Biro Terkait."
        action={
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>Catat Isu Advokasi</span>
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 pb-4">
          {statuses.map((st) => {
            const isActive = filterStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#13539D] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Grid Isu Advokasi */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      item.urgensi === 'Tinggi'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Urgensi: {item.urgensi}
                  </span>
                </div>

                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900 group-hover:text-[#13539D] transition mb-2 line-clamp-2">
                  {item.isu}
                </h4>

                <div className="text-[11px] text-[#13539D] font-medium mb-3">
                  Bidang: {item.bidang} • Pelapor: <span className="text-slate-700">{item.pelapor}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Progres Tindak Lanjut:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.tindakLanjut || 'Belum ada catatan tindak lanjut.'}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>Update: {item.updateTerakhir}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <User className="size-3 text-[#13539D]" />
                  <span>PJ: <strong className="text-slate-800">{item.pj}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssue(item);
                    setCatatanBaru(item.tindakLanjut || '');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer border border-slate-200"
                >
                  Update Alur
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredList.length === 0 && (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            <CheckCircle className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600">Tidak ada isu advokasi pada kategori ini</p>
          </div>
        )}
      </div>

      {/* Modal Update Status Advokasi */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-slate-900">
                Update Status Advokasi Mahasiswa
              </h3>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-800 font-bold">
                {selectedIssue.isu}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Ubah Status Alur Advokasi:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Isu Masuk', 'Kajian & Survei BEM', 'Audiensi Dekanat', 'Terselesaikan'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedIssue({ ...selectedIssue, status: st })}
                      className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedIssue.status === st
                          ? 'bg-[#13539D] text-white border-[#13539D] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Hasil Audiensi / Tindak Lanjut:</label>
                <textarea
                  rows={3}
                  placeholder="Hasil pertemuan dengan Dekanat, kesepakatan, atau solusi..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={catatanBaru}
                  onChange={(e) => setCatatanBaru(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStatus(selectedIssue.id, selectedIssue.status)}
                  className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white font-bold transition cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catat Isu Baru */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquareCheck className="size-5 text-[#13539D]" />
                Catat Isu Advokasi Baru BEM FEB
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Isu / Keluhan Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AC Ruang Kelas Gedung A Rusak saat Perkuliahan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.isu}
                  onChange={(e) => setFormData({ ...formData, isu: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bidang Isu</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                    value={formData.bidang}
                    onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
                  >
                    <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Finansial Mahasiswa">Finansial Mahasiswa</option>
                    <option value="Akademik & TI">Akademik & TI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Urgensi</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                    value={formData.urgensi}
                    onChange={(e) => setFormData({ ...formData, urgensi: e.target.value })}
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pelapor / Aspirator *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perwakilan Kelas Manajemen 2024"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.pelapor}
                  onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PJ Advokasi)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.pj}
                  onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Rencana Tindak Lanjut</label>
                <textarea
                  rows={2}
                  placeholder="Rencana survei atau jadwal audiensi dengan Dekanat..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.tindakLanjut}
                  onChange={(e) => setFormData({ ...formData, tindakLanjut: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white font-bold transition cursor-pointer shadow-xs"
                >
                  Simpan Isu Advokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
