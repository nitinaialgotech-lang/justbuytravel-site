import React, { Suspense } from 'react'
import Header from '@/component/Header'
import SearchHotelDetail from '@/Components/SearchResultPage/HotelDetail/SearchHotelDetail'
import "../../style/responsive.css"
export const metadata = {
    title: "Hotel Details, Reviews & Best Prices",
    description: "View detailed hotel information, reviews, amenities, and compare prices from multiple booking sites. Find the best deals on hotels worldwide.",
    keywords: "hotel details, hotel reviews, hotel amenities, hotel prices, hotel booking, compare hotel prices, hotel information",
    openGraph: {
        title: "Hotel Details, Reviews & Best Prices | Just Buy Travel",
        description: "View detailed hotel information, reviews, amenities, and compare prices from multiple booking sites.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hoteldetail/`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function page() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';

    const hotelDetailSchema = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": "Hotel Details",
        "description": "Comprehensive hotel information with reviews and price comparison",
        "url": `${siteUrl}/hoteldetail/`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelDetailSchema) }}
            />

            <Suspense >
                <SearchHotelDetail />
            </Suspense>
        </>
    )
}
