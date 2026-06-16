export const pickFirstSearchParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export function parsePage(rawPage?: string | string[]): number {
  const parsed = Number.parseInt(pickFirstSearchParam(rawPage) ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
