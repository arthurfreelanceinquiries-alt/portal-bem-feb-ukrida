/**
 * Role-Based Access Control (RBAC) & Persona Engine untuk BEM FEB UKRIDA
 * Mengikuti arsitektur peran portal ABMAS dengan adaptasi fungsionaris kampus
 */

export const ROLES = {
  BPH_KETUA: "BPH_KETUA",
  KOOR_DIVISI: "KOOR_DIVISI",
  ANGGOTA_STAF: "ANGGOTA_STAF",
  BENDAHARA: "BENDAHARA",
};

export const ROLE_PROFILES = {
  [ROLES.BPH_KETUA]: {
    id: "ketua",
    role: ROLES.BPH_KETUA,
    name: "Arthur Reezan",
    nim: "102022001",
    title: "Ketua Umum BEM FEB UKRIDA",
    divisionId: "bph",
    divisionName: "Badan Pengurus Harian (BPH)",
    badgeColor: "blue",
    badgeLabel: "Ketua Umum / BPH",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "6281234567890",
    email: "arthur.reezan@civitas.ukrida.ac.id",
  },
  [ROLES.KOOR_DIVISI]: {
    id: "koordinator",
    role: ROLES.KOOR_DIVISI,
    name: "Dimas Prasetyo",
    nim: "102022045",
    title: "Koordinator Divisi (PJ Proker)",
    divisionId: "akademik",
    divisionName: "Divisi Pengembangan Akademik & Karier",
    badgeColor: "yellow",
    badgeLabel: "Koordinator Divisi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "6281987654321",
    email: "dimas.prasetyo@civitas.ukrida.ac.id",
  },
  [ROLES.ANGGOTA_STAF]: {
    id: "anggota",
    role: ROLES.ANGGOTA_STAF,
    name: "Vania Stephanie",
    nim: "102023012",
    title: "Fungsionaris Staf Divisi Akademik",
    divisionId: "akademik",
    divisionName: "Divisi Pengembangan Akademik & Karier",
    badgeColor: "green",
    badgeLabel: "Fungsionaris / Staf",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "6285712345678",
    email: "vania.stephanie@civitas.ukrida.ac.id",
  },
  [ROLES.BENDAHARA]: {
    id: "bendahara",
    role: ROLES.BENDAHARA,
    name: "Sarah Amalia",
    nim: "102022088",
    title: "Bendahara Umum BEM FEB",
    divisionId: "bph",
    divisionName: "Perbendaharaan BEM",
    badgeColor: "purple",
    badgeLabel: "Bendahara Umum",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    phone: "6281398765432",
    email: "sarah.amalia@civitas.ukrida.ac.id",
  },
};

/**
 * Matriks Hak Akses per Peran
 */
export const PERMISSIONS = {
  [ROLES.BPH_KETUA]: {
    viewAllDivisions: true,
    manageAllTasks: true,
    approveProposals: true,
    manageFinances: true,
    viewAdvocacy: true,
    sendReminders: true,
    manageMembers: true,
    auditLogs: true,
  },
  [ROLES.KOOR_DIVISI]: {
    viewAllDivisions: true, // dapat melihat gambaran, fokus pada divisinya
    manageAllTasks: false,
    manageDivisionTasks: true,
    approveProposals: false,
    manageFinances: false,
    viewAdvocacy: true,
    sendReminders: true,
    manageMembers: true,
    auditLogs: false,
  },
  [ROLES.ANGGOTA_STAF]: {
    viewAllDivisions: false,
    manageAllTasks: false,
    manageDivisionTasks: false,
    approveProposals: false,
    manageFinances: false,
    viewAdvocacy: true,
    sendReminders: false,
    manageMembers: false,
    auditLogs: false,
    submitDutyProof: true,
    checkSubtasks: true,
  },
  [ROLES.BENDAHARA]: {
    viewAllDivisions: true,
    manageAllTasks: false,
    approveProposals: false,
    manageFinances: true,
    viewAdvocacy: false,
    sendReminders: false,
    manageMembers: false,
    auditLogs: true,
  },
};

