"use client";
import React, { useState } from "react";
import { getAssetPath } from "@/app/utils/assetPath";
import Link from "next/link";

export default function Trusted_Explore_Category() {
    const [categoryType, setCategoryType] = useState("hotel");
    const [active, setActive] = useState(true);

    const hotel = [
        {
            img: "/TrustedPartner/hotel/Hotel-new-york-justbuy-travel.png", title: "Hotel In New York",
            link: "/hotels-in-new-york"
        },
        {
            img: "/TrustedPartner/hotel/Hotel-dubai-justbuy-travel.webp", title: "Hotel In Dubai",
            link: "/hotels-in-dubai"
        },
        {
            img: "/TrustedPartner/hotel/Hotel-aus-justbuy-travel.png", title: "Hotel In Australia",
            link: "/hotels-in-australia"
        },
        {
            img: "/TrustedPartner/hotel/flight-london-justbuytravel.png", title: "Hotel In London",
            link: "/hotels-in-london"
        },
    ];

    const flight = [
        {
            img: "/TrustedPartner/flight/flight-london-justbuytravel.png", title: "Flight In London",
            link: "https://booking.tpx.lu/43aXKObz"
        },
        {
            img: "/TrustedPartner/flight/flight-paris-justbuytravel.webp", title: "Flight In Paris",
            link: "https://booking.tpx.lu/KkWbGc5Z"
        },
        {
            img: "/TrustedPartner/hotel/Hotel-new-york-justbuy-travel.png", title: "Flight In New York",
            link: "https://booking.tpx.lu/FUU52yPG"
        },
        {
            img: "/TrustedPartner/flight/Hotel-dubai-justbuy-travel.webp", title: "Flight In Dubai",
            link: "https://booking.tpx.lu/Bv7yjVYW"
        },
    ];
    return (
        <>
            <section className="padding_bottom padding_top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="explore_title text-center">
                                <div className="section_title title">
                                    <h2 className="m-0">Explore By Category</h2>
                                    <p className="color_bl">Book Flights & Hotels Online, Discover Destinations Aligned with Your Travel Style</p>
                                </div>
                                {/* ******************* */}
                                <div className="explore_cat_button flex justify-center gap-10 mb-4">
                                    <div className="display_button flex gap-1 bg-amber-100 p-2 rounded">
                                        <button
                                            className={`button_bg2   ${categoryType == "hotel" ? "bg-color-green" : "bg-color-black g_color"}`}
                                            type="button"
                                            onClick={() => {
                                                setCategoryType("hotel"), setActive(false);
                                            }}
                                        >
                                            Hotel
                                        </button>
                                        <button
                                            className={`button_bg2   ${categoryType == "flight" ? "bg-color-green" : "bg-color-black g_color"}`}
                                            type="button"
                                            onClick={() => {
                                                setCategoryType("flight"), setActive(true);
                                            }}
                                        >
                                            Flight
                                        </button>
                                    </div>
                                </div>

                                {/* ********************* show on click  */}
                                <div className="row">
                                    {
                                        categoryType == "hotel" ? hotel?.map((item) => {
                                            return (


                                                <div className="col-lg-3 col-md-6 col-6 p-0">
                                                    <div className="explore_content  flex justify-center">
                                                        <div className="content_icon flex flex-col text-center border_right w-full items-center">
                                                            <Link href={item?.link} >
                                                                <img
                                                                    src={getAssetPath(item?.img)}
                                                                    alt=""
                                                                    width={100}
                                                                />
                                                                <p>{item?.title}</p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        }) : flight?.map((item) => {
                                            return (

                                                <div className="col-lg-3 col-md-6 col-6 p-0">
                                                    <div className="explore_content  flex justify-center">
                                                        <div className="content_icon flex flex-col text-center border_right w-full items-center">
                                                            <Link href={item?.link}>
                                                                <img
                                                                    src={getAssetPath(item?.img)}
                                                                    alt=""
                                                                    width={100}
                                                                />
                                                                <p>{item?.title}</p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
