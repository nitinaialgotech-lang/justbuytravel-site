"use client";
import React from "react";
import { getAssetPath } from "@/app/utils/assetPath";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Link from "next/link";
export default function CanadaBookingTips() {
  const [secondActive, setSecondActive] = useState(true);
  const card = [
    {
      img: "/innerpages/canada/cn4.webp",
    },
    {
      img: "/innerpages/canada/cn1.webp",
    },
    {
      img: "/innerpages/canada/cn2.webp",
    },
    {
      img: "/innerpages/canada/cn3.webp",
    },
  ];
  return (
    <>
      <section className="hotel_booking_tips_section padding_bottom padding_top bg_grey">
        <div className="container">
          <div className="row items-center">
            {/* ******  image */}
            <div className="col-lg-6">
              <div className="container d-none d-lg-block">
                <div className="row ">
                  <div className="col-lg-6">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/canada/cn4.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/canada/cn1.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6  mt-4">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/canada/cn2.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-4 ">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/canada/cn3.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* **************** on mobile view show  */}
              <div className="container">
                <div className="row d-block d-lg-none relative">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={15}
                    // pagination={{ clickable: true }}
                    navigation={{
                      prevEl: "#booking_tips_prev",
                      nextEl: "#booking_tips_next",
                    }}
                    loop={true}
                    // autoplay={{
                    //     delay: 3000,
                    //     disableOnInteraction: false,
                    // }}
                    onSwiper={(swiper) => setSecondActive(swiper.isBeginning)}
                    onSlideChange={(swiper) =>
                      setSecondActive(swiper.isBeginning)
                    }
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
                    {card?.map((item, i) => {
                      return (
                        <>
                          <SwiperSlide key={i}>
                            <div className="col-lg-6">
                              <div className="hotel_tips_img">
                                <img src={getAssetPath(item?.img)} alt="" />
                              </div>
                            </div>
                          </SwiperSlide>
                        </>
                      );
                    })}
                  </Swiper>
                  <div className="button_swiper2 button_swiper_3 absolute ">
                    <div className="buttons_icon relative">
                      <button
                        id="booking_tips_prev"
                        aria-label="Previous"
                        className={`absolute ${
                          secondActive ? "d-none pointer-events-none" : ""
                        }`}
                      >
                        <MdOutlineKeyboardArrowLeft size={30} />
                      </button>

                      <button
                        id="booking_tips_next"
                        aria-label="Next"
                        className="absolute"
                      >
                        <MdOutlineKeyboardArrowRight size={30} />
                      </button>
                    </div>
                  </div>
                  {/* ******** end ..... */}
                </div>
              </div>
            </div>
            {/* ************ title */}
            <div className="col-lg-6 ">
              <div className="hotel_tips_title">
                <div className="tips_title">
                  <h2>
                    Top Tips for Booking Hotels in Canada: Save More and Stay
                    Better
                  </h2>
                </div>
              </div>
            </div>
            {/* ********************* content >>>>>>>>>>> */}
            <div className="col-lg-12">
              <div className="hotel_tips_content">
                <p>
                  Are you searching for the best hotel booking sites in Canada
                  or a city tour? We are here to help you find the best possible
                  <Link href={"/hotels"} className="g_color">
                    {" "}
                    place to stay{" "}
                  </Link>{" "}
                  at the lowest price. By comparing the best and cheapest hotel
                  booking sites, Just Buy Travel helps you to select the best
                  hotels according to your budget.
                </p>
                <p>
                  Find ways to get discounts at hotels in Canada that fit your
                  travel budget. From comparing hotel rates in major cities
                  across Canada to using trusted booking sites, Just Buy Travel
                  assists travelers in enjoying comfort, convenience, and
                  savings without sacrificing quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
