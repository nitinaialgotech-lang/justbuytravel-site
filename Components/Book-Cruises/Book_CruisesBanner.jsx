import React from 'react'
import Find_CruisesSection from './Find_CruisesSection'
import Trust_Guide_Section from '../Aboutus/Trust_Guide_Section'
import Footer from '@/component/Footer'
import Blogs from '../HomePage/Blog/Blogs'

export default function Book_CruisesBanner() {
    return (
        <>
            <section className='about_section  only_content_banner relative'>
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-lg-12">
                            <div className="banner_box">
                                <div className="title text-center">
                                    <h1 className='capitalize'>
                                        Quick Cruise Booking with Trusted  <span>Guidance</span>
                                    </h1>
                                    {/* <h5 className='capitalize'>
                                        <strong className='g_color'> JustBuyTravel</strong> Your Easy Way to Book Flights and Hotels
                                    </h5> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Find_CruisesSection />
            <Trust_Guide_Section />
            <Blogs />
            <Footer />

        </>
    )
}
