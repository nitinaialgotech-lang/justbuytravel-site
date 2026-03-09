import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
--------------------------- */
const GOOGLE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/* ---------------------------
   CORS
--------------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
};

/* ---------------------------
   OPTIONS (Preflight)
--------------------------- */
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/* ---------------------------
   HANDLERS
--------------------------- */
export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

/* ---------------------------
   UTIL
--------------------------- */
function normalizeStringOrArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || value.trim() === "") return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }

  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/* ---------------------------
   MAIN HANDLER
--------------------------- */
async function handleRequest(req) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing Google API key. Set GOOGLE_PLACES_API_KEY." },
        { status: 500, headers: corsHeaders }
      );
    }

    const url = new URL(req.url);
    let body = {};

    if (req.method === "POST") {
      body = await req.json().catch(() => ({}));
    }

    const data = { ...Object.fromEntries(url.searchParams), ...body };

    let {
      latitude,
      longitude,
      radius = 5000,
      includedTypes = [],
      excludedTypes = [],
      maxResultCount = 20,
      languageCode = "en",
      rankPreference = "",
      pageToken = "",
    } = data;

    /* ---------------------------
       VALIDATION
    --------------------------- */
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "latitude and longitude parameters are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    latitude = Number(latitude);
    longitude = Number(longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        { error: "latitude and longitude must be numeric" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: "latitude/longitude out of range" },
        { status: 400, headers: corsHeaders }
      );
    }

    radius = Number(radius);
    if (!radius || radius <= 0) radius = 5000;

    maxResultCount = Math.min(Math.max(Number(maxResultCount) || 20, 1), 20);

    includedTypes = normalizeStringOrArray(includedTypes);
    excludedTypes = normalizeStringOrArray(excludedTypes);

    /* ---------------------------
       REQUEST BODY
    --------------------------- */
    const payload = {
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius,
        },
      },
      languageCode,
      maxResultCount,
    };

    if (includedTypes.length) payload.includedTypes = includedTypes;
    if (excludedTypes.length) payload.excludedTypes = excludedTypes;
    if (rankPreference) payload.rankPreference = rankPreference;
    if (pageToken) payload.pageToken = pageToken;

    /* ---------------------------
       GOOGLE API REQUEST
    --------------------------- */
    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.photos,places.priceLevel,places.types",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null;
      }

      return NextResponse.json(
        {
          error: parsed?.error?.message || "API request failed",
          code: response.status,
          raw: parsed || text,
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

