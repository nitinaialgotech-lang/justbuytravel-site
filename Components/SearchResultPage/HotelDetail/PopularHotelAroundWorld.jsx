
"use client"
import React from 'react'
import { useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import { nearbyPlaces, TopHotelAroundWorld } from "@/app/Route/endpoints";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { useRouter } from 'next/navigation';
import { createHotelSlug } from "@/app/utils/seo";
import { getPlacePhotoUrl } from "@/app/utils/assetPath";

import { renderBootstrapStars } from '@/component/renderBootstrapStars';


export default function PopularHotelAroundWorld({ lat, long }) {
    /************************* ustate contetn *** */
    const [Active, setActive] = useState(true);
    const router = useRouter();
    const viewDetail = (id, name) => {
        if (!id) return;
        const slug = createHotelSlug(name, id);
        router.push(`/${slug}`);
    };
    /*********************** end stte ****** */
    /********************* apis calls *********** */
    // const lat = 44.500000;
    // const long = -89.500000;

    const { data: nearbyPlacesData, isLoading, isError } = useQuery({
        queryKey: ["lodgingnearby", lat, long],
        queryFn: () => nearbyPlaces(lat, long),
        enabled: lat != null && long != null,
    });
    const nearbyPlace = nearbyPlacesData?.data?.places || [];

    // Fallback: when nearby search fails or returns no places, use global top hotels
    const { data: topData, isLoading: isTopLoading } = useQuery({
        queryKey: ["tophotels-global"],
        queryFn: () => TopHotelAroundWorld(),
        enabled: !lat || !long || isError || nearbyPlace.length === 0,
    });

    const topHotels = topData?.data?.results || [];
    const hotelsToShow = nearbyPlace.length ? nearbyPlace : topHotels;
    const loading = isLoading || (!nearbyPlace.length && isTopLoading);

    /***************** end of api calls ************* */

    /************************ shimmer effetct *****************/
    const ShimmerCard = () => {
        return (
            <div className="card_col">
                <div className="recommend_card_box card_rounded recomand_card_shadow margin_lr">
                    <div className="card_box">
                        {/* IMAGE */}
                        <div
                            className="card_box_img card_rounded relative overflow-hidden shimmer-bg shimmer-min-250"
                        />

                        {/* DETAILS */}
                        <div className="card_box_detail card_rounded relative">
                            {/* TITLE */}
                            <div className="shimmer-bg shimmer-rounded shimmer-75x18" />

                            {/* SPACING */}
                            <div className="shimmer-spacer-10" />

                            {/* RATING + BUTTON */}
                            <div className="price_book flex justify-between items-center">
                                {/* RATING */}
                                <div className="flex gap-1 items-center">
                                    <div className="shimmer-bg shimmer-rounded shimmer-60x14" />
                                    <div className="shimmer-bg shimmer-rounded shimmer-40x14" />
                                </div>

                                {/* BUTTON */}
                                <div className="shimmer-bg shimmer-rounded shimmer-90x28" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <>
            <section className="recomend_section container  padding_bottom">
                <div className="section_title relative ">
                    <h2 className="mb-0">Popular Hotels Near You</h2>
                    <p>Voices of satisfaction from our premium community</p>
                    <div className="title_icon absolute right-5   ">
                        {/* <img src={getAssetPath("/home/destination/icon_plane.png")} alt="Travel plane icon" /> */}
                    </div>
                </div>
                {/* **************************** recomend carsd cord box */}
                <div className="container">
                    <div className="row relative">
                        <Swiper
                            slidesPerView={4}
                            spaceBetween={5}
                            navigation={{
                                prevEl: "#recomand_prev",
                                nextEl: "#recomand_next",
                            }}
                            // pagination={{
                            //     clickable: true,
                            // }}
                            modules={[Navigation, Autoplay, Pagination]}
                            className="mySwiper"
                            // navigation={true}
                            onSwiper={(swiper) => setActive(swiper.isBeginning)}
                            onSlideChange={(swiper) => setActive(swiper.isBeginning)}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
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
                            loop={!loading}
                            id="swiper_sldie"
                        >
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <SwiperSlide key={`shimmer-${i}`}>
                                        <ShimmerCard />
                                    </SwiperSlide>
                                ))
                                : hotelsToShow.map((item, i) => {
                                    const name = item?.displayName?.text ?? item?.name ?? '';
                                    const id = item?.id;
                                    const imageSrc = getPlacePhotoUrl(item);
                                    const truncateText = (text, maxLength = 20) => {
                                        if (!text) return "";
                                        return text.length > maxLength
                                            ? text.slice(0, maxLength) + "..."
                                            : text;
                                    };
                                    return (
                                        <>
                                            <SwiperSlide key={i}>
                                                <div className="card_col">
                                                    <div
                                                        className="recommend_card_box   card_rounded  recomand_card_shadow cursor-pointer 
                                                        "
                                                        onClick={() => viewDetail(id, name)}
                                                    >
                                                        <div className="card_box pe-">
                                                            <div className="card_box_img card_rounded relative overflow-hidden card-img-250">
                                                                <img
                                                                    src={imageSrc}
                                                                    className="card_rounded w-full h-full object-cover"
                                                                    alt={"Hotel image"}
                                                                />
                                                            </div>
                                                            {/* *** */}
                                                            <div className="card_box_detail card_rounded flex flex-col z-1  relative">
                                                                <h4 className="m-0 capitalize">
                                                                    {name || item?.displayName?.text}
                                                                </h4>
                                                                {/* ****** */}

                                                                {/* ****************** */}

                                                                {/* ******* */}
                                                                <div className="price_book flex justify-between items-center">
                                                                    <div className="rating flex align-items-center gap-1">
                                                                        {renderBootstrapStars(item?.rating)}
                                                                        <span className="ms-1">
                                                                            {item?.rating} ({item?.userRatingCount})
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        className="button_bg2 rounded-full bg-color-green color_bl recomend_btn"
                                                                        onClick={(e) => { e.stopPropagation(); viewDetail(id, name); }}
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                                {/* *************** rating_list */}
                                                            </div>
                                                        </div>
                                                        {/* *********** */}
                                                    </div>
                                                    {/* *********** */}
                                                </div>
                                            </SwiperSlide>
                                        </>
                                    );
                                })}
                        </Swiper>
                        {/*xxxxxxxx */}
                        <div className="button_swiper2 absolute ">
                            <div className="buttons_icon relative">
                                <button
                                    id="recomand_prev"
                                    aria-label="Previous"
                                    className={`absolute ${Active ? "d-none pointer-events-none" : ""
                                        }`}
                                >
                                    <MdOutlineKeyboardArrowLeft size={30} />
                                </button>

                                <button
                                    id="recomand_next"
                                    aria-label="Next"
                                    className="absolute"
                                >
                                    <MdOutlineKeyboardArrowRight size={30} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
