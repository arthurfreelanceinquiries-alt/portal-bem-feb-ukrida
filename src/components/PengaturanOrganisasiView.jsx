import React, { useMemo, useState } from 'react';
import {
  Settings,
  Building,
  Tag,
  Upload,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Image as ImageIcon,
  AlertCircle,
  Palette,
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
} from '../domain/mockData';

const TABS = [
  { id: 'profil', label: 'Profil BEM' },
  { id: 'divisi', label: 'Kelola Divisi' },
  { id: 'kategori', label: 'Kategori Kegiatan' },
];

export default function PengaturanOrganisasiView() {
  const [tab, setTab] = useState('profil');
  const [settings, setSettings] = useState(() => readLocal(STORAGE.orgSettings, {}));
  const [profileForm, setProfileForm] = useState(() => readLocal(STORAGE.orgSettings, {}));
  const [divisions, setDivisions] = useState(() => readLocal(STORAGE.divisions, []));
  const [categories, setCategories] = useState(() => readLocal(STORAGE.categories, []));
  const [modal, setModal] = useState(null);
  const [divisionForm, setDivisionForm] = useState({ nama: '', warna: '#13539D', deskripsi: '' });
  const [categoryForm, setCategoryForm] = useState({ nama: '', warna: '#13539D' });
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  const memberCount = (divisionName) => {
    const members = readLocal(STORAGE.members, []);
    return members.filter((m) => String(m.divisi || '').toLowerCase() === String(divisionName).toLowerCase()).length;
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('File logo harus berupa gambar.', 'error');
      return;
    }
    if (file.size > 600 * 1024) {
      showToast('Ukuran logo maksimal 600 KB agar tersimpan di localStorage.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      handleProfileChange('logo', String(event.target?.result || ''));
      showToast('Logo siap disimpan.');
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    const next = { ...profileForm, updatedAt: new Date().toISOString() };
    writeLocal(STORAGE.orgSettings, next);
    setSettings(next);
    logActivity({ actor: getCurrentActor(), type: 'pengaturan', text: 'Memperbarui profil organisasi BEM FEB.' });
    pushNotification({ type: 'success', text: 'Profil organisasi berhasil diperbarui.' });
    showToast('Profil BEM berhasil disimpan.');
  };

  const openDivisionForm = (item = null) => {
    setDivisionForm(
      item
        ? { nama: item.nama, warna: item.warna || '#13539D', deskripsi: item.deskripsi || '' }
        : { nama: '', warna: '#13539D', deskripsi: '' }
    );
    setModal({ type: 'division', item });
  };

  const saveDivision = (e) => {
    e.preventDefault();
    const nama = divisionForm.nama.trim();
    if (!nama) {
      showToast('Nama divisi wajib diisi.', 'error');
      return;
    }
    const duplicate = divisions.some(
      (d) => d.nama.toLowerCase() === nama.toLowerCase() && d.id !== modal?.item?.id
    );
    if (duplicate) {
      showToast('Nama divisi sudah digunakan.', 'error');
      return;
    }

    if (modal?.item) {
      const next = divisions.map((d) =>
        d.id === modal.item.id
          ? { ...d, nama, warna: divisionForm.warna, deskripsi: divisionForm.deskripsi }
          : d
      );
      setDivisions(next);
      writeLocal(STORAGE.divisions, next);
      showToast(`Divisi ${nama} diperbarui.`);
    } else {
      const next = [
        ...divisions,
        {
          id: uid('div'),
          nama,
          warna: divisionForm.warna,
          deskripsi: divisionForm.deskripsi,
          picNim: '',
          picNama: '',
        },
      ];
      setDivisions(next);
      writeLocal(STORAGE.divisions, next);
      showToast(`Divisi ${nama} ditambahkan.`);
    }
    logActivity({ actor: getCurrentActor(), type: 'pengaturan', text: `Menyimpan data Divisi ${nama}.` });
    setModal(null);
  };

  const openCategoryForm = (item = null) => {
    setCategoryForm(item ? { nama: item.nama, warna: item.warna || '#13539D' } : { nama: '', warna: '#13539D' });
    setModal({ type: 'category', item });
  };

  const saveCategory = (e) => {
    e.preventDefault();
    const nama = categoryForm.nama.trim();
    if (!nama) {
      showToast('Nama kategori wajib diisi.', 'error');
      return;
    }
    const duplicate = categories.some(
      (c) => c.nama.toLowerCase() === nama.toLowerCase() && c.id !== modal?.item?.id
    );
    if (duplicate) {
      showToast('Kategori tersebut sudah ada.', 'error');
      return;
    }

    if (modal?.item) {
      const next = categories.map((c) =>
        c.id === modal.item.id ? { ...c, nama, warna: categoryForm.warna } : c
      );
      setCategories(next);
      writeLocal(STORAGE.categories, next);
      showToast(`Kategori ${nama} diperbarui.`);
    } else {
      const next = [...categories, { id: uid('cat'), nama, warna: categoryForm.warna }];
      setCategories(next);
      writeLocal(STORAGE.categories, next);
      showToast(`Kategori ${nama} ditambahkan.`);
    }
    logActivity({ actor: getCurrentActor(), type: 'pengaturan', text: `Menyimpan kategori kegiatan ${nama}.` });
    setModal(null);
  };

  const confirmDelete = () => {
    if (!modal?.item) return;
    if (modal.type === 'division') {
      const next = divisions.filter((d) => d.id !== modal.item.id);
      setDivisions(next);
      writeLocal(STORAGE.divisions, next);
      showToast(`Divisi ${modal.item.nama} dihapus.`);
    } else if (modal.type === 'category') {
      const next = categories.filter((c) => c.id !== modal.item.id);
      setCategories(next);
      writeLocal(STORAGE.categories, next);
      showToast(`Kategori ${modal.item.nama} dihapus.`);
    }
    logActivity({
      actor: getCurrentActor(),
      type: 'pengaturan',
      text: `Menghapus ${modal.type === 'division' ? 'divisi' : 'kategori'} ${modal.item.nama}.`,
    });
    setModal(null);
  };

  const settingsSummary = useMemo(
    () => [
      { label: 'Nama Organisasi', value: settings.singkatan || settings.nama || '-' },
      { label: 'Periode', value: settings.periode || '-' },
      { label: 'Dekan Pembina', value: settings.dekan || '-' },
      { label: 'Divisi', value: `${divisions.length} divisi` },
    ],
    [settings, divisions]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="KONFIGURASI ORGANISASI • ABMAS SETTINGS"
        title="Pengaturan Organisasi"
        description="Atur identitas BEM FEB UKRIDA, kelola struktur divisi, dan sesuaikan kategori kegiatan yang dipakai pada modul absensi."
        action={<AdminBadge variant="blue">Tersimpan lokal</AdminBadge>}
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

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              tab === item.id
                ? 'bg-[#13539D] text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.id === 'profil' && <Settings className="size-3.5" />}
            {item.id === 'divisi' && <Building className="size-3.5" />}
            {item.id === 'kategori' && <Tag className="size-3.5" />}
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'profil' && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <ImageIcon className="size-4 text-[#13539D]" /> Logo Organisasi
              </h3>
              <div className="mt-4 flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5">
                {profileForm.logo ? (
                  <img src={profileForm.logo} alt="Logo BEM" className="size-24 rounded-2xl object-contain bg-white p-2 shadow-xs" />
                ) : (
                  <div className="grid size-24 place-items-center rounded-2xl bg-[#13539D] text-3xl font-black text-[#F7C828] shadow-sm">
                    B
                  </div>
                )}
                <label className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[#13539D] hover:text-[#13539D]">
                  <Upload className="size-3.5" /> Unggah Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                  />
                </label>
                <p className="mt-2 text-center text-[10px] text-slate-400">PNG / JPG, maksimal 600 KB (base64)</p>
                {profileForm.logo && (
                  <button
                    type="button"
                    onClick={() => handleProfileChange('logo', '')}
                    className="mt-2 text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Hapus logo
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900">Ringkasan</h3>
              <div className="mt-3 space-y-2.5">
                {settingsSummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{item.label}</span>
                    <span className="max-w-[60%] truncate text-right text-[11px] font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[9px] text-slate-400">
                Update: {formatDateTimeID(settings.updatedAt)}
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Profil BEM</h3>
                <p className="mt-0.5 text-xs text-slate-500">Identitas resmi organisasi untuk header dan dokumen.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
              >
                <Save className="size-3.5 text-[#F7C828]" /> Simpan
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700">Nama BEM</label>
                <input
                  value={profileForm.nama || ''}
                  onChange={(e) => handleProfileChange('nama', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Singkatan</label>
                <input
                  value={profileForm.singkatan || ''}
                  onChange={(e) => handleProfileChange('singkatan', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Periode</label>
                <input
                  value={profileForm.periode || ''}
                  onChange={(e) => handleProfileChange('periode', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700">Dekan Pembina</label>
                <input
                  value={profileForm.dekan || ''}
                  onChange={(e) => handleProfileChange('dekan', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700">Visi</label>
                <textarea
                  value={profileForm.visi || ''}
                  onChange={(e) => handleProfileChange('visi', e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700">Misi</label>
                <textarea
                  value={profileForm.misi || ''}
                  onChange={(e) => handleProfileChange('misi', e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {tab === 'divisi' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Building className="size-4 text-[#13539D]" /> Struktur Divisi
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">Tambah, ubah warna/deskripsi, atau hapus divisi organisasi.</p>
            </div>
            <button
              type="button"
              onClick={() => openDivisionForm()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
            >
              <Plus className="size-3.5 text-[#F7C828]" /> Tambah Divisi
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {divisions.map((division) => (
              <div
                key={division.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-4"
                style={{ borderLeftWidth: 4, borderLeftColor: division.warna || '#13539D' }}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl text-white"
                    style={{ backgroundColor: division.warna || '#13539D' }}
                  >
                    <Building className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900">{division.nama}</p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-500">
                      {division.deskripsi || 'Belum ada deskripsi.'}
                    </p>
                    <p className="mt-1 font-mono text-[9px] text-slate-400">
                      {division.picNama || 'Tanpa PIC'} • {memberCount(division.nama)} anggota
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openDivisionForm(division)}
                    className="grid size-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'delete', item: division, entity: 'division' })}
                    className="grid size-7 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'kategori' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Tag className="size-4 text-[#13539D]" /> Kategori Kegiatan Absensi
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Kategori ini muncul sebagai tab pada modul Input Absensi Real-Time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCategoryForm()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
            >
              <Plus className="size-3.5 text-[#F7C828]" /> Tambah Kategori
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-9 place-items-center rounded-xl text-white"
                    style={{ backgroundColor: category.warna || '#13539D' }}
                  >
                    <Tag className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">{category.nama}</p>
                    <p className="font-mono text-[10px] text-slate-400">{category.warna}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openCategoryForm(category)}
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'delete', item: category, entity: 'category' })}
                    className="grid size-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                Belum ada kategori kegiatan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIVISION FORM */}
      {modal?.type === 'division' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form onSubmit={saveDivision} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {modal.item ? 'Edit Divisi' : 'Tambah Divisi'}
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
                  value={divisionForm.nama}
                  onChange={(e) => setDivisionForm({ ...divisionForm, nama: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Palette className="size-3.5" /> Warna
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={divisionForm.warna}
                    onChange={(e) => setDivisionForm({ ...divisionForm, warna: e.target.value })}
                    className="size-9 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <input
                    value={divisionForm.warna}
                    onChange={(e) => setDivisionForm({ ...divisionForm, warna: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 font-mono text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Deskripsi</label>
                <textarea
                  value={divisionForm.deskripsi}
                  onChange={(e) => setDivisionForm({ ...divisionForm, deskripsi: e.target.value })}
                  rows={3}
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
                className="rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d417d] cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORY FORM */}
      {modal?.type === 'category' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form onSubmit={saveCategory} className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {modal.item ? 'Edit Kategori' : 'Tambah Kategori'}
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
                <label className="mb-1 block text-xs font-bold text-slate-700">Nama Kategori</label>
                <input
                  value={categoryForm.nama}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nama: e.target.value })}
                  required
                  placeholder="Contoh: Rapat Evaluasi"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Palette className="size-3.5" /> Warna
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={categoryForm.warna}
                    onChange={(e) => setCategoryForm({ ...categoryForm, warna: e.target.value })}
                    className="size-9 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <input
                    value={categoryForm.warna}
                    onChange={(e) => setCategoryForm({ ...categoryForm, warna: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 font-mono text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  />
                </div>
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
                className="rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d417d] cursor-pointer"
              >
                Simpan
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
            <h3 className="mt-3 text-base font-extrabold text-slate-900">
              Hapus {modal.entity === 'division' ? 'Divisi' : 'Kategori'}?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              <b>{modal.item.nama}</b> akan dihapus dari pengaturan organisasi.
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
                onClick={confirmDelete}
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
