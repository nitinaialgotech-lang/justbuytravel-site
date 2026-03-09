"use client"
import { IconicPlaces, searchTouristAttraction } from "@/app/Route/endpoints";
import { getAssetPath } from "@/app/utils/assetPath";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { createHotelSlug } from "@/app/utils/seo";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { FaRegHeart } from "react-icons/fa";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
// import required modules
import { Navigation, Pagination } from "swiper/modules";
/****************************** start function >>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

export default function AboutTrailer_photos() {
    /************ state start ******** */
    const [secondActive, setSecondActive] = useState(true);
    // ****************** state end *****
    const fallbackIconicCards = [
        {
            img: "/aboutus/publicphoto/p1.png"
        },
        {
            img: "/aboutus/publicphoto/p2.png"
        },
        {
            img: "/aboutus/publicphoto/p3.png"
        },
        {
            img: "/aboutus/publicphoto/p1.png"
        },
        {
            img: "/aboutus/publicphoto/p2.png"
        },
        {
            img: "/aboutus/publicphoto/p3.png"
        },
    ];
    /************************************ */
    const renderBootstrapStars = (rating) => {
        const stars = [];
        const value = Number(rating) || 0;
        const maxStars = 5;
        const fullStars = Math.floor(value);
        const hasHalfStar = value - fullStars >= 0.5;

        for (let i = 0; i < Math.min(fullStars, maxStars); i++) {
            stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
        }

        if (hasHalfStar && stars.length < maxStars) {
            stars.push(<i key="half" className="bi bi-star-half"></i>);
        }

        while (stars.length < maxStars) {
            stars.push(<i key={`empty-${stars.length}`} className="bi bi-star"></i>);
        }

        return stars;
    };
    // ************************************* iconic places apis 

    return (
        <>
            <section className="bg_grey padding_top padding_bottom ">

                <div className="container ">
                    <div className="row">
                        <div className="section_title">
                            <h2>
                                Trailers Photos
                            </h2>
                            <p>
                                Voices of satisfaction from our premium community.
                            </p>
                        </div>
                        <div className="col-lg-12 ">
                            <div className="container">
                                <div className="row relative">

                                    <Swiper
                                        slidesPerView={3}
                                        spaceBetween={15}
                                        // pagination={{ clickable: true }}
                                        navigation={{
                                            prevEl: "#experience_prev",
                                            nextEl: "#experience_next",
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
                                                slidesPerView: 3.5,
                                            },
                                            992: {
                                                slidesPerView: 3.5,
                                                spaceBetween: 24,
                                            },
                                            1024: {
                                                slidesPerView: 3.5,
                                                spaceBetween: 24,
                                            },

                                        }}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper relative"
                                    >
                                        {(fallbackIconicCards
                                        ).map((item, i) => {
                                            const title =
                                                item?.content || "Place";

                                            return (
                                                <SwiperSlide key={i}>
                                                    <div className="experience_explore_section experience_about_trailer ">
                                                        <div className="card  relative border-0 ">
                                                            <img
                                                                src={

                                                                    item?.img

                                                                }
                                                                className=" card_rounded "
                                                                alt={title}
                                                            />

                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                    <div className="button_swiper2 absolute about_experience_button ">
                                        <div className="buttons_icon relative">
                                            <button
                                                id="experience_prev"
                                                aria-label="Previous"
                                                className={`absolute ${secondActive ? "d-none pointer-events-none" : ""
                                                    }`}
                                            >
                                                <MdOutlineKeyboardArrowLeft size={30} />
                                            </button>

                                            <button
                                                id="experience_next"
                                                aria-label="Next"
                                                className="absolute"
                                            >
                                                <MdOutlineKeyboardArrowRight size={30} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  </div>

            </section>


        </>
    )
}
