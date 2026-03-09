import { NextResponse } from "next/server";

/* ---------------------------
   CONFIG
--------------------------- */
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
// Default max width for large images (hero/gallery)
const MAX_WIDTH = 2400;

/* ---------------------------
   CORS + CACHE
--------------------------- */
const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=86400",
};

/* ---------------------------
   OPTIONS
--------------------------- */
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: baseHeaders });
}

/* ---------------------------
   GET PHOTO
--------------------------- */
export async function GET(req) {
  try {
    if (!API_KEY) {
      return new NextResponse("Missing Google API key", {
        status: 500,
        headers: baseHeaders,
      });
    }

    const { searchParams } = new URL(req.url);
    const photoName = searchParams.get("name");
    const maxWidthParam = searchParams.get("maxWidthPx");

    if (!photoName) {
      return new NextResponse("Photo name missing", {
        status: 400,
        headers: baseHeaders,
      });
    }

    const maxWidth =
      maxWidthParam && Number(maxWidthParam) > 0
        ? Number(maxWidthParam)
        : MAX_WIDTH;

    const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=${maxWidth}`;

    const response = await fetch(googlePhotoUrl, {
      redirect: "follow",
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch photo", {
        status: response.status,
        headers: baseHeaders,
      });
    }

    const contentType =
      response.headers.get("content-type") || "image/jpeg";

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    return new NextResponse("Internal server error", {
      status: 500,
      headers: baseHeaders,
    });
  }
}

