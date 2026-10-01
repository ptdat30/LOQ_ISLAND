/**
 * Removes Vietnamese diacritical marks and converts string to lowercase trimmed string
 * for quick and accent-insensitive search queries.
 * Example: "Cá Chép Vàng" -> "ca chep vang"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}
