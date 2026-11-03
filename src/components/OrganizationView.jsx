import React, { useState } from 'react';
import {
  Building,
  Users,
  ShieldCheck,
  Award,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function OrganizationView({ divisions = [], members = [] }) {
  // Available divisions / commissions in BEM FEB UKRIDA
  const orgCommissions = [
    {
      id: 'bph',
      title: 'Badan Pengurus Harian (BPH)',
      short: 'BPH',
      color: '#13539D',
      desc: 'Pimpinan eksekutif tertinggi BEM FEB UKRIDA Periode 2026 yang mengoordinasikan seluruh gerak organisasi.',
      pembina: [
        { role: 'Pelindung', name: 'Dr. Diana Frederica, S.E., M.Ak., CFP®., CHCP-A', title: 'Dekan FEB UKRIDA' },
        { role: 'Penasehat', name: 'Dr. Daniel Widjaja, S.E., M.M., CSCU, CEAP', title: 'Wakil Dekan FEB UKRIDA' }
      ],
      officers: [
        {
          role: 'Ketua BEM FEB UKRIDA',
          name: 'Arthur Reezan',
          nim: '312023002',
          prodi: 'S1 Manajemen',
          phone: '0812-3456-7890',
          email: 'arthur.312023002@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        },
        {
          role: 'Wakil Ketua BEM FEB UKRIDA',
          name: 'Princess Auralia Barus',
          nim: '322024025',
          prodi: 'S1 Akuntansi',
          phone: '0813-8901-2345',
          email: 'princess.322024025@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
        },
        {
          role: 'Sekretaris Umum',
          name: 'Clara Santoso',
          nim: '312023055',
          prodi: 'S1 Manajemen',
          phone: '0857-1234-5678',
          email: 'clara.santoso@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
        },
        {
          role: 'Bendahara Umum',
          name: 'Sarah Amalia',
          nim: '322023088',
          prodi: 'S1 Akuntansi',
          phone: '0819-8765-4321',
          email: 'sarah.amalia@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Memimpin koordinasi dan arah kebijakan strategis BEM FEB UKRIDA selama 1 periode kepengurusan.',
        'Menjadi representasi resmi mahasiswa FEB UKRIDA di hadapan Dekanat dan Rektorat.',
        'Mengawasi kedisiplinan administrasi, proposal 6 Bab, SPU, dan LPJ kegiatan.',
        'Mengelola sirkulasi perbendaharaan, kas BEM, dan validasi RAB zero-balance.'
      ]
    },
    {
      id: 'akademik',
      title: 'Divisi Pengembangan Akademik & Karier',
      short: 'Akademik',
      color: '#0284C7',
      desc: 'Fokus pada peningkatan prestasi akademik mahasiswa, bimbingan tutor sebaya, workshop pasar modal, dan persiapan karier.',
      officers: [
        {
          role: 'Koordinator Divisi',
          name: 'Dimas Prasetyo',
          nim: '312022045',
          prodi: 'S1 Manajemen',
          phone: '0812-4455-6677',
          email: 'dimas.prasetyo@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Menyelenggarakan tentier / bimbingan belajar menjelang UTS dan UAS bagi mahasiswa FEB.',
        'Mengadakan kompetisi bisnis, stock trading simulation, dan seminar akuntansi publik.',
        'Membangun kerja sama dengan galeri investasi dan asosiasi profesi ekonomi.'
      ]
    },
    {
      id: 'kerohanian',
      title: 'Divisi Kerohanian & Pengembangan Karakter',
      short: 'Kerohanian',
      color: '#8B5CF6',
      desc: 'Memfasilitasi pembinaan iman, retreat kepemimpinan kristiani, ibadah ucapan syukur, dan aksi kasih kampus.',
      officers: [
        {
          role: 'Koordinator Divisi',
          name: 'Jonathan Efraim',
          nim: '322023019',
          prodi: 'S1 Akuntansi',
          phone: '0813-2233-4455',
          email: 'jonathan.efraim@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Mengadakan persekutuan doa dan ibadah awal semester keluarga besar FEB UKRIDA.',
        'Mengelola program bakti sosial dan aksi kasih peduli jemaat/masyarakat sekitar.',
        'Menjaga nilai-nilai LEAD (Loving, Enlightening, Advanced, Determined) dalam etika berorganisasi.'
      ]
    },
    {
      id: 'seni_olahraga',
      title: 'Divisi Minat, Bakat, Seni & Olahraga',
      short: 'Seni & Olahraga',
      color: '#EC4899',
      desc: 'Wadah apresiasi seni, turnamen futsal, basket, badminton, serta e-sports antarmahasiswa FEB.',
      officers: [
        {
          role: 'Koordinator Divisi',
          name: 'Calvin Wijaya',
          nim: '312023091',
          prodi: 'S1 Manajemen',
          phone: '0817-6677-8899',
          email: 'calvin.wijaya@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Mengorganisir Pekan Olahraga dan Seni Mahasiswa FEB (PORFEB / FEB Cup).',
        'Memfasilitasi latihan rutin komunitas futsal, basket, dan band fakultas.',
        'Mewakili FEB dalam ajang kompetisi seni dan olahraga tingkat universitas / nasional.'
      ]
    },
    {
      id: 'humas',
      title: 'Divisi Hubungan Masyarakat & Kominfo',
      short: 'Humas & Kominfo',
      color: '#10B981',
      desc: 'Pintu gerbang komunikasi eksternal, pengelola media sosial @bemfeb_ukrida, publikasi desain visual, dan dokumentasi.',
      officers: [
        {
          role: 'Koordinator Divisi',
          name: 'Jessica Tanujaya',
          nim: '322023044',
          prodi: 'S1 Akuntansi',
          phone: '0818-3344-5566',
          email: 'jessica.tanujaya@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Mengelola konten Instagram, TikTok, LinkedIn resmi BEM FEB UKRIDA.',
        'Menerbitkan press release hasil rapat pleno dan rekapan kegiatan resmi fakultas.',
        'Merancang identitas visual, poster kegiatan, dan merchandise resmi organisasi.'
      ]
    },
    {
      id: 'psdm',
      title: 'Divisi Pengembangan Sumber Daya Manusia (PSDM)',
      short: 'PSDM',
      color: '#F59E0B',
      desc: 'Bertanggung jawab atas regenerasi, pelatihan kepemimpinan (LKMM-TD/TM), evaluasi kinerja fungsionaris, dan keakraban tim.',
      officers: [
        {
          role: 'Koordinator Divisi',
          name: 'Andre Kurniawan',
          nim: '312022067',
          prodi: 'S1 Manajemen',
          phone: '0812-7788-9900',
          email: 'andre.kurniawan@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Melakukan rekrutmen terbuka dan seleksi fungsionaris baru BEM FEB UKRIDA.',
        'Mengawasi evaluasi kinerja bulanan (KPI Engine) seluruh staf divisi.',
        'Menyelenggarakan Latihan Keterampilan Manajemen Mahasiswa (LKMM) dan Makrab Fungsionaris.'
      ]
    },
    {
      id: 'advokasi',
      title: 'Divisi Advokasi & Kesejahteraan Mahasiswa',
      short: 'Advokasi',
      color: '#EF4444',
      desc: 'Kanal resmi penyaluran aspirasi mahasiswa, advokasi fasilitas perkuliahan, transparansi UKT, dan pendampingan birokrasi.',
      officers: [
        {
          role: 'Koordinator Divisi',
          name: 'Vania Stephanie',
          nim: '312023012',
          prodi: 'S1 Manajemen',
          phone: '0857-9900-1122',
          email: 'vania.stephanie@civitas.ukrida.ac.id',
          status: 'Aktif Menjabat',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
        }
      ],
      tupoksi: [
        'Membuka dan memoderasi Helpdesk Aspirasi Mahasiswa FEB UKRIDA secara berkala.',
        'Mengadakan audiensi resmi bersama Dekanat terkait kebijakan akademik dan sarana kampus.',
        'Membantu pendampingan mahasiswa yang menghadapi kendala administratif perkuliahan.'
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState('bph');
  const currentComm = orgCommissions.find((c) => c.id === activeTab) || orgCommissions[0];

  // Filter members belonging to this division
  const currentMembers = members.filter((m) => {
    if (activeTab === 'bph') return m.divisiId === 'bph' || !m.divisiId;
    return m.divisiId === activeTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="TATA KELOLA KEPENGURUSAN • KABINET SOVEREIGN 2026"
        title="Struktur Organisasi & Divisi BEM FEB UKRIDA"
        description="Peta kepemimpinan eksekutif, pembina dekanat, fungsionaris divisi, serta rincian tugas pokok dan fungsi (tupoksi) resmi."
      />

      {/* Switcher Pill Bar Ala ABMAS ToggleGroup */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {orgCommissions.map((comm) => {
            const isActive = activeTab === comm.id;
            return (
              <button
                key={comm.id}
                type="button"
                onClick={() => setActiveTab(comm.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#13539D] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: isActive ? '#F7C828' : comm.color }}
                />
                <span>{comm.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Division Overview Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <div
              className="size-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xs shrink-0"
              style={{ backgroundColor: currentComm.color }}
            >
              <Building className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-slate-900">
                  {currentComm.title}
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-[#13539D] border border-blue-200">
                  Periode 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {currentComm.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Pembina Dekanat (Khusus BPH) */}
        {currentComm.pembina && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#13539D]" />
              Pimpinan & Pembina Fakultas Ekonomi dan Bisnis
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {currentComm.pembina.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {p.role}
                    </span>
                    <h5 className="text-xs font-extrabold text-slate-900 mt-0.5">{p.name}</h5>
                    <p className="text-[11px] text-slate-500 font-medium">{p.title}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    Dekanat
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Officers Grid Ala ABMAS */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <Users className="size-4 text-[#13539D]" />
            Pengurus Utama ({currentComm.short})
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentComm.officers.map((off, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 transition shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={off.avatar}
                    alt={off.name}
                    className="size-12 rounded-2xl object-cover border-2 border-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#13539D] border border-blue-100 mb-1">
                      {off.role}
                    </span>
                    <h5 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-[#13539D] transition">
                      {off.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-mono">
                      NIM: {off.nim} • {off.prodi}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-slate-400" />
                    <span>{off.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-slate-400" />
                    <span className="truncate">{off.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tupoksi List */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <Briefcase className="size-4 text-[#13539D]" />
            Tugas Pokok & Fungsi (Tupoksi)
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {currentComm.tupoksi.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-2.5 text-xs text-slate-700"
              >
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff / Fungsionaris Members Table */}
        {currentMembers.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <Award className="size-4 text-[#13539D]" />
                Fungsionaris & Anggota Tim ({currentMembers.length} Orang)
              </h4>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Nama Fungsionaris</th>
                    <th className="py-3 px-4">NIM & Prodi</th>
                    <th className="py-3 px-4">Peran</th>
                    <th className="py-3 px-4">Skor KPI</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <img
                          src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                          alt={m.name}
                          className="size-7 rounded-xl object-cover"
                        />
                        <span>{m.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{m.nim || '-'}</td>
                      <td className="py-3 px-4 text-slate-700">{m.role || 'Staf Divisi'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          (m.kpiScore || 80) >= 80
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {m.kpiScore || 80} / 100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500"></span>
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
