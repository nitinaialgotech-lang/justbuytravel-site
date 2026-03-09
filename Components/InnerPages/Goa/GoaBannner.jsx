import Search from '@/Components/HomePage/Search'
import React from 'react'
import GoaRecomand from './GoaRecomand'

export default function GoaBannner() {
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
                                            Hotels in<span> Goa</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Enjoy your Goa trip with hotels close to beaches, markets, and nightlife, chosen for comfort and value.
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
            <GoaRecomand />


        </>
    )
}
