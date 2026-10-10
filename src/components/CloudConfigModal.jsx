import React, { useState } from 'react';
import { Cloud, CheckCircle2, AlertTriangle, Key, ExternalLink, X, Database, Copy, Check } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials } from '../lib/supabase';

export default function CloudConfigModal({ isOpen, onClose, onConfigSaved }) {
  const current = getSupabaseCredentials();
  const [url, setUrl] = useState(current.url);
  const [key, setKey] = useState(current.key);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!url || !key) {
      saveSupabaseCredentials('', '');
      setStatusMsg({ type: 'info', text: 'Konfigurasi cloud dihapus. Portal kini berjalan dalam mode Demo Lokal.' });
      onConfigSaved();
      return;
    }

    if (!url.includes('supabase.co')) {
      setStatusMsg({ type: 'error', text: 'URL Supabase harus berformat: https://xxxx.supabase.co' });
      return;
    }

    saveSupabaseCredentials(url, key);
    setStatusMsg({ type: 'success', text: 'Konfigurasi Cloud Database Supabase berhasil disimpan! Data tersinkronisasi.' });
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 1200);
  };

  const handleCopySQL = () => {
    const sqlText = `-- Jalankan ini di Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS proker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nama_proker TEXT NOT NULL,
  departemen TEXT NOT NULL,
  pj TEXT NOT NULL,
  target_selesai DATE,
  pagu_anggaran NUMERIC DEFAULT 0 NOT NULL,
  realisasi_anggaran NUMERIC DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'Diajukan' NOT NULL,
  deskripsi TEXT,
  diajukan_oleh TEXT,
  disetujui_oleh TEXT
);

CREATE TABLE IF NOT EXISTS transaksi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE NOT NULL,
  tipe TEXT NOT NULL,
  kategori TEXT NOT NULL,
  jumlah NUMERIC NOT NULL,
  keterangan TEXT NOT NULL,
  proker_id TEXT,
  nama_proker TEXT,
  dicatat_oleh TEXT NOT NULL,
  bukti_nota_url TEXT,
  status_verifikasi TEXT DEFAULT 'Terverifikasi' NOT NULL
);`;
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky)' }}>
              <Cloud size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Pengaturan Cloud Database</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sinkronisasi multi-user via Supabase (PostgreSQL)</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: current.isConfigured ? 'var(--emerald-bg)' : 'var(--amber-bg)', border: `1px solid ${current.isConfigured ? 'var(--border-emerald)' : 'rgba(245, 158, 11, 0.3)'}`, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {current.isConfigured ? (
              <>
                <CheckCircle2 size={22} color="var(--emerald)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Status Cloud: Terhubung</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data otomatis tersimpan ke server Supabase PostgreSQL.</div>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={22} color="var(--amber)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Status: Mode Demo Lokal (Offline-first)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aplikasi berjalan lancar di browser & HP. Masukkan URL & Anon Key di bawah untuk aktifkan cloud online.</div>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Project URL Supabase</label>
              <input
                type="text"
                className="form-control mono"
                placeholder="https://xyzabcdefg.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Buka supabase.com ➔ Project Settings ➔ API ➔ Project URL
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Project API Key (Anon / Public Key)</label>
              <input
                type="password"
                className="form-control mono"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Gunakan kunci 'anon' 'public', jangan gunakan 'service_role' di klien.
              </span>
            </div>

            {statusMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '16px', background: statusMsg.type === 'success' ? 'var(--emerald-bg)' : statusMsg.type === 'error' ? 'var(--rose-bg)' : 'rgba(255,255,255,0.05)', color: statusMsg.type === 'success' ? 'var(--emerald)' : statusMsg.type === 'error' ? 'var(--rose)' : 'var(--sky)' }}>
                {statusMsg.text}
              </div>
            )}

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--sky)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={15} /> Script Skema Tabel SQL
                </span>
                <button
                  type="button"
                  onClick={handleCopySQL}
                  style={{ background: 'none', border: 'none', color: copied ? 'var(--emerald)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Tersalin!' : 'Salin SQL'}
                </button>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                File lengkap <code style={{ color: 'var(--sky)' }}>supabase_schema.sql</code> sudah dibuat di folder proyek Anda. Tinggal copy-paste ke SQL Editor di dashboard Supabase.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Tutup
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan & Hubungkan Cloud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
