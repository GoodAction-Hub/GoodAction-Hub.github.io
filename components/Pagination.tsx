import Link from 'next/link';

interface PaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') params.set(key, value);
    }
    if (targetPage > 1) params.set('page', String(targetPage));
    const query = params.toString();
    return query ? `?${query}` : '?';
  };

  return (
    <nav className="mt-10 flex justify-center" aria-label="分页导航">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-lg border border-white/20">
        {pages.map((pageNumber) => {
          const active = pageNumber === page;
          return (
            <Link
              key={pageNumber}
              href={hrefFor(pageNumber)}
              aria-current={active ? 'page' : undefined}
              className={`min-w-10 rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors ${
                active
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
