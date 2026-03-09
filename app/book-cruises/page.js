import Header from '@/component/Header'
import Book_CruisesBanner from '@/Components/Book-Cruises/Book_CruisesBanner'
import React, { Suspense } from 'react'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "Book Cruises - Find Your Perfect Cruise Vacation",
    description: "Book cruise vacations to amazing destinations worldwide. Compare cruise lines, itineraries, and prices. Find the best cruise deals for your next sea adventure.",
    keywords: "book cruises, cruise deals, cruise vacation, cruise booking, ocean cruises, river cruises, cruise packages, cruise travel",
    openGraph: {
        title: "Book Cruises - Find Your Perfect Cruise Vacation | Just Buy Travel",
        description: "Book cruise vacations to amazing destinations worldwide. Compare cruise lines, itineraries, and prices.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/book-cruises`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function page() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'Book Cruises', path: '/book-cruises' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />

            <Suspense >
                <Header />
                <Book_CruisesBanner />
            </Suspense>
        </>
    )
}
