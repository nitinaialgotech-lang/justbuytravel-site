import React from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";

function ShimmerFacilities() {
    const shimmerWidths = [
        "shimmer-width-80",
        "shimmer-width-75",
        "shimmer-width-70",
        "shimmer-width-65",
        "shimmer-width-60",
        "shimmer-width-55",
    ];
    return (
        <div className="facilities_section">
            <div className="hotel_detail_page">
                <div className="facilities-wrap">
                    <div className="single-facilities">
                        {/* Optional shimmer heading */}
                        <div
                            className="shimmer-text mb-4 shimmer-text-25p-20"
                        ></div>

                        {/* Shimmer list */}
                        <ul className="facilities-list">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    {/* Icon placeholder */}
                                    <div
                                        className="shimmer-icon shimmer-icon-16"
                                    ></div>
                                    {/* Text placeholder */}
                                    <div
                                        className={`shimmer-text shimmer-line-16 ${shimmerWidths[i]}`}
                                    ></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HotelFacilities({ hotelAmenties = [], load }) {
    // If no amenities provided, show default static content
    const hasAmenities = hotelAmenties && hotelAmenties.length > 0;

    return (
        <>
            {hasAmenities ? (
                <div className="container ">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="title about_hotel_detail">
                                <h3>Highlights Facilities</h3>
                            </div>
                            {
                                load ? <ShimmerFacilities /> :
                                    <div className="facilities_section ">
                                        <div className="hotel_detail_page">
                                            <div className="facilities-wrap">
                                                <div className="single-facilities">
                                                    <ul className="facilities-list">


                                                        {
                                                            hotelAmenties?.map((item, i) => {
                                                                return (


                                                                    <li key={i}>
                                                                        <RiCheckboxCircleLine />
                                                                        {item}
                                                                    </li>


                                                                )
                                                            })
                                                        }


                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            ) : (
                " "
            )}
        </>
    );
}
