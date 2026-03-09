"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { getAssetPath } from "@/app/utils/assetPath";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaCheck } from "react-icons/fa";
import { TiArrowUp } from "react-icons/ti";
import { usePathname, useRouter } from "next/navigation";
export default function GetOfferSection() {
    const route = useRouter();

    const card = [
        {
            title: " Winter Travel Deals – Up to 30% Off",
            text: "Book travel online and enjoy exclusive discounts on seasonal activities and experiences.",
            banner: "/home/offer/offer_banner1.webp",
            back_img: "/home/offer/offer-banner-img-shape.png",
            option1: "Safe & Verified Equipment",
            option2: "Breathtaking Views"
        },
        {
            title: " Winter Travel Deals – Up to 30% Off",
            text: "Book travel online and enjoy exclusive discounts on seasonal activities and experiences.",
            banner: "/home/offer/offer_banner2.webp",
            back_img: "/home/offer/offer-banner-img-shape.png",
            option1: "Safe & Verified Equipment",
            option2: "Breathtaking Views"
        },
        {
            title: " Winter Travel Deals – Up to 30% Off",
            text: "Book travel online and enjoy exclusive discounts on seasonal activities and experiences.",
            banner: "/home/offer/offer_banner3.webp",
            back_img: "/home/offer/offer-banner-img-shape.png",
            option2: "Breathtaking Views",
            option1: "Safe & Verified Equipment",
        }
    ]
    return (
        <>
            <section className="GetOfferSection padding_bottom ">
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-md-12">
                            <div className="offer_banner_wrapper card_rounded bg-color-green">
                                <Swiper
                                    spaceBetween={30}
                                    effect="fade"

                                    pagination={{ clickable: true }}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                    }}
                                    speed={600}              // smoother slide speed
                                    resistanceRatio={0.85}   // less snap-back
                                    watchSlidesProgress={true}
                                    modules={[EffectFade, Autoplay]}
                                    className="offer_swiper"
                                >
                                    {/* Slide 1****************************************************************************************** */}
                                    {
                                        card?.map((item, i) => {

                                            return (
                                                <>



                                                    <SwiperSlide key={i}>
                                                        <div
                                                            className="grid grid-cols-2 h-full  items-center swiper_item relative"
                                                            id="swiper_item"
                                                        >
                                                            {/* LEFT TEXT */}
                                                            <div className="px-16 slide-text flex flex-col gap-2 ">
                                                                <div className="text">
                                                                    <h2 className=" mb-2">
                                                                        {
                                                                            item?.title
                                                                        }

                                                                    </h2>
                                                                    <p className="text-white font-semibold">
                                                                        {item?.text}
                                                                    </p>
                                                                </div>
                                                                {/* ***** */}
                                                                <div className="text_point flex gap-3 items-center">
                                                                    <p className="flex gap-2 items-center">
                                                                        <span>
                                                                            <FaCheck />
                                                                        </span>{" "}
                                                                        <span>{item?.option1}</span>
                                                                    </p>
                                                                    <p className="flex gap-2 items-center">
                                                                        <span>
                                                                            <FaCheck />
                                                                        </span>{" "}
                                                                        <span>
                                                                            {
                                                                                item?.option2
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                {/* ***** */}
                                                                <div className="text_button mt-2">
                                                                    <button className="flex items-center  arrow_button" onClick={() => route.push("/book-packages")} >
                                                                        <span>view all activities </span>{" "}
                                                                        <span>
                                                                            <TiArrowUp />
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* RIGHT IMAGE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                                                            <div className="banner_image relative order-first order-lg-last order-md-last ">
                                                                <div className="swiper_inner_img">
                                                                    <img
                                                                        src={getAssetPath(item.banner)}
                                                                        className="w-full object-cover card_rounded"
                                                                        alt=""
                                                                    />
                                                                </div>

                                                                <img className="d-none d-lg-block"
                                                                    src={getAssetPath(item?.back_img)}
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                </>
                                            )


                                        })
                                    }
                                    {/* Slide 1****************************************************************************************** */}

                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
