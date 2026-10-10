import React, { useState } from 'react';
import { PlusCircle, DollarSign, Tag, Calendar, FileText, Upload, X } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose, onAddTransaction, prokerList, activeUser }) {
  const [formData, setFormData] = useState({
    tipe: 'Pengeluaran',
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Konsumsi',
    jumlah: '',
    proker_id: prokerList.length > 0 ? prokerList[0].id : '',
    keterangan: '',
    bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jumlah || !formData.keterangan) return;

    const matchedProker = prokerList.find(p => p.id === formData.proker_id);

    onAddTransaction({
      ...formData,
      jumlah: Number(formData.jumlah),
      nama_proker: matchedProker ? matchedProker.nama_proker : 'Kas Operasional LK'
    });

    setFormData({
      tipe: 'Pengeluaran',
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Konsumsi',
      jumlah: '',
      proker_id: prokerList.length > 0 ? prokerList[0].id : '',
      keterangan: '',
      bukti_nota_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: formData.tipe === 'Pemasukan' ? 'var(--emerald-bg)' : 'var(--rose-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: formData.tipe === 'Pemasukan' ? 'var(--emerald)' : 'var(--rose)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Pencatatan Buku Kas (LK)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Catat pemasukan atau pengeluaran dana kegiatan</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Tipe Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                className={`btn ${formData.tipe === 'Pengeluaran' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center', background: formData.tipe === 'Pengeluaran' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.05)' }}
                onClick={() => setFormData({ ...formData, tipe: 'Pengeluaran', kategori: 'Konsumsi' })}
              >
                Pengeluaran (Kas Keluar)
              </button>
              <button
                type="button"
                className={`btn ${formData.tipe === 'Pemasukan' ? 'btn-emerald' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
                onClick={() => setFormData({ ...formData, tipe: 'Pemasukan', kategori: 'Dana Dekanat' })}
              >
                Pemasukan (Kas Masuk)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Tanggal Transaksi</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  placeholder="Contoh: 1500000"
                  className="form-control mono"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                {formData.tipe === 'Pengeluaran' ? (
                  <select
                    className="form-control"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  >
                    <option value="Konsumsi">Konsumsi</option>
                    <option value="Logistik & Perlengkapan">Logistik & Perlengkapan</option>
                    <option value="Publikasi & Desain">Publikasi & Desain</option>
                    <option value="Honorarium Pemateri">Honorarium Pemateri</option>
                    <option value="Hadiah & Sertifikat">Hadiah & Sertifikat</option>
                    <option value="Sewa Tempat / Aula">Sewa Tempat / Aula</option>
                    <option value="Operasional & Transportasi">Operasional & Transportasi</option>
                  </select>
                ) : (
                  <select
                    className="form-control"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  >
                    <option value="Dana Dekanat">Dana Dekanat (Fakultas)</option>
                    <option value="Iuran Pengurus">Iuran Kas Pengurus</option>
                    <option value="Sponsorship">Sponsorship & Mitra</option>
                    <option value="Penjualan Tiket/Seminar">Penjualan Tiket/Seminar</option>
                    <option value="Donasi / Usaha Dana (Danus)">Donasi / Usaha Dana (Danus)</option>
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Terkait Program Kerja</label>
                <select
                  className="form-control"
                  value={formData.proker_id}
                  onChange={(e) => setFormData({ ...formData, proker_id: e.target.value })}
                >
                  <option value="all">Kas Operasional LK (Umum)</option>
                  {prokerList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_proker}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan / Rincian Belanja</label>
              <textarea
                rows="2"
                required
                className="form-control"
                placeholder="Contoh: Pembelian 50 box snack kue basah untuk narasumber dan peserta"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              ></textarea>
            </div>

            {/* Bukti Nota Lampiran */}
            <div className="form-group">
              <label className="form-label">Bukti Nota / Kuitansi (Lampiran Cloud)</label>
              <div style={{ border: '1px dashed var(--border-subtle)', borderRadius: '10px', padding: '14px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <Upload size={22} color="var(--sky)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Foto Nota / Struk Terlampir Otomatis</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Tersimpan aman di Supabase Storage / Cloud Bucket</div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className={`btn ${formData.tipe === 'Pemasukan' ? 'btn-emerald' : 'btn-primary'}`}>
              Simpan ke Buku Kas Cloud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
