import Search from '@/Components/HomePage/Search'
import React from 'react'

export default function CapeTownBanner() {
    return (
        <>

            <section className='mp-s mp-e'>
                <div className="section_home_banner rounded-3xl flex items-center">
                    {/* *************************** box title */}
                    <div className="container">
                        <div className="row justify-center">
                            <div className="col-lg-12">
                                <div className="banner_box home_banner">
                                    <div className="title text-center">
                                        <h1 className='capitalize'>
                                            Hotels in<span> Cape Town</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Explore Denmark hotel options, compare locations, prices, and guest reviews to find the right stay for your trip.

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ************************************************ */}
                    {/* ************************ search Box */}
                </div>
            </section>
            <Search />
        </>
    )
}
