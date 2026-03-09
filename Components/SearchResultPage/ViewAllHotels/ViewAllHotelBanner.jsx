"use client"
import Search from '@/Components/HomePage/Search'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ViewAllHotels from './ViewAllHotels';

export default function ViewAllHotelBanner() {
    const searchName = useSearchParams();
    const city = searchName.get("name")
    return (
        <>
            <section className='padding_bottom pb-md-0'>
                <div className="section_search_home_banner pt-10 pb-10 rounded-3xl flex items-center">
                    {/* *************************** box title */}
                    <div className="container">
                        <div className="row justify-center">
                            <div className="col-lg-12">
                                <div className="search_banner_box">
                                    <div className="title text-center">
                                        <h1 className='capitalize'>
                                            {city ? <><span>{city}  </span>hotels</> : "Top Hotels"}
                                        </h1>
                                        {/* <h5 className='capitalize'>

                                            home / {city} hotels

                                        </h5> */}

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
            {/* ***************************************************** seasrch container  */}
            <div className="container">
                <div className="crums z-1 relative">
                    <nav aria-label="breadcrumb ">
                        <ol className="breadcrumb mb-2 padding_bottom ps-2 pb-md-0">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link href="/">All Hotels</Link></li>
                            <li className="breadcrumb-item active capitalize" aria-current="page">{city || "Top Hotels"}</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">

                    <div className="col-lg-12">

                        <ViewAllHotels />
                    </div>

                </div>
            </div>


        </>
    )
}
