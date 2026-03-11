export async function GET(request) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0].trim() : null;
        const url = ip
            ? `https://ipapi.co/${ip}/json/`
            : `https://ipapi.co/json/`;
        const res = await fetch(url, {
            headers: { "User-Agent": "JustBuyTravel/1.0" },
        });
        const data = await res.json();
        console.log("Server detected country:", data.country_code);
        return Response.json({ country_code: data.country_code || null });
    } catch (e) {
        console.error("detect-country error:", e);
        return Response.json({ country_code: null });
    }
}