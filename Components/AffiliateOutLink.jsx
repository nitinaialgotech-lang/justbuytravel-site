"use client";

import { usePathname } from "next/navigation";
import { tpWithSubId, buildAffiliateLinkWithSubId } from "@/lib/tpLink";

/**
 * Affiliate link with SubID tracking (page + placement).
 * For simple links: pass baseHref + placement.
 * For hotel/dynamic links: pass baseHref + hotelUrl + placement.
 */
export default function AffiliateOutLink({
  baseHref,
  hotelUrl,
  placement,
  children,
  className,
  ...props
}) {
  const pathname = usePathname() || "/";

  const href = hotelUrl
    ? buildAffiliateLinkWithSubId(baseHref, hotelUrl, {
        page: pathname,
        placement,
      })
    : tpWithSubId(baseHref, {
        page: pathname,
        placement,
      });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
