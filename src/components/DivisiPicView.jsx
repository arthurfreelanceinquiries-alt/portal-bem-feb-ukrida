import React, { useMemo, useState } from 'react';
import {
  Building,
  UserPlus,
  Crown,
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  Users,
  AlertCircle,
} from 'lucide-react';
import { AdminPageHeader, AdminBadge } from './common/AdminComponents';
import {
  MOCK_FUNGSIONARIS,
  STORAGE,
  readLocal,
  writeLocal,
  uid,
  initials,
  logActivity,
  pushNotification,
  getCurrentActor,
} from '../domain/mockData';

export default function DivisiPicView() {
  const [divisions, setDivisions] = useState(() => readLocal(STORAGE.divisions, []));
  const [modal, setModal] = useState(null);
  const [picSearch, setPicSearch] = useState('');
  const [selectedPicNim, setSelectedPicNim] = useState('');
  const [form, setForm] = useState({ nama: '', warna: '#13539D', deskripsi: '' });
  const [toast, setToast] = useState(null);

  const members = useMemo(() => readLocal(STORAGE.members, MOCK_FUNGSIONARIS), []);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const persist = (next) => {
    setDivisions(next);
    writeLocal(STORAGE.divisions, next);
  };

  const memberCount = (divisionName) =>
    members.filter((m) => (m.divisi || '').toLowerCase() === String(divisionName).toLowerCase()).length;

  const openPicModal = (division) => {
    setSelectedPicNim(division.picNim || '');
    setPicSearch('');
    setModal({ type: 'pic', division });
  };

  const openAddModal = () => {
    setForm({ nama: '', warna: '#13539D', deskripsi: '' });
    setModal({ type: 'form', division: null });
  };

  const openEditModal = (division) => {
    setForm({
      nama: division.nama,
      warna: division.warna || '#13539D',
      deskripsi: division.deskripsi || '',
    });
    setModal({ type: 'form', division });
  };

  const handleSavePic = () => {
    if (!modal?.division) return;
    const member = members.find((m) => m.nim === selectedPicNim);
    if (!member) {
      showToast('Pilih anggota terlebih dahulu.', 'error');
      return;
    }
    const next = divisions.map((d) =>
      d.id === modal.division.id
        ? { ...d, picNim: member.nim, picNama: member.nama || member.nama }
        : d
    );
    persist(next);
    logActivity({
      actor: getCurrentActor(),
      type: 'divisi',
      text: `Menetapkan ${member.nama || member.name} sebagai PIC Divisi ${modal.division.nama}.`,
    });
    pushNotification({ type: 'success', text: `PIC Divisi ${modal.division.nama} diperbarui.` });
    setModal(null);
    showToast(`PIC ${modal.division.nama} berhasil diganti.`);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const nama = form.nama.trim();
    if (!nama) {
      showToast('Nama divisi wajib diisi.', 'error');
      return;
    }
    const duplicate = divisions.some(
      (d) => d.nama.toLowerCase() === nama.toLowerCase() && d.id !== modal?.division?.id
    );
    if (duplicate) {
      showToast('Nama divisi sudah digunakan.', 'error');
      return;
    }

    if (modal?.division) {
      const next = divisions.map((d) =>
        d.id === modal.division.id
          ? { ...d, nama, warna: form.warna, deskripsi: form.deskripsi }
          : d
      );
      persist(next);
      logActivity({ actor: getCurrentActor(), type: 'divisi', text: `Memperbarui data Divisi ${nama}.` });
      showToast(`Divisi ${nama} berhasil diperbarui.`);
    } else {
      const newDivision = {
        id: uid('div'),
        nama,
        warna: form.warna || '#13539D',
        deskripsi: form.deskripsi,
        picNim: '',
        picNama: '',
      };
      persist([...divisions, newDivision]);
      logActivity({ actor: getCurrentActor(), type: 'divisi', text: `Menambahkan Divisi baru: ${nama}.` });
      pushNotification({ type: 'success', text: `Divisi baru ${nama} ditambahkan.` });
      showToast(`Divisi ${nama} berhasil ditambahkan.`);
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (!modal?.division) return;
    const next = divisions.filter((d) => d.id !== modal.division.id);
    persist(next);
    logActivity({
      actor: getCurrentActor(),
      type: 'divisi',
      text: `Menghapus Divisi ${modal.division.nama}.`,
    });
    setModal(null);
    showToast(`Divisi ${modal.division.nama} dihapus.`);
  };

  const filteredPicMembers = members.filter((m) => {
    const q = picSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      String(m.nama || m.name || '').toLowerCase().includes(q) ||
      String(m.nim || '').toLowerCase().includes(q) ||
      String(m.divisi || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="STRUKTUR & KEPEMIMPINAN DIVISI • ABMAS PATTERN"
        title="Kelola Divisi & Penunjukan PIC"
        description="Kelola delapan divisi BEM FEB UKRIDA, tunjuk koordinator/PIC aktif, dan pantau sebaran anggota setiap divisi. Perubahan langsung tersimpan di perangkat."
        action={
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0d417d] cursor-pointer"
          >
            <Plus className="size-3.5 text-[#F7C828]" />
            <span>Tambah Divisi Baru</span>
          </button>
        }
      />

      {toast && (
        <div
          className={`fixed bottom-24 right-4 z-[60] flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs font-bold shadow-xl lg:bottom-6 ${
            toast.tone === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Total Divisi</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{divisions.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">PIC Aktif</p>
          <p className="mt-1 text-2xl font-extrabold text-[#13539D]">
            {divisions.filter((d) => d.picNama).length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Total Anggota</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{members.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Tanpa PIC</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">
            {divisions.filter((d) => !d.picNama).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {divisions.map((division) => {
          const count = memberCount(division.nama);
          return (
            <div
              key={division.id}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
              style={{ borderLeftWidth: 5, borderLeftColor: division.warna || '#13539D' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="grid size-11 shrink-0 place-items-center rounded-2xl text-white shadow-xs"
                    style={{ backgroundColor: division.warna || '#13539D' }}
                  >
                    <Building className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{division.nama}</h3>
                    <p className="flex items-center gap-1 text-[10px] font-bold" style={{ color: division.warna || '#13539D' }}>
                      <Users className="size-3" /> {count} anggota
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(division)}
                    title="Edit divisi"
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'delete', division })}
                    title="Hapus divisi"
                    className="grid size-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 min-h-[32px] text-[11px] leading-relaxed text-slate-500">
                {division.deskripsi || 'Belum ada deskripsi divisi.'}
              </p>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  PIC / Koordinator Aktif
                </p>
                {division.picNama ? (
                  <div className="flex items-center gap-2.5">
                    <div
                      className="grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: division.warna || '#13539D' }}
                    >
                      {initials(division.picNama)}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate text-xs font-bold text-slate-900">
                        <Crown className="size-3 text-[#F7C828]" /> {division.picNama}
                      </p>
                      <p className="font-mono text-[10px] text-slate-500">NIM: {division.picNim || '-'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-700">
                    <AlertCircle className="size-3.5" /> Belum ada PIC ditunjuk
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => openPicModal(division)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[#13539D] hover:text-[#13539D] cursor-pointer"
              >
                <UserPlus className="size-3.5" /> Ganti PIC
              </button>
            </div>
          );
        })}
      </div>

      {/* PIC MODAL */}
      {modal?.type === 'pic' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Ganti PIC Divisi</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Pilih koordinator baru untuk Divisi <b>{modal.division.nama}</b>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={picSearch}
                onChange={(e) => setPicSearch(e.target.value)}
                placeholder="Cari anggota berdasarkan nama / NIM / divisi..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {filteredPicMembers.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">Anggota tidak ditemukan.</p>
              ) : (
                filteredPicMembers.map((member) => {
                  const name = member.nama || member.name || '-';
                  const selected = selectedPicNim === member.nim;
                  return (
                    <button
                      key={member.nim}
                      type="button"
                      onClick={() => setSelectedPicNim(member.nim)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                        selected
                          ? 'border-[#13539D] bg-blue-50/60'
                          : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                        {initials(name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">{name}</p>
                        <p className="font-mono text-[10px] text-slate-500">
                          {member.nim} • {member.divisi || '-'} • {member.jabatan || '-'}
                        </p>
                      </div>
                      <span
                        className={`size-4 rounded-full border-2 ${
                          selected ? 'border-[#13539D] bg-[#13539D]' : 'border-slate-300 bg-white'
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSavePic}
                className="rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
              >
                Konfirmasi PIC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {modal?.type === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSaveForm}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {modal.division ? 'Edit Divisi' : 'Tambah Divisi Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Nama Divisi</label>
                <input
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                  placeholder="Contoh: Divisi Kewirausahaan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Warna Aksen</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.warna}
                    onChange={(e) => setForm({ ...form, warna: e.target.value })}
                    className="size-9 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <input
                    value={form.warna}
                    onChange={(e) => setForm({ ...form, warna: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 font-mono text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                  placeholder="Tugas dan fokus divisi..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
              >
                {modal.division ? 'Simpan Perubahan' : 'Tambah Divisi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {modal?.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-rose-50 text-rose-600">
              <Trash2 className="size-5" />
            </div>
            <h3 className="mt-3 text-base font-extrabold text-slate-900">Hapus Divisi?</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Divisi <b>{modal.division.nama}</b> akan dihapus dari struktur. Data anggota tidak ikut terhapus.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