export function hasPermission(role, action) {
  const rolePerms = PERMISSIONS[role] || {};
  return Boolean(rolePerms[action]);
}

/**
 * Mengelompokkan item navigasi sidebar ala ChurchAdminSidebar ABMAS
 */
export function getSidebarNavigation(currentRole) {
  const isKetua = currentRole === ROLES.BPH_KETUA;
  const isKoor = currentRole === ROLES.KOOR_DIVISI;
  const isStaf = currentRole === ROLES.ANGGOTA_STAF;
  const isBendahara = currentRole === ROLES.BENDAHARA;

  const groups = [];

  // Group 1: OVERVIEW & UTAMA
  const mainItems = [];
  if (isKetua) {
    mainItems.push({ id: "dashboard", label: "Executive Overview", icon: "LayoutDashboard", badge: "Live" });
    mainItems.push({ id: "divisions", label: "Matriks 6 Divisi", icon: "FolderKanban" });
    mainItems.push({ id: "calendar", label: "Master Kalender Proker", icon: "Calendar" });
  } else if (isKoor) {
    mainItems.push({ id: "divisions", label: "Divisi Saya (Command)", icon: "Layers", badge: "Koor" });
    mainItems.push({ id: "calendar", label: "Timeline Kerja Divisi", icon: "Calendar" });
    mainItems.push({ id: "dashboard", label: "Ringkasan Fakultas", icon: "LayoutDashboard" });
  } else if (isStaf) {
    mainItems.push({ id: "divisions", label: "Tugas Saya (Duty Roster)", icon: "CheckSquare", badge: "My Tasks" });
    mainItems.push({ id: "calendar", label: "Kalender Deadline Saya", icon: "Calendar" });
    mainItems.push({ id: "resources", label: "Arsip & Template Dokumen", icon: "FileText" });
  } else if (isBendahara) {
    mainItems.push({ id: "finance", label: "Buku Kas & Transaksi", icon: "Wallet", badge: "Kas" });
    mainItems.push({ id: "dashboard", label: "Dashboard Rekap Anggaran", icon: "LayoutDashboard" });
    mainItems.push({ id: "divisions", label: "Pagu Anggaran Divisi", icon: "FolderKanban" });
  }

  groups.push({
    title: isStaf ? "PORTAL TUGAS PRIBADI" : "PENGURUSAN UTAMA",
    items: mainItems,
  });

  // Group 2: OPERASIONAL & TATA KELOLA
  const operationalItems = [];
  if (isKetua) {
    operationalItems.push({ id: "finance", label: "Perbendaharaan & Kas BEM", icon: "Wallet" });
    operationalItems.push({ id: "advocacy", label: "Advokasi & Aspirasi Kampus", icon: "Scale" });
    operationalItems.push({ id: "resources", label: "Pusat Dokumen & SK Dekan", icon: "FileText" });
  } else if (isKoor) {
    operationalItems.push({ id: "advocacy", label: "Aspirasi Mahasiswa FEB", icon: "Scale" });
    operationalItems.push({ id: "resources", label: "SOP & Panduan Proker", icon: "FileText" });
  } else if (isStaf) {
    operationalItems.push({ id: "advocacy", label: "Form Aspirasi Mahasiswa", icon: "Scale" });
    operationalItems.push({ id: "dashboard", label: "Pantau Capaian BEM", icon: "BarChart2" });
  } else if (isBendahara) {
    operationalItems.push({ id: "resources", label: "Standar Biaya & Nota Resmi", icon: "FileText" });
    operationalItems.push({ id: "calendar", label: "Timeline Pencairan Dana", icon: "Calendar" });
  }

  if (operationalItems.length > 0) {
    groups.push({
      title: isBendahara ? "PELAPORAN & KEUANGAN" : "TATA KELOLA & ARSIP",
      items: operationalItems,
    });
  }

  return groups;
}
