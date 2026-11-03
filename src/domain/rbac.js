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
 * Mengelompokkan item navigasi sidebar ala ChurchAdminSidebar ABMAS (4 Grup Baku)
 */
export function getSidebarNavigation(currentRole) {
  const isKetua = currentRole === ROLES.BPH_KETUA;
  const isKoor = currentRole === ROLES.KOOR_DIVISI;
  const isStaf = currentRole === ROLES.ANGGOTA_STAF;
  const isBendahara = currentRole === ROLES.BENDAHARA;

  const groups = [];

  // Group 1: DASHBOARD UTAMA
  groups.push({
    title: "DASHBOARD UTAMA",
    items: [
      {
        id: "dashboard",
        label: isKetua ? "Executive Overview" : isKoor ? "Ringkasan Divisi" : isStaf ? "Dashboard Fungsionaris" : "Rekap Anggaran",
        icon: "LayoutDashboard",
        badge: "Live"
      },
      {
        id: "organization",
        label: "Struktur Organisasi",
        icon: "Building"
      }
    ]
  });

  // Group 2: DATA FUNGSIONARIS & TUGAS (Internal)
  groups.push({
    title: isStaf ? "PORTAL TUGAS PRIBADI" : "FUNGSIONARIS & TUGAS",
    items: [
      {
        id: "divisions",
        label: isStaf ? "Tugas Saya (Duty Roster)" : "Matriks Tugas 6 Divisi",
        icon: "CheckSquare",
        badge: isStaf ? "My Tasks" : "Kanban"
      },
      {
        id: "absensi",
        label: "Presensi Rapat BEM",
        icon: "CheckCircle2"
      }
    ]
  });

  // Group 3: PROGRAM KERJA & BIROKRASI
  groups.push({
    title: "PROGRAM KERJA & BIROKRASI",
    items: [
      {
        id: "proker",
        label: "Master Program Kerja",
        icon: "FolderKanban"
      },
      {
        id: "calendar",
        label: "Master Kalender Proker",
        icon: "Calendar"
      },
      {
        id: "resources",
        label: "Pusat Dokumen & SOP",
        icon: "FileText"
      }
    ]
  });

  // Group 4: ADMINISTRASI & KEUANGAN
  groups.push({
    title: "ADMINISTRASI & KEUANGAN",
    items: [
      {
        id: "finance",
        label: "Buku Kas & Transaksi",
        icon: "Wallet",
        badge: isBendahara ? "Utama" : undefined
      },
      {
        id: "advocacy",
        label: "Advokasi & Aspirasi",
        icon: "Scale"
      },
      {
        id: "logs",
        label: "Log Audit Sistem",
        icon: "BarChart2"
      }
    ]
  });

  return groups;
}
