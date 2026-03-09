import Footer from '@/component/Footer'
import Header from '@/component/Header'
import Trusted_Favourite_Companies from '@/Components/TrustedPartner/Trusted&Favourite_Companies'

import TrustedPartner_content from '@/Components/TrustedPartner/TrustedPartner_content'
import React, { Suspense } from 'react'
import Trusted_Partner_Banner from '@/Components/TrustedPartner/Trusted_Partner_Banner'
import TrustedPartner_Title from '@/Components/TrustedPartner/TrustedPartner_Title'
import Trusted_Explore_Category from '@/Components/TrustedPartner/Trusted_Explore_Category'
import Trust_Guide_Section from '@/Components/Aboutus/Trust_Guide_Section'
export const metadata = {
    title: "My Favorite Travel Resources | Just Buy Travel",
    description:
        "Discover the best travel resources and companies to use when planning your next trip. From flights to accommodations, we've got you covered.",
    keywords:
        "travel resources, travel companies, travel planning, travel tips, travel guides",
    openGraph: {
        title: "My Favorite Travel Resources | Just Buy Travel",
        description:
            "Discover the best travel resources and companies to use when planning your next trip. From flights to accommodations, we've got you covered.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/my-favorite-travel-resources`,
    },
    robots: { index: false, follow: false },
};

export default function page() {
    return (
        <>
            <Suspense >
                <Header />

                <TrustedPartner_Title />
                <TrustedPartner_content />
                <Trust_Guide_Section />
                {/* <Trusted_Favourite_Companies /> */}
                <Trusted_Partner_Banner />
                <Trusted_Explore_Category />
                <Footer />
            </Suspense>
        </>
    )
}
