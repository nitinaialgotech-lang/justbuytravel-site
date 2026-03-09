import Header from '@/component/Header'
import CanadaBanner from '@/Components/InnerPages/Canada/CanadaBanner'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Best Hotels in Canada | Budget & Luxury Stays | Just Buy Travel",
    description:
        " Looking for the best hotels in Canada? Compare budget, luxury, and comfortable stays, explore top places to stay, and plan your trip with Just Buy Travel.  ",
    keywords:
        "",
    openGraph: {
        title: "Best Hotels in Canada | Budget & Luxury Stays | Just Buy Travel",
        description:
            " Looking for the best hotels in Canada? Compare budget, luxury, and comfortable stays, explore top places to stay, and plan your trip with Just Buy Travel.  ",
        type: "website",
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-canada',
    },
    robots: { index: true, follow: true },
};
export default function page() {

    const FaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What types of hotels are available in Canada?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Canada offers a wide range of accommodation options, including budget hotels, mid-range stays, and luxury hotels. Travelers can find hotels in major cities, popular tourist destinations, and quieter regions across the country."
                }
            },
            {
                "@type": "Question",
                "name": "Can I book hotels through your website?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We do not process hotel bookings directly. Our platform helps you research and compare hotels using trusted hotel booking partners, so you can choose the best option before completing your booking on the partner’s website."
                }
            },
            {
                "@type": "Question",
                "name": "Are hotel prices the same on all booking websites?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hotel prices may vary across booking platforms due to special offers, availability, and cancellation policies. Comparing multiple hotel booking websites helps you find the best prices and deals for your stay."
                }
            },
            {
                "@type": "Question",
                "name": "Is it safe to book hotels through partner websites?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we work with trusted and well-known hotel booking platforms that follow secure payment and data protection standards. Always review hotel details, policies, and guest ratings before confirming your booking."
                }
            },
            {
                "@type": "Question",
                "name": "Are affordable hotels in Canada suitable for families?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many affordable hotels in Canada are family-friendly and offer spacious rooms, convenient locations, and essential amenities. These hotels are ideal for family vacations, short stays, and longer trips."
                }
            }
        ]
    }


    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
            />

            <Suspense>
                <Header />
                <CanadaBanner />
            </Suspense>
        </>
    )
}
