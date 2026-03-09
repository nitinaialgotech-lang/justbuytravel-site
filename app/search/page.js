import React, { Suspense } from 'react'
import SearchResult from '@/Components/SearchResultPage/SearchResult'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "Search Hotels - Find Hotels by Location | Just Buy Travel",
    description: "Search and compare hotels by location. Find the best hotels near you with prices, reviews, and availability.",
    keywords: "search hotels, find hotels, hotels by location, hotel search, compare hotels",
    openGraph: {
        title: "Search Hotels | Just Buy Travel",
        description: "Search and compare hotels by location. Find the best hotels near you.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/search`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function SearchPage() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'Search Hotels', path: '/search' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />
            <Suspense >
                <SearchResult />
            </Suspense>
        </>
    );
}
