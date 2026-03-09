"use client";

import React, { useState } from "react";
import {
    IoWifiOutline,
    IoRestaurantOutline,
    IoWaterOutline,
    IoFitnessOutline,
    IoCarOutline,
    IoBedOutline,
    IoPeopleOutline,
    IoCafeOutline,
    IoBriefcaseOutline,
    IoSparklesOutline,
    IoHappyOutline,
    IoCheckmarkCircle,
    IoCloseCircleOutline,
    IoMusicalNotesOutline,
    IoAccessibilityOutline,
    IoPawOutline,
} from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderBootstrapStars } from "@/component/renderBootstrapStars";
import moment from "moment";
import { getAssetPath } from "@/app/utils/assetPath";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Modal from "react-bootstrap/Modal";
import "swiper/css";
import "swiper/css/pagination";

// Map amenity categories and titles to icons for better UX
const AMENITY_ICONS = {
    Internet: IoWifiOutline,
    "Food & drink": IoRestaurantOutline,
    Activities: IoMusicalNotesOutline,
    Children: IoHappyOutline,
    Services: IoPeopleOutline,
    "Parking & transportation": IoCarOutline,
    Pools: IoWaterOutline,
    Accessibility: IoAccessibilityOutline,
    Wellness: IoSparklesOutline,
    Pets: IoPawOutline,
    "Business & events": IoBriefcaseOutline,
    Rooms: IoBedOutline,
};
const AMENITY_TITLE_ICONS = {
    "Wi-Fi": IoWifiOutline,
    Restaurant: IoRestaurantOutline,
    Bar: IoRestaurantOutline,
    Breakfast: IoCafeOutline,
    "Room service": IoBedOutline,
    Pool: IoWaterOutline,
    "Outdoor pool": IoWaterOutline,
    Spa: IoSparklesOutline,
    "Fitness center": IoFitnessOutline,
    Parking: IoCarOutline,
    "Air conditioning": IoBedOutline,
    Kitchen: IoRestaurantOutline,
    "Front desk": IoPeopleOutline,
    "Business center": IoBriefcaseOutline,
};
const getCategoryIcon = (title) => AMENITY_ICONS[title] || IoCheckmarkCircle;
const getAmenityIcon = (title) => AMENITY_TITLE_ICONS[title] || IoCheckmarkCircle;

/** Decode HTML entities and split by <br> for safe display (no raw HTML tags) */
function parseDescriptionHtml(html) {
    if (!html || typeof html !== "string") return [];
    let s = html
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, " ");
    s = s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
    return s.split("\n").map((p) => p.trim()).filter(Boolean);
}

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

/**
 * Shimmer placeholder for SERP blocks (About, Ratings, Offers)
 */
function SerpBlockShimmer() {
    return (
        <div className="serp_block serp_block_shimmer margin_bottom">
            <h3 className="serp_block_title">
                <span className="shimmer-text shimmer-text-120x20" style={{ display: "inline-block" }} />
            </h3>
            <div className="serp_shimmer_content">
                <div className="shimmer-container shimmer-100p-14 mb-2" style={{ minHeight: 60 }}>
                    <div className="shimmer" />
                </div>
                <div className="shimmer-container shimmer-95p-14 mb-2">
                    <div className="shimmer" />
                </div>
                <div className="shimmer-container shimmer-95p-14 mb-2" style={{ width: "90%" }}>
                    <div className="shimmer" />
                </div>
                <div className="shimmer-container shimmer-85p-14">
                    <div className="shimmer" />
                </div>
            </div>
        </div>
    );
}

