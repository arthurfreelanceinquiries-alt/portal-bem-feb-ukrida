import React, { useState } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  Copy,
  ShieldCheck,
  FolderOpen,
  Info,
  Check
} from 'lucide-react';

export default function ResourceHub({ documents = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [copiedId, setCopiedId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const categories = ['Semua', 'Proposal & LPJ', 'Surat Perizinan', 'Media & Branding', 'Keuangan'];

  const filteredDocs = documents.filter((doc) => {
    const matchCat = selectedKategori === 'Semua' || doc.kategori === selectedKategori;
    const matchQuery =
      doc.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleSimulatedDownload = (doc) => {
    setDownloadSuccessId(doc.id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 3000);
  };

  const handleCopyFormat = (doc) => {
    const textToCopy = `*FORMAT RESMI BEM FEB UKRIDA*\nJudul Dokumen: ${doc.judul}\nKategori: ${doc.kategori}\nFormat: ${doc.format}\nSyarat Pengajuan:\n${doc.syarat.map((s, idx) => ` ${idx + 1}. ${s}`).join('\n')}\n\n_Harap koordinasikan dengan Sekretariat BEM FEB sebelum diserahkan ke Dekanat._`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(doc.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="resource-hub-module">
      {/* Header Banner */}
      <div className="panel-header" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen size={22} color="var(--sky)" />
            <span>Pusat Dokumen Resmi & Template BEM FEB UKRIDA</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Standar administrasi resmi Dekanat FEB: Format Proposal, LPJ, Surat Izin Gedung, & Media Kit
          </div>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Cari template dokumen..."
            className="form-input"
            style={{ paddingLeft: '36px', paddingRight: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedKategori === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedKategori(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            style={{
              background: 'rgba(15, 31, 56, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="badge badge-sky" style={{ fontSize: '0.72rem' }}>
                  {doc.kategori}
                </span>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--amber)', background: 'var(--amber-bg)', padding: '2px 8px', borderRadius: '6px' }}>
                  {doc.format} • {doc.ukuran}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '10px', lineHeight: 1.35 }}>
                {doc.judul}
              </h3>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                {doc.deskripsi}
              </p>

              {/* Persyaratan Dekanat Box */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '18px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={13} /> Ketentuan Dekanat & Biro
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {doc.syarat.map((s, idx) => (
                    <li key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={12} color="var(--emerald)" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleSimulatedDownload(doc)}
                >
                  {downloadSuccessId === doc.id ? (
                    <>
                      <Check size={15} color="#fff" /> Terunduh!
                    </>
                  ) : (
                    <>
                      <Download size={15} /> Unduh File
                    </>
                  )}
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  title="Salin ringkasan ke clipboard"
                  onClick={() => handleCopyFormat(doc)}
                >
                  {copiedId === doc.id ? <Check size={15} color="var(--emerald)" /> : <Copy size={15} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                <span>Revisi: {doc.diperbarui}</span>
                <span>Standar Mutu BEM FEB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <Info size={32} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
          <div>Tidak ada dokumen resmi yang sesuai dengan pencarian.</div>
        </div>
      )}
    </div>
  );
}
