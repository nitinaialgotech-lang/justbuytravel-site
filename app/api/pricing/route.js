import { NextResponse } from "next/server";

/* ---------------------------
   CORS (browser-friendly)
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
   UTILITIES
--------------------------- */
function isYYYYMMDD(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}

async function fetchJson(url) {
  const res = await fetch(url, { redirect: "follow" });
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
      error: "Upstream request failed",
      raw: json,
    };
  }

  return { ok: true, status: res.status, data: json };
}

function extractLowestPrice(data) {
  const stack = [data];
  let min = null;

  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;

    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value) || typeof value === "object") {
        stack.push(value);
        continue;
      }

      if (!Number.isFinite(Number(value))) continue;

      const k = key.toLowerCase();
      if (
        ![
          "price",
          "total",
          "amount",
          "value",
          "rate",
          "min_price",
          "lowest_price",
        ].includes(k)
      ) {
        continue;
      }

      const num = Number(value);
      if (num <= 0) continue;

      min = min === null ? num : Math.min(min, num);
    }
  }

  return min;
}

/* ---------------------------
   GET
--------------------------- */
export async function GET(req) {
  const headers = corsHeaders(req);
  const { searchParams } = new URL(req.url);

  /* ---------------------------
     HEALTH CHECK
  --------------------------- */
  if (searchParams.get("ping") && searchParams.get("ping") !== "0") {
    return NextResponse.json(
      { ok: true, service: "price", time: new Date().toISOString() },
      { status: 200, headers }
    );
  }

  const hotelKey = (searchParams.get("hotel_key") || "").trim();
  const chkIn = (searchParams.get("chk_in") || "").trim();
  const chkOut = (searchParams.get("chk_out") || "").trim();
  const currency = (searchParams.get("currency") || "USD").toUpperCase();

  /* ---------------------------
     VALIDATION
  --------------------------- */
  if (!hotelKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing required query param: hotel_key",
        example:
          "/api/pricing?hotel_key=g297596-d2065676&chk_in=2026-01-26&chk_out=2026-01-28&currency=INR",
      },
      { status: 400, headers }
    );
  }

  if (!isYYYYMMDD(chkIn)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing chk_in (YYYY-MM-DD)" },
      { status: 400, headers }
    );
  }

  if (!isYYYYMMDD(chkOut)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing chk_out (YYYY-MM-DD)" },
      { status: 400, headers }
    );
  }

  if (chkOut <= chkIn) {
    return NextResponse.json(
      { ok: false, error: "chk_out must be after chk_in" },
      { status: 400, headers }
    );
  }

  if (!/^[A-Z]{3}$/.test(currency)) {
    return NextResponse.json(
      { ok: false, error: "Invalid currency (3-letter code required)" },
      { status: 400, headers }
    );
  }

  /* ---------------------------
     XOTELO REQUEST
  --------------------------- */
  const url =
    "https://data.xotelo.com/api/rates" +
    `?hotel_key=${encodeURIComponent(hotelKey)}` +
    `&chk_in=${encodeURIComponent(chkIn)}` +
    `&chk_out=${encodeURIComponent(chkOut)}` +
    `&currency=${encodeURIComponent(currency)}`;

  const res = await fetchJson(url);

  if (!res.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: res.error,
        upstream_http_code: res.status,
      },
      { status: 502, headers }
    );
  }

  if (res.data?.error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Upstream error from Xotelo",
        upstream: res.data.error,
      },
      { status: 502, headers }
    );
  }

  const lowest = extractLowestPrice(res.data);

  return NextResponse.json(
    {
      ok: true,
      query: {
        hotel_key: hotelKey,
        chk_in: chkIn,
        chk_out: chkOut,
        currency,
      },
      lowest_price_guess: lowest,
      raw: res.data,
    },
    { status: 200, headers }
  );
}

