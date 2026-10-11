import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  User,
  Wallet,
  Cloud,
  Plus,
} from "lucide-react";
import { ROLES, ROLE_PROFILES } from "../../domain/rbac";
import { AdminBadge } from "../common/AdminComponents";

export default function AdminHeader({
  activeRole,
  onRoleChange,
  activeTab,
  onOpenMobileSidebar,
  onOpenCloudConfig,
  onOpenQuickTask,
  cloudConfigured = false,
}) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentProfile = ROLE_PROFILES[activeRole] || ROLE_PROFILES[ROLES.BPH_KETUA];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleOptions = [
    {
      role: ROLES.BPH_KETUA,
      label: "Ketua Umum / BPH",
      persona: "Arthur Reezan",
      desc: "Akses Penuh Fakultas & Validasi",
      icon: ShieldCheck,
      badgeColor: "blue",
    },
    {
      role: ROLES.KOOR_DIVISI,
      label: "Koordinator Divisi",
      persona: "Dimas Prasetyo",
      desc: "Manajemen Staf & Reminder KPI",
      icon: UserCheck,
      badgeColor: "yellow",
    },
    {
      role: ROLES.ANGGOTA_STAF,
      label: "Fungsionaris / Staf",
      persona: "Vania Stephanie",
      desc: "Duty Roster & Submit Bukti Kerja",
      icon: User,
      badgeColor: "green",
    },
    {
      role: ROLES.BENDAHARA,
      label: "Bendahara Umum",
      persona: "Sarah Amalia",
      desc: "Pembukuan Kas & Verifikasi Nota",
      icon: Wallet,
      badgeColor: "purple",
    },
  ];

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case "dashboard":
        return activeRole === ROLES.BPH_KETUA ? "Executive Overview" : "Ringkasan Eksekutif";
      case "divisions":
        return activeRole === ROLES.ANGGOTA_STAF
          ? "Tugas Saya (Duty Roster)"
          : activeRole === ROLES.KOOR_DIVISI
          ? "Command Center Divisi"
          : "Workspace & Matriks Divisi";
      case "calendar":
        return "Timeline Proker & Kalender";
      case "finance":
        return "Perbendaharaan & Kas BEM";
      case "advocacy":
        return "Kanal Advokasi Mahasiswa FEB";
      case "resources":
        return "Pusat Dokumen & SK Dekanat";
      default:
        return "Portal";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-7 shadow-xs">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          aria-label="Buka Menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-2xl bg-[#13539D] font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-[#F7C828] shadow-sm">
            B
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <b className="font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-base font-black text-slate-900 leading-tight">
                BEM FEB <span className="text-[#13539D]">UKRIDA</span>
              </b>
              <span className="hidden sm:inline-block font-mono text-[9px] font-bold bg-[#F7C828]/20 text-[#8a6d1a] px-1.5 py-0.2 rounded-full border border-[#F7C828]/40">
                2026/2027
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <span>Portal</span>
              <span>/</span>
              <span className="text-[#13539D] font-semibold">{getBreadcrumbLabel()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Quick Task Create (ABMAS Style) */}
        {activeRole !== ROLES.BENDAHARA && (
          <button
            type="button"
            onClick={onOpenQuickTask}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-[#13539D] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0d417d] transition cursor-pointer"
          >
            <Plus className="size-3.5 text-[#F7C828]" />
            <span>{activeRole === ROLES.ANGGOTA_STAF ? "Catat Tugas" : "Bagi Tugas"}</span>
          </button>
        )}

        {/* Cloud Sync Status */}
        <button
          type="button"
          onClick={onOpenCloudConfig}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition border cursor-pointer ${
            cloudConfigured
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
          title={cloudConfigured ? "Tersambung ke Supabase Cloud" : "Penyimpanan Lokal Aktif (Klik untuk koneksi cloud)"}
        >
          <Cloud className={`size-3.5 ${cloudConfigured ? "text-emerald-600" : "text-slate-400"}`} />
          <span className="hidden sm:inline">
            {cloudConfigured ? "Cloud Sync" : "Lokal Aktif"}
          </span>
        </button>

        {/* Quick Role Switcher Pill (ABMAS Signature Feature) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 px-2.5 sm:px-3 py-1.5 transition cursor-pointer shadow-2xs"
            aria-expanded={isRoleDropdownOpen}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <AdminBadge variant={currentProfile.badgeColor}>
                    {currentProfile.badgeLabel}
                  </AdminBadge>
                </div>
                <div className="text-[11px] font-bold text-slate-800 hidden sm:block truncate max-w-[130px]">
                  {currentProfile.name}
                </div>
              </div>
            </div>
            <ChevronDown className={`size-3.5 text-slate-500 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  Simulasi & Ganti Peran (RBAC)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih peran untuk melihat portal dari perspektif fungsionaris tersebut:
                </p>
              </div>

              <div className="space-y-1">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isCurrent = activeRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => {
                        onRoleChange(opt.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition cursor-pointer ${
                        isCurrent
                          ? "bg-blue-50/80 text-[#13539D] font-bold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div
                        className={`mt-0.5 grid size-8 place-items-center rounded-lg ${
                          isCurrent
                            ? "bg-[#13539D] text-white shadow-xs"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate">{opt.label}</span>
                          {isCurrent && (
                            <span className="size-1.5 rounded-full bg-[#13539D]"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium truncate">
                          {opt.persona}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-400 text-center font-medium">
                Pola otentikasi role-based 1:1 portal ABMAS
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
