import Search from '@/Components/HomePage/Search'
import React from 'react'
import BaliRecomd from './BaliRecomd'

export default function BaliBanner() {
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
                                            Hotels in <span> Bali</span>
                                        </h1>
                                        <p className='capitalize'>
                                            Explore budget, luxury, and family-friendly hotels across Australia from trusted booking partners.
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
            <BaliRecomd />


        </>
    )
}
