'use client';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useMemo } from 'react'
import { FaUserAlt } from 'react-icons/fa';
import { IoTime } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { SearchLocation } from '@/app/Route/endpoints';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getAssetPath } from '@/app/utils/assetPath';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createHotelSlug } from "@/app/utils/seo";
export default function RecomendSection() {
    const [search, setSearch] = useState("");
    const [locationName, setLocationName] = useState("");
    const [locationError, setLocationError] = useState("");
    const [locationFetching, setLocationFetching] = useState(true);
    const [imageErrors, setImageErrors] = useState({});

    // Helper function to get the best available image URL
    // Priority: image_proxy > image > placeholder
    const getImageUrl = (item) => {
        // First try image_proxy (avoids CORS issues)
        if (item?.image_proxy && item.image_proxy.trim() !== '') {
            return item.image_proxy;
        }

        // Fallback to image
        if (item?.image && item.image.trim() !== '') {
            return item.image;
        }

        // If no image available, use placeholder
        return 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
    };

    // Handle image load error with fallback chain
    const handleImageError = (itemId, item, e) => {
        const currentSrc = e.target.src;

        // If we tried image_proxy and it failed, try the original image
        if (currentSrc === item?.image_proxy && item?.image) {
            e.target.src = item.image;
            return;
        }

        // If both failed, show placeholder
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
        e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Image+Not+Available';
        e.target.onerror = null; // Prevent infinite loop
    };

    // Get user's current location


    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                { headers: { "User-Agent": "JustBuyTravel/1.0" } }
            );
            const data = await response.json();

            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village;
                if (city) return city;
                return data.address.municipality || data.address.county || "Unknown Location";
            }
            return "Unknown Location";
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return "Unknown Location";
        }
    };

    const doSearch = async (query) => {
        try {
            const results = await SearchLocation(query);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    useEffect(() => {
        const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 };

        if (typeof navigator === "undefined" || !navigator?.geolocation) {
            console.warn("Geolocation not available");
            setLocationError("Geolocation not available in this browser");
            // IP fallback
            (async () => {
                try {
                    const resp = await fetch("https://ipapi.co/json/");
                    if (resp.ok) {
                        const ipData = await resp.json();
                        const ipCity = ipData?.city;
                        if (ipCity) {
                            setSearch(ipCity + (ipData.region ? `, ${ipData.region}` : ""));
                            setLocationName(ipCity);
                        } else if (ipData?.latitude && ipData?.longitude) {
                            setSearch(`${ipData.latitude.toFixed(5)}, ${ipData.longitude.toFixed(5)}`);
                            setLocationName(`${ipData.latitude.toFixed(5)}, ${ipData.longitude.toFixed(5)}`);
                        } else {
                            setSearch("New York");
                        }
                    } else {
                        setSearch("New York");
                    }
                } catch (e) {
                    console.warn("IP fallback failed:", e.message || e);
                    setSearch("New York");
                } finally {
                    setLocationFetching(false);
                }
            })();

            return;
        }

        const success = async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const cityName = await reverseGeocode(latitude, longitude);
                if (cityName && cityName !== "Unknown Location") {
                    setSearch(cityName);
                    setLocationName(cityName);
                } else {
                    const coordLocation = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                    setSearch(coordLocation);
                    setLocationName(coordLocation);
                }
            } catch (e) {
                console.warn("Reverse geocode failed, using coordinates", e);
                setSearch(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                setLocationName(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            }

            setLocationFetching(false);
        };

        const errorHandler = async (err) => {
            console.error("Geolocation error:", err);
            setLocationError(err?.message || "Geolocation error");

            // Try simple IP fallback
            try {
                const resp = await fetch("https://ipapi.co/json/");
                if (resp.ok) {
                    const ipData = await resp.json();
                    const ipCity = ipData?.city;
                    if (ipCity) {
                        setSearch(ipCity + (ipData.region ? `, ${ipData.region}` : ""));
                        setLocationName(ipCity);
                    } else if (ipData?.latitude && ipData?.longitude) {
                        setSearch(`${ipData.latitude.toFixed(5)}, ${ipData.longitude.toFixed(5)}`);
                        setLocationName(`${ipData.latitude.toFixed(5)}, ${ipData.longitude.toFixed(5)}`);
                    } else {
                        setSearch("New York");
                    }
                } else {
                    setSearch("New York");
                }
            } catch (e) {
                console.warn("IP fallback failed:", e.message || e);
                setSearch("New York");
            } finally {
                setLocationFetching(false);
            }
        };

        navigator.geolocation.getCurrentPosition(success, errorHandler, options);
    }, []);


    const { data, isLoading, error } = useQuery({
        queryKey: ["hotels", search],
        queryFn: () => SearchLocation(search),
        enabled: !!search
    })

    // Log error if present
    useEffect(() => {
        if (error) {
            console.error("Error fetching hotels:", error);
        }
    }, [error]);
    // Handle different data structures: data.hotels, data.data.hotels, or direct array
    const hotels = useMemo(() => {
        if (!data) {
            return null;
        }

        let extractedHotels = null;

        // Try data as direct array first (actual API structure based on error)
        if (Array.isArray(data) && data.length > 0) {
            extractedHotels = data;
        }
        // Try data.data as direct array
        else if (Array.isArray(data.data) && data.data.length > 0) {
            extractedHotels = data.data;
        }
        // Try data.hotels
        else if (data.hotels && Array.isArray(data.hotels) && data.hotels.length > 0) {
            extractedHotels = data.hotels;
        }
        // Try data.data.hotels
        else if (data.data?.hotels) {
            if (Array.isArray(data.data.hotels)) {
                const firstHotel = data.data.hotels[0];
                if (firstHotel?.items && Array.isArray(firstHotel.items)) {
                    extractedHotels = data.data.hotels.flatMap(item => item.items || []);
                } else if (data.data.hotels.length > 0) {
                    extractedHotels = data.data.hotels;
                }
            } else {
                extractedHotels = data.data.hotels;
            }
        }

        // Ensure hotels is an array
        if (extractedHotels && !Array.isArray(extractedHotels)) {
            extractedHotels = [extractedHotels];
        }

        // Map the hotel data to match the expected structure
        if (extractedHotels && Array.isArray(extractedHotels)) {
            extractedHotels = extractedHotels.map(hotel => {
                // Ensure reviews is a number, not an object
                const reviewsCount = typeof hotel.reviews === 'object' && hotel.reviews?.votes_count
                    ? hotel.reviews.votes_count
                    : (typeof hotel.reviews === 'number' ? hotel.reviews : 0);

                // Ensure rating is a number
                const ratingValue = typeof hotel.reviews === 'object' && hotel.reviews?.value
                    ? hotel.reviews.value
                    : (typeof hotel.rating === 'number' ? hotel.rating : 0);

                // Destructure to exclude reviews and rating from spread
                const { reviews: _, rating: __, ...restOfHotel } = hotel;

                return {
                    // Map API fields to component fields
                    name: hotel.title || hotel.name || 'Hotel',
                    property_token: hotel.hotel_identifier || hotel.property_token || hotel.data_id,
                    rating: ratingValue,
                    reviews: reviewsCount,
                    image: hotel.overview_images?.[0] || hotel.image,
                    image_proxy: hotel.overview_images?.[0] || hotel.image_proxy,
                    price_per_night: {
                        price: `₹${hotel.prices?.price || 0}`,
                        extracted_price: hotel.prices?.price || 0
                    },
                    total_price: {
                        price: `₹${hotel.prices?.price || 0}`,
                        extracted_price: hotel.prices?.price || 0
                    },
                    // Keep original data for reference (excluding reviews and rating to avoid conflicts)
                    ...restOfHotel
                };
            });
        }

        return extractedHotels;
    }, [data]);


    // ********************************************
    const router = useRouter()

    const viewDetails = (name, id) => {
        if (!id) return;
        const slug = createHotelSlug(name, id);
        router.push(`/${slug}`);
    }

    const { data: GetSearch_data } = useQuery({
        queryKey: ["getdata", search],
        queryFn: () => SearchLocation(search),
        enabled: !!search
    })
    const location_code = data?.data?.hotels?.map((item) => item?.location_code || []);
    const currency = data?.data?.currency || '';


    // Shimmer skeleton component
    const ShimmerCard = () => (
        <div className="card_col">
            <div className="recommend_card_box card_rounded shadow margin_lr margin_md-lr">
                <div className="card_box pe-">
                    <div className="card_box_img card_rounded relative overflow-hidden shimmer-container shimmer-min-250 shimmer-bg-light">
                        <div className="shimmer"></div>
                        <div className="rated_msg absolute top-5 flex justify-between items-center left-5 right-5">
                            <div className="msg shimmer-text shimmer-80x20 shimmer-radius-4"></div>
                            <div className="msg_icon shimmer-icon shimmer-icon-20"></div>
                        </div>
                    </div>
                    <div className="card_box_detail px-4 py-5 card_rounded flex flex-col z-1 gap-2 relative">
                        <div className="shimmer-text shimmer-80p-24 shimmer-radius-4 mb-2"></div>
                        <div className="time flex items-center gap-3 relative">
                            <div className="icon flex items-center gap-1">
                                <div className="shimmer-icon shimmer-square-16"></div>
                                <div className="shimmer-text shimmer-100x16 shimmer-radius-4"></div>
                            </div>
                            <div className="guest flex items-center gap-1">
                                <div className="shimmer-icon shimmer-square-16"></div>
                                <div className="shimmer-text shimmer-80x16 shimmer-radius-4"></div>
                            </div>
                        </div>
                        <div className="price_book flex mt-3 justify-between items-center">
                            <div className="shimmer-text shimmer-120x24 shimmer-radius-4"></div>
                            <div className="shimmer-button shimmer-btn-100x36"></div>
                        </div>
                        <div className="rating_list absolute flex items-center gap-1 right-10 shadow">
                            <div className="shimmer-icon shimmer-square-16"></div>
                            <div className="shimmer-text shimmer-30x16 shimmer-radius-4"></div>
                            <div className="shimmer-text shimmer-80x16 shimmer-radius-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // *****************************************************************************************
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                .shimmer-container {
                    position: relative;
                    overflow: hidden;
                }
                .shimmer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        #e5e7eb 0%,
                        #f3f4f6 50%,
                        #e5e7eb 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
                .shimmer-text,
                .shimmer-icon,
                .shimmer-button {
                    background: linear-gradient(
                        90deg,
                        #e5e7eb 0%,
                        #f3f4f6 50%,
                        #e5e7eb 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
            `
            }} />
            <section className='recomend_section container  padding_bottom'>
                <div className="section_title relative ">
                    <h2 className='mb-0'>
                        Recommended For You
                    </h2>
                    <p>
                        Handpicked experiences tailored to your interests
                    </p>
                    <div className="title_icon absolute right-5   ">
                        {/* <img src={getAssetPath("/home/destination/icon_plane.png")} alt="Travel plane icon" /> */}
                    </div>
                </div>
                {/* **************************** recomend carsd cord box */}

                <div className="row">
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={5}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Navigation, Pagination]}
                        className="mySwiper"
                        // navigation={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 30

                            },
                            375: {
                                slidesPerView: 1,
                                spaceBetween: 30

                            },
                            425: {
                                slidesPerView: 1,
                                spaceBetween: 30

                            },
                            640: {
                                slidesPerView: 1, // mobile
                            },
                            768: {
                                slidesPerView: 2, // tablet
                            },
                            1024: {
                                slidesPerView: 4, // desktop (optional)
                            },
                        }}
                        loop={false}
                        id='swiper_sldie'
                    >
                        {(() => {
                            const hasHotels = hotels && Array.isArray(hotels) && hotels.length > 0;

                            if (hasHotels) {
                                return hotels.slice(0, 6).map((item, i) => {
                                    let titlecontent = item.name
                                    if (titlecontent?.length > 3) {
                                        titlecontent += "..."
                                    }
                                    const itemId = item?.property_token || item?.data_id || i;
                                    const imageUrl = getImageUrl(item);
                                    // Get price from price_per_night or total_price
                                    // Correctly derive price with currency
                                    const currencySymbol = currency || '₹';
                                    // Try extracted_price first, fall back to price string then to 0
                                    const price =
                                        (typeof item?.price_per_night?.extracted_price === "number" && item.price_per_night.extracted_price > 0)
                                            ? item.price_per_night.extracted_price
                                            : (typeof item?.total_price?.extracted_price === "number" && item.total_price.extracted_price > 0)
                                                ? item.total_price.extracted_price
                                                : (
                                                    (typeof item?.price_per_night?.price === "string" && item.price_per_night.price.replace(/[^\d.]/g, '').length)
                                                        ? Number(item.price_per_night.price.replace(/[^\d.]/g, ''))
                                                        : (typeof item?.total_price?.price === "string" && item.total_price.price.replace(/[^\d.]/g, '').length)
                                                            ? Number(item.total_price.price.replace(/[^\d.]/g, ''))
                                                            : 0
                                                );
                                    // Format price string for UI display with symbol
                                    const displayPrice = `${currencySymbol} ${price}`;

                                    return (

                                        <SwiperSlide key={itemId}> <div className="card_col " key={i} >

                                            <div
                                                className="recommend_card_box card_rounded shadow margin_lr margin_md-lr cursor-pointer"
                                                onClick={() => viewDetails(item?.name, item?.hotel_identifier)}
                                            >

                                                <div className="card_box pe-">
                                                    <div className="card_box_img card_rounded relative overflow-hidden card-img-250">
                                                        {imageErrors[itemId] ? (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 card_rounded">
                                                                <span className="text-gray-400 text-sm">Image not available</span>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={imageUrl}
                                                                className='card_rounded w-full h-full object-cover'
                                                                alt={item?.name || 'Hotel image'}
                                                                onError={(e) => handleImageError(itemId, item, e)}
                                                                onLoad={() => {

                                                                    if (imageErrors[itemId]) {
                                                                        setImageErrors(prev => {
                                                                            const newErrors = { ...prev };
                                                                            delete newErrors[itemId];
                                                                            return newErrors;
                                                                        });
                                                                    }
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        )}

                                                        <div className="rated_msg absolute top-5 flex  justify-between items-center left-5 right-5">
                                                            {/* <div className="msg">
                                                                <p className='m-0'>Top rated</p>
                                                            </div>
                                                            <div className="msg_icon">
                                                                <FaRegHeart />
                                                            </div> */}
                                                        </div>

                                                    </div>
                                                    {/* *** */}
                                                    <div className="card_box_detail px-4 py-5 card_rounded flex flex-col z-1 gap-2 relative">
                                                        <h4 className='m-0 capitalize'>
                                                            {item?.name}
                                                        </h4>
                                                        {/* ****** */}
                                                        <div className="time flex items-center gap-3 relative">
                                                            <div className="icon flex items-center gap-1">
                                                                <span><IoTime /></span>
                                                                <span><p className='m-0'>2 Days 3 Nights</p></span>
                                                            </div>
                                                            <div className="guest flex items-center gap-1">
                                                                <span><FaUserAlt /></span>
                                                                <span><p className='m-0'>4 -5 guest</p></span>
                                                            </div>
                                                        </div>
                                                        {/* ******* */}
                                                        <div className="price_book flex mt-3 justify-between items-center">
                                                            <h5 className='m-0'>
                                                                {displayPrice}.00 <span>/ person</span>
                                                            </h5>
                                                            <button
                                                                className="button_bg2 rounded-full bg-color-green color_bl"
                                                                onClick={(e) => { e.stopPropagation(); viewDetails(item?.name, item?.hotel_identifier); }}
                                                            >
                                                                Book Now
                                                            </button>

                                                        </div>
                                                        {/* *************** rating_list */}
                                                        <div className="rating_list absolute flex items-center gap-1 right-10 shadow">
                                                            <span className='w-5'><FontAwesomeIcon icon={faStar} /></span>
                                                            <span><p className='m-0'>{item?.rating || 0}</p></span>
                                                            <span><p className='m-0'>({item?.reviews || 0} reviews)</p></span>
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* *********** */}
                                            </div>
                                            {/* *********** */}
                                        </div>
                                        </SwiperSlide>
                                    )
                                });
                            } else {
                                return Array.from({ length: 6 }).map((_, i) => (
                                    <SwiperSlide key={`shimmer-${i}`}>
                                        <ShimmerCard />
                                    </SwiperSlide>
                                ));
                            }
                        })()}
                    </Swiper>
                </div>
            </section>
        </>
    )
}
