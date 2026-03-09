"use client"
import { TopHotelAroundWorld } from '@/app/Route/endpoints'
import { getAssetPath } from "@/app/utils/assetPath";
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import "swiper/css/pagination";
export default function Find_CruisesSection() {
    const [Active, setActive] = useState(true);
    const image = [
        {
            img: "/cruise/cruise1.webp",
            name: "australia"
        },
        {
            img: "/cruise/cruise2.webp",
            name: "Croatia"
        },
        {
            img: "/cruise/cruise3.webp",
            name: "Montenegro"
        },
        {
            img: "/cruise/cruise4.webp",
            name: "Great Britain"
        },
        {
            img: "/cruise/cruise5.jpg",
            name: "Hvar Croatia"
        },
        {
            img: "/cruise/cruide6.jpg",
            name: "dubai"
        },
    ]
    return (
        <>
            <section className='find_cruisessection padding_bottom'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="explore_section section_title ">
                                <h2 className="mb-0">Find Cruises by Region</h2>
                                <h5>Let our experts guide you every step of the way in booking the perfect Cruise!</h5>
                            </div>
                        </div>
                    </div>
                    {/* ************************ */}
                    <div className=" relative">
                        <Swiper
                            slidesPerView={4}
                            spaceBetween={5}
                            navigation={{
                                prevEl: "#recomand_prev1",
                                nextEl: "#recomand_next1",
                            }}
                            // pagination={{
                            //     clickable: true,
                            // }}
                            modules={[Navigation, Pagination]}
                            className="mySwiper"
                            // navigation={true}
                            onSwiper={(swiper) => setActive(swiper.isBeginning)}
                            onSlideChange={(swiper) => setActive(swiper.isBeginning)}
                            // autoplay={{
                            //     delay: 3000,
                            //     disableOnInteraction: false,
                            // }}
                            loop={false}
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

                            id="swiper_sldie"
                        >

                            {image?.map((item, idx) => (
                                <SwiperSlide key={`${item?.name ?? "region"}-${idx}`}>
                                    <div className="card_col">
                                        <div
                                            className="recommend_card_box   card_rounded  recomand_card_shadow  book_cruise_card 
                                                        "
                                        >
                                            <div className="card_box pe-">
                                                <div className="card_box_img card_rounded relative overflow-hidden card-img-250">
                                                    <img
                                                        src={getAssetPath(item?.img)}
                                                        className="card_rounded w-full h-full object-cover"
                                                        alt={"Hotel image"}
                                                    />
                                                </div>
                                                {/* *** */}
                                                <div className="card_box_detail flex flex-col z-1 find_cruise_detail  relative">
                                                    <h4 className="m-0 capitalize">
                                                        {item?.name}
                                                    </h4>
                                                    {/* ****** */}

                                                    {/* ****************** */}

                                                    {/* ******* */}


                                                    {/* *************** rating_list */}
                                                </div>
                                            </div>
                                            {/* *********** */}
                                        </div>
                                        {/* *********** */}
                                    </div>
                                </SwiperSlide>
                            ))}

                        </Swiper>
                        {/*xxxxxxxx */}
                        <div className="button_swiper absolute ">
                            <div className="buttons_icon relative">
                                <button
                                    id="recomand_prev1"
                                    aria-label="Previous"
                                    className={`absolute ${Active ? "d-none pointer-events-none" : ""
                                        }`}
                                >
                                    <MdOutlineKeyboardArrowLeft size={30} />
                                </button>

                                <button
                                    id="recomand_next1"
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
