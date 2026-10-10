import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  FileCheck2,
  History,
  Cloud,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Download,
  Clock,
  AlertCircle,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Check,
  Menu,
  X,
  CalendarDays,
  FolderOpen,
  MessageSquareCheck,
  GraduationCap,
  Briefcase
} from 'lucide-react';

import { dataService, getSupabaseCredentials } from './lib/supabase';
import CloudConfigModal from './components/CloudConfigModal';
import AddProkerModal from './components/AddProkerModal';
import AddTransactionModal from './components/AddTransactionModal';
import ReceiptViewerModal from './components/ReceiptViewerModal';
import CalendarTimeline from './components/CalendarTimeline';
import ResourceHub from './components/ResourceHub';
import AdvokasiTracker from './components/AdvokasiTracker';
import DivisionWorkspace from './components/DivisionWorkspace';

// Opsi Peran Fungsionaris BEM FEB UKRIDA
const ROLES = [
  { id: 'ketua', name: 'Arthur Reezan', title: 'Ketua Umum BEM FEB UKRIDA', color: '#3b82f6' },
  { id: 'bendahara', name: 'Sarah Amalia', title: 'Bendahara Umum BEM FEB', color: '#10b981' },
  { id: 'koordinator', name: 'Dimas Prasetyo', title: 'Koordinator Divisi (PJ Proker)', color: '#f59e0b' },
  { id: 'anggota', name: 'Fungsionaris BEM', title: 'Anggota Divisi / Panitia', color: '#8b5cf6' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [prokerList, setProkerList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [advokasiList, setAdvokasiList] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [divisionMembers, setDivisionMembers] = useState([]);
  const [divisionTasks, setDivisionTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [prokerFilter, setProkerFilter] = useState('Semua');
  const [txFilter, setTxFilter] = useState('Semua');

  // Modals
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isAddProkerOpen, setIsAddProkerOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Cloud status
  const [cloudStatus, setCloudStatus] = useState(getSupabaseCredentials());

  // PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    loadData();

    // Listen to PWA install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prokerData, txData, logData, eventData, advData, divData, mbrData, tskData] = await Promise.all([
        dataService.getProker(),
        dataService.getTransactions(),
        dataService.getActivityLogs(),
        dataService.getEvents(),
        dataService.getAdvokasi(),
        dataService.getDivisions(),
        dataService.getDivisionMembers(),
        dataService.getDivisionTasks()
      ]);
      setProkerList(prokerData);
      setTransactions(txData);
      setLogs(logData);
      setEvents(eventData);
      setAdvokasiList(advData);
      setDocuments(dataService.getDocuments());
      setDivisions(divData);
      setDivisionMembers(mbrData);
      setDivisionTasks(tskData);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCloud = () => {
    setCloudStatus(getSupabaseCredentials());
    loadData();
  };

  // Hitung Metrik Keuangan
  const totalPemasukan = transactions
    .filter((t) => t.tipe === 'Pemasukan')
    .reduce((acc, curr) => acc + Number(curr.jumlah), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.tipe === 'Pengeluaran')
    .reduce((acc, curr) => acc + Number(curr.jumlah), 0);

  const saldoKas = totalPemasukan - totalPengeluaran;

  const totalPaguAnggaran = prokerList.reduce(
    (acc, curr) => acc + Number(curr.pagu_anggaran || 0),
    0
  );

  const prokerPending = prokerList.filter((p) => p.status === 'Diajukan');
  const prokerBerjalan = prokerList.filter((p) => p.status === 'Berjalan');

  // Actions
  const handleApproveProker = async (prokerId, approve = true) => {
    const newStatus = approve ? 'Disetujui' : 'Ditolak';
    await dataService.updateProkerStatus(prokerId, newStatus, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleAddProker = async (item) => {
    await dataService.addProker(item, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleAddTransaction = async (item) => {
    await dataService.addTransaction(item, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleAddEvent = async (eventItem) => {
    await dataService.addEvent(eventItem, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleAddAdvokasi = async (advItem) => {
    await dataService.addAdvokasi(advItem, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleUpdateAdvokasiStatus = async (id, newStatus, catatanBaru) => {
    await dataService.updateAdvokasiStatus(id, newStatus, catatanBaru, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleAddDivisionTask = async (taskItem) => {
    await dataService.addDivisionTask(taskItem, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleUpdateDivisionTaskStatus = async (taskId, newStatus) => {
    await dataService.updateDivisionTaskStatus(taskId, newStatus, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleUpdateDivisionTaskSubtask = async (taskId, subtaskId, completed) => {
    await dataService.updateDivisionTaskSubtask(taskId, subtaskId, completed, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleUpdateDivisionTaskFull = async (taskId, updatedFields) => {
    await dataService.updateDivisionTaskFull(taskId, updatedFields, {
      name: activeRole.name,
      role: activeRole.title
    });
    loadData();
  };

  const handleSendMemberReminder = async (member, taskTitle) => {
    const waUrl = await dataService.sendMemberReminder(member, taskTitle, {
      name: activeRole.name,
      role: activeRole.title
    });
    const updatedLogs = await dataService.getActivityLogs();
    setLogs(updatedLogs);
    return waUrl;
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Tanggal,Tipe,Kategori,Jumlah,Keterangan,Program Kerja,Dicatat Oleh\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.tanggal}","${t.tipe}","${t.kategori}",${t.jumlah},"${t.keterangan.replace(/"/g, '""')}","${t.nama_proker || '-'}","${t.dicatat_oleh}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Keuangan_LK_FEB_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Untuk memasang di HP: Buka Chrome ➔ Klik Menu titik tiga (⋮) ➔ Pilih "Tambahkan ke Layar Utama / Install App"');
    }
  };

  // Filter lists
  const filteredProker = prokerList.filter((p) => {
    if (prokerFilter === 'Semua') return true;
    return p.status === prokerFilter;
  });

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'Semua') return true;
    return t.tipe === txFilter;
  });

  return (
    <div className="app-layout">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand-section">
          <div className="brand-icon">
            <GraduationCap size={24} color="#38bdf8" />
          </div>
          <div className="brand-info">
            <h2>BEM FEB</h2>
            <span className="brand-badge">UKRIDA • LEAD TO IMPACT</span>
          </div>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="nav-menu">
          {/* GRUP 1: PUSAT KERJA & DIVISI (ALA ABMAS) */}
          <div className="sidebar-group-label">Pusat Kerja & Divisi</div>
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard size={18} />
            Dashboard Utama
          </button>

          <button
            className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => { setActiveTab('workspace'); setMobileMenuOpen(false); }}
          >
            <Briefcase size={18} />
            Workspace Divisi & KPI
            <span className="nav-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--sky)' }}>
              {divisions.length} Divisi
            </span>
          </button>

          <button
            className={`nav-item ${activeTab === 'proker' ? 'active' : ''}`}
            onClick={() => { setActiveTab('proker'); setMobileMenuOpen(false); }}
          >
            <CalendarCheck size={18} />
            Program Kerja BEM
            {prokerPending.length > 0 && (
              <span className="nav-badge">{prokerPending.length} Diajukan</span>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'kalender' ? 'active' : ''}`}
            onClick={() => { setActiveTab('kalender'); setMobileMenuOpen(false); }}
          >
            <CalendarDays size={18} />
            Kalender Agenda BEM
          </button>

          {/* GRUP 2: KEUANGAN & AKUNTABILITAS */}
          <div className="sidebar-group-label" style={{ marginTop: '12px' }}>Keuangan & LPJ</div>
          <button
            className={`nav-item ${activeTab === 'keuangan' ? 'active' : ''}`}
            onClick={() => { setActiveTab('keuangan'); setMobileMenuOpen(false); }}
          >
            <Wallet size={18} />
            Buku Kas (LK)
          </button>

          <button
            className={`nav-item ${activeTab === 'lpj' ? 'active' : ''}`}
            onClick={() => { setActiveTab('lpj'); setMobileMenuOpen(false); }}
          >
            <FileCheck2 size={18} />
            Laporan & LPJ Dekanat
          </button>

          {/* GRUP 3: ADMINISTRASI & ADVOKASI */}
          <div className="sidebar-group-label" style={{ marginTop: '12px' }}>Administrasi & Relasi</div>
          <button
            className={`nav-item ${activeTab === 'dokumen' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dokumen'); setMobileMenuOpen(false); }}
          >
            <FolderOpen size={18} />
            Dokumen Resmi Dekanat
          </button>

          <button
            className={`nav-item ${activeTab === 'advokasi' ? 'active' : ''}`}
            onClick={() => { setActiveTab('advokasi'); setMobileMenuOpen(false); }}
          >
            <MessageSquareCheck size={18} />
            Advokasi Mahasiswa
          </button>

          <button
            className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('logs'); setMobileMenuOpen(false); }}
          >
            <History size={18} />
            Log Kolaborasi Tim
          </button>
        </nav>

        {/* Cloud Status Footer */}
        <div className="sidebar-footer">
          <div className="cloud-status-pill" onClick={() => setIsCloudModalOpen(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={`status-dot ${cloudStatus.isConfigured ? '' : 'offline'}`}></div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>
                  {cloudStatus.isConfigured ? 'Supabase Online' : 'Mode Offline Demo'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {cloudStatus.isConfigured ? 'Sinkron ke Cloud' : 'Klik untuk hubungkan'}
                </div>
              </div>
            </div>
            <Cloud size={16} color="var(--sky)" />
          </div>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="main-wrapper">
        {/* TOP HEADER */}
        <header className="top-header">
          <div className="header-left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '8px', display: 'flex', alignItems: 'center' }}
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="page-title">
                {activeTab === 'dashboard' && 'Executive Dashboard BEM FEB UKRIDA'}
                {activeTab === 'workspace' && 'Workspace Divisi & Evaluasi KPI Fungsionaris'}
                {activeTab === 'proker' && 'Manajemen Program Kerja (Proker BEM FEB)'}
                {activeTab === 'keuangan' && 'Buku Kas Umum & Pengelolaan Dana Kemahasiswaan'}
                {activeTab === 'lpj' && 'Rekapitulasi Anggaran & LPJ Dekanat FEB'}
                {activeTab === 'kalender' && 'Master Schedule & Kalender Kerja BEM FEB'}
                {activeTab === 'dokumen' && 'Pusat Dokumen Resmi & Template Dekanat FEB'}
                {activeTab === 'advokasi' && 'Pelacak Isu & Advokasi Mahasiswa FEB UKRIDA'}
                {activeTab === 'logs' && 'Audit Trail & Log Kolaborasi Fungsionaris'}
              </div>
              <div className="page-subtitle">
                Badan Eksekutif Mahasiswa Fakultas Ekonomi & Bisnis UKRIDA • Executive Workspace
              </div>
            </div>
          </div>

          <div className="header-actions">
            {/* Quick Action Button based on Role */}
            {(activeRole.id === 'bendahara' || activeRole.id === 'ketua') && (
              <button className="btn btn-emerald btn-sm" onClick={() => setIsAddTxOpen(true)}>
                <PlusCircle size={16} /> Catat Kas
              </button>
            )}

            {(activeRole.id === 'koordinator' || activeRole.id === 'ketua') && (
              <button className="btn btn-primary btn-sm" onClick={() => setIsAddProkerOpen(true)}>
                <PlusCircle size={16} /> Ajukan Proker
              </button>
            )}

            {/* Role Switcher Box */}
            <div style={{ position: 'relative' }}>
              <div className="role-badge-box" onClick={() => setShowRoleMenu(!showRoleMenu)}>
                <div className="role-avatar" style={{ background: activeRole.color }}>
                  {activeRole.name.charAt(0)}
                </div>
                <div>
                  <div className="role-text-title">{activeRole.name}</div>
                  <div className="role-text-role">{activeRole.title}</div>
                </div>
              </div>

              {showRoleMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '240px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '8px',
                    zIndex: 60,
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Ganti Peran Pengguna (Simulasi)
                  </div>
                  {ROLES.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setActiveRole(r);
                        setShowRoleMenu(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: activeRole.id === r.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                      }}
                    >
                      <div className="role-avatar" style={{ width: '26px', height: '26px', background: r.color, fontSize: '0.75rem' }}>
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{r.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="content-body">
          {/* PWA Mobile App Promo Banner */}
          {showInstallBanner && (
            <div className="install-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Smartphone size={32} color="var(--sky)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Bisa Dipasang di HP Android & Laptop Windows!
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Pasang sebagai aplikasi mandiri (PWA / APK) untuk akses cepat tanpa membuka browser berulang kali.
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleInstallPWA}>
                Pasang Sekarang
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Financial & Proker Stat Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-title">Sisa Saldo Kas Umum</span>
                    <div className="stat-icon emerald">
                      <Wallet size={20} />
                    </div>
                  </div>
                  <div className="stat-value mono" style={{ color: saldoKas >= 0 ? '#10b981' : '#f43f5e' }}>
                    Rp {saldoKas.toLocaleString('id-ID')}
                  </div>
                  <div className="stat-desc">
                    Terhitung dari {transactions.length} riwayat mutasi kas
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-title">Total Pemasukan Kas</span>
                    <div className="stat-icon primary">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="stat-value mono">
                    Rp {totalPemasukan.toLocaleString('id-ID')}
                  </div>
                  <div className="stat-desc">Dana dekanat, sponsor & kas pengurus</div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-title">Total Realisasi Belanja</span>
                    <div className="stat-icon rose">
                      <TrendingDown size={20} />
                    </div>
                  </div>
                  <div className="stat-value mono">
                    Rp {totalPengeluaran.toLocaleString('id-ID')}
                  </div>
                  <div className="stat-desc">
                    {Math.round((totalPengeluaran / (totalPemasukan || 1)) * 100)}% dari total dana terkumpul
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-title">Program Kerja LK</span>
                    <div className="stat-icon amber">
                      <CalendarCheck size={20} />
                    </div>
                  </div>
                  <div className="stat-value">
                    {prokerList.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Kegiatan</span>
                  </div>
                  <div className="stat-desc">
                    {prokerBerjalan.length} sedang berjalan • {prokerPending.length} menunggu persetujuan
                  </div>
                </div>
              </div>

              {/* Pending Approvals Section (Khusus Ketua BPH / Alert) */}
              {prokerPending.length > 0 && (
                <div className="panel-card" style={{ borderLeft: '4px solid var(--amber)' }}>
                  <div className="panel-header">
                    <div className="panel-title" style={{ color: varColorAmber }}>
                      <AlertCircle size={20} color="var(--amber)" /> Usulan Program Kerja Butuh Persetujuan ({prokerPending.length})
                    </div>
                    {activeRole.id === 'ketua' && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--amber)', fontWeight: 600 }}>
                        Anda login sebagai Ketua BPH (Memiliki Hak Approval)
                      </span>
                    )}
                  </div>
                  <div className="panel-body" style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                      {prokerPending.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            background: 'rgba(0,0,0,0.25)',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <span className="badge badge-amber">Menunggu Approval</span>
                              <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                                Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '0.98rem', marginBottom: '6px' }}>{p.nama_proker}</h4>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                              {p.departemen} • PJ: {p.pj}
                            </p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                              "{p.deskripsi}"
                            </p>
                          </div>

                          {activeRole.id === 'ketua' ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                className="btn btn-emerald btn-sm"
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={() => handleApproveProker(p.id, true)}
                              >
                                <Check size={14} /> Setujui
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: 'var(--rose)' }}
                                onClick={() => handleApproveProker(p.id, false)}
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                              Menunggu persetujuan Ketua Umum BPH
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Grid 2 Kolom: Proker Aktif & Transaksi Terbaru */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                {/* Proker Aktif Overview */}
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <CalendarCheck size={18} color="var(--sky)" /> Serapan Anggaran Proker Berjalan
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('proker')}>
                      Lihat Semua
                    </button>
                  </div>
                  <div className="panel-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {prokerList.slice(0, 3).map((p) => {
                        const percent = Math.min(
                          Math.round(((p.realisasi_anggaran || 0) / (p.pagu_anggaran || 1)) * 100),
                          100
                        );
                        return (
                          <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '0.9rem' }}>{p.nama_proker}</strong>
                              <span
                                className={`badge ${
                                  p.status === 'Berjalan'
                                    ? 'badge-sky'
                                    : p.status === 'Disetujui'
                                    ? 'badge-emerald'
                                    : p.status === 'Selesai'
                                    ? 'badge-emerald'
                                    : 'badge-amber'
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              <span>Realisasi: Rp {Number(p.realisasi_anggaran || 0).toLocaleString('id-ID')}</span>
                              <span>Pagu: Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--sky)', marginTop: '4px' }}>
                              Serapan: {percent}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Transaksi Kas Terbaru */}
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <Wallet size={18} color="var(--emerald)" /> Mutasi Kas Terbaru
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('keuangan')}>
                      Buku Kas
                    </button>
                  </div>
                  <div className="panel-body" style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {transactions.slice(0, 5).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTx(t)}
                          style={{
                            padding: '12px 8px',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: t.tipe === 'Pemasukan' ? 'var(--emerald-bg)' : 'var(--rose-bg)',
                                color: t.tipe === 'Pemasukan' ? 'var(--emerald)' : 'var(--rose)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {t.tipe === 'Pemasukan' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{t.keterangan}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {t.tanggal} • {t.kategori}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              className="mono"
                              style={{
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: t.tipe === 'Pemasukan' ? 'var(--emerald)' : '#fff'
                              }}
                            >
                              {t.tipe === 'Pemasukan' ? '+' : '-'} Rp {Number(t.jumlah).toLocaleString('id-ID')}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--sky)' }}>Lihat Nota</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2 Kolom: Agenda Terdekat & Advokasi Kampus */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {/* Agenda Terdekat */}
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <CalendarDays size={18} color="var(--amber)" /> Agenda & Timeline Kerja BEM Terdekat
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('kalender')}>
                      Buka Kalender
                    </button>
                  </div>
                  <div className="panel-body" style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {events.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            borderLeft: '3px solid var(--amber)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', marginBottom: '2px' }}>
                              {e.judul}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {e.tanggal} • {e.waktu}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                              {e.lokasi}
                            </div>
                          </div>
                          <span className="badge badge-amber" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                            {e.kategori}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advokasi Isu Mahasiswa Terkini */}
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <MessageSquareCheck size={18} color="var(--sky)" /> Isu Advokasi Mahasiswa FEB Dikawal
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('advokasi')}>
                      Buka Advokasi
                    </button>
                  </div>
                  <div className="panel-body" style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {advokasiList.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            borderLeft: '3px solid var(--sky)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', marginBottom: '2px' }}>
                              {a.isu}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Bidang: {a.bidang} • Update: {a.updateTerakhir}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--emerald)', marginTop: '2px' }}>
                              {a.tindakLanjut}
                            </div>
                          </div>
                          <span className="badge badge-sky" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: WORKSPACE DIVISI & MONITORING KPI (ALA ABMAS) */}
          {activeTab === 'workspace' && (
            <DivisionWorkspace
              divisions={divisions}
              members={divisionMembers}
              tasks={divisionTasks}
              activeRole={activeRole}
              onAddTask={handleAddDivisionTask}
              onUpdateTaskStatus={handleUpdateDivisionTaskStatus}
              onUpdateSubtask={handleUpdateDivisionTaskSubtask}
              onUpdateTaskFull={handleUpdateDivisionTaskFull}
              onSendReminder={handleSendMemberReminder}
            />
          )}

          {/* TAB 2: PROGRAM KERJA */}
          {activeTab === 'proker' && (
            <div className="panel-card">
              <div className="panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div className="panel-title">
                    <CalendarCheck size={20} color="var(--sky)" /> Daftar Program Kerja FEB ({filteredProker.length})
                  </div>
                  {/* Status Filter Chips */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Semua', 'Diajukan', 'Disetujui', 'Berjalan', 'Selesai'].map((f) => (
                      <button
                        key={f}
                        className={`btn btn-sm ${prokerFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setProkerFilter(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setIsAddProkerOpen(true)}>
                  <PlusCircle size={16} /> Usulkan Proker Baru
                </button>
              </div>

              <div className="panel-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                  {filteredProker.map((p) => {
                    const percent = Math.min(
                      Math.round(((p.realisasi_anggaran || 0) / (p.pagu_anggaran || 1)) * 100),
                      100
                    );
                    return (
                      <div
                        key={p.id}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
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
                            <span
                              className={`badge ${
                                p.status === 'Berjalan'
                                  ? 'badge-sky'
                                  : p.status === 'Disetujui'
                                  ? 'badge-emerald'
                                  : p.status === 'Selesai'
                                  ? 'badge-emerald'
                                  : 'badge-amber'
                              }`}
                            >
                              {p.status}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              Target: {p.target_selesai || 'TBA'}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{p.nama_proker}</h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--sky)', marginBottom: '8px' }}>
                            {p.departemen}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            {p.deskripsi}
                          </p>
                        </div>

                        <div>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Pagu Anggaran:</span>
                              <strong className="mono">Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Realisasi Belanja:</span>
                              <strong className="mono" style={{ color: 'var(--emerald)' }}>
                                Rp {Number(p.realisasi_anggaran || 0).toLocaleString('id-ID')}
                              </strong>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--sky)', marginTop: '4px' }}>
                              Serapan Dana: {percent}%
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            <span>PJ: <strong>{p.pj}</strong></span>
                            {p.status === 'Diajukan' && activeRole.id === 'ketua' && (
                              <button
                                className="btn btn-emerald btn-sm"
                                onClick={() => handleApproveProker(p.id, true)}
                              >
                                <Check size={14} /> Setujui
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUKU KAS & KEUANGAN (LK) */}
          {activeTab === 'keuangan' && (
            <div className="panel-card">
              <div className="panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div className="panel-title">
                    <Wallet size={20} color="var(--emerald)" /> Buku Kas Umum LK FEB
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Semua', 'Pemasukan', 'Pengeluaran'].map((f) => (
                      <button
                        key={f}
                        className={`btn btn-sm ${txFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTxFilter(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                    <Download size={15} /> Export Excel (CSV)
                  </button>
                  <button className="btn btn-emerald btn-sm" onClick={() => setIsAddTxOpen(true)}>
                    <PlusCircle size={15} /> Catat Transaksi Kas
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Tipe</th>
                      <th>Kategori</th>
                      <th>Keterangan Transaksi</th>
                      <th>Terkait Proker</th>
                      <th style={{ textAlign: 'right' }}>Nominal</th>
                      <th>Dicatat Oleh</th>
                      <th style={{ textAlign: 'center' }}>Bukti Struk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.tanggal}</td>
                        <td>
                          <span className={`badge ${t.tipe === 'Pemasukan' ? 'badge-emerald' : 'badge-rose'}`}>
                            {t.tipe}
                          </span>
                        </td>
                        <td>
                          <strong>{t.kategori}</strong>
                        </td>
                        <td>{t.keterangan}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--sky)' }}>
                          {t.nama_proker || 'Kas Umum'}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }} className="mono">
                          <span style={{ color: t.tipe === 'Pemasukan' ? 'var(--emerald)' : '#fff' }}>
                            {t.tipe === 'Pemasukan' ? '+' : '-'} Rp {Number(t.jumlah).toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{t.dicatat_oleh}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => setSelectedTx(t)}
                          >
                            <Eye size={13} /> Bukti
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LAPORAN & LPJ */}
          {activeTab === 'lpj' && (
            <div className="panel-card">
              <div className="panel-header">
                <div>
                  <div className="panel-title">
                    <FileCheck2 size={20} color="var(--sky)" /> Rekapitulasi LPJ & Serapan Anggaran Proker
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Standar Pertanggungjawaban Lembaga Kemahasiswaan Fakultas Ekonomika & Bisnis
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                  <Download size={15} /> Cetak / Unduh PDF
                </button>
              </div>

              <div className="panel-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Pagu Disetujui</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }} className="mono">
                      Rp {totalPaguAnggaran.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Realisasi Pengeluaran</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald)' }} className="mono">
                      Rp {totalPengeluaran.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sisa Anggaran Belum Terpakai</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sky)' }} className="mono">
                      Rp {Math.max(0, totalPaguAnggaran - totalPengeluaran).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Nama Kegiatan / Proker</th>
                        <th>Departemen</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Pagu Rencana</th>
                        <th style={{ textAlign: 'right' }}>Realisasi Aktual</th>
                        <th style={{ textAlign: 'right' }}>Sisa Saldo</th>
                        <th style={{ textAlign: 'center' }}>% Serapan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prokerList.map((p) => {
                        const sisa = Number(p.pagu_anggaran) - Number(p.realisasi_anggaran || 0);
                        const percent = Math.min(
                          Math.round(((p.realisasi_anggaran || 0) / (p.pagu_anggaran || 1)) * 100),
                          100
                        );
                        return (
                          <tr key={p.id}>
                            <td><strong>{p.nama_proker}</strong></td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.departemen}</td>
                            <td>
                              <span className="badge badge-sky">{p.status}</span>
                            </td>
                            <td style={{ textAlign: 'right' }} className="mono">
                              Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}
                            </td>
                            <td style={{ textAlign: 'right', color: 'var(--emerald)' }} className="mono">
                              Rp {Number(p.realisasi_anggaran || 0).toLocaleString('id-ID')}
                            </td>
                            <td style={{ textAlign: 'right' }} className="mono">
                              Rp {sisa.toLocaleString('id-ID')}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className="mono" style={{ fontWeight: 700, color: percent > 80 ? 'var(--emerald)' : 'var(--amber)' }}>
                                {percent}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KALENDER KERJA & MASTER SCHEDULE */}
          {activeTab === 'kalender' && (
            <CalendarTimeline
              events={events}
              onAddEvent={handleAddEvent}
              activeRole={activeRole}
            />
          )}

          {/* TAB 6: PUSAT DOKUMEN RESMI & TEMPLATE */}
          {activeTab === 'dokumen' && (
            <ResourceHub documents={documents} />
          )}

          {/* TAB 7: ADVOKASI & ISU KAMPUS BEM FEB */}
          {activeTab === 'advokasi' && (
            <AdvokasiTracker
              advokasiList={advokasiList}
              onUpdateStatus={handleUpdateAdvokasiStatus}
              onAddAdvokasi={handleAddAdvokasi}
              activeRole={activeRole}
            />
          )}

          {/* TAB 8: AUDIT LOG AKTIVITAS */}
          {activeTab === 'logs' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">
                  <History size={20} color="var(--sky)" /> Log Aktivitas Kolaborasi BEM FEB
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Jejak audit dan sinkronisasi perubahan data fungsionaris
                </div>
              </div>

              <div className="panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '14px 18px',
                        background: 'rgba(0,0,0,0.2)',
                        borderLeft: '3px solid var(--sky)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                            {log.user_name}
                          </span>
                          <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                            {log.user_role}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--emerald)', fontWeight: 600 }}>
                            {log.action}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.details}</p>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
        >
          <Briefcase size={18} />
          <span>Workspace</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'proker' ? 'active' : ''}`}
          onClick={() => setActiveTab('proker')}
        >
          <CalendarCheck size={18} />
          <span>Proker</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'keuangan' ? 'active' : ''}`}
          onClick={() => setActiveTab('keuangan')}
        >
          <Wallet size={18} />
          <span>Kas</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'lpj' ? 'active' : ''}`}
          onClick={() => setActiveTab('lpj')}
        >
          <FileCheck2 size={18} />
          <span>LPJ</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'kalender' ? 'active' : ''}`}
          onClick={() => setActiveTab('kalender')}
        >
          <CalendarDays size={18} />
          <span>Kalender</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'dokumen' ? 'active' : ''}`}
          onClick={() => setActiveTab('dokumen')}
        >
          <FolderOpen size={18} />
          <span>Dokumen</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'advokasi' ? 'active' : ''}`}
          onClick={() => setActiveTab('advokasi')}
        >
          <MessageSquareCheck size={18} />
          <span>Advokasi</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <History size={18} />
          <span>Audit</span>
        </button>
      </nav>

      {/* MODALS */}
      <CloudConfigModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        onConfigSaved={handleRefreshCloud}
      />

      <AddProkerModal
        isOpen={isAddProkerOpen}
        onClose={() => setIsAddProkerOpen(false)}
        onAddProker={handleAddProker}
        activeUser={{ name: activeRole.name, role: activeRole.title }}
      />

      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onAddTransaction={handleAddTransaction}
        prokerList={prokerList}
        activeUser={{ name: activeRole.name, role: activeRole.title }}
      />

      <ReceiptViewerModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
}

// Variable helper
const varColorAmber = '#f59e0b';
