import React, { useState } from 'react';
import { Calendar, DollarSign, User, Building2, X, PlusCircle } from 'lucide-react';

export default function AddProkerModal({ isOpen, onClose, onAddProker, activeUser }) {
  const [formData, setFormData] = useState({
    nama_proker: '',
    departemen: 'Departemen Akademik & Karier',
    pj: activeUser.name,
    target_selesai: '',
    pagu_anggaran: '',
    deskripsi: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_proker || !formData.pagu_anggaran) return;

    onAddProker({
      ...formData,
      pagu_anggaran: Number(formData.pagu_anggaran)
    });

    setFormData({
      nama_proker: '',
      departemen: 'Departemen Akademik & Karier',
      pj: activeUser.name,
      target_selesai: '',
      pagu_anggaran: '',
      deskripsi: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky)' }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Pengajuan Program Kerja (Proker)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Usulan kegiatan kemahasiswaan LK FEB</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nama Program Kerja</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Contoh: FEB National Business Case Competition 2026"
                value={formData.nama_proker}
                onChange={(e) => setFormData({ ...formData, nama_proker: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Departemen / Divisi</label>
                <select
                  className="form-control"
                  value={formData.departemen}
                  onChange={(e) => setFormData({ ...formData, departemen: e.target.value })}
                >
                  <option value="BPH Inti">BPH Inti</option>
                  <option value="Departemen Akademik & Karier">Departemen Akademik & Karier</option>
                  <option value="Departemen Minat & Bakat">Departemen Minat & Bakat</option>
                  <option value="Departemen Sosial Masyarakat">Departemen Sosial Masyarakat</option>
                  <option value="Departemen Humas & Media">Departemen Humas & Media</option>
                  <option value="Biro Kewirausahaan (Danus)">Biro Kewirausahaan (Danus)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Penanggung Jawab (PJ)</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.pj}
                  onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Estimasi Target Selesai</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.target_selesai}
                  onChange={(e) => setFormData({ ...formData, target_selesai: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rencana Pagu Anggaran (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="50000"
                  className="form-control mono"
                  placeholder="Contoh: 10000000"
                  value={formData.pagu_anggaran}
                  onChange={(e) => setFormData({ ...formData, pagu_anggaran: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi & Tujuan Kegiatan</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Jelaskan ringkas sasaran kegiatan, target partisipan, dan output kegiatan..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Ajukan Proker ke Cloud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
