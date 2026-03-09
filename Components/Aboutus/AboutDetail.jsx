import Link from 'next/link'
import React from 'react'
import { getAssetPath } from "@/app/utils/assetPath"
import AboutExperience from './AboutExperience'
import AboutTrailer_photos from './AboutTrailer_photos'
import AboutBitMore_section from './AboutBitMore_section'

export default function AboutDetail() {
    return (
        <>
            <section className='padding_bottom bg_grey '>
                <div className="container">
                    <div className="col-lg-12">
                        <div className="detail_about text-center">
                            {/* ********** */}
                            <div className="about_content">
                                <p>
                                    <strong>Just Buy Travel is a digital travel platform</strong>  that helps travellers explore destinations and compare hotel options from around the world. <strong>We focus</strong> on providing clear and useful information so <strong>users can understand different accommodation choices easily.</strong> Our goal is to make travel planning simple and stress-free by helping people review <strong>luxury, affordable, and tourist-friendly stays</strong>  before making any decision.
                                </p>
                                <p>
                                    We work with <strong> trusted travel partners</strong> to share updated listings and relevant details, allowing travellers to research options based on their needs and budget. By bringing together multiple hotel choices in one place, Just Buy Travel supports informed travel planning and helps users feel confident while exploring new destinations.
                                </p>
                            </div>
                            {/* ************ */}
                            <div className="break_point flex justify-center">
                                <div className="icon">
                                    <img src={getAssetPath("/aboutus/Vector.png")} alt="" />
                                </div>
                            </div>
                            {/* ********** */}
                            <div className="about_review_section">
                                <div className="head_line section_title">
                                    <h2>
                                    Globally Recognised and Growing Every Day
                                    </h2>
                                </div>
                                <div className="box_content ">
                                    <div className="row">
                                        {/* ************************* */}
                                        <div className="col-lg-6">
                                            <div className="box_content_box sky_blue">
                                                <div className="content">
                                                    <h2 className='p-0 m-0 text-center flex flex-col justify-center items-center'>
                                                    10K+

                                                    </h2>
                                                    <p className='m-0'>
                                                    Monthly Travel Readers

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ************************* */}
                                        <div className="col-lg-6">
                                            <div className="box_content_box sky_yellow mrt-20">
                                                <div className="content">
                                                    <h2 className='p-0 m-0'>
                                                    500+
                                                    </h2>
                                                    <p className='m-0'>
                                                    Curated Travel Articles

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ************************* */}
                                        <div className="col-lg-6 mt-4">
                                            <div className="box_content_box sky_green">
                                                <div className="content">
                                                    <h2 className='p-0 m-0'>
                                                    1M+
                                                    </h2>
                                                    <p className='m-0'>
                                                        THotel & Deal Searches Redirected
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ************************* */}
                                        <div className="col-lg-6 mt-4">
                                            <div className="box_content_box sky_red">
                                                <div className="content">
                                                    <h2 className='p-0 m-0'>
                                                    100%
                                                    </h2>
                                                    <p className='m-0'>
                                                    Independent & Transparent Reviews

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ************************* */}
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <AboutBitMore_section />
            <AboutExperience />
            {/* <AboutTrailer_photos /> */}
        </>
    )
}
