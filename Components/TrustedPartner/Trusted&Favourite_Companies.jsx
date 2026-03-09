"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { getAssetPath } from "@/app/utils/assetPath";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { usePathname } from 'next/navigation';
export default function Trusted_Favourite_Companies() {
    const card = [
        { img: "/aboutus/booking.webp" },
        { img: "/aboutus/Expida.webp" },
    ]
    const pathname = usePathname();
    return (
        <>
            <section className={`padding_bottom padding_top   bg_grey`}>
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-lg-12">
                            {/* title */}
                            <div className="section_title trust_guide_content">
                                <h2>
                                    Our Trusted and Favorite Travel Companies
                                </h2>
                                <p>
                                    As your travel guide, we do our best to protect you from scams.
                                </p>
                                <p>
                                    Over the years, we’ve tested hundreds of travel companies while exploring the world. Some were amazing, and others… not so much. That’s why we’ve put together a list of trusted and reliable travel brands that we personally use to plan and book our own trips. If you want safe, smooth, and stress-free travel, these are the ones we truly recommend.

                                </p>
                            </div>
                            <div className="booking_platform relative ">
                                {/* ******************* */}
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    loop={true}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false
                                    }}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1

                                        },
                                        375: {
                                            slidesPerView: 1

                                        },
                                        425: {
                                            slidesPerView: 2

                                        },

                                        768: {
                                            slidesPerView: 3,
                                        },
                                        992: {
                                            slidesPerView: 4,
                                            spaceBetween: 24,
                                        },
                                    }}
                                    modules={[Pagination, Autoplay]}
                                    className="trust_section_swiper"
                                >
                                    {/* ******************* */}
                                    {card?.map((item, idx) => (
                                        <SwiperSlide key={`${item?.img ?? "slide"}-${idx}`}>
                                            <div className="platform_img pb-5 pt-3">
                                                <img src={getAssetPath(item?.img)} alt="" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                {/* ******************* */}
                                <div className="plane_icon ">
                                    <img src="/aboutus/shadow-plane.webp" alt="" />
                                </div>
                                <button type="submit"
                                    className="  z-10 mt-2  bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2  text-light ">Click Here To Descover Them All!</button>
                            </div>


                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
