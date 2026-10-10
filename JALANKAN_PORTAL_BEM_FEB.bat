@echo off
title Portal Eksekutif BEM FEB UKRIDA
color 0B
cd /d "%~dp0"

echo ======================================================================
echo           PORTAL MANAJEMEN & OPERASIONAL BEM FEB UKRIDA
echo               Universitas Kristen Krida Wacana
echo                   "LEAD TO IMPACT"
echo ======================================================================
echo.
echo [1/2] Memulai server lokal Vite...
echo [2/2] Membuka portal di browser otomatis (http://localhost:5173/)
echo.
echo CATATAN:
echo - Jendela hitam ini adalah server lokal aplikasi Anda.
echo - Jangan tutup jendela ini selama Anda menggunakan website.
echo - Tutup jendela ini atau tekan CTRL + C jika sudah selesai.
echo ======================================================================
echo.

:: Menjalankan server dan langsung membuka browser bawaan Windows
call npm run dev -- --open

:: Fallback jika npm run dev bermasalah
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Mencoba menjalankan melalui Vite langsung...
    call npx vite --open
)

pause
