import React, { useMemo, useState } from 'react';
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Megaphone,
  CheckCircle2,
  X,
  AlertCircle,
  CalendarDays,
} from 'lucide-react';
import { AdminPageHeader, AdminBadge } from './common/AdminComponents';
import {
  STORAGE,
  readLocal,
  writeLocal,
  uid,
  formatDateTimeID,
  logActivity,
  pushNotification,
  getCurrentActor,
  ANNOUNCEMENT_CATEGORY_STYLES,
} from '../domain/mockData';

const CATEGORIES = ['Umum', 'Akademik', 'Proker', 'Urgent'];
const EMPTY_FORM = { judul: '', kategori: 'Umum', isi: '', status: 'Published' };

export default function AnnouncementView() {
  const [items, setItems] = useState(() => readLocal(STORAGE.announcements, []));
  const [filter, setFilter] = useState('Semua');
  const [modal, setModal] = useState(null); // { type: 'form', item? } | { type: 'delete', item }
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const persist = (next) => {
    setItems(next);
    writeLocal(STORAGE.announcements, next);
  };

  const sorted = useMemo(
    () =>
      items
        .slice()
        .sort((a, b) => new Date(b.tanggal || 0).getTime() - new Date(a.tanggal || 0).getTime()),
    [items]
  );

  const filtered = filter === 'Semua' ? sorted : sorted.filter((item) => item.status === filter);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModal({ type: 'form', item: null });
  };

  const openEdit = (item) => {
    setForm({
      judul: item.judul,
      kategori: item.kategori || 'Umum',
      isi: item.isi,
      status: item.status || 'Published',
    });
    setModal({ type: 'form', item });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const judul = form.judul.trim();
    const isi = form.isi.trim();
    if (!judul || !isi) {
      showToast('Judul dan isi pengumuman wajib diisi.', 'error');
      return;
    }

    if (modal?.item) {
      const next = items.map((item) =>
        item.id === modal.item.id
          ? {
              ...item,
              judul,
              kategori: form.kategori,
              isi,
              status: form.status,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      persist(next);
      logActivity({ actor: getCurrentActor(), type: 'pengumuman', text: `Memperbarui pengumuman "${judul}".` });
      showToast('Pengumuman berhasil diperbarui.');
    } else {
      const newItem = {
        id: uid('ann'),
        judul,
        kategori: form.kategori,
        isi,
        status: form.status,
        tanggal: new Date().toISOString(),
        author: getCurrentActor(),
      };
      persist([newItem, ...items]);
      logActivity({ actor: getCurrentActor(), type: 'pengumuman', text: `Membuat pengumuman "${judul}".` });
      if (form.status === 'Published') {
        pushNotification({ type: 'announcement', text: `Pengumuman baru: ${judul}` });
      }
      showToast('Pengumuman berhasil dibuat.');
    }
    setModal(null);
  };

  const toggleStatus = (item) => {
    const next = items.map((i) =>
      i.id === item.id ? { ...i, status: i.status === 'Published' ? 'Draft' : 'Published' } : i
    );
    persist(next);
    showToast(`Pengumuman "${item.judul}" sekarang ${item.status === 'Published' ? 'Draft' : 'Published'}.`);
  };

  const handleDelete = () => {
    if (!modal?.item) return;
    persist(items.filter((item) => item.id !== modal.item.id));
    logActivity({ actor: getCurrentActor(), type: 'pengumuman', text: `Menghapus pengumuman "${modal.item.judul}".` });
    setModal(null);
    showToast('Pengumuman dihapus.');
  };

  const publishedCount = items.filter((i) => i.status === 'Published').length;
  const draftCount = items.filter((i) => i.status === 'Draft').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="KONTEN & KOMUNIKASI ORGANISASI • ABMAS PATTERN"
        title="Manajemen Pengumuman"
        description="Kelola pengumuman resmi BEM FEB UKRIDA. Susun draft, terbitkan informasi penting, dan pastikan seluruh fungsionaris menerima kabar terbaru."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0d417d] cursor-pointer"
          >
            <Plus className="size-3.5 text-[#F7C828]" />
            <span>Buat Pengumuman</span>
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
          {toast.tone === 'error' ? <AlertCircle className="size-4 shrink-0" /> : <CheckCircle2 className="size-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Total</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-emerald-700">Published</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-100/60 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-500">Draft</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-600">{draftCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['Semua', 'Published', 'Draft'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition cursor-pointer ${
              filter === tab
                ? 'border-[#13539D] bg-[#13539D] text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Megaphone className="mx-auto size-9 text-slate-300" />
          <p className="mt-3 text-sm font-bold text-slate-600">Belum ada pengumuman</p>
          <p className="mt-1 text-xs text-slate-400">Buat pengumuman pertama untuk seluruh fungsionaris.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                item.kategori === 'Urgent' ? 'border-rose-200' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-2xl ${
                      item.kategori === 'Urgent'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-blue-50 text-[#13539D]'
                    }`}
                  >
                    {item.kategori === 'Urgent' ? <AlertCircle className="size-5" /> : <Bell className="size-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">{item.judul}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${ANNOUNCEMENT_CATEGORY_STYLES[item.kategori] || ANNOUNCEMENT_CATEGORY_STYLES.Umum}`}>
                        {item.kategori}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                          item.status === 'Published'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">{item.isi}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <CalendarDays className="size-3" /> {formatDateTimeID(item.tanggal)}
                      </span>
                      <span>oleh {item.author || 'Admin'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item)}
                    title={item.status === 'Published' ? 'Jadikan draft' : 'Terbitkan'}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition cursor-pointer ${
                      item.status === 'Published'
                        ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {item.status === 'Published' ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    {item.status === 'Published' ? 'Draft' : 'Terbitkan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    title="Edit"
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'delete', item })}
                    title="Hapus"
                    className="grid size-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal?.type === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {modal.item ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">Informasi akan tampil di Portal Anggota.</p>
              </div>
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
                <label className="mb-1 block text-xs font-bold text-slate-700">Judul</label>
                <input
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                  placeholder="Contoh: Jadwal Rapat Pleno November 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Isi Pengumuman</label>
                <textarea
                  value={form.isi}
                  onChange={(e) => setForm({ ...form, isi: e.target.value })}
                  required
                  rows={6}
                  placeholder="Tuliskan detail informasi, waktu, tempat, dan hal yang perlu dilakukan..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
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
                {modal.item ? 'Simpan Perubahan' : 'Simpan Pengumuman'}
              </button>
            </div>
          </form>
        </div>
      )}

      {modal?.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-rose-50 text-rose-600">
              <Trash2 className="size-5" />
            </div>
            <h3 className="mt-3 text-base font-extrabold text-slate-900">Hapus Pengumuman?</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              <b>{modal.item.judul}</b> akan dihapus permanen dari portal.
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
