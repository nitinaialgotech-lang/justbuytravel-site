"use client";
import React, { useState } from "react";
import { getAssetPath } from "@/app/utils/assetPath";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import "swiper/css/pagination";

export default function Helping_travel_Explore() {
  const [isAtBeginning, setIsAtBeginning] = useState(true);
  const card = [
    {
      img: "/flights/places/germany.jpg",
      title: "Germany",
      link: "https://expedia.tpx.lu/Gnv93jRp",
    },
    {
      img: "/flights/places/nepal.jpg",
      title: "Nepal",
      link: "https://expedia.tpx.lu/F3tBsraP",
    },
    {
      img: "/flights/places/japan.jpg",
      title: "Japan",
      link: "https://expedia.tpx.lu/6UTBGNfs",
    },
    {
      img: "/flights/places/qatar.jpg",
      title: "Qatar",
      link: "https://expedia.tpx.lu/EILHdNu7",
    },
    {
      img: "/flights/places/srilanka.jpg",
      title: "Srilanka",
      link: "https://expedia.tpx.lu/qWqH4JB7",
    },
    {
      img: "/flights/places/thialand.jpg",
      title: "Thialand",
      link: "https://expedia.tpx.lu/trVIyNP7",
    },
    // {
    //     img: "/justbuytravel_next/demo/travelexplore/london-bridge.webp",
    //     title: "Autralia to singapur"
    // },
  ];
  return (
    <>
      <section className="helping_travel_section padding_top padding_bottom">
        <div className="container">
          <div className="row">
            <div className="helping_travel_section_title">
              <div className="section_title flight-title">
                <h2 className="m-0">Plan Smart, Travel Easy</h2>
                <p>
                  Before confirming tickets for your planned travel dates,
                  compare flight routes to popular destinations to see airline
                  options, travel times and prices.
                </p>
              </div>
            </div>
            {/* *****************  ection slider i */}
            <div className="travel_section_box relative pt-2">
              <Swiper
                slidesPerView={4}
                spaceBetween={20}
                navigation={{
                  prevEl: "#helping_swiper-btn-prev",
                  nextEl: "#helping_swiper-btn-next",
                }}
                modules={[Pagination, Navigation]}
                onSwiper={(swiper) => setIsAtBeginning(swiper.isBeginning)}
                onSlideChange={(swiper) => setIsAtBeginning(swiper.isBeginning)}
                loop={true}
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
                className="mySwiper relative"
              >
                {card?.map((item, i) => {
                  return (
                    <SwiperSlide key={i} className="relative">
                      <div className="travel_explore_card relative">
                        <div className="travel_explore_img">
                          <img src={getAssetPath(item?.img)} alt="" />
                        </div>
                        <div className="travel_explore_body p-0">
                          <h4 className="m-0">{item?.title}</h4>
                          <button
                            className="button_bg2 recomend_btn m-0"
                            onClick={() => window.open(item?.link, "_blank")}
                          >
                            Book Flights
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="button_swiper absolute ">
                <div className="buttons_icon relative">
                  <button
                    id="helping_swiper-btn-prev"
                    aria-label="Previous"
                    className={`absolute ${isAtBeginning ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <MdOutlineKeyboardArrowLeft size={30} />
                  </button>

                  <button
                    id="helping_swiper-btn-next"
                    aria-label="Next"
                    className="absolute"
                  >
                    <MdOutlineKeyboardArrowRight size={30} />
                  </button>
                </div>
              </div>
              {/* ****************************** */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