function SerpRatingsShimmer() {
    return (
        <div className="serp_block serp_block_shimmer margin_bottom">
            <h3 className="serp_block_title">
                <span className="shimmer-text shimmer-text-120x20" style={{ display: "inline-block" }} />
            </h3>
            <div className="serp_shimmer_content">
                <div className="d-flex gap-3 mb-3">
                    <div className="shimmer-container shimmer-60x14" style={{ width: 60, height: 36 }}>
                        <div className="shimmer" />
                    </div>
                    <div className="shimmer-container shimmer-120x24">
                        <div className="shimmer" />
                    </div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-2">
                        <div className="shimmer-container shimmer-40x14">
                            <div className="shimmer" />
                        </div>
                        <div className="shimmer-container flex-grow-1 shimmer-100p-16">
                            <div className="shimmer" />
                        </div>
                        <div className="shimmer-container shimmer-60x14">
                            <div className="shimmer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SerpAmenitiesShimmer() {
    return (
        <div className="serp_block serp_block_shimmer margin_bottom">
            <h3 className="serp_block_title">
                <span className="shimmer-text shimmer-text-80x20" style={{ display: "inline-block" }} />
            </h3>
            <div className="serp_shimmer_content">
                <div className="serp_amenity_shimmer_grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="shimmer-container shimmer-90x28 rounded me-2 mb-2">
                            <div className="shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Displays hotel data from SerpAPI (address, phone, amenities, nearby places, reviews, etc.)
 * + Google Places reviews when provided
 */
export default function HotelSerpDataSection({ data, isLoading, googleReviews }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [expandedReviewIndex, setExpandedReviewIndex] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [modalReview, setModalReview] = useState(null);

    if (isLoading) {
        return (
            <section className="hotel_serp_data_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <SerpBlockShimmer />
                            <SerpRatingsShimmer />
                            <SerpAmenitiesShimmer />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    if (!data) return null;

    const description = data.description;
    const descriptionParagraphs = parseDescriptionHtml(description);
    const amenities = data.amenities || [];
    const amenitiesDetailed = data.amenities_detailed;
    const excludedAmenities = data.excluded_amenities || [];
    const essentialInfo = data.essential_info || [];
    const checkInTime = data.check_in_time;
    const checkOutTime = data.check_out_time;
    const propertyType = data.type;
    const overallRating = data.overall_rating;
    const reviewsCount = data.reviews;
    const ratings = data.ratings || [];
    const reviewsBreakdown = data.reviews_breakdown || [];
    const locationRating = data.location_rating;
    const reviews = Array.isArray(googleReviews) ? googleReviews : [];
    const INITIAL_REVIEWS_COUNT = 3;

    const formatReviewCount = (n) => {
        if (!n) return "";
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
        return String(n);
    };

    const getTotalRatings = () => {
        return ratings.reduce((sum, r) => sum + (r.count || 0), 0);
    };

    const getRatingPercent = (count) => {
        const total = getTotalRatings();
        return total ? Math.round((count / total) * 100) : 0;
    };


    return (
        <section className="hotel_serp_data_section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        {/* ========== About this property (description + property details at bottom) ========== */}
                        {(descriptionParagraphs.length > 0 || propertyType || checkInTime || checkOutTime || essentialInfo.length > 0) && (
                            <div className="serp_block serp_description_block margin_bottom">
                                <h3 className="serp_block_title">About this property</h3>
                                {descriptionParagraphs.length > 0 && (
                                    <div className="serp_description_text">
                                        {descriptionParagraphs.map((para, i) => (
                                            <p key={i} className="serp_description_para">{para}</p>
                                        ))}
                                    </div>
                                )}
                                {(propertyType || checkInTime || checkOutTime || essentialInfo.length > 0) && (
                                    <div className="serp_property_details">
                                        {propertyType && (
                                            <div className="serp_property_detail_item">
                                                <span className="serp_property_detail_label">Property type</span>
                                                <span className="serp_property_detail_value">{propertyType.replace(/_/g, " ")}</span>
                                            </div>
                                        )}
                                        {checkInTime && (
                                            <div className="serp_property_detail_item">
                                                <span className="serp_property_detail_label">Check-in</span>
                                                <span className="serp_property_detail_value">{checkInTime}</span>
                                            </div>
                                        )}
                                        {checkOutTime && (
                                            <div className="serp_property_detail_item">
                                                <span className="serp_property_detail_label">Check-out</span>
                                                <span className="serp_property_detail_value">{checkOutTime}</span>
                                            </div>
                                        )}
                                        {essentialInfo.map((info, i) => (
                                            <div key={i} className="serp_property_detail_item">
                                                <span className="serp_property_detail_value">{info}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(amenities.length > 0 || (amenitiesDetailed?.groups?.length > 0) || excludedAmenities.length > 0) && (
                                    <div className=" pt-4  margin_bottom">
                                        <h3 className="serp_block_title">What this place offers</h3>
                                        <p className="serp_google_reviews_text">Amenities are subject to change. Please confirm with the property.</p>
                                        {amenitiesDetailed?.groups?.length > 0 ? (
                                            <>
                                                {/* Popular amenities – highlighted at top */}
                                                {amenitiesDetailed.popular?.length > 0 && (
                                                    <div className="serp_amenity_popular_row">
                                                        {amenitiesDetailed.popular.map((p, i) => {
                                                            const Icon = getAmenityIcon(p.title);
                                                            return (
                                                                <div key={i} className="serp_amenity_popular_pill">
                                                                    <Icon className="serp_amenity_pill_icon" />
                                                                    <span>{p.title}</span>
                                                                    {p.label && <span className="serp_amenity_pill_badge">{p.label}</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                {/* Category cards – always visible, no collapse */}
                                                <div className="serp_amenity_grid">
                                                    {amenitiesDetailed.groups
                                                        .filter((g) => (g.list || []).some((i) => i.available !== false))
                                                        .map((group, gIdx) => {
                                                            const CategoryIcon = getCategoryIcon(group.title);
                                                            const items = (group.list || []).filter((i) => i.available !== false);
                                                            if (items.length === 0) return null;
                                                            return (
                                                                <div key={gIdx} className="serp_amenity_card">
                                                                    <div className="serp_amenity_card_header">
                                                                        <span className="serp_amenity_card_icon">
                                                                            <CategoryIcon />
                                                                        </span>
                                                                        <span className="serp_amenity_card_title">{group.title}</span>
                                                                    </div>
                                                                    <ul className="serp_amenity_card_list">
                                                                        {items.map((item, i) => {
                                                                            const ItemIcon = getAmenityIcon(item.title);
                                                                            return (
                                                                                <li key={i} className="serp_amenity_card_item">
                                                                                    <ItemIcon className="serp_amenity_item_icon" />
                                                                                    <span>{item.title}</span>
                                                                                    {item.label && (
                                                                                        <span className={`serp_amenity_label_badge serp_amenity_label_${item.label.replace(/\s/g, "_").toLowerCase()}`}>
                                                                                            {item.label}
                                                                                        </span>
                                                                                    )}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                                {/* Excluded amenities – within amenities section */}
                                                {excludedAmenities.length > 0 && (
                                                    <div className="serp_amenity_excluded">
                                                        <div className="serp_amenity_excluded_header">
                                                            <IoCloseCircleOutline className="serp_amenity_excluded_icon" />
                                                            <span className="serp_amenity_excluded_title">Not available</span>
                                                        </div>
                                                        <ul className="serp_amenity_excluded_list">
                                                            {excludedAmenities.map((item, i) => (
                                                                <li key={i} className="serp_amenity_excluded_item">
                                                                    <IoCloseCircleOutline className="serp_amenity_excluded_item_icon" />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {amenities.length > 0 && (
                                                    <div className="serp_amenity_tags_plain">
                                                        {amenities.map((a, i) => (
                                                            <span key={i} className="serp_amenity_tag">
                                                                <IoCheckmarkCircle className="serp_amenity_tag_icon" />
                                                                {a}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {excludedAmenities.length > 0 && (
                                                    <div className="serp_amenity_excluded">
                                                        <div className="serp_amenity_excluded_header">
                                                            <IoCloseCircleOutline className="serp_amenity_excluded_icon" />
                                                            <span className="serp_amenity_excluded_title">Not available</span>
                                                        </div>
                                                        <ul className="serp_amenity_excluded_list">
                                                            {excludedAmenities.map((item, i) => (
                                                                <li key={i} className="serp_amenity_excluded_item">
                                                                    <IoCloseCircleOutline className="serp_amenity_excluded_item_icon" />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* ========== Rating & Reviews Summary ========== */}
                        {(overallRating != null || locationRating != null || reviews.length > 0) && (
                            <div className="serp_block serp_rating_block">
                                <h3 className="serp_block_title">Ratings & Reviews</h3>
                                <div className="serp_rating_summary">
                                    {overallRating != null && (
                                        <div className="serp_rating_main">
                                            <span className="serp_rating_score">{overallRating}</span>
                                            <span className="serp_rating_max">/5</span>
                                            {reviewsCount != null && (
                                                <span className="serp_rating_count">
                                                    ({formatReviewCount(reviewsCount)} reviews)
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {locationRating != null && (
                                        <div className="serp_rating_location">
                                            <FaMapMarkerAlt />
                                            <span>Location: {locationRating}/5</span>
                                        </div>
                                    )}
                                </div>

                                {/* Star distribution */}
                                {ratings.length > 0 && (
                                    <div className="serp_star_distribution">
                                        {[5, 4, 3, 2, 1].map((stars) => {
                                            const r = ratings.find((x) => x.stars === stars);
                                            const count = r?.count || 0;
                                            const pct = getRatingPercent(count);
                                            return (
                                                <div key={stars} className="serp_star_row">
                                                    <span className="serp_star_label">{stars}★</span>
                                                    <div className="serp_star_bar_wrap">
                                                        <div
                                                            className="serp_star_bar_fill"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="serp_star_count">{formatReviewCount(count)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Reviews breakdown by category */}
                                {reviewsBreakdown.length > 0 && (
                                    <div className="serp_reviews_breakdown">
                                        <h4 className="serp_sub_title mb-3">What guests say</h4>
                                        <div className="serp_reviews_breakdown_grid">
                                            {reviewsBreakdown.slice(0, 8).map((cat, i) => {
                                                const total = cat.total_mentioned || 0;
                                                const pos = cat.positive || 0;
                                                const pct = total ? Math.round((pos / total) * 100) : 0;
                                                return (
                                                    <div key={i} className="serp_review_cat_card">
                                                        <span className="serp_review_cat_name">{cat.name}</span>
                                                        <div className="serp_review_cat_bar">
                                                            <div
                                                                className="serp_review_cat_fill"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="serp_review_cat_pct">{pct}% positive</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Google Places reviews - responsive: list on desktop, Swiper + modal on mobile */}
                                {reviews.length > 0 && (
                                    <div className="serp_google_reviews">
                                        <h4 className="serp_sub_title">Google Reviews</h4>
                                        <p className="serp_google_reviews_text">Reviews from Google & public sources. Not owned or verified by JustBuy Travel.</p>
                                        {(() => {
                                            const visibleReviews = showAllReviews ? reviews : reviews.slice(0, INITIAL_REVIEWS_COUNT);
                                            return (
                                                <>
                                                    {/* Desktop: list view with inline Read more/Read less */}
                                                    <div className="d-none d-lg-block">
                                                        {visibleReviews.map((item, index) => {
                                                            const text = item?.text?.text || "";
                                                            const words = text.split(" ");
                                                            const isLongText = words.length > 50;
                                                            const isExpanded = expandedReviewIndex === index;
                                                            const displayedText = isExpanded ? text : words.slice(0, 50).join(" ");
                                                            return (
                                                                <div className="review_box_section mb-3" key={index}>
                                                                    <div className="review_head flex justify-between">
                                                                        <div className="user">
                                                                            <div className="user_img flex items-center gap-3">
                                                                                <span>
                                                                                    <ReviewAvatar
                                                                                        photoUri={item?.authorAttribution?.photoUri}
                                                                                        displayName={item?.authorAttribution?.displayName}
                                                                                        size={48}
                                                                                    />
                                                                                </span>
                                                                                <span>
                                                                                    <h6 className="m-0">{item?.authorAttribution?.displayName || "Anonymous"}</h6>
                                                                                </span>
                                                                            </div>
                                                                            <div className="rating hotel_rating flex gap-2 items-center">
                                                                                <span>{renderBootstrapStars(item?.rating)}</span>
                                                                                <span>
                                                                                    <p className="m-0">
                                                                                        {item?.publishTime ? moment(item.publishTime).format("DD MMM YYYY hh:mm A") : ""}
                                                                                    </p>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="like_button">
                                                                            <img src={getAssetPath("/review/like.png")} alt="" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="review_content">
                                                                        <p className="">{displayedText}{!isExpanded && isLongText && "..."}</p>
                                                                        {isLongText && (
                                                                            <button onClick={() => setExpandedReviewIndex(isExpanded ? null : index)}>
                                                                                {isExpanded ? "Read less" : "Read more"}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    {/* Mobile: Swiper slider – all reviews, Read more opens modal */}
                                                    <div className="d-block d-lg-none">
                                                        <Swiper
                                                            slidesPerView={1.5}
                                                            spaceBetween={15}
                                                            modules={[Pagination, Navigation]}
                                                            breakpoints={{
                                                                320: { slidesPerView: 1.5, spaceBetween: 15 },
                                                                640: { slidesPerView: 1, spaceBetween: 20 },
                                                                768: { slidesPerView: 2, spaceBetween: 20 },
                                                            }}
                                                            className="serp_reviews_swiper"
                                                        >
                                                            {reviews.map((item, index) => {
                                                                const text = item?.text?.text || "";
                                                                const words = text.split(" ");
                                                                const isLongText = words.length > 18;
                                                                const displayedText = words.slice(0, 18).join(" ");
                                                                const slideKey = item?.authorAttribution?.displayName || item?.publishTime || `review-${index}`;
                                                                return (
                                                                    <SwiperSlide key={slideKey}>
                                                                        <div className="review_box_section mobile_review_box_section serp_review_slide_card">
                                                                            <div className="review_head flex justify-between">
                                                                                <div className="user">
                                                                                    <div className="user_img flex items-center gap-2">
                                                                                        <span>
                                                                                            <ReviewAvatar
                                                                                                photoUri={item?.authorAttribution?.photoUri}
                                                                                                displayName={item?.authorAttribution?.displayName}
                                                                                                size={38}
                                                                                            />
                                                                                        </span>
                                                                                        <span>
                                                                                            <h6 className="m-0">{item?.authorAttribution?.displayName || "Anonymous"}</h6>
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="rating hotel_rating flex gap-2 items-center">
                                                                                        <span>{renderBootstrapStars(item?.rating)}</span>
                                                                                        <span>
                                                                                            <p className="m-0">
                                                                                                {item?.publishTime ? moment(item.publishTime).format("DD MMM YYYY") : ""}
                                                                                            </p>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="like_button">
                                                                                    <img src={getAssetPath("/review/like.png")} alt="" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="review_content">
                                                                                <p className="">{displayedText}{isLongText ? "..." : ""}</p>
                                                                                <button onClick={() => { setModalReview(item); setShowReviewModal(true); }}>
                                                                                    Read more
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </SwiperSlide>
                                                                );
                                                            })}
                                                        </Swiper>
                                                        <Modal
                                                            show={showReviewModal}
                                                            onHide={() => { setShowReviewModal(false); setModalReview(null); }}
                                                            backdrop="static"
                                                            keyboard={false}
                                                            centered
                                                            dialogClassName="review-modal"
                                                        >
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>
                                                                    <div className="user_img flex items-center gap-2">
                                                                        <span>
                                                                            <ReviewAvatar
                                                                                photoUri={modalReview?.authorAttribution?.photoUri}
                                                                                displayName={modalReview?.authorAttribution?.displayName}
                                                                                size={38}
                                                                            />
                                                                        </span>
                                                                        <span><h6 className="m-0">{modalReview?.authorAttribution?.displayName || "Anonymous"}</h6></span>
                                                                    </div>
                                                                    <div className="rating hotel_rating m-0 flex gap-2 items-center">
                                                                        <span>{modalReview?.rating && renderBootstrapStars(modalReview.rating)}</span>
                                                                        <span>
                                                                            <p className="m-0">
                                                                                {modalReview?.publishTime ? moment(modalReview.publishTime).format("DD MMM YYYY") : ""}
                                                                            </p>
                                                                        </span>
                                                                    </div>
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>{modalReview?.text?.text}</Modal.Body>
                                                            <Modal.Footer>
                                                                <button className="border px-2 py-2 rounded">
                                                                    <div className="like_button flex gap-2">
                                                                        <img src={getAssetPath("/review/like.png")} alt="" />
                                                                    </div>
                                                                </button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </div>
                                                    {/* View more – desktop only; mobile shows all in slider */}
                                                    {reviews.length > INITIAL_REVIEWS_COUNT && !showAllReviews && (
                                                        <div className="review_more mt-4 d-none d-lg-block">
                                                            <button
                                                                onClick={() => setShowAllReviews(true)}
                                                                className="text-black underline font-semibold capitalize"
                                                            >
                                                                View more reviews
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ========== Amenities ========== */}


                    </div>
                </div>
            </div>
        </section>
    );
}
