/**
 * KPI Engine & Task Progression Logic untuk BEM FEB UKRIDA
 * Mengkalkulasi KPI fungsionaris secara otomatis dan memfasilitasi reminder WhatsApp
 */

export function calculateMemberKpi({
  completedTasks = 0,
  totalTasks = 0,
  attendedMeetings = 0,
  totalMeetings = 4,
}) {
  const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 100;
  const attendanceRate = totalMeetings > 0 ? (attendedMeetings / totalMeetings) * 100 : 100;

  // Bobot: 60% Tugas Terpenuhi, 40% Presensi Pleno & Rapat Divisi
  const score = Math.round(taskRate * 0.6 + attendanceRate * 0.4);

  let status = "Sangat Baik";
  let variant = "green";

  if (score >= 85) {
    status = "Sangat Memuaskan";
    variant = "green";
  } else if (score >= 75) {
    status = "Standar Terpenuhi";
    variant = "blue";
  } else if (score >= 60) {
    status = "Perlu Perhatian";
    variant = "yellow";
  } else {
    status = "Perlu Evaluasi Khusus";
    variant = "red";
  }

  return {
    score,
    taskRate: Math.round(taskRate),
    attendanceRate: Math.round(attendanceRate),
    status,
    variant,
    needsReminder: score < 75,
  };
}

/**
 * Generator URL WhatsApp untuk mengingatkan fungsionaris yang belum memenuhi KPI atau memiliki tugas tertunda
 */
export function generateWhatsAppReminderUrl({
  phone,
  memberName,
  coordinatorName = "Koordinator Divisi",
  divisionName = "BEM FEB UKRIDA",
  pendingTasks = [],
  kpiScore = 70,
}) {
  const cleanPhone = (phone || "").replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("0")
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith("62")
    ? cleanPhone
    : `62${cleanPhone}`;

  const taskListText =
    pendingTasks.length > 0
      ? pendingTasks.map((t, idx) => `   ${idx + 1}. *${t.title}* (Batas: ${t.dueDate || "Segera"})`).join("\n")
      : "   - Penyelesaian laporan & checklist proker berjalan.";

  const message = `Halo rekan *${memberName}* 👋, salam semangat dari Pengurus BEM FEB UKRIDA (*Lead to Impact*).\n\n` +
    `Saya *${coordinatorName}* ingin memberikan pengingat terkait progres kinerja dan pemenuhan KPI kamu di *${divisionName}*:\n\n` +
    `📊 *Skor KPI Saat Ini*: ${kpiScore}%\n` +
    `📌 *Tugas Tertunda Yang Perlu Dituntaskan*:\n${taskListText}\n\n` +
    `Mohon segera mengunggah bukti kerja atau memperbarui checklist tugas kamu di Portal BEM FEB UKRIDA agar evaluasi kinerja divisimu tetap optimal ya.\n\n` +
    `Semangat selalu melayani, jika ada kendala jangan ragu untuk berdiskusi! 🙌`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
