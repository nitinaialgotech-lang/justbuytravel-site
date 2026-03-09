import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

/* ---------------------------
   CONFIG
--------------------------- */
const API_KEY = process.env.GOOGLE_PLACES_API_KEY; // put key in .env.local
const GOOGLE_URL = "https://places.googleapis.com/v1/places:searchText";

// Cache config
const CACHE_ENABLED = true;
const CACHE_EXPIRY = 60 * 60; // 1 hour
const CACHE_DIR = path.join(process.cwd(), ".cache");

/* ---------------------------
   CORS
--------------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

/* ---------------------------
   CACHE HELPERS
--------------------------- */
function getCacheKey(payload) {
  return crypto.createHash("md5").update(JSON.stringify(payload)).digest("hex");
}

function getCacheFile(key) {
  return path.join(CACHE_DIR, `${key}.json`);
}

function getCachedData(key) {
  const file = getCacheFile(key);
  if (!fs.existsSync(file)) return null;

  const cache = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (Date.now() > cache.expiresAt) {
    fs.unlinkSync(file);
    return null;
  }
  return cache.data;
}

function setCachedData(key, data) {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  fs.writeFileSync(
    getCacheFile(key),
    JSON.stringify({
      data,
      expiresAt: Date.now() + CACHE_EXPIRY * 1000,
      createdAt: Date.now(),
    })
  );
}

/* ---------------------------
   OPTIONS (Preflight)
--------------------------- */
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/* ---------------------------
   GET / POST HANDLER
--------------------------- */
export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

/** Parse request URL so query params work in Next.js (nextUrl, or req.url with base). */
function getSearchParams(req) {
  // NextRequest provides nextUrl with correct searchParams
  try {
    if (req.nextUrl && typeof req.nextUrl.searchParams?.get === "function") {
      return req.nextUrl.searchParams;
    }
  } catch (_) {}

  const raw = req.url || "";
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      return new URL(raw).searchParams;
    }
    if (raw.includes("?") || raw.startsWith("/")) {
      const base =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VERCEL_URL ||
        "http://localhost:3000";
      const baseUrl = base.startsWith("http") ? base : `http://${base}`;
      return new URL(raw, baseUrl).searchParams;
    }
  } catch (_) {}
  return new URLSearchParams();
}

/* ---------------------------
   MAIN HANDLER
--------------------------- */
async function handleRequest(req) {
  try {
    const searchParams = getSearchParams(req);

    let body = {};
    if (req.method === "POST") {
      body = await req.json().catch(() => ({}));
    }

    const textQuery =
      (body.textQuery || searchParams.get("textQuery") || "").trim();

    // Support both includedType and includedTypes from callers
    const includedTypeParam =
      body.includedType ||
      searchParams.get("includedType") ||
      body.includedTypes ||
      searchParams.get("includedTypes");

    const maxResultCount =
      Number(body.maxResultCount || searchParams.get("maxResultCount")) || 20;
    const languageCode =
      body.languageCode || searchParams.get("languageCode") || "en";

    const noCacheRaw =
      body.noCache ?? searchParams.get("noCache") ?? true;
    const noCache =
      typeof noCacheRaw === "string"
        ? noCacheRaw.toLowerCase() === "true"
        : Boolean(noCacheRaw);

    if (!textQuery) {
      return NextResponse.json(
        { error: "textQuery parameter is required", places: [] },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!API_KEY || String(API_KEY).trim() === "") {
      return NextResponse.json(
        { places: [] },
        { status: 200, headers: corsHeaders }
      );
    }

    const payload = {
      textQuery: textQuery.trim(),
      maxResultCount,
      languageCode,
      ...(includedTypeParam
        ? {
            // Google Places API v1 searchText expects "includedType" (singular string)
            includedType: includedTypeParam,
          }
        : {}),
    };

    /* ---------------------------
       CACHE CHECK
    --------------------------- */
    const cacheKey = getCacheKey(payload);

    if (CACHE_ENABLED && !noCache) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        return new NextResponse(cached, {
          status: 200,
          headers: { ...corsHeaders, "X-Cache": "HIT" },
        });
      }
    }

    /* ---------------------------
       GOOGLE API REQUEST
    --------------------------- */
    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.photos,places.priceLevel,places.websiteUri,places.nationalPhoneNumber,places.types",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.text();

    if (!response.ok) {
      let errorMessage = "Google API request failed";
      try {
        const parsed = JSON.parse(data);
        if (parsed?.error?.message) {
          errorMessage = parsed.error.message;
        }
      } catch {
        // ignore JSON parse errors
      }

      return NextResponse.json(
        {
          error: errorMessage,
          code: response.status,
          places: [],
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    if (CACHE_ENABLED && response.ok && !noCache) {
      setCachedData(cacheKey, data);
    }

    return new NextResponse(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        "X-Cache": CACHE_ENABLED ? (noCache ? "BYPASS" : "MISS") : "DISABLED",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message, places: [] },
      { status: 500, headers: corsHeaders }
    );
  }
}

