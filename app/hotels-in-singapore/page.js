import Header from '@/component/Header'
import SingaporeBanner from '@/Components/InnerPages/Singapore/SingaporeBanner'
import SingaporeRecomdSection from '@/Components/InnerPages/Singapore/SingaporeRecomdSection'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Hotels in Singapore | Best hotels in Singapore | Just Buy Travel",
    description:
        "Explore hotels in Singapore, from luxury stays to affordable options. Compare the best hotels in Singapore and plan your trip with Just Buy Travel. ",
    keywords:
        "hotels in Singapore",
    openGraph: {
        title: "Hotels in Singapore | Best hotels in Singapore | Just Buy Travel",
        description:
            "Explore hotels in Singapore, from luxury stays to affordable options. Compare the best hotels in Singapore and plan your trip with Just Buy Travel. ",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-singapore`,
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-singapore`,
    },
    robots: { index: false, follow: false },
};

export default function page() {
    return (
        <>
            <Suspense >
                <Header />
                <SingaporeBanner />
                <SingaporeRecomdSection />
            </Suspense>
        </>
    )
}
