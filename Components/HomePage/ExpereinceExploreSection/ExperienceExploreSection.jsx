"use client";
import { IconicPlaces, nearbyPlaces, Restro } from "@/app/Route/endpoints";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getPlaceDetailPath, getPlaceTypeFromTypes } from "@/app/utils/seo";
import { getAssetPath, getPlacePhotoUrl } from "@/app/utils/assetPath";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { FaRegHeart } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { IoStarHalf } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
// import required modules
import { Autoplay, Pagination } from "swiper/modules";
import ExpediaBanner from "./Banner";
import GetOfferSection from "../GetOfferSection/GetOfferSection";
export default function ExperienceExploreSection() {
    const DEFAULT_COORDS = { lat: 28.6139, lng: 77.209 };
    const fallbackIconicCards = [
        { img: "/iconic/iconic.jpg", content: "Half-Day Railway Market and Floating Market Tour in Thailand" },
        { img: "/iconic/iconic4.jpg", content: "Half-Day Railway Market and Floating Market Tour in Thailand" },
        { img: "/iconic/iconic6.jpg", content: "Half-Day Railway Market and Floating Market Tour in Thailand" },
        { img: "/iconic/iconic7.jpg", content: "Half-Day Railway Market and Floating Market Tour in Thailand" },
    ];

    const NearCard = [
        {
            img: "/near/near.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
            info: (
                <>
                    Price Start From <span>₹4500</span>
                </>
            ),
            star: [
                <IoStar key="star-1" />,
                <IoStar key="star-2" />,
                <IoStar key="star-3" />,
                <IoStarHalf key="star-half" />,
                <IoStarOutline key="star-outline" />,
            ],
        },
        {
            img: "/near/near1.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
            info: (
                <>
                    Price Start From <span>₹4500</span>
                </>
            ),
            star: [
                <IoStar key="star-1" />,
                <IoStar key="star-2" />,
                <IoStar key="star-3" />,
                <IoStarHalf key="star-half" />,
                <IoStarOutline key="star-outline" />,
            ],
        },
        {
            img: "/near/near2.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
            info: (
                <>
                    Price Start From <span>₹4500</span>
                </>
            ),
            star: [
                <IoStar key="star-1" />,
                <IoStar key="star-2" />,
                <IoStar key="star-3" />,
                <IoStarHalf key="star-half" />,
                <IoStarOutline key="star-outline" />,
            ],
        },
        {
            img: "/near/near3.jpg",
            content: "Half-Day Railway Market and Floating Market Tour in Thailand",
            info: (
                <>
                    Price Start From <span>₹4500</span>
                </>
            ),
            star: [
                <IoStar key="star-1" />,
                <IoStar key="star-2" />,
                <IoStar key="star-3" />,
                <IoStarHalf key="star-half" />,
                <IoStarOutline key="star-outline" />,
            ],
        },
    ];

    const router = useRouter();
    const [isBeginning, setIsBeginning] = useState(true);
    const [secondActive, setSecondActive] = useState(true);
    const [nearbyActive, setNearbyActive] = useState(true);
    const [coords, setCoords] = useState(DEFAULT_COORDS);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined" || !navigator?.geolocation) {
            setLocationError("Geolocation is not supported");
            setCoords(DEFAULT_COORDS);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                setLocationError(err?.message || "Unable to fetch location");
                setCoords(DEFAULT_COORDS);
            }
        );
    }, []);

    // Helper to render Bootstrap-style star rating icons from numeric rating
    const renderBootstrapStars = (rating) => {
        const stars = [];
        const value = Number(rating) || 0;
        const maxStars = 5;
        const fullStars = Math.floor(value);
        const hasHalfStar = value - fullStars >= 0.5;

        for (let i = 0; i < Math.min(fullStars, maxStars); i++) {
            stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
        }

        if (hasHalfStar && stars.length < maxStars) {
            stars.push(<i key="half" className="bi bi-star-half"></i>);
        }

        while (stars.length < maxStars) {
            stars.push(<i key={`empty-${stars.length}`} className="bi bi-star"></i>);
        }

        return stars;
    };
    /***********************xxxxxxxxxxx................ nearby placess api  */
    const { data: nearbyRestaurantsData } = useQuery({
        queryKey: ["restaurantsNearby", coords.lat, coords.lng],
        queryFn: () => Restro(coords.lat, coords.lng),
        enabled: coords.lat !== null && coords.lng !== null,
    });
    const nearbyPlaceslist = nearbyRestaurantsData?.data?.places ?? [];
    // ************************************* iconic places apis 
    const { data: iconicPlacesData } = useQuery({
        queryKey: ["iconicPlacesNearby", coords.lat, coords.lng],
        queryFn: () => IconicPlaces(coords.lat, coords.lng),
        enabled: coords.lat !== null && coords.lng !== null,
    });
    const iconicPlacesList = iconicPlacesData?.data?.places ?? [];
    const [currentIcoIndex, setCurrentIcoIndex] = useState(0);
    const [Nearcurrent, SetNearCurrent] = useState(0);
    const nearSwiperRef = useRef(null);
    const iconicSwiperRef = useRef(null);
    const pathname = usePathname();
    return (
        <>
            <section className={`experience_explore_section padding_bottom ${pathname === "/hotels" ? "padding_top" : ""}`}>

                <div className="container">
                    <div className="row">
                        <div className="explore_section section_title m">
                            <h2 className="mb-0">Near By Locations</h2>
                            <p>Explore nearby destinations and hidden gems</p>
                        </div>
                    </div>

                    {/*8888888888888888888888888888888888888888888888888888888888888888888888888xxxxxxxx======================************************************************** mobile view display
           */}
                    <div className="container relative">
                        <div className="row ">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={15}
                                loop={false}
                                modules={[Pagination]}
                                onSwiper={(swiper) => {
                                    nearSwiperRef.current = swiper;
                                    SetNearCurrent(swiper.realIndex);
                                }}
                                onSlideChange={(swiper) => { setIsBeginning(swiper.isBeginning), SetNearCurrent(swiper.realIndex); }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    375: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    425: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    640: {
                                        slidesPerView: 1, // mobile
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2, // tablet
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 4, // desktop (optional)
                                        spaceBetween: 20,
                                    },
                                }}
                                className="mySwiper relative"
                            >
                                {(nearbyPlaceslist.length ? nearbyPlaceslist : NearCard)?.map((item, i) => {
                                    const title =
                                        item?.displayName?.text || item?.content || item?.displayName || "Place";
                                    const imageSrc = getPlacePhotoUrl(item) || getAssetPath(item?.img || "/blog/blog_img.webp");
                                    const placeId = item?.id;
                                    const placeType = getPlaceTypeFromTypes(item?.types) || 'restaurant';
                                    const slug = placeId ? getPlaceDetailPath(placeType, title, placeId) : '#';
                                    const fallbackImg = getAssetPath("/blog/blog_img.webp");
                                    return (
                                        <SwiperSlide key={i}>
                                            <div className="experience_explore_section">
                                                <div
                                                    className="card relative border-0 cursor-pointer"
                                                    onClick={() => slug !== '#' && router.push(slug)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' && slug !== '#') router.push(slug); }}
                                                >
                                                    <img
                                                        src={imageSrc}
                                                        className="card-img-top card_rounded"
                                                        alt={title}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = fallbackImg;
                                                        }}
                                                    />
                                                    <div className="card-body ps-0 flex justify-between">
                                                        <div className="card_detail">
                                                            <h5 className="card-title m-0">
                                                                {title}
                                                            </h5>
                                                            <div className="rating flex align-items-center gap-1">
                                                                {item?.star
                                                                    ? item.star
                                                                    : renderBootstrapStars(item?.rating)}
                                                                {item?.rating && (
                                                                    <span className="ms-1">{item?.rating}</span>
                                                                )}
                                                            </div>
                                                            {placeId && (
                                                                <div className="" onClick={(e) => e.stopPropagation()}>
                                                                    <Link
                                                                        href={slug}
                                                                        className="button_bg2 rounded-full bg-color-green color_bl recomend_btn"
                                                                    >
                                                                        View Details
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className="button_swiper2 absolute ">
                                <div className="buttons_icon relative">
                                    <button
                                        id="custom_prev"
                                        aria-label="Previous"
                                        className={`absolute ${Nearcurrent === 0 ? "d-none pointer-events-none" : ""
                                            }`}
                                        onClick={() => nearSwiperRef.current?.slidePrev()}
                                    >
                                        <MdOutlineKeyboardArrowLeft size={30} />
                                    </button>

                                    <button
                                        id="custom_next"
                                        aria-label="Next"
                                        className="absolute"
                                        onClick={() => nearSwiperRef.current?.slideNext()}
                                    >
                                        <MdOutlineKeyboardArrowRight size={30} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ********************************************************************************************************************** section two big cities .........>>>>>>>>>>>>>>>>>> */}

            {
                pathname === "/hotels" ? " " :

                    <GetOfferSection />
            }





            {/* **************************************************************************************** */}

            <div className="container padding_bottom">
                <div className="explore_section section_title ">
                    <h2 className="mb-0">Iconic Places</h2>
                    <p>Where history, culture, and beauty come together</p>
                </div>
                {/* *******************************************  show on deskltop >>>>>>>>>>>>>>>>>>>>>> */}

                {/* ************************************************************  show on mobile  */}
                <div className="container">
                    <div className="row  relative">
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={15}
                            modules={[Pagination]}
                            onSwiper={(swiper) => {
                                iconicSwiperRef.current = swiper;
                                setCurrentIcoIndex(swiper.realIndex);
                            }}
                            onSlideChange={(swiper) => { setSecondActive(swiper.isBeginning); setCurrentIcoIndex(swiper.realIndex) }}
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
                            loop={false}
                            className="mySwiper relative"
                        >
                            {(iconicPlacesList.length
                                ? iconicPlacesList
                                : fallbackIconicCards
                            ).map((item, i) => {
                                const title =
                                    item?.displayName?.text || item?.content || item?.displayName || "Place";
                                const imageSrc = getPlacePhotoUrl(item) || getAssetPath(item?.img || "/blog/blog_img.webp");
                                const placeId = item?.id;
                                const slug = placeId ? getPlaceDetailPath('attraction', title, placeId) : '#';
                                return (
                                    <SwiperSlide key={i}>
                                        <div className="experience_explore_section ">
                                            <div
                                                className="card relative border-0 cursor-pointer"
                                                onClick={() => slug !== '#' && router.push(slug)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && slug !== '#') router.push(slug); }}
                                            >
                                                <img
                                                    src={imageSrc}
                                                    className=" card_rounded "
                                                    alt={title}
                                                />
                                                {/* **********heart */}
                                                {/* <div className="heart_icon absolute top-2 right-4">
                                                    <span>
                                                        <FaRegHeart />
                                                    </span>
                                                </div> */}
                                                <div className="card-body ps-0 flex justify-between ">
                                                    <div className="card_detail">
                                                        <h5 className="card-title m-0">{title}</h5>
                                                        <div className="rating flex align-items-center gap-1">
                                                            {item?.rating
                                                                ? renderBootstrapStars(item?.rating)
                                                                : renderBootstrapStars(4)}
                                                            {item?.rating && (
                                                                <span className="ms-1">{item?.rating}</span>
                                                            )}
                                                        </div>
                                                        {placeId && (
                                                            <div className="" onClick={(e) => e.stopPropagation()}>
                                                                <Link
                                                                    href={slug}
                                                                    className="button_bg2 rounded-full bg-color-green color_bl recomend_btn"
                                                                >
                                                                    View Details
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <div className="button_swiper2 absolute ">
                            <div className="buttons_icon relative">
                                <button
                                    id="experience_prev"
                                    aria-label="Previous"
                                    className={`absolute ${currentIcoIndex === 0 ? "d-none pointer-events-none" : ""
                                        }`}
                                    onClick={() => iconicSwiperRef.current?.slidePrev()}
                                >
                                    <MdOutlineKeyboardArrowLeft size={30} />
                                </button>

                                <button
                                    id="experience_next"
                                    aria-label="Next"
                                    className="absolute"
                                    onClick={() => iconicSwiperRef.current?.slideNext()}
                                >
                                    <MdOutlineKeyboardArrowRight size={30} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
