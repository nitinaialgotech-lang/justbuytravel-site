"use client";

import React, { useState } from "react";
import {
    FiChevronUp,
    FiChevronDown,
} from "react-icons/fi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
    IoClose,
    IoCheckmarkCircle,
    IoDocumentTextOutline,
} from "react-icons/io5";
import { MdEventSeat } from "react-icons/md";
import { FaSuitcase } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { GetSerpBookingOptions } from "@/app/Route/endpoints";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import moment from "moment";
import { VscArrowSwap } from "react-icons/vsc";
import { Accordion } from "react-bootstrap";
import { GiSchoolBag } from "react-icons/gi";
import { buildAffiliateLinks } from "@/lib/affiliateLinks";
import Link from "next/link";
import { getAssetPath } from "@/app/utils/assetPath";
// Placeholder airline logo - replace with real logo URL from your API when available
const BRITISH_AIRWAYS_LOGO = "";


const fareOptions = [
    {
        name: "Basic Economy",
        priceUsd: 188,
        priceEur: 173,
        features: [
            { text: "No refunds", type: "negative" },
            { text: "Ticket changes for a fee", type: "conditional", icon: "doc" },
            { text: "Seat selection for a fee", type: "conditional", icon: "seat" },
            { text: "Standard seat", type: "included" },
            { text: "1 free carry-on", type: "included" },
            { text: "1st checked bag: $99 (€90)", type: "bagFee", icon: "suitcase" },
        ],
    },
    {
        name: "Economy Plus",
        priceUsd: 224,
        priceEur: 206,
        features: [
            { text: "No refunds", type: "negative" },
            { text: "Ticket changes for a fee", type: "conditional", icon: "doc" },
            { text: "Seat selection for a fee", type: "conditional", icon: "seat" },
            { text: "Standard seat", type: "included" },
            { text: "1 free carry-on", type: "included" },
            { text: "1st checked bag up to 23 kg free", type: "included" },
        ],
    },
    {
        name: "Club Business Plus",
        priceUsd: 477,
        priceEur: 437,
        features: [
            { text: "No refunds", type: "negative" },
            { text: "Ticket changes for a fee", type: "conditional", icon: "doc" },
            { text: "Seat selection for a fee", type: "conditional", icon: "seat" },
            { text: "Premium seat", type: "included" },
            { text: "1 free carry-on", type: "included" },
            { text: "1st checked bag up to 32 kg free", type: "included" },
        ],
    },
];

const otherAirlines = [
    { name: "BudgetAir", priceUsd: 232, priceEur: 213, subtitle: null, color: "text-emerald-600" },
    { name: "Airpaz", priceUsd: 236, priceEur: 216, subtitle: null, color: "text-red-600" },
    { name: "Martigo", priceUsd: 240, priceEur: 220, subtitle: null, color: "text-pink-600" },
    { name: "Kiwi.com", priceUsd: 251, priceEur: 220, subtitle: null, color: "text-blue-600" },
];

function FeatureIcon({ type, icon }) {
    if (type === "negative")
        return <IoClose className="shrink-0 w-5 h-5 text-red-500" aria-hidden />;
    if (type === "included")
        return <IoCheckmarkCircle className="shrink-0 w-5 h-5 text-emerald-500" aria-hidden />;
    if (icon === "doc")
        return <IoDocumentTextOutline className="shrink-0 w-5 h-5 text-gray-500" aria-hidden />;
    if (icon === "seat")
        return <MdEventSeat className="shrink-0 w-5 h-5 text-gray-500" aria-hidden />;
    if (icon === "suitcase")
        return <FaSuitcase className="shrink-0 w-5 h-5 text-gray-500" aria-hidden />;
    return null;
}

