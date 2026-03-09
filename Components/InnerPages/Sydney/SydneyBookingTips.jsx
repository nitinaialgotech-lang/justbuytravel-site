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

export default function SydneyBookingTips() {
    const [secondActive, setSecondActive] = useState(true);
    const card = [
        {
            img: "/innerpages/sydney/sd4.webp"
        },
        {
            img: "/innerpages/sydney/sd1.webp"
        },
        {
            img: "/innerpages/sydney/sd2.webp"
        },
        {
            img: "/innerpages/sydney/sd3.webp"
        },
    ]
    return (
        <>   <section className='hotel_booking_tips_section padding_bottom padding_top bg_grey'>
            <div className="container">
                <div className="row items-center">
                    {/* ******  image */}
                    <div className="col-lg-6">
                        <div className="container d-none d-lg-block">


                            <div className="row ">
                                <div className="col-lg-6">
                                    <div className="hotel_tips_img">
                                        <img src={getAssetPath("/innerpages/sydney/sd4.webp")} alt="" />
                                    </div>

                                </div>
                                <div className="col-lg-6">
                                    <div className="hotel_tips_img">
                                        <img src={getAssetPath("/innerpages/sydney/sd1.webp")} alt="" />
                                    </div>
                                </div>
                                <div className="col-lg-6  mt-4">
                                    <div className="hotel_tips_img">
                                        <img src={getAssetPath("/innerpages/sydney/sd2.webp")} alt="" />
                                    </div>
                                </div>
                                <div className="col-lg-6 mt-4 ">
                                    <div className="hotel_tips_img">
                                        <img src={getAssetPath("/innerpages/sydney/sd3.webp")} alt="" />
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
                                    Where to Stay in Sydney Top-Rated Hotels & Best Areas for Every Traveler
                                </h2>
                            </div>

                        </div>
                    </div>
                    {/* ********************* content >>>>>>>>>>> */}
                    <div className="col-lg-12">
                        <div className="hotel_tips_content">
                            <p>
                                re you planning a trip to<span className='g_color font-semibold'> Sydney and wondering where to stay?</span> Don’t worry finding a good hotel here is easier than you think. Whether you like the busy city life or peaceful areas outside the city, Sydney has something for everyone.

                            </p>
                            <p>
                                If you want to stay near tourist<span className='g_color font-semibold'>  places, restaurants</span>  and shopping, then the city centre is a great choice. Places like Darling Harbour and Circular Quay are popular and full of life. But if you like quiet and relaxed places, then areas like Parramatta, Newtown, or the Northern Beaches are also great and a bit more peaceful.
                            </p>
                            <p>
                                Even if you’re booking at the last minute,<span className='g_color font-semibold'> you can still find nice hotels in Sydney.</span> Many hotels give seasonal offers or include extra things like free breakfast or city tours. So it’s not just about booking a room  it’s about enjoying your stay.
                            </p>
                            <p>
                                When choosing your hotel, think about location, comfort, and what you want nearby. Do you need transport access? Are you travelling with family or solo? These things matter more than just the price.
                            </p>
                            <p>
                                <span className='g_color font-semibold'>We make it easy for you to find hotels that are trusted, clean, and in good locations without stress. </span>Whether you’re planning ahead or booking on the go, you can find a stay that feels right for you.
                            </p>
                            <p>
                                So take your time, explore your options, and enjoy your Sydney trip with a stay that’s simple, safe, and suits your style.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </section></>
    )
}
