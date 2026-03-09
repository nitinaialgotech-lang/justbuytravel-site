"use client"
import { GetSerpFlights } from '@/app/Route/endpoints';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

export default function Flight_Departure_Chart() {

    return (
        <>


            <div className="row justify-center departure_chart_section padding_b30   pb-10 pt-6">
                <div className="col-lg-12">
                    <div className="section_title departure_title_head space-y-3 mb-8">
                        <h2>
                            Best Departure Chart
                        </h2>
                        <p>
                            Over the years, we’ve explored and evaluated many travel companies while planning real trips worldwide. Some delivered excellent experiences, while others didn’t meet expectations.
                        </p>
                    </div>
                    <div className="col-lg-12 text-center justify-center m-auto">
                        <div className="departure bg-white rounded-2xl  border border-gray-100 text-left overflow-hidden">
                            <div className="departure_chart border-b border-gray-100  px-4 ">
                                <div className="row items-center">
                                    <div className="col-lg-12">
                                        {/* *********** headerrr */}
                                        <div className="row items-center">
                                            <div className="col-lg-7">
                                                <div className="departure_title flex items-center gap-3 md:gap-4">
                                                    <div className="logo">
                                                        <img src="/flights/MU.png" alt="" width={30} />

                                                    </div>
                                                    <div className="departure_time">
                                                        <h4 className='m-0'>
                                                            Departure - Tu,Mar 03
                                                        </h4>
                                                        <span className="sub">628 kg CO₂ · 1 stop</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* ******************* */}
                                            <div className="col-lg-5">
                                                <div className="departure_item flex items-center justify-end gap-3 md:gap-4">
                                                    <div className="price">
                                                        $620
                                                    </div>
                                                    <button className='button_bg2'>
                                                        Select Flight
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="departure_body px-4 md:px-6 pb-4 md:pb-5">
                                <div className="row items-center">
                                    <div className="col-lg-1 flex flex-col items-center gap-2 text-sm text-gray-600">
                                        <img src="/flights/MU.png" alt="" width={30} />

                                        <span>Indgo</span>

                                    </div>
                                    <div className="col-lg-6">
                                        <div className="contet">
                                            <div className="timeline space-y-4">
                                                {/* Leg 1 */}
                                                <div className="leg">
                                                    <div className="dot" />
                                                    <div className="leg-content">
                                                        <p className="time">10:10 AM · Paris Charles de Gaulle (CDG)</p>
                                                        <p className="meta">Travel time · 1h 30m</p>


                                                    </div>
                                                </div>

                                                {/* <div className="layover">
                                                1h 30m layover · Heathrow Airport (LHR)
                                            </div> */}


                                                <div className="leg">
                                                    <div className="dot" />
                                                    <div className="leg-content">
                                                        <p className="time">12:10 PM · Heathrow Airport (LHR)</p>
                                                        <p className="meta">Travel time · 10h 40m</p>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-lg-4">
                                        <div className="side_content space-y-1 text-sm text-gray-600 text-left md:text-right">
                                            <p>
                                                Below average legroom (29 in)
                                            </p>
                                            <p>
                                                In-seat USB outlet
                                            </p>
                                            <p>
                                                Carbon emissions estimate: 63 kg
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>







        </>
    )
}
