/**
 * bridgeClient.js
 * Client interface untuk LK-FEB Bridge (http://127.0.0.1:9440)
 * BEM FEB UKRIDA — Periode 2026
 */

const DEFAULT_BRIDGE_URL = 'http://127.0.0.1:9440';

export function getBridgeBaseUrl() {
  if (typeof window !== 'undefined' && window.__LK_FEB_BRIDGE_URL__) {
    return window.__LK_FEB_BRIDGE_URL__;
  }
  return localStorage.getItem('BEM_FEB_BRIDGE_URL') || DEFAULT_BRIDGE_URL;
}

export function setBridgeBaseUrl(url) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('BEM_FEB_BRIDGE_URL', url);
  }
}

/**
 * Cek status bridge, profil aktif, dan Telegram bot
 */
export async function fetchBridgeStatus() {
  const baseUrl = getBridgeBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/status`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return { ok: true, connected: true, data };
  } catch (err) {
    return {
      ok: false,
      connected: false,
      error: err.message,
      data: {
        active_profile: 'arthur_pro',
        active_account: {
          id: 'arthur_pro',
          name: 'Arthur Reezan (Google AI Pro)',
          role: 'Ketua BEM FEB UKRIDA',
          plan: 'Google AI Pro',
          status: 'active'
        },
        telegram: { online: false, status: 'offline', configured: false },
        accounts: [
          { id: 'arthur_pro', name: 'Arthur Reezan (Google AI Pro)', role: 'Ketua BEM FEB UKRIDA', status: 'active' },
          { id: 'sekretariat', name: 'Laptop Sekretariat BEM FEB', role: 'Sekretariat BEM FEB UKRIDA', status: 'standby' },
          { id: 'bendahara', name: 'Laptop Bendahara BEM FEB', role: 'Bendahara BEM FEB UKRIDA', status: 'standby' },
          { id: 'estafet_2027', name: 'Akun Pengurus Berikutnya (Hand-Me-Down)', role: 'Regenerasi 2027', status: 'standby', hand_me_down: true }
        ],
        total_rapat: 0,
        total_reminders: 0,
        total_notulensi: 0
      }
    };
  }
}

/**
 * Ganti profil akun Antigravity aktif
 */
export async function switchAntigravityProfile(profileId) {
  const baseUrl = getBridgeBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/antigravity/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId })
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Ambil daftar rapat & reminder yang tersinkronisasi dari Telegram
 */
export async function fetchBridgeMeetings() {
  const baseUrl = getBridgeBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/meetings`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message, meetings: [], reminders: [], events: [] };
  }
}

/**
 * Tambah rapat atau reminder baru ke bridge (sinkron ke kalender .ics)
 */
export async function createBridgeMeeting(meetingData) {
  const baseUrl = getBridgeBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData)
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Ambil notulensi rapat resmi dari Second Brain
 */
export async function fetchBridgeNotulensi() {
  const baseUrl = getBridgeBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/notulensi?full=1`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message, items: [], total: 0 };
  }
}
