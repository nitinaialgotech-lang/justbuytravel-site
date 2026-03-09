import Header from '@/component/Header'
import LondonBanner from '@/Components/InnerPages/London/LondonBanner';
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
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com/hotels-in-london',
    },
    robots: { index: false, follow: false },
};
export default function page() {
    return (
        <>
            <Header />
            <LondonBanner />


        </>
    )
}
