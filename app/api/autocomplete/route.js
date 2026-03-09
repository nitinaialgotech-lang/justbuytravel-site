import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
--------------------------- */
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_URL = "https://places.googleapis.com/v1/places:autocomplete";

/* ---------------------------
   CORS
--------------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

/* ---------------------------
   OPTIONS (Preflight)
--------------------------- */
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/* ---------------------------
   GET / POST
--------------------------- */
export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

/* ---------------------------
   MAIN HANDLER
--------------------------- */
async function handleRequest(req) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing GOOGLE_PLACES_API_KEY" },
        { status: 500, headers: corsHeaders }
      );
    }

    const url = new URL(req.url);
    let body = {};

    if (req.method === "POST") {
      body = await req.json().catch(() => ({}));
    }

    const input =
      body.input || body.text || url.searchParams.get("input") || "";

    const maxResultCount =
      Number(body.maxResultCount || url.searchParams.get("maxResultCount")) ||
      10;

    const languageCode =
      body.languageCode || url.searchParams.get("languageCode") || "en";

    if (!input || input.trim().length < 2) {
      return NextResponse.json(
        { error: "input is required and should be at least 2 characters" },
        { status: 400, headers: corsHeaders }
      );
    }

    const payload = {
      input: input.trim(),
      maxResultCount,
      languageCode,
      // Restrict to only city, country, hotel, restaurant
      includedPrimaryTypes: [
        "country",    // countries
        "lodging",    // hotels
        "restaurant", // restaurants
      ],
    };

    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.place,suggestions.placePrediction.place.primaryType,suggestions.placePrediction.distanceMeters",
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
          error:
            parsed?.error?.message ||
            parsed?.error?.status ||
            "Autocomplete API request failed",
          code: response.status,
          raw: parsed || text,
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    // Filter suggestions so frontend only ever sees city / country / hotel / restaurant
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return new NextResponse(text, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const allowedPrimary = new Set(["country", "lodging", "restaurant"]);
    const allowedTypes = new Set(["country", "lodging", "restaurant"]);

    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter((sug) => {
        const place = sug?.placePrediction?.place;
        if (!place) return false;

        const primaryType = place.primaryType || "";
        if (allowedPrimary.has(primaryType)) return true;

        const types = Array.isArray(place.types) ? place.types : [];
        return types.some((t) => allowedTypes.has(t));
      })
      : [];

    return NextResponse.json(
      { ...parsed, suggestions },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

