
"use client"
import React from 'react'
import { NearbyRestaurant, Restro } from "@/app/Route/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlaceDetailPath, getPlaceTypeFromTypes } from "@/app/utils/seo";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Navigation, Pagination } from "swiper/modules";
/******************* stqart function */

export default function NearByPlacesInNewYork() {
    /********************* states *************** */
    const router = useRouter();
    const [isBeginning, setIsBeginning] = useState(true);
    /* ********************************* */
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
    /********************************************  */
    const { data: nearbyRestaurantsData } = useQuery({
        queryKey: ["restaurantsNearby", "New York"],
        queryFn: () => NearbyRestaurant("New York"),
    });
    const nearbyPlaceslist = nearbyRestaurantsData?.data?.places ?? [];
    return (
        <>
            <section className="experience_explore_section padding_bottom">
                <div className="container">
                    <div className="row">
                        <div className="explore_section section_title m">
                            <h2 className="mb-0">Local Places Around Your Stay</h2>
                            <p>Check local dining spots and visitor attractions around your hotel for simple access during your stay in the area.
                            </p>
                        </div>
                    </div>

                    {/*8888888888888888888888888888888888888888888888888888888888888888888888888xxxxxxxx======================************************************************** mobile view display
           */}
                    <div className="container relative">
                        <div className="row ">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={15}
                                // pagination={{ clickable: true }}
                                navigation={{
                                    prevEl: "#custom_prev",
                                    nextEl: "#custom_next",
                                }}
                                loop={false}
                                // autoplay={{
                                //     delay: 3100,
                                //     disableOnInteraction: false,
                                // }}
                                modules={[Pagination, Navigation]}
                                onSwiper={(swiper) => setIsBeginning(swiper.isBeginning)}
                                onSlideChange={(swiper) => setIsBeginning(swiper.isBeginning)}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    375: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    425: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    640: {
                                        slidesPerView: 1, // mobile
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2, // tablet
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 4, // desktop (optional)
                                        spaceBetween: 20,
                                    },
                                }}
                                className="mySwiper relative"
                            >
                                {nearbyPlaceslist?.map((item, i) => {
                                    const placeId = item?.id;
                                    const title = item?.displayName?.text || item?.displayName || "Place";
                                    const placeType = getPlaceTypeFromTypes(item?.types) || 'restaurant';
                                    const slug = placeId ? getPlaceDetailPath(placeType, title, placeId) : '#';
                                    return (
                                        <SwiperSlide key={i}>
                                            <div className="experience_explore_section">
                                                <div
                                                    className="card relative border-0 cursor-pointer"
                                                    onClick={() => slug !== '#' && router.push(slug)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' && slug !== '#') router.push(slug); }}
                                                >
                                                    <img
                                                        src={
                                                            item?.photos?.[0]?.name
                                                                ? `/api/get-photo?name=${encodeURIComponent(item.photos[0].name)}&maxWidthPx=300`
                                                                : "/no-image.jpg"
                                                        }
                                                        className="card-img-top card_rounded"
                                                        alt="Place"
                                                    />
                                                    <div className="card-body ps-0 flex justify-between">
                                                        <div className="card_detail">
                                                            <h5 className="card-title m-0">
                                                                {title}
                                                            </h5>
                                                            <div className="rating flex align-items-center gap-1">
                                                                {renderBootstrapStars(item?.rating)}
                                                                <span className="ms-1">{item?.rating}</span>
                                                            </div>
                                                            {placeId && (
                                                                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                                                                    <Link
                                                                        href={slug}
                                                                        className="button_bg2 rounded-full bg-color-green color_bl recomend_btn"
                                                                    >
                                                                        View Details
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className="button_swiper2 absolute ">
                                <div className="buttons_icon relative">
                                    <button
                                        id="custom_prev"
                                        aria-label="Previous"
                                        className={`absolute ${isBeginning ? "d-none pointer-events-none" : ""
                                            }`}
                                    >
                                        <MdOutlineKeyboardArrowLeft size={30} />
                                    </button>

                                    <button
                                        id="custom_next"
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
            </section>

        </>
    )
}
