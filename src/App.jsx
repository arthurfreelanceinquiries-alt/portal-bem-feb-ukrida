import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MemberPortal from './pages/MemberPortal';
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
  Users,
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
import OrganizationView from './components/OrganizationView';
import MembersDirectoryView from './components/MembersDirectoryView';
import AbsensiRapatView from './components/AbsensiRapatView';
import ProkerManagementView from './components/ProkerManagementView';
import FinanceView from './components/FinanceView';
import AuditLogView from './components/AuditLogView';
import AntigravityBridgeModal from './components/AntigravityBridgeModal';
import AbsensiInputView from './components/AbsensiInputView';
import DivisiPicView from './components/DivisiPicView';
import UserManagementView from './components/UserManagementView';
import ImportExportView from './components/ImportExportView';
import AnnouncementView from './components/AnnouncementView';
import PengajuanView from './components/PengajuanView';
import CareTrackerView from './components/CareTrackerView';
import PengaturanOrganisasiView from './components/PengaturanOrganisasiView';
import DashboardTrends from './components/DashboardTrends';
import { fetchBridgeStatus, fetchBridgeMeetings } from './lib/bridgeClient';

function AdminPortal({ currentUser, onLogout }) {
  // Role & Persona State — dipetakan dari user yang login
  const [activeRoleKey, setActiveRoleKey] = useState(() => {
    if (currentUser?.role && ROLE_PROFILES[currentUser.role]) return currentUser.role;
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
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);

  // Bridge & Antigravity status
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [activeAntigravityProfile, setActiveAntigravityProfile] = useState(null);

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

      // Sinkronkan dengan LK-FEB Bridge jika aktif
      let finalEvents = eventData;
      try {
        const bridgeRes = await fetchBridgeStatus();
        setBridgeConnected(bridgeRes.connected);
        if (bridgeRes.data?.active_account) {
          setActiveAntigravityProfile(bridgeRes.data.active_account);
        }
        if (bridgeRes.connected) {
          const mRes = await fetchBridgeMeetings();
          if (mRes.ok && mRes.events && mRes.events.length > 0) {
            // Gabungkan event unik dari bridge
            const existingIds = new Set(eventData.map(e => e.id));
            const newBridgeEvents = mRes.events
              .filter(e => !existingIds.has(e.id))
              .map(e => ({
                id: e.id,
                judul: e.judul,
                tanggal: e.tanggal,
                waktu: e.waktu || 'WIB',
                lokasi: e.lokasi || e.tempat || 'Kampus Tanjung Duren',
                kategori: e.kategori || 'Rapat & Evaluasi',
                pj: e.pj || 'BPH BEM FEB',
                status: e.status || 'Mendatang',
                deskripsi: e.deskripsi || e.agenda || 'Tersinkronisasi dari Telegram BEM'
              }));
            finalEvents = [...newBridgeEvents, ...eventData];
          }
        }
      } catch (bridgeErr) {
        console.warn('Bridge offline, menggunakan cache lokal:', bridgeErr);
      }

      setEvents(finalEvents);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
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
        onOpenAntigravityModal={() => setIsBridgeModalOpen(true)}
        activeAntigravityProfile={activeAntigravityProfile}
        onLogout={onLogout}
        currentUser={currentUser}
        bridgeConnected={bridgeConnected}
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
          {/* PWA Mobile App Promo Banner (Clean Light ABMAS style) */}
          {showInstallBanner && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-blue-200 bg-blue-50/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#13539D] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Smartphone className="size-5 text-[#F7C828]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    Pasang Portal di HP Android & Laptop Windows (PWA)
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Akses instan seperti aplikasi mandiri dengan performa cepat tanpa membuka browser manual.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
                onClick={handleInstallPWA}
              >
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
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                        onClick={() => setIsAddTxOpen(true)}
                      >
                        <PlusCircle size={15} /> Catat Kas
                      </button>
                    )}

                    {(activeRoleKey === ROLES.KOOR_DIVISI || activeRoleKey === ROLES.BPH_KETUA) && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold shadow-xs transition cursor-pointer"
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

              {/* Tren Kehadiran & Aktivitas Terkini */}
              <DashboardTrends />

              {/* KONTEN KHUSUS UNTUK ANGGOTA / STAF (DUTY ROSTER PERSONAL ALA ABMAS) */}
              {activeRoleKey === ROLES.ANGGOTA_STAF && (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs border-l-4 border-l-emerald-500 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900">
                      <CheckSquare className="size-4 text-emerald-600" />
                      <span>Tugas Personal Anda ({pendingTasksForRole.length} Tertunda)</span>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                      onClick={() => setActiveTab('divisions')}
                    >
                      Buka Roster Lengkap
                    </button>
                  </div>
                  <div>
                    {pendingTasksForRole.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs font-medium">
                        🎉 Hebat! Semua tugas Anda telah selesai dikerjakan. Pertahankan performa KPI Anda!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingTasksForRole.map((t) => (
                          <div
                            key={t.id}
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition shadow-2xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <AdminBadge variant="yellow">{t.kategoriProker || 'Divisi'}</AdminBadge>
                                <span className="font-mono text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  Batas: {t.deadline}
                                </span>
                              </div>
                              <h4 className="text-xs font-extrabold text-slate-900">{t.judul}</h4>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {t.keterangan || "Lakukan koordinasi dengan koordinator divisi untuk eksekusi tugas ini."}
                              </p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-mono">
                                Subtugas: {(t.subtasks || []).filter((s) => s.completed).length} / {(t.subtasks || []).length}
                              </span>
                              <button
                                type="button"
                                className="px-2.5 py-1 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                onClick={() => setActiveTab('divisions')}
                              >
                                <span>Kerjakan</span>
                                <ChevronRight className="size-3" />
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
                <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                    <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-amber-900">
                      <AlertCircle className="size-4 text-amber-600" />
                      <span>Usulan Program Kerja Butuh Persetujuan ({prokerPending.length})</span>
                    </div>
                    {activeRoleKey === ROLES.BPH_KETUA && (
                      <span className="text-[11px] text-amber-700 font-bold bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Akses Validasi Ketua BPH
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {prokerPending.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl border border-amber-200 bg-white shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                Menunggu Approval
                              </span>
                              <span className="font-mono text-xs font-bold text-slate-800">
                                Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <h4 className="text-xs font-extrabold text-slate-900 mb-1">{p.nama_proker}</h4>
                            <p className="text-[11px] text-[#13539D] font-medium mb-1">
                              {p.departemen} • PJ: <span className="text-slate-700">{p.pj}</span>
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                              "{p.deskripsi}"
                            </p>
                          </div>

                          {activeRoleKey === ROLES.BPH_KETUA ? (
                            <div className="flex gap-2 pt-2 border-t border-slate-100">
                              <button
                                type="button"
                                className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                                onClick={() => handleApproveProker(p.id, true)}
                              >
                                <Check className="size-3.5" />
                                <span>Setujui</span>
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200 cursor-pointer"
                                onClick={() => handleApproveProker(p.id, false)}
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-100">
                              Menunggu persetujuan Ketua Umum BPH
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Grid 2 Kolom: Proker Aktif & Transaksi Terbaru Ala ABMAS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Proker Aktif Overview */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900">
                        <CalendarCheck className="size-4 text-[#13539D]" />
                        <span>Serapan Anggaran Proker Berjalan</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold text-[#13539D] hover:underline cursor-pointer"
                        onClick={() => setActiveTab('proker')}
                      >
                        Lihat Semua Proker →
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {prokerList.slice(0, 3).map((p) => {
                        const percent = Math.min(
                          Math.round(((p.realisasi_anggaran || 0) / (p.pagu_anggaran || 1)) * 100),
                          100
                        );
                        return (
                          <div key={p.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition">
                            <div className="flex justify-between items-center mb-1.5">
                              <strong className="text-xs font-bold text-slate-900">{p.nama_proker}</strong>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#13539D] border border-blue-200">
                                {p.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-2">
                              <span>Realisasi: Rp {Number(p.realisasi_anggaran || 0).toLocaleString('id-ID')}</span>
                              <span>Pagu: Rp {Number(p.pagu_anggaran).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#13539D] h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                            </div>
                            <div className="text-right text-[10px] font-bold text-[#13539D] font-mono mt-1">
                              Serapan: {percent}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Transaksi Kas Terbaru */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
                      <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900">
                        <Wallet className="size-4 text-emerald-600" />
                        <span>Mutasi Kas Terbaru</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold text-[#13539D] hover:underline cursor-pointer"
                        onClick={() => setActiveTab('finance')}
                      >
                        Buku Kas Lengkap →
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {transactions.slice(0, 4).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTx(t)}
                          className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${
                                t.tipe === 'Pemasukan'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {t.tipe === 'Pemasukan' ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                            </div>
                            <div>
                              <div className="text-xs font-extrabold text-slate-900 line-clamp-1">{t.keterangan}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {t.tanggal} • {t.kategori}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-mono text-xs font-bold ${
                                t.tipe === 'Pemasukan' ? 'text-emerald-700' : 'text-slate-800'
                              }`}
                            >
                              {t.tipe === 'Pemasukan' ? '+' : '-'} Rp {Number(t.jumlah).toLocaleString('id-ID')}
                            </div>
                            <span className="text-[10px] text-[#13539D] font-bold">Nota Tersedia</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2 Kolom: Agenda Terdekat & Advokasi Kampus Ala ABMAS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agenda Terdekat */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900">
                        <CalendarDays className="size-4 text-amber-600" />
                        <span>Agenda & Timeline Kerja BEM Terdekat</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold text-[#13539D] hover:underline cursor-pointer"
                        onClick={() => setActiveTab('calendar')}
                      >
                        Buka Kalender →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {events.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition flex justify-between items-center gap-3"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 mb-0.5">
                              {e.judul}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {e.tanggal} • {e.waktu}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              {e.lokasi}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap shrink-0">
                            {e.kategori}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advokasi Isu Mahasiswa Terkini */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900">
                        <MessageSquareCheck className="size-4 text-[#13539D]" />
                        <span>Isu Advokasi Mahasiswa FEB Dikawal</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold text-[#13539D] hover:underline cursor-pointer"
                        onClick={() => setActiveTab('advocacy')}
                      >
                        Buka Advokasi →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {advokasiList.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition flex justify-between items-center gap-3"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 mb-0.5">
                              {a.isu}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Bidang: {a.bidang} • Update: {a.updateTerakhir}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                              {a.tindakLanjut}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#13539D] border border-blue-200 whitespace-nowrap shrink-0">
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
          {/* TAB: STRUKTUR ORGANISASI (ALA ABMAS ORGANIZATION PAGE)         */}
          {/* ============================================================== */}
          {activeTab === 'organization' && (
            <OrganizationView activeRole={activeRole} />
          )}

          {/* ============================================================== */}
          {/* TAB: DATABASE FUNGSIONARIS & CRM (ALA ABMAS MEMBERS PAGE)      */}
          {/* ============================================================== */}
          {activeTab === 'members' && (
            <MembersDirectoryView activeRole={activeRole} />
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
          {/* TAB: ABSENSI & PRESENSI RAPAT (ALA ABMAS CHURCH ADMIN ABSENSI) */}
          {/* ============================================================== */}
          {activeTab === 'absensi' && (
            <AbsensiRapatView activeRole={activeRole} />
          )}

          {/* ============================================================== */}
          {/* TAB 3: PROGRAM KERJA & PAGU ANGGARAN (ALA ABMAS)               */}
          {/* ============================================================== */}
          {activeTab === 'proker' && (
            <ProkerManagementView
              prokerList={prokerList}
              onOpenAddModal={() => setIsAddProkerOpen(true)}
              onApproveProker={handleApproveProker}
              activeRoleKey={activeRoleKey}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 4: BUKU KAS UMUM & KEUANGAN (ALA ABMAS)                    */}
          {/* ============================================================== */}
          {(activeTab === 'finance' || activeTab === 'keuangan') && (
            <FinanceView
              transactions={transactions}
              onOpenAddModal={() => setIsAddTxOpen(true)}
              onExportCSV={handleExportCSV}
              onSelectReceipt={(t) => setSelectedTx(t)}
              activeRoleKey={activeRoleKey}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 5: KALENDER TIMELINE (ALA ABMAS CALENDAR ROSTER)           */}
          {/* ============================================================== */}
          {(activeTab === 'calendar' || activeTab === 'kalender') && (
            <CalendarTimeline
              events={events}
              prokerList={prokerList}
              onAddEvent={handleAddEvent}
              activeRole={activeRole}
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
              activeRole={activeRole}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 8: AUDIT TRAIL & LOG KOLABORASI (ALA ABMAS)                */}
          {/* ============================================================== */}
          {(activeTab === 'logs' || activeTab === 'audit') && (
            <AuditLogView logs={logs} />
          )}

          {/* ============================================================== */}
          {/* TAB: INPUT ABSENSI MANUAL                                       */}
          {/* ============================================================== */}
          {activeTab === 'absensi_input' && (
            <AbsensiInputView />
          )}

          {/* ============================================================== */}
          {/* TAB: DIVISI & PIC                                                */}
          {/* ============================================================== */}
          {activeTab === 'divisi_pic' && (
            <DivisiPicView />
          )}

          {/* ============================================================== */}
          {/* TAB: MANAJEMEN PENGGUNA                                           */}
          {/* ============================================================== */}
          {activeTab === 'user_management' && (
            <UserManagementView />
          )}

          {/* ============================================================== */}
          {/* TAB: IMPORT / EXPORT DATA                                         */}
          {/* ============================================================== */}
          {activeTab === 'import_export' && (
            <ImportExportView />
          )}

          {/* ============================================================== */}
          {/* TAB: PENGUMUMAN                                                   */}
          {/* ============================================================== */}
          {activeTab === 'pengumuman' && (
            <AnnouncementView />
          )}

          {/* ============================================================== */}
          {/* TAB: PENGAJUAN                                                    */}
          {/* ============================================================== */}
          {activeTab === 'pengajuan' && (
            <PengajuanView />
          )}

          {/* ============================================================== */}
          {/* TAB: CARE TRACKER                                                 */}
          {/* ============================================================== */}
          {activeTab === 'care_tracker' && (
            <CareTrackerView />
          )}

          {/* ============================================================== */}
          {/* TAB: PENGATURAN ORGANISASI                                        */}
          {/* ============================================================== */}
          {activeTab === 'pengaturan' && (
            <PengaturanOrganisasiView />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (PWA Light ABMAS style) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 border-t border-slate-200 z-50 flex lg:hidden items-center justify-around px-2 backdrop-blur shadow-lg">
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition cursor-pointer ${activeTab === 'dashboard' ? 'text-[#13539D]' : 'text-slate-400 hover:text-slate-700'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition cursor-pointer ${activeTab === 'members' ? 'text-[#13539D]' : 'text-slate-400 hover:text-slate-700'}`}
          onClick={() => setActiveTab('members')}
        >
          <Users size={18} />
          <span>Anggota</span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition cursor-pointer ${activeTab === 'divisions' || activeTab === 'workspace' ? 'text-[#13539D]' : 'text-slate-400 hover:text-slate-700'}`}
          onClick={() => setActiveTab('divisions')}
        >
          <Briefcase size={18} />
          <span>Tugas</span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition cursor-pointer ${activeTab === 'proker' ? 'text-[#13539D]' : 'text-slate-400 hover:text-slate-700'}`}
          onClick={() => setActiveTab('proker')}
        >
          <CalendarCheck size={18} />
          <span>Proker</span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition cursor-pointer ${activeTab === 'finance' || activeTab === 'keuangan' ? 'text-[#13539D]' : 'text-slate-400 hover:text-slate-700'}`}
          onClick={() => setActiveTab('finance')}
        >
          <Wallet size={18} />
          <span>Kas</span>
        </button>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition cursor-pointer ${activeTab === 'calendar' || activeTab === 'kalender' ? 'text-[#13539D]' : 'text-slate-400 hover:text-slate-700'}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarDays size={18} />
          <span>Kalender</span>
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

      <AntigravityBridgeModal
        isOpen={isBridgeModalOpen}
        onClose={() => setIsBridgeModalOpen(false)}
        onSyncEvents={() => loadData()}
      />
    </div>
  );
}

const LOGGED_USER_KEY = 'bem_logged_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(LOGGED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Gagal menyimpan sesi login:', e);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Gagal menyimpan perubahan profil:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOGGED_USER_KEY);
    } catch (e) {
      console.warn('Gagal menghapus sesi login:', e);
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.portalType === 'member') {
    return <MemberPortal user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
  }

  return <AdminPortal currentUser={currentUser} onLogout={handleLogout} />;
}
