import Header from '@/component/Header'
import GlasGowBanner from '@/Components/InnerPages/GlasGow/GlasGowBanner'
import { Suspense } from 'react'
export const metadata = {
    title: "Hotels in Glasgow | Luxury & Family Stays | Just Buy Travel ",
    description:
        " Find the best hotels in Glasgow with Just Buy Travel. Explore luxury and family stays, compare prices, and book top hotel deals across trusted platforms.",
    keywords:
        "",
    openGraph: {
        title: "Hotels in Glasgow | Luxury & Family Stays | Just Buy Travel ",
        description:
            " Find the best hotels in Glasgow with Just Buy Travel. Explore luxury and family stays, compare prices, and book top hotel deals across trusted platforms.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-glasgow`,
    },
    robots: { index: true, follow: true },
};


export default function page() {


    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can I book hotels or flights directly on Just Buy Travel?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "No. Just Buy Travel does not process hotel or flight bookings directly. We help users compare hotel booking sites and flight comparison websites, then redirect them to trusted platforms to complete the booking."
                }
            },
            {
                "@type": "Question",
                "name": "Which are the best hotel booking sites to compare on Just Buy Travel?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "Just Buy Travel compares popular and trusted hotel booking sites, allowing users to research hotel prices, availability, and options in one place."
                }
            },
            {
                "@type": "Question",
                "name": "Does Just Buy Travel show real hotel and flight prices?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "Yes. Just Buy Travel displays hotel and flight prices provided by trusted travel websites. Final prices, availability, and taxes are confirmed on the partner website before booking."
                }
            },
            {
                "@type": "Question",
                "name": "Is Just Buy Travel suitable for worldwide and international travel research?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "Yes. Just Buy Travel supports worldwide travel research, helping users compare hotels and flights globally using the best online travel websites."
                }
            }
        ]
    }





    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <Suspense>
                <Header />
                <GlasGowBanner />
            </Suspense>
        </>
    )
}
