"use client";
import React, { useEffect, useState } from "react";
import "../../style/searchresult.css";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GetAccommodationDetails, nearbyPlaces, SearchLocation } from "@/app/Route/endpoints";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HotelSearchRecomand from "./HotelSearchRecomand";
import HotelSearchNearByLocation from "./HotelSearchNearByLocation";
import HotelSearchIconicPlaces from "./HotelSearchIconicPlaces";
import { useSelector } from "react-redux";


export default function SearchContentBox() {
    const searchParams = useSearchParams();
    // Use URL params as source of truth (synced from Enter/direct link), fallback to Redux
    const latFromUrl = searchParams.get("lat");
    const longFromUrl = searchParams.get("long");
    const nameFromUrl = searchParams.get("name");
    const lat = useSelector((state) => state?.user?.SearchDetail?.lat)
    const long = useSelector((state) => state?.user?.SearchDetail?.long)
    const name = useSelector((state) => state?.user?.SearchDetail?.name)
    // Prefer URL params when available (ensures correct data on load)
    const latVal = latFromUrl || lat;
    const longVal = longFromUrl || long;
    const nameVal = nameFromUrl ? [nameFromUrl] : name;
    const placeType = searchParams.get("type");
    const placeName = nameFromUrl || (Array.isArray(nameVal) ? nameVal?.[0] : nameVal);
    // Known country/region names - use text search when URL lacks type=region (e.g. old links, bookmarks)
    const COUNTRY_LIKE_NAMES = ["united states", "usa", "india", "united kingdom", "uk", "canada", "australia", "germany", "france", "spain", "italy", "japan", "china", "brazil", "mexico"];
    const looksLikeCountry = placeName && COUNTRY_LIKE_NAMES.some((c) => String(placeName).toLowerCase().includes(c));
    // Use text search for countries/large regions - nearby search returns wrong localized results
    const useTextSearch = ((placeType === "country" || placeType === "region") || looksLikeCountry) && !!placeName;


    // const { data, isLoading } = useQuery({
    //     queryKey: ["gethotels", lat, long],
    //     queryFn: () => nearbyPlaces(lat, long)
    // })
    // const hotelData = data?.data?.places;
    // ************************************** swimmer effect **************

    // ************************************* on load more button show 
    // const itemPerPage = 6;
    // const [visibleCount, setVisibleCount] = useState(itemPerPage);
    // useEffect(() => {
    //     const id = requestAnimationFrame(() => setVisibleCount(itemPerPage));
    //     return () => cancelAnimationFrame(id);
    // }, [hotelData]);
    return (
        <>
            {/* ********************** recomand section show    */}
            <HotelSearchRecomand lat={latVal} long={longVal} name={nameVal} placeName={placeName} useTextSearch={useTextSearch} />

            {/* *************** swimmer effect ***************** */}




            {/* ********************* end of swimmer effect ********* */}


            {/* **************************************** near buy location xxxxxxxxxxxxxxxxxxxxx */}
            <HotelSearchNearByLocation lat={latVal} long={longVal} placeName={placeName} useTextSearch={useTextSearch} />
            {/* ******************************* iconic plaeces xxxxxxxxxxxxxxxxxxxxxxxxxx */}
            <HotelSearchIconicPlaces lat={latVal} long={longVal} placeName={placeName} useTextSearch={useTextSearch} />
        </>
    );
}
