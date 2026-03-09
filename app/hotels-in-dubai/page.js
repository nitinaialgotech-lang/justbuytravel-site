import React, { Suspense } from 'react'
import Header from '@/component/Header'
import DubaiBanner from '@/Components/InnerPages/Dubai/DubaiBanner'

// *********************************************************
export const metadata = {
    title: "Book Hotels in Dubai | Compare Cheap & Luxury Hotel Deals |  Just Buy Travel ",
    description:
        " Looking for book hotels in Dubai? Compare budget, luxury & 5-star hotels and find the best deals from trusted booking partners online.  ",
    keywords:
        "",
    openGraph: {
        title: "Book Hotels in Dubai | Compare Cheap & Luxury Hotel Deals |  Just Buy Travel ",
        description:
            " Looking for book hotels in Dubai? Compare budget, luxury & 5-star hotels and find the best deals from trusted booking partners online.  ",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-dubai`,
    },
    robots: { index: true, follow: true },
};

// ******************************************************
export default function page() {

    const FaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What types of hotels are available in Dubai?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dubai offers a wide range of hotels, including budget hotels, luxury resorts, and 5-star hotels. Travelers can choose from city hotels, beachfront stays, and hotels near popular areas like Dubai Marina and Downtown Dubai."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find the best hotels in Dubai?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best way to find hotels in Dubai is by comparing prices, locations, and guest reviews online. This helps travelers choose the right hotel based on budget, travel plans, and preferred area."
                }
            },
            {
                "@type": "Question",
                "name": "Are there affordable and budget hotels in Dubai?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, there are many budget and cheap hotels in Dubai that provide comfortable stays at reasonable prices. These hotels are ideal for travelers who want good value without spending too much."
                }
            },
            {
                "@type": "Question",
                "name": "Which areas are the best places to stay in Dubai?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Popular places to stay in Dubai include areas near Dubai Mall for shopping, Dubai Marina for waterfront views, and central locations close to major attractions. Each area offers a different experience depending on travel style."
                }
            },
            {
                "@type": "Question",
                "name": "Can I find last-minute hotel deals in Dubai?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, travelers can often find last-minute hotel deals in Dubai, especially during off-peak seasons. Comparing hotel options online can help find good offers even when booking close to the travel date."
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
            <Header />
            <Suspense >
                <DubaiBanner />
            </Suspense>
        </>
    )
}
