import Header from '@/component/Header'
import AustraliaBanner from '@/Components/InnerPages/Australia/AustraliaBanner'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Affordable Hotels in Australia | Budget Hotel Deals | Just Buy Travel",
    description:
        " Compare affordable hotels in Australia and find budget-friendly hotel deals through trusted booking partners for a comfortable, safe, and hassle-free stay. ",
    keywords:
        "",
    openGraph: {
        title: "Affordable Hotels in Australia | Budget Hotel Deals | Just Buy Travel",
        description:
            " Compare affordable hotels in Australia and find budget-friendly hotel deals through trusted booking partners for a comfortable, safe, and hassle-free stay. ",
        type: "website",
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-australia',
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
                "name": "What types of hotels can I find in Australia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Australia offers a wide range of hotels, including budget hotels, family-friendly stays, and luxury hotels. Travelers can choose options in city centers, coastal areas, and regional destinations."
                }
            },
            {
                "@type": "Question",
                "name": "Are there affordable hotels available across Australia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, there are many affordable and budget hotels across Australia that provide clean rooms, good service, and convenient locations for different travel needs."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find the best hotel deals in Australia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Comparing hotel prices online and checking different travel dates can help travelers find better hotel deals. Flexible travel plans often lead to better value."
                }
            },
            {
                "@type": "Question",
                "name": "Are hotels in Australia suitable for family travel?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many hotels in Australia offer family-friendly features such as larger rooms, convenient locations, and services designed for traveling with children."
                }
            },
            {
                "@type": "Question",
                "name": "Can I find last-minute hotel deals in Australia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, last-minute hotel deals are sometimes available in Australia, especially during off-peak travel periods or in less crowded destinations."
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
                <AustraliaBanner />
            </Suspense>
        </>
    )
}
