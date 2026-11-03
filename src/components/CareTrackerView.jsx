import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Heart,
  Phone,
  CheckCircle2,
  Users,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { AdminPageHeader, AdminBadge } from './common/AdminComponents';
import {
  MOCK_FUNGSIONARIS,
  STORAGE,
  readLocal,
  writeLocal,
  initials,
  formatDateID,
  formatDateTimeID,
  logActivity,
  pushNotification,
  getCurrentActor,
} from '../domain/mockData';

function WhatsAppIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function waLink(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export default function CareTrackerView() {
  const sessions = useMemo(
    () =>
      readLocal(STORAGE.absensi, [])
        .slice()
        .sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal))),
    []
  );
  const members = useMemo(() => readLocal(STORAGE.members, MOCK_FUNGSIONARIS), []);
  const [careRecords, setCareRecords] = useState(() => readLocal(STORAGE.careRecords, []));
  const [division, setDivision] = useState('Semua');

  const divisions = useMemo(
    () => ['Semua', ...Array.from(new Set(members.map((m) => m.divisi).filter(Boolean)))],
    [members]
  );

  const atRisk = useMemo(() => {
    const handledMap = new Map(careRecords.map((record) => [record.nim, record]));
    return members
      .map((member) => {
        let streak = 0;
        let lastPresent = null;
        for (const session of sessions) {
          const record = (session.records || []).find((r) => String(r.nim) === String(member.nim));
          if (!record) continue;
          if (record.status === 'Tidak Hadir' || record.status === 'Alfa') {
            streak += 1;
          } else {
            if (record.status === 'Hadir' && !lastPresent) lastPresent = session.tanggal;
            break;
          }
        }
        return {
          ...member,
          name: member.nama || member.name,
          streak,
          lastPresent,
          handled: handledMap.get(member.nim) || null,
        };
      })
      .filter((member) => member.streak >= 3)
      .sort((a, b) => b.streak - a.streak);
  }, [members, sessions, careRecords]);

  const filtered = division === 'Semua' ? atRisk : atRisk.filter((m) => m.divisi === division);
  const highCount = atRisk.filter((m) => m.streak > 5).length;
  const handledCount = atRisk.filter((m) => m.handled).length;

  const markHandled = (member) => {
    const nextRecord = {
      nim: member.nim,
      nama: member.name,
      divisi: member.divisi,
      handledAt: new Date().toISOString(),
      handledBy: getCurrentActor(),
      note: 'Sudah dihubungi dan ditindaklanjuti.',
    };
    const next = [nextRecord, ...careRecords.filter((record) => record.nim !== member.nim)];
    setCareRecords(next);
    writeLocal(STORAGE.careRecords, next);
    logActivity({
      actor: getCurrentActor(),
      type: 'care',
      text: `Menandai ${member.name} (${member.streak} absen berturut) sudah ditangani.`,
    });
    pushNotification({ type: 'success', text: `Tindak lanjut ${member.name} tercatat.` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="KEPEDULIAN ANGGOTA • ABMAS CARE TRACKER"
        title="Monitoring Anggota Tidak Aktif"
        description="Deteksi fungsionaris dengan absensi tidak hadir berturut-turut, hubungi mereka secara personal, dan catat tindak lanjut agar tidak ada anggota yang tertinggal."
        action={
          <div className="flex items-center gap-2">
            <AdminBadge variant={highCount > 0 ? 'danger' : 'green'}>
              {atRisk.length} anggota perlu perhatian
            </AdminBadge>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Dipantau</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{members.length}</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-rose-700">Perhatian Tinggi</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">{highCount}</p>
          <p className="text-[10px] text-rose-600">&gt; 5 absen berturut</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-amber-700">Perlu Perhatian</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{atRisk.length - highCount}</p>
          <p className="text-[10px] text-amber-600">3-5 absen berturut</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-emerald-700">Sudah Ditangani</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{handledCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <Filter className="size-3.5" /> Filter Divisi
        </div>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#13539D] focus:outline-none"
        >
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d === 'Semua' ? 'Semua Divisi' : d}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/30 py-16 text-center">
          <ShieldCheck className="mx-auto size-10 text-emerald-500" />
          <h3 className="mt-3 text-sm font-extrabold text-emerald-800">Semua anggota aktif 🎉</h3>
          <p className="mt-1 text-xs text-emerald-700">
            Tidak ada fungsionaris dengan 3 absensi tidak hadir berturut-turut di filter ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => {
            const high = member.streak > 5;
            return (
              <div
                key={member.nim}
                className={`rounded-3xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                  member.handled
                    ? 'border-emerald-200'
                    : high
                    ? 'border-rose-200'
                    : 'border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
                        high ? 'bg-rose-600' : 'bg-amber-500'
                      }`}
                    >
                      {initials(member.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{member.name}</h3>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {member.divisi} • {member.jabatan || 'Fungsionaris'}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">NIM: {member.nim}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                      high
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    <AlertTriangle className="size-3" />
                    {high ? 'Perhatian Tinggi' : 'Perhatian'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="font-mono text-[9px] font-bold uppercase text-slate-400">Absen Berturut</p>
                    <p className={`mt-0.5 text-xl font-extrabold ${high ? 'text-rose-700' : 'text-amber-700'}`}>
                      {member.streak}×
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="font-mono text-[9px] font-bold uppercase text-slate-400">Terakhir Hadir</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">
                      {member.lastPresent ? formatDateID(member.lastPresent) : 'Tidak tercatat'}
                    </p>
                  </div>
                </div>

                {member.handled ? (
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3">
                    <p className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="size-3.5" /> Sudah ditangani
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] text-emerald-600">
                      {formatDateTimeID(member.handled.handledAt)} • {member.handled.handledBy}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    <a
                      href={waLink(member.hp || member.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                    >
                      <WhatsAppIcon className="size-4" /> Hubungi via WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => markHandled(member)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5" /> Tandai Sudah Ditangani
                    </button>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" /> {member.hp || member.phone || '-'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-rose-500">
                    <Heart className="size-3" /> Care Tracker
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-[11px] leading-relaxed text-slate-600">
        <Users className="size-4 shrink-0 text-[#13539D]" />
        Anggota dihitung otomatis dari sesi absensi terakhir. Tiga kali tidak hadir berturut-turut akan
        memunculkan kartu perhatian; lebih dari lima kali masuk kategori perhatian tinggi.
      </div>
    </div>
  );
}
