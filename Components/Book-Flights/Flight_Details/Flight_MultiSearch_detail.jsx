import React from 'react'
import { useSelector } from 'react-redux';

import moment from "moment";

export default function Flight_MultiSearch_detail() {
    const travelType = useSelector((state) => state?.user?.type);
    const travel_class = useSelector((state) => state?.user?.travel_class);
    const adults = useSelector((state) => state?.user?.passen_count || state?.user?.adults);
    const adultsCount = Math.max(1, parseInt(adults, 10) || 1);
    const legs = useSelector((state) => state?.user?.multi_flight_city);


    return (
        <>
            <section className="py-2">
                <div className="container">
                    <div className="row justify-center departure_chart_section padding_b30 pb-6">
                        <div className="col-lg-12 space-y-5">
                            {/* Search summary header */}
                            <div className="departure_title_head flex flex-col md:flex-row r md:justify-between p-0  gap-4 m-0">
                                <div className="title section_title space-y-1 mb-2">
                                    {/* <h2 className="text-xl md:text-2xl font-semibold">
                                    Search summary
                                </h2>
                                <p className="text-sm text-gray-600 max-w-xl">
                                    Get a quick overview of how the number of stops and airlines affect prices for your trip.
                                </p> */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-700">
                                        {departure_id && arrival_id && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_green">
                                                <span className="font-medium">{departure_id}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="font-medium">{arrival_id}</span>
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_red">
                                            <span>{pretty_outbound}</span>
                                            {pretty_return && (
                                                <>
                                                    <span className="text-gray-400">–</span>
                                                    <span>{pretty_return}</span>
                                                </>
                                            )}
                                        </span>
                                        {adults && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_yellow">
                                                {adults} traveler{adults > 1 ? "s" : ""}
                                            </span>
                                        )}
                                        {travel_class && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_blue capitalize">
                                                {travel_class}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="flex flex-col justify-end mb-2 ">
                                <button className="button_bg2 px-5 py-2 rounded text-sm font-medium">
                                    View summary
                                </button>
                            </div> */}
                            </div>

                            {/* Results card */}
                            <div className="col-lg-12 text-center justify-center m-auto">
                                <div className="departure bg-white rounded card_rounded border-gray-100 text-left overflow-hidden shadow-sm">
                                    <div className="departure_body px-4 md:px-6 pb-4 md:pb-5 space-y-4">
                                        {!hasFlights && (
                                            <div className="py-8 text-center space-y-2">
                                                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                                    No flights found for your search
                                                </h3>
                                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                                    Try adjusting your dates, airports, or number of
                                                    travelers to see more options.
                                                </p>
                                            </div>
                                        )}

                                        {hasFlights &&
                                            flight?.map((item, idx) => {
                                                const segments = item?.flights || [];
                                                const stopsCount = Math.max(
                                                    (segments.length || 1) - 1,
                                                    0,
                                                );
                                                const stopsLabel =
                                                    stopsCount === 0
                                                        ? "Non‑stop"
                                                        : stopsCount === 1
                                                            ? "1 stop"
                                                            : `${stopsCount} stops`;

                                                const firstSeg = segments;
                                                const lastSeg = segments[segments.length - 1];

                                                const depTime = firstSeg
                                                    ? moment(
                                                        firstSeg?.departure_airport?.time,
                                                        "YYYY-MM-DD HH:mm",
                                                    ).format("h:mm A")
                                                    : "";

                                                console.log(item, ",,,,,,,,,,,,,,,pkjpkpkkpk");

                                                return (
                                                    <div
                                                        className="row items-center border_custom rounded px-3 py-3  md:px-4 md:py-4 bg-white  transition-all duration-200 cursor-pointer md-p1"
                                                        key={idx}
                                                    >
                                                        <div className="col-lg-8 p-0">
                                                            {/* ****************************** mobile view show   */}
                                                            <div className="d-block d-lg-none">
                                                                <div className="departure_item flex justify-end items-center gap-2  p-0 text-right  ">
                                                                    <div className="text-[11px] uppercase tracking-wide text-gray-400">
                                                                        From
                                                                    </div>
                                                                    <div className="price text-xl md:text-2xl font-semibold  leading-tight fw-bold">
                                                                        $
                                                                        {((item?.price ||
                                                                            data?.data?.flights?.price_insights
                                                                                ?.lowest_price || 0) * adultsCount).toLocaleString()}
                                                                    </div>


                                                                    <a
                                                                        className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
                                                                        href={expediaAffiliateUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        Select flight
                                                                    </a>



                                                                </div>
                                                            </div>
                                                            {/* ************** */}

                                                            <div className="departure_title flex items-center gap-3 md:gap-4">
                                                                <div className="logo flex flex-col items-center gap-1">
                                                                    <img
                                                                        src={item?.airline_logo}
                                                                        alt={item?.airline || "Airline logo"}
                                                                        width={30}
                                                                        height={30}
                                                                        className=" object-contain  bg-white"
                                                                    />

                                                                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                                                                        {item?.flights[1]?.airline}
                                                                    </span>
                                                                </div>
                                                                <div className="departure_time space-y-1">
                                                                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                                                                        <span className="font-semibold text-gray-900">
                                                                            {departure_id}{" "}
                                                                            <span className="text-gray-400">→</span>{" "}
                                                                            {arrival_id}
                                                                        </span>
                                                                        <span className="hidden md:inline text-gray-400">
                                                                            •
                                                                        </span>
                                                                        <span className="text-gray-600 capitalize">
                                                                            {type || "One way"}{" "}
                                                                            {travel_class && `· ${travel_class}`}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1 text">
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-gray-700 card_rounded border-emerald-100">
                                                                            {stopsLabel}
                                                                        </span>
                                                                        {item?.total_duration && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 card_rounded border-gray-200 sky_yellow">
                                                                                Total{" "}
                                                                                {Math.floor(item.total_duration / 60)}h{" "}
                                                                                {item.total_duration % 60}m
                                                                            </span>
                                                                        )}
                                                                        {item?.carbon_emissions?.this_flight && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50  card_rounded border-emerald-100 sky_green text-gray-700">
                                                                                Carbon:{" "}
                                                                                {(
                                                                                    item.carbon_emissions.this_flight / 1000
                                                                                ).toFixed(0)}{" "}
                                                                                kg CO₂
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* ******************************  on desktop showw................. */}
                                                        <div className="col-lg-4 d-none d-lg-block">
                                                            <div className="departure_item flex justify-end items-center gap-2 md:gap-2 p-0 text-right">
                                                                <div className="text-[11px] uppercase tracking-wide text-gray-400">
                                                                    From
                                                                </div>
                                                                <div className="price text-xl md:text-2xl font-semibold  leading-tight fw-bold">
                                                                    $
                                                                    {((item?.price ||
                                                                        data?.data?.flights?.price_insights
                                                                            ?.lowest_price || 0) * adultsCount).toLocaleString()}
                                                                </div>
                                                                <a
                                                                    className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
                                                                    href={expediaAffiliateUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Select flight
                                                                </a>
                                                            </div>
                                                        </div>

                                                        {/* Horizontal timing line **********************************/}
                                                        <div className="col-lg-10 mt-3 flex gap-2 justify-between md-p0 md-flex">
                                                            {item?.flights?.map((plane, i) => {
                                                                const depDateLabel = plane
                                                                    ? `${plane?.departure_airport?.id || ""} · ${moment(plane?.departure_airport?.time).format("MMM DD")}`
                                                                    : "";
                                                                const stopsLabel =
                                                                    stopsCount === 0
                                                                        ? "Non‑stop"
                                                                        : stopsCount === 1
                                                                            ? "1 stop"
                                                                            : `${stopsCount} stops`;
                                                                let durationLabel = "";
                                                                if (plane && plane) {
                                                                    const start = moment(
                                                                        plane?.departure_airport?.time,
                                                                    );
                                                                    const end = moment(
                                                                        plane?.arrival_airport?.time,
                                                                    );
                                                                    const diffMinutes = end.diff(start, "minutes");
                                                                    const hours = Math.floor(diffMinutes / 60);
                                                                    const minutes = diffMinutes % 60;
                                                                    durationLabel = `${hours}h ${minutes}m`;
                                                                }
                                                                const arrTime = plane
                                                                    ? moment(
                                                                        plane?.arrival_airport?.time,
                                                                        "YYYY-MM-DD HH:mm",
                                                                    ).format("h:mm A")
                                                                    : "";

                                                                const arrDateLabel = plane
                                                                    ? `${plane?.arrival_airport?.id || ""} · ${moment(plane?.arrival_airport?.time).format("MMM DD")}`
                                                                    : "";

                                                                return (
                                                                    <div
                                                                        className="flex flex-col gap-3 w-full rounded-xl bg-gray-50 px-3 py-3 mb-2"
                                                                        key={i}
                                                                    >
                                                                        {/* Top row: times & line */}
                                                                        <div className="flex items-center justify-between gap-3">
                                                                            {/* Left time */}
                                                                            <div className="text-left">
                                                                                <div className="text-base font-semibold text-gray-900">
                                                                                    {moment(
                                                                                        plane?.departure_airport?.time,
                                                                                        "YYYY-MM-DD HH:mm",
                                                                                    ).format("h:mm A")}
                                                                                </div>
                                                                                <div className="text-xs text-gray-600 text ssssss">
                                                                                    {depDateLabel}
                                                                                </div>
                                                                            </div>

                                                                            {/* Center line with stops & duration */}
                                                                            <div className="flex-1 flex flex-col items-center">
                                                                                <div className="flex items-center w-full max-w-xs justify-between">
                                                                                    <span className="inline-block w-4 h-4 rounded-full card_rounded border-gray-400 bg-white" />
                                                                                    <div className="flex-1 h-px bg-gray-300 mx-1" />
                                                                                    <span className="inline-flex  items-center px-2 py-0.5 rounded   text-[11px] text-gray-700 color flex justify-center items-center shadow-sm text stop_span">
                                                                                        {stopsLabel}
                                                                                    </span>
                                                                                    <div className="flex-1 h-px bg-gray-300 mx-1" />
                                                                                    <span className="inline-block w-4 h-4 rounded-full card_rounded border-gray-400 bg-white" />
                                                                                </div>
                                                                                {durationLabel && (
                                                                                    <div className="mt-1 text-xs text-black text-center text">
                                                                                        {durationLabel}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Right time */}
                                                                            <div className="text-right">
                                                                                <div className="text-base font-semibold text-gray-900">
                                                                                    {arrTime}
                                                                                </div>
                                                                                <div className="text-xs text-gray-600 text">
                                                                                    {arrDateLabel}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Airline label under line for mobile / small */}
                                                                        {item?.airline && (
                                                                            <div className="text-xs text-gray-600 text">
                                                                                {item.airline} • {plane?.flight_number}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        {/* ************************************* */}
                                                        <div className="col-lg-2 mt-3 p-0">
                                                            <div className="side_content space-y-1 text-sm text-gray-600 text-left md:text-right">
                                                                <p className="p-0 m-0">
                                                                    Below average legroom (29 in)
                                                                </p>
                                                                <p className="p-0 m-0">In-seat USB outlet</p>
                                                                <p className="p-0 m-0">
                                                                    Carbon emissions estimate: 63 kg
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
