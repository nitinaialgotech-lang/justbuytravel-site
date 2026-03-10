export async function GET(request) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0].trim() : null;

        const url = ip
            ? `https://ipapi.co/${ip}/json/`
            : `https://ipapi.co/json/`;

        const res = await fetch(url);
        const data = await res.json();

        return Response.json({ country_code: data.country_code || null });
    } catch (e) {
        return Response.json({ country_code: null });
    }
}