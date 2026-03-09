import Header from '@/component/Header'
import SydneyBanner from '@/Components/InnerPages/Sydney/SydneyBanner'
import SydneyRecomd from '@/Components/InnerPages/Sydney/SydneyRecomd'
import React, { Suspense } from 'react'


export const metadata = {
    title: "Hotels in Sydney | Best hotels in Sydney | Just Buy Travel",
    description:
        "Explore hotels in Sydney, from luxury stays to affordable options. Compare the best hotels in Sydney and plan your trip with Just Buy Travel. ",
    keywords:
        "hotels in Sydney",
    openGraph: {
        title: "Hotels in Sydney | Best hotels in Sydney | Just Buy Travel",
        description:
            "Explore hotels in Sydney, from luxury stays to affordable options. Compare the best hotels in Sydney and plan your trip with Just Buy Travel. ",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-sydney`,
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-sydney`,
    },
    robots: { index: false, follow: false },
};
export default function page() {

    return (
        <>

            <Suspense >
                <Header />
                <SydneyBanner />
            </Suspense>
        </>
    )
}
