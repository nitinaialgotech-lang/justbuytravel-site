import { NextResponse } from "next/server";
import { getJson } from "serpapi";

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
      engine = "google_flights",
      departure_id = "",
      arrival_id = "",
      outbound_date = "",
      return_date = "",
      type = "1",
      booking_token: rawBookingToken = "",
      departure_token = "",
      adults = 1,
      children = 0,
      infants_on_lap = 0,
      travel_class,
      currency = "USD",
      hl = "en",
    } = data;
    let multi_city_json = data.multi_city_json ?? "";

    // SerpAPI: type 1 = Round trip (requires return_date), type 2 = One way, type 3 = Multi-city
    const isOneWay = String(type) === "2";
    const isMultiCity = String(type) === "3";

    if (isMultiCity) {
      // Multi-city requires multi_city_json as JSON array of {departure_id, arrival_id, date}
      let legs = Array.isArray(multi_city_json)
        ? multi_city_json
        : typeof multi_city_json === "string"
          ? (() => {
              try {
                return JSON.parse(multi_city_json);
              } catch {
                return [];
              }
            })()
          : [];
      if (!Array.isArray(legs) || legs.length < 2) {
        return NextResponse.json(
          {
            error:
              "Missing `multi_city_json` parameter for type = 3 (Multi-city). Provide an array of at least 2 legs: [{departure_id, arrival_id, date}, ...]",
          },
          { status: 400, headers: corsHeaders }
        );
      }
      // Normalize: {departure_id, arrival_id|arrive_id, date|dateTime}
      const normalized = legs.map((leg) => {
        const dep = leg?.departure_id || "";
        const arr = leg?.arrival_id ?? leg?.arrive_id ?? "";
        let d = leg?.date;
        if (!d && leg?.dateTime) {
          const dt = new Date(leg.dateTime);
          d = dt.toISOString ? dt.toISOString().slice(0, 10) : String(leg.dateTime).slice(0, 10);
        }
        return { departure_id: dep, arrival_id: arr, date: d || "" };
      });
      const valid = normalized.every(
        (l) => l.departure_id && l.arrival_id && /^\d{4}-\d{2}-\d{2}$/.test(l.date)
      );
      if (!valid) {
        return NextResponse.json(
          {
            error:
              "Each leg in multi_city_json must have departure_id, arrival_id, and date (YYYY-MM-DD)",
          },
          { status: 400, headers: corsHeaders }
        );
      }
      // SerpAPI expects multi_city_json as a JSON string
      multi_city_json = JSON.stringify(normalized);
    } else if (!multi_city_json && (!departure_id || !arrival_id || !outbound_date)) {
      return NextResponse.json(
        {
          error:
            "Parameters departure_id, arrival_id and outbound_date are required",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Normalize booking token: may come directly, or we may need to
    // derive it from a departure_token via an extra SerpAPI call.
    // Base64 tokens can have + which URL query params decode as space; restore for SerpAPI
    let booking_token = (rawBookingToken || "").replace(/ /g, "+").trim();

    // If no booking_token but we have a departure_token, do a flights
    // search with departure_token to obtain a booking_token.
    let intermediateResults = null;
    if (!booking_token && departure_token) {
      // const flightsParams = {
      //   engine,
      //   departure_id,
      //   arrival_id,
      //   outbound_date,
      //   currency,
      //   hl,
      //   api_key: SERP_API_KEY,
      //   departure_token,
      // };
      // if (return_date) {
      //   flightsParams.return_date = return_date;
      // }



      const flightsParams = {
        engine,
        type,
        currency,
        hl,
        api_key: SERP_API_KEY,
        departure_token,
        adults: adults ? Number(adults) : 1,
      };
      if (Number(children) > 0) flightsParams.children = Number(children);
      if (Number(infants_on_lap) > 0) flightsParams.infants_on_lap = Number(infants_on_lap);
      if (travel_class != null && travel_class !== "") flightsParams.travel_class = Number(travel_class);

      if (multi_city_json) {
        flightsParams.multi_city_json = multi_city_json; // send all legs
      } else {
        flightsParams.departure_id = departure_id;
        flightsParams.arrival_id = arrival_id;
        flightsParams.outbound_date = outbound_date;
        if (!isOneWay && return_date) flightsParams.return_date = return_date;
      }
      // ***************************

      intermediateResults = await getJson(flightsParams);

      const bestFlights =
        intermediateResults?.best_flights ||
        intermediateResults?.flights?.best_flights ||
        intermediateResults?.return_flights?.best_flights ||
        [];
      const otherFlights =
        intermediateResults?.other_flights ||
        intermediateResults?.flights?.other_flights ||
        intermediateResults?.return_flights?.other_flights ||
        [];

      // Try best_flights first, then other_flights; return flights have booking_token
      booking_token =
        bestFlights[0]?.booking_token ||
        otherFlights[0]?.booking_token ||
        "";

      if (!booking_token) {
        // We have return flight list but no token - return intermediate results
        // so the return-flight page can display the list. User will select a flight
        // and navigate to booking-options with that flight's booking_token.
        const hasReturnFlights = bestFlights.length > 0 || otherFlights.length > 0;
        if (hasReturnFlights) {
          return NextResponse.json(
            {
              departure_id,
              arrival_id,
              outbound_date,
              return_date: return_date || null,
              booking_token: null,
              departure_token: departure_token || null,
              currency,
              hl,
              intermediate_results: intermediateResults,
              results: { selected_flights: [], booking_options: [] },
            },
            { status: 200, headers: corsHeaders }
          );
        }
        return NextResponse.json(
          {
            error:
              "Unable to derive booking_token from departure_token; Google Flights returned no suitable flights.",
            departure_id,
            arrival_id,
            outbound_date,
            return_date: return_date || null,
          },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // const serpParams = {
    //   engine,
    //   departure_id,
    //   arrival_id,
    //   outbound_date,
    //   currency,
    //   hl,
    //   api_key: SERP_API_KEY,
    //   booking_token,
    // };

    // if (return_date) {
    //   serpParams.return_date = return_date;
    // }

    const serpParams = {
      engine,
      type,
      currency,
      hl,
      api_key: SERP_API_KEY,
      booking_token,
      adults: adults ? Number(adults) : 1,
    };
    if (Number(children) > 0) serpParams.children = Number(children);
    if (Number(infants_on_lap) > 0) serpParams.infants_on_lap = Number(infants_on_lap);
    if (travel_class != null && travel_class !== "") serpParams.travel_class = Number(travel_class);

    if (multi_city_json) {
      serpParams.multi_city_json = multi_city_json;
    } else {
      serpParams.departure_id = departure_id;
      serpParams.arrival_id = arrival_id;
      serpParams.outbound_date = outbound_date;
      if (!isOneWay && return_date) serpParams.return_date = return_date;
    }

    const results = await getJson(serpParams);

    return NextResponse.json(
      {
        departure_id,
        arrival_id,
        outbound_date,
        return_date: return_date || null,
        booking_token: booking_token || null,
        departure_token: departure_token || null,
        currency,
        hl,
        intermediate_results: intermediateResults,
        results,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("SerpAPI /api/flights/booking error:", err);

    const status = err?.response?.status || 500;
    let respData =
      err?.response?.data ??
      err?.responseBody ??
      null;

    if (!respData && err?.message) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error) respData = parsed;
      } catch (_) {}
    }
    if (!respData && err?.toString) {
      const str = String(err);
      const jsonMatch = str.match(/\{[\s\S]*"error"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          respData = JSON.parse(jsonMatch[0]);
        } catch (_) {}
      }
    }

    const serpapiMessage = respData?.error || err?.message || "Unexpected error from SerpAPI";

    return NextResponse.json(
      {
        error: serpapiMessage,
        status,
        serpapi_error: respData,
      },
      { status, headers: corsHeaders }
    );
  }
}
