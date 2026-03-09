'use client';
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { FaCircleArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { getAssetPath } from '../../../app/utils/assetPath';

const card = [
    { name: "food", img: "/home/destination/food.webp" },
    { name: "outdoors", img: "/home/destination/outdoor.webp" },
    { name: "culture", img: "/home/destination/culture.webp" },
    { name: "water", img: "/home/destination/water.jpg" }
]
// ****************

export default function DestinationSection() {
    const [isDestinationActive, setDestinationActive] = useState(true);
    const [Recomandcurrent, SetNearCurrent] = useState(0);
    return (
        <>
            <section className='destination_section padding_bottom '>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="destination_title section_title ">
                                <h2 className='mb-0'>
                                    Trending Destinations
                                </h2>
                                <p>
                                    Discover popular destinations and book hotels online at the best prices worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ************** */}
                <div className="container">
                    {/* ******************** */}
                    <div className="d-none d-lg-block">
                        <div className="row  relative ">
                            {
                                card?.map((item, k) => {
                                    return (
                                        <div className="col-12 col-lg-3 " key={k}>
                                            <div className="destination_box">
                                                <div className="destination_img  ">
                                                    <img src={getAssetPath(item?.img)} className='card_rounded' alt={`${item?.name || 'Destination'} travel destination image`} />
                                                    <div className="destination_name">
                                                        <h5>
                                                            {item?.name}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* ************************************************ onscroll the page scroller    */}
                    <div className='row relative'>
                        <div className="d-block d-lg-none  ">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={15}

                                navigation={{
                                    prevEl: "#destination_prev",
                                    nextEl: "#destination_next",
                                }}
                                loop={false}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                modules={[Pagination, Navigation]}
                                // onSwiper={(swiper) => setDestinationActive(swiper.isBeginning)}
                                onSwiper={(swiper) => SetNearCurrent(swiper.realIndex)}
                                onSlideChange={(swiper) => { setDestinationActive(swiper.isBeginning), SetNearCurrent(swiper.realIndex); }}

                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.5

                                    },
                                    375: {
                                        slidesPerView: 1.5

                                    },
                                    425: {
                                        slidesPerView: 1.5

                                    },

                                    640: {
                                        slidesPerView: 2.5
                                    },

                                    768: {
                                        slidesPerView: 2.5,
                                    },
                                    992: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                }}


                                className="mySwiper relative"
                            >
                                {
                                    card?.map((item, i) => {
                                        return (
                                            <>
                                                <SwiperSlide key={i}>
                                                    <div className="destination_box">
                                                        <div className="destination_img  ">
                                                            <img src={getAssetPath(item?.img)} className='card_rounded' alt={`${item?.name || 'Destination'} travel destination image`} />
                                                            <div className="destination_name">
                                                                <h5>
                                                                    {item?.name}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                                {/* ********************** */}
                                            </>
                                        )
                                    })
                                }
                            </Swiper>
                            <div className="button_swiper absolute ">
                                <div className="buttons_icon relative">
                                    <button id='destination_prev' className={`absolute ${Recomandcurrent === 0 ? 'd-none pointer-events-none' : ''}`}>
                                        <MdOutlineKeyboardArrowLeft size={30} />
                                    </button>
                                    <button id='destination_next' className='absolute'>
                                        <MdOutlineKeyboardArrowRight size={30} />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>








            </section >

        </>
    )
}
