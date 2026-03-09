"use client"
import React from 'react'
import { getAssetPath } from "@/app/utils/assetPath";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const card = [
    {
        img: "/aboutus/booking.webp"
    },
    {
        img: "/aboutus/Expida.webp"
    },
    // {
    //     img: "/logo/hoteldetail/tripcom.webp"
    // },
    // {
    //     img: "/aboutus/Expida.webp"
    // },
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
]



export default function Trust_Guide_Section() {

    const navigate = useRouter();
    const route = usePathname();
    return (
        <section className={`trust_guide_section ${route == "/hotels" || route == "/my-favorite-travel-resources" ? "" : "bg_grey"} padding_top ${route == "/hotels" ? "" : "padding_bottom"} `}>
            <div className="container py-4">
                <div className="row justify-center">
                    <div className="col-lg-12">
                        {/* title */}
                        <div className="section_title trust_guide_content">
                            <h2>
                                Our Trusted Travel and Booking Partners

                            </h2>
                            {/* <p className='g_color fw-semibold'>
                                As your travel guide, we help you avoid scams and travel with confidence.
                            </p> */}
                            <p className='mt-2 pt-2'>
                                Over the years, Just Buy Travel has built working relationships with renowned travel service providers that help book flights, hotels, holiday packages, and cruises to various destinations. Our platform connects users with trusted booking partners, allowing them to view available travel options based on price, availability, and travel schedule before making a decision.


                            </p>
                            <p className='mt-2 pt-2'>
                                We focus on providing booking services from reputable providers so that users can view essential travel details such as routes, accommodation options, and ticket availability in one place. This helps them choose the right travel arrangement based on their personal travel plan and budget requirements.

                            </p>
                            <p className='mt-2 pt-2'>
                                By working with trusted travel partners, <Link href={"/"} className='g_color'>JustBuyTravel </Link>  aims to offer access to multiple booking options without requiring users to visit several travel websites separately. Users can compare services, review booking terms, and choose travel options that match their preferences before confirming their reservation.
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
                                    disableOnInteraction: false
                                }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.5

                                    },
                                    375: {
                                        slidesPerView: 1.5

                                    },
                                    425: {
                                        slidesPerView: 1.5

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
                                {
                                    card?.map((item) => {
                                        return (

                                            <SwiperSlide>
                                                <div className="platform_img pb-4 pt-3">
                                                    <img src={getAssetPath(item?.img)} alt="" />
                                                </div>
                                            </SwiperSlide>


                                        )
                                    })
                                }
                            </Swiper>
                            {/* ******************* */}
                            <div className="plane_icon ">
                                <img src="/aboutus/shadow-plane.webp" alt="" />
                            </div>
                            <button type="submit"
                                className="z-10 mt-2  bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2  text-light " onClick={() => navigate.push("/my-favorite-travel-resources")}>Click Here To Descover Them All!</button>
                        </div>


                    </div>
                </div>
            </div>

        </section >
    )
}
