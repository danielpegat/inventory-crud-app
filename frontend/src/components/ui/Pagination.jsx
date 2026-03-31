/**
 * Pagination Component
 * Renders page navigation matching the Stitch mockup design.
 * Shows "Showing 1-10 of 1,284 products" and page buttons.
 */
import { formatNumber } from '../../utils/helpers';

export default function Pagination({ pagination, onPageChange }) {
  const { page, limit, total, totalPages } = pagination;

  // Calculate range display
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  /**
   * Generate page button numbers.
   * Shows current page ± 1, plus first and last page.
   */
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) pages.push('...');

      // Show pages around current
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push('...');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="px-8 py-6 border-t border-surface-container flex items-center justify-between">
      {/* Item count display */}
      <p className="text-sm text-on-surface-variant">
        Showing <span className="font-bold text-on-surface">{startItem}-{endItem}</span> of{' '}
        <span className="font-bold text-on-surface">{formatNumber(total)}</span> products
      </p>

      {/* Page buttons */}
      <div className="flex gap-1">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low
            text-on-surface-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        {/* Page number buttons */}
        {getPageNumbers().map((pageNum, idx) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-on-surface-variant">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors
                ${pageNum === page
                  ? 'bg-primary text-on-primary'
                  : 'hover:bg-surface-container-low text-on-surface-variant'
                }`}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low
            text-on-surface-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
