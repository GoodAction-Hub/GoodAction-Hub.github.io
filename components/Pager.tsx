import Link from 'next/link';

interface PagerProps {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  getPageHref: (page: number) => string;
  previousLabel?: string;
  nextLabel?: string;
}

export function Pager({
  currentPage,
  totalPages,
  visiblePages,
  getPageHref,
  previousLabel = '上一页',
  nextLabel = '下一页',
}: PagerProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={getPageHref(currentPage - 1)}
          className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
        >
          {previousLabel}
        </Link>
      )}
      {visiblePages.map((page) => (
        <Link
          key={page}
          href={getPageHref(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`px-3 py-1.5 rounded-md border text-sm ${
            page === currentPage
              ? 'bg-purple-600 border-purple-600 text-white'
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={getPageHref(currentPage + 1)}
          className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
        >
          {nextLabel}
        </Link>
      )}
    </nav>
  );
}
