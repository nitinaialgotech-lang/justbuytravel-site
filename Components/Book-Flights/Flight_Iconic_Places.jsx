"use client"
import Link from 'next/link'
import { getAssetPath } from "@/app/utils/assetPath";
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import 'swiper/css/pagination';
import Search_flight_section from './Search_flight_section';

export default function Flight_Iconic_Places() {
    const [iconicIsActive, setIconicActive] = useState(true);
    const card = [
        {
            title: "Overwater Villas in the Maldives: The Ultimate Hotels to Book in 2025		",
            img: "/flights/places/new/bankok.jpg"
        },
        {
            title: "Overwater Villas in the Maldives: The Ultimate Hotels to Book in 2025		",
            img: "/flights/places/new/kathmandu1.jpg"
        },
        {
            title: "Overwater Villas in the Maldives: The Ultimate Hotels to Book in 2025",
            img: "/flights/places/new/london.jpg"
        },
        {
            title: "Overwater Villas in the Maldives: The Ultimate Hotels to Book in 2025		",
            img: "/flights/places/new/melbourne.jpg"
        },
        {
            title: "Overwater Villas in the Maldives: The Ultimate Hotels to Book in 2025		",
            img: "/flights/places/new/sydney.jpg"
        },
        {
            title: "Overwater Villas in the Maldives: The Ultimate Hotels to Book in 2025		",
            img: "/flights/places/new/tornto1.jpg"
        },
    ]

    return (
        <>
            <section className='flight_iconic_places padding_bottom bg_grey padding_top'>
                <div className="container">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="iconic_place_title">
                                <div className="section_title">
                                    <h2 className='m-0'>
                                        Iconic Places You need to see
                                    </h2>
                                </div>
                            </div>

                            <div className="iconic_place_items">
                                <div className="container d-none d-lg-block">
                                    <div className="row relative">
                                        {
                                            card?.map((item, i) => {
                                                return (


                                                    <div className="col-lg-3" key={i}>
                                                        <div className="iconic_place_card relative">
                                                            <div className="iconic_img">
                                                                <img src={getAssetPath(item?.img)} alt="" />
                                                            </div>
                                                            <div className="content absolute">
                                                                <p className='m-0'>
                                                                    {item?.title}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* ********************************* */}


                                                    </div>


                                                )
                                            })
                                        }


                                        {/* ******************************************** */}
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>


                {/* *************************************************** container for nmobilw view  */}
                <div className="container  d-block d-lg-none">
                    <div className="row ">
                        <div className="col-lg-12 relative">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={15}

                                navigation={{
                                    prevEl: "#iconic_place_prev",
                                    nextEl: "#iconic_place_next",
                                }}
                                loop={true}
                                autoplay={{
                                    delay: 3200,
                                    disableOnInteraction: false,
                                }}

                                // onSwiper={(swiper) => setIconicActive(swiper.isBeginning)}
                                // onSlideChange={(swiper) => setIconicActive(swiper.isBeginning)}
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

                                            <SwiperSlide key={i}>
                                                <div className="col-lg-3">
                                                    <div className="iconic_place_card relative">
                                                        <div className="iconic_img">
                                                            <img src={getAssetPath(item?.img)} alt="" />
                                                        </div>
                                                        <div className="content absolute">
                                                            <p className='m-0'>
                                                                {item?.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* ********************************* */}
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                            {/* <div className="button_swiper absolute" id='button_swiper'>
                                <div className="buttons_icon relative">
                                    {
                                        !iconicIsActive && (

                                            <button id='iconic_place_prev' className='absolute'>
                                                <MdOutlineKeyboardArrowLeft size={30} />
                                            </button>
                                        )
                                    }


                                    <button id='iconic_place_next' className='absolute'>
                                        <MdOutlineKeyboardArrowRight size={30} />
                                    </button>
                                </div>
                            </div> */}

                        </div>
                    </div>


                </div>


            </section>
        </>
    )
}
