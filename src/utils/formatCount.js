/**
 * Format large stage counts into human-friendly strings.
 *
 * Rules (assumptions clarified):
 * - < 1,000: show the raw number (no suffix)
 * - 1,000–9,999: show thousands with 1 decimal, rounded up (e.g., 1,001 -> 1.1k)
 * - 10,000–999,999: show thousands with no decimals, rounded up (e.g., 12,001 -> 13k)
 * - 1,000,000–9,999,999: show millions with 1 decimal, rounded up (e.g., 1,100,000 -> 1.1m)
 * - ≥ 10,000,000: show millions with no decimals, rounded up (e.g., 12,300,001 -> 13m)
 *
 * @param {number} count
 * @returns {string}
 */
export function formatCount(count) {
  if (count == null || Number.isNaN(count)) {
    return "0";
  }

  const absoluteCount = Math.abs(count);
  const sign = count < 0 ? "-" : "";

  // Less than 1,000
  if (absoluteCount < 1000) {
    return sign + String(Math.floor(absoluteCount));
  }

  // 1,000 to 9,999 -> 1 decimal k (rounded up)
  if (absoluteCount < 10000) {
    const value = Math.ceil((absoluteCount / 1000) * 10) / 10;
    return sign + value.toFixed(1) + "k";
  }

  // 10,000 to 999,999 -> integer k (rounded up)
  if (absoluteCount < 1000000) {
    const value = Math.ceil(absoluteCount / 1000);
    return sign + value + "k";
  }

  // 1,000,000 to 9,999,999 -> 1 decimal m (rounded up)
  if (absoluteCount < 10000000) {
    const value = Math.ceil((absoluteCount / 1000000) * 10) / 10;
    return sign + value.toFixed(1) + "m";
  }

  // >= 10,000,000 -> integer m (rounded up)
  const value = Math.ceil(absoluteCount / 1000000);
  return sign + value + "m";
}

