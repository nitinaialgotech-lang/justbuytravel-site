import { NextResponse } from "next/server";
import { getJson } from "serpapi";

// Use Node.js runtime (serpapi uses Node APIs); ensures route is registered
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERP_API_KEY = process.env.SERPAPI_API_KEY;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
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
    if (!SERP_API_KEY) {
      return NextResponse.json(
        { error: "Missing SERPAPI_API_KEY" },
        { status: 500, headers: corsHeaders }
      );
    }

    const url = new URL(req.url);
    let body = {};

    if (req.method === "POST") {
      body = await req.json().catch(() => ({}));
    }

    const data = { ...Object.fromEntries(url.searchParams), ...body };

    const {
      departure_id = "",
      arrival_id = "",
      outbound_date = "",
      return_date = "",
      type = "1",
      // Passenger and class controls
      travel_class = 1,
      adults = 1,
      children = 0,
      infants_on_lap = 0,
      currency = "USD",
      country = "us",
      language = "en",
    } = data;

    const isRoundTrip = String(type) === "1";
    const isMultiCity = String(type) === "3";

    if (isMultiCity) {
      // Multi-city: require at least one leg; we build multi_city_json from current from/to/dates
      if (!departure_id || !arrival_id || !outbound_date) {
        return NextResponse.json(
          {
            error:
              "Parameters departure_id, arrival_id and outbound_date are required",
          },
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      if (!departure_id || !arrival_id || !outbound_date) {
        return NextResponse.json(
          {
            error:
              "Parameters departure_id, arrival_id and outbound_date are required",
          },
          { status: 400, headers: corsHeaders }
        );
      }
      if (isRoundTrip && !return_date) {
        return NextResponse.json(
          { error: "return_date is required for Round trip (type=1)" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Build SerpAPI params: for type=3 use multi_city_json only; for type=1/2 use main params
    const baseParams = {
      engine: "google_flights",
      type,
      currency,
      hl: language,
      gl: country,
      travel_class,
      adults,
      api_key: SERP_API_KEY,
    };
    if (Number(children) > 0) baseParams.children = Number(children);
    if (Number(infants_on_lap) > 0) baseParams.infants_on_lap = Number(infants_on_lap);

    let serpParams;

    if (isMultiCity) {
      // Multi-city: put legs in multi_city_json; do NOT send top-level departure_id/arrival_id/outbound_date/return_date
      const legs = [
        { departure_id, arrival_id, date: outbound_date },
      ];
      if (return_date) {
        legs.push({
          departure_id: arrival_id,
          arrival_id: departure_id,
          date: return_date,
        });
      }
      serpParams = {
        ...baseParams,
        multi_city_json: JSON.stringify(legs),
      };
    } else {
      // One-way or round trip: use main parameters
      serpParams = {
        ...baseParams,
        departure_id,
        arrival_id,
        outbound_date,
      };
      // Only send return_date for round trip (type=1)
      if (isRoundTrip && return_date) {
        serpParams.return_date = return_date;
      }
    }

    const flights = await getJson(serpParams);

    return NextResponse.json(
      {
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        type,
        currency,
        travel_class,
        adults,
        flights,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("SerpAPI /api/flights/search error:", err);

    const status = err?.response?.status || 500;

    // Try to capture any SerpAPI error payload or JSON embedded in the message
    let respData =
      err?.response?.data ??
      err?.responseBody ??
      null;
    if (!respData && typeof err?.message === "string") {
      try {
        respData = JSON.parse(err.message);
      } catch {
        // leave as null
      }
    }

    const debug =
      status === 500 && !respData
        ? {
            name: err?.name || null,
            message: err?.message || null,
            stack: err?.stack || null,
            toString: err ? String(err) : null,
          }
        : null;

    return NextResponse.json(
      {
        error: err?.message || "Unexpected error from SerpAPI",
        status,
        serpapi_error: respData,
        debug,
      },
      { status, headers: corsHeaders }
    );
  }
}
