import React from 'react'
import Trust_Guide_Section from './Trust_Guide_Section'
import AboutDetail from './AboutDetail'
import Blogs from '../HomePage/Blog/Blogs'

export default function About_banner() {
    return (
        <>
            <section className='about_section about_banner_img page_banner_section relative'>
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-lg-12">
                            <div className="banner_box about_us_banner">
                                <div className="title text-center">
                                    <h1 className=' text-light'>
                                        About  <span>Justbuytravel</span>
                                    </h1>
                                    {/* <p className='capitalize'>
                                        <strong className='g_color'> JustBuyTravel</strong> Your Easy Way to Book Flights and Hotels
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <AboutDetail />

            <Trust_Guide_Section />

            <Blogs />
        </>
    )
}
