import Footer from '@/component/Footer'
import Header from '@/component/Header'
import ViewAllHotelBanner from '@/Components/SearchResultPage/ViewAllHotels/ViewAllHotelBanner'
import React from 'react'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "View All Hotels - Browse Complete Hotel Collection",
    description: "Browse our complete collection of hotels worldwide. Explore all available hotels, compare prices, read reviews, and find your ideal accommodation.",
    keywords: "all hotels, browse hotels, hotel collection, hotel listings, worldwide hotels, hotel directory",
    openGraph: {
        title: "View All Hotels - Browse Complete Hotel Collection | Just Buy Travel",
        description: "Browse our complete collection of hotels worldwide. Explore and compare thousands of hotels.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/view-all-hotels`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function page() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'View All Hotels', path: '/view-all-hotels' }
    ]);
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />
            <Header />
            <ViewAllHotelBanner />
            <Footer />
        </>
    )
}
