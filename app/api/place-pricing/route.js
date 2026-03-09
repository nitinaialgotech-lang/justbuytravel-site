import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
--------------------------- */
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places/";
const XOTELO_SEARCH_URL = "https://data.xotelo.com/api/search";
const XOTELO_RATES_URL = "https://data.xotelo.com/api/rates";

/* ---------------------------
   HELPERS
--------------------------- */
function json(status, data, headers = {}) {
  return NextResponse.json(data, { status, headers });
}

function isYYYYMMDD(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();

  let jsonData;
  try {
    jsonData = JSON.parse(text);
  } catch {
    throw new Error("Non-JSON response");
  }

  if (!res.ok) {
    throw new Error(jsonData?.error?.message || "Upstream error");
  }

  return jsonData;
}

function extractLowestPrice(data) {
  let min = null;
  const stack = [data];

  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;

    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "object") stack.push(v);
      if (typeof v === "number" && v > 0) {
        if (
          ["price", "rate", "total", "amount", "value"].includes(
            k.toLowerCase()
          )
        ) {
          min = min === null ? v : Math.min(min, v);
        }
      }
    }
  }

  return min;
}

/* ---------------------------
   GET
--------------------------- */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const placeId = searchParams.get("placeId");
    const chkIn = searchParams.get("chk_in");
    const chkOut = searchParams.get("chk_out");
    const currency = (searchParams.get("currency") || "USD").toUpperCase();

    /* ---------------------------
       VALIDATION
    --------------------------- */
    if (!placeId) {
      return json(400, { error: "placeId is required" });
    }
    if (!isYYYYMMDD(chkIn) || !isYYYYMMDD(chkOut) || chkOut <= chkIn) {
      return json(400, { error: "Invalid check-in / check-out dates" });
    }

    if (!GOOGLE_API_KEY) {
      return json(500, { error: "Missing GOOGLE_API_KEY env var" });
    }

    /* ---------------------------
       1️⃣ GOOGLE PLACE DETAILS
    --------------------------- */
    const place = await fetchJson(
      `${GOOGLE_PLACES_URL}${encodeURIComponent(
        placeId
      )}?fields=displayName,formattedAddress,location,types&key=${GOOGLE_API_KEY}`
    );

    const hotelName = place.displayName?.text;
    const city =
      place.formattedAddress?.split(",").slice(-3)[0]?.trim() || "";

    if (!hotelName) {
      return json(404, { error: "Hotel name not found in place data" });
    }

    /* ---------------------------
       2️⃣ RESOLVE → XOTELO HOTEL KEY
    --------------------------- */
    const search = await fetchJson(
      `${XOTELO_SEARCH_URL}?hotel=${encodeURIComponent(
        hotelName
      )}&city=${encodeURIComponent(city)}`
    );

    const resolvedHotel = search?.hotels?.[0];
    if (!resolvedHotel?.hotel_key) {
      return json(404, {
        error: "Unable to resolve hotel in Xotelo",
        hint: "Try manual mapping fallback",
      });
    }

    /* ---------------------------
       3️⃣ PRICING
    --------------------------- */
    const rates = await fetchJson(
      `${XOTELO_RATES_URL}?hotel_key=${resolvedHotel.hotel_key}&chk_in=${chkIn}&chk_out=${chkOut}&currency=${currency}`
    );

    const lowestPrice = extractLowestPrice(rates);

    /* ---------------------------
       RESPONSE
    --------------------------- */
    return json(200, {
      ok: true,
      place: {
        placeId,
        name: hotelName,
        address: place.formattedAddress,
        location: place.location,
        types: place.types,
      },
      xotelo: {
        hotel_key: resolvedHotel.hotel_key,
        name: resolvedHotel.name,
        provider_count: resolvedHotel.providers?.length || 0,
      },
      pricing: {
        currency,
        lowest_price_guess: lowestPrice,
      },
      _meta: {
        pricing_note:
          "Prices are indicative. Final prices depend on OTA availability.",
      },
    });
  } catch (err) {
    return json(500, { error: err.message || "Internal server error" });
  }
}

