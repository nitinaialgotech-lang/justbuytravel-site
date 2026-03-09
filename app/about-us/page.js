import Footer from '@/component/Footer'
import Header from '@/component/Header'
import About_banner from '@/Components/Aboutus/About_banner'
import AboutHotelDetail from '@/Components/SearchResultPage/HotelDetail/AboutHotelDetail'
import React, { Suspense } from 'react'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "About Us - Your Trusted Travel Companion",
    description: "Learn about Just Buy Travel, your trusted source for honest travel reviews, best hotel deals, and destination guides. We help travelers find the best experiences worldwide.",
    keywords: "about Just Buy Travel, travel company, travel reviews, hotel comparison, trusted travel advisor",
    openGraph: {
        title: "About Just Buy Travel - Your Trusted Travel Companion",
        description: "Learn about Just Buy Travel, your trusted source for honest travel reviews and best hotel deals.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/about-us`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function page() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/aboutus' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />
            <Suspense >
                <Header />
                <About_banner />
                <Footer />
            </Suspense>
        </>
    )
}
