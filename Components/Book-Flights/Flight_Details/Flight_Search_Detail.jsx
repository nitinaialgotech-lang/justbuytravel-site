"use client";
import { GetSerpFlights } from "@/app/Route/endpoints";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Link from "next/link";

/** =========================
 *  Expedia Affiliate Helpers
 *  ========================= */

// Your Expedia affiliate IDs (from your affiliate link)
const EXPEDIA_AID = "15042831";
const EXPEDIA_PID = "101601019";

// Choose domain (use .com or .co.in)
const EXPEDIA_DOMAIN = "https://www.expedia.com"; // or "https://www.expedia.co.in"

function normalizeAirportCode(code) {
  if (!code) return "";
  return String(code).trim().toUpperCase();
}

function cabinToExpedia(travelClass) {
  // Expedia accepts: economy, premiumeconomy, business, first
  const v = String(travelClass || "").toLowerCase();
  if (v.includes("premium")) return "premiumeconomy";
  if (v.includes("business")) return "business";
  if (v.includes("first")) return "first";
  return "economy";
}

/**
 * Builds a clean Expedia Flights Search URL
 */
function buildExpediaFlightsSearchUrl({
  fromCode,
  toCode,
  outboundDate, // YYYY-MM-DD
  returnDate, // YYYY-MM-DD (optional for one way)
  tripType, // "roundtrip" | "oneway"
  adults = 1,
  children = 0,
  infantInLap = 0,
  cabin = "economy",
  domain = EXPEDIA_DOMAIN,
}) {
  const from = normalizeAirportCode(fromCode);
  const to = normalizeAirportCode(toCode);

  // Expedia leg format usually: DD/MM/YYYYTANYT
  const outLegDate = moment(outboundDate, "YYYY-MM-DD").format("DD/MM/YYYY");
  const retLegDate = returnDate
    ? moment(returnDate, "YYYY-MM-DD").format("DD/MM/YYYY")
    : "";

  const url = new URL("/Flights-Search", domain);

  url.searchParams.set("mode", "search");
  url.searchParams.set("flight-type", "on");
  url.searchParams.set("options", `cabinclass:${cabin}`);
  const infantVal = infantInLap > 0 ? infantInLap : "N";
  const passParts = [
    `adults:${adults}`,
    `children:${children}`,
    `infantinlap:${infantVal}`,
  ];
  url.searchParams.set("passengers", passParts.join(","));

  // Optional date params (Expedia often includes them)
  url.searchParams.set(
    "fromDate",
    moment(outboundDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
  );

  if (tripType === "oneway") {
    url.searchParams.set("trip", "oneway");
    url.searchParams.set(
      "leg1",
      `from:${from},to:${to},departure:${outLegDate}TANYT`,
    );
    url.searchParams.set(
      "d1",
      moment(outboundDate, "YYYY-MM-DD").format("YYYY-M-D"),
    );
  } else {
    url.searchParams.set("trip", "roundtrip");
    url.searchParams.set(
      "leg1",
      `from:${from},to:${to},departure:${outLegDate}TANYT`,
    );
    url.searchParams.set(
      "leg2",
      `from:${to},to:${from},departure:${retLegDate}TANYT`,
    );

    url.searchParams.set(
      "toDate",
      moment(returnDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
    );
    url.searchParams.set(
      "d1",
      moment(outboundDate, "YYYY-MM-DD").format("YYYY-M-D"),
    );
    url.searchParams.set(
      "d2",
      moment(returnDate, "YYYY-MM-DD").format("YYYY-M-D"),
    );
  }

  return url.toString();
}

/**
 * Attach affiliate tracking params (clean way)
 */
function addExpediaAffiliateParams(expediaUrl, { AID, PID, SID }) {
  const url = new URL(expediaUrl);
  if (AID) url.searchParams.set("AID", String(AID));
  if (PID) url.searchParams.set("PID", String(PID));
  if (SID) url.searchParams.set("SID", String(SID));
  return url.toString();
}

/**
 * Final affiliate URL builder (use this for both desktop + mobile)
 */
function getExpediaAffiliateUrl({
  departure_id,
  arrival_id,
  outbound_date,
  return_date,
  type,
  travel_class,
  adults,
  children = 0,
  infantInLap = 0,
}) {
  const cabin = cabinToExpedia(travel_class);
  const tripType = type === "oneway" ? "oneway" : "roundtrip";

  const searchUrl = buildExpediaFlightsSearchUrl({
    fromCode: departure_id,
    toCode: arrival_id,
    outboundDate: outbound_date,
    returnDate: tripType === "roundtrip" ? return_date : null,
    tripType,
    adults: Number(adults || 1),
    children: Number(children || 0),
    infantInLap: Number(infantInLap || 0),
    cabin,
    domain: EXPEDIA_DOMAIN,
  });

  // Dynamic SID so you can track route/dates clicks
  const SID = `route-${departure_id}-${arrival_id}-${outbound_date}-${tripType}-${adults}`;

  return addExpediaAffiliateParams(searchUrl, {
    AID: EXPEDIA_AID,
    PID: EXPEDIA_PID,
    SID,
  });
}

export default function Flight_Search_Detail() {
  const [flights, setFlights] = useState("");
  const engine = "google_flights";

  const searchTriggered = useSelector((state) => state.user.searchTriggered);
  const departure_id = useSelector(
    (state) => state.user.SearchFlight.startfrom,
  );
  const start_date = useSelector((state) => state.user.SearchFlight.startDate);
  const back_date = useSelector((state) => state.user.SearchFlight.endDate);
  const arrival_id = useSelector((state) => state.user.SearchFlight.endto);
  const type = useSelector((state) => state.user.type);
  const travel_class = useSelector((state) => state.user.travelClass);
  const adults = useSelector((state) => state.user.passen_count);
  const children_count = useSelector((state) => state.user.children_count);
  const infant_count = useSelector((state) => state.user.infant_count);

  const outbound_date = moment(start_date).format("YYYY-MM-DD");
  const return_date = moment(back_date).format("YYYY-MM-DD");

  const pretty_outbound = moment(start_date).format("DD MMM, YYYY");
  const pretty_return =
    type === "roundtrip" && back_date
      ? moment(back_date).format("DD MMM, YYYY")
      : null;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "flights",
      engine,
      departure_id,
      outbound_date,
      return_date,
      arrival_id,
      type,
      travel_class,
      adults,
      children_count,
      infant_count,
    ],
    enabled:
      !!searchTriggered && !!departure_id && !!arrival_id && !!outbound_date,
    queryFn: () =>
      GetSerpFlights({
        engine,
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        type,
        travel_class,
        adults,
        children: children_count || 0,
        infants_on_lap: infant_count || 0,
      }),
    onSuccess: (data) => {
      setFlights(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const flight = data?.data?.flights?.best_flights || [];
  const other_flight = data?.data?.flights?.other_flights || [];
  console.log(other_flight, "........other ");

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="row ">
            <div className="col-lg-11">
              <div className="bg-white rounded card_rounded border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-9 w-32 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // Error state
  if (isError) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-8">
              <div className="bg-red-50 card_rounded border-red-100 text-red-700 rounded p-6 text-center space-y-2">
                <h2 className="text-lg font-semibold">
                  We couldn’t load flights right now
                </h2>
                <p className="text-sm opacity-80">
                  Please check your connection and try again in a moment.
                </p>
                <p className="text-xs opacity-60">
                  {error?.message || "Unexpected error occurred."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const hasFlights = Array.isArray(flight) && flight.length > 0;
  const hasOtherFlights =
    Array.isArray(other_flight) && other_flight.length > 0;
  const hasSearched =
    searchTriggered && departure_id && arrival_id && outbound_date;

  // Flight search API returns total price when adults is passed - no multiplication needed
  const displayPrice = (p) => {
    const n = Number(p);
    return isNaN(n) ? 0 : n;
  };

  // Pre-build affiliate URL once (same for all cards)
  const expediaAffiliateUrl = getExpediaAffiliateUrl({
    departure_id,
    arrival_id,
    outbound_date,
    return_date,
    type,
    travel_class,
    adults,
    children: children_count || 0,
    infantInLap: infant_count || 0,
  });

  console.log(flight, "flightttttttttttttttttttttttttttttttttttttttttttttt");

  return (
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
                  {Number(adults) ||
                  Number(children_count) ||
                  Number(infant_count) ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_yellow">
                      {[
                        Number(adults) > 0 &&
                          `${adults} adult${Number(adults) > 1 ? "s" : ""}`,
                        Number(children_count) > 0 &&
                          `${children_count} child${Number(children_count) > 1 ? "ren" : ""}`,
                        Number(infant_count) > 0 &&
                          `${infant_count} infant${Number(infant_count) > 1 ? "s" : ""}`,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  ) : null}
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
                <div className="departure_body  space-y-4">
                  {!hasSearched && (
                    <div className="py-8 text-center space-y-2">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">
                        Ready to search
                      </h3>
                      <p className="text-sm text-gray-600 max-w-md mx-auto">
                        Enter your departure, destination, dates above and click
                        Search to find flights.
                      </p>
                    </div>
                  )}
                  {hasSearched && !hasFlights && (
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

                      console.log(
                        item,
                        ",,,,,,,,,,,,,,,pkjpkpkkpk",
                        item?.flights,
                      );

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
                                  {displayPrice(
                                    item?.price ||
                                      data?.data?.flights?.price_insights
                                        ?.lowest_price,
                                  ).toLocaleString()}
                                </div>

                                <Link
                                  className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
                                  href={
                                    type == 1
                                      ? `/return-flight?tok=${encodeURIComponent(item?.departure_token || "")}`
                                      : `/booking-options?tok=${encodeURIComponent(item?.booking_token || "")}`
                                  }
                                >
                                  Select flight
                                </Link>
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
                                {displayPrice(
                                  item?.price ||
                                    data?.data?.flights?.price_insights
                                      ?.lowest_price,
                                ).toLocaleString()}
                              </div>
                              <Link
                                className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
                                href={`${type == 1 ? `/return-flight?tok=${encodeURIComponent(item?.departure_token || "")}` : `/booking-options?tok=${encodeURIComponent(item?.booking_token || "")}`}`}
                              >
                                Select flight
                              </Link>
                            </div>
                          </div>

                          {/* Horizontal timing line **********************************/}
                          <div className="col-lg-12 mt-3 flex gap-2 justify-between md-p0 md-flex">
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
                                      <div className="text-xs text-gray-600 text">
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
                          {item?.flights?.map((item, i) => {
                            console.log(item, ",.................>>>>>>>>>>");
                            return (
                              <>
                                <div className="col-lg-12 mt-3">
                                  <div className="side_content space-y-1 text-sm text-gray-600  ">
                                    <p className="p-0 m-0" key={i}>
                                      {item?.extensions?.map((item) => item)}
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      );
                    })}

                  {/* ******************************** OTHER FLIGHT SSSSSSSSS>>>>>>>> */}
                  <div className="other_flight">
                    <h2 className="capitalize ">other fligths</h2>

                    {hasOtherFlights &&
                      other_flight?.map((item, idx) => {
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

                        console.log(
                          item,
                          ",,,,,,,,,,,,,,,pkjpkpkkpk",
                          item?.flights,
                        );

                        return (
                          <div
                            className="row items-center border_custom rounded px-3 py-3 mb-3  md:px-4 md:py-4 bg-white  transition-all duration-200 cursor-pointer md-p1"
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
                                    {displayPrice(
                                      item?.price ||
                                        data?.data?.flights?.price_insights
                                          ?.lowest_price,
                                    ).toLocaleString()}
                                  </div>

                                  <Link
                                    className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
                                    href={`/booking-options?tok=${encodeURIComponent(item?.booking_token || "")}`}
                                  >
                                    Select flight
                                  </Link>
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
                                          item.carbon_emissions.this_flight /
                                          1000
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
                                  {displayPrice(
                                    item?.price ||
                                      data?.data?.flights?.price_insights
                                        ?.lowest_price,
                                  ).toLocaleString()}
                                </div>
                                <Link
                                  className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
                                  href={`${type === 1 ? `/return-flight?tok=${encodeURIComponent(item?.departure_token || "")}` : `/booking-options?tok=${encodeURIComponent(item?.booking_token || "")}`}`}
                                >
                                  Select flight
                                </Link>
                              </div>
                            </div>

                            {/* Horizontal timing line **********************************/}
                            <div className="col-lg-12 mt-3 flex gap-2 justify-between md-p0 md-flex">
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
                                  const diffMinutes = end.diff(
                                    start,
                                    "minutes",
                                  );
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
                                        <div className="text-xs text-gray-600 text">
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
                            {item?.flights?.map((item) => {
                              return (
                                <React.Fragment
                                  key={Math.random()
                                    .toString(36)
                                    .substring(2, 15)}
                                >
                                  <div className="col-lg-12 mt-1 ">
                                    <div className="side_content space-y-1 text-sm text-gray-600  ">
                                      <p className="m-0">
                                        {item?.extensions?.map((item) => item)}
                                      </p>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    // <section className="py-2">
    //   <div className="container">
    //     <div className="row justify-center departure_chart_section padding_b30 pb-6">
    //       <div className="col-lg-12 space-y-5">

    //         <div className="departure_title_head flex flex-col md:flex-row r md:justify-between p-0 gap-4 m-0">
    //           <div className="title section_title space-y-1 mb-2">
    //             <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-700">
    //               {departure_id && arrival_id && (
    //                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_green">
    //                   <span className="font-medium">{departure_id}</span>
    //                   <span className="text-gray-400">→</span>
    //                   <span className="font-medium">{arrival_id}</span>
    //                 </span>
    //               )}

    //               <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_red">
    //                 <span>{pretty_outbound}</span>
    //                 {pretty_return && (
    //                   <>
    //                     <span className="text-gray-400">–</span>
    //                     <span>{pretty_return}</span>
    //                   </>
    //                 )}
    //               </span>

    //               {adults && (
    //                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_yellow">
    //                   {adults} traveler{adults > 1 ? "s" : ""}
    //                 </span>
    //               )}

    //               {travel_class && (
    //                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded sky_blue capitalize">
    //                   {travel_class}
    //                 </span>
    //               )}
    //             </div>
    //           </div>
    //         </div>

    //         <div className="col-lg-12 text-center justify-center m-auto">
    //           <div className="departure bg-white rounded card_rounded border-gray-100 text-left overflow-hidden shadow-sm">
    //             <div className="departure_body px-4 md:px-6 pb-4 md:pb-5 space-y-4">
    //               {!hasFlights && (
    //                 <div className="py-8 text-center space-y-2">
    //                   <h3 className="text-base md:text-lg font-semibold text-gray-800">
    //                     No flights found for your search
    //                   </h3>
    //                   <p className="text-sm text-gray-600 max-w-md mx-auto">
    //                     Try adjusting your dates, airports, or number of
    //                     travelers to see more options.
    //                   </p>
    //                 </div>
    //               )}

    //               {hasFlights &&
    //                 flight?.map((item, idx) => {
    //                   const segments = item?.flights || [];
    //                   const stopsCount = Math.max((segments.length || 1) - 1, 0);
    //                   const stopsLabel =
    //                     stopsCount === 0
    //                       ? "Non-stop"
    //                       : stopsCount === 1
    //                         ? "1 stop"
    //                         : `${stopsCount} stops`;
    //                   const flightName = item?.flights?.map((it) => it?.airline)
    //                   console.log(item, "..........>>>>>>>>items");

    //                   return (
    //                     <div
    //                       className="row items-center border_custom rounded px-3 py-3 md:px-4 md:py-4 bg-white transition-all duration-200 cursor-pointer md-p1"
    //                       key={idx}
    //                     >
    //                       <div className="col-lg-8 p-0">

    //                         <div className="d-block d-lg-none">
    //                           <div className="departure_item flex justify-end items-center gap-2 p-0 text-right">
    //                             <div className="text-[11px] uppercase tracking-wide text-gray-400">
    //                               From
    //                             </div>
    //                             <div className="price text-xl md:text-2xl font-semibold leading-tight fw-bold">
    //                               $
    //                               {item?.price ||
    //                                 data?.data?.flights?.price_insights?.lowest_price}
    //                             </div>

    //                             <a
    //                               className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight"
    //                               href={expediaAffiliateUrl}
    //
    //
    //                             >
    //                               Select flight
    //                             </a>
    //                           </div>
    //                         </div>

    //                         <div className="departure_title flex items-center gap-3 md:gap-4">
    //                           <div className="logo flex flex-col items-center gap-1">
    //                             <img
    //                               src={item?.airline_logo}
    //                               alt={item?.airline || "Airline logo"}
    //                               width={30}
    //                               height={30}
    //                               className="object-contain bg-white"
    //                             />
    //                             <span className="text-[11px] text-gray-500 uppercase tracking-wide">
    //                               {item?.flights?.airline}
    //                             </span>
    //                           </div>

    //                           <div className="departure_time space-y-1">
    //                             <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
    //                               <span className="font-semibold text-gray-900">
    //                                 {departure_id}{" "}
    //                                 <span className="text-gray-400">→</span>{" "}
    //                                 {arrival_id}
    //                               </span>
    //                               <span className="hidden md:inline text-gray-400">
    //                                 •
    //                               </span>
    //                               <span className="text-gray-600 capitalize">
    //                                 {type || "One way"}{" "}
    //                                 {travel_class && `· ${travel_class}`}
    //                               </span>
    //                             </div>

    //                             <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
    //                               <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-gray-700 card_rounded border-emerald-100">
    //                                 {stopsLabel}
    //                               </span>

    //                               {item?.total_duration && (
    //                                 <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 card_rounded border-gray-200 sky_yellow">
    //                                   Total {Math.floor(item.total_duration / 60)}h{" "}
    //                                   {item.total_duration % 60}m
    //                                 </span>
    //                               )}
    //                             </div>
    //                           </div>
    //                         </div>
    //                       </div>

    //                       <div className="col-lg-4 d-none d-lg-block">
    //                         <div className="departure_item flex justify-end items-center gap-2 md:gap-2 p-0 text-right">
    //                           <div className="text-[11px] uppercase tracking-wide text-gray-400">
    //                             From
    //                           </div>

    //                           <div className="price text-xl md:text-2xl font-semibold leading-tight fw-bold">
    //                             $
    //                             {item?.price ||
    //                               data?.data?.flights?.price_insights?.lowest_price}
    //                           </div>

    //                           <a
    //                             className="button_bg2 px-4 md:px-5 py-2 rounded text-sm font-semibold whitespace-nowrap mt-1 button_flight p-0"
    //                             href={expediaAffiliateUrl}
    //
    //
    //                           >
    //                             Select flight
    //                           </a>
    //                         </div>
    //                       </div>

    //                     </div>
    //                   );
    //                 })}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}
