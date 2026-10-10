import React, { useState } from 'react';
import {
  MessageSquareCheck,
  Plus,
  CheckCircle,
  X
} from 'lucide-react';

export default function AdvokasiTracker({
  advokasiList = [],
  onUpdateStatus,
  onAddAdvokasi,
  activeRole
}) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [catatanBaru, setCatatanBaru] = useState('');

  const [formData, setFormData] = useState({
    isu: '',
    bidang: 'Sarana & Prasarana',
    pelapor: '',
    urgensi: 'Sedang',
    pj: activeRole?.name || 'Divisi Advokasi BEM',
    tindakLanjut: ''
  });

  const statuses = ['Semua', 'Isu Masuk', 'Kajian & Survei BEM', 'Audiensi Dekanat', 'Terselesaikan'];

  const filteredList = advokasiList.filter((a) => {
    if (filterStatus === 'Semua') return true;
    return a.status === filterStatus;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.isu.trim()) return;
    onAddAdvokasi(formData);
    setIsAddOpen(false);
    setFormData({
      isu: '',
      bidang: 'Sarana & Prasarana',
      pelapor: '',
      urgensi: 'Sedang',
      pj: activeRole?.name || 'Divisi Advokasi BEM',
      tindakLanjut: ''
    });
  };

  const handleSaveStatus = (id, newStatus) => {
    onUpdateStatus(id, newStatus, catatanBaru);
    setSelectedIssue(null);
    setCatatanBaru('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Isu Masuk':
        return 'badge-amber';
      case 'Kajian & Survei BEM':
        return 'badge-sky';
      case 'Audiensi Dekanat':
        return 'badge-secondary';
      case 'Terselesaikan':
        return 'badge-emerald';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="advokasi-module">
      {/* Top Banner Header */}
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquareCheck size={22} color="var(--amber)" />
            <span>Pelacak Advokasi & Isu Mahasiswa FEB UKRIDA</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Wadah kerja internal BEM FEB untuk mengawal aspirasi mahasiswa ke Pimpinan Dekanat & Sarpras Kampus
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsAddOpen(true)}>
          <Plus size={15} /> Catat Isu Advokasi
        </button>
      </div>

      {/* Filter Status */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {statuses.map((st) => (
          <button
            key={st}
            className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Grid Isu Advokasi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredList.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(15, 31, 56, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className={`badge ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: item.urgensi === 'Tinggi' ? 'var(--rose-bg)' : 'rgba(255,255,255,0.06)',
                    color: item.urgensi === 'Tinggi' ? 'var(--rose)' : 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  Urgensi: {item.urgensi}
                </span>
              </div>

              <h3 style={{ fontSize: '1.02rem', color: '#fff', marginBottom: '10px', lineHeight: 1.35 }}>
                {item.isu}
              </h3>

              <div style={{ fontSize: '0.78rem', color: 'var(--sky)', marginBottom: '8px' }}>
                Bidang: {item.bidang} • Pelapor: {item.pelapor}
              </div>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Progres Tindak Lanjut:
                </div>
                <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: 1.4 }}>
                  {item.tindakLanjut || 'Belum ada catatan tindak lanjut.'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  Update: {item.updateTerakhir}
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                PJ: <strong style={{ color: 'var(--text-muted)' }}>{item.pj}</strong>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedIssue(item);
                  setCatatanBaru(item.tindakLanjut || '');
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <CheckCircle size={32} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
          <div>Tidak ada isu advokasi pada kategori ini.</div>
        </div>
      )}

      {/* Modal Update Status Advokasi */}
      {selectedIssue && (
        <div className="modal-backdrop" onClick={() => setSelectedIssue(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', width: '90%' }}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem' }}>Update Status Advokasi Mahasiswa</h3>
              <button className="btn-icon" onClick={() => setSelectedIssue(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                {selectedIssue.isu}
              </div>

              <div>
                <label className="form-label">Ubah Status Alur Advokasi:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['Isu Masuk', 'Kajian & Survei BEM', 'Audiensi Dekanat', 'Terselesaikan'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedIssue.status === st ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSelectedIssue({ ...selectedIssue, status: st })}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Catatan Hasil Audiensi / Tindak Lanjut:</label>
                <textarea
                  rows="3"
                  className="form-input"
                  placeholder="Hasil pertemuan dengan Dekanat, kesepakatan, atau solusi..."
                  value={catatanBaru}
                  onChange={(e) => setCatatanBaru(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedIssue(null)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSaveStatus(selectedIssue.id, selectedIssue.status)}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catat Isu Baru */}
      {isAddOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddOpen(false)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px', width: '90%' }}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem' }}>Catat Isu Advokasi Baru BEM FEB</h3>
              <button className="btn-icon" onClick={() => setIsAddOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Isu / Keluhan Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AC Ruang Kelas Gedung A Rusak saat Perkuliahan"
                  className="form-input"
                  value={formData.isu}
                  onChange={(e) => setFormData({ ...formData, isu: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Bidang Isu</label>
                  <select
                    className="form-input"
                    value={formData.bidang}
                    onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
                  >
                    <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Finansial Mahasiswa">Finansial Mahasiswa</option>
                    <option value="Akademik & TI">Akademik & TI</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Tingkat Urgensi</label>
                  <select
                    className="form-input"
                    value={formData.urgensi}
                    onChange={(e) => setFormData({ ...formData, urgensi: e.target.value })}
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Pelapor / Aspirator *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perwakilan Kelas Manajemen 2024"
                  className="form-input"
                  value={formData.pelapor}
                  onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Penanggung Jawab (PJ Advokasi)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.pj}
                  onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Catatan Rencana Tindak Lanjut</label>
                <textarea
                  rows="2"
                  placeholder="Rencana survei atau jadwal audiensi dengan Dekanat..."
                  className="form-input"
                  value={formData.tindakLanjut}
                  onChange={(e) => setFormData({ ...formData, tindakLanjut: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsAddOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Simpan Isu Advokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
