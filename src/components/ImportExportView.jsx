import React, { useMemo, useRef, useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Database,
  History,
  ArrowRight,
  X,
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

const TARGET_FIELDS = [
  { key: 'nim', label: 'NIM', aliases: ['nim', 'nomor induk', 'nis'] },
  { key: 'nama', label: 'Nama', aliases: ['nama', 'name', 'nama lengkap'] },
  { key: 'divisi', label: 'Divisi', aliases: ['divisi', 'division', 'departemen'] },
  { key: 'jabatan', label: 'Jabatan', aliases: ['jabatan', 'position', 'role'] },
  { key: 'hp', label: 'No HP', aliases: ['hp', 'phone', 'telepon', 'whatsapp', 'wa'] },
  { key: 'email', label: 'Email', aliases: ['email', 'surel', 'e-mail'] },
];

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, '').replace(/\r/g, '');
  const lines = clean.split('\n').filter((line) => line.trim().length > 0);
  return lines.map(parseCSVLine);
}

function autoMap(headers) {
  const mapping = {};
  TARGET_FIELDS.forEach((field) => {
    const found = headers.find((header) => {
      const h = String(header).toLowerCase().trim();
      return field.aliases.some((alias) => h === alias || h.includes(alias));
    });
    mapping[field.key] = found || '';
  });
  return mapping;
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export default function ImportExportView() {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [logsVersion, setLogsVersion] = useState(0);
  const [toast, setToast] = useState(null);

  const members = useMemo(() => readLocal(STORAGE.members, []), [logsVersion]);
  const logs = useMemo(
    () => readLocal(STORAGE.importLogs, []).slice().sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp))),
    [logsVersion]
  );

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3600);
  };

  const resetFile = () => {
    setFileName('');
    setHeaders([]);
    setRows([]);
    setMapping({});
    if (fileRef.current) fileRef.current.value = '';
  };

  const processFile = (file) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
      showToast('Format Excel belum didukung di browser. Simpan sebagai CSV lalu unggah kembali.', 'error');
      return;
    }
    if (!lower.endsWith('.csv')) {
      showToast('Format file harus .csv', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = parseCSV(String(event.target?.result || ''));
        if (parsed.length < 2 || parsed[0].length < 2) {
          showToast('CSV tidak valid atau tidak memiliki baris data.', 'error');
          return;
        }
        setFileName(file.name);
        setHeaders(parsed[0]);
        setRows(parsed.slice(1));
        setMapping(autoMap(parsed[0]));
        showToast(`${parsed.length - 1} baris data terbaca dari ${file.name}.`);
      } catch {
        showToast('Gagal membaca file CSV. Periksa format file Anda.', 'error');
      }
    };
    reader.onerror = () => showToast('File gagal dibaca.', 'error');
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleConfirmImport = () => {
    if (!mapping.nim || !mapping.nama) {
      showToast('Kolom NIM dan Nama wajib dipetakan.', 'error');
      return;
    }
    const nimIndex = headers.indexOf(mapping.nim);
    const namaIndex = headers.indexOf(mapping.nama);
    if (nimIndex < 0 || namaIndex < 0) {
      showToast('Kolom mapping tidak valid.', 'error');
      return;
    }

    const existing = readLocal(STORAGE.members, []);
    const next = existing.slice();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    rows.forEach((row) => {
      const nim = String(row[nimIndex] || '').trim();
      const nama = String(row[namaIndex] || '').trim();
      if (!nim || !nama) {
        skipped += 1;
        return;
      }
      const record = { nim, nama, name: nama, status: 'Aktif' };
      TARGET_FIELDS.forEach((field) => {
        if (field.key === 'nim' || field.key === 'nama') return;
        const header = mapping[field.key];
        if (!header) return;
        const index = headers.indexOf(header);
        if (index >= 0) record[field.key] = String(row[index] || '').trim();
      });
      if (record.hp && !record.phone) record.phone = record.hp;

      const index = next.findIndex((m) => String(m.nim) === nim);
      if (index >= 0) {
        next[index] = { ...next[index], ...record, id: next[index].id || uid('M') };
        updated += 1;
      } else {
        next.push({ id: uid('M'), ...record });
        created += 1;
      }
    });

    writeLocal(STORAGE.members, next);

    const actor = getCurrentActor();
    const newLog = {
      id: uid('imp'),
      timestamp: new Date().toISOString(),
      fileName,
      rowCount: rows.length,
      created,
      updated,
      skipped,
      importedBy: actor,
    };
    const importLogs = readLocal(STORAGE.importLogs, []);
    writeLocal(STORAGE.importLogs, [newLog, ...importLogs]);

    logActivity({
      actor,
      type: 'import',
      text: `Import CSV ${fileName}: ${created} baru, ${updated} diperbarui, ${skipped} dilewati.`,
    });
    pushNotification({
      type: 'success',
      text: `Import ${fileName} selesai (${created + updated} data diproses).`,
    });
    setLogsVersion((v) => v + 1);
    showToast(`Import selesai — ${created} anggota baru, ${updated} diperbarui.`);
    resetFile();
  };

  const handleExport = () => {
    const data = readLocal(STORAGE.members, []);
    if (data.length === 0) {
      showToast('Belum ada data anggota untuk diekspor.', 'error');
      return;
    }
    const header = ['NIM', 'Nama', 'Divisi', 'Jabatan', 'No HP', 'Email'];
    const lines = data.map((m) =>
      [m.nim, m.nama || m.name, m.divisi, m.jabatan, m.hp || m.phone, m.email].map(csvValue).join(',')
    );
    const blob = new Blob([`${header.join(',')}\n${lines.join('\n')}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_Fungsionaris_BEM_FEB_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logActivity({ actor: getCurrentActor(), type: 'export', text: `Mengekspor ${data.length} data fungsionaris ke CSV.` });
    showToast(`${data.length} data fungsionaris berhasil diekspor.`);
  };

  const mappedPreview = rows.slice(0, 10).map((row) => {
    const item = {};
    TARGET_FIELDS.forEach((field) => {
      const header = mapping[field.key];
      item[field.key] = header ? row[headers.indexOf(header)] : '';
    });
    return item;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="SINKRONISASI DATA MASSAL • ABMAS PATTERN"
        title="Import & Export Data"
        description="Tarik dan lepas file CSV untuk menambah atau memperbarui data fungsionaris sekaligus. Ekspor seluruh database ke CSV kapan pun dibutuhkan."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0d417d] cursor-pointer"
          >
            <Download className="size-3.5 text-[#F7C828]" />
            <span>Export Semua Anggota</span>
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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Total Data Anggota</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{members.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Batch Import</p>
          <p className="mt-1 text-2xl font-extrabold text-[#13539D]">{logs.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Baris Terbaca</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Kolom Terdeteksi</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">
            {Object.values(mapping).filter(Boolean).length}/{TARGET_FIELDS.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          {/* Dropzone */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragActive
                  ? 'border-[#13539D] bg-blue-50/60'
                  : 'border-slate-300 bg-slate-50/50 hover:border-[#13539D] hover:bg-blue-50/30'
              }`}
            >
              <div className="grid size-14 place-items-center rounded-2xl bg-[#13539D] text-[#F7C828] shadow-sm">
                <Upload className="size-6" />
              </div>
              <p className="mt-4 text-sm font-extrabold text-slate-900">
                Tarik & lepas file CSV di sini
              </p>
              <p className="mt-1 text-xs text-slate-500">
                atau <span className="font-bold text-[#13539D]">klik untuk memilih file</span> (.csv)
              </p>
              <p className="mt-2 font-mono text-[10px] text-slate-400">
                Format didukung: CSV dengan header NIM, Nama, Divisi, Jabatan, No HP, Email
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => processFile(e.target.files?.[0])}
              />
            </div>

            {fileName && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="size-5 text-[#13539D]" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{fileName}</p>
                    <p className="text-[10px] text-slate-500">{rows.length} baris data siap dipetakan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetFile}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <X className="size-3.5" /> Batalkan
                </button>
              </div>
            )}
          </div>

          {/* Mapping */}
          {headers.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Database className="size-4 text-[#13539D]" /> Mapping Kolom
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Cocokkan kolom CSV dengan field sistem. Kolom NIM dan Nama wajib dipetakan.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TARGET_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                      {field.label}
                      {(field.key === 'nim' || field.key === 'nama') && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>
                    <select
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                      className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                        mapping[field.key]
                          ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                          : 'border-slate-200 bg-slate-50/60 text-slate-500'
                      }`}
                    >
                      <option value="">— Tidak dipetakan —</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-slate-500">
                  {Object.values(mapping).filter(Boolean).length} dari {TARGET_FIELDS.length} kolom terpetakan otomatis.
                </p>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5 text-[#F7C828]" />
                  Konfirmasi Import
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-extrabold text-slate-900">Preview 10 Baris Pertama</h3>
                <AdminBadge variant="yellow">{rows.length} baris</AdminBadge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5">#</th>
                      {TARGET_FIELDS.map((f) => (
                        <th key={f.key} className="px-3 py-2.5">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mappedPreview.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/70">
                        <td className="px-3 py-2 font-mono text-slate-400">{index + 1}</td>
                        {TARGET_FIELDS.map((f) => (
                          <td key={f.key} className="max-w-[180px] truncate px-3 py-2 text-slate-700">
                            {row[f.key] || <span className="text-slate-300">-</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Import history */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <History className="size-4 text-[#13539D]" /> Log Import Batch
            </h3>
            <p className="mt-1 text-xs text-slate-500">Riwayat batch import terakhir beserta pelakunya.</p>
            <div className="mt-4 space-y-2.5">
              {logs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 py-9 text-center">
                  <FileSpreadsheet className="mx-auto size-7 text-slate-300" />
                  <p className="mt-2 text-xs text-slate-400">Belum ada riwayat import.</p>
                </div>
              ) : (
                logs.slice(0, 10).map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-bold text-slate-900">{log.fileName}</p>
                      <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-[#13539D]">
                        {log.rowCount} baris
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-slate-500">{formatDateTimeID(log.timestamp)}</p>
                    <p className="mt-1 text-[10px] text-slate-600">
                      oleh <b>{log.importedBy}</b> • {log.created || 0} baru, {log.updated || 0} update
                      {log.skipped ? `, ${log.skipped} dilewati` : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#13539D]">
              <Download className="size-4" /> Export Database
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Unduh seluruh data fungsionaris ({members.length} baris) dalam format CSV yang siap dibuka di Excel atau Google Sheets.
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#13539D] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] cursor-pointer"
            >
              <Download className="size-3.5" /> Unduh CSV Sekarang
            </button>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
              <ArrowRight className="size-3" /> Termasuk perubahan dari import terbaru.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
