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
export default function GuideHotel() {
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
                    loop={false}
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
                    We help you find hotel stays that suit your travel plans and
                    preferences.
                  </h2>
                </div>
              </div>
            </div>
            {/* ********************* content >>>>>>>>>>> */}
            <div className="col-lg-12">
              <div className="hotel_tips_content">
                <h5 className="g_color fw-semibold m-0">
                  Personalized Hotel Recommendations
                </h5>
                <p>
                  Hotel selection usually depends on travel plans, preferred
                  locations, and daily commute needs. Choosing the right area
                  early helps in finding accommodation near transport links,
                  restaurants, and attractions before finalising your stay.
                </p>
                <h5 className="g_color fw-semibold m-0">
                  Smart Hotel Research Experience
                </h5>
                <p>
                  Checking guest ratings, room availability, and listed
                  amenities before booking helps narrow down suitable hotel
                  options. Reviewing accommodation details in advance also
                  reduces confusion while selecting a stay based on travel
                  plans.
                </p>
                {/* ******** */}
                <h5 className="g_color fw-semibold m-0">
                  Transparent Hotel Deals Online
                </h5>
                <p>
                  Room prices vary across booking platforms, so comparing
                  available hotel rates helps you choose a place that matches
                  your travel budget, preferred location, and nearby amenities
                  during your stay.
                </p>
                <h5 className="g_color fw-semibold m-0">
                  Trusted by Global Travelers
                </h5>
                <p>
                  Accommodation options become easier to shortlist after
                  reviewing hotel locations and nearby services. Looking at
                  transport access and local dining spots supports better stay
                  decisions before confirming bookings.
                </p>
                <h5 className="g_color fw-semibold m-0">
                  Easily Compare Hotel Prices Online
                </h5>
                <p>
                  Hotel prices and facilities can be compared in advance to
                  select a stay that suits your travel schedule, preferred
                  areas, and overall accommodation requirements for your visit.
                </p>
                <p className="m-0">
                  Visitors can also access additional travel planning tools
                  available on{" "}
                  <Link href={"/"} className="g_color">
                    Just Buy Travel{" "}
                  </Link>{" "}
                  while comparing hotel options for their trip.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
