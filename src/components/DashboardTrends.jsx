import React, { useMemo } from 'react';
import { Activity, TrendingUp, Bell, CheckCircle2, Clock } from 'lucide-react';
import { STORAGE, readLocal, formatDateID, timeAgo } from '../domain/mockData';

const ACTIVITY_COLORS = {
  absensi: 'bg-blue-500',
  pengumuman: 'bg-violet-500',
  keuangan: 'bg-emerald-500',
  proker: 'bg-amber-500',
  pengajuan: 'bg-sky-500',
  user: 'bg-slate-400',
  divisi: 'bg-indigo-500',
  care: 'bg-rose-500',
  import: 'bg-cyan-500',
  export: 'bg-cyan-500',
  pengaturan: 'bg-slate-400',
};

export default function DashboardTrends() {
  const sessions = useMemo(() => {
    const all = readLocal(STORAGE.absensi, []);
    return all
      .slice()
      .sort((a, b) => String(a.tanggal).localeCompare(String(b.tanggal)))
      .slice(-6);
  }, []);

  const activities = useMemo(() => {
    const all = readLocal(STORAGE.activity, []);
    return all
      .slice()
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
      .slice(0, 5);
  }, []);

  const chartData = sessions.map((session) => {
    const records = session.records || [];
    const hadir = records.filter((r) => r.status === 'Hadir').length;
    const rate = records.length ? Math.round((hadir / records.length) * 100) : 0;
    return {
      id: session.id,
      label: formatDateID(session.tanggal),
      shortLabel: String(session.tanggal || '').slice(5).replace('-', '/'),
      judul: session.judul || session.kategori,
      hadir,
      total: records.length,
      rate,
    };
  });

  const average = chartData.length
    ? Math.round(chartData.reduce((sum, item) => sum + item.rate, 0) / chartData.length)
    : 0;

  const chartWidth = 640;
  const chartHeight = 230;
  const padding = { top: 24, right: 16, bottom: 42, left: 36 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const barSlot = chartData.length ? innerWidth / chartData.length : innerWidth;
  const barWidth = Math.min(48, barSlot * 0.55);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr]">
      {/* Trend chart */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <span>📊</span> Tren Kehadiran
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Persentase fungsionaris hadir pada 6 sesi absensi terakhir.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#13539D]">
            <TrendingUp className="size-3" /> Rata-rata {average}%
          </span>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp className="size-9 text-slate-300" />
            <p className="mt-2 text-xs font-semibold text-slate-500">Belum ada data absensi.</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Simpan sesi pertama di menu Input Absensi Real-Time.
            </p>
          </div>
        ) : (
          <div className="mt-4 w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-auto w-full min-w-[520px]"
              role="img"
              aria-label="Grafik tren kehadiran rapat"
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((tick) => {
                const y = padding.top + innerHeight - (tick / 100) * innerHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray={tick === 0 ? '0' : '4 4'}
                    />
                    <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">
                      {tick}%
                    </text>
                  </g>
                );
              })}

              {chartData.map((item, index) => {
                const barHeight = Math.max(2, (item.rate / 100) * innerHeight);
                const x = padding.left + index * barSlot + (barSlot - barWidth) / 2;
                const y = padding.top + innerHeight - barHeight;
                return (
                  <g key={item.id || index}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="7"
                      fill="#13539D"
                      opacity={item.rate >= 85 ? 1 : 0.78}
                    >
                      <title>{`${item.label}: ${item.hadir}/${item.total} hadir (${item.rate}%)`}</title>
                    </rect>
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="#13539D"
                      fontFamily="monospace"
                    >
                      {item.rate}%
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={padding.top + innerHeight + 16}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#475569"
                    >
                      {item.shortLabel}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={padding.top + innerHeight + 28}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#94A3B8"
                      fontFamily="monospace"
                    >
                      {item.hadir}/{item.total}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <span>🔔</span> Aktivitas Terkini
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">5 rekam jejak terakhir di portal.</p>
          </div>
          <Bell className="size-4 text-slate-300" />
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="size-8 text-slate-300" />
            <p className="mt-2 text-xs text-slate-400">Belum ada aktivitas tercatat.</p>
          </div>
        ) : (
          <div className="mt-3 space-y-1">
            {activities.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-start gap-3 rounded-xl px-1.5 py-2.5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col items-center pt-1">
                  <span className={`size-2 rounded-full ${ACTIVITY_COLORS[item.type] || 'bg-slate-400'}`} />
                  {index < activities.length - 1 && <span className="mt-1 h-7 w-px bg-slate-200" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[11px] font-semibold leading-relaxed text-slate-800">
                    {item.text}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400">
                    <span className="font-bold text-[#13539D]">{item.actor}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-0.5 font-mono">
                      <Clock className="size-2.5" /> {timeAgo(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[10px] text-slate-500">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          Data tersinkron otomatis dari modul absensi, pengajuan, dan pengumuman.
        </div>
      </div>
    </div>
  );
}
