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
export default function BaliBookingTips() {
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
            <section className='hotel_booking_tips_section padding_bottom padding_top bg_grey'>
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
                                        Choosing the best budget hotels in Australia for a Comfortable Stay
                                    </h2>
                                </div>

                            </div>
                        </div>
                        {/* ********************* content >>>>>>>>>>> */}
                        <div className="col-lg-12">
                            <div className="hotel_tips_content">
                                <p>
                                    Australia offers many hotel options that suit different travel needs, budgets, and locations. From busy city centers to quiet coastal towns, travelers can find  hotels in Australia that fit their plans with ease. Whether visiting for work, leisure, or a family holiday, choosing the right stay creates a smoother experience.
                                </p>
                                <p>
                                    Many travelers search for the best budget hotels in Australia  to balance comfort and cost. These hotels often provide clean rooms, helpful service, and easy access to transport and local attractions. They work well for short trips, longer stays, and value-focused travelers.
                                </p>
                                <p>
                                    Those seeking higher comfort can explore the top hotels in Australia  with modern facilities and quality service.Booking hotels in Australia online makes it easy to compare prices and guest reviews. When travelers reserve hotels online, they can choose confidently and avoid surprises.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}
