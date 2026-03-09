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
        const { q = "", gl = "us", hl = "en", exclude_regions = "false" } = data;

        if (!q || String(q).trim().length === 0) {
            return NextResponse.json(
                { error: "Query parameter 'q' is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const result = await getJson({
            engine: "google_flights_autocomplete",
            q: String(q).trim(),
            gl: String(gl).slice(0, 2),
            hl: String(hl).slice(0, 2),
            exclude_regions: exclude_regions === "true",
            api_key: SERP_API_KEY,
            // Smaller response = faster; only return fields we need
            json_restrictor: "suggestions[].{position,name,type,description,id,airports}",
        });

        return NextResponse.json(
            {
                suggestions: result?.suggestions ?? [],
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("SerpAPI /api/flight-autocomplete error:", err);

        const status = err?.response?.status ?? 500;
        let respData =
            err?.response?.data ?? err?.responseBody ?? null;
        if (!respData && typeof err?.message === "string") {
            try {
                respData = JSON.parse(err.message);
            } catch {
                // leave as null
            }
        }

        return NextResponse.json(
            {
                error: err?.message ?? "Unexpected error from SerpAPI",
                status,
                serpapi_error: respData,
            },
            { status, headers: corsHeaders }
        );
    }
}