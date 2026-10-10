import React, { useState, useMemo } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  ShieldCheck,
  TrendingUp,
  Award,
  Check,
  X,
  MessageCircle,
  Briefcase,
  Search,
  LayoutGrid,
  CalendarDays,
  Table as TableIcon,
  ExternalLink,
  CheckSquare,
  FileText,
  Sparkles
} from 'lucide-react';

export default function DivisionWorkspace({
  divisions = [],
  members = [],
  tasks = [],
  activeRole,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateSubtask,
  onUpdateTaskFull,
  onSendReminder
}) {
  const [selectedDivisiId, setSelectedDivisiId] = useState(divisions[0]?.id || 'akademik');
  const [activeSubTab, setActiveSubTab] = useState('tugas'); // 'tugas' | 'kpi'
  
  // View mode for tasks: 'kanban' | 'calendar' | 'table'
  const [viewMode, setViewMode] = useState('kanban');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('Semua'); // 'Semua' | 'Tugas Saya' | 'Sedang Berjalan' | 'Menunggu Review Koor' | 'Selesai'
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('Semua'); // 'Semua' | 'Tinggi' | 'Sedang' | 'Rendah'
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null); // 'YYYY-MM-DD'

  // Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState(null);
  const [reminderModal, setReminderModal] = useState(null); // { member, waUrl }
  const [copiedReminder, setCopiedReminder] = useState(false);

  // Form New Task (Enhanced with checklist)
  const [newTaskForm, setNewTaskForm] = useState({
    judul: '',
    kategoriProker: 'Administrasi & Surat',
    assignedTo: '',
    deadline: '2026-10-24',
    prioritas: 'Tinggi',
    bobotKpi: 25,
    keterangan: '',
    deliverableLink: '',
    subtasksInput: ['Analisis kebutuhan & koordinasi awal', 'Eksekusi pengerjaan', 'Submit bukti hasil kerja']
  });

  const [newSubtaskText, setNewSubtaskText] = useState('');

  const currentDivisi = divisions.find((d) => d.id === selectedDivisiId) || divisions[0];
  const divisionMembers = members.filter((m) => m.divisiId === selectedDivisiId);
  const divisionTasks = tasks.filter((t) => t.divisiId === selectedDivisiId);

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    return divisionTasks.filter((t) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.judul.toLowerCase().includes(q);
        const matchAssignee = t.assignedTo.toLowerCase().includes(q);
        const matchCategory = (t.kategoriProker || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAssignee && !matchCategory) return false;
      }

      // Status filter
      if (taskStatusFilter === 'Tugas Saya') {
        const isMyTask = t.assignedTo.toLowerCase().includes(activeRole?.name?.toLowerCase() || '');
        if (!isMyTask) return false;
      } else if (taskStatusFilter === 'Sedang Berjalan') {
        if (t.status !== 'Sedang Berjalan' && t.status !== 'Belum Selesai') return false;
      } else if (taskStatusFilter === 'Menunggu Review Koor') {
        if (t.status !== 'Menunggu Review Koor') return false;
      } else if (taskStatusFilter === 'Selesai') {
        if (t.status !== 'Selesai') return false;
      }

      // Priority filter
      if (taskPriorityFilter !== 'Semua') {
        if (t.prioritas !== taskPriorityFilter) return false;
      }

      // Calendar date filter (if clicked)
      if (selectedCalendarDate) {
        if (t.deadline !== selectedCalendarDate) return false;
      }

      return true;
    });
  }, [divisionTasks, searchQuery, taskStatusFilter, taskPriorityFilter, selectedCalendarDate, activeRole]);

  // Calculate Division Metrics (ABMAS style)
  const totalTasksCount = divisionTasks.length;
  const completedTasksCount = divisionTasks.filter((t) => t.status === 'Selesai').length;
  const reviewTasksCount = divisionTasks.filter((t) => t.status === 'Menunggu Review Koor').length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const avgKpi = divisionMembers.length
    ? Math.round(divisionMembers.reduce((acc, m) => acc + (m.kpiScore || 0), 0) / divisionMembers.length)
    : 0;
  const fulfilledMembersCount = divisionMembers.filter((m) => m.kpiScore >= 75).length;

  // Handlers for task creation
  const handleAddSubtaskInput = () => {
    if (!newSubtaskText.trim()) return;
    setNewTaskForm({
      ...newTaskForm,
      subtasksInput: [...newTaskForm.subtasksInput, newSubtaskText.trim()]
    });
    setNewSubtaskText('');
  };

  const handleRemoveSubtaskInput = (idx) => {
    setNewTaskForm({
      ...newTaskForm,
      subtasksInput: newTaskForm.subtasksInput.filter((_, i) => i !== idx)
    });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.judul.trim() || !newTaskForm.assignedTo) return;

    const formattedSubtasks = newTaskForm.subtasksInput.map((txt, index) => ({
      id: `st-${Date.now()}-${index}`,
      text: txt,
      completed: false
    }));

    onAddTask({
      judul: newTaskForm.judul.trim(),
      kategoriProker: newTaskForm.kategoriProker,
      assignedTo: newTaskForm.assignedTo,
      deadline: newTaskForm.deadline,
      prioritas: newTaskForm.prioritas,
      bobotKpi: Number(newTaskForm.bobotKpi),
      keterangan: newTaskForm.keterangan,
      deliverableLink: newTaskForm.deliverableLink,
      catatanKoor: '',
      subtasks: formattedSubtasks,
      divisiId: selectedDivisiId,
      divisiNama: currentDivisi.nama,
      role: 'Staf Divisi',
      status: 'Sedang Berjalan'
    });

    setIsAddTaskOpen(false);
    setNewTaskForm({
      judul: '',
      kategoriProker: 'Administrasi & Surat',
      assignedTo: '',
      deadline: '2026-10-24',
      prioritas: 'Tinggi',
      bobotKpi: 25,
      keterangan: '',
      deliverableLink: '',
      subtasksInput: ['Analisis kebutuhan & koordinasi awal', 'Eksekusi pengerjaan', 'Submit bukti hasil kerja']
    });
  };

  const handleToggleSubtask = (taskId, subtaskId, currentVal) => {
    if (onUpdateSubtask) {
      onUpdateSubtask(taskId, subtaskId, !currentVal);
    }
  };

  const handleTriggerReminder = async (member) => {
    const waUrl = await onSendReminder(member, member.tugasPendingUtama);
    setReminderModal({
      member,
      waUrl,
      taskTitle: member.tugasPendingUtama || 'Penyelesaian Target Proker Divisi'
    });
    setCopiedReminder(false);
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Selesai</span>;
      case 'Menunggu Review Koor':
        return <span className="badge badge-purple"><Clock size={12} /> Butuh Review</span>;
      case 'Sedang Berjalan':
        return <span className="badge badge-sky"><Sparkles size={12} /> Berjalan</span>;
      default:
        return <span className="badge badge-amber"><Clock size={12} /> Belum Selesai</span>;
    }
  };

  // Calendar dates for October 2026 (Month of active session)
  const calendarDays = useMemo(() => {
    const days = [];
    // October 2026 starts on Thursday (index 4 in 0=Sun or 3 in 1=Mon)
    // We'll generate 31 days
    for (let day = 1; day <= 31; day++) {
      const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
      const dayTasks = divisionTasks.filter((t) => t.deadline === dateStr);
      days.push({
        day,
        dateStr,
        tasks: dayTasks,
        hasTasks: dayTasks.length > 0,
        hasHighPriority: dayTasks.some((t) => t.prioritas === 'Tinggi' && t.status !== 'Selesai'),
        hasPendingReview: dayTasks.some((t) => t.status === 'Menunggu Review Koor'),
        allCompleted: dayTasks.length > 0 && dayTasks.every((t) => t.status === 'Selesai')
      });
    }
    return days;
  }, [divisionTasks]);

  return (
    <div className="division-workspace-module">
      {/* ============================================================== */}
      {/* 1. HEADER DENGAN GAYA EKSEKUTIF ALABMAS */}
      {/* ============================================================== */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-subtle pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--sky)', fontWeight: 700 }}>
              SISTEM KERJA & MONITORING DIVISI INTERNAL
            </span>
            <span className="badge badge-slate" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              Standard UI/UX Pro Max
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {currentDivisi?.nama}
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Koordinator: <strong style={{ color: '#fff' }}>{currentDivisi?.koordinator}</strong> • {currentDivisi?.deskripsi}
          </p>
        </div>

        {/* Quick Task Action (Koor & Ketua) */}
        {(activeRole?.id === 'koordinator' || activeRole?.id === 'ketua') && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setNewTaskForm({
                ...newTaskForm,
                assignedTo: divisionMembers[0]?.nama || ''
              });
              setIsAddTaskOpen(true);
            }}
          >
            <Plus size={16} /> Tugaskan Tugas Baru
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. DIVISION SELECTOR PILLS */}
      {/* ============================================================== */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '22px' }}>
        {divisions.map((div) => {
          const isSelected = div.id === selectedDivisiId;
          const pendingCount = tasks.filter((t) => t.divisiId === div.id && t.status !== 'Selesai').length;
          return (
            <button
              key={div.id}
              onClick={() => {
                setSelectedDivisiId(div.id);
                setSelectedCalendarDate(null);
              }}
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: '12px',
                padding: '8px 15px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{div.singkatan}</span>
              {pendingCount > 0 && (
                <span
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--amber-bg)',
                    color: isSelected ? '#fff' : 'var(--amber)',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 3. 4 METRIC CARDS ALA ABMAS (HIGH VISUAL HIERARCHY) */}
      {/* ============================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Metric 1: Rata-Rata KPI */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="font-mono" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)' }}>
                RATA-RATA KPI DIVISI
              </p>
              <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: avgKpi >= 75 ? 'var(--emerald)' : 'var(--amber)', marginTop: '6px' }}>
                {avgKpi}%
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--sky)', display: 'grid', placeItems: 'center' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
            Target Minimal Dekanat: <strong style={{ color: '#fff' }}>80%</strong>
          </div>
        </div>

        {/* Metric 2: Anggota Memenuhi KPI */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="font-mono" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)' }}>
                ANGGOTA MEMENUHI KPI
              </p>
              <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                {fulfilledMembersCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {divisionMembers.length} Staf</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', display: 'grid', placeItems: 'center' }}>
              <Award size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
            {Math.round((fulfilledMembersCount / (divisionMembers.length || 1)) * 100)}% fungsionaris memenuhi target
          </div>
        </div>

        {/* Metric 3: Tugas Pending & Review */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="font-mono" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)' }}>
                TUGAS DALAM PROSES
              </p>
              <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: pendingTasksCount > 0 ? 'var(--amber)' : 'var(--emerald)', marginTop: '6px' }}>
                {pendingTasksCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tugas</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', display: 'grid', placeItems: 'center' }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
            {reviewTasksCount > 0 ? (
              <span style={{ color: '#c084fc', fontWeight: 700 }}>⚠️ {reviewTasksCount} tugas butuh approval Koor</span>
            ) : (
              <span>{completedTasksCount} tugas selesai diverifikasi</span>
            )}
          </div>
        </div>

        {/* Metric 4: Koordinator PIC */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="font-mono" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dim)' }}>
                KOORDINATOR DIVISI
              </p>
              <div style={{ fontSize: '1.18rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                {currentDivisi?.koordinator}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--sky)', display: 'grid', placeItems: 'center' }}>
              <ShieldCheck size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--sky)', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
            PIC Evaluasi, Approval & Reminder KPI
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SUB-TABS NAVIGATION (ALA ABMAS WITH BADGES) */}
      {/* ============================================================== */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '22px' }}>
        <button
          className={`btn btn-sm ${activeSubTab === 'tugas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('tugas')}
          style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={15} />
          <span>Kalender & Pembagian Tugas Detail</span>
          <span style={{ background: activeSubTab === 'tugas' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1px 6px', fontSize: '0.7rem' }}>
            {divisionTasks.length}
          </span>
        </button>

        <button
          className={`btn btn-sm ${activeSubTab === 'kpi' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('kpi')}
          style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Users size={15} />
          <span>Monitoring KPI & Reminder Anggota</span>
          <span style={{ background: activeSubTab === 'kpi' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1px 6px', fontSize: '0.7rem' }}>
            {divisionMembers.length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: KALENDER & PEMBAGIAN TUGAS DETAIL */}
      {/* ============================================================== */}
      {activeSubTab === 'tugas' && (
        <div>
          {/* TOOLBAR KONTROL TUGAS: SEARCH, FILTER CHIPS, & VIEW SWITCHER */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Top row: Search input & View switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Cari tugas, nama PIC, atau kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '36px', height: '38px', fontSize: '0.84rem', borderRadius: '10px' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* View Switcher Segmented Control */}
              <div className="view-switcher-group">
                <button
                  className={`view-switcher-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                >
                  <LayoutGrid size={14} /> Kartu Grid
                </button>
                <button
                  className={`view-switcher-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarDays size={14} /> Kalender
                </button>
                <button
                  className={`view-switcher-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon size={14} /> Tabel Rinci
                </button>
              </div>
            </div>

            {/* Bottom row: Filter chips bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>Status:</span>
                {['Semua', 'Tugas Saya', 'Sedang Berjalan', 'Menunggu Review Koor', 'Selesai'].map((f) => (
                  <button
                    key={f}
                    className={`btn btn-sm ${taskStatusFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: '8px', padding: '4px 10px', fontSize: '0.76rem' }}
                    onClick={() => setTaskStatusFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Priority filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Prioritas:</span>
                <select
                  value={taskPriorityFilter}
                  onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '4px 10px', height: '32px', fontSize: '0.76rem', borderRadius: '8px' }}
                >
                  <option value="Semua">Semua Prioritas</option>
                  <option value="Tinggi">🔴 Tinggi (Mendesak)</option>
                  <option value="Sedang">🟡 Sedang</option>
                  <option value="Rendah">🟢 Rendah</option>
                </select>

                {selectedCalendarDate && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '8px', color: 'var(--sky)' }}
                    onClick={() => setSelectedCalendarDate(null)}
                  >
                    Reset Tanggal ({selectedCalendarDate}) <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VIEW MODE 1: KARTU KANBAN DENGAN SUBTASK CHECKLIST */}
          {/* ============================================================== */}
          {viewMode === 'kanban' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
                {filteredTasks.map((task) => {
                  const isDone = task.status === 'Selesai';
                  const isReview = task.status === 'Menunggu Review Koor';
                  const subtasks = task.subtasks || [];
                  const completedSubCount = subtasks.filter((st) => st.completed).length;
                  const totalSubCount = subtasks.length;
                  const subPercentage = totalSubCount > 0 ? Math.round((completedSubCount / totalSubCount) * 100) : isDone ? 100 : 0;

                  return (
                    <div
                      key={task.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-card)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.18s ease, border-color 0.18s ease'
                      }}
                      className="event-card"
                    >
                      {/* Top accent indicator line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: isDone
                            ? 'var(--emerald)'
                            : isReview
                            ? '#a855f7'
                            : task.prioritas === 'Tinggi'
                            ? 'var(--rose)'
                            : 'var(--amber)'
                        }}
                      />

                      <div>
                        {/* Header Badges: Category & Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--sky)',
                              background: 'rgba(56, 189, 248, 0.08)',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            {task.kategoriProker || 'Umum'}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getStatusBadge(task.status)}
                            <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber)' }}>
                              +{task.bobotKpi} Poin
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.35 }}>
                          {task.judul}
                        </h3>

                        {/* Deadline & PIC Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} color="var(--sky)" />
                            <span>Deadline: <strong className="mono" style={{ color: '#fff' }}>{task.deadline}</strong></span>
                          </div>
                          <span>•</span>
                          <span style={{ color: task.prioritas === 'Tinggi' ? 'var(--rose)' : 'var(--text-dim)', fontWeight: 600 }}>
                            Prioritas: {task.prioritas}
                          </span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.45, marginBottom: '16px' }}>
                          {task.keterangan}
                        </p>

                        {/* ============================================================== */}
                        {/* DETAIL: INTERACTIVE SUBTASKS CHECKLIST */}
                        {/* ============================================================== */}
                        {totalSubCount > 0 && (
                          <div
                            style={{
                              background: 'rgba(0, 0, 0, 0.25)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '12px',
                              padding: '12px 14px',
                              marginBottom: '16px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckSquare size={13} color="var(--sky)" /> Sub-tugas & Tahap Kerja
                              </span>
                              <span className="mono" style={{ fontSize: '0.72rem', color: subPercentage === 100 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                                {completedSubCount}/{totalSubCount} ({subPercentage}%)
                              </span>
                            </div>

                            {/* Subtask Mini Progress Bar */}
                            <div className="progress-track" style={{ height: '4px', margin: '0 0 10px 0' }}>
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${subPercentage}%`,
                                  background: subPercentage === 100 ? 'var(--emerald)' : 'linear-gradient(90deg, #38bdf8, #a855f7)'
                                }}
                              />
                            </div>

                            {/* Subtask items checklist */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {subtasks.slice(0, 3).map((st) => (
                                <label
                                  key={st.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.78rem',
                                    color: st.completed ? 'var(--text-muted)' : 'var(--text-main)',
                                    textDecoration: st.completed ? 'line-through' : 'none',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    className="subtask-checkbox"
                                    checked={st.completed}
                                    onChange={() => handleToggleSubtask(task.id, st.id, st.completed)}
                                  />
                                  <span>{st.text}</span>
                                </label>
                              ))}

                              {totalSubCount > 3 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--sky)', marginTop: '2px', cursor: 'pointer' }} onClick={() => setSelectedDetailTask(task)}>
                                  + {totalSubCount - 3} sub-tugas lainnya (klik untuk melihat)
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Deliverables Link if present */}
                        {task.deliverableLink && (
                          <div style={{ marginBottom: '14px', fontSize: '0.76rem' }}>
                            <a
                              href={task.deliverableLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--sky)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            >
                              <ExternalLink size={12} /> Bukti/Draft: {task.deliverableLink.replace('https://', '').slice(0, 35)}...
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: PIC & Actions */}
                      <div
                        style={{
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: 'var(--sky)',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            {task.assignedTo.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                              {task.assignedTo}
                            </div>
                            <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              NIM: {task.assignedToNim || 'Fungsionaris'}
                            </div>
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                            onClick={() => setSelectedDetailTask(task)}
                          >
                            Detail
                          </button>

                          {/* Quick Approval / Completion Button */}
                          {activeRole?.id === 'koordinator' || activeRole?.id === 'ketua' ? (
                            isDone ? (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: 'var(--emerald)', fontSize: '0.72rem' }}
                                onClick={() => onUpdateTaskStatus(task.id, 'Sedang Berjalan')}
                              >
                                <CheckCircle2 size={13} /> Selesai
                              </button>
                            ) : (
                              <button
                                className="btn btn-emerald btn-sm"
                                style={{ fontSize: '0.72rem' }}
                                onClick={() => onUpdateTaskStatus(task.id, 'Selesai')}
                              >
                                <Check size={13} /> Approve
                              </button>
                            )
                          ) : (
                            !isDone && (
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.72rem' }}
                                onClick={() => onUpdateTaskStatus(task.id, 'Menunggu Review Koor')}
                              >
                                Ajukan Review
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  <Calendar size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Tidak ada tugas yang cocok dengan filter.</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Coba ubah kata kunci pencarian atau reset filter di toolbar atas.</div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW MODE 2: KALENDER INTERAKTIF OKTOBER 2026 */}
          {/* ============================================================== */}
          {viewMode === 'calendar' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '20px', alignItems: 'start' }}>
              {/* Kalender Grid Box */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                    📅 Oktober 2026
                  </div>
                  <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                    Sesi Kerja Berjalan
                  </span>
                </div>

                {/* Day Header Names */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '10px' }}>
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((dayName) => (
                    <div key={dayName} style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Calendar Day Cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                  {/* Empty cells for offset: 1 Oct 2026 is Thursday (Kamis), so 3 empty cells before */}
                  <div style={{ opacity: 0.2 }} />
                  <div style={{ opacity: 0.2 }} />
                  <div style={{ opacity: 0.2 }} />

                  {calendarDays.map((cd) => {
                    const isSelected = selectedCalendarDate === cd.dateStr;
                    return (
                      <div
                        key={cd.dateStr}
                        onClick={() => setSelectedCalendarDate(isSelected ? null : cd.dateStr)}
                        className={`calendar-day-cell ${isSelected ? 'active-day' : ''} ${cd.dateStr === '2026-10-11' ? 'today' : ''}`}
                        title={cd.hasTasks ? `${cd.tasks.length} tugas jatuh tempo` : `Tanggal ${cd.day}`}
                      >
                        <span className="mono" style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 500 }}>
                          {cd.day}
                        </span>

                        {/* Task Indicators */}
                        {cd.hasTasks && (
                          <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
                            {cd.hasHighPriority && (
                              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--rose)' }} />
                            )}
                            {cd.hasPendingReview && (
                              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c084fc' }} />
                            )}
                            {cd.allCompleted && (
                              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--emerald)' }} />
                            )}
                            {!cd.hasHighPriority && !cd.hasPendingReview && !cd.allCompleted && (
                              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--amber)' }} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rose)' }} /> Prioritas Tinggi
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc' }} /> Butuh Review
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }} /> Selesai
                  </div>
                </div>
              </div>

              {/* Tasks Scheduled on Selected Date or Timeline */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                    {selectedCalendarDate ? `Agenda Tugas: ${selectedCalendarDate}` : 'Seluruh Jadwal Tugas Divisi Bulan Ini'}
                  </h3>
                  {selectedCalendarDate && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem' }}
                      onClick={() => setSelectedCalendarDate(null)}
                    >
                      Tampilkan Semua
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--sky)', fontWeight: 700 }}>
                            {t.deadline}
                          </span>
                          {getStatusBadge(t.status)}
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                          {t.judul}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          PIC: <strong style={{ color: '#fff' }}>{t.assignedTo}</strong> • Bobot: <span className="mono" style={{ color: 'var(--amber)' }}>+{t.bobotKpi} Poin</span>
                        </div>
                      </div>

                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', flexShrink: 0 }}
                        onClick={() => setSelectedDetailTask(t)}
                      >
                        Detail & Checklist
                      </button>
                    </div>
                  ))}

                  {filteredTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Tidak ada tugas jatuh tempo pada tanggal yang dipilih.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW MODE 3: TABEL RINCI MATRIKS (DATA-DENSE) */}
          {/* ============================================================== */}
          {viewMode === 'table' && (
            <div className="panel-card" style={{ marginBottom: 0 }}>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nama Tugas & Kategori</th>
                      <th>PIC Fungsionaris</th>
                      <th>Deadline</th>
                      <th style={{ textAlign: 'center' }}>Progres Sub-tugas</th>
                      <th style={{ textAlign: 'center' }}>Bobot KPI</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => {
                      const isDone = task.status === 'Selesai';
                      const subtasks = task.subtasks || [];
                      const completedCount = subtasks.filter((st) => st.completed).length;
                      const subPercentage = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : isDone ? 100 : 0;

                      return (
                        <tr key={task.id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                                {task.judul}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--sky)', marginTop: '2px' }}>
                                {task.kategoriProker || 'Umum'} • Prioritas: {task.prioritas}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>
                              {task.assignedTo}
                            </div>
                            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {task.assignedToNim || 'Staf'}
                            </div>
                          </td>

                          <td className="mono" style={{ fontSize: '0.82rem', color: '#fff' }}>
                            {task.deadline}
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                              {completedCount}/{subtasks.length} ({subPercentage}%)
                            </div>
                            <div className="progress-track" style={{ height: '4px', maxWidth: '100px', margin: '4px auto 0' }}>
                              <div
                                className="progress-fill"
                                style={{ width: `${subPercentage}%` }}
                              />
                            </div>
                          </td>

                          <td style={{ textAlign: 'center' }} className="mono">
                            <span style={{ color: 'var(--amber)', fontWeight: 700 }}>
                              +{task.bobotKpi}
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            {getStatusBadge(task.status)}
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                              onClick={() => setSelectedDetailTask(task)}
                            >
                              Periksa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: MONITORING KPI & REMINDER ANGGOTA */}
      {/* ============================================================== */}
      {activeSubTab === 'kpi' && (
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="var(--sky)" />
                <span>Monitoring Capaian KPI Anggota & Rekomendasi Reminder</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Khusus Koordinator Divisi & BPH untuk mengawal produktivitas dan kepatuhan target fungsionaris
              </div>
            </div>

            {/* Benchmark Pill */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Standar Dekanat: <strong style={{ color: 'var(--emerald)' }}>Minimal 75%</strong>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Fungsionaris / Anggota</th>
                  <th>Role Jabatan</th>
                  <th style={{ textAlign: 'center' }}>Progres Tugas</th>
                  <th style={{ textAlign: 'center' }}>Kehadiran Rapat</th>
                  <th style={{ textAlign: 'center' }}>Skor KPI</th>
                  <th style={{ textAlign: 'center' }}>Status Target</th>
                  <th style={{ textAlign: 'center' }}>Aksi Reminder</th>
                </tr>
              </thead>
              <tbody>
                {divisionMembers.map((member) => {
                  const isFulfilled = member.kpiScore >= 75;
                  return (
                    <tr key={member.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: isFulfilled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                              color: isFulfilled ? 'var(--emerald)' : 'var(--rose)',
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            {member.nama.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{member.nama}</div>
                            <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              NIM: {member.nim}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                        {member.role}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {member.tugasSelesai} / {member.totalTugas} Selesai
                        </div>
                        <div className="progress-track" style={{ height: '5px', marginTop: '4px' }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.round((member.tugasSelesai / (member.totalTugas || 1)) * 100)}%` }}
                          />
                        </div>
                      </td>

                      <td style={{ textAlign: 'center' }} className="mono">
                        <span style={{ color: member.kehadiranRapat >= 80 ? 'var(--emerald)' : 'var(--amber)', fontWeight: 700 }}>
                          {member.kehadiranRapat}%
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }} className="mono">
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isFulfilled ? 'var(--emerald)' : 'var(--rose)' }}>
                          {member.kpiScore}%
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isFulfilled ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                          {member.statusKpi}
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        {!isFulfilled ? (
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'var(--rose-bg)',
                              color: 'var(--rose)',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              fontSize: '0.75rem'
                            }}
                            onClick={() => handleTriggerReminder(member)}
                          >
                            <Send size={13} /> Ingatkan KPI
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> Sesuai Target
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: DETAIL TUGAS & INTERACTIVE SUBMISSION / APPROVAL */}
      {/* ============================================================== */}
      {selectedDetailTask && (
        <div className="modal-backdrop" onClick={() => setSelectedDetailTask(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', width: '92%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="var(--sky)" />
                <h3 style={{ fontSize: '1.1rem' }}>Detail & Lembar Kerja Tugas</h3>
              </div>
              <button className="btn-icon" onClick={() => setSelectedDetailTask(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Header Box */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-sky">{selectedDetailTask.kategoriProker || 'Proker Divisi'}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {getStatusBadge(selectedDetailTask.status)}
                    <span className="mono" style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.8rem' }}>
                      +{selectedDetailTask.bobotKpi} Poin
                    </span>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800, lineHeight: 1.35, marginBottom: '8px' }}>
                  {selectedDetailTask.judul}
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>PIC: <strong style={{ color: '#fff' }}>{selectedDetailTask.assignedTo}</strong></div>
                  <div>Deadline: <strong className="mono" style={{ color: '#fff' }}>{selectedDetailTask.deadline}</strong></div>
                  <div>Prioritas: <strong style={{ color: selectedDetailTask.prioritas === 'Tinggi' ? 'var(--rose)' : 'var(--amber)' }}>{selectedDetailTask.prioritas}</strong></div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Instruksi Pengerjaan:</label>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, border: '1px solid var(--border-subtle)' }}>
                  {selectedDetailTask.keterangan || 'Tidak ada instruksi khusus.'}
                </div>
              </div>

              {/* Interactive Subtasks Checklist */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>Tahap & Checklist Sub-tugas:</label>
                  <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--sky)' }}>
                    Centang untuk update progres langsung
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  {(selectedDetailTask.subtasks || []).map((st) => (
                    <label
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.82rem',
                        color: st.completed ? 'var(--text-muted)' : '#fff',
                        textDecoration: st.completed ? 'line-through' : 'none',
                        cursor: 'pointer',
                        padding: '4px 0'
                      }}
                    >
                      <input
                        type="checkbox"
                        className="subtask-checkbox"
                        checked={st.completed}
                        onChange={() => {
                          handleToggleSubtask(selectedDetailTask.id, st.id, st.completed);
                          // Update local state modal
                          setSelectedDetailTask({
                            ...selectedDetailTask,
                            subtasks: selectedDetailTask.subtasks.map((s) => (s.id === st.id ? { ...s, completed: !st.completed } : s))
                          });
                        }}
                      />
                      <span>{st.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deliverables / Link Bukti Pengerjaan */}
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Link Bukti Hasil Kerja (Google Drive / Docs / Figma / Dokumen):</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... atau https://docs.google.com/..."
                    value={selectedDetailTask.deliverableLink || ''}
                    onChange={(e) => setSelectedDetailTask({ ...selectedDetailTask, deliverableLink: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (onUpdateTaskFull) {
                        onUpdateTaskFull(selectedDetailTask.id, { deliverableLink: selectedDetailTask.deliverableLink });
                        alert('Tautan hasil kerja berhasil disimpan!');
                      }
                    }}
                  >
                    Simpan Tautan
                  </button>
                </div>
              </div>

              {/* Catatan Feedback Koordinator */}
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Catatan Evaluasi / Feedback Koordinator:</label>
                <textarea
                  rows="2"
                  placeholder="Catatan revisi atau konfirmasi approval dari Koordinator Divisi..."
                  value={selectedDetailTask.catatanKoor || ''}
                  onChange={(e) => setSelectedDetailTask({ ...selectedDetailTask, catatanKoor: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                  disabled={activeRole?.id !== 'koordinator' && activeRole?.id !== 'ketua'}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDetailTask(null)}>
                  Tutup
                </button>

                {/* Koordinator / Ketua controls */}
                {activeRole?.id === 'koordinator' || activeRole?.id === 'ketua' ? (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--amber)' }}
                      onClick={() => {
                        if (onUpdateTaskFull) {
                          onUpdateTaskFull(selectedDetailTask.id, {
                            status: 'Sedang Berjalan',
                            catatanKoor: selectedDetailTask.catatanKoor
                          });
                        }
                        setSelectedDetailTask(null);
                      }}
                    >
                      Minta Revisi
                    </button>
                    <button
                      className="btn btn-emerald btn-sm"
                      onClick={() => {
                        if (onUpdateTaskFull) {
                          onUpdateTaskFull(selectedDetailTask.id, {
                            status: 'Selesai',
                            catatanKoor: selectedDetailTask.catatanKoor || 'Disetujui dan diverifikasi oleh Koordinator.'
                          });
                        }
                        setSelectedDetailTask(null);
                      }}
                    >
                      <Check size={14} /> Validasi & Approve Selesai
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (onUpdateTaskFull) {
                        onUpdateTaskFull(selectedDetailTask.id, {
                          status: 'Menunggu Review Koor',
                          deliverableLink: selectedDetailTask.deliverableLink
                        });
                      }
                      setSelectedDetailTask(null);
                    }}
                  >
                    Ajukan Review ke Koordinator
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: TUGASKAN TUGAS BARU DENGAN SUBTASK BUILDER */}
      {/* ============================================================== */}
      {isAddTaskOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddTaskOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', width: '92%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={20} color="var(--sky)" />
                <h3 style={{ fontSize: '1.1rem' }}>Tugaskan Tugas Divisi Baru</h3>
              </div>
              <button className="btn-icon" onClick={() => setIsAddTaskOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Nama / Judul Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Follow up 5 Sponsor Utama FEB Career Expo"
                  className="form-control"
                  value={newTaskForm.judul}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, judul: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Kategori Alur Kerja *</label>
                  <select
                    className="form-control"
                    value={newTaskForm.kategoriProker}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, kategoriProker: e.target.value })}
                  >
                    <option value="Administrasi & Surat">Administrasi & Surat</option>
                    <option value="Kemitraan & Sponsor">Kemitraan & Sponsor</option>
                    <option value="Publikasi & Desain">Publikasi & Desain</option>
                    <option value="Logistik & Sarpras">Logistik & Sarpras</option>
                    <option value="Operasional Acara">Operasional Acara</option>
                    <option value="Advokasi & Riset">Advokasi & Riset</option>
                    <option value="Evaluasi & LPJ">Evaluasi & LPJ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Tugaskan Kepada *</label>
                  <select
                    className="form-control"
                    value={newTaskForm.assignedTo}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })}
                  >
                    {divisionMembers.map((m) => (
                      <option key={m.id} value={m.nama}>
                        {m.nama} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Deadline *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={newTaskForm.deadline}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Prioritas</label>
                  <select
                    className="form-control"
                    value={newTaskForm.prioritas}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, prioritas: e.target.value })}
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Bobot KPI (Poin)</label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    className="form-control mono"
                    value={newTaskForm.bobotKpi}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, bobotKpi: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Subtask Dynamic Builder */}
              <div>
                <label className="form-label">Rincian Checklist Sub-tugas (Tahapan):</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Tambah butir sub-tugas baru..."
                    className="form-control"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtaskInput();
                      }
                    }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSubtaskInput}>
                    + Tambah
                  </button>
                </div>

                {/* Subtasks pill list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {newTaskForm.subtasksInput.map((st, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <span>{idx + 1}. {st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtaskInput(idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer' }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Instruksi & Keterangan Tambahan</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Instruksi koordinasi atau referensi panduan..."
                  value={newTaskForm.keterangan}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, keterangan: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddTaskOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Simpan & Tugaskan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: PREVIEW & KIRIM WHATSAPP REMINDER */}
      {/* ============================================================== */}
      {reminderModal && (
        <div className="modal-backdrop" onClick={() => setReminderModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={20} color="var(--emerald)" />
                <h3 style={{ fontSize: '1.05rem' }}>Kirim Reminder KPI Anggota</h3>
              </div>
              <button className="btn-icon" onClick={() => setReminderModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Penerima Reminder:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  {reminderModal.member.nama} ({reminderModal.member.role})
                </div>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--sky)' }}>
                  WhatsApp: +{reminderModal.member.phone}
                </div>
              </div>

              <div>
                <label className="form-label">Template Pesan WhatsApp Otomatis:</label>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.5,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  *REMINDER TUGAS & EVALUASI KPI BEM FEB UKRIDA*<br /><br />
                  Halo {reminderModal.member.nama},<br />
                  Kami dari Koordinator Divisi {currentDivisi.nama} ingin mengingatkan terkait tugas:<br />
                  📌 *Tugas*: {reminderModal.taskTitle}<br />
                  📊 *Capaian KPI*: {reminderModal.member.kpiScore}% (Belum Memenuhi Target)<br /><br />
                  Mohon segera memperbarui progres pengerjaan di Portal BEM FEB UKRIDA. Terima kasih atas dedikasi dan semangat *Lead to Impact*!
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    const text = `*REMINDER TUGAS & EVALUASI KPI BEM FEB UKRIDA*\n\nHalo ${reminderModal.member.nama},\nKami dari Koordinator Divisi ${currentDivisi.nama} ingin mengingatkan terkait tugas:\n📌 *Tugas*: ${reminderModal.taskTitle}\n📊 *Capaian KPI*: ${reminderModal.member.kpiScore}%\n\nMohon segera memperbarui progres di Portal BEM FEB UKRIDA. Terima kasih!`;
                    navigator.clipboard.writeText(text);
                    setCopiedReminder(true);
                    setTimeout(() => setCopiedReminder(false), 2000);
                  }}
                >
                  {copiedReminder ? (
                    <>
                      <Check size={14} color="var(--emerald)" /> Tersalin!
                    </>
                  ) : (
                    'Salin Teks'
                  )}
                </button>

                <a
                  href={reminderModal.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-emerald btn-sm"
                  style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                >
                  <Send size={14} /> Buka WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
