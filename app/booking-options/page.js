import React, { Suspense } from 'react'
import Header from '../../component/Header'
import Footer from '@/component/Footer'
import Boooking_options from '@/Components/Book-Flights/Flight_Details/Boooking_options'
import Booking_Option_Detail from '@/Components/Book-Flights/Flight_Details/Booking_Option_Detail'


export default function page() {


    return (
        <>


            <Suspense >
                <Header />
                <Booking_Option_Detail />
                <Footer />
            </Suspense>
        </>
    )
}
