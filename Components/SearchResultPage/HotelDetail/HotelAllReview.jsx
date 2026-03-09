"use client"
import { renderBootstrapStars } from '@/component/renderBootstrapStars'
import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
import { getAssetPath } from "@/app/utils/assetPath";

function getInitials(displayName) {
    if (!displayName || typeof displayName !== "string") return "?";
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
    return (parts[0]?.[0] || "?").toUpperCase();
}

function ReviewAvatar({ photoUri, displayName, size = 48 }) {
    const [broken, setBroken] = useState(false);
    const showPhoto = photoUri && !broken;
    const initials = getInitials(displayName);
    if (showPhoto) {
        return (
            <img
                src={photoUri}
                width={size}
                height={size}
                alt={displayName || "Reviewer"}
                onError={() => setBroken(true)}
                style={{ objectFit: "cover", borderRadius: "50%" }}
            />
        );
    }
    return (
        <span
            className="review_avatar_initials"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: "#e0e0e0",
                color: "#555",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Math.max(12, size * 0.4),
                fontWeight: 600,
            }}
        >
            {initials}
        </span>
    );
}
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Navigation, Pagination } from "swiper/modules";
export default function HotelAllReview({ reviews }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [showAll, setShowAll] = useState(false);
    // *****************
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setModalReview(null);
    };
    const handleShow = (item) => {
        setModalReview(item);
        setShow(true);
    }

    // ******************
    const [modalReview, setModalReview] = useState(null);
    const visibleReviews = showAll ? reviews : reviews?.slice(0, 3);
    return (
        <>
            <section className='trailer_review_section padding_bottom'>
                <div className="container">
                    <div className="row">
                        <div className="section_title hotel_review">
                            <h2 className='m-0'>
                                Google Reviews
                            </h2>
                            <p className='review'>
                                Reviews from Google & public sources. Not owned or verified by JustBuy Travel.
                            </p>
                        </div>
                        {/* ******************** */}



                        <div className="col-lg-9 d-none d-lg-block">
                            {
                                visibleReviews?.map((item, index) => {
                                    const text = item?.text?.text || "";
                                    const words = text.split(" ");
                                    const isLongText = words.length > 50;

                                    const isExpanded = expandedIndex === index;
                                    const displayedText = isExpanded
                                        ? text
                                        : words.slice(0, 50).join(" ");
                                    return (
                                        <div className="review_box_section mb-3" key={index}>
                                            <div className="review_head flex justify-between ">
                                                <div className="user">
                                                    <div className="user_img flex items-center gap-3">
                                                        <span><ReviewAvatar photoUri={item?.authorAttribution?.photoUri} displayName={item?.authorAttribution?.displayName} size={48} /></span>
                                                        <span>
                                                            <h6 className='m-0'>
                                                                {item?.authorAttribution?.displayName}
                                                            </h6>
                                                        </span>
                                                    </div>
                                                    <div className="rating hotel_rating flex gap-2 items-center">
                                                        <span>
                                                            {renderBootstrapStars(item?.rating)}
                                                        </span>
                                                        <span>
                                                            <p className='m-0'>
                                                                {moment(item?.publishTime).format("DD MMM YYYY hh:mm A")}
                                                            </p>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="like_button">
                                                    <img src={getAssetPath("/review/like.png")} alt="" />
                                                </div>
                                            </div>
                                            {/* ********************** */}
                                            <div className="review_content">
                                                <p className=''>
                                                    {displayedText}
                                                    {!isExpanded && isLongText && "..."}
                                                </p>
                                                {
                                                    isLongText ?
                                                        <button className='text-start' onClick={() =>
                                                            setExpandedIndex(isExpanded ? null : index)
                                                        }> {isExpanded ? "Read less" : "Read more"}</button>
                                                        :
                                                        ""
                                                }
                                            </div>
                                        </div>


                                    )
                                })
                            }
                            {/* *************  review xxxxxxxxxxxx */}
                            {reviews?.length > 3 && !showAll && (
                                <div className="review_more mt-4">
                                    <button
                                        onClick={() => setShowAll(true)}
                                        className=" text-black underline font-semibold capitalize"
                                    >
                                        View more reviews
                                    </button>
                                </div>
                            )}
                            {/* *************  review xxxxxxxxxxxx */}
                        </div>
                        {/* *************************************************************** review all in mobile view text    ***********/}
                        <div className="col-lg-9 d-block d-lg-none">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={15}
                                // pagination={{ clickable: true }}
                                // navigation={{
                                //     prevEl: "#custom_prev",
                                //     nextEl: "#custom_next",
                                // }}
                                loop={true}
                                // autoplay={{
                                //     delay: 3100,
                                //     disableOnInteraction: false,
                                // }}
                                modules={[Pagination, Navigation]}
                                onSwiper={(swiper) => setIsBeginning(swiper.isBeginning)}
                                onSlideChange={(swiper) => setIsBeginning(swiper.isBeginning)}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    375: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    425: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    640: {
                                        slidesPerView: 1, // mobile
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2, // tablet
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 4, // desktop (optional)
                                        spaceBetween: 20,
                                    },
                                }}
                                className="mySwiper relative"
                            >
                                {
                                    visibleReviews?.map((item, index) => {
                                        console.log(item?.text, ",,,,iten");

                                        const text = item?.text?.text || "";
                                        const words = text.split(" ");
                                        const isLongText = words.length > 18;

                                        const isExpanded = expandedIndex === index;
                                        const displayedText = isExpanded
                                            ? text
                                            : words.slice(0, 18).join(" ");

                                        const slideKey =
                                            item?.authorAttribution?.displayName ||
                                            item?.publishTime ||
                                            `review-${index}`;
                                        return (
                                            <SwiperSlide key={slideKey}>
                                                <div className="review_box_section mobile_review_box_section  " >
                                                    <div className="review_head flex justify-between ">
                                                        <div className="user">
                                                            <div className="user_img flex items-center gap-2">
                                                                <span><ReviewAvatar photoUri={item?.authorAttribution?.photoUri} displayName={item?.authorAttribution?.displayName} size={38} /></span>
                                                                <span>
                                                                    <h6 className='m-0'>
                                                                        {item?.authorAttribution?.displayName}
                                                                    </h6>
                                                                </span>
                                                            </div>
                                                            <div className="rating hotel_rating flex gap-2 items-center">
                                                                <span>
                                                                    {renderBootstrapStars(item?.rating)}
                                                                </span>
                                                                <span>
                                                                    <p className='m-0'>
                                                                        {moment(item?.publishTime).format("DD MMM YYYY")}
                                                                    </p>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="like_button">
                                                            <img src={getAssetPath("/review/like.png")} alt="" />
                                                        </div>
                                                    </div>
                                                    {/* ********************** */}
                                                    <div className="review_content">
                                                        <p className=''>
                                                            {displayedText}
                                                            {!isExpanded && isLongText && "..."}
                                                        </p>

                                                        <button className='text-start' onClick={() => handleShow(item)}> {"Read more"}</button>
                                                    </div>
                                                </div>

                                                {/* *************  review xxxxxxxxxxxx */}
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper >
                            {reviews?.length > 3 && !showAll && (
                                <div className="review_more mt-4 d-block d-lg-none">
                                    <button
                                        onClick={() => setShowAll(true)}
                                        className="text-black underline font-semibold capitalize"
                                    >
                                        View more reviews
                                    </button>
                                </div>
                            )}
                            {/* <div className="button_swiper2 absolute ">
                                <div className="buttons_icon relative">
                                    <button
                                        id="custom_prev"
                                        aria-label="Previous"
                                        className={`absolute ${isBeginning ? "d-none pointer-events-none" : ""
                                            }`}
                                    >
                                        <MdOutlineKeyboardArrowLeft size={30} />
                                    </button>

                                    <button
                                        id="custom_next"
                                        aria-label="Next"
                                        className="absolute"
                                    >
                                        <MdOutlineKeyboardArrowRight size={30} />
                                    </button>
                                </div>
                            </div> */}
                            {/* *************  review xxxxxxxxxxxx */}
                            {/* ******************************* show modal **************** */}
                            <div className="container" >
                                <Modal
                                    show={show}
                                    onHide={handleClose}
                                    backdrop="static"
                                    keyboard={false}
                                    centered
                                    dialogClassName="review-modal"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <div className="user_img flex items-center gap-2">
                                                <span><ReviewAvatar photoUri={modalReview?.authorAttribution?.photoUri} displayName={modalReview?.authorAttribution?.displayName} size={38} /></span>
                                                <span>
                                                    <h6 className='m-0'>
                                                        {modalReview?.authorAttribution?.displayName}
                                                    </h6>
                                                </span>
                                            </div>
                                            {/* ********* */}
                                            <div className="rating hotel_rating m-0 flex gap-2 items-center">
                                                <span>
                                                    {renderBootstrapStars(4)}
                                                </span>
                                                <span>
                                                    <p className='m-0'>
                                                        {moment(modalReview?.publishTime).format("DD MMM YYYY")}
                                                    </p>
                                                </span>
                                            </div>
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>

                                        {modalReview?.text?.text}


                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className='border px-2 py-2 rounded'>
                                            <div className="like_button flex gap-2">
                                                <img src={getAssetPath("/review/like.png")} alt="" />
                                            </div>
                                        </button>
                                    </Modal.Footer>
                                </Modal>

                            </div>

                        </div>
                        {/* ******************** */}
                        <div className="col-lg-3 d-none d-lg-block">
                            <div className="review_banner padding_bottom ">
                                <div className="banner_img ">
                                    <img src={getAssetPath("/review/banner1.png")} className='' alt="" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>



        </>
    )
}
