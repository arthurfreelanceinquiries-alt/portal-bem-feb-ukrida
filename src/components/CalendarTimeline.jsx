import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  AlertCircle,
  X,
  CalendarDays
} from 'lucide-react';

export default function CalendarTimeline({
  events = [],
  onAddEvent,
  activeRole
}) {
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '16:00 - 18:00 WIB',
    lokasi: 'Ruang Rapat Gedung A Lt. 3 Kampus Tanjung Duren',
    kategori: 'Rapat & Evaluasi',
    pj: activeRole?.name || 'Sekretaris Umum',
    deskripsi: ''
  });

  const categories = ['Semua', 'Rapat & Evaluasi', 'Eksekusi Acara', 'Tenggat Administrasi', 'Pengabdian Masyarakat'];

  const filteredEvents = events.filter((e) => {
    if (filterKategori === 'Semua') return true;
    return e.kategori === filterKategori;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) return;
    onAddEvent(formData);
    setIsAddModalOpen(false);
    setFormData({
      judul: '',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '16:00 - 18:00 WIB',
      lokasi: 'Ruang Rapat Gedung A Lt. 3 Kampus Tanjung Duren',
      kategori: 'Rapat & Evaluasi',
      pj: activeRole?.name || 'Sekretaris Umum',
      deskripsi: ''
    });
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Rapat & Evaluasi':
        return 'badge-amber';
      case 'Eksekusi Acara':
        return 'badge-sky';
      case 'Tenggat Administrasi':
        return 'badge-rose';
      case 'Pengabdian Masyarakat':
        return 'badge-emerald';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="calendar-module">
      {/* Top Action Header */}
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={22} color="var(--sky)" />
            <span>Master Schedule & Kalender Kerja BEM FEB UKRIDA</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sinkronisasi jadwal rapat pleno, evaluasi bulanan, dan eksekusi event kepengurusan
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={15} /> Tambah Agenda Kerja
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((c) => (
          <button
            key={c}
            className={`btn btn-sm ${filterKategori === c ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterKategori(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Events Timeline Grid */}
      <div className="timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '18px' }}>
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="event-card"
            style={{
              background: 'rgba(15, 31, 56, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Strip */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background:
                  evt.kategori === 'Eksekusi Acara'
                    ? 'var(--sky)'
                    : evt.kategori === 'Tenggat Administrasi'
                    ? 'var(--rose)'
                    : evt.kategori === 'Pengabdian Masyarakat'
                    ? 'var(--emerald)'
                    : 'var(--amber)'
              }}
            />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className={`badge ${getCategoryBadgeClass(evt.kategori)}`}>
                  {evt.kategori}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  {evt.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
                {evt.judul}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  <Calendar size={15} color="var(--sky)" />
                  <strong className="mono">{evt.tanggal}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Clock size={15} color="var(--amber)" />
                  <span>{evt.waktu}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <MapPin size={15} color="var(--rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{evt.lokasi}</span>
                </div>
              </div>

              {evt.deskripsi && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4, marginBottom: '16px' }}>
                  {evt.deskripsi}
                </p>
              )}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-dim)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="var(--sky)" />
                <span>PJ: <strong>{evt.pj}</strong></span>
              </div>
              <span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>
                BEM FEB Internal
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
          <div>Belum ada agenda pada kategori ini.</div>
        </div>
      )}

      {/* Modal Tambah Agenda */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '90%' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarDays size={20} color="var(--sky)" />
                <h3 style={{ fontSize: '1.1rem' }}>Tambah Agenda Kerja BEM</h3>
              </div>
              <button className="btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Nama Agenda / Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Pleno Evaluasi Proker Bulan Oktober"
                  className="form-input"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Tanggal Pelaksanaan *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Waktu *</label>
                  <input
                    type="text"
                    required
                    placeholder="16:00 - 18:00 WIB"
                    className="form-input"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Kategori Agenda *</label>
                <select
                  className="form-input"
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                >
                  <option value="Rapat & Evaluasi">Rapat & Evaluasi</option>
                  <option value="Eksekusi Acara">Eksekusi Acara</option>
                  <option value="Tenggat Administrasi">Tenggat Administrasi</option>
                  <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                </select>
              </div>

              <div>
                <label className="form-label">Lokasi / Tautan Pertemuan *</label>
                <input
                  type="text"
                  required
                  placeholder="Auditorium Kampus 1 / Google Meet"
                  className="form-input"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Penanggung Jawab (PJ) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.pj}
                  onChange={(e) => setFormData({ ...formData, pj: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Deskripsi / Catatan Agenda</label>
                <textarea
                  rows="3"
                  placeholder="Agenda bahasan, kebutuhan perlengkapan, atau instruksi rapat..."
                  className="form-input"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
