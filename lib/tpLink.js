/**
 * Add Travelpayouts SubID parameters to affiliate links for page/placement tracking.
 * @param {string} baseUrl - Base affiliate URL (e.g. tp.media/r?...)
 * @param {{ page?: string; placement?: string }} options - page slug, placement/button name
 * @returns {string} Full URL with sub_id and sub_id_1 params
 */
export function tpWithSubId(baseUrl, { page, placement } = {}) {
  const u = new URL(baseUrl);

  // Travelpayouts SubID fields commonly supported:
  // sub_id, sub_id_1, sub_id_2, sub_id_3, sub_id_4
  // We use:
  // sub_id   = page slug
  // sub_id_1 = placement/button name (optional)

  const subId = (page || "unknown")
    .replaceAll("/", "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);

  u.searchParams.set("sub_id", subId);

  if (placement) {
    u.searchParams.set(
      "sub_id_1",
      String(placement).replaceAll(" ", "_").slice(0, 64)
    );
  }

  return u.toString();
}

/**
 * Build affiliate link with hotel URL (u param) and SubID tracking.
 * Use when the destination is a dynamic hotel/search URL.
 */
export function buildAffiliateLinkWithSubId(affiliateBase, hotelUrl, { page, placement } = {}) {
  if (!hotelUrl) return null;
  if (!affiliateBase) return hotelUrl;
  const baseWithSubId = tpWithSubId(affiliateBase, { page, placement });
  return `${baseWithSubId}&u=${encodeURIComponent(hotelUrl)}`;
}
