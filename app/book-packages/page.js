import Header from '@/component/Header'
import PackageBanner from '@/Components/Book-Packages/PackageBanner'
import React, { Suspense } from 'react'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "Book Travel Packages - All-Inclusive Vacation Deals",
    description: "Discover amazing travel packages and all-inclusive vacation deals. Save on bundled flights, hotels, and activities. Find your perfect vacation package today.",
    keywords: "travel packages, vacation packages, all-inclusive deals, holiday packages, tour packages, package deals, vacation bundles",
    openGraph: {
        title: "Book Travel Packages - All-Inclusive Vacation Deals | Just Buy Travel",
        description: "Discover amazing travel packages and all-inclusive vacation deals. Save on bundled flights, hotels, and activities.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/book-packages`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function page() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'Book Packages', path: '/book-packages' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />

            <Suspense >
                <Header />
                <PackageBanner />
            </Suspense>
        </>
    )
}
