import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

// Multiple fallback APIs in case one fails
const FX_APIS = [
  "https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,AED,SAR,INR",
  "https://api.exchangerate.host/latest?base=USD",
];

async function fetchRates() {
  for (const url of FX_APIS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const json = await res.json();
      const rates = json?.rates ?? json?.quotes;
      if (rates && typeof rates === "object") {
        return { rates, date: json?.date };
      }
    } catch {
      continue;
    }
  }
  return null;
}

export async function GET() {
  try {
    const data = await fetchRates();
    if (data) {
      return NextResponse.json(
        { rates: data.rates, date: data.date },
        { headers: CORS_HEADERS }
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("FX rates fetch error:", err?.message);
  }
  return NextResponse.json(
    { error: "Unable to fetch rates", rates: null },
    { status: 503, headers: CORS_HEADERS }
  );
}
