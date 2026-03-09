"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
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
import Link from "next/link";
import { SetFlightType } from "@/Components/Redux/Reducer";



export default function Boooking_options() {
  const [showText, setShowText] = useState(false)
  const [activeKey, setActiveKey] = useState(null);
  const [flightResult, setFlightResults] = useState([])
  const travelType = useSelector((state) => state?.user?.type);
  const travel_Class = useSelector((state) => state?.user?.travel_class);
  const adult = useSelector((state) => state?.user?.passen_count || state?.user?.adults);
  const childrenCount = useSelector((state) => state?.user?.children_count) || "0";
  const infantCount = useSelector((state) => state?.user?.infant_count) || "0";
  const adultsCount = Math.max(1, parseInt(adult, 10) || 1);
  const multi_city = useSelector((state) => state?.user?.multi_flight_city);
  const [loading, setLoading] = useState(false);

  const legs = useMemo(() => {
    return (
      multi_city?.map((flight) => ({
        departure_id: flight.departure_id || "",
        arrival_id: flight.arrival_id ?? flight.arrive_id ?? "",
        date: flight.date && /^\d{4}-\d{2}-\d{2}$/.test(String(flight.date))
          ? flight.date
          : flight.dateTime
            ? moment(flight.dateTime).format("YYYY-MM-DD")
            : ""
      }))?.filter((l) => l.departure_id && l.arrival_id && l.date) ?? []
    );
  }, [multi_city]);

  // const legs = useMemo(() => {
  //   [{ "departure_id": "CDG", "arrival_id": "NRT", "date": "2026-02-19" }, { "departure_id": "NRT", "arrival_id": "LAX,SEA", "date": "2026-02-25" }, { "departure_id": "LAX,SEA", "arrival_id": "AUS", "date": "2026-03-05", "times": "8,18,9,23" }]
  // }, [])
  const payload = {
    mode: "multi_city",
    type: travelType,
    travel_class: travel_Class,
    adults: adultsCount,
    children: Math.max(0, parseInt(childrenCount, 10) || 0),
    infants_on_lap: Math.max(0, parseInt(infantCount, 10) || 0),
    currency: "USD",
    hl: "en",
    legs
  }
  useEffect(() => {
    // perform async fetch inside effect correctly
    const fetchFlights = async () => {
      if (!legs || !legs.length) return;
      setLoading(true);
      try {
        const res = await fetch("/api/google-flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log(res, "ressssssssssssssssssssssssssssssssssss");


        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", res.status, errorText);
          // avoid blocking UI with alerts in production
          return;
        }

        const data = await res.json();
        console.log(data, "............................");

        setFlightResults(data);
        setLoading(false);
        console.log("Flight Results:", data);
      } catch (err) {
        console.error("Network or Unhandled Error:", err);
      }

    };

    fetchFlights();
  }, [legs, travelType, travel_Class, adult, childrenCount, infantCount]);



  console.log(flightResult, "kkkkkkkkkkkkkppppppppppppppppppp");

  const flights = flightResult?.other_flights?.map((item) => item);
  const best_flight = flightResult?.best_flights?.map((item) => item);


  console.log(flights, "...................");

  const fly = flights?.flat();


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

  console.log(travelType, "ughiougiouguio");


  return (
    <section className="booking-options py-4">
      <div className="container">
        <div className="row justify-center">
          <div className="col-lg-12">
            <div className="bg-white rounded card_rounded border border-gray-200  overflow-hidden">
              {/* Section header */}
              <div className=" px-3 py-2 border-b border-gray-100 ">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="left_detail">
                    <h2 className="text-lg  md:text-xl font-semibold text-gray-900 flex gap-2 items-center capitalize m-0">
                      <span>Best Flights </span>{" "}
                      {/* <span className="swip">
                        <VscArrowSwap />
                      </span>{" "}
                      <span>delhi</span> */}
                    </h2>

                    {/* <div className="departure_time space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1 text">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-gray-700 card_rounded border-emerald-100">
                          RoundTrip
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 card_rounded border-gray-200 sky_yellow">
                          Ecomnomy
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50  card_rounded border-emerald-100 sky_green text-gray-700">
                          {adultsCount} Passenger{adultsCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div> */}
                  </div>
                  {/* <div
                    type="button"
                    className=" text-sm text-gray-500  hover:text-gray-700 transition-colors"
                  >
                    <h2 className="m-0 p-0 text-black">$999</h2>
                    <p className="m-0">Lowest total price</p>
                  </div> */}
                </div>
              </div>

              {/* British Airways block */}

              <div className="book_fligh">
                <div className="selected_flight border-0">


                  {/* Other airlines list */}
                  <div className="accordian_section ">
                    <Accordion
                      activeKey={activeKey} onSelect={(eventKey) =>
                        setActiveKey(eventKey === activeKey ? null : eventKey)
                      }
                      className=""
                    >

                      {

                        loading ? (
                          <>
                            <ShimmerCard />
                            <ShimmerCard />
                            <ShimmerCard />
                            <ShimmerCard />
                          </>
                        ) : (
                          flights?.map((item, i) => {

                            console.log(item?.flights?.[0]?.departure_airport?.time, "..............itttttttttttttttttttttttttt");


                            const departure = item?.flights?.[0]?.departure_airport?.time;
                            const arrival = item?.flights?.[0]?.arrival_airport?.time

                            const dep_id = item?.flights?.[0]?.departure_airport?.id;
                            const arri_id = item?.flights?.[0]?.arrival_airport?.id;
                            // Calculate travel time dynamically
                            const travelMinutes = moment(arrival).diff(moment(departure), "minutes");
                            const travelHours = Math.floor(travelMinutes / 60);
                            const travelRemainingMinutes = travelMinutes % 60;
                            const travelTime = `${travelHours}h ${travelRemainingMinutes}m`;



                            return (
                              <React.Fragment key={i}>
                                <Accordion.Item eventKey={i}>
                                  <Accordion.Header
                                    className="flight_accordian "
                                    onClick={() => { setShowText(true), setActiveKey(i) }}
                                  >
                                    <div className="acor_header  w-full">
                                      {activeKey !== i ? (
                                        <div className="items flex items-center justify-between">
                                          <div className="img ps-3">
                                            <img
                                              src={item?.airline_logo}
                                              width={40}
                                              height={40}
                                              alt=""
                                            />

                                          </div>
                                          {/* ****** */}
                                          <div className="time acot-tit dis_txt" >
                                            <span>{moment(departure).format("ddd, MMM D h:mm A")} – {moment(arrival).format("h:mm A")}</span>
                                            <p>{item?.airline}</p>
                                          </div>
                                          {/* ************* */}
                                          <div className="hout_tm acot-tit tt-c dis_no">
                                            <span> {travelTime}</span>
                                            <p>{dep_id} - {arri_id}</p>
                                          </div>
                                          {/* ********* */}
                                          <div className="stops acot-tit tt-c dis_no">
                                            <span>


                                              {



                                              }
                                            </span>
                                          </div>
                                          {/* ******** weight */}
                                          <div className="weigth acot-tit tt-c dis_no">
                                            <span>{(
                                              item?.carbon_emissions?.this_flight / 1000
                                            ).toFixed(0)}{" "} kg CO2</span>
                                            <p>+{item?.carbon_emissions?.difference_percent}% emission</p>
                                          </div>

                                        </div>

                                      ) : (
                                        <div className="items full_det_item flex items-center  justify-between w-full">
                                          <div className="img ps-3 flex justify-between items-center">
                                            <img
                                              src={item?.airline_logo}
                                              width={40}
                                              height={40}
                                              alt=""
                                            />
                                            <div className="time acot-tit d-block d-lg-none ">
                                              <h2 className="m-0" id="h3">
                                                Departing flight {moment(departure).format('ddd, MMM D')}
                                              </h2>
                                              <p className=" m-0 ">{item?.airline}</p>
                                            </div>
                                          </div>
                                          <div className="items_flights flex items-center gap-5 pe-3">
                                            {/* ****** */}
                                            <div className="time acot-tit d-none d-lg-block ">
                                              <h2 className="m-0" id="h3">
                                                Departing flight {moment(departure).format('ddd, MMM D')}
                                              </h2>
                                              <p className=" m-0 ">{item?.airline}</p>
                                            </div>
                                            {/* ************* */}

                                            {/* ******** weight */}
                                            <div className="weigth acot-tit dis_no">
                                              <span>118 kg CO2e</span>
                                              <p className="m-0">+15% emission</p>
                                            </div>
                                            {/* *********************** */}
                                            <div className="flight_price">
                                              <p className="m-0 font-semibold ">
                                                ${((item?.price || 0) * adultsCount).toLocaleString()}
                                              </p>
                                              <p className="m-0">
                                                {item?.type}
                                              </p>
                                            </div>
                                            {/* ******************** select flight  */}
                                            <div className="select_flight departure_item flight_res">
                                              <Link href={`/return-flight?tok=${encodeURIComponent(item?.departure_token || "")}&type=${travelType}`}
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
                                    {
                                      item?.flights?.map((segment, segIdx) => {
                                        return (
                                          <React.Fragment key={segIdx}>
                                            <div className="flex justify-between gap-6">

                                              {/* LEFT SIDE – Timeline */}
                                              <div className="flex items-center gap-5 fligth_detail">
                                                <div className="plane_logo flex flex-col justify-center items-center">
                                                  <img src={segment?.airline_logo} alt="" width={35} />
                                                  <p className="">{segment?.airline}</p>
                                                </div>

                                                <div className="flights">
                                                  {/* FLIGHT 1 */}
                                                  <div className="relative pl-8 flight_border   ">

                                                    {/* Dot */}
                                                    <span className="absolute -left-[5px] dot2 top-2 w-3 h-3 bg-white border-2 border-gray-400 rounded-full"></span>

                                                    <div className="departure_fligh">
                                                      <p className="text-sm text-gray-900 font-medium m-0">
                                                        {moment(segment?.departure_airport?.time).format("hh:mm A")} · {segment?.departure_airport?.name} ({segment?.departure_airport?.id})
                                                      </p>

                                                      <p className="text-xs text-gray-500 mt-1">
                                                        {travelTime}
                                                        {/* <span className="text-red-500 font-medium"> Overnight</span> */}
                                                      </p>
                                                    </div>

                                                    <span className="absolute -left-[5px]  w-3 h-3 dot-3 bg-white border-2 border-gray-400 rounded-full"></span>
                                                    <div className="departure_fligh">
                                                      <p className="text-sm text-gray-900 mt-2 mb-0" >
                                                        {moment(segment?.arrival_airport?.time).format("hh:mm A")} · {segment?.arrival_airport?.name} ({segment?.arrival_airport?.id})
                                                      </p>

                                                      <p className="text-xs text-gray-500 mt-1">
                                                        {segment?.airline} · {segment?.airplane} · {segment?.travel_class} · {segment?.flight_number}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* LAYOVER */}



                                              </div>

                                              {/* RIGHT SIDE – Amenities */}
                                              <div className="w-64 text-sm space-y-6 d-none d-lg-block ">
                                                <p>{
                                                  segment?.extensions
                                                }</p>




                                              </div>

                                            </div>
                                            {/* RIGHT SIDE – Amenities */}
                                            <div className="w-64 text-sm space-y-6 d-block d-lg-none excentation">
                                              <p>{
                                                segment?.extensions
                                              }</p>




                                            </div>
                                          </React.Fragment>
                                        )
                                      })
                                    }


                                    {/* Footer note */}
                                    <div className=" text-xs text-gray-500 ">
                                      {item?.extensions}
                                    </div>

                                  </Accordion.Body>


                                </Accordion.Item>
                              </React.Fragment>
                            )
                          }))
                      }
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
    </section >
  );
}
