import Header from '@/component/Header'
import IreLandBanner from '@/Components/InnerPages/Ireland/IreLandBanner'
import React, { Suspense } from 'react'
export const metadata = {
    title: " Hotels in Ireland | Cheap & Luxury Stays | Just Buy Travel ",
    description:
        " Compare hotels in Ireland with cheap and luxury stays. Find trusted deals, verified listings, and flexible options for every travel style with Just Buy Travel.",
    keywords:
        "",
    openGraph: {
        title: " Hotels in Ireland | Cheap & Luxury Stays | Just Buy Travel ",
        description:
            " Compare hotels in Ireland with cheap and luxury stays. Find trusted deals, verified listings, and flexible options for every travel style with Just Buy Travel.",
        type: "website",
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-ireland',
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
                "name": "Which hotels in Ireland allow pets?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many hotels in Ireland welcome pets, particularly countryside lodges, coastal stays, and selected city hotels. Pet policies vary by property, so travellers should review individual hotel rules before booking."
                }
            },
            {
                "@type": "Question",
                "name": "What are the best family-friendly hotels in Ireland?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Family-friendly hotels in Ireland typically offer spacious rooms, practical amenities, and locations close to attractions. These hotels are available in cities, coastal areas, and popular travel regions."
                }
            },
            {
                "@type": "Question",
                "name": "Are there budget-friendly hotels available across Ireland?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, travellers can find budget and affordable hotels throughout Ireland. These options provide essential comfort, convenient locations, and value for both short and longer stays."
                }
            },
            {
                "@type": "Question",
                "name": "Can I find hotels in Ireland suitable for countryside stays?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ireland offers many countryside hotels and rural accommodations, ideal for travellers looking for scenic views, peaceful locations, and a relaxed travel experience."
                }
            },
            {
                "@type": "Question",
                "name": "How can I compare hotels in Ireland before booking?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hotels in Ireland can be compared by reviewing location details, price ranges, amenities, and guest feedback through trusted hotel comparison platforms before booking with partners."
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
                <IreLandBanner />
            </Suspense>
        </>
    )
}
