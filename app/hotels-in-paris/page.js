import Header from '@/component/Header'
import ParisBanner from '@/Components/InnerPages/paris/ParisBanner'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Hotel in Paris | Book hotels in Paris | Just Buy Travel ",
    description:
        " Just By Travel provides clear information, pricing guidance, and location details to help you choose the right hotel in Paris, empowering travelers to book hotels in Paris with confidence.",
    keywords:
        "",
    openGraph: {
        title: "Hotel in Paris | Book hotels in Paris | Just Buy Travel ",
        description:
            " Just By Travel provides clear information, pricing guidance, and location details to help you choose the right hotel in Paris, empowering travelers to book hotels in Paris with confidence.",
        type: "website",
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-paris',
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
                "name": "Are there luxury hotels near Eiffel Tower Paris?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, travellers can find several luxury hotels near Eiffel Tower Paris that offer premium comfort, scenic surroundings, and convenient access to major landmarks."
                }
            },
            {
                "@type": "Question",
                "name": "What are the best hotels to stay in Paris for tourists?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best hotels to stay in Paris for tourists are usually located near central districts, popular attractions, and metro stations, making sightseeing easier."
                }
            },
            {
                "@type": "Question",
                "name": "Can I find cheap hotels in Paris city centre?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, there are cheap hotels in Paris city centre, especially in nearby neighbourhoods with good transport links and budget-friendly options."
                }
            },
            {
                "@type": "Question",
                "name": "How do travellers choose the right hotel location in Paris?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Travellers consider location, transport access, budget range, and guest reviews before choosing a hotel in Paris."
                }
            },
            {
                "@type": "Question",
                "name": "Do hotel prices in Paris vary by season?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, hotel prices in Paris vary by season, demand, and events, so flexible travel dates often help find better value."
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
                <ParisBanner />
            </Suspense>
        </>
    )
}
