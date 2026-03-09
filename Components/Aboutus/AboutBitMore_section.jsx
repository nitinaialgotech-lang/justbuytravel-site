import React from 'react'
import { getAssetPath } from "@/app/utils/assetPath"
import Link from 'next/link'
export default function AboutBitMore_section() {
    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* ********************************* a bit more about us ..................... */}

                            <div className="bitmore_section padding_top">

                                <div className="section_title">
                                    <h2 className='m-0 p-0 capitalize'>
                                        A Bit More About Us:
                                    </h2>
                                    <p>Helping you find the best travel options without any hassle.</p>
                                </div>

                                <div className="row">
                                    <div className="col-lg-5">
                                        <div className="bit_content relative">
                                            <img src={getAssetPath("/aboutus/bit1.png")} alt="" className='relative' />
                                            <div className="content absolute ">
                                                <p className=''>
                                                    What does Just Buy Travel offer?

                                                </p>
                                                <h2>
                                                    Flights and travel options at fair prices
                                                </h2>
                                                <Link href={"/flights"}>Check Now</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7">



                                        <div className="bit_content relative right_h mrt-20">
                                            <img src={getAssetPath("/aboutus/bit2.png")} alt="" className='relative' />
                                            <div className="content absolute ">

                                                <h2>
                                                    Plan memorable trips with confidence
                                                </h2>
                                                <Link href={"/"}>Check Now</Link>
                                            </div>
                                        </div>

                                        {/* ************* */}


                                        <div className="bit_content relative right_h mt-4">
                                            <img src={getAssetPath("/aboutus/bit3.png")} alt="" className='relative' />
                                            <div className="content absolute bottom-7">

                                                <h2>
                                                    Luxury hotels at affordable prices
                                                </h2>
                                                <Link href={"/hotels"}>Check Now</Link>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section></>
    )
}
