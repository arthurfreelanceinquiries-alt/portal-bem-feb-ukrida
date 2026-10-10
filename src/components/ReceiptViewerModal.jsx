import React from 'react';
import { X, CheckCircle2, Calendar, User, Tag, Download, ExternalLink } from 'lucide-react';

export default function ReceiptViewerModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Bukti Transaksi & Audit LPJ</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {transaction.id}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {transaction.tipe} ({transaction.kategori})
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: transaction.tipe === 'Pemasukan' ? 'var(--emerald)' : '#fff' }} className="mono">
              Rp {Number(transaction.jumlah).toLocaleString('id-ID')}
            </div>
            <div style={{ marginTop: '8px' }}>
              <span className="badge badge-emerald">
                <CheckCircle2 size={13} /> {transaction.status_verifikasi || 'Terverifikasi Bendahara'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Tanggal Transaksi</span>
              <strong>{transaction.tanggal}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Dicatat Oleh</span>
              <strong>{transaction.dicatat_oleh}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Program Kerja</span>
              <strong>{transaction.nama_proker || 'Kas Umum'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Kategori Belanja</span>
              <strong>{transaction.kategori}</strong>
            </div>
          </div>

          <div style={{ marginBottom: '18px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Keterangan / Rincian</span>
            <p style={{ fontSize: '0.86rem', color: '#fff' }}>{transaction.keterangan}</p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>Lampiran Fisik Kuitansi / Struk</span>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)', maxHeight: '200px' }}>
              <img
                src={transaction.bukti_nota_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'}
                alt="Bukti Kuitansi"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
          <a
            href={transaction.bukti_nota_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={16} /> Lihat Ukuran Penuh
          </a>
        </div>
      </div>
    </div>
  );
}
