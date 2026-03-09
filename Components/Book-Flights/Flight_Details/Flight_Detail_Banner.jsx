import React from 'react'
import Flight_Departure from '../Flight_Departure'
import Flight_Search_Input from './Flight_Search_Input'
import Flight_Search_Detail from './Flight_Search_Detail'

export default function Flight_Detail_Banner() {
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
            <Flight_Search_Input />
            <Flight_Search_Detail />

        </>
    )
}
