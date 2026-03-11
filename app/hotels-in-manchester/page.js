import Header from '@/component/Header'
import ManchesterBanner from '@/Components/InnerPages/Manchester/ManchesterBanner'
import React, { Suspense } from 'react'
export const metadata = {
    title: "Hotels in Manchester | Luxury & Budget Stays | Just Buy Travel  ",
    description:
        "Luxury and comfortable hotels in Manchester with great deals. Compare prices, check trusted stays, and book your hotel easily with Just Buy Travel today.",
    keywords:
        "",
    openGraph: {
        title: "Hotels in Manchester | Luxury & Budget Stays | Just Buy Travel  ",
        description:
            "Luxury and comfortable hotels in Manchester with great deals. Compare prices, check trusted stays, and book your hotel easily with Just Buy Travel today.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-manchester`,
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
                "name": "Are there good budget hotels in Manchester?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Manchester has many budget-friendly hotels that offer comfortable stays, good transport access, and convenient locations. Comparing prices by area and travel dates helps you find the best value, especially on weekends and event days."
                }
            },
            {
                "@type": "Question",
                "name": "Which areas are best to stay in Manchester?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Popular areas include Manchester City Centre, Northern Quarter, Deansgate, and Piccadilly for central access. If your trip is football-focused, staying near Old Trafford can be convenient. The best area depends on your plans, budget, and transport needs."
                }
            },
            {
                "@type": "Question",
                "name": "Can families find suitable hotels in the city?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Many hotels in Manchester offer family rooms and practical amenities, with easy access to attractions, shopping, and public transport. Using filters for family-friendly stays can help you shortlist suitable options faster."
                }
            },
            {
                "@type": "Question",
                "name": "Do hotels offer flexible cancellation options?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many hotels offer flexible cancellation, but policies vary by property and by rate type. Always review the cancellation terms shown before booking, especially for discounted or non-refundable rates."
                }
            },
            {
                "@type": "Question",
                "name": "When is the best time to book a hotel in Manchester?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Booking early is recommended for peak demand periods such as major matches, concerts, holidays, and busy weekends. For quieter dates, comparing prices and staying flexible with travel days can help you find better deals."
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
                <ManchesterBanner />
            </Suspense>
        </>
    )
}
