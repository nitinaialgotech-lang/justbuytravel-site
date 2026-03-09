import React, { Suspense } from 'react'
import Header from '../../component/Header'
import ContactUs from '@/Components/Contactus/ContactUs'
import Footer from '@/component/Footer'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
    title: "Contact Us - Get in Touch",
    description: "Have questions about travel? Contact Just Buy Travel for assistance with bookings, travel advice, or any inquiries. We're here to help plan your perfect trip.",
    keywords: "contact Just Buy Travel, travel support, customer service, travel help, travel inquiries",
    openGraph: {
        title: "Contact Us | Just Buy Travel",
        description: "Have questions about travel? Contact Just Buy Travel for assistance with bookings and travel advice.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/contact-us`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function page() {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', path: '/' },
        { name: 'Contact Us', path: '/contactus' }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />

            <Suspense >
                <Header />
                <ContactUs />
                <Footer />
            </Suspense>
        </>
    )
}
