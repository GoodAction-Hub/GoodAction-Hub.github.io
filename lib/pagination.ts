export function parsePage(rawPage?: string): number {
  const parsed = Number.parseInt(rawPage ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getVisiblePages(
  totalPages: number,
  currentPage: number,
): number[] {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}
