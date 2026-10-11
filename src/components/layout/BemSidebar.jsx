import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Wallet,
  Scale,
  FileText,
  CheckSquare,
  Layers,
  BarChart2,
  Users,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ROLES, ROLE_PROFILES, getSidebarNavigation } from "../../domain/rbac";
import { AdminBadge } from "../common/AdminComponents";

// Peta Icon Lucide dinamis
const ICON_MAP = {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Wallet,
  Scale,
  FileText,
  CheckSquare,
  Layers,
  BarChart2,
  Users,
  ShieldCheck,
};

export default function BemSidebar({
  activeRole,
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  pendingTaskCount = 0,
}) {
  const currentProfile = ROLE_PROFILES[activeRole] || ROLE_PROFILES[ROLES.BPH_KETUA];
  const navGroups = getSidebarNavigation(activeRole);

  const renderNavGroup = (group, groupIdx) => (
    <div key={groupIdx} className="mb-6">
      <div className="px-3 mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {group.title}
        </span>
      </div>
      <nav className="space-y-1">
        {group.items.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                if (isMobileOpen) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer group ${
                isActive
                  ? "bg-[#13539D] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive ? "text-[#F7C828]" : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Badges or counters */}
              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F7C828]/20 text-[#8a6d1a] border border-[#F7C828]/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.id === "divisions" && activeRole === ROLES.ANGGOTA_STAF && pendingTaskCount > 0 && (
                <span
                  className={`grid size-5 place-items-center rounded-full text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-white text-[#13539D]" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {pendingTaskCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#13539D] to-[#0A2E5C] text-[#F7C828] font-black text-lg shadow-sm">
            LK
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-black text-slate-900 leading-tight">
              BEM FEB UKRIDA
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#13539D] font-bold">
              Lead to Impact 26/27
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {navGroups.map((group, idx) => renderNavGroup(group, idx))}
      </div>

      {/* Bottom Profile Card (ABMAS style) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <img
            src={currentProfile.avatar}
            alt={currentProfile.name}
            className="size-9 rounded-full object-cover ring-2 ring-white shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {currentProfile.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <AdminBadge variant={currentProfile.badgeColor} className="text-[8px] px-1.5 py-0">
                {currentProfile.badgeLabel}
              </AdminBadge>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 font-medium truncate">
          {currentProfile.email}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
