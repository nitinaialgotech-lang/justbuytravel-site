"use client"
import { IconicPlaces, TouristAttraction, TouristAttractionApi } from "@/app/Route/endpoints";
import { getAssetPath, getPlacePhotoUrl } from "@/app/utils/assetPath";
import { getPlaceDetailPath } from "@/app/utils/seo";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

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

export default function Hotel_IconicPlaces() {
    /************ state start ******** */
    const [secondActive, setSecondActive] = useState(true);
    // ****************** state end *****
    const fallbackIconicCards = [
        {
            img: "/iconic/iconic.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
        },
        {
            img: "/iconic/iconic4.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
        },
        {
            img: "/iconic/iconic6.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
        },
        {
            img: "/iconic/iconic7.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
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
    // ****************************** apis 
    const { data: touristAttraction } = useQuery({
        queryKey: ["touristattraction"],
        queryFn: () => TouristAttractionApi(),
    });
    // Legacy API may return either a plain array or an object with `results`
    const raw = touristAttraction?.data;
    const rawAttractions = Array.isArray(raw?.results)
        ? raw.results
        : Array.isArray(raw)
            ? raw
            : [];
    const TouristAttraction = rawAttractions.length
        ? [...new Map(rawAttractions.map((item, i) => [item?.id ?? `iconic-${i}`, item])).values()]
        : [];

    return (
        <>
            <section className=" padding_bottom ">
                <div className="container ">
                    <div className="explore_section section_title ">
                        <h2 className="mb-0">Iconic Destinations Around the World</h2>
                        <p>Explore breathtaking locations rich in history, culture, and natural beauty.</p>
                    </div>
                    {/* *******************************************  show on deskltop >>>>>>>>>>>>>>>>>>>>>> */}

                    {/* ************************************************************  show on mobile  */}
                    <div className="container">
                        <div className="row  relative">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={15}
                                // pagination={{ clickable: true }}
                                navigation={{
                                    prevEl: "#experience_prev",
                                    nextEl: "#experience_next",
                                }}
                                loop={false}
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
                                {(TouristAttraction?.length
                                    ? TouristAttraction
                                    : fallbackIconicCards
                                ).map((item, i) => {
                                    const title =
                                        item?.name || item?.displayName?.text || item?.content || "Place";
                                    const placeId = item?.id;
                                    const imageSrc = getPlacePhotoUrl(item) || getAssetPath(item?.img || "/iconic/iconic1.webp");
                                    return (
                                        <SwiperSlide key={placeId || `iconic-${i}`}>
                                            <div className="experience_explore_section ">
                                                <div className="card  relative border-0 ">
                                                    <img
                                                        src={imageSrc}
                                                        className=" card_rounded "
                                                        alt={title}
                                                    />
                                                    {/* <div className="heart_icon absolute top-2 right-4">
                                                        <span>
                                                            <FaRegHeart />
                                                        </span>
                                                    </div> */}
                                                    <div className="card-body ps-0 flex justify-between ">
                                                        <div className="card_detail hotel_card_detail">
                                                            <h5 className="card-title m-0">{title}</h5>
                                                            {/* <p className="m-0">{item?.address}</p> */}
                                                            {placeId && (
                                                                <div className="mt-2">
                                                                    <Link
                                                                        href={getPlaceDetailPath('attraction', title, placeId)}
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
            </section>

        </>
    )
}
