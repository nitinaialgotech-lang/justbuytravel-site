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
export default function GuidePackage() {
    const [secondActive, setSecondActive] = useState(true);
    const card = [
        {
            img: "/innerpages/canada/cn4.webp"
        },
        {
            img: "/innerpages/canada/cn1.webp"
        },
        {
            img: "/innerpages/canada/cn2.webp"
        },
        {
            img: "/innerpages/canada/cn3.webp"
        },
    ]
    return (
        <>
            <section className='hotel_booking_tips_section padding_bottom padding_top '>
                <div className="container">
                    <div className="row items-center">
                        {/* ******  image */}
                        <div className="col-lg-6">
                            <div className="container d-none d-lg-block">


                                <div className="row ">
                                    <div className="col-lg-6">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/canada/cn4.webp")} alt="" />
                                        </div>

                                    </div>
                                    <div className="col-lg-6">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/canada/cn1.webp")} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6  mt-4">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/canada/cn2.webp")} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mt-4 ">
                                        <div className="hotel_tips_img">
                                            <img src={getAssetPath("/innerpages/canada/cn3.webp")} alt="" />
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
                                            640: {
                                                slidesPerView: 1.5
                                            },

                                            768: {
                                                slidesPerView: 2.5,
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
                                        We guide you with trust, helping you find what’s truly best for you.
                                    </h2>
                                </div>

                            </div>
                        </div>
                        {/* ********************* content >>>>>>>>>>> */}
                        <div className="col-lg-12">
                            <div className="hotel_tips_content">

                                <p>
                                    <span className='g_color font-semibold'>Personalized Recommendations</span>
                                    <br></br>
                                    Get personalised hotel recommendations based on your preferences, budget, and previous journeys, making it simple to find hotels online that actually suit you.
                                </p>
                                <p>
                                    <span className='g_color font-semibold'>Easy Booking Experience</span>
                                    <br></br>
                                    Enjoy fast, safe reservations with rapid confirmation – no hassles, just easy vacation planning.
                                </p>
                                <p>
                                    <span className='g_color font-semibold'>Best Price Guarantee</span>
                                    <br></br>
                                    We provide exceptional discounts on luxury stays, assuring the best hotel deals worldwide at the lowest costs.
                                </p>
                                <p>
                                    <span className='g_color font-semibold'>Trusted by Thousands</span>
                                    <br></br>
                                    Many tourists trust our expert picks and exclusive access to the best hotel booking site for value and service.
                                </p>
                                <p>
                                    <span className='g_color font-semibold'>Easily compare hotel prices</span>
                                    <br></br>
                                    Easily compare hotel prices from 100+ sites and take advantage of exclusive online hotel deals.
                                </p>



                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
