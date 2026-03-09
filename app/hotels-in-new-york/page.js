import Header from '@/component/Header'
import NewYorkBanner from '@/Components/InnerPages/NewYorkPage/NewYorkBanner'
import NewYorkRecondSection from '@/Components/InnerPages/NewYorkPage/NewYorkRecondSection'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Hotels in New York | Beach, Budget & Luxury Stays | Just Buy Travel",
    description:
        "Start planning your stay in New York with us and find hotels in New York that fit your budget, offer luxury amenities, and are located in the city center.",
    keywords:
        " ",
    openGraph: {
        title: "Hotels in New York | Beach, Budget & Luxury Stays | Just Buy Travel",
        description:
            "Start planning your stay in New York with us and find hotels in New York that fit your budget, offer luxury amenities, and are located in the city center.",
        type: "website",
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-new-york',
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
                "name": "Can I book hotels in New York online through Just Buy Travel?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Just Buy Travel helps travellers compare options and then book hotels in New York City online using trusted booking partners for a secure experience."
                }
            },
            {
                "@type": "Question",
                "name": "How can travellers find cheap hotel rooms in New York City?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Travellers can save money by choosing flexible dates, staying outside busy areas, and checking reviews to find cheap hotel rooms in New York City."
                }
            },
            {
                "@type": "Question",
                "name": "Which areas are good to stay in New York for tourists?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Popular areas include central districts for sightseeing and nearby neighbourhoods with good transport access, depending on travel preferences."
                }
            },
            {
                "@type": "Question",
                "name": "Are there hotel options in New York suitable for families?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many hotels in New York offer family-friendly rooms, extra space, and convenient access to parks and attractions."
                }
            },
            {
                "@type": "Question",
                "name": "Is it safe to book hotels through comparison websites?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, booking through trusted comparison platforms is safe when they work with reliable partners and display clear hotel information."
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

            <Suspense >
                <Header />
                <NewYorkBanner />
                <NewYorkRecondSection />
            </Suspense>
        </>
    )
}
