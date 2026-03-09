import Footer from "@/component/Footer";
import React from "react";

function ShimmerMap() {
    return (
        <div className="hotel_map">
            <div
                className="shimmer-map shimmer-map-450 rounded-2xl"
            ></div>
        </div>
    );
}

export default function HotelLocation({ lat, long, load }) {
    return (
        <>
            <section className="padding_bottom hotel_location_section">
                <div className="container">
                    <div className="nearbyhotels rounded-2xl ">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className=" section_title ">
                                    <h3 className="serp_sub_title">Location</h3>
                                </div>
                                {/* *********************** */}
                                {
                                    load ? <ShimmerMap /> :
                                        <div className="hotel_map">
                                            <iframe
                                                src={`https://www.google.com/maps?q=${lat},${long}&hl=en&z=15&output=embed`}
                                                width="100%"
                                                height="450"
                                                className="rounded-2xl"
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
