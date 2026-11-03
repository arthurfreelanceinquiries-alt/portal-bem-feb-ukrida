import React, { useState } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  Copy,
  ShieldCheck,
  FolderOpen,
  Info,
  Check,
  FileText
} from 'lucide-react';
import { AdminPageHeader } from './common/AdminComponents';

export default function ResourceHub({ documents = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [copiedId, setCopiedId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const categories = ['Semua', 'Proposal & LPJ', 'Surat Perizinan', 'Media & Branding', 'Keuangan'];

  const filteredDocs = documents.filter((doc) => {
    const matchCat = selectedKategori === 'Semua' || doc.kategori === selectedKategori;
    const matchQuery =
      doc.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleSimulatedDownload = (doc) => {
    setDownloadSuccessId(doc.id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 3000);
  };

  const handleCopyFormat = (doc) => {
    const textToCopy = `*FORMAT RESMI BEM FEB UKRIDA*\nJudul Dokumen: ${doc.judul}\nKategori: ${doc.kategori}\nFormat: ${doc.format}\nSyarat Pengajuan:\n${doc.syarat.map((s, idx) => ` ${idx + 1}. ${s}`).join('\n')}\n\n_Harap koordinasikan dengan Sekretariat BEM FEB sebelum diserahkan ke Dekanat._`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(doc.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        eyebrow="STANDAR BIROKRASI & ADMINISTRASI RESMI"
        title="Pusat Dokumen & SOP BEM FEB UKRIDA"
        description="Format baku proposal 6 Bab Romawi, Laporan Pertanggungjawaban (LPJ), Surat Pengajuan Umum (SPU), pedoman margin Google Docs 4-3-3-3, dan media branding."
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Controls Bar Ala ABMAS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedKategori === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedKategori(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#13539D] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari template dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#13539D] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#13539D] border border-blue-200">
                    {doc.kategori}
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold border border-amber-200">
                    {doc.format} • {doc.ukuran}
                  </span>
                </div>

                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-slate-900 group-hover:text-[#13539D] transition mb-2 line-clamp-2">
                  {doc.judul}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {doc.deskripsi}
                </p>

                {/* Persyaratan Dekanat Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                  <div className="text-[10px] font-bold text-[#13539D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    <span>Ketentuan Dekanat & Biro</span>
                  </div>
                  <ul className="space-y-1">
                    {doc.syarat.map((s, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="size-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulatedDownload(doc)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#13539D] hover:bg-[#0d417d] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {downloadSuccessId === doc.id ? (
                      <>
                        <Check className="size-3.5" />
                        <span>Terunduh!</span>
                      </>
                    ) : (
                      <>
                        <Download className="size-3.5" />
                        <span>Unduh Berkas</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyFormat(doc)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer border border-slate-200"
                    title="Salin ringkasan ke clipboard"
                  >
                    {copiedId === doc.id ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-400 font-mono">
                  <span>Revisi: {doc.diperbarui}</span>
                  <span>Standar Mutu BEM FEB</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            <Info className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600">Tidak ada template dokumen yang sesuai dengan pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
