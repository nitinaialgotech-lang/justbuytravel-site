import React from 'react'
import Header from '@/component/Header'
import Footer from '@/component/Footer'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "Disclaimer | Just Buy Travel",
    description: "Read Just Buy Travel's disclaimer to understand the terms and conditions for using our travel services and website.",
    keywords: "disclaimer, terms and conditions, terms of use, service terms, legal terms, user agreement",
    openGraph: {
        title: "Disclaimer | Just Buy Travel",
        description: "Read Just Buy Travel's disclaimer to understand the terms and conditions for using our travel services and website.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/desclimer`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function DesclimerPage() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'Disclaimer', path: '/desclimer' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />

            <Header />
            <div className='container privacy_policy policies_pages mt-4'>
                <h1>Disclaimer</h1>
                <p>The information provided on JustBuyTravel (“we,” “us,” or “our”) is for general informational and reference purposes only. While we strive to keep the information accurate and up to date, we make no warranties or guarantees of any kind regarding the accuracy, completeness, reliability, or availability of any content displayed on the website.</p>
                <p>Prices, availability, deals, and other travel-related information shown on JustBuyTravel are subject to change at any time based on dates, demand, location, and other factors. We do not guarantee that the prices or availability displayed on our website are always current or final.</p>
                <p>JustBuyTravel is not a booking or reservation website. We do not process bookings, payments, cancellations, or refunds. All hotel, flight, and travel bookings are completed on third-party websites.</p>
                <h3>EXTERNAL LINKS & AFFILIATE DISCLAIMER</h3>
                <p>JustBuyTravel may contain links to third-party travel websites, platforms, and services, including affiliate partners such as Booking.com, Expedia, and other travel providers. These links are provided for user convenience and comparison purposes only.</p>
                <p>We do not control, endorse, or take responsibility for the content, pricing, availability, terms, or services offered by any third-party website. Any transaction, booking, or payment made through external links is strictly between the user and the respective third-party provider.</p>
                <p>Final prices, availability, booking conditions, and policies are determined solely by the third-party website where the booking is completed. Users are strongly advised to review and verify all details directly on the provider’s website before making any booking or payment.</p>
                <p>Under no circumstances shall JustBuyTravel be liable for any loss, damage, or inconvenience arising from the use of this website or reliance on information provided through third-party links.</p>
            </div>
            <Footer />
        </>
    )
}

