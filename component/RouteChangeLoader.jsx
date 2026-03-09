"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Hide when navigation completes (URL changes)
    const id = requestAnimationFrame(() => setLoading(false));
    return () => cancelAnimationFrame(id);
  }, [pathname, searchParams]);
  useEffect(() => {
    // Show when user starts navigation (click internal link, or back/forward)
    const onClick = (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

      const a = e.target?.closest?.("a[href]");
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const nextUrl = new URL(href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;
      if (nextUrl.pathname.startsWith("/_next")) return;

      // If the user clicks a link to the SAME page (same pathname + search),
      // don't show the global route loader, because Next.js will not trigger
      // a navigation event and the loader would get stuck.
      const currentPathWithSearch = window.location.pathname + window.location.search;
      const nextPathWithSearch = nextUrl.pathname + nextUrl.search;
      if (currentPathWithSearch === nextPathWithSearch) return;

      setLoading(true);
    };

    const onPopState = () => setLoading(true);

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  if (!loading) return null;
  return (
    <div className="page-loader-overlay" aria-hidden="true">
      <div className="page-loader-spinner" />
    </div>
  );
}


