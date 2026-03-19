import { NextResponse } from "next/server";
import { getJson } from "serpapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERP_API_KEY = process.env.SERPAPI_API_KEY;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

function bad(msg, status = 400) {
  return NextResponse.json({ error: msg }, { status, headers: corsHeaders });
}

function isISODate(d) {
  return typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
}

function serpGetJson(params) {
  return new Promise((resolve, reject) => {
    getJson(params, (json) => resolve(json));
  });
}

export async function POST(req) {
  try {
    if (!SERP_API_KEY) return bad("Missing SERPAPI_API_KEY (set env var)", 500);

    const body = await req.json();

    /**
     * body.mode: "one_way" | "round_trip" | "multi_city"
     *
     * one_way / round_trip:
     *  - departure_id, arrival_id, outbound_date, (return_date for round_trip)
     *
     * multi_city:
     *  - legs: [{ departure_id, arrival_id, date, times? }, ...]
     */
    const mode = body?.mode;

    const common = {
      engine: "google_flights",
      api_key: SERP_API_KEY,
      hl: body?.hl ?? "en",
      gl: body?.gl, // optional
      currency: body?.currency ?? "USD",
      travel_class: body?.travel_class, // 1-4 (optional)
      adults: body?.adults,
      children: body?.children,
      infants_in_seat: body?.infants_in_seat,
      infants_on_lap: body?.infants_on_lap,
      stops: body?.stops,
      max_price: body?.max_price,
      outbound_times: body?.outbound_times,
      return_times: body?.return_times,
      deep_search: true,
      show_hidden: true
    };

    // remove undefined keys
    Object.keys(common).forEach((k) => common[k] === undefined && delete common[k]);

    let params = { ...common };

    if (mode === "one_way") {
      const { departure_id, arrival_id, outbound_date } = body || {};
      if (!departure_id || !arrival_id) return bad("departure_id and arrival_id are required");
      if (!isISODate(outbound_date)) return bad("outbound_date must be YYYY-MM-DD");

      params.type = 2; // One way :contentReference[oaicite:2]{index=2}
      params.departure_id = departure_id;
      params.arrival_id = arrival_id;
      params.outbound_date = outbound_date;
    } else if (mode === "round_trip") {
      const { departure_id, arrival_id, outbound_date, return_date } = body || {};
      if (!departure_id || !arrival_id) return bad("departure_id and arrival_id are required");
      if (!isISODate(outbound_date)) return bad("outbound_date must be YYYY-MM-DD");
      if (!isISODate(return_date)) return bad("return_date must be YYYY-MM-DD");

      params.type = 1; // Round trip :contentReference[oaicite:3]{index=3}
      params.departure_id = departure_id;
      params.arrival_id = arrival_id;
      params.outbound_date = outbound_date;
      params.return_date = return_date;
    } else if (mode === "multi_city") {
      const legs = body?.legs;
      if (!Array.isArray(legs) || legs.length < 2) return bad("legs must be an array with at least 2 items");

      for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        if (!leg?.departure_id || !leg?.arrival_id) return bad(`legs[${i}] needs departure_id + arrival_id`);
        if (!isISODate(leg?.date)) return bad(`legs[${i}].date must be YYYY-MM-DD`);
        if (leg?.times && typeof leg.times !== "string") return bad(`legs[${i}].times must be a string (optional)`);
      }

      params.type = 3; // Multi-city :contentReference[oaicite:4]{index=4}
      // SerpApi expects a JSON STRING :contentReference[oaicite:5]{index=5}
      params.multi_city_json = JSON.stringify(
        legs.map((l) => ({
          departure_id: l.departure_id,
          arrival_id: l.arrival_id,
          date: l.date,
          ...(l.times ? { times: l.times } : {}),
        }))
      );
    } else {
      return bad('mode must be "one_way" | "round_trip" | "multi_city"');
    }

    const json = await serpGetJson(params);
    return NextResponse.json(json, { status: 200, headers: corsHeaders });
  } catch (e) {
    return bad(e?.message || "Server error", 500);
  }
}
