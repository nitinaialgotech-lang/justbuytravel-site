import Search from '@/Components/HomePage/Search'
import React from 'react'
import IreLandRecond from './IreLandRecond'

export default function IreLandBanner() {
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
                                            Hotels in<span> Ireland</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Trusted hotel insights across Ireland, helping travellers understand locations, pricing ranges, and stay options before booking elsewhere.
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
            <IreLandRecond />
        </>
    )
}
