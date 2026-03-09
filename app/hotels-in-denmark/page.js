import Header from "@/component/Header";
import DenMarkBanner from "@/Components/InnerPages/Denmark/DenMarkBanner";
import React, { Suspense } from "react";

// *********************************************************
export const metadata = {
    title: "Hotels in Denmark | Cheap & luxury hotels | Just Buy Travel ",
    description:
        "Looking for hotels in Denmark? Access affordable and luxury stays, transparent pricing, and reliable booking options with Just Buy Travel online today easily.",
    keywords:
        "terms and conditions, terms of use, service terms, legal terms, user agreement",
    openGraph: {
        title: "Hotels in Denmark | Cheap & luxury hotels | Just Buy Travel ",
        description:
            "Looking for hotels in Denmark? Access affordable and luxury stays, transparent pricing, and reliable booking options with Just Buy Travel online today easily.",
        type: "website",
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-denmark',
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
                "name": "Are there cheap hotels in Denmark?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Denmark offers many budget-friendly hotel options across cities and smaller towns. Travelers can find clean and comfortable stays at reasonable prices by comparing locations, amenities, and guest reviews."
                }
            },
            {
                "@type": "Question",
                "name": "Can I book hotels in Denmark online?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can book hotels in Denmark online through trusted hotel booking platforms. Just Buy Travel helps you compare listings, prices, and policies before completing your booking on a partner website."
                }
            },
            {
                "@type": "Question",
                "name": "Are there last-minute hotels in Denmark?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, travelers can often find last-minute hotels in Denmark, especially during off-peak seasons or quieter travel periods. Availability depends on location and travel dates."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find the best Denmark hotel deals?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best Denmark hotel deals are usually found by comparing multiple booking platforms, checking flexible travel dates, and reviewing cancellation policies before booking."
                }
            },
            {
                "@type": "Question",
                "name": "Is it safe to book hotels through comparison websites?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, booking through reliable comparison websites is safe when they work with trusted hotel partners. Always review hotel details, guest ratings, and booking terms before confirming your stay."
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
                <DenMarkBanner />
            </Suspense>
        </>
    );
}
