import React from 'react'
import Boooking_options from './Flight_Details/Boooking_options'

export default function Multi_Detail_banner() {
    return (
        <>
            <section className='book-flight-section  d-none d-lg-block padding_top_0_md'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="book-flight-title ">
                                <div className="banner_box home_banner">
                                    <div className="title text-center">
                                        <h1 className='capitalize'>
                                            {/* Quick Flights Booking with <span> Trusted Guidance</span> */}
                                            Search Flight  <span>detail</span>
                                        </h1>
                                        {/* <p className='capitalize'>
                                            Access verified flight listings, transparent prices, and secure booking options through trusted global airline partners.
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Boooking_options />

        </>
    )
}
