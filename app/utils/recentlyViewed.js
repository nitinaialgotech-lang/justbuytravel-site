/**
 * Recently viewed hotels/properties - stored in localStorage
 * Used by SearchHotelDetail (save on view) and Search.jsx (show in dropdown)
 */

const RECENTLY_VIEWED_KEY = "justbuytravel_recently_viewed";
const MAX_RECENTLY_VIEWED = 5;

export function getRecentlyViewedProperties() {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveRecentlyViewedProperty(item) {
    if (!item?.id || !item?.name) return;
    const recent = getRecentlyViewedProperties();
    const filtered = recent.filter((r) => r.id !== item.id);
    const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
}
