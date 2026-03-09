import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
---------------------------- */
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_URL = "https://places.googleapis.com/v1/places:searchText";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

/* ---------------------------
   SIMPLE IN-MEMORY CACHE
   (works well on Vercel / Node)
---------------------------- */
const cache = new Map();

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  // Treat empty arrays as cache miss so we can retry (e.g. after adding fallback)
  const data = item.data;
  if (Array.isArray(data) && data.length === 0) return null;
  return data;
}

function setCache(key, data) {
  cache.set(key, {
    expires: Date.now() + CACHE_TTL,
    data,
  });
}

/* ---------------------------
   ALLOWED TYPES
---------------------------- */
const ALLOWED_TYPES = [
  "lodging",
  "restaurant",
  "tourist_attraction",
  "museum",
  "park",
  "shopping_mall",
];

/* ---------------------------
   SEED FALLBACK (when Google + legacy both fail)
---------------------------- */
// Each hotel uses a distinct image matching its location (no duplicates)
const SEED_LODGING = [
  { id: "ChIJ4zGFAZpYwokRGUGph3Mf37k", name: "The Plaza Hotel", displayName: { text: "The Plaza Hotel" }, rating: 4.6, reviews: 12500, photos: [], img: "/innerpages/newyork/n_img3.jpg" },
  { id: "ChIJN1t_tDeuEmsRUsoyG83frY4", name: "Burj Al Arab", displayName: { text: "Burj Al Arab" }, rating: 4.8, reviews: 28000, photos: [], img: "/innerpages/dubai/d_img3.webp" },
  { id: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ", name: "The Ritz Paris", displayName: { text: "The Ritz Paris" }, rating: 4.7, reviews: 8900, photos: [], img: "/iconic/iconic1.webp" },
  { id: "ChIJHQydAoFTqEcR6nV4ZCtqP30", name: "The Savoy", displayName: { text: "The Savoy" }, rating: 4.6, reviews: 15200, photos: [], img: "/travelexplore/london-bridge.webp" },
  { id: "ChIJ51cu8EcbXWARiRtXIothAS4", name: "Park Hyatt Tokyo", displayName: { text: "Park Hyatt Tokyo" }, rating: 4.5, reviews: 6200, photos: [], img: "/innerpages/tokyo/t_img4.webp" },
  { id: "ChIJj8eMjeqQZTERKnyE7zdZROU", name: "Marina Bay Sands", displayName: { text: "Marina Bay Sands" }, rating: 4.6, reviews: 95000, photos: [], img: "/innerpages/singapore/s_img4.webp" },
];

const SEED_TOURIST_ATTRACTION = [
  { id: "ChIJ60u11Ni3xYURH6SWF2zWSNo", name: "Great Pyramid of Giza", displayName: { text: "Great Pyramid of Giza" }, img: "/iconic/iconic.jpg" },
  { id: "ChIJn8o2UZ4HbUcRRwkMMFWJCo8", name: "Grand Palace Bangkok", displayName: { text: "Grand Palace Bangkok" }, img: "/iconic/iconic4.jpg" },
  { id: "ChIJgTwKgJcpM0cR4dD7O7kqDXg", name: "St. Basil's Cathedral", displayName: { text: "St. Basil's Cathedral" }, img: "/iconic/iconic6.jpg" },
  { id: "ChIJrRMgOtgBOBMRkC2EOVskefs", name: "Colosseum", displayName: { text: "Colosseum" }, img: "/iconic/iconic7.jpg" },
  { id: "ChIJizKuMTv_xkcRwwPCiy2mJwQ", name: "Eiffel Tower", displayName: { text: "Eiffel Tower" }, img: "/iconic/iconic1.webp" },
  { id: "ChIJdd4hrwug2EcRmSrV3Vo6llI", name: "London Bridge", displayName: { text: "London Bridge" }, img: "/travelexplore/london-bridge.webp" },
];

/* ---------------------------
   TOP CITIES
---------------------------- */
const TOP_CITIES = [
  { city: "Paris", lat: 48.8566, lng: 2.3522 },
  { city: "Dubai", lat: 25.2048, lng: 55.2708 },
  { city: "New York", lat: 40.7128, lng: -74.006 },
  { city: "London", lat: 51.5074, lng: -0.1278 },
  { city: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { city: "Rome", lat: 41.9028, lng: 12.4964 },
];

/* ---------------------------
   CORS
---------------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ---------------------------
   OPTIONS
---------------------------- */
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/* ---------------------------
   GET / POST
---------------------------- */
export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

/* ---------------------------
   MAIN HANDLER
---------------------------- */
async function handleRequest(req) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Missing GOOGLE_PLACES_API_KEY" },
      { status: 500, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const body =
    req.method === "POST" ? await req.json().catch(() => ({})) : {};

  const includedType =
    body.includedType || url.searchParams.get("includedType") || "lodging";

  const maxResultCount = Number(
    body.maxResultCount || url.searchParams.get("maxResultCount") || 10
  );

  if (!ALLOWED_TYPES.includes(includedType)) {
    return NextResponse.json(
      { error: "Invalid includedType", allowedTypes: ALLOWED_TYPES },
      { status: 400, headers: corsHeaders }
    );
  }

  const cacheKey = `top-${includedType}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return NextResponse.json(
      { includedType, count: cached.length, results: cached },
      { headers: { ...corsHeaders, "X-Cache": "HIT" } }
    );
  }

  const results = [];

  for (const city of TOP_CITIES) {
    const payload = {
      textQuery: `Best ${includedType}`,
      // Google Places Text Search v1 expects includedTypes: string[]
      includedTypes: [includedType],
      maxResultCount,
      languageCode: "en",
      locationBias: {
        circle: {
          center: {
            latitude: city.lat,
            longitude: city.lng,
          },
          radius: 50000,
        },
      },
    };

    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.photos",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) continue;

    const data = await response.json();
    if (!data.places) continue;

    for (const place of data.places) {
      const rating = place.rating || 0;
      const reviews = place.userRatingCount || 0;
      // Accept all places; prefer higher rating and more reviews
      const score = (rating || 3.5) * Math.log((reviews || 1) + 1);

      results.push({
        id: place.id,
        name: place.displayName?.text || "",
        displayName: place.displayName ? { text: place.displayName.text } : undefined,
        address: place.formattedAddress || "",
        rating,
        reviews,
        score: Number(score.toFixed(2)),
        city: city.city,
        location: place.location || null,
        photos: place.photos || [],
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  let topResults = results.slice(0, 10);

  // Fallback to legacy PHP when Google returns no results (server-side avoids CORS)
  if (topResults.length === 0) {
    try {
      const legacyRes = await fetch(
        `https://justbuygear.com/justbuytravel-api/top-hotels.php?includedType=${encodeURIComponent(includedType)}`
      );
      if (legacyRes.ok) {
        const raw = await legacyRes.json();
        const legacyResults = Array.isArray(raw?.results)
          ? raw.results
          : Array.isArray(raw?.places)
            ? raw.places
            : Array.isArray(raw)
              ? raw
              : [];
        if (legacyResults.length > 0) {
          topResults = legacyResults.slice(0, 10);
        }
      }
    } catch (_e) {
      // swallow
    }
  }

  // Seed fallback when both Google and legacy return empty (e.g. API key/billing issues)
  if (topResults.length === 0) {
    if (includedType === "lodging") topResults = SEED_LODGING;
    else if (includedType === "tourist_attraction") topResults = SEED_TOURIST_ATTRACTION;
  }

  // Only cache when we have results; avoids caching empty and allows retry
  if (topResults.length > 0) {
    setCache(cacheKey, topResults);
  }

  return NextResponse.json(
    {
      includedType,
      count: topResults.length,
      results: topResults,
    },
    { headers: { ...corsHeaders, "X-Cache": "MISS" } }
  );
}