export default function Booking_Option_Detail({ airlineName = "British Airways",
    airlineLogo = BRITISH_AIRWAYS_LOGO,

    onContinue,
}) {
    const [hideAirlineOptions, setHideAirlineOptions] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const showLogo = airlineLogo && !logoError;
    const [showText, setShowText] = useState(false)
    const [activeKey, setActiveKey] = useState(null);

    // **************************** api fo booking

    const type = useSelector((state) => state.user.type);
    const travelClass = useSelector((state) => state.user.travelClass) || 1;
    const adults = useSelector((state) => state.user.passen_count) || "1";
    const childrenCount = useSelector((state) => state.user.children_count) || "0";
    const infantCount = useSelector((state) => state.user.infant_count) || "0";
    const adultsCount = Math.max(1, parseInt(adults, 10) || 1);
    const childrenCountNum = Math.max(0, parseInt(childrenCount, 10) || 0);
    const infantCountNum = Math.max(0, parseInt(infantCount, 10) || 0);
    const departure_id = useSelector((state) => state.user.SearchFlight.startfrom);
    const start_date = useSelector((state) => state.user.SearchFlight.startDate);
    const back_date = useSelector((state) => state.user.SearchFlight.endDate);
    const arrival_id = useSelector((state) => state.user.SearchFlight.endto);
    const multi_flight_city = useSelector((state) => state.user.multi_flight_city);
    const getData = useSearchParams();
    // Base64 tokens may have + which URL can decode as space; restore for SerpAPI
    const rawTok = getData.get("tok") || "";
    const booking_token = rawTok.replace(/ /g, "+").trim();

    const outbound_date = start_date ? moment(start_date).format("YYYY-MM-DD") : (multi_flight_city?.[0]?.dateTime ? moment(multi_flight_city[0].dateTime).format("YYYY-MM-DD") : moment().add(7, "days").format("YYYY-MM-DD"));
    const return_date = back_date ? moment(back_date).format("YYYY-MM-DD") : (multi_flight_city?.[1]?.dateTime ? moment(multi_flight_city[1].dateTime).format("YYYY-MM-DD") : "");

    // For multi-city (type 3): build multi_city_json from Redux
    const multi_city_json = React.useMemo(() => {
        if (Number(type) !== 3 || !Array.isArray(multi_flight_city)) return null;
        const legs = multi_flight_city
            .map((f) => {
                const arr = f?.arrival_id ?? f?.arrive_id ?? "";
                const d = f?.date || (f?.dateTime ? moment(f.dateTime).format("YYYY-MM-DD") : "");
                return {
                    departure_id: f?.departure_id || "",
                    arrival_id: arr,
                    date: d,
                };
            })
            .filter((l) => l.departure_id && l.arrival_id && l.date);
        return legs.length >= 2 ? legs : null;
    }, [type, multi_flight_city]);

    const payload = React.useMemo(() => {
        const base = {
            type: String(type),
            booking_token,
            adults: adultsCount,
            children: childrenCountNum,
            infants_on_lap: infantCountNum,
            travel_class: travelClass,
        };
        if (Number(type) === 3 && multi_city_json) {
            base.multi_city_json = multi_city_json;
        } else {
            base.departure_id = departure_id;
            base.arrival_id = arrival_id;
            base.outbound_date = outbound_date;
            base.return_date = type === 2 ? undefined : return_date;
        }
        return base;
    }, [type, booking_token, multi_city_json, departure_id, arrival_id, outbound_date, return_date, adultsCount, childrenCountNum, infantCountNum, travelClass]);

    const enabled =
        !!booking_token &&
        (Number(type) === 3 ? !!multi_city_json : !!(departure_id && arrival_id && outbound_date));

    const { data } = useQuery({
        queryKey: ["bookingoptions", payload],
        queryFn: () => GetSerpBookingOptions(payload),
        enabled,
    });

    console.log(data, "bbbbbbbbbbbbbbbboookingnnnnnnnnnnnnnnn");
    const SelectedFlightResult = data?.data?.results?.selected_flights;
    const selectedFlights = data?.data?.results?.selected_flights || [];
    const bookingOptions = data?.data?.results?.booking_options;
    const priceInsights = data?.data?.results?.price_insights;
    const baggageInfo = data?.data?.results?.baggage_prices?.together || [];

    const parsePrice = (v) => {
        if (typeof v === "number" && !Number.isNaN(v)) return v;
        if (typeof v === "string") return parseFloat(v.replace(/[^0-9.-]/g, "")) || 0;
        return 0;
    };
    const lowestPrice = React.useMemo(() => {
        const fromInsights = parsePrice(priceInsights?.lowest_price);
        if (fromInsights > 0) return fromInsights;
        const prices = (bookingOptions || [])
            .map((o) => parsePrice(o?.together?.price))
            .filter((p) => p > 0);
        return prices.length ? Math.min(...prices) : 0;
    }, [priceInsights?.lowest_price, bookingOptions]);

    // Affiliate OTA links – always shown, dynamic from search params
    const depForAffiliate = departure_id || multi_flight_city?.[0]?.departure_id || "IXC";
    const arrForAffiliate = arrival_id || (multi_flight_city?.length > 0 ? (multi_flight_city[multi_flight_city.length - 1]?.arrival_id ?? multi_flight_city[multi_flight_city.length - 1]?.arrive_id) : null) || "DEL";
    const totalPassengers = adultsCount + childrenCountNum + infantCountNum;
    const affiliateOTAs = React.useMemo(() => {
        const links = buildAffiliateLinks({
            dep: depForAffiliate,
            arr: arrForAffiliate,
            outboundDate: outbound_date,
            returnDate: type !== 2 ? return_date : undefined,
            adults: adultsCount,
            children: childrenCountNum,
            infants: infantCountNum,
            travelClass,
            tripType: type,
        });
        const basePrice = lowestPrice || 150;
        return links.map((l) => ({
            ...l,
            priceUsd: Math.round(basePrice * (1 + (l.priceOffset || 0))),
        }));
    }, [depForAffiliate, arrForAffiliate, outbound_date, return_date, adultsCount, childrenCountNum, infantCountNum, travelClass, type, lowestPrice, bookingOptions]);
    return (
        <section className="booking-options py-4">
            <div className="container">
                <div className="row justify-center">
                    <div className="col-lg-12">
                        <div className="bg-white rounded card_rounded border border-gray-200  overflow-hidden">
                            {/* Section header */}
                            <div className="px-4 md:px-6 pt-5 pb-3 border-b border-gray-100 padding_md">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="left_detail">

                                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex gap-2 items-center capitalize ">
                                            <span>{departure_id} </span> <span className="swip"><VscArrowSwap /></span> <span>{arrival_id}</span>
                                        </h2>
                                        {/* ******************* */}
                                        <div className="departure_time space-y-1">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1 text">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-gray-700 card_rounded border-emerald-100">
                                                    RoundTrip
                                                </span>

                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 card_rounded border-gray-200 sky_yellow">
                                                    Ecomnomy
                                                </span>


                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50  card_rounded border-emerald-100 sky_green text-gray-700">
                                                    {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
                                                    {childrenCountNum > 0 || infantCountNum > 0 ? ` (${adultsCount}A${childrenCountNum > 0 ? ` ${childrenCountNum}C` : ""}${infantCountNum > 0 ? ` ${infantCountNum}I` : ""})` : ""}
                                                </span>

                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        type="button"
                                        className=" text-sm text-gray-500  hover:text-gray-700 transition-colors"
                                    >
                                        <h2 className="m-0 p-0 text-black"> ${lowestPrice > 0 ? lowestPrice.toLocaleString() : "—"}</h2>
                                        <p className="m-0">Lowest total price ({totalPassengers} {totalPassengers !== 1 ? "passengers" : "passenger"})</p>

                                    </div>
                                </div>


                            </div>

                            {/* Affiliate OTA links – always shown */}
                            <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                                <h3 className="text-base font-semibold text-gray-900  mb-1">Compare prices</h3>
                                <p className="text-xs text-gray-500 mb-3">* Prices are approximate and may change on the booking website.</p>
                                {/* <div className="space-y-2">
                                    {affiliateOTAs.map((ota, idx) => (
                                        <div
                                            key={`aff-${idx}`}
                                            className="flex flex-wrap items-center justify-between gap-3 py-2"
                                        >
                                            <span className="font-medium text-gray-900">{ota.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-semibold text-gray-900">
                                                    From ${ota.priceUsd.toLocaleString()}
                                                </span>
                                                <a
                                                    href={ota.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer sponsored"
                                                    className="button_bg2 rounded text-sm font-semibold px-4 py-2 inline-block text-center no-underline"
                                                >
                                                    View Deals
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div> */}
                            </div>

                            {/* British Airways block */}

                            <div className="book_fligh">
                                <div className="selected_flight">

                                    <div className="px-4 md:px-6 py-3 flight_book">
                                        <div
                                            className="flex flex-wrap tap items-center justify-between gap-3  pb-3 border-b border-gray-100"
                                            role="group"
                                            aria-label="Book with British Airways"
                                        >

                                            <div className="flex tap-content items-center gap-3">
                                                {showLogo ? (
                                                    <img
                                                        src={airlineLogo}
                                                        alt={airlineName}
                                                        className="w-10 h-10 object-contain bg-white rounded"
                                                        onError={() => setLogoError(true)}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600"
                                                        aria-hidden
                                                    >
                                                        {airlineName
                                                            .split(" ")
                                                            .map((w) => w[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900">
                                                    Selected Flights
                                                    <p className="m-0 d-block d-lg-none">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium  text-gray-600 sky_yellow ">
                                                            Airline
                                                        </span>
                                                    </p>
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium sky_yellow text-gray-600 dis_no">
                                                    Airline
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                    {/* Other airlines list */}
                                    <div className="accordian_section booking_selected_flight ">
                                        <Accordion onSelect={(eventKey) =>
                                            setActiveKey(eventKey === activeKey ? null : eventKey)
                                        }>
                                            {selectedFlights?.map((flightGroup, index) => {

                                                const firstFlight = flightGroup.flights?.[0];
                                                const lastFlight =
                                                    flightGroup.flights?.[flightGroup.flights.length - 1];

                                                const departureTime = firstFlight?.departure_airport?.time;
                                                const arrivalTime = lastFlight?.arrival_airport?.time;

                                                return (
                                                    <React.Fragment key={`flight-${index}`}>

                                                        <Accordion.Item eventKey={String(index)}>
                                                            <Accordion.Header>
                                                                <div className="acor_header  booking_accor">
                                                                    {
                                                                        activeKey !== index ?

                                                                            <div className="items flex  justify-between">
                                                                                <div className="img">
                                                                                    <img src={flightGroup?.airline_logo} width={30} height={30} alt="" />
                                                                                </div>
                                                                                {/* ****** */}
                                                                                <div className="time acot-tit dis_txt">
                                                                                    <span> {moment(departureTime).format("ddd, MMM D h:mm A")} –{" "}
                                                                                        {moment(arrivalTime).format("h:mm A")}</span>
                                                                                    <p>{firstFlight?.airline}</p>
                                                                                </div>
                                                                                {/* ************* */}
                                                                                <div className="hout_tm acot-tit tt-c dis_no">
                                                                                    <span>{Math.floor(flightGroup.total_duration / 60)}h{" "} {flightGroup.total_duration % 60}m</span>
                                                                                    <p>{firstFlight?.departure_airport?.id} -{" "}
                                                                                        {lastFlight?.arrival_airport?.id}</p>
                                                                                </div>
                                                                                {/* ********* */}
                                                                                <div className="stops acot-tit  tt-c dis_no">
                                                                                    <span>nonstop</span>
                                                                                </div>
                                                                                {/* ******** weight */}
                                                                                <div className="weigth acot-tit tt-c dis_no">
                                                                                    <span>
                                                                                        {(flightGroup?.carbon_emissions?.this_flight / 1000).toFixed(
                                                                                            0
                                                                                        )}</span>
                                                                                    <p>
                                                                                        {flightGroup?.carbon_emissions?.difference_percent}% emission
                                                                                    </p>
                                                                                </div>
                                                                            </div> :

                                                                            <div className="items flex  justify-between">
                                                                                <div className="img">
                                                                                    <img src={flightGroup?.airline_logo} width={30} height={30} alt="" />
                                                                                </div>
                                                                                {/* ****** */}
                                                                                <div className="time acot-tit">
                                                                                    <h2 className="m-0">Departing flight
                                                                                        Sun, Feb 15</h2>
                                                                                    <p className=" m-0">indogo</p>
                                                                                </div>
                                                                                {/* ************* */}
                                                                                {/* ******** weight */}
                                                                                <div className="weigth acot-tit dis_no">
                                                                                    <span>
                                                                                        118 kg CO2e</span>
                                                                                    <p>
                                                                                        +15% emission
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                    }



                                                                </div>

                                                            </Accordion.Header>
                                                            <Accordion.Body className="acor_p">
                                                                {/* Horizontal timing line **********************************/}
                                                                {flightGroup.flights.map((segment, i) => {
                                                                    const depTime = segment?.departure_airport?.time;
                                                                    const arrTime = segment?.arrival_airport?.time;
                                                                    const depDateLabel = depTime
                                                                        ? `${segment?.departure_airport?.id || ""} · ${moment(depTime).format("MMM DD")}`
                                                                        : "";
                                                                    const arrDateLabel = arrTime
                                                                        ? `${segment?.arrival_airport?.id || ""} · ${moment(arrTime).format("MMM DD")}`
                                                                        : "";
                                                                    const stopsCount = (flightGroup.flights?.length || 1) - 1;
                                                                    const stopsLabel =
                                                                        stopsCount === 0
                                                                            ? "Non-stop"
                                                                            : stopsCount === 1
                                                                                ? "1 stop"
                                                                                : `${stopsCount} stops`;
                                                                    let durationLabel = "";
                                                                    if (depTime && arrTime) {
                                                                        const diffMinutes = moment(arrTime).diff(moment(depTime), "minutes");
                                                                        const hours = Math.floor(diffMinutes / 60);
                                                                        const minutes = diffMinutes % 60;
                                                                        durationLabel = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
                                                                    } else if (segment?.duration) {
                                                                        durationLabel = `${Math.floor(segment.duration / 60)}h ${segment.duration % 60}m`;
                                                                    }

                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className="row items-center border_custom rounded px-3 py-3   md:px-4 md:py-4 bg-white  transition-all duration-200 cursor-pointer md-p1 pad-0 border-no"
                                                                        >
                                                                            <div className="col-lg-10 mt-3 flex gap-2 justify-between md-p0 md-flex">
                                                                                <div
                                                                                    className="flex flex-col gap-3 w-full rounded-xl bg-gray-50 px-3 py-3 mb-2"

                                                                                >
                                                                                    {/* Top row: times & line */}
                                                                                    <div className="flex items-center justify-between gap-3">
                                                                                        {/* Left time */}
                                                                                        <div className="text-left">
                                                                                            <div className="text-base font-semibold text-gray-900">
                                                                                                {depTime ? moment(depTime).format("h:mm A") : "—"}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600 text">
                                                                                                {depDateLabel || "—"}
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
                                                                                                {arrTime ? moment(arrTime).format("h:mm A") : "—"}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600 text">
                                                                                                {arrDateLabel || "—"}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Airline label under line for mobile / small */}
                                                                                    {(segment?.airline || segment?.flight_number) && (
                                                                                        <div className="text-xs text-gray-600 text">
                                                                                            {[segment.airline, segment.flight_number].filter(Boolean).join(" • ")}
                                                                                        </div>
                                                                                    )}

                                                                                </div>

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
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </Accordion>
                                    </div>
                                    {/* ************************* bages */}
                                    <div className="bag_carry_section">
                                        <div className="beg_carry_detail flex gap-4 ">
                                            {
                                                baggageInfo?.map((item, idx) => (
                                                    <div key={idx} className="bag_item flex items-center gap-1">
                                                        <span>
                                                            <GiSchoolBag />
                                                        </span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    {/* ****************************************** */}





                                    <div className="price_list border-t border-gray-100">
                                        {affiliateOTAs?.map((ota, idx) => {
                                            console.log(ota, ".................>>>>>>>>>>affiliateOTAs");

                                            return (


                                                <div
                                                    key={idx}
                                                    className={`flex flex-wrap items-center justify-between gap-3  price_box
                                                             "border-b border-gray-100"
                                                            
                                                            `}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span
                                                            className={`flex items-center justify-center w-30 h-10 rounded-lg font-semibold text-lg `}

                                                        >
                                                            <img src={ota?.logo} width={100} alt="" />
                                                        </span>
                                                        {/* <div className="pt-text">
                                                            <p className="font-medium text-gray-900 m-0">
                                                                Book with {ota.name}
                                                            </p>

                                                        </div> */}
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div className="text-right pt_rice">
                                                            <span className="text-lg font-semibold text-gray-900  m-0">
                                                                ${ota.priceUsd.toLocaleString()}
                                                            </span>



                                                        </div>
                                                        <Link
                                                            href={ota.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer sponsored"

                                                            className="button_bg2  rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight2 "
                                                        >
                                                            Continue
                                                        </Link>
                                                    </div>
                                                </div>

                                            )
                                        }
                                        )}





                                    </div>




                                    {/* <div className="price_list border-t border-gray-100">
                                        {bookingOptions?.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex flex-wrap items-center justify-between gap-3  price_box
                                                             "border-b border-gray-100"
                                                            
                                                            `}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <span
                                                                className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-lg ${item.color}`}

                                                            >
                                                                <img src={item?.together?.airline_logos} width={30} alt="" />
                                                            </span>
                                                            <div className="pt-text">
                                                                <p className="font-medium text-gray-900 m-0">
                                                                    Book with {item?.together?.book_with}
                                                                </p>

                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <div className="text-right pt_rice">
                                                                <span className="text-lg font-semibold text-gray-900  m-0">
                                                                    ${((item?.together?.price || 0) * adultsCount).toLocaleString()}
                                                                </span>

                                                                <span className="block text-xs text-gray-500">
                                                                    ₹{((item?.together?.local_prices?.[0]?.price || 0) * adultsCount).toLocaleString()}
                                                                </span>

                                                            </div>
                                                            <button
                                                                type="button"

                                                                className="button_bg2  rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight2 "
                                                            >
                                                                Continue
                                                            </button>
                                                        </div>
                                                    </div>
                                        ))}


                                    </div> */}
                                </div>

                            </div>




                        </div>
                    </div>
                </div>








                {/* **************************** */}
                {/* Flight Card */}


            </div>
        </section>
    );
}