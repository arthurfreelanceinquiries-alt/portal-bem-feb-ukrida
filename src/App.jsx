import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  History,
  PlusCircle,
  Download,
  Clock,
  AlertCircle,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Check,
  CalendarDays,
  MessageSquareCheck,
  Briefcase,
  Scale,
  Sparkles,
  CheckSquare,
  ChevronRight,
} from 'lucide-react';

import { ROLES, ROLE_PROFILES, hasPermission } from './domain/rbac';
import { MetricCard, AdminPageHeader, AdminBadge } from './components/common/AdminComponents';
import AdminHeader from './components/layout/AdminHeader';
import BemSidebar from './components/layout/BemSidebar';

import { dataService, getSupabaseCredentials } from './lib/supabase';
import CloudConfigModal from './components/CloudConfigModal';
import AddProkerModal from './components/AddProkerModal';
import AddTransactionModal from './components/AddTransactionModal';
import ReceiptViewerModal from './components/ReceiptViewerModal';
import CalendarTimeline from './components/CalendarTimeline';
import ResourceHub from './components/ResourceHub';
import AdvokasiTracker from './components/AdvokasiTracker';
import DivisionWorkspace from './components/DivisionWorkspace';

export default function App() {
  // Role & Persona State (Default: BPH / Ketua Umum Arthur Reezan)
  const [activeRoleKey, setActiveRoleKey] = useState(() => {
    return localStorage.getItem('bem_active_role') || ROLES.BPH_KETUA;
  });
  const activeRole = ROLE_PROFILES[activeRoleKey] || ROLE_PROFILES[ROLES.BPH_KETUA];

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const handleRoleChange = (newRoleKey) => {
    setActiveRoleKey(newRoleKey);
    localStorage.setItem('bem_active_role', newRoleKey);
  };

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

  // Pending Tasks for currently active role
  const pendingTasksForRole = divisionTasks.filter(
    (t) => t.assignedTo?.toLowerCase().includes(activeRole.name.toLowerCase()) && t.status !== 'Selesai'
  );

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

  // Rata-rata KPI
  const avgKpi = divisionMembers.length
    ? Math.round(divisionMembers.reduce((acc, m) => acc + (m.kpiScore || 0), 0) / divisionMembers.length)
    : 85;

  return (
    <div className="min-h-screen bg-[#081225] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. TOP HEADER ALA ABMAS (Role Switcher Pill, UKRIDA Brand, Cloud Status) */}
      <AdminHeader
        activeRole={activeRoleKey}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onOpenMobileSidebar={() => setMobileMenuOpen(true)}
        onOpenCloudConfig={() => setIsCloudModalOpen(true)}
        onOpenQuickTask={() => {
          setActiveTab('divisions');
        }}
        cloudConfigured={cloudStatus.isConfigured}
      />

      <div className="flex-1 flex w-full">
        {/* 2. GROUPED SIDEBAR NAVIGATION (Ala ChurchAdminSidebar ABMAS) */}
        <BemSidebar
          activeRole={activeRoleKey}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
          }}
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          pendingTaskCount={pendingTasksForRole.length}
        />

        {/* 3. MAIN CONTENT WRAPPER */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
          {/* PWA Mobile App Promo Banner */}
          {showInstallBanner && (
            <div className="install-banner mb-6">
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

          {/* ============================================================== */}
          {/* TAB 1: EXECUTIVE & ROLE-TAILORED DASHBOARD                     */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* ABMAS Page Header */}
              <AdminPageHeader
                eyebrow="PORTAL EKSEKUTIF & OPERASIONAL • LEAD TO IMPACT"
                title={
                  activeRoleKey === ROLES.BPH_KETUA
                    ? "Executive Command Center"
                    : activeRoleKey === ROLES.KOOR_DIVISI
                    ? `Divisional Command: ${activeRole.divisionName}`
                    : activeRoleKey === ROLES.ANGGOTA_STAF
                    ? `Portal Tugas Personal: ${activeRole.name}`
                    : "Tata Kelola Perbendaharaan BEM"
                }
                description={
                  activeRoleKey === ROLES.BPH_KETUA
                    ? "Ringkasan metrik fakultas, validasi program kerja, audit kas, dan pengawasan 6 divisi FEB UKRIDA."
                    : activeRoleKey === ROLES.KOOR_DIVISI
                    ? "Monitoring pencapaian KPI fungsionaris divisi, pembagian tugas baru, dan pengawalan deadline proker."
                    : activeRoleKey === ROLES.ANGGOTA_STAF
                    ? "Pantau tugas aktif Anda, selesaikan checklist kerja, dan unggah bukti deliverable untuk pencapaian KPI maksimal."
                    : "Pencatatan kas masuk dan keluar, monitoring pagu anggaran proker, serta verifikasi bukti nota transaksi."
                }
                action={
                  <div className="flex items-center gap-2">
                    {hasPermission(activeRoleKey, 'approveProposals') && prokerPending.length > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="size-3.5 text-amber-600" />
                        {prokerPending.length} Proker Perlu Approval
                      </span>
                    )}

                    {hasPermission(activeRoleKey, 'manageFinances') && (
                      <button
                        className="btn btn-emerald btn-sm"
                        onClick={() => setIsAddTxOpen(true)}
                      >
                        <PlusCircle size={15} /> Catat Kas
                      </button>
                    )}

                    {(activeRoleKey === ROLES.KOOR_DIVISI || activeRoleKey === ROLES.BPH_KETUA) && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setIsAddProkerOpen(true)}
                      >
                        <PlusCircle size={15} /> Ajukan Proker
                      </button>
                    )}
                  </div>
                }
              />

              {/* 4 METRIC CARDS ALA ABMAS (Variant: Green, Blue, Yellow, Red) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Sisa Saldo Kas Umum"
                  value={`Rp ${saldoKas.toLocaleString('id-ID')}`}
                  subtitle={`Terhitung dari ${transactions.length} mutasi`}
                  change={saldoKas >= 0 ? "Surplus Kas" : "Defisit"}
                  isPositive={saldoKas >= 0}
                  icon={Wallet}
                  variant="green"
                  onClick={() => setActiveTab('finance')}
                />

                <MetricCard
                  title="Program Kerja BEM"
                  value={`${prokerList.length} Proker`}
                  subtitle={`${prokerBerjalan.length} aktif • ${prokerPending.length} antrean`}
                  change={`${prokerBerjalan.length} Berjalan`}
                  isPositive={true}
                  icon={CalendarCheck}
                  variant="blue"
                  onClick={() => setActiveTab('proker')}
                />

                <MetricCard
                  title="Rata-rata KPI Fungsionaris"
                  value={`${avgKpi}%`}
                  subtitle={`${divisionMembers.filter((m) => (m.kpiScore || 0) >= 75).length} dari ${divisionMembers.length} staf memenuhi KPI`}
                  change={avgKpi >= 75 ? "Sangat Baik" : "Perlu Evaluasi"}
                  isPositive={avgKpi >= 75}
                  icon={Sparkles}
                  variant="yellow"
                  onClick={() => setActiveTab('divisions')}
                />

                <MetricCard
                  title="Advokasi Mahasiswa FEB"
                  value={`${advokasiList.length} Isu`}
                  subtitle={`${advokasiList.filter((a) => a.status !== 'Selesai').length} butuh tindak lanjut Dekanat`}
                  change={advokasiList.filter((a) => a.status === 'Selesai').length + " Tuntas"}
                  isPositive={true}
                  icon={Scale}
                  variant="red"
                  onClick={() => setActiveTab('advocacy')}
                />
              </div>

              {/* KONTEN KHUSUS UNTUK ANGGOTA / STAF (DUTY ROSTER PERSONAL) */}
              {activeRoleKey === ROLES.ANGGOTA_STAF && (
                <div className="panel-card mt-6" style={{ borderLeft: '4px solid #10b981' }}>
                  <div className="panel-header">
                    <div className="panel-title" style={{ color: '#10b981' }}>
                      <CheckSquare size={18} /> Tugas Personal Anda ({pendingTasksForRole.length} Tertunda)
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('divisions')}
                    >
                      Buka Roster Lengkap
                    </button>
                  </div>
                  <div className="panel-body">
                    {pendingTasksForRole.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">
                        🎉 Hebat! Semua tugas Anda telah selesai dikerjakan. Pertahankan performa KPI Anda!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingTasksForRole.map((t) => (
                          <div
                            key={t.id}
                            className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <AdminBadge variant="yellow">{t.kategoriProker || 'Divisi'}</AdminBadge>
                                <span className="font-mono text-xs text-rose-400 font-bold">
                                  Batas: {t.deadline}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white">{t.judul}</h4>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                {t.keterangan || "Lakukan koordinasi dengan koordinator divisi untuk eksekusi tugas ini."}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                              <span className="text-xs text-slate-400">
                                Subtugas: {(t.subtasks || []).filter((s) => s.completed).length} / {(t.subtasks || []).length}
                              </span>
                              <button
                                className="btn btn-primary btn-sm text-xs py-1"
                                onClick={() => setActiveTab('divisions')}
                              >
                                Kerjakan Tugas <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pending Approvals Section (Khusus Ketua BPH / Alert) */}
              {prokerPending.length > 0 && (
                <div className="panel-card" style={{ borderLeft: '4px solid var(--amber)' }}>
                  <div className="panel-header">
                    <div className="panel-title" style={{ color: '#f59e0b' }}>
                      <AlertCircle size={20} color="var(--amber)" /> Usulan Program Kerja Butuh Persetujuan ({prokerPending.length})
                    </div>
                    {activeRoleKey === ROLES.BPH_KETUA && (
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

                          {activeRoleKey === ROLES.BPH_KETUA ? (
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
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('finance')}>
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
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('calendar')}>
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
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('advocacy')}>
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
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: WORKSPACE DIVISI, TUGAS & MONITORING KPI (ALA ABMAS)    */}
          {/* ============================================================== */}
          {(activeTab === 'divisions' || activeTab === 'workspace') && (
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

          {/* ============================================================== */}
          {/* TAB 3: PROGRAM KERJA (PROKER BEM FEB)                          */}
          {/* ============================================================== */}
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
                          gap: '16px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
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
                            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                              Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{p.nama_proker}</h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            {p.departemen} • PJ: <strong style={{ color: '#fff' }}>{p.pj}</strong>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                            {p.deskripsi}
                          </p>

                          <div style={{ marginBottom: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <span>Serapan Anggaran</span>
                              <span>{percent}% (Rp {Number(p.realisasi_anggaran || 0).toLocaleString('id-ID')})</span>
                            </div>
                            <div className="progress-track" style={{ marginTop: '6px' }}>
                              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            Target: {p.target_selesai}
                          </span>
                          {p.status === 'Diajukan' && activeRoleKey === ROLES.BPH_KETUA && (
                            <button
                              className="btn btn-emerald btn-sm"
                              onClick={() => handleApproveProker(p.id, true)}
                            >
                              <Check size={14} /> Setujui
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: BUKU KAS UMUM & KEUANGAN (ALA ABMAS)                    */}
          {/* ============================================================== */}
          {(activeTab === 'finance' || activeTab === 'keuangan') && (
            <div className="panel-card">
              <div className="panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div className="panel-title">
                    <Wallet size={20} color="var(--emerald)" /> Buku Kas Umum BEM FEB ({filteredTransactions.length})
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

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                    <Download size={15} /> Export CSV
                  </button>
                  {hasPermission(activeRoleKey, 'manageFinances') && (
                    <button className="btn btn-emerald btn-sm" onClick={() => setIsAddTxOpen(true)}>
                      <PlusCircle size={15} /> Catat Transaksi
                    </button>
                  )}
                </div>
              </div>

              <div className="panel-body" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Kategori & Keterangan</th>
                      <th>Program Kerja Terkait</th>
                      <th>Tipe</th>
                      <th>Jumlah</th>
                      <th>Bukti Nota</th>
                      <th>Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <tr key={t.id}>
                        <td className="mono" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {t.tanggal}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                            {t.keterangan}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Kategori: {t.kategori} • Dicatat: {t.dicatat_oleh}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {t.nama_proker || '-'}
                        </td>
                        <td>
                          <span className={`badge ${t.tipe === 'Pemasukan' ? 'badge-emerald' : 'badge-rose'}`}>
                            {t.tipe}
                          </span>
                        </td>
                        <td
                          className="mono"
                          style={{
                            fontWeight: 700,
                            color: t.tipe === 'Pemasukan' ? 'var(--emerald)' : '#fff',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {t.tipe === 'Pemasukan' ? '+' : '-'} Rp {Number(t.jumlah).toLocaleString('id-ID')}
                        </td>
                        <td>
                          {t.bukti_nota_url ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                              onClick={() => setSelectedTx(t)}
                            >
                              <Eye size={13} /> Bukti Nota
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>-</span>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-emerald">
                            <Check size={12} /> {t.status_verifikasi || 'Terverifikasi'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: KALENDER TIMELINE (ALA ABMAS CALENDAR ROSTER)           */}
          {/* ============================================================== */}
          {(activeTab === 'calendar' || activeTab === 'kalender') && (
            <CalendarTimeline
              events={events}
              prokerList={prokerList}
              onAddEvent={handleAddEvent}
              activeUser={{ name: activeRole.name, role: activeRole.title }}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 6: PUSAT DOKUMEN & TEMPLATE (RESOURCE HUB)                 */}
          {/* ============================================================== */}
          {(activeTab === 'resources' || activeTab === 'dokumen') && (
            <ResourceHub documents={documents} />
          )}

          {/* ============================================================== */}
          {/* TAB 7: ADVOKASI & ASPIRASI KAMPUS                              */}
          {/* ============================================================== */}
          {(activeTab === 'advocacy' || activeTab === 'advokasi') && (
            <AdvokasiTracker
              advokasiList={advokasiList}
              onAddAdvokasi={handleAddAdvokasi}
              onUpdateStatus={handleUpdateAdvokasiStatus}
              activeUser={{ name: activeRole.name, role: activeRole.title }}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 8: AUDIT TRAIL & LOG KOLABORASI                            */}
          {/* ============================================================== */}
          {activeTab === 'logs' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">
                  <History size={20} color="var(--sky)" /> Log Aktivitas & Audit Trail Organisasi ({logs.length})
                </div>
              </div>
              <div className="panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '10px',
                        borderLeft: '3px solid var(--sky)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
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

      {/* MOBILE BOTTOM NAVIGATION BAR (PWA) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'divisions' || activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('divisions')}
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
          className={`mobile-nav-btn ${activeTab === 'finance' || activeTab === 'keuangan' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          <Wallet size={18} />
          <span>Kas</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'calendar' || activeTab === 'kalender' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarDays size={18} />
          <span>Kalender</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'advocacy' || activeTab === 'advokasi' ? 'active' : ''}`}
          onClick={() => setActiveTab('advocacy')}
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
