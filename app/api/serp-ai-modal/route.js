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
      q = "",
      location = "",
      gl = "us",
      hl = "en",
      device = "",
      subsequent_request_token = "",
    } = data;

    const query = typeof q === "string" ? q.trim() : "";

    if (!query) {
      return NextResponse.json(
        { error: "Parameter q (search query) is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const params = {
      engine: "google_ai_mode",
      q: query,
      api_key: SERP_API_KEY,
    };

    if (location) params.location = location;
    if (gl) params.gl = gl;
    if (hl) params.hl = hl;
    if (device) params.device = device;
    if (subsequent_request_token) params.subsequent_request_token = subsequent_request_token;

    const json = await getJson(params);

    return NextResponse.json(
      {
        q: query,
        text_blocks: json?.text_blocks ?? null,
        ask_ai_mode: json?.ask_ai_mode ?? null,
        raw: json,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("SerpAPI /api/serp-ai-modal error:", err);

    const status = err?.response?.status || 500;

    let respData =
      err?.response?.data ?? err?.responseBody ?? null;
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
