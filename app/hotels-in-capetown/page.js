import Footer from '@/component/Footer'
import Header from '@/component/Header'
import CapeTownBanner from '@/Components/InnerPages/Capetown/CapeTownBanner'
import CapTownRecomd from '@/Components/InnerPages/Capetown/CapTownRecomd'
import React from 'react'
export const metadata = {
    title: "",
    description:
        " ",
    keywords:
        "",
    openGraph: {
        title: "",
        description:
            " ",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-capetown`,
    },
    robots: { index: false, follow: false },
};
export default function page() {
    return (
        <>
            <Header />

            <CapeTownBanner />
            <CapTownRecomd />

        </>
    )
}
