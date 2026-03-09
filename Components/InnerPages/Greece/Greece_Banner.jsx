import React from 'react'
import Greece_Recomnd from './Greece_Recomnd'
import Search from '@/Components/HomePage/Search'

export default function Greece_Banner() {
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
                                            Hotels in<span> Greece</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Compare hotels in Paris offering stylish rooms, central locations, fair prices, and hassle-free booking for travelers worldwide.
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
            <Greece_Recomnd />

        </>
    )
}
