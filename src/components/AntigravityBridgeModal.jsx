import React, { useState, useEffect } from 'react';
import {
  Bot,
  Cpu,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Laptop,
  Key,
  ShieldCheck,
  Send,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  fetchBridgeStatus,
  switchAntigravityProfile,
  fetchBridgeMeetings,
  fetchBridgeNotulensi
} from '../lib/bridgeClient';

export default function AntigravityBridgeModal({ isOpen, onClose, onSyncEvents }) {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'telegram' | 'notulensi'
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [switchingId, setSwitchingId] = useState(null);
  const [switchSuccess, setSwitchSuccess] = useState('');
  const [meetingsData, setMeetingsData] = useState(null);
  const [notulensiList, setNotulensiList] = useState([]);

  // Load status
  const loadStatus = async () => {
    setLoading(true);
    const res = await fetchBridgeStatus();
    setConnected(res.connected);
    setStatusData(res.data);
    setLoading(false);
  };

  const loadMeetings = async () => {
    const res = await fetchBridgeMeetings();
    if (res.ok) {
      setMeetingsData(res);
      if (onSyncEvents && res.events) {
        onSyncEvents(res.events);
      }
    }
  };

  const loadNotulensi = async () => {
    const res = await fetchBridgeNotulensi();
    if (res.ok) {
      setNotulensiList(res.items || []);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      loadMeetings();
      loadNotulensi();
    }
  }, [isOpen]);

  const handleSwitchAccount = async (profileId) => {
    setSwitchingId(profileId);
    setSwitchSuccess('');
    const res = await switchAntigravityProfile(profileId);
    setSwitchingId(null);
    if (res.ok) {
      setSwitchSuccess(`Akun berhasil diganti: ${res.active_profile}`);
      loadStatus();
      setTimeout(() => setSwitchSuccess(''), 4000);
    } else {
      alert(`Gagal mengganti akun: ${res.error || 'Server error'}`);
    }
  };

  if (!isOpen) return null;

  const accounts = statusData?.accounts || [
    { id: 'arthur_pro', name: 'Arthur Reezan (Google AI Pro)', role: 'Ketua BEM FEB UKRIDA', plan: 'Google AI Pro', status: 'active' },
    { id: 'sekretariat', name: 'Laptop Sekretariat BEM FEB', role: 'Sekretariat BEM FEB UKRIDA', plan: 'Google AI Pro', status: 'standby' },
    { id: 'bendahara', name: 'Laptop Bendahara BEM FEB', role: 'Bendahara BEM FEB UKRIDA', plan: 'Google AI Pro', status: 'standby' },
    { id: 'estafet_2027', name: 'Akun Pengurus Berikutnya (Hand-Me-Down)', role: 'Regenerasi 2027', plan: 'Google AI Pro', status: 'standby', hand_me_down: true }
  ];

  const activeAccount = statusData?.active_account || accounts.find(a => a.status === 'active') || accounts[0];
  const telegram = statusData?.telegram || { online: false, status: 'offline', configured: false };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#13539D] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F7C828]">
              <Bot className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-lg text-white">
                  Antigravity Engine & Telegram Remote
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  connected ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                }`}>
                  <span className={`size-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {connected ? 'Bridge Connected (Port 9440)' : 'Lokal / Offline'}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5 font-medium">
                Sistem Tata Kelola Otonom BEM FEB UKRIDA • Model: DeepSeek Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-[#13539D] text-[#13539D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="size-4" />
            <span>Akun Antigravity (BYOA)</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'telegram'
                ? 'border-[#13539D] text-[#13539D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="size-4" />
            <span>Telegram Remote Ketua</span>
            {telegram.online && (
              <span className="size-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notulensi')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'notulensi'
                ? 'border-[#13539D] text-[#13539D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="size-4" />
            <span>Notulensi & Second Brain</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {notulensiList.length}
            </span>
          </button>

          <div className="ml-auto flex items-center py-2">
            <button
              onClick={() => { loadStatus(); loadMeetings(); loadNotulensi(); }}
              disabled={loading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              title="Refresh status"
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin text-[#13539D]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {switchSuccess && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{switchSuccess}</span>
            </div>
          )}

          {/* TAB 1: ACCOUNTS (BYOA / HAND-ME-DOWN) */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 border border-blue-100 flex items-start gap-3">
                <Sparkles className="size-5 text-[#13539D] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-slate-900 mb-0.5">
                    Arsitektur Hand-Me-Down (Bring Your Own Antigravity)
                  </p>
                  <p className="leading-relaxed">
                    Setiap pengurus/laptop dapat memilih akun Antigravity (Google AI Pro) masing-masing. Nol tagihan API berbayar untuk BEM FEB, dan sistem dapat langsung diwariskan ke laptop kepengurusan periode berikutnya.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2.5">
                  Pilih Akun Antigravity Aktif
                </h4>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {accounts.map((acc) => {
                    const isActive = statusData?.active_profile === acc.id || acc.status === 'active';
                    const isSwitching = switchingId === acc.id;

                    return (
                      <div
                        key={acc.id}
                        className={`relative rounded-2xl border p-4 transition-all ${
                          isActive
                            ? 'border-[#13539D] bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`size-8 rounded-xl flex items-center justify-center ${
                              isActive ? 'bg-[#13539D] text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Cpu className="size-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{acc.name}</span>
                                {acc.hand_me_down && (
                                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
                                    Estafet
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {acc.role}
                              </p>
                            </div>
                          </div>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#13539D] text-white">
                              Aktif
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-600 mb-3 line-clamp-2">
                          {acc.notes || `Plan: ${acc.plan || 'Google AI Pro'} • Provider: ${acc.provider || 'Antigravity'}`}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSwitchAccount(acc.id)}
                          disabled={isActive || isSwitching}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {isSwitching ? (
                            <>
                              <RefreshCw className="size-3.5 animate-spin" />
                              <span>Mengalihkan...</span>
                            </>
                          ) : isActive ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-emerald-600" />
                              <span>Profil Sedang Aktif</span>
                            </>
                          ) : (
                            <span>Aktifkan Akun Ini</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TELEGRAM EXECUTIVE REMOTE */}
          {activeTab === 'telegram' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${
                    telegram.online ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Send className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        Bot Telegram Executive (@lkfeb)
                      </span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        telegram.online ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {telegram.online ? 'ONLINE' : 'STANDBY / OFFLINE'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {telegram.online
                        ? `Tersambung sebagai @${telegram.username || 'bot'}`
                        : 'Bot berjalan di LK-FEB Bridge (jalankan start_bridge.py untuk online)'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={loadMeetings}
                  className="px-3 py-1.5 rounded-xl bg-[#13539D] text-white text-xs font-bold hover:bg-[#0d417d] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Sync Rapat</span>
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Daftar Perintah Telegram Ketua BEM
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-xs font-mono font-bold text-[#13539D] bg-blue-50 px-2 py-0.5 rounded">
                        /rapat waktu | tempat | agenda
                      </code>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Jadwal Kalender</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Menjadwalkan rapat resmi, auto-sync ke kalender portal dan generate file <code>.ics</code>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-xs font-mono font-bold text-[#13539D] bg-blue-50 px-2 py-0.5 rounded">
                        /reminder waktu | pesan
                      </code>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pengingat</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Mencatat pengingat penting (misal: penyerahan LPJ, batas SPK narasumber).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-xs font-mono font-bold text-[#13539D] bg-blue-50 px-2 py-0.5 rounded">
                        Catatan Bebas / Voice Note
                      </code>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Auto-Notulensi</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Kirim pesan atau voice note hasil rapat mentah, Antigravity DeepSeek otomatis menyusun Minutes of Meeting (MoM) resmi dan mengarsipkannya di Second Brain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTULENSI & SECOND BRAIN */}
          {activeTab === 'notulensi' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  Arsip tersimpan di <code>07_Second_Brain/notulensi/</code>
                </p>
                <span className="text-xs font-bold text-slate-700">
                  Total: {notulensiList.length} berkas
                </span>
              </div>

              {notulensiList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                  <FileText className="size-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-slate-600">Belum ada notulensi rapat</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Kirim catatan rapat ke Telegram Bot (@lkfeb) untuk membuat notulensi otomatis.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notulensiList.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{item.title || item.filename}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.date || item.created_at}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {item.summary || item.snippet || 'Notulensi resmi hasil rapat internal BEM FEB UKRIDA.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="size-4 text-[#13539D]" />
            <span>BEM FEB UKRIDA Periode 2026 • Sovereign Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
