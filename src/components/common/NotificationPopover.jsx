import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, X, CheckCircle2, Megaphone, Inbox } from 'lucide-react';
import { STORAGE, readLocal, writeLocal, timeAgo } from '../../domain/mockData';

const TYPE_STYLE = {
  approval: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-600' },
  success: { icon: Check, className: 'bg-emerald-50 text-emerald-600' },
  rejected: { icon: X, className: 'bg-rose-50 text-rose-600' },
  announcement: { icon: Megaphone, className: 'bg-blue-50 text-[#13539D]' },
  info: { icon: Bell, className: 'bg-slate-100 text-slate-500' },
};

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => readLocal(STORAGE.notifications, []));
  const wrapperRef = useRef(null);

  const load = () => setNotifications(readLocal(STORAGE.notifications, []));

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = notifications
    .slice()
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 5);

  const persist = (next) => {
    setNotifications(next);
    writeLocal(STORAGE.notifications, next);
  };

  const markAllRead = () => {
    persist(notifications.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          load();
        }}
        className="relative grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#13539D] cursor-pointer"
        title="Notifikasi"
        aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[330px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Notifikasi</p>
              <p className="text-[10px] text-slate-500">{unreadCount} belum dibaca</p>
            </div>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold text-[#13539D]">
              LIVE
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Inbox className="size-7 text-slate-300" />
                <p className="mt-2 text-xs text-slate-400">Belum ada notifikasi.</p>
              </div>
            ) : (
              recent.map((notification) => {
                const meta = TYPE_STYLE[notification.type] || TYPE_STYLE.info;
                const Icon = meta.icon;
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markOneRead(notification.id)}
                    className={`flex w-full items-start gap-2.5 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 cursor-pointer ${
                      notification.read ? 'bg-white' : 'bg-blue-50/30'
                    }`}
                  >
                    <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${meta.className}`}>
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold leading-relaxed text-slate-800">
                        {notification.text}
                      </span>
                      <span className="mt-0.5 block font-mono text-[9px] text-slate-400">
                        {timeAgo(notification.timestamp)}
                      </span>
                    </span>
                    {!notification.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#13539D]" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] font-bold text-[#13539D] hover:underline cursor-pointer"
            >
              Tandai semua sudah dibaca
            </button>
            <span className="font-mono text-[9px] text-slate-400">{notifications.length} total</span>
          </div>
        </div>
      )}
    </div>
  );
}
