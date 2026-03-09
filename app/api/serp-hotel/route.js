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
      q = "",
      check_in_date = "",
      check_out_date = "",
      adults = 2,
      // children = 0,
      // children_ages = "",
      currency = "USD",
      country = "us",
      language = "en",
    } = data;

    if (!q) {
      return NextResponse.json(
        { error: "Parameter q (hotel name / query) is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Step 1: find the property token for this hotel.
    // Use the main `google_hotels` engine – SerpAPI no longer supports
    // the older `google_hotels_properties` alias (see error:
    // "Unsupported `google_hotels_properties` search engine.").
    const properties = await getJson({
      engine: "google_hotels",
      q,
      check_in_date: check_in_date || undefined,
      check_out_date: check_out_date || undefined,
      adults: adults ? Number(adults) : undefined,
      // children: children ? Number(children) : undefined,
      // children_ages: children_ages || undefined,
      currency,
      hl: language,
      gl: country,
      api_key: SERP_API_KEY,
    });

    const propsList = properties?.properties && properties.properties.length
      ? properties.properties
      : properties?.ads && properties.ads.length
        ? properties.ads
        : [];
    const firstProperty = propsList.length ? propsList[0] : null;

    if (!firstProperty?.property_token) {
      // Return 200 so clients don't confuse "no hotel found" with "route not found"
      return NextResponse.json(
        {
          found: false,
          error: "No matching hotel property found from SerpAPI",
          query: q,
          raw: properties || null,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // Step 2: fetch full property details (amenities, description, etc.)
    const details = await getJson({
      engine: "google_hotels",
      q,
      property_token: firstProperty.property_token,
      check_in_date: check_in_date || undefined,
      check_out_date: check_out_date || undefined,
      adults: adults ? Number(adults) : undefined,
      // children: children ? Number(children) : undefined,
      // children_ages: children_ages || undefined,
      currency,
      hl: language,
      gl: country,
      api_key: SERP_API_KEY,
    });

    return NextResponse.json(
      {
        found: true,
        query: q,
        check_in_date: check_in_date || null,
        check_out_date: check_out_date || null,
        currency,
        property: firstProperty,
        details,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    // Log full error on the server for easier debugging in the dev console.
    // This will appear where `npm run dev` is running.
    // eslint-disable-next-line no-console
    console.error("SerpAPI /api/serp-hotel error:", err);

    // Surface SerpAPI error details to help debugging (but keep this reasonably small).
    // The serpapi client usually throws a plain Error; sometimes it may include a response object.
    const status = err?.response?.status || 500;
    const respData =
      // axios-style: err.response.data
      err?.response?.data ??
      // fetch-style: err.responseBody (string or object)
      err?.responseBody ??
      null;

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

