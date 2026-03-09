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
export default function SanFraceBookingTips() {
  const [secondActive, setSecondActive] = useState(true);
  const card = [
    {
      img: "/innerpages/australia/as4.webp",
    },
    {
      img: "/innerpages/australia/as1.webp",
    },
    {
      img: "/innerpages/australia/as2.webp",
    },
    {
      img: "/innerpages/australia/as3.webp",
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
                        src={getAssetPath("/innerpages/australia/as4.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/australia/as1.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6  mt-4">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/australia/as2.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-4 ">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/australia/as3.webp")}
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
                    Best Places to Stay in San Francisco for Comfort and Value
                  </h2>
                </div>
              </div>
            </div>
            {/* ********************* content >>>>>>>>>>> */}
            <div className="col-lg-12">
              <div className="hotel_tips_content">
                <p>
                  Choosing the{" "}
                  <Link href={"/hotels"} className="g_color">
                    {" "}
                    best place to stay{" "}
                  </Link>{" "}
                  in San Francisco depends on how you want to experience the
                  city. Some travelers prefer lively areas near attractions,
                  while others prefer quieter neighborhoods with easy access to
                  transportation. Choosing the right location saves you time,
                  money, and travel stress. With easy comparisons and clear
                  details, finding the perfect hotel becomes quick and easy.
                </p>
                <p className="g_color fw-semibold">
                  Smart areas to stay across San Francisco
                </p>
                <p>
                  Union Square and downtown are great for shopping, dining, and
                  sightseeing. The waterfront areas are popular among first-time
                  visitors who want beautiful views and walkable streets.
                  Travelers looking for affordable hotels in San Francisco can
                  find great value accommodations near transit lines without
                  compromising on comfort. Those seeking a premium experience
                  can explore luxury hotels in San Francisco, which offer
                  opulent rooms, city views, and high-end service. Compare
                  prices, read reviews from real guests, and choose a stay that
                  fits your plans – so you can enjoy the city with confidence
                  and ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
