"use client";
import React, { useEffect, useState } from 'react'
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { SearchLocation } from '@/app/Route/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUserAlt } from 'react-icons/fa';
import { IoTime } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { getAssetPath } from '@/app/utils/assetPath';

export default function StaticRecomendSection() {
    const [locationFetching, setLocationFetching] = useState(true);
    const [location, setLocation] = useState("");

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                { headers: { "User-Agent": "JustBuyTravel/1.0" } }
            );
            const data = await response.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village;
                if (city) return city;
                return data.address.municipality || data.address.county || "Unknown Location";
            }
            return "Unknown Location";
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return "Unknown Location";
        }
    };

    const doSearch = async (query) => {
        try {
            const results = await SearchLocation(query);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    useEffect(() => {
        const getLocation = async () => {
            if (typeof navigator === "undefined" || !navigator?.geolocation) {
                console.warn("Geolocation not available");
                setLocationFetching(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const cityName = await reverseGeocode(latitude, longitude);
                    if (cityName) {
                        setLocation(cityName);
                        await doSearch(cityName);
                    } else {
                        const coordLocation = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                        setLocation(coordLocation);
                        await doSearch(coordLocation);
                    }
                    setLocationFetching(false);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    doSearch("New York");
                    setLocationFetching(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                }
            );
        };

        getLocation();
    }, []);

    return (
        <>
            <div className="col-lg-4" >
                {/* *********** */}
                <div className="recommend_card_box   rounded-3xl shadow margin_lr ">
                    {/* *********** */}
                    <div className="card_box pe-">
                        <div className="card_box_img rounded-3xl  relative">
                            <img src={getAssetPath("/home/destination/recommentImg.png")} className='rounded-3xl' alt="" />
                            {/* ********************* */}
                            <div className="rated_msg absolute top-5 flex  justify-between items-center left-5 right-5">
                                <div className="msg">
                                    <p className='m-0'>top rated</p>
                                </div>
                                <div className="msg_icon">
                                    <FaRegHeart />
                                </div>
                            </div>
                            {/* ********************* */}
                        </div>
                        {/* *** */}
                        <div className="card_box_detail px-4 py-5 rounded-4xl flex flex-col z-1 gap-4 relative">
                            <h4 className='m-0'>
                                Hyatt Regency Amritsar Hotel & Spa
                            </h4>
                            {/* ****** */}
                            <div className="time flex items-center gap-3 relative">
                                <div className="icon flex items-center gap-1">
                                    <span><IoTime /></span>
                                    <span><p className='m-0'>2 Days 3 Nights</p></span>
                                </div>
                                <div className="guest flex items-center gap-1">
                                    <span><FaUserAlt /></span>
                                    <span><p className='m-0'>4 -5 guest</p></span>
                                </div>
                            </div>
                            {/* ******* */}
                            <div className="price_book flex mt-3 justify-between items-center">
                                <h5 className='m-0'>
                                    $55.00 <span>/ person</span>
                                </h5>
                                <button className='rounded-full'>
                                    Book Now
                                </button>
                            </div>
                            {/* *************** rating_list */}
                            <div className="rating_list absolute flex items-center gap-1 right-10 shadow">
                                <span className='w-5'><FontAwesomeIcon icon={faStar} /></span>
                                <span><p className='m-0'>4.8</p></span>
                                <span><p className='m-0'>(22236 reviews)</p></span>
                            </div>

                        </div>
                    </div>
                    {/* *********** */}
                </div>
                {/* *********** */}
            </div>
            {/* *****************************************************XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
            <div className="col-lg-4" >
                {/* *********** */}
                <div className="recommend_card_box   rounded-3xl shadow margin_lr ">
                    {/* *********** */}
                    <div className="card_box pe-">
                        <div className="card_box_img rounded-3xl  relative">
                            <img src={getAssetPath("/home/destination/recommendImg3.png")} className='rounded-3xl' alt="" />
                            {/* ********************* */}
                            <div className="rated_msg absolute top-5 flex  justify-between items-center left-5 right-5">
                                <div className="msg">
                                    <p className='m-0'>top rated</p>
                                </div>
                                <div className="msg_icon">
                                    <FaRegHeart />
                                </div>
                            </div>
                            {/* ********************* */}
                        </div>
                        {/* *** */}
                        <div className="card_box_detail px-4 py-5 rounded-4xl flex flex-col z-1 gap-4 relative">
                            <h4 className='m-0'>
                                Hyatt Regency Amritsar Hotel & Spa
                            </h4>
                            {/* ****** */}
                            <div className="time flex items-center gap-3 relative">
                                <div className="icon flex items-center gap-1">
                                    <span><IoTime /></span>
                                    <span><p className='m-0'>2 Days 3 Nights</p></span>
                                </div>
                                <div className="guest flex items-center gap-1">
                                    <span><FaUserAlt /></span>
                                    <span><p className='m-0'>4 -5 guest</p></span>
                                </div>
                            </div>
                            {/* ******* */}
                            <div className="price_book flex mt-3 justify-between items-center">
                                <h5 className='m-0'>
                                    $55.00 <span>/ person</span>
                                </h5>
                                <button className='rounded-full'>
                                    Book Now
                                </button>
                            </div>
                            {/* *************** rating_list */}
                            <div className="rating_list absolute flex items-center gap-1 right-10 shadow">
                                <span className='w-5'><FontAwesomeIcon icon={faStar} /></span>
                                <span><p className='m-0'>4.8</p></span>
                                <span><p className='m-0'>(22236 reviews)</p></span>
                            </div>

                        </div>
                    </div>
                    {/* *********** */}
                </div>
                {/* *********** */}
            </div>
            {/* ************************************************************************ XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
            <div className="col-lg-4" >
                {/* *********** */}
                <div className="recommend_card_box   rounded-3xl shadow margin_lr ">
                    {/* *********** */}
                    <div className="card_box pe-">
                        <div className="card_box_img rounded-3xl  relative">
                            <img src={getAssetPath("/home/destination/recommendImg2.png")} className='rounded-3xl' alt="" />
                            {/* ********************* */}
                            <div className="rated_msg absolute top-5 flex  justify-between items-center left-5 right-5">
                                <div className="msg">
                                    <p className='m-0'>top rated</p>
                                </div>
                                <div className="msg_icon">
                                    <FaRegHeart />
                                </div>
                            </div>
                            {/* ********************* */}
                        </div>
                        {/* *** */}
                        <div className="card_box_detail px-4 py-5 rounded-4xl flex flex-col z-1 gap-4 relative">
                            <h4 className='m-0'>
                                Hyatt Regency Amritsar Hotel & Spa
                            </h4>
                            {/* ****** */}
                            <div className="time flex items-center gap-3 relative">
                                <div className="icon flex items-center gap-1">
                                    <span><IoTime /></span>
                                    <span><p className='m-0'>2 Days 3 Nights</p></span>
                                </div>
                                <div className="guest flex items-center gap-1">
                                    <span><FaUserAlt /></span>
                                    <span><p className='m-0'>4 -5 guest</p></span>
                                </div>
                            </div>
                            {/* ******* */}
                            <div className="price_book flex mt-3 justify-between items-center">
                                <h5 className='m-0'>
                                    $55.00 <span>/ person</span>
                                </h5>
                                <button className='rounded-full'>
                                    Book Now
                                </button>
                            </div>
                            {/* *************** rating_list */}
                            <div className="rating_list absolute flex items-center gap-1 right-10 shadow">
                                <span className='w-5'><FontAwesomeIcon icon={faStar} /></span>
                                <span><p className='m-0'>4.8</p></span>
                                <span><p className='m-0'>(22236 reviews)</p></span>
                            </div>

                        </div>
                    </div>
                    {/* *********** */}
                </div>
                {/* *********** */}
            </div>
        </>
    )
}
