"use client";
import Header from '@/component/Header'
import React, { useEffect, useState } from 'react'
import SearchSection from '../HomePage/SearchSection'
import SearchSidebar from './SearchSidebar'
import SearchContentBox from './SearchContentBox'
import "../../style/search.scss"
import "../../style/searchresult.css"
import Search from '../HomePage/Search'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { nearbyPlaces, SearchLocation } from '@/app/Route/endpoints'
import Footer from '@/component/Footer';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setLat, setLong, nameCity } from '@/Components/Redux/Reducer';
import SearchFilter from './SearchFilter';
export default function SearchResult() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const cityFromRedux = useSelector((state) => state?.user?.SearchDetail?.name?.[0]);

    // Sync URL params to Redux when landing on search page (ensures correct data from Enter or direct link)
    useEffect(() => {
        const lat = searchParams.get("lat");
        const long = searchParams.get("long");
        const name = searchParams.get("name");
        if (lat && long && name) {
            dispatch(setLat(lat));
            dispatch(setLong(long));
            dispatch(nameCity([name]));
        }
    }, [searchParams, dispatch]);

    const city = searchParams.get("name") || cityFromRedux;

    console.log(city, "ciyyyyyyyyyyyyyyyyyyyyyyyyyyyy");


    return (
        <>
            <Header />
            {/* ************************** */}
            <section className=' pb-md-0'>
                <div className="section_search_home_banner rounded-3xl flex items-center">
                    {/* *************************** box title */}
                    <div className="container">
                        <div className="row justify-center">
                            <div className="col-lg-12">
                                <div className="search_banner_box">
                                    <div className="title text-center">
                                        <h1 className='capitalize'>
                                            hotels  in  <span>   {city} </span>
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

            <div className="padding_b_0">

                <Search />
            </div>



            {/* ***************************************************** seasrch container  */}
            <div className="container">
                <div className="crums z-1 relative d-none d-lg-block">
                    <nav aria-label="breadcrumb ">
                        <ol className="breadcrumb mb-2 padding_bottom ps-2 pb-md-0">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link href="/">Hotels</Link></li>
                            <li className="breadcrumb-item active capitalize" aria-current="page">{city}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <SearchFilter />

            <SearchContentBox />

            <Footer />
        </>
    )
}
