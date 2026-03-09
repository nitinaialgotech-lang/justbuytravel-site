import { NextResponse } from "next/server";
import { tpWithSubId } from "@/lib/tpLink";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");
  const from = searchParams.get("from") || "unknown";
  const placement = searchParams.get("placement") || "";
  const u = searchParams.get("u"); // optional hotel/destination URL

  if (!to) {
    return NextResponse.json({ error: "Missing ?to=" }, { status: 400 });
  }

  const baseHref = decodeURIComponent(to);

  const baseWithSubId = tpWithSubId(baseHref, {
    page: from,
    placement,
  });

  const finalHref = u
    ? `${baseWithSubId}&u=${encodeURIComponent(decodeURIComponent(u))}`
    : baseWithSubId;

  // LOG CLICK (replace console with DB if you want)
  console.log(
    JSON.stringify({
      type: "affiliate_click",
      at: new Date().toISOString(),
      from,
      placement,
      finalHref: finalHref.slice(0, 200) + (finalHref.length > 200 ? "..." : ""),
      ip: req.headers.get("x-forwarded-for") || "",
      ua: req.headers.get("user-agent") || "",
    })
  );

  return NextResponse.redirect(finalHref, 302);
}
