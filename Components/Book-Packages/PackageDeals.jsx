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
import { GiSchoolBag } from "react-icons/gi";
export default function PackageDeals() {
    const [Active, setActive] = useState(true);
    const image = [
        {
            img: "/package/package1.webp",
            name: "australia"
        },
        {
            img: "/package/package2.avif",
            name: "Croatia"
        },
        {
            img: "/package/package3.avif",
            name: "Montenegro"
        },
        {
            img: "/package/package4.avif",
            name: "Great Britain"
        },

    ]
    return (
        <>
            <section className='package_section padding_bottom padding_top bg_grey'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="explore_section section_title ">
                                <h2 className="mb-0">Package deals: Save 25% or more</h2>
                                {/* <h5>Let our experts guide you every step of the way in booking the perfect Cruise!</h5> */}
                            </div>
                        </div>

                        <div className=" relative">
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
                                modules={[Navigation, Pagination]}
                                className="mySwiper"
                                // navigation={true}
                                onSwiper={(swiper) => setActive(swiper.isBeginning)}
                                onSlideChange={(swiper) => setActive(swiper.isBeginning)}
                                // autoplay={{
                                //     delay: 3000,
                                //     disableOnInteraction: false,
                                // }}
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
                                        slidesPerView: 1.5
                                    },

                                    768: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 4, // desktop (optional)
                                        spaceBetween: 20,
                                    },
                                }}

                                id="swiper_sldie"
                            >

                                {image?.map((item, idx) => (
                                    <SwiperSlide key={`${item?.name ?? "package"}-${idx}`}>
                                        <div className="card_col">
                                            <div
                                                className="recommend_card_box package_card_box  card_rounded    
                                                        "
                                            >
                                                <div className="card_box ">
                                                    <div className="card_box_img card_rounded relative overflow-hidden card-img-250">
                                                        <img
                                                            src={getAssetPath(item?.img)}
                                                            className="card_rounded w-full h-full object-cover"
                                                            alt={"Hotel image"}
                                                        />
                                                    </div>
                                                    {/* *** */}
                                                    <div className="card_box_detail  card_rounded package_deals_card flex flex-col z-1   relative">
                                                        <h4 className="m-0 capitalize">
                                                            Noah Private Beach House + Flight
                                                        </h4>
                                                        <p className='m-0'>
                                                            Himmafushi
                                                        </p>
                                                        <div className="package_detail">
                                                            <ul className='p-0 m-0'>
                                                                {/* ************* */}
                                                                <li>

                                                                    <span>
                                                                        <img
                                                                            className="icon_link"
                                                                            src={getAssetPath("/header_icon/icon_hotel.webp")}
                                                                            alt=""
                                                                        />
                                                                    </span>

                                                                    <span>
                                                                        <p className='m-0'> 4.5 stars - 9.6/10 Exceptional (5)</p>
                                                                    </span>
                                                                </li>
                                                                {/* ************* */}
                                                                <li>

                                                                    <span>
                                                                        <img
                                                                            className="icon_link"
                                                                            src={getAssetPath("/header_icon/icon_flight.webp")}
                                                                            alt=""
                                                                        />
                                                                    </span>
                                                                    <span>
                                                                        <p className='m-0'> Chandigarh (IXC) - Male (MLE)</p>
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        {/* **************************************************** */}
                                                        <div className="package_bundle">

                                                            <div className="price flex items-end justify-start gap-1 mt-2">

                                                                <h6 className='m-0'>
                                                                    $809
                                                                </h6>
                                                                <h6 className='m-0'> 100</h6>
                                                            </div>
                                                            <p>
                                                                per traveler
                                                            </p>
                                                            <p>
                                                                Sun, Mar 1 - Sat, Mar 7 (6 nights)
                                                            </p>
                                                            <p>
                                                                Found 12 hours ago
                                                            </p>
                                                            <div className="bundle_bag">
                                                                <div className="bundle">
                                                                    <span>
                                                                        <GiSchoolBag />
                                                                    </span>
                                                                    <p className='m-0'>
                                                                        bunlde & save $231

                                                                    </p>
                                                                </div>


                                                            </div>

                                                        </div>


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
                                        className={`absolute ${image?.length <= 4 ? "d-none pointer-events-none" : ""} `}
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
