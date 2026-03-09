"use client"
import { IconicPlaces, TouristAttraction, TouristAttractionApi } from "@/app/Route/endpoints";
import { getAssetPath } from "@/app/utils/assetPath";
import { getPlaceDetailPath } from "@/app/utils/seo";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// import Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { FaRegHeart } from "react-icons/fa";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
// import required modules
import { Navigation, Pagination } from "swiper/modules";
import CardShimmerEffect from "@/component/CardShimmerEffect";
/****************************** start function >>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

export default function Outdoor_Attraction_Section() {
    /************ state start ******** */
    const [secondActive, setSecondActive] = useState(true);
    // ****************** state end *****

    /************************************ */

    // ****************************** apis 
    const { data: touristAttraction, isLoading } = useQuery({
        queryKey: ["touristattraction"],
        queryFn: () => TouristAttractionApi()
    })
    const rawAttractions = touristAttraction?.data;
    const TouristAttraction = rawAttractions?.length
        ? [...new Map((rawAttractions || []).map((item, i) => [item?.id ?? `iconic-${i}`, item])).values()]
        : rawAttractions;


    return (
        <>
            {/* ******************** section start ********************** */}
            <section className=" padding_bottom ">
                <div className="container ">
                    <div className="explore_section section_title ">
                        <h2 className="mb-0">Recommended Outdoor Spots for You</h2>
                        <p>Handpicked open-air locations and scenic areas to enjoy nature and fresh air</p>
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
                                {isLoading
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <SwiperSlide key={`shimmer-${i}`}>
                                            <CardShimmerEffect />
                                        </SwiperSlide>)) : rawAttractions?.map((item, i) => {
                                            const title =
                                                item?.name || item?.displayName?.text || item?.content || "Place";
                                            const imgName = item?.photos?.[0]?.name;
                                            const placeId = item?.id;
                                            return (
                                                <SwiperSlide key={placeId || `iconic-${i}`}>
                                                    <div className="experience_explore_section ">
                                                        <div className="card  relative border-0 ">
                                                            <img
                                                                src={
                                                                    imgName
                                                                        ? `https://justbuygear.com/justbuytravel-api/get-photo.php?name=${imgName}`
                                                                        : getAssetPath(item?.img || "/no-image.jpg")
                                                                }
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
