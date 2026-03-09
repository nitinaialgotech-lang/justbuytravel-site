"use client";

import { usePathname } from "next/navigation";

/**
 * Affiliate link that routes through /go to log clicks server-side.
 * Use when you want 100% reliable page-wise click tracking.
 * For simple links: pass baseHref + placement.
 * For hotel/dynamic links: pass baseHref + hotelUrl + placement.
 */
export default function AffiliateGoLink({
  baseHref,
  hotelUrl,
  placement,
  children,
  className,
  ...props
}) {
  const pathname = usePathname() || "/";

  const goUrl =
    `/go?to=${encodeURIComponent(baseHref)}` +
    `&from=${encodeURIComponent(pathname)}` +
    `&placement=${encodeURIComponent(placement || "")}` +
    (hotelUrl ? `&u=${encodeURIComponent(hotelUrl)}` : "");

  return (
    <a
      href={goUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
