import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_URL = "https://places.googleapis.com/v1/places:searchText";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

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
    const mode = body.mode || url.searchParams.get("mode") || "all";

    if (!input || input.trim().length < 2) {
      return NextResponse.json(
        { error: "input is required and should be at least 2 characters" },
        { status: 400, headers: corsHeaders }
      );
    }

    const payload = {
      textQuery: input.trim(),
      maxResultCount,
      languageCode,
      // Do not restrict on the request side (to avoid INVALID_ARGUMENT errors);
      // we'll filter strictly by allowed types in the response instead.
    };

    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        // Also request photos so each suggestion can have its own image
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.photos",
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
            "Search-suggest API request failed",
          code: response.status,
          raw: parsed || text,
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return new NextResponse(text, {
        status: 200,
        headers: corsHeaders,
      });
    }

    let allowedTypes;
    switch (mode) {
      case "restaurant":
        allowedTypes = new Set(["restaurant"]);
        break;
      case "hotel":
        allowedTypes = new Set(["lodging"]);
        break;
      case "location":
        allowedTypes = new Set(["locality", "country"]);
        break;
      default:
        allowedTypes = new Set(["locality", "country", "lodging", "restaurant", "tourist_attraction"]);
        break;
    }

    const places = Array.isArray(parsed.places)
      ? parsed.places.filter((place) => {
        const types = Array.isArray(place.types) ? place.types : [];
        return types.some((t) => allowedTypes.has(t));
      })
      : [];

    // Return filtered places in the same shape as /api/text-search
    return NextResponse.json(
      { places },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

