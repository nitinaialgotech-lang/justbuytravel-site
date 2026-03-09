import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
--------------------------- */
const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

/* ---------------------------
   CORS (Origin allowlist support)
--------------------------- */
function corsHeaders(req) {
  const origin = req.headers.get("origin") || "";
  const allowList = (process.env.CORS_ALLOW_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  let allowOrigin = "*";

  if (allowList.length > 0) {
    allowOrigin = allowList.includes(origin) ? origin : "";
  } else if (origin) {
    // dev-friendly: reflect origin
    allowOrigin = origin;
  }

  return {
    ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
  };
}

/* ---------------------------
   OPTIONS
--------------------------- */
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  });
}

/* ---------------------------
   HELPERS
--------------------------- */
async function fetchJson(url, options = {}) {
  const res = await fetch(url, { redirect: "follow", ...options });
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return {
      ok: false,
      status: res.status,
      error: "Non-JSON response",
      raw: text,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: json?.error || "Request failed",
      raw: json,
    };
  }

  return { ok: true, status: res.status, data: json };
}

function extractFirstHotelKey(data) {
  const buckets =
    data?.results ||
    data?.data ||
    data?.result?.list ||
    (Array.isArray(data) ? data : []);

  for (const item of buckets) {
    if (!item || typeof item !== "object") continue;
    for (const key of [
      "hotel_key",
      "key",
      "id",
      "hotelId",
      "accommodation_key",
    ]) {
      if (item[key]) return item[key];
    }
  }
  return null;
}

/* ---------------------------
   GET
--------------------------- */
export async function GET(req) {
  const headers = corsHeaders(req);
  const { searchParams } = new URL(req.url);

  const hotel = (searchParams.get("hotel") || "").trim();
  const city = (searchParams.get("city") || "").trim();
  const includeXotelo = searchParams.get("include_xotelo") !== "0";

  if (!hotel) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing required query param: hotel",
        example:
          "/api/testing?hotel=Hilton&city=London&include_xotelo=1",
      },
      { status: 400, headers }
    );
  }

  if (!GOOGLE_PLACES_KEY) {
    return NextResponse.json(
      { ok: false, error: "Missing env var GOOGLE_PLACES_KEY" },
      { status: 500, headers }
    );
  }

  /* ---------------------------
     GOOGLE PLACES (Text Search – Lodging)
  --------------------------- */
  const googleQuery = hotel + (city ? `, ${city}` : "");
  const googleUrl =
    "https://maps.googleapis.com/maps/api/place/textsearch/json" +
    `?query=${encodeURIComponent(googleQuery)}` +
    "&type=lodging" +
    `&key=${encodeURIComponent(GOOGLE_PLACES_KEY)}`;

  const googleRes = await fetchJson(googleUrl);

  if (!googleRes.ok || googleRes.data?.status !== "OK") {
    return NextResponse.json(
      {
        ok: false,
        error: "Google Places error",
        debug: googleRes.data,
      },
      { status: 502, headers }
    );
  }

  const first = googleRes.data.results?.[0];
  if (!first?.place_id) {
    return NextResponse.json(
      {
        ok: false,
        error: "No hotels found for query",
        query: googleQuery,
      },
      { status: 404, headers }
    );
  }

  const payload = {
    ok: true,
    google: {
      query: googleQuery,
      place_id: first.place_id,
      name: first.name ?? null,
      formatted_address: first.formatted_address ?? null,
    },
  };

  /* ---------------------------
     XOTELO (Optional)
  --------------------------- */
  if (includeXotelo) {
    if (!RAPIDAPI_KEY) {
      return NextResponse.json(
        { ok: false, error: "include_xotelo=1 requires RAPIDAPI_KEY" },
        { status: 500, headers }
      );
    }

    let xoteloQuery = (searchParams.get("xotelo_query") || "").trim();
    if (!xoteloQuery) {
      xoteloQuery = payload.google.name || hotel;
      if (city) xoteloQuery += ` ${city}`;
    }

    const xoteloUrl =
      "https://xotelo-hotel-prices.p.rapidapi.com/api/search" +
      `?location_type=accommodation&query=${encodeURIComponent(
        xoteloQuery
      )}`;

    const xoteloRes = await fetchJson(xoteloUrl, {
      headers: {
        "x-rapidapi-host": "xotelo-hotel-prices.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });

    payload.xotelo = xoteloRes.ok
      ? {
          query: xoteloQuery,
          hotel_key: extractFirstHotelKey(xoteloRes.data),
          raw: xoteloRes.data,
        }
      : {
          query: xoteloQuery,
          error: xoteloRes.error,
          raw: xoteloRes.raw,
        };
  }

  return NextResponse.json(payload, { status: 200, headers });
}

