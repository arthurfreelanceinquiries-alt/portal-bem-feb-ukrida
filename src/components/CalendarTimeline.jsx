import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  AlertCircle,
  X,
  CalendarDays,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function CalendarTimeline({
  events = [],
  onAddEvent,
  activeRole
}) {
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '16:00 - 18:00 WIB',
    lokasi: 'Ruang Rapat Gedung A Lt. 3 Kampus Tanjung Duren',
    kategori: 'Rapat & Evaluasi',
    pj: activeRole?.name || 'Sekretaris Umum',
    deskripsi: ''
  });

  const categories = ['Semua', 'Rapat & Evaluasi', 'Eksekusi Acara', 'Tenggat Administrasi', 'Pengabdian Masyarakat'];

  const filteredEvents = events.filter((e) => {
    if (filterKategori === 'Semua') return true;
    return e.kategori === filterKategori;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) return;
    onAddEvent(formData);
    setIsAddModalOpen(false);
    setFormData({
      judul: '',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '16:00 - 18:00 WIB',
      lokasi: 'Ruang Rapat Gedung A Lt. 3 Kampus Tanjung Duren',
      kategori: 'Rapat & Evaluasi',
      pj: activeRole?.name || 'Sekretaris Umum',
      deskripsi: ''
    });
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Rapat & Evaluasi':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Eksekusi Acara':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Tenggat Administrasi':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pengabdian Masyarakat':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="JADWAL & SINKRONISASI AGENDA TERPADU"
        title="Master Kalender Program Kerja & Rapat"
        description="Sinkronisasi jadwal rapat pleno BPH, koordinasi divisi, batas pengumpulan berkas LPJ/SPU Dekanat, dan timeline eksekusi acara."
        action={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Agenda Kerja</span>
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Category Filter Chips Ala ABMAS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 pb-4">
          {categories.map((c) => {
            const isActive = filterKategori === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilterKategori(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#13539D] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Events Timeline Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadge(evt.kategori)}`}>
                    {evt.kategori}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    {evt.status || 'Mendatang'}
                  </span>
                </div>

                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900 group-hover:text-[#13539D] transition mb-3 line-clamp-2">
                  {evt.judul}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-[#13539D]" />
                    <strong className="font-mono text-slate-800">{evt.tanggal}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-amber-600" />
                    <span>{evt.waktu}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{evt.lokasi}</span>
                  </div>
                </div>

                {evt.deskripsi && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {evt.deskripsi}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="size-3 text-[#13539D]" />
                  <span>PJ: <strong className="text-slate-800">{evt.pj}</strong></span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-mono">
                  Internal BEM
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            <CalendarDays className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600">Belum ada agenda pada kategori ini</p>
          </div>
        )}
      </div>

      {/* Modal Tambah Agenda */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarDays className="size-5 text-[#13539D]" />
                Tambah Agenda Kerja BEM
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Agenda / Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Pleno Evaluasi Proker Bulan Oktober"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Pelaksanaan *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Kegiatan *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Agenda</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  >
                    <option value="Rapat & Evaluasi">Rapat & Evaluasi</option>
                    <option value="Eksekusi Acara">Eksekusi Acara</option>
                    <option value="Tenggat Administrasi">Tenggat Administrasi</option>
                    <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PJ)</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                    value={formData.pj}
                    onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Tambahkan detail rundown atau poin penting acara..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#13539D]"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white font-bold transition cursor-pointer shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
