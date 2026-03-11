import Header from '@/component/Header'
import Blog_Page_Banner from '@/Components/Blogs/Single_Blog_Page/Blog_Page_Banner/Blog_Page_Banner'
import React from 'react'
import "../../style/responsive.css"

export const metadata = {
    title: "Travel Blog | Tips, Guides & Updates | Just Buy Travel",
    description: "Explore destination guides, travel tips, and practical booking insights from Just Buy Travel.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/blog`,
    },
    robots: { index: true, follow: true },
    openGraph: {
        title: "Travel Blog | Tips, Guides & Updates | Just Buy Travel",
        description: "Explore destination guides, travel tips, and practical booking insights from Just Buy Travel.",
        type: "website",
    },
};

export const dynamic = 'force-dynamic';

export default async function page() {
    return (
        <>
            <Header />
            <Blog_Page_Banner />
        </>
    )
}
