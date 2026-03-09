"use client"
import Script from "next/script";
export default function ExpediaBanner() {
    return (
        <>
            <div
                className="eg-affiliate-banners"
                data-program="us-expedia"
                data-network="pz"
                data-layout="leaderboard"
                data-image="resort"
                data-message="hotel-treehouse-find-perfect-place-stay"
                data-camref="1110lvIIC"           // ← must be valid!
                data-pubref=""
                data-link="home"
            />
            <Script
                src="https://creator.expediagroup.com/products/banners/assets/eg-affiliate-banners.js"
                strategy="lazyOnload"   // ← changed from afterInteractive
            />
        </>
    );
}