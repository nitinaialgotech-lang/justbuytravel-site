import React from "react";

function ShimmerAboutHotel() {
    const shimmerWidths = ["shimmer-width-90", "shimmer-width-80", "shimmer-width-70", "shimmer-width-60"];
    return (
        <div className="about_hotel rounded-2xl">
            <div className="row">
                <div className="col-lg-12">
                    <div className="about_hotel_detail">
                        {/* Shimmer for the heading */}
                        <div
                            className="shimmer-text mb-4 shimmer-text-40p-32"
                        ></div>

                        {/* Shimmer for paragraph lines */}
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`shimmer-text mb-2 shimmer-line-18 ${shimmerWidths[i]}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AboutHotelDetail({ detail, load }) {
    return (
        <>
            <div className="section_about_hotel_detail ">
                <div className="container">
                    {
                        load ? <ShimmerAboutHotel /> :
                            <div className="about_hotel rounded-2xl ">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="about_hotel_detail">
                                            {/* <h3 className=''>
                                                {detail}
                                            </h3> */}
                                            <p>
                                                {detail}

                                            </p>


                                        </div>
                                    </div>
                                </div>
                            </div>
                    }

                </div>

            </div>


        </>
    )
}
