"use client"
import React from 'react'
import { getAssetPath } from "@/app/utils/assetPath";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
export default function SaudiBookingTips() {

    const [secondActive, setSecondActive] = useState(true);
    const card = [
        {
            img: "/innerpages/saudi/saud4.jpg"
        },
        {
            img: "/innerpages/saudi/saud1.jpg"
        },
        {
            img: "/innerpages/saudi/saud2.jpg"
        },
        {
            img: "/innerpages/saudi/saud3.jpg"
        },
    ]
    return (
        <>
            <section className='hotel_booking_tips_section padding_bottom padding_top bg_grey'>
                <div className="container">
                    <div className="row items-center">
                        {/* ******  image */}
                        <div className="col-lg-6">
                            <div className="container d-none d-lg-block">


                                <div className="row ">
                                    <div className="col-lg-6">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/saudi/saud4.jpg")} alt="" />
                                        </div>

                                    </div>
                                    <div className="col-lg-6">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/saudi/saud1.jpg")} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6  mt-4">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/saudi/saud2.jpg")} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mt-4 ">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/saudi/saud3.jpg")} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* **************** on mobile view show  */}
                            <div className="container">

                                <div className="row d-block d-lg-none relative">
                                    <Swiper
                                        slidesPerView={3}
                                        spaceBetween={15}
                                        // pagination={{ clickable: true }}
                                        navigation={{
                                            prevEl: "#booking_tips_prev",
                                            nextEl: "#booking_tips_next",
                                        }}
                                        loop={true}
                                        // autoplay={{
                                        //     delay: 3000,
                                        //     disableOnInteraction: false,
                                        // }}
                                        onSwiper={(swiper) => setSecondActive(swiper.isBeginning)}
                                        onSlideChange={(swiper) => setSecondActive(swiper.isBeginning)}
                                        breakpoints={{
                                            320: {
                                                slidesPerView: 1.5,
                                            },
                                            375: {
                                                slidesPerView: 1.5,
                                            },
                                            425: {
                                                slidesPerView: 1.5,
                                            },

                                            768: {
                                                slidesPerView: 1,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                                spaceBetween: 24,
                                            },
                                        }}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper relative"
                                    >
                                        {
                                            card?.map((item, i) => {
                                                return (
                                                    <>

                                                        <SwiperSlide key={i}>

                                                            <div className="col-lg-6">
                                                                <div className="hotel_tips_img">
                                                                    <img src={getAssetPath(item?.img)} alt="" />
                                                                </div>

                                                            </div>
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }
                                    </Swiper>
                                    <div className="button_swiper2 button_swiper_3 absolute ">
                                        <div className="buttons_icon relative">
                                            <button
                                                id="booking_tips_prev"
                                                aria-label="Previous"
                                                className={`absolute ${secondActive ? "d-none pointer-events-none" : ""
                                                    }`}
                                            >
                                                <MdOutlineKeyboardArrowLeft size={30} />
                                            </button>

                                            <button
                                                id="booking_tips_next"
                                                aria-label="Next"
                                                className="absolute"
                                            >
                                                <MdOutlineKeyboardArrowRight size={30} />
                                            </button>
                                        </div>
                                    </div>
                                    {/* ******** end ..... */}

                                </div>
                            </div>

                        </div>
                        {/* ************ title */}
                        <div className="col-lg-6 ">
                            <div className="hotel_tips_title">
                                <div className="tips_title">
                                    <h2>
                                        Fly Smart- Know the Time & Price Before You Go
                                    </h2>
                                </div>

                            </div>
                        </div>
                        {/* ********************* content >>>>>>>>>>> */}
                        <div className="col-lg-12">
                            <div className="hotel_tips_content">
                                <p>
                                    When travelling from <span className='g_color font-semibold'>Saudi Arabia to India,</span> it’s important to plan ahead of time and compare flight times and prices. Find out everything before you book!
                                </p>
                                <p>
                                    There is a two hours and thirty minutes of <span className='g_color font-semibold'>time difference between India and Saudi Arabia.</span>  So be smart about when you arrive and when you leave.
                                </p>
                                <p>
                                    Depending on your starting place and company, the typical<span className='g_color font-semibold'>Saudi to India flight time</span>  is between 4 and 5 hours.
                                </p>
                                <p>
                                    Want to travel on a budget? With JustBuyTravel, you can get the lowest<span className='g_color font-semibold'> Saudi Arabia to India flight ticket price </span>in just a few clicks.
                                </p>
                                <p>Our search tool is flexible, so you can find the best flight for your needs and price.</p>
                                <p>
                                    Check prices now and make smart plans with JustBuyTravel
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )


}
