import { NextResponse } from "next/server";

const API_KEY = process.env.SERPAPI_API_KEY;
const GOOGLE_URL = "https://serpapi.com/search.json?engine=google_hotels_autocomplete"

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const input = searchParams.get("input");

        if (!input || input.length < 2) {
            return NextResponse.json(
                { error: "input must be at least 2 characters" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${GOOGLE_URL}&q=${encodeURIComponent(
                input
            )}&api_key=${API_KEY}`
        );

        const json = await response.json();

        return NextResponse.json({
            suggestions: json.suggestions || []
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}