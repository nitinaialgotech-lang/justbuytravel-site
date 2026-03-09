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
export default function GoaBookingTips() {
  const [secondActive, setSecondActive] = useState(true);
  const card = [
    {
      img: "/innerpages/goa/g_img.webp",
    },
    {
      img: "/innerpages/goa/g_img2.webp",
    },
    {
      img: "/innerpages/goa/g_img3.webp",
    },
    {
      img: "/innerpages/goa/g_img4.webp",
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
                        src={getAssetPath("/innerpages/goa/g_img.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/goa/g_img2.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6  mt-4">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/goa/g_img3.webp")}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 mt-4 ">
                    <div className="hotel_tips_img">
                      <img
                        src={getAssetPath("/innerpages/goa/g_img4.webp")}
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
                    Hotel Stays in Goa: Smart Ways to Save and Choose the Right
                    Location
                  </h2>
                </div>
              </div>
            </div>
            {/* ********************* content >>>>>>>>>>> */}
            <div className="col-lg-12">
              <div className="hotel_tips_content">
                <p>
                  Planning a trip to Goa becomes easier when you choose
                  accommodation that matches your budget and travel style. For a
                  wider selection of stays across multiple destinations, you can
                  browse our{" "}
                  <Link className="g_color " href={"/hotels"}>
                    {" "}
                    complete hotels collection{" "}
                  </Link>
                  to compare options more effectively.
                </p>
                <p>
                  Travellers can often save money by checking last-minute hotel
                  deals offered by both boutique properties and well-known hotel
                  brands. These options help visitors enjoy comfortable stays
                  without paying more than necessary, especially during off-peak
                  travel periods.
                </p>
                <p>
                  Before confirming a stay, it helps to review hotel amenities,
                  locations, and pricing details. Many hotels provide seasonal
                  offers and flexible packages based on traveller demand, making
                  it easier to find value-driven options.
                </p>
                <p>
                  Through trusted booking partners,{" "}
                  <Link href={"/"} className="g_color">
                    Just Buy Travel{" "}
                  </Link>{" "}
                  showcases verified hotel listings with clear pricing and
                  flexible booking options, making it easy for travellers to
                  compare options and find the perfect stay without going over
                  their budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
