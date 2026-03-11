"use client";

import React, { useState } from "react";
import Flight_Search_Input from "./Flight_Search_Input";
import { useSelector } from "react-redux";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GetSerpBookingOptions } from "@/app/Route/endpoints";
import { Accordion } from "react-bootstrap";
import Link from "next/link";
import { VscArrowSwap } from "react-icons/vsc";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useCurrency } from "@/context/CurrencyContext";


export default function Flight_Return_Detail() {
    // **************************** api fo booking  const navigate = useRouter();
    const navigate = useRouter();
    const departure_id = useSelector(
        (state) => state.user.SearchFlight.startfrom,
    );
    const [activeKey, setActiveKey] = useState();
    const [otherActiveKey, setOtherActiveKey] = useState();
    const start_date = useSelector((state) => state.user.SearchFlight.startDate);
    const back_date = useSelector((state) => state.user.SearchFlight.endDate);
    const arrival_id = useSelector((state) => state.user.SearchFlight.endto);
    //   ***********
    const [showText, setShowText] = useState(false);
    const { formatPrice, currency } = useCurrency();
    const outbound_date = moment(start_date).format("YYYY-MM-DD");
    const return_date = moment(back_date).format("YYYY-MM-DD");
    const getData = useSearchParams();
    const departure_token = getData.get("tok");
    const travelType = getData.get("type")
    // **********************
    const type = useSelector((state) => state.user.type);
    const travel_class = useSelector((state) => state.user.travelClass);
    const adults = useSelector((state) => state.user.passen_count);
    const children_count = useSelector((state) => state.user.children_count);
    const infant_count = useSelector((state) => state.user.infant_count);
    const adultsCount = Math.max(1, parseInt(adults, 10) || 1);
    const childrenCountNum = Math.max(0, parseInt(children_count, 10) || 0);
    const infantCountNum = Math.max(0, parseInt(infant_count, 10) || 0);
    const multicity = useSelector((state) => state.user.multi_flight_city);
    // *************
    let travel_class_name;

    if (Number(travel_class) === 1) {
        travel_class_name = "Economy";
    } else if (Number(travel_class) === 2) {
        travel_class_name = "Premium economy";
    } else if (Number(travel_class) === 3) {
        travel_class_name = "Business";
    } else if (Number(travel_class) === 4) {
        travel_class_name = "First";
    }

    // "*******************************"
    const payload = {};

    if (type == 1 || type == 2) {
        // Round-trip or single-leg
        payload.departure_id = departure_id;
        payload.arrival_id = arrival_id;
        payload.outbound_date = outbound_date;
        payload.return_date = return_date;
    } else {
        const legs = Array.isArray(multicity)
            ? multicity
                .map((f) => {
                    const arr = f?.arrival_id ?? f?.arrive_id ?? "";
                    const d =
                        f?.date ||
                        (f?.dateTime ? moment(f.dateTime).format("YYYY-MM-DD") : "");
                    return {
                        departure_id: f?.departure_id || "",
                        arrival_id: arr,
                        date: d,
                    };
                })
                .filter((l) => l.departure_id && l.arrival_id && l.date)
            : [];
        payload.multi_city_json = legs.length >= 2 ? legs : null;
    }


    payload.type = String(type);
    payload.departure_token = departure_token;
    payload.engine = "google_flights";
    payload.currency = "USD";
    payload.hl = "en";
    payload.adults = adultsCount;
    payload.children = childrenCountNum;
    payload.infants_on_lap = infantCountNum;
    payload.travel_class = travel_class;

    const canFetch =
        type == 1 || type == 2
            ? !!payload.departure_token
            : !!payload.departure_token && !!payload.multi_city_json;

    const { data, isLoading } = useQuery({
        queryKey: ["bookingoptions", payload],
        queryFn: () => GetSerpBookingOptions(payload),
        enabled: canFetch,
    });

    // const { data, isLoading } = useQuery({
    //     queryKey: [
    //         "bookingoptions",
    //         departure_id,
    //         outbound_date,
    //         return_date,
    //         arrival_id,
    //         departure_token,
    //     ],
    //     queryFn: () =>
    //         GetSerpBookingOptions({
    //             departure_id,
    //             outbound_date,
    //             return_date,
    //             arrival_id,
    //             departure_token,
    //         }),

    // });

    const flights = data?.data?.intermediate_results?.other_flights || [];
    const Bestflights = data?.data?.intermediate_results?.best_flights || [];
    const searchParams = data?.flights?.search_parameters;
    console.log(data, "dataaaaaaaaaaaaaa", payload, "payload");

    const firstSegment = flights?.[0]?.flights?.[0];

    const departName = firstSegment?.departure_airport?.id;
    const arriveName = firstSegment?.arrival_airport?.id;


    const ShimmerCard = () => {
        return (
            <div className="p-4 border-b animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
            </div>
        );
    };
    const formatSerpPrice = (priceValue) => {
        if (priceValue == null) return null;
        if (typeof priceValue === "number") return formatPrice(priceValue);
        if (typeof priceValue === "string") {
            const num = parseFloat(priceValue.replace(/[^0-9.]/g, ""));
            return Number.isNaN(num) ? priceValue : formatPrice(num);
        }
        return priceValue;
    };

    const displayPrice = (p) => {
        const n = Number(p);
        return isNaN(n) ? 0 : formatSerpPrice(n);
    };









    return (
        <>
            <section className="booking-options">
                <div className="container">
                    <div className="flight_sec search_container flight_mrg">

                        <Flight_Search_Input />
                    </div>
                    <div className="row justify-center">
                        <div className="col-lg-12">
                            <div className="back_button pb-3 d-block d-lg-none ">
                                <div className="back_to">
                                    <div className="back flex items-center" onClick={() => navigate.back()}>
                                        <span> <MdOutlineKeyboardArrowLeft /></span>  <span>back</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded card_rounded border border-gray-200  overflow-hidden">
                                {/* Section header */}
                                <div className=" px-3 py-2 border-b border-gray-100 ">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="left_detail">
                                            {
                                                travelType == "3" ?
                                                    <h2 className="text-lg  md:text-xl font-semibold text-gray-900 flex gap-2 items-center capitalize mb-2">
                                                        <span>{departName} </span>
                                                        <span className="swip">
                                                            <VscArrowSwap />
                                                        </span>
                                                        <span>{arriveName}</span>
                                                    </h2>
                                                    : <h2>Return Flights</h2>
                                            }

                                            <div className="departure_time space-y-1">
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1 text">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-gray-700 card_rounded border-emerald-100">
                                                        {type == 1 ? "Round Trip" : " Muti-city"}
                                                    </span>

                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 card_rounded border-gray-200 sky_yellow">
                                                        {travel_class_name}
                                                    </span>

                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50  card_rounded border-emerald-100 sky_green text-gray-700">
                                                        {adultsCount} Passenger{adultsCount > 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* British Airways block */}

                                <div className="book_fligh">
                                    <div className="selected_flight border-0">
                                        {/* Other airlines list */}
                                        <div className="accordian_section ">
                                            <Accordion
                                                // activeKey={activeKey}
                                                // onSelect={(eventKey) =>
                                                //     setActiveKey(eventKey === activeKey ? null : eventKey)
                                                // }
                                                className=""
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <ShimmerCard />
                                                        <ShimmerCard />
                                                        <ShimmerCard />
                                                        <ShimmerCard />
                                                    </>
                                                ) : (
                                                    <>
                                                        {Bestflights.map((item, i) => {
                                                            const segment = item?.flights?.[0];
                                                            console.log(item, "loppppppppppppppppppppe");

                                                            const departure =
                                                                segment?.departure_airport?.time;
                                                            const arrival = segment?.arrival_airport?.time;

                                                            const dep_id = segment?.departure_airport?.id;
                                                            const arri_id = segment?.arrival_airport?.id;

                                                            const travelMinutes = moment(arrival).diff(
                                                                moment(departure),
                                                                "minutes",
                                                            );
                                                            const travelHours = Math.floor(
                                                                travelMinutes / 60,
                                                            );
                                                            const travelRemainingMinutes = travelMinutes % 60;
                                                            const travelTime = `${travelHours}h ${travelRemainingMinutes}m`;

                                                            return (
                                                                <>

                                                                    <Accordion.Item eventKey={`best-${i}`} key={`best-${i}`}>
                                                                        <Accordion.Header
                                                                            className="flight_accordian "
                                                                            onClick={() => {

                                                                                setShowText(true)
                                                                                if (activeKey === i) {
                                                                                    setActiveKey(null)
                                                                                }
                                                                                else {
                                                                                    setActiveKey(i)
                                                                                }

                                                                            }}
                                                                        >
                                                                            <div className="acor_header  w-full">
                                                                                {activeKey !== i ? (
                                                                                    <div className="items return-flight-item flex items-center justify-between">
                                                                                        <div className="img ps-3">
                                                                                            <img
                                                                                                src={segment?.airline_logo}
                                                                                                width={40}
                                                                                                height={40}
                                                                                                alt=""
                                                                                            />
                                                                                        </div>
                                                                                        {/* ****** */}
                                                                                        <div className="time acot-tit dis_txt">
                                                                                            <span>
                                                                                                {moment(departure).format(
                                                                                                    "ddd, MMM D h:mm A",
                                                                                                )}{" "}
                                                                                                –{" "}
                                                                                                {moment(arrival).format(
                                                                                                    "h:mm A",
                                                                                                )}
                                                                                            </span>
                                                                                            <p>{item?.airline}</p>
                                                                                        </div>
                                                                                        {/* ************* */}
                                                                                        <div className="hout_tm acot-tit tt-c dis_no">
                                                                                            <span> {travelTime}</span>
                                                                                            <p>
                                                                                                {dep_id} - {arri_id}
                                                                                            </p>
                                                                                        </div>
                                                                                        {/* ********* */}
                                                                                        <div className="stops acot-tit tt-c dis_no">
                                                                                            <span>{ }</span>
                                                                                        </div>
                                                                                        {/* ******** weight */}
                                                                                        <div className="weigth acot-tit tt-c dis_no">
                                                                                            <span>
                                                                                                {(
                                                                                                    item?.carbon_emissions
                                                                                                        ?.this_flight / 1000
                                                                                                ).toFixed(0)}{" "}
                                                                                                kg CO2
                                                                                            </span>
                                                                                            <p>
                                                                                                +
                                                                                                {
                                                                                                    item?.carbon_emissions
                                                                                                        ?.difference_percent
                                                                                                }
                                                                                                % emission
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="items inner_tab_items full_det_item flex items-center  justify-between w-full">
                                                                                        <div className="img ps-3 flex justify-between items-center">
                                                                                            <img
                                                                                                src={item?.airline_logo}
                                                                                                width={40}
                                                                                                height={40}
                                                                                                alt=""
                                                                                            />
                                                                                            <div className="time acot-tit d-block d-lg-none ">
                                                                                                <h2 className="m-0" id="h3">
                                                                                                    Departing flight{" "}
                                                                                                    {moment(departure).format(
                                                                                                        "ddd, MMM D",
                                                                                                    )}
                                                                                                </h2>
                                                                                                <p className=" m-0 ">
                                                                                                    {item?.airline}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="items_flights flex items-center gap-5 pe-3">
                                                                                            {/* ****** */}
                                                                                            <div className="time acot-tit d-none d-lg-block ">
                                                                                                <h2 className="m-0" id="h3">
                                                                                                    Departing flight{" "}
                                                                                                    {moment(departure).format(
                                                                                                        "ddd, MMM D",
                                                                                                    )}
                                                                                                </h2>
                                                                                                <p className=" m-0 ">
                                                                                                    {item?.airline}
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* ************* */}

                                                                                            {/* ******** weight */}
                                                                                            <div className="weigth acot-tit dis_no">
                                                                                                <span>118 kg CO2e</span>
                                                                                                <p className="m-0">
                                                                                                    +15% emission
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* *********************** */}
                                                                                            <div className="flight_price">
                                                                                                <p className="m-0 fw-semibold ">

                                                                                                    {displayPrice((item?.price || 0) * adultsCount)}
                                                                                                </p>
                                                                                                <p className="m-0">
                                                                                                    {item?.type}
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* ******************** select flight  */}
                                                                                            <div className="select_flight departure_item flight_res">
                                                                                                <Link
                                                                                                    href={`/booking-options?tok=${encodeURIComponent(item?.booking_token || "")}`}
                                                                                                    className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1  p-0 "
                                                                                                >
                                                                                                    Select flight
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </Accordion.Header>
                                                                        <Accordion.Body className=" bg-white acor_p">
                                                                            {/* Horizontal timing line **********************************/}
                                                                            {item?.flights?.map((item, i) => {
                                                                                return (
                                                                                    <React.Fragment
                                                                                        key={`best-${i}`}
                                                                                    >
                                                                                        <div
                                                                                            className="flex justify-between gap-6"
                                                                                            key={i}
                                                                                        >
                                                                                            {/* LEFT SIDE – Timeline */}
                                                                                            <div className="flex items-center gap-5 fligth_detail">
                                                                                                <div className="plane_logo flex flex-col justify-center items-center">
                                                                                                    <img
                                                                                                        src={item?.airline_logo}
                                                                                                        alt=""
                                                                                                        width={35}
                                                                                                    />
                                                                                                    <p className="">
                                                                                                        {item?.airline}
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="flights">
                                                                                                    {/* FLIGHT 1 */}
                                                                                                    <div className="relative pl-8 flight_border   ">
                                                                                                        {/* Dot */}
                                                                                                        <span className="absolute -left-[5px] dot2 top-2 w-3 h-3 bg-white border-2 border-gray-400 rounded-full"></span>

                                                                                                        <div className="departure_fligh">
                                                                                                            <p className="text-sm text-gray-900 font-medium m-0">
                                                                                                                {moment(
                                                                                                                    item
                                                                                                                        ?.departure_airport
                                                                                                                        ?.time,
                                                                                                                ).format(
                                                                                                                    "hh:mm A",
                                                                                                                )}{" "}
                                                                                                                ·{" "}
                                                                                                                {
                                                                                                                    item
                                                                                                                        ?.departure_airport
                                                                                                                        ?.name
                                                                                                                }{" "}
                                                                                                                (
                                                                                                                {
                                                                                                                    item
                                                                                                                        ?.departure_airport
                                                                                                                        ?.id
                                                                                                                }
                                                                                                                )
                                                                                                            </p>

                                                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                                                {travelTime}
                                                                                                                {/* <span className="text-red-500 font-medium"> Overnight</span> */}
                                                                                                            </p>
                                                                                                        </div>

                                                                                                        <span className="absolute -left-[5px]  w-3 h-3 dot-3 bg-white border-2 border-gray-400 rounded-full"></span>
                                                                                                        <div className="departure_fligh">
                                                                                                            <p className="text-sm text-gray-900 mt-2 mb-0">
                                                                                                                {moment(
                                                                                                                    item?.arrival_airport
                                                                                                                        ?.time,
                                                                                                                ).format(
                                                                                                                    "hh:mm A",
                                                                                                                )}{" "}
                                                                                                                ·{" "}
                                                                                                                {
                                                                                                                    item?.arrival_airport
                                                                                                                        ?.name
                                                                                                                }{" "}
                                                                                                                (
                                                                                                                {
                                                                                                                    item?.arrival_airport
                                                                                                                        ?.id
                                                                                                                }
                                                                                                                )
                                                                                                            </p>

                                                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                                                {item?.airline} ·{" "}
                                                                                                                {item?.airplane} ·{" "}
                                                                                                                {item?.travel_class} ·{" "}
                                                                                                                {item?.flight_number}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* LAYOVER */}
                                                                                            </div>

                                                                                            {/* RIGHT SIDE – Amenities */}
                                                                                            <div className="w-64 text-sm space-y-6 d-none d-lg-block ">
                                                                                                <p>{item?.extensions}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* RIGHT SIDE – Amenities */}
                                                                                        <div className="w-64 text-sm space-y-6 d-block d-lg-none excentation">
                                                                                            <p>{item?.extensions}</p>
                                                                                        </div>
                                                                                    </React.Fragment>
                                                                                );
                                                                            })}

                                                                            {/* Footer note */}
                                                                            <div className=" text-xs text-gray-500 ">
                                                                                {item?.extensions}
                                                                            </div>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </>

                                                            );
                                                        })}

                                                        {/* ************************ other flight shoiw */}
                                                        {flights.map((item, index) => {
                                                            const segment = item?.flights?.[0];
                                                            console.log(item, "loppppppppppppppppppppe");

                                                            const departure =
                                                                segment?.departure_airport?.time;
                                                            const arrival = segment?.arrival_airport?.time;

                                                            const dep_id = segment?.departure_airport?.id;
                                                            const arri_id = segment?.arrival_airport?.id;

                                                            const travelMinutes = moment(arrival).diff(
                                                                moment(departure),
                                                                "minutes",
                                                            );
                                                            const travelHours = Math.floor(
                                                                travelMinutes / 60,
                                                            );
                                                            const travelRemainingMinutes = travelMinutes % 60;
                                                            const travelTime = `${travelHours}h ${travelRemainingMinutes}m`;

                                                            return (
                                                                <>
                                                                    <Accordion.Item eventKey={`other-${index}`}>
                                                                        <Accordion.Header
                                                                            className="flight_accordian "
                                                                            onClick={() => {
                                                                                setShowText(true)
                                                                                if (otherActiveKey === index) {
                                                                                    setOtherActiveKey(null)
                                                                                }
                                                                                else {
                                                                                    setOtherActiveKey(index)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div className="acor_header  w-full">
                                                                                {otherActiveKey !== index ? (
                                                                                    <div className="items return-flight-item  flex items-center justify-between">
                                                                                        <div className="img ps-3">
                                                                                            <img
                                                                                                src={segment?.airline_logo}
                                                                                                width={40}
                                                                                                height={40}
                                                                                                alt=""
                                                                                            />
                                                                                        </div>
                                                                                        {/* ****** */}
                                                                                        <div className="time acot-tit dis_txt">
                                                                                            <span>
                                                                                                {moment(departure).format(
                                                                                                    "ddd, MMM D h:mm A",
                                                                                                )}{" "}
                                                                                                –{" "}
                                                                                                {moment(arrival).format(
                                                                                                    "h:mm A",
                                                                                                )}
                                                                                            </span>
                                                                                            <p>{item?.airline}</p>
                                                                                        </div>
                                                                                        {/* ************* */}
                                                                                        <div className="hout_tm acot-tit tt-c dis_no">
                                                                                            <span> {travelTime}</span>
                                                                                            <p>
                                                                                                {dep_id} - {arri_id}
                                                                                            </p>
                                                                                        </div>
                                                                                        {/* ********* */}
                                                                                        <div className="stops acot-tit tt-c dis_no">
                                                                                            <span>{ }</span>
                                                                                        </div>
                                                                                        {/* ******** weight */}
                                                                                        <div className="weigth acot-tit tt-c dis_no">
                                                                                            <span>
                                                                                                {(
                                                                                                    item?.carbon_emissions
                                                                                                        ?.this_flight / 1000
                                                                                                ).toFixed(0)}{" "}
                                                                                                kg CO2
                                                                                            </span>
                                                                                            <p>
                                                                                                +
                                                                                                {
                                                                                                    item?.carbon_emissions
                                                                                                        ?.difference_percent
                                                                                                }
                                                                                                % emission
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="items inner_tab_items full_det_item flex items-center  justify-between w-full">
                                                                                        <div className="img ps-3 flex justify-between items-center">
                                                                                            <img
                                                                                                src={item?.airline_logo}
                                                                                                width={40}
                                                                                                height={40}
                                                                                                alt=""
                                                                                            />
                                                                                            <div className="time acot-tit d-block d-lg-none ">
                                                                                                <h2 className="m-0" id="h3">
                                                                                                    Departing flight{" "}
                                                                                                    {moment(departure).format(
                                                                                                        "ddd, MMM D",
                                                                                                    )}
                                                                                                </h2>
                                                                                                <p className=" m-0 ">
                                                                                                    {item?.airline}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="items_flights flex items-center gap-5 pe-3">
                                                                                            {/* ****** */}
                                                                                            <div className="time acot-tit d-none d-lg-block ">
                                                                                                <h2 className="m-0" id="h3">
                                                                                                    Departing flight{" "}
                                                                                                    {moment(departure).format(
                                                                                                        "ddd, MMM D",
                                                                                                    )}
                                                                                                </h2>
                                                                                                <p className=" m-0 ">
                                                                                                    {item?.airline}
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* ************* */}

                                                                                            {/* ******** weight */}
                                                                                            <div className="weigth acot-tit dis_no">
                                                                                                <span>118 kg CO2e</span>
                                                                                                <p className="m-0">
                                                                                                    +15% emission
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* *********************** */}
                                                                                            <div className="flight_price">
                                                                                                <p className="m-0 fw-semibold ">

                                                                                                    {displayPrice((item?.price || 0) * adultsCount)}
                                                                                                    {/* {(
                                                                                                        (item?.price || 0) *
                                                                                                        adultsCount
                                                                                                    ).toLocaleString()} */}
                                                                                                </p>
                                                                                                <p className="m-0">
                                                                                                    {item?.type}
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* ******************** select flight  */}
                                                                                            <div className="select_flight departure_item flight_res">
                                                                                                <Link
                                                                                                    href={`/booking-options?tok=${encodeURIComponent(item?.booking_token || "")}`}
                                                                                                    className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1  p-0 "
                                                                                                >
                                                                                                    Select flight
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </Accordion.Header>
                                                                        <Accordion.Body className="bg-white acor_p">
                                                                            {/* Horizontal timing line **********************************/}
                                                                            {item?.flights?.map((item, i) => {
                                                                                return (
                                                                                    <React.Fragment
                                                                                        key={`other-${index}`}
                                                                                    >
                                                                                        <div
                                                                                            className="flex justify-between gap-6"
                                                                                            key={i}
                                                                                        >
                                                                                            {/* LEFT SIDE – Timeline */}
                                                                                            <div className="flex items-center gap-5 fligth_detail">
                                                                                                <div className="plane_logo flex flex-col justify-center items-center">
                                                                                                    <img
                                                                                                        src={item?.airline_logo}
                                                                                                        alt=""
                                                                                                        width={35}
                                                                                                    />
                                                                                                    <p className="">
                                                                                                        {item?.airline}
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="flights">
                                                                                                    {/* FLIGHT 1 */}
                                                                                                    <div className="relative pl-8 flight_border   ">
                                                                                                        {/* Dot */}
                                                                                                        <span className="absolute -left-[5px] dot2 top-2 w-3 h-3 bg-white border-2 border-gray-400 rounded-full"></span>

                                                                                                        <div className="departure_fligh">
                                                                                                            <p className="text-sm text-gray-900 font-medium m-0">
                                                                                                                {moment(
                                                                                                                    item
                                                                                                                        ?.departure_airport
                                                                                                                        ?.time,
                                                                                                                ).format(
                                                                                                                    "hh:mm A",
                                                                                                                )}{" "}
                                                                                                                ·{" "}
                                                                                                                {
                                                                                                                    item
                                                                                                                        ?.departure_airport
                                                                                                                        ?.name
                                                                                                                }{" "}
                                                                                                                (
                                                                                                                {
                                                                                                                    item
                                                                                                                        ?.departure_airport
                                                                                                                        ?.id
                                                                                                                }
                                                                                                                )
                                                                                                            </p>

                                                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                                                {travelTime}
                                                                                                                {/* <span className="text-red-500 font-medium"> Overnight</span> */}
                                                                                                            </p>
                                                                                                        </div>

                                                                                                        <span className="absolute -left-[5px]  w-3 h-3 dot-3 bg-white border-2 border-gray-400 rounded-full"></span>
                                                                                                        <div className="departure_fligh">
                                                                                                            <p className="text-sm text-gray-900 mt-2 mb-0">
                                                                                                                {moment(
                                                                                                                    item?.arrival_airport
                                                                                                                        ?.time,
                                                                                                                ).format(
                                                                                                                    "hh:mm A",
                                                                                                                )}{" "}
                                                                                                                ·{" "}
                                                                                                                {
                                                                                                                    item?.arrival_airport
                                                                                                                        ?.name
                                                                                                                }{" "}
                                                                                                                (
                                                                                                                {
                                                                                                                    item?.arrival_airport
                                                                                                                        ?.id
                                                                                                                }
                                                                                                                )
                                                                                                            </p>

                                                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                                                {item?.airline} ·{" "}
                                                                                                                {item?.airplane} ·{" "}
                                                                                                                {item?.travel_class} ·{" "}
                                                                                                                {item?.flight_number}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* LAYOVER */}
                                                                                            </div>

                                                                                            {/* RIGHT SIDE – Amenities */}
                                                                                            <div className="w-64 text-sm space-y-6 d-none d-lg-block ">
                                                                                                <p>{item?.extensions}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* RIGHT SIDE – Amenities */}
                                                                                        <div className="w-64 text-sm space-y-6 d-block d-lg-none excentation">
                                                                                            <p>{item?.extensions}</p>
                                                                                        </div>
                                                                                    </React.Fragment>
                                                                                );
                                                                            })}

                                                                            {/* Footer note */}
                                                                            <div className=" text-xs text-gray-500 ">
                                                                                {item?.extensions}
                                                                            </div>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </Accordion>

                                            {/* ******************************* */}
                                        </div>

                                        {/* ****************************************** */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* **************************** */}
                    {/* Flight Card */}
                </div>
            </section>
        </>
    );
}
