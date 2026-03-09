import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
--------------------------- */
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Places API (New) v1 requires X-Goog-Api-Key and X-Goog-FieldMask headers (not query params)
const MINIMAL_FIELD_MASK =
  "id,displayName,formattedAddress,rating,userRatingCount,location,photos,reviews,types";
const DEFAULT_FIELD_MASK =
  "id,displayName,formattedAddress,shortFormattedAddress,adrFormatAddress," +
  "rating,userRatingCount,location,photos,priceLevel,websiteUri," +
  "nationalPhoneNumber,internationalPhoneNumber,editorialSummary,reviews," +
  "types,addressComponents,currentOpeningHours,regularOpeningHours," +
  "utcOffsetMinutes,businessStatus,iconBackgroundColor,iconMaskBaseUri," +
  "primaryType,plusCode,viewport,lodgingMetadata,amenityOptions";

/* ---------------------------
   CORS
--------------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Content-Type": "application/json",
};

/* ---------------------------
   OPTIONS
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
   MAIN HANDLER
--------------------------- */
async function handleRequest(req) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing Google API key" },
        { status: 500, headers: corsHeaders }
      );
    }

    const url = new URL(req.url);
    let body = {};

    if (req.method === "POST") {
      body = await req.json().catch(() => ({}));
    }

    const data = {
      ...Object.fromEntries(url.searchParams),
      ...body,
    };

    const {
      placeId = "",
      languageCode = "",
      regionCode = "",
      sessionToken = "",
      // Use the richer default so hotel amenities (amenityOptions, lodgingMetadata, etc.)
      // are returned without callers having to pass a custom mask.
      fieldMask = DEFAULT_FIELD_MASK,
    } = data;

    if (!placeId) {
      return NextResponse.json(
        { error: "placeId parameter is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Normalize: API expects path "places/PLACE_ID"; strip "places/" if caller sent full resource name
    const rawId = String(placeId).trim();
    const pathSegment = rawId.startsWith("places/")
      ? rawId
      : "places/" + rawId;

    /* ---------------------------
       BUILD GOOGLE URL (Places API New v1: GET /v1/{name=places/PLACE_ID})
    --------------------------- */
    const queryParams = new URLSearchParams();
    if (languageCode) queryParams.set("languageCode", languageCode);
    if (regionCode) queryParams.set("regionCode", regionCode);
    if (sessionToken) queryParams.set("sessionToken", sessionToken);
    const queryString = queryParams.toString();
    const googleUrl =
      "https://places.googleapis.com/v1/" +
      encodeURIComponent(pathSegment).replace(/%2F/g, "/") +
      (queryString ? "?" + queryString : "");

    async function doFetch(useFieldMask) {
      const res = await fetch(googleUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": useFieldMask,
        },
      });
      return { res, text: await res.text() };
    }

    let response;
    let text;
    ({ res: response, text } = await doFetch(fieldMask));

    // On 400, retry with minimal field mask (invalid fields in mask can cause 400)
    if (response.status === 400 && fieldMask !== MINIMAL_FIELD_MASK) {
      const retry = await doFetch(MINIMAL_FIELD_MASK);
      if (retry.res.ok) {
        response = retry.res;
        text = retry.text;
      }
    }

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
            "API request failed",
          code: response.status,
          details: parsed?.error ?? parsed ?? null,
          raw_response: text,
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    /* ---------------------------
       ADD METADATA
    --------------------------- */
    let responseData;
    try {
      responseData = JSON.parse(text);
    } catch {
      return new NextResponse(text, {
        status: 200,
        headers: corsHeaders,
      });
    }

    responseData._metadata = {
      photos_note:
        "Photo references in the photos array can be used with the place photo API to fetch actual images.",
      ota_pricing_note:
        "OTA (Online Travel Agency) pricing is not available via Google Places API. Use Booking.com, Expedia, etc. APIs for pricing.",
    };

    return new NextResponse(JSON.stringify(responseData, null, 2), {
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

