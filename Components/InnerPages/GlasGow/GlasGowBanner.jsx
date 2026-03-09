import Search from '@/Components/HomePage/Search'
import React from 'react'
import GlasGowRecomd from './GlasGowRecomd'

export default function GlasGowBanner() {
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
                                            Hotels in<span> Glasgow</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Plan your Glasgow stay easily by exploring hotels, reviews, and price options in one place with Just Buy Travel
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
            <GlasGowRecomd />
        </>
    )
}
