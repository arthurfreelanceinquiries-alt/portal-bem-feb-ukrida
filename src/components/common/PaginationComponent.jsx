import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function buildPageList(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
}

export default function PaginationComponent({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
}) {
  if (totalPages <= 0) return null;

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const end = Math.min(safePage * itemsPerPage, totalItems);
  const pages = buildPageList(safePage, totalPages);

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    onPageChange?.(page);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Menampilkan <b>{start}</b>-<b>{end}</b> dari <b>{totalItems}</b> data
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(safePage - 1)}
          disabled={safePage <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="size-3.5" /> Prev
        </button>

        {pages.map((page) =>
          typeof page === 'number' ? (
            <button
              key={page}
              type="button"
              onClick={() => goTo(page)}
              className={`grid size-8 place-items-center rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                page === safePage
                  ? 'border-[#13539D] bg-[#13539D] text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={page} className="px-1 text-xs font-bold text-slate-400">
              ...
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => goTo(safePage + 1)}
          disabled={safePage >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          Next <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
