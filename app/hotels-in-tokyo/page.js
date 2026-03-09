import Header from '@/component/Header'
import TokyoBanner from '@/Components/InnerPages/Tokyo/TokyoBanner'
import React, { Suspense } from 'react'


export const metadata = {
    title: "Hotels in Tokyo | Best hotels in Tokyo | Just Buy Travel",
    description:
        "Explore hotels in Tokyo, from luxury stays to affordable options. Compare the best hotels in Tokyo and plan your trip with Just Buy Travel. ",
    keywords:
        "hotels in Tokyo",
    openGraph: {
        title: "Hotels in Tokyo | Best hotels in Tokyo | Just Buy Travel",
        description:
            "Explore hotels in Tokyo, from luxury stays to affordable options. Compare the best hotels in Tokyo and plan your trip with Just Buy Travel. ",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-tokyo`,
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-tokyo`,
    },
    robots: { index: false, follow: false },
};
export default function page() {

    return (
        <>

            <Suspense >
                <Header />
                <TokyoBanner />
            </Suspense>
        </>
    )
}
