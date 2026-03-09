"use client";
import React from "react";
import { getAssetPath } from "@/app/utils/assetPath";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const card = [
    {
        img: "/aboutus/booking.webp",
    },
    {
        img: "/aboutus/Expida.webp",
    },
    // {
    //     img: "/demo/aboutus/google.png"
    // },
    // {
    //     img: "/demo/aboutus/hotellook.png"
    // },
    // {
    //     img: "/demo/aboutus/skyscanner.png"
    // },
    // {
    //     img: "/demo/aboutus/tripadviser.png"
    // }
];

export default function FlightTrusted_Section() {
    const navigate = useRouter();
    const route = usePathname();
    return (
        <section
            className={`trust_guide_section ${route == "/aboutus/" || route == "/book-hotels/" ? "" : "bg_grey"}  padding_top padding_bottom`}
        >
            <div className="container">
                <div className="row justify-center">
                    <div className="col-lg-12">
                        {/* title */}
                        <div className="section_title trust_guide_content">
                            <h2>Our Trusted Flight Booking and Travel Partners</h2>
                            <p className="g_color fw-semibold">
                                We provide trusted advice to help you travel smarter and safer.

                            </p>
                            <p>
                                Over the years, we have worked with trusted flight booking providers that offer ticket options to a variety of destinations. Before confirming their bookings, travelers check airline schedules, seat availability, and ticket prices based on their travel dates and preferred routes. Viewing flight details in advance helps choose the right departure time and avoids last-minute booking changes during travel planning.

                            </p>
                            {/* <p>
                                   Just Buy Travel is a travel research and comparison platform designed to help users explore hotels, flights, holiday packages, and cruises using trusted third-party travel websites.
                               </p> */}
                        </div>
                        <div className="booking_platform relative ">
                            {/* ******************* */}
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={30}
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                    },
                                    375: {
                                        slidesPerView: 1,
                                    },
                                    425: {
                                        slidesPerView: 2,
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
                                {card?.map((item, i) => {
                                    return (
                                        <SwiperSlide key={i}>
                                            <div className="platform_img pb-4 pt-3">
                                                <img src={getAssetPath(item?.img)} alt="" />
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            {/* ******************* */}
                            <div className="plane_icon ">
                                <img src="/aboutus/shadow-plane.webp" alt="" />
                            </div>
                            <button
                                type="submit"
                                className="z-10 mt-2  bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2  text-light "
                                onClick={() => navigate.push("/my-favorite-travel-resources")}
                            >
                                Click Here To Descover Them All!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
