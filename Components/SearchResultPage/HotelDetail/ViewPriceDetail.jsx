"use client";
import React, { useState, useEffect } from 'react'
import { usePathname } from "next/navigation";
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { useCurrency } from "@/context/CurrencyContext";
import { getAssetPath } from "@/app/utils/assetPath";
import { buildAffiliateLinkWithSubId } from "@/lib/tpLink";

export default function ViewPriceDetail({ PriceRate, hotelName, hotelAddress, hotelData, onSearchDates, isLoadingPrices, showPricing = true }) {
    const { formatPrice } = useCurrency();
    const pathname = usePathname() || "/";
    const hotelPrice = PriceRate?.data?.raw?.result?.rates;
    const allRatesData = PriceRate?.data?.raw?.result; // This might have deep links

    // Initialize dates:
    // - default check-in: 3 days after today
    // - default check-out: next day (4 days after today)
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getDefaultCheckin = () => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d.toISOString().split('T')[0];
    };

    const getDefaultCheckout = () => {
        const d = new Date();
        d.setDate(d.getDate() + 4);
        return d.toISOString().split('T')[0];
    };

    const [checkinDate, setCheckinDate] = useState(getDefaultCheckin());
    const [checkoutDate, setCheckoutDate] = useState(getDefaultCheckout());
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // ViewPriceDetail uses parent's searchCheckin/searchCheckout; no need to call onSearchDates on mount
    // (SearchHotelDetail already initializes with same defaults, and calling here caused extra refetches)

    // Update timestamp when price data changes
    useEffect(() => {
        if (!isLoadingPrices && hotelPrice) {
            setLastUpdated(new Date());
        }
    }, [hotelPrice, isLoadingPrices]);

    // Update checkout if checkin is changed to be after checkout
    useEffect(() => {
        if (checkinDate >= checkoutDate) {
            const newCheckout = new Date(checkinDate);
            newCheckout.setDate(newCheckout.getDate() + 1);
            setCheckoutDate(newCheckout.toISOString().split('T')[0]);
        }
    }, [checkinDate, checkoutDate]);

    // Create a unique key based on dates and price data to force re-render
    const priceDataKey = `${checkinDate}-${checkoutDate}-${hotelPrice?.length || 0}-${JSON.stringify(hotelPrice?.map(p => p.rate))}`;

    const bookingImg = [
        { name: "Booking.com", img: "/logo/hoteldetail/Booking_Com.png", affiliateBase: "https://tp.media/r?marker=620562&trs=404603&p=2076&campaign_id=84" },
        { name: "expedia.com", img: "/logo/hoteldetail/expedia_logo.svg", affiliateBase: "https://tp.media/r?marker=620562&trs=404603&p=8645&campaign_id=594" },
        { name: "agoda.com", img: "/logo/hoteldetail/Agoda.png", affiliateBase: "" },
        { name: "vio.com", img: "/logo/hoteldetail/Vio_com.png", affiliateBase: "" },
        { name: "traveloka.com", img: "/logo/hoteldetail/travelok.svg", affiliateBase: "" },
        { name: "Trip.com", img: "/logo/hoteldetail/tripcom.webp", affiliateBase: "https://tp.media/r?marker=620562&trs=404603&p=8626&campaign_id=121" },
    ];

    const normalizeProviderName = (s) => (s || "").toLowerCase().replace(/\/+$/, "").replace(/^www\./, "").trim();

    const findProviderConfig = (providerName) =>
        bookingImg.find((img) => normalizeProviderName(img.name) === normalizeProviderName(providerName)) ||
        bookingImg.find((img) => normalizeProviderName(providerName).includes(normalizeProviderName(img.name))) ||
        bookingImg.find((img) => normalizeProviderName(img.name).includes(normalizeProviderName(providerName)));

    // Full address for search: "Rome Cavalieri, A Waldorf Astoria Hotel, Rome, Lazio, Italy" (not truncated)
    const fullAddress = [hotelName, hotelAddress].filter(Boolean).join(", ").trim() || hotelName || hotelAddress || "";

    // Ensure deep link domain matches the displayed provider (e.g. Trip.com must go to trip.com, not makemytrip)
    const linkMatchesProvider = (url, providerName) => {
        if (!url || typeof url !== "string") return false;
        const lower = url.toLowerCase();
        const site = (providerName || "").toLowerCase();
        if (site.includes("booking") && !site.includes("dot")) return lower.includes("booking.com");
        if (site.includes("expedia")) return lower.includes("expedia");
        if (site.includes("trip.com") || (site.includes("trip") && !site.includes("tripadvisor"))) {
            return lower.includes("trip.com") && !lower.includes("makemytrip") && !lower.includes("cleartrip");
        }
        return true; // for Agoda, Vio, etc. accept any valid link
    };

    // Helper function to construct booking site URLs (only use Google as last resort for unknown brands)
    const constructBookingUrl = (siteName, hotelData, priceRateItem, checkin, checkout) => {
        if (!fullAddress) return null;

        // PRIORITY 1: Use deep_link from the current rate item when present (API’s direct booking link)
        const itemLink = priceRateItem?.deep_link || priceRateItem?.url || priceRateItem?.link || priceRateItem?.booking_url;
        if (itemLink && typeof itemLink === "string" && (itemLink.startsWith("http://") || itemLink.startsWith("https://")) && linkMatchesProvider(itemLink, siteName)) {
            return itemLink;
        }

        // PRIORITY 2: hotelData.xotelo.rates – match by normalized name
        if (hotelData?.xotelo?.rates) {
            const n = normalizeProviderName(siteName);
            const siteData = hotelData.xotelo.rates.find((r) => normalizeProviderName(r?.name) === n || (r?.name && normalizeProviderName(r.name).includes(n)));
            const xotelLink = siteData?.deep_link || siteData?.url || siteData?.link;
            if (xotelLink && typeof xotelLink === "string" && (xotelLink.startsWith("http://") || xotelLink.startsWith("https://")) && linkMatchesProvider(xotelLink, siteName)) {
                return xotelLink;
            }
        }

        // PRIORITY 3: allRatesData.rates – match by normalized name
        const ratesArr = allRatesData?.rates || hotelPrice;
        if (Array.isArray(ratesArr)) {
            const n = normalizeProviderName(siteName);
            const rateData = ratesArr.find((r) => normalizeProviderName(r?.name) === n || (r?.name && normalizeProviderName(r.name).includes(n)));
            const rateLink = rateData?.deep_link || rateData?.url || rateData?.link;
            if (rateLink && typeof rateLink === "string" && (rateLink.startsWith("http://") || rateLink.startsWith("https://")) && linkMatchesProvider(rateLink, siteName)) {
                return rateLink;
            }
        }

        // FALLBACK: build search URLs for known brands (avoid sending users to Google for these)
        // Pass full address like "Rome Cavalieri, A Waldorf Astoria Hotel, Rome, Lazio, Italy"; encode as %20/%2C (not +)
        const encodedHotel = encodeURIComponent(fullAddress);
        const site = (siteName || "").toLowerCase().trim();
        const los = Math.max(1, Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)));

        // Trip.com/Vio: use same full search string as Booking.com for consistency
        const buildTripComUrl = () => {
            const isIndia = fullAddress.toLowerCase().includes("india");
            const tripLocale = isIndia ? "en-in" : "en-US";
            const tripCurr = isIndia ? "INR" : "USD";
            return `https://www.trip.com/hotels/list?flexType=1&destName=${encodedHotel}&searchWord=${encodedHotel}&searchType=H&checkin=${checkin}&checkout=${checkout}&crn=1&adult=2&curr=${tripCurr}&locale=${tripLocale}&old=1`;
        };

        if (site.includes("booking") && !site.includes("dot")) return `https://www.booking.com/searchresults.html?ss=${encodedHotel}&checkin=${checkin}&checkout=${checkout}`;
        if (site.includes("expedia")) return `https://www.expedia.com/Hotel-Search?destination=${encodedHotel}&startDate=${checkin}&endDate=${checkout}`;
        if (site.includes("trip.com") || (site.includes("trip") && !site.includes("tripadvisor"))) return buildTripComUrl();
        if (site.includes("vio")) return buildTripComUrl();
        if (site.includes("agoda")) return `https://www.agoda.com/search?textToSearch=${encodedHotel}&checkIn=${checkin}&checkOut=${checkout}&los=${los}&room=1&adults=2`;
        if (site.includes("hotels.com") || (site.includes("hotels") && site.includes(".com"))) return `https://www.hotels.com/search.do?destination=${encodedHotel}&checkIn=${checkin}&checkOut=${checkout}`;
        if (site.includes("traveloka")) return `https://www.traveloka.com/en-id/hotel/search?q=${encodedHotel}&checkin=${checkin}&checkout=${checkout}`;
        if (site.includes("tripadvisor")) return `https://www.tripadvisor.com/Hotels?q=${encodedHotel}`;

        return `https://www.google.com/search?q=hotel+${encodedHotel}+${encodeURIComponent(siteName || "")}`;
    }

    // Helper function to build affiliate link with SubID tracking and specific hotel URL
    const buildAffiliateLink = (affiliateBase, hotelUrl) => {
        if (!hotelUrl) return null;
        if (!affiliateBase) return hotelUrl;
        return buildAffiliateLinkWithSubId(affiliateBase, hotelUrl, {
            page: pathname,
            placement: "view_price_deal",
        });
    };
    if (!showPricing) {
        return null;
    }

    console.log(hotelPrice, "prices::::::::::::::::::");
    return (
        <>
            <section className='padding_bottom'>
                <div className="container">
                    <div className="row matrix_fix">
                        <div className="col-lg-12">
                            <div className="content_box_detail view_price_detial_content rounded-2xl border border-gray-300 bg_grey2">
                                <div className="view_price_title">
                                    <div className="view-price-title-row">
                                        <h4 className="view-price-title">View prices for your travel dates</h4>
                                        {/* {!isLoadingPrices && hotelPrice && hotelPrice.length > 0 && (
                                            <small>Last updated: {lastUpdated.toLocaleTimeString()}</small>
                                        )} */}
                                    </div>
                                    {/* {!isLoadingPrices && hotelPrice && hotelPrice.length > 0 && (
                                        <p>
                                            📅 {new Date(checkinDate).toLocaleDateString()} → {new Date(checkoutDate).toLocaleDateString()}
                                            ({Math.ceil((new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24))} nights)
                                        </p>
                                    )} */}
                                </div>

                                {/* Date Picker Section */}
                                <div className="date_picker_section view-price-date-section">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-5 mb-3 mb-lg-0">
                                            <label htmlFor="checkin" className="view-price-label">
                                                Check-in Date
                                            </label>
                                            <input
                                                type="date"
                                                id="checkin"
                                                className="form-control view-price-input"
                                                value={checkinDate}
                                                onChange={(e) => setCheckinDate(e.target.value)}
                                                min={getTodayDate()}
                                            />
                                        </div>
                                        <div className="col-lg-5 col-md-5 mb-3 mb-lg-0">
                                            <label htmlFor="checkout" className="view-price-label">
                                                Check-out Date
                                            </label>
                                            <input
                                                type="date"
                                                id="checkout"
                                                className="form-control view-price-input"
                                                value={checkoutDate}
                                                onChange={(e) => setCheckoutDate(e.target.value)}
                                                min={checkinDate}
                                            />
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            {/* <div>
                                                {(() => {
                                                    const checkin = new Date(checkinDate);
                                                    const checkout = new Date(checkoutDate);
                                                    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
                                                    return `${nights} night${nights !== 1 ? 's' : ''}`;
                                                })()}
                                            </div> */}
                                            <button
                                                onClick={() => onSearchDates && onSearchDates(checkinDate, checkoutDate)}
                                                className="hotel_detail_button hotel_mobile_button text-white view-price-search-button"
                                                disabled={isLoadingPrices}
                                            >
                                                {isLoadingPrices ? 'Searching...' : 'Search Prices'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Loading State */}
                                {isLoadingPrices && (
                                    <div className="view-price-loading">
                                        <div className="view-price-spinner"></div>
                                        <p className="view-price-loading-text">
                                            Fetching prices for your selected dates...
                                        </p>
                                    </div>
                                )}

                                {!isLoadingPrices && (hotelPrice || [])
                                    .filter(item => item?.name != null)
                                    .map((item, i) => {
                                        const matchedImg = findProviderConfig(item.name);
                                        const hotelUrl = constructBookingUrl(item.name, hotelData, item, checkinDate, checkoutDate);
                                        const finalLink = matchedImg?.affiliateBase ? buildAffiliateLink(matchedImg.affiliateBase, hotelUrl) : hotelUrl;

                                        // Calculate pricing breakdown (support rate as number or { amount } from API)
                                        const nights = Math.ceil((new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24));
                                        const ratePerNight = Number(typeof item.rate === "object" && item.rate != null ? item.rate.amount : item.rate);
                                        const totalBeforeTax = ratePerNight * nights;
                                        const tax = Number(item.tax || 0);
                                        const grandTotal = totalBeforeTax + tax;
                                        const displayImg = matchedImg?.img;
                                        const logoAlt = item.name;

                                        return (
                                            <React.Fragment key={`${item.name}-${i}-${priceDataKey}`}>
                                                <div className="view_price_box d-none d-lg-block">
                                                    <div className="price_box">
                                                        <div className="row items-center">

                                                            {/* Logo / provider name column */}
                                                            <div className="col-lg-3">
                                                                <div className="price_box_item">
                                                                    <div className="icon text-center flex">
                                                                        {displayImg ? (
                                                                            <img src={getAssetPath(displayImg)} alt={logoAlt} width={120} height={120} />
                                                                        ) : (
                                                                            <span className="text-dark fw-semibold" style={{ fontSize: "1rem" }}>{item.name}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* **************** */}
                                                            <div className="col-lg-3">
                                                                <div className="text_detail">
                                                                    <div className="info flex justify-center">
                                                                        <div className="info_item">
                                                                            <small className="view-price-rate-note">
                                                                                {formatPrice(ratePerNight)} / {nights} night{nights !== 1 ? 's' : ''}
                                                                            </small>
                                                                            {tax > 0 && (
                                                                                <small className="view-price-tax-note">
                                                                                    + {formatPrice(tax)} tax
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            {/* Price column */}
                                                            <div className="col-lg-3">
                                                                <div className="price_box_price flex justify-center flex-column view-price-box-price">
                                                                    {(() => {
                                                                        const nights = Math.ceil((new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24));
                                                                        const ratePerNight = Number(item.rate);
                                                                        const totalBeforeTax = ratePerNight * nights;
                                                                        const tax = Number(item.tax || 0);
                                                                        const grandTotal = totalBeforeTax + tax;

                                                                        return (
                                                                            <>
                                                                                <div
                                                                                    className="view-price-total-wrap"
                                                                                    title={`${formatPrice(ratePerNight)} per night × ${nights} = ${formatPrice(totalBeforeTax)}\n+ Tax: ${formatPrice(tax)}\n= ${formatPrice(grandTotal)}`}
                                                                                >
                                                                                    <h4 className="view-price-total-amount">
                                                                                        {formatPrice(grandTotal)}
                                                                                    </h4>

                                                                                </div>
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>

                                                            {/* Button column */}
                                                            <div className="col-lg-3">
                                                                <div className="price_box_button price_view_detail flex justify-end">
                                                                    {finalLink ? (
                                                                        <a
                                                                            href={finalLink}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="hotel_detail_button text-white view-price-link"
                                                                        >
                                                                            View deals
                                                                        </a>
                                                                    ) : (
                                                                        <button
                                                                            className="hotel_detail_button text-white"
                                                                        >
                                                                            View deals
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                                {/* /*********************************************** mobile view show price detraik */}

                                                <div className="view_price_box d-block d-lg-none">
                                                    <div className="price_box">
                                                        <div className="detail flex justify-between items-center">
                                                            <div className="icon flex flex-col gap-0 ">
                                                                {displayImg ? (
                                                                    <img src={getAssetPath(displayImg)} alt={item.name} width={100} height={100} />
                                                                ) : (
                                                                    <span className="text-dark fw-semibold">{item.name}</span>
                                                                )}
                                                                <div className="info_item">
                                                                    <small className="view-price-rate-note-sm">
                                                                        {formatPrice(ratePerNight)} / {nights} night{nights !== 1 ? 's' : ''}
                                                                    </small>
                                                                    {tax > 0 && (
                                                                        <small className="view-price-tax-note-sm">
                                                                            + {formatPrice(tax)} tax
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* *************************** */}
                                                            <div className="side_price_detail">
                                                                <div className="side_detail">
                                                                    {/* ***** */}
                                                                    <div className="price_box_price mobile_price_box flex justify-center flex-column m-0 view-price-box-price">
                                                                        {(() => {
                                                                            const nights = Math.ceil((new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24));
                                                                            const ratePerNight = Number(item.rate);
                                                                            const totalBeforeTax = ratePerNight * nights;
                                                                            const tax = Number(item.tax || 0);
                                                                            const grandTotal = totalBeforeTax + tax;

                                                                            return (
                                                                                <>
                                                                                    <div
                                                                                        className="view-price-total-wrap"
                                                                                        title={`${formatPrice(ratePerNight)} per night × ${nights} = ${formatPrice(totalBeforeTax)}\n+ Tax: ${formatPrice(tax)}\n= ${formatPrice(grandTotal)}`}
                                                                                    >
                                                                                        <h4 className="view-price-total-amount m-0">
                                                                                            {formatPrice(grandTotal)}
                                                                                        </h4>

                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                    {/* ****** */}
                                                                    <div className="price_box_button price_view_detail mobile_price_detail flex justify-end">
                                                                        {finalLink ? (
                                                                            <a
                                                                                href={finalLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="hotel_detail_button text-white view-price-link"
                                                                            >
                                                                                View deals
                                                                            </a>
                                                                        ) : (
                                                                            <button
                                                                                className="hotel_detail_button text-white"
                                                                            >
                                                                                View deals
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                </div>

                                                            </div>
                                                            {/* ********* */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}

                                {/* No Prices Available Message */}
                                {!isLoadingPrices && (!hotelPrice || hotelPrice.length === 0) && (
                                    <div className="view-price-no-data">
                                        <p className="view-price-no-data-title">
                                            ⚠️ No pricing data available for the selected dates.
                                        </p>
                                        <p className="view-price-no-data-sub">
                                            Try selecting different check-in and check-out dates.
                                        </p>
                                    </div>
                                )}

                                <p className='m-0 text-center'>
                                    Prices shown are based on available data and may not always be accurate. Final prices are confirmed at the time of booking.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
