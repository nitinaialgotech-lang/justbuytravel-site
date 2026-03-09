"use client"
import { IconicPlaces, searchTouristAttraction } from "@/app/Route/endpoints";
import { getAssetPath } from "@/app/utils/assetPath";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlaceDetailPath } from "@/app/utils/seo";

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
import CardShimmerEffect from "@/component/CardShimmerEffect";
/****************************** start function >>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

export default function CapTownIconincs() {
    const router = useRouter();
    /************ state start ******** */
    const [secondActive, setSecondActive] = useState(true);
    // ****************** state end *****

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
    const { data: iconicPlacesData, isLoading } = useQuery({
        queryKey: ["iconicPlacesNearby", "cape town"],
        queryFn: () => searchTouristAttraction("cape town")
    });
    const iconicPlacesList = iconicPlacesData?.data?.places ?? [];

    return (
        <>
            <section>
                <div className="container padding_bottom">
                    <div className="explore_section section_title ">
                        <h2 className="mb-0">Iconic Places</h2>
                        <p>Where history, culture, and beauty come together</p>
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
                                {isLoading || iconicPlacesData?.lenght
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <SwiperSlide key={`shimmer-${i}`}>
                                            <CardShimmerEffect />
                                        </SwiperSlide>)) : iconicPlacesList?.map((item, i) => {
                                            const title =
                                                item?.displayName?.text || item?.content || "Place";
                                            const imgName = item?.photos?.[0]?.name;
                                            const placeId = item?.id;
                                            const slug = placeId ? getPlaceDetailPath('attraction', title, placeId) : '#';
                                            return (
                                                <SwiperSlide key={i}>
                                                    <div className="experience_explore_section ">
                                                        <div
                                                            className="card relative border-0 cursor-pointer"
                                                            onClick={() => slug !== '#' && router.push(slug)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => { if (e.key === 'Enter' && slug !== '#') router.push(slug); }}
                                                        >
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
                                                                <div className="card_detail">
                                                                    <h5 className="card-title m-0">{title}</h5>
                                                                    <div className="rating flex align-items-center gap-1">
                                                                        {item?.rating
                                                                            ? renderBootstrapStars(item?.rating)
                                                                            : renderBootstrapStars(4)}
                                                                        {item?.rating && (
                                                                            <span className="ms-1">{item?.rating}</span>
                                                                        )}
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
