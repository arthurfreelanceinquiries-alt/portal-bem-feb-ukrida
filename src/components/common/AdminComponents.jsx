import React from "react";
import { X } from "lucide-react";

/**
 * Komponen UI Shared & Helper Reusable yang diselaraskan 1:1 dengan ABMAS
 * Mendukung warna institusi BEM FEB UKRIDA (Navy #13539D, Gold #F7C828, Emerald, Rose)
 */

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  isPositive,
  icon: Icon,
  variant = "blue",
  onClick,
}) {
  const styles = {
    blue: {
      bg: "bg-white border-slate-200 hover:border-blue-300",
      iconBg: "bg-blue-50 text-[#13539D]",
      accent: "text-[#13539D]",
    },
    yellow: {
      bg: "bg-white border-[#F7C828]/50 hover:border-[#F7C828]",
      iconBg: "bg-[#F7C828]/20 text-[#8a6d1a]",
      accent: "text-amber-900",
    },
    red: {
      bg: "bg-white border-rose-200 hover:border-rose-300",
      iconBg: "bg-rose-50 text-rose-700",
      accent: "text-rose-900",
    },
    green: {
      bg: "bg-white border-emerald-200 hover:border-emerald-300",
      iconBg: "bg-emerald-50 text-emerald-700",
      accent: "text-emerald-900",
    },
    white: {
      bg: "bg-white border-slate-200 shadow-xs",
      iconBg: "bg-slate-100 text-slate-700",
      accent: "text-slate-900",
    },
  };

  const currentStyle = styles[variant] || styles.blue;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
        currentStyle.bg
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p
            className={`mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold tracking-tight ${currentStyle.accent}`}
          >
            {value}
          </p>
        </div>
        <div
          className={`grid size-11 place-items-center rounded-xl font-bold shadow-xs shrink-0 ${currentStyle.iconBg}`}
        >
          {Icon && <Icon className="size-5" />}
        </div>
      </div>
      {(subtitle || change) && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs">
          {change && (
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 font-medium truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#13539D] font-bold">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-2xl lg:text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-xs lg:text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 flex-wrap">{action}</div>}
    </div>
  );
}

export function AdminBadge({
  variant = "default",
  children,
  className = "",
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-[#13539D] border-blue-200",
    yellow: "bg-[#F7C828]/15 text-[#8a6d1a] border-[#F7C828]/50",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${
        styles[variant] || styles.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function AdminTabs({
  tabs,
  activeTab,
  onChange,
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex whitespace-nowrap items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              isActive
                ? "bg-[#13539D] text-white shadow-md shadow-blue-500/10"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-white text-[#13539D]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function QuickModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
      <div
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-slate-900">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer shrink-0 ml-4"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
