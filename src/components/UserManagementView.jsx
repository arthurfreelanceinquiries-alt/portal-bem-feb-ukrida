import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  KeyRound,
  Users,
  AlertCircle,
} from 'lucide-react';
import { AdminPageHeader, AdminBadge } from './common/AdminComponents';
import {
  STORAGE,
  readLocal,
  writeLocal,
  uid,
  initials,
  formatDateID,
  logActivity,
  pushNotification,
  getCurrentActor,
} from '../domain/mockData';

const ROLE_OPTIONS = [
  { value: 'ADMIN_UTAMA', label: 'Admin Utama', desc: 'Akses penuh seluruh modul portal', variant: 'blue' },
  { value: 'TIM_ABSENSI', label: 'Tim Absensi', desc: 'Fokus input & rekap presensi rapat', variant: 'yellow' },
  { value: 'BPH_ANGGOTA', label: 'BPH Anggota', desc: 'Akses operasional BPH terbatas', variant: 'green' },
];

const ROLE_STYLE = {
  ADMIN_UTAMA: 'bg-blue-50 text-[#13539D] border-blue-200',
  TIM_ABSENSI: 'bg-amber-50 text-amber-700 border-amber-200',
  BPH_ANGGOTA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const EMPTY_FORM = {
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'BPH_ANGGOTA',
  active: true,
};

export default function UserManagementView() {
  const [users, setUsers] = useState(() => readLocal(STORAGE.portalUsers, []));
  const [modal, setModal] = useState(null); // { type: 'form', user? } | { type: 'delete', user }
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3000);
  };

  const persist = (next) => {
    setUsers(next);
    writeLocal(STORAGE.portalUsers, next);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowPassword(false);
    setModal({ type: 'form', user: null });
  };

  const openEdit = (user) => {
    setForm({
      username: user.username,
      name: user.name,
      email: user.email || '',
      password: '',
      role: user.role,
      active: user.active !== false,
    });
    setShowPassword(false);
    setModal({ type: 'form', user });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const editing = modal?.user;
    const username = form.username.trim().toLowerCase();
    const name = form.name.trim();

    if (!username || !name) {
      showToast('NIM/email dan nama wajib diisi.', 'error');
      return;
    }
    if (!editing && form.password.length < 6) {
      showToast('Password minimal 6 karakter.', 'error');
      return;
    }
    if (editing && form.password && form.password.length < 6) {
      showToast('Password baru minimal 6 karakter.', 'error');
      return;
    }
    const duplicate = users.some(
      (u) => u.id !== editing?.id && String(u.username).toLowerCase() === username
    );
    if (duplicate) {
      showToast('NIM/email tersebut sudah terdaftar.', 'error');
      return;
    }

    if (editing) {
      const next = users.map((u) =>
        u.id === editing.id
          ? {
              ...u,
              username,
              name,
              email: form.email.trim(),
              role: form.role,
              active: form.active,
              ...(form.password ? { password: form.password } : {}),
            }
          : u
      );
      persist(next);
      logActivity({ actor: getCurrentActor(), type: 'user', text: `Memperbarui akun portal ${name}.` });
      showToast('Akun portal berhasil diperbarui.');
    } else {
      const newUser = {
        id: uid('usr'),
        username,
        name,
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        active: form.active,
        createdAt: new Date().toISOString(),
      };
      persist([newUser, ...users]);
      logActivity({ actor: getCurrentActor(), type: 'user', text: `Menambahkan akun portal ${name} (${form.role}).` });
      pushNotification({ type: 'success', text: `Akun portal ${name} berhasil dibuat.` });
      showToast('Akun portal berhasil ditambahkan.');
    }
    setModal(null);
  };

  const toggleActive = (user) => {
    const next = users.map((u) => (u.id === user.id ? { ...u, active: u.active === false } : u));
    persist(next);
    showToast(`Akun ${user.name} ${user.active === false ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  const handleDelete = () => {
    if (!modal?.user) return;
    persist(users.filter((u) => u.id !== modal.user.id));
    logActivity({ actor: getCurrentActor(), type: 'user', text: `Menghapus akun portal ${modal.user.name}.` });
    showToast(`Akun ${modal.user.name} dihapus.`);
    setModal(null);
  };

  const activeCount = users.filter((u) => u.active !== false).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="KEAMANAN & AKUN PORTAL • ABMAS PATTERN"
        title="Manajemen Akun Portal"
        description="Kelola akun yang boleh masuk ke Portal Admin BEM FEB UKRIDA. Atur peran, reset password, dan nonaktifkan akses tanpa menghapus riwayat data."
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0d417d] cursor-pointer"
          >
            <Plus className="size-3.5 text-[#F7C828]" />
            <span>Tambah User</span>
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
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Total Akun</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-emerald-700">Aktif</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-[#13539D]">Admin Utama</p>
          <p className="mt-1 text-2xl font-extrabold text-[#13539D]">
            {users.filter((u) => u.role === 'ADMIN_UTAMA').length}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-amber-700">Tim Absensi</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">
            {users.filter((u) => u.role === 'TIM_ABSENSI').length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <UserCog className="size-4 text-[#13539D]" /> Daftar Akun Login Admin
          </h3>
          <AdminBadge variant="blue">{activeCount} aktif</AdminBadge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Pengguna</th>
                <th className="px-5 py-3 font-semibold">Email / NIM</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Password</th>
                <th className="px-5 py-3 text-center font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    Belum ada akun portal. Tambahkan akun pertama Anda.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const visible = Boolean(visiblePasswords[user.id]);
                  const roleMeta = ROLE_OPTIONS.find((r) => r.value === user.role);
                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#13539D] text-[11px] font-bold text-white">
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="font-mono text-[10px] text-slate-400">
                              Dibuat {formatDateID(user.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-[11px] text-slate-800">{user.username}</p>
                        <p className="text-[10px] text-slate-400">{user.email || '-'}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ROLE_STYLE[user.role] || ROLE_STYLE.BPH_ANGGOTA}`}>
                          <ShieldCheck className="size-3" />
                          {roleMeta?.label || user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-slate-700">
                            {visible ? user.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVisiblePasswords((p) => ({ ...p, [user.id]: !p[user.id] }))}
                            className="text-slate-400 transition hover:text-slate-700 cursor-pointer"
                            title={visible ? 'Sembunyikan password' : 'Lihat password'}
                          >
                            {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleActive(user)}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                            user.active !== false
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${user.active !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {user.active !== false ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            title="Edit akun"
                            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ type: 'delete', user })}
                            title="Hapus akun"
                            className="grid size-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
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
      </div>

      {modal?.type === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {modal.user ? 'Edit Akun Portal' : 'Tambah Akun Portal'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Akun ini dapat digunakan untuk masuk ke Portal Admin.
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

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">NIM / Username</label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    placeholder="312023002"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 font-mono text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Nama Lengkap</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Nama pengguna"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@civitas.ukrida.ac.id"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {modal.user ? 'Reset Password (kosongkan jika tidak diubah)' : 'Password'}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!modal.user}
                    minLength={6}
                    placeholder={modal.user ? 'Password baru (opsional)' : 'Minimal 6 karakter'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-10 text-xs text-slate-800 focus:border-[#13539D] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Role Akses</label>
                <div className="grid gap-2">
                  {ROLE_OPTIONS.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                        form.role === role.value
                          ? 'border-[#13539D] bg-blue-50/60'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-4 place-items-center rounded-full border-2 ${
                          form.role === role.value ? 'border-[#13539D]' : 'border-slate-300'
                        }`}
                      >
                        {form.role === role.value && <span className="size-2 rounded-full bg-[#13539D]" />}
                      </span>
                      <span>
                        <span className="block text-xs font-bold text-slate-900">{role.label}</span>
                        <span className="block text-[10px] text-slate-500">{role.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
                <span className="text-xs font-bold text-slate-700">Status akun aktif</span>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="size-4 cursor-pointer accent-[#13539D]"
                />
              </label>
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
                {modal.user ? 'Simpan Perubahan' : 'Tambah User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {modal?.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="size-5" />
            </div>
            <h3 className="mt-3 text-base font-extrabold text-slate-900">Hapus Akun Portal?</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Akun <b>{modal.user.name}</b> tidak akan bisa login lagi. Riwayat aktivitas tetap tersimpan.
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
