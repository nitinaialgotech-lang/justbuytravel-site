import Header from '@/component/Header'
import Book_Flight_Banner from '@/Components/Book-Flights/Book_Flight_Banner'
import Flight_Iconic_Places from '@/Components/Book-Flights/Flight_Iconic_Places'
import React, { Suspense } from 'react'
import Helping_travel_Explore from '@/Components/Book-Flights/Helping_travel_Explore'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'
import Popular_Flight_Hotel_section from '@/Components/Book-Flights/Popular_Flight_Hotel_section'
import Iconic_Flight_Hotel_section from '@/Components/Book-Flights/Iconic_Flight_Hotel_section'
import Trusted_Favourite_Companies from '@/Components/TrustedPartner/Trusted&Favourite_Companies'
import Blogs from '@/Components/HomePage/Blog/Blogs'
import Footer from '@/component/Footer'
import Flight_Faq_Section from '@/Components/Book-Flights/Flight_Faq_Section'
import FlightTrusted_Section from '@/Components/Book-Flights/FlightTrusted_Section'
import Flight_Amazing_Deal from '@/Components/Book-Flights/Flight_Amazing_Deal'

export const metadata = {
    title: "Book Flights Online | Cheap Flights Online | Just Buy Travel",
    description: "Do you want to book flights online? Just Buy Travel helps you check prices, compare airlines, and connect with trusted booking partners simple and stress-free.",
    keywords: "book flights, cheap flights, flight booking, airfare deals, compare flights, airline tickets, flight search, discount flights",
    openGraph: {
        title: "Book Flights Online | Cheap Flights Online | Just Buy Travel",
        description: "Do you want to book flights online? Just Buy Travel helps you check prices, compare airlines, and connect with trusted booking partners simple and stress-free.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/flights`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function page() {

    return (
        <>
            <Suspense >
                <Header />
                <Book_Flight_Banner />
                <div className='bg_grey'>

                    <Helping_travel_Explore />
                    {/* <Popular_Flight_Hotel_section /> */}
                    <Iconic_Flight_Hotel_section />
                </div>
                {/* <Flight_Iconic_Places /> */}
                <Flight_Amazing_Deal />
                <FlightTrusted_Section />
                {/* <Flight_Hotel_Guide_Section /> */}
                {/* <Trust_Guide_Section /> */}

                <Blogs />
                <Flight_Faq_Section />


                <Footer />
            </Suspense>
        </>
    )
}
