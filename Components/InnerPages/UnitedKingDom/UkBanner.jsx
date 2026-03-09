import Search from '@/Components/HomePage/Search'
import React from 'react'
import UkRecomd from './UkRecomd'

export default function UkBanner() {
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
                                            Hotels in<span> UK</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Helping travelers choose the best hotels in the UK with transparent pricing, verified stays, and reliable information.
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
            <UkRecomd />

        </>
    )
}
