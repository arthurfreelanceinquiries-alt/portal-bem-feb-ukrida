# BEM FEB UKRIDA — DESIGN SYSTEM GUIDELINES (`DESIGN.md`)
*Standard Design System Token & Component Rules for Google Stitch & Frontend Implementation*

---

## 1. Brand Identity & Vibe
* **Organization**: Badan Eksekutif Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Kristen Krida Wacana (BEM FEB UKRIDA)
* **Motto**: *"Lead to Impact"* (Loving, Enlightening, Advanced, Determined)
* **Aesthetic Vibe**: **Executive Academic & Financial Tech** — Wibawa korporat bisnis modern, bersih, berteknologi tinggi, namun hangat dan transparan.

---

## 2. Color Palette (HSL & Hex)

### Primary & Brand Colors
* **Ukrida Deep Navy (Background Base)**: `#081225` / `rgb(8, 18, 37)`
* **Surface Card Navy**: `#0f1f38` / `rgb(15, 31, 56)`
* **Surface Highlight / Hover**: `#162846` / `rgb(22, 40, 70)`
* **Electric Cobalt Blue (Primary)**: `#2563eb` / `rgb(37, 99, 235)`
* **Sky Blue Accent**: `#38bdf8` / `rgb(56, 189, 248)`

### Functional Semantic Colors
* **Financial Emerald (Kas Pemasukan / Sukses)**: `#10b981` (Glow: `rgba(16, 185, 129, 0.2)`)
* **Leadership Amber (Proker Pending / Agenda Penting)**: `#f59e0b` (Glow: `rgba(245, 158, 11, 0.2)`)
* **Alert Rose (Pengeluaran / Tenggat Waktu)**: `#f43f5e` (Glow: `rgba(244, 63, 94, 0.2)`)
* **Border Subtle**: `rgba(255, 255, 255, 0.08)`
* **Border Active / Focus**: `rgba(56, 189, 248, 0.35)`

---

## 3. Typography
* **Primary Sans**: `Plus Jakarta Sans`, sans-serif
* **Monospace / Financial Digits**: `JetBrains Mono`, monospace (`font-variant-numeric: tabular-nums`)
* **Scale**:
  * Heading 1 (Page Title): `1.35rem` — `1.5rem`, Weight: 800
  * Heading 2 (Panel Section): `1.05rem` — `1.15rem`, Weight: 700
  * Body Text: `0.85rem` — `0.92rem`, Weight: 400 - 500, Line-height: 1.5
  * Caption & Metadata: `0.7rem` — `0.78rem`, Weight: 500 - 600

---

## 4. UI Surfaces & Elevation
* **Border Radius**:
  * Cards / Panels: `14px`
  * Buttons & Inputs: `8px` — `10px`
  * Badges & Chips: `20px` (Full Pill)
* **Shadows**:
  * Card Depth: `0 10px 25px -5px rgba(0, 0, 0, 0.45)`
  * Glow Accent: `0 0 20px -3px rgba(37, 99, 235, 0.25)`
* **Glassmorphism**:
  * Backdrop Blur: `blur(14px)`
  * Alpha Overlay: `rgba(15, 31, 56, 0.85)`

---

## 5. Master Prompt untuk Google Stitch (Prompt-to-UI)
Salin teks di bawah ini ke kanvas **Google Stitch** (`stitch.withgoogle.com`):

```text
Create a high-fidelity internal executive dashboard for "BEM FEB UKRIDA" (Student Executive Board of Faculty of Economics & Business at Krida Wacana Christian University).
Theme: Modern Executive Dark Navy (#081225) with vibrant cobalt blue (#2563eb), gold amber (#f59e0b), and emerald green (#10b981) accents.
Layout structure:
1. Executive Top Header: Logo, University badge ("LEAD TO IMPACT"), active role switcher (Ketua Umum BPH, Bendahara Umum, Koordinator Divisi).
2. KPI Metric Cards: Sisa Kas Operasional, Total Pemasukan Dekanat, Realisasi Belanja, Status Serapan Anggaran.
3. Master Work Calendar: Upcoming executive board meetings, LKMM-TD, and FEB Career Expo with timeline tags.
4. Digital Cashbook & Receipt Vault: Transaction tables with view receipt modal trigger and verified badges.
5. Official Document Downloads: Clean cards for official Dekanat proposal templates, activity permits, and LPJ guidelines.
Make it touch-friendly, responsive, with sleek glassmorphism cards and clean tabular typography for all currency values.
```
