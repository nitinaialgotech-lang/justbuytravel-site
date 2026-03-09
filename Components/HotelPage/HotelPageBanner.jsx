import React from 'react'
import HotelSearchSection from './HotelSearchSection'

export default function HotelPageBanner() {
    return (
        <>

            <section className="section_home_banner ">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* ********************* */}
                            <div className="banner_box home_banner">
                                <div className="title text-center">
                                    <h1 className="capitalize">
                                        Searching <span>Hotel</span>
                                    </h1>
                                    {/* <h5 className="capitalize">
                    <strong className="g_color"> JustBuyTravel</strong> Your
                    Easy Way to Book Flights and Hotels
                  </h5> */}
                                </div>
                            </div>
                            {/* ********************* */}
                        </div>
                    </div>
                </div>
            </section>

            <HotelSearchSection />
        </>
    )
}
