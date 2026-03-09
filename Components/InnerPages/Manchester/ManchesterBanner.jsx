import Search from '@/Components/HomePage/Search'
import React from 'react'
import ManchesterRecomand from './ManchesterRecomand'

export default function ManchesterBanner() {

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
                                            Hotels in  <span> Manchester</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Helping travellers choose the right hotels in  Manchester with clarity, confidence, reliable insights, transparent pricing, and trusted information.

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
            {/* <SearchSection /> */}
            <Search />
            <ManchesterRecomand />
        </>
    )
}
