import React from 'react'
import { FaRegHeart } from 'react-icons/fa'
import { IoStar } from "react-icons/io5"; import { IoStarHalf } from "react-icons/io5"; import { IoStarOutline } from "react-icons/io5";

export default function NearByHotel({ places }) {

    return (
        <>




            <section>
                <div className="nearby_hotel_section">

                    <div className="container">
                        <div className="hotel_about_card ">


                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="nearby_hotel_heading about_hotel_detail">
                                        <h3>
                                            Near by Places
                                        </h3>
                                    </div>
                                    {/* **************** cartd boc */}
                                    <div className="row">
                                        {/* ********************************** */}
                                        {
                                            places?.slice(0, 3)?.map((item, i) => {
                                                let simplecontetnt = item?.name?.split("")?.slice(0, 20)?.join("") || "";

                                                if (simplecontetnt?.length > 15) {
                                                    simplecontetnt += "...";
                                                }
                                                let detail = item?.description?.split(" ")?.slice(0, 3)?.join(" ") || "";
                                                if (detail?.length > 4) {
                                                    detail += "..."
                                                }

                                                return (


                                                    <div className="col-lg-3" key={i}>
                                                        <div className="experience_explore_section  nearBySection">
                                                            <div className="card  relative border-0 ">
                                                                <img src={item?.thumbnail} className="card-img-top rounded-4 " alt="..." />
                                                                <div className="heart_icon absolute top-2 right-4">
                                                                    <span>
                                                                        <FaRegHeart />
                                                                    </span>

                                                                </div>
                                                                <div className="card-body ps-0 flex justify-between ">
                                                                    <div className="card_detail">
                                                                        <h5 className="card-title m-0">
                                                                            {
                                                                                simplecontetnt
                                                                            }
                                                                        </h5>
                                                                        <p className='m-0'>
                                                                            {
                                                                                detail
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="rating flex ">


                                                                        <span key={i} className='flex'> <IoStar />
                                                                            <IoStar />
                                                                            <IoStar />
                                                                            <IoStarHalf />
                                                                            <IoStarOutline /></span>


                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                )
                                            })
                                        }
                                        {/* ********************************** */}
                                        {/* ********************************** */}
                                        {/* ********************************** */}
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
