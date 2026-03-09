/**
 * Utility function to get the correct path for static assets
 * This ensures basePath is included when needed for static exports
 */
export const getAssetPath = (path) => {
  // Handle null/undefined paths
  if (!path) return '';

  // If path is already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Get basePath from environment variable - must match next.config.mjs basePath
  // Set NEXT_PUBLIC_BASE_PATH when deploying to a subpath (e.g. /justbuytravel_next/demo); leave unset for root
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // If basePath is just '/', return the path as is
  if (basePath === '/' || !basePath) {
    return cleanPath;
  }

  // Combine basePath with the asset path
  return `${basePath}${cleanPath}`;
};

const PLACEHOLDER_HOTEL_IMAGE = "/blog/blog_img.webp";

/**
 * Get a valid image URL for a place/hotel item from the API.
 * Handles array/undefined from photos, item.img fallback (for seed data), and placeholder when no photo.
 */
export const getPlacePhotoUrl = (item) => {
  if (!item) return getAssetPath(PLACEHOLDER_HOTEL_IMAGE);
  const raw = item?.photos?.[0]?.name ?? item?.photos?.slice(0, 1)?.[0]?.name;
  const name = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  if (name && name !== "undefined") {
    // Use internal Next.js proxy for Google Place photos (faster, cached, no API key on client)
    return `/api/get-photo?name=${encodeURIComponent(name)}&maxWidthPx=300`;
  }
  // Fallback: static img path (for seed/fallback data)
  if (item?.img) return getAssetPath(item.img);
  return getAssetPath(PLACEHOLDER_HOTEL_IMAGE);
};

