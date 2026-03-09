import Header from '@/component/Header'
import UsaBanner from '@/Components/InnerPages/USA/UsaBanner'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Hotels in USA | Best hotels in USA | Just Buy Travel",
    description:
        "Explore hotels in USA, from luxury stays to affordable options. Compare the best hotels in USA and plan your trip with Just Buy Travel. ",
    keywords:
        "hotels in USA",
    openGraph: {
        title: "Hotels in USA | Best hotels in USA | Just Buy Travel",
        description:
            "Explore hotels in USA, from luxury stays to affordable options. Compare the best hotels in USA and plan your trip with Just Buy Travel. ",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-usa`,
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-usa`,
    },
    robots: { index: false, follow: false },
};
export default function page() {

    return (
        <>

            <Suspense >
                <Header />
                <UsaBanner />
            </Suspense>
        </>
    )
}
