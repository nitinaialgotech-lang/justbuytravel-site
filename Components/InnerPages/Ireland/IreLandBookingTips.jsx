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

export default function IreLandBookingTips() {
  const [secondActive, setSecondActive] = useState(true);
  const card = [
    {
      img: "/innerpages/ireland/ir1.webp",
    },
    {
      img: "/innerpages/ireland/ir2.webp",
    },
    {
      img: "/innerpages/ireland/ir3.webp",
    },
    {
      img: "/innerpages/ireland/ir4.webp",
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
                        src={getAssetPath("/innerpages/ireland/ir1.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/ireland/ir2.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6  mt-4">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/ireland/ir3.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-4 ">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/ireland/ir4.webp")}
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
                    Best Places to Book a Hotel in Ireland for Every Budget
                  </h2>
                </div>
              </div>
            </div>
            {/* ********************* content >>>>>>>>>>> */}
            <div className="col-lg-12">
              <div className="hotel_tips_content">
                <p>
                  Are you looking for a place to stay in Ireland? Ireland has
                  many options for accommodations, from bustling city hotels to
                  serene countryside hotels. Whether you are looking for a
                  <Link href={"/hotels"} className="g_color">
                    {" "}
                    budget-friendly hotel{" "}
                  </Link>{" "}
                  or a luxurious resort, picking the right hotel can definitely
                  enhance your holiday experience.
                </p>
                <p>
                  Finding and comparing hotels in Ireland becomes easier when
                  you review prices, locations, and guest feedback in one place.
                  Travelers can book hotels in Ireland based on travel style,
                  trip length, and preferred location, making planning more
                  flexible and stress-free.
                </p>
                <p>
                  Many visitors also look for hotel deals or vouchers in Ireland
                  to manage travel costs better. These options can suit
                  different trips, including short city breaks, romantic
                  weekends, and family holidays. By using trusted booking
                  partners and clear pricing information, travelers can plan
                  their stay with confidence and avoid unexpected charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
