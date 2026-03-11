import Header from '@/component/Header'
import BaliBanner from '@/Components/InnerPages/Bali/BaliBanner'
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
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels-in-bali`,
    },
    robots: { index: false, follow: false },
};
export default function page() {
    return (
        <>
            <Header />
            <BaliBanner />

        </>
    )
}
