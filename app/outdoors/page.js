import Footer from '@/component/Footer'
import Header from '@/component/Header'
import Outdoor_Attraction_Section from '@/Components/OutdoorDestination/Outdoor_Attraction_Section'
import Outdoor_Banner from '@/Components/OutdoorDestination/Outdoor_Banner'
import React from 'react'

export default function page() {
    return (
        <>


            <Header />

            <Outdoor_Banner />
            <Outdoor_Attraction_Section />

            <Footer />

        </>
    )
}
