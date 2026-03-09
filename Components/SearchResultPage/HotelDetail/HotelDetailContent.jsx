"use client";
import React from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import { getAssetPath } from "@/app/utils/assetPath";
import { useSearchParams } from "next/navigation";

function ShimmerPriceCard() {
  return (
    <div className="hotel_price_detail">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          className="hotel_price_card flex items-center justify-between border-t border-gray-300 p-4"
          key={i}
        >
          {/* Left: Title */}
          <div className="shimmer-text w-1/3 h-6 rounded-md"></div>

          {/* Middle: Price */}
          <div className="shimmer-text w-1/6 h-6 rounded-md mx-4"></div>

          {/* Right: Button */}
          <div className="shimmer-button w-24 h-8 rounded-md"></div>
        </div>
      ))}

      {/* Shimmer CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .shimmer-text,
        .shimmer-button {
          background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `,
        }}
      />
    </div>
  );
}

export default function HotelDetailContent({ Pricing, load }) {
  const searchParams = useSearchParams();
  // *********************************
  return (
    <>
      <div className="section_hoitel_detail_content ">
        <div className="container">
          <div className="price_card rounded-2xl ">
            <div className="row">
              <div className="col-lg-12">
                {/* ********************** */}
                {load ? (
                  <ShimmerPriceCard />
                ) : (
                  <div className="hotel_price_detail">
                    {/* 
                                                (() => {
                                                    const filteredPrices = Pricing?.filter((item) => {
                                                        const title = item?.platform?.toLowerCase() || '';
                                                        return title.includes('booking') || title.includes('expedia');
                                                    }) || [];


                                                    const bookingItem = filteredPrices.find((item) => {
                                                        const title = item?.platform?.toLowerCase() || '';
                                                        return title.includes('booking');
                                                    });

                                                    const expediaItem = filteredPrices.find((item) => {
                                                        const title = item?.platform?.toLowerCase() || '';
                                                        return title.includes('expedia');
                                                    });
                                                    const createUrlForLocation = (providerName, hotelName) => {
                                                        if (!hotelName) return '';
                                                        const checkin = searchParams.get('checkin') || '';
                                                        const checkout = searchParams.get('checkout') || '';
                                                        const adults = searchParams.get('adults') || '2';
                                                        const rooms = searchParams.get('rooms') || '1';

                                                        const cleanHotelName = hotelName
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9\s-]/g, '')
                                                            .replace(/\s+/g, '-')
                                                            .replace(/-+/g, '-')
                                                            .trim();

                                                        const isBooking = providerName?.toLowerCase().includes('booking');
                                                        const isExpedia = providerName?.toLowerCase().includes('expedia');

                                                        if (isBooking) {
                                                            let bookingUrl = 'https://www.booking.com/searchresults.en.html?';

                                                            bookingUrl += `ss=${encodeURIComponent(hotelName)}`;

                                                            if (checkin) bookingUrl += `&checkin=${checkin}`;
                                                            if (checkout) bookingUrl += `&checkout=${checkout}`;

                                                            bookingUrl += `&group_adults=${adults}`;
                                                            bookingUrl += `&no_rooms=${rooms}`;

                                                            bookingUrl += `&aid=818288`;

                                                            return bookingUrl;
                                                        } else if (isExpedia) {
                                                            let expediaUrl = 'https://www.expedia.com/Hotel-Search?';

                                                            expediaUrl += `destination=${encodeURIComponent(hotelName)}`;

                                                            if (checkin) expediaUrl += `&startDate=${checkin}`;
                                                            if (checkout) expediaUrl += `&endDate=${checkout}`;

                                                            expediaUrl += `&adults=${adults}`;
                                                            expediaUrl += `&rooms=${rooms}`;

                                                            expediaUrl += `&aid=818288`;

                                                            return expediaUrl;
                                                        }

                                                        return '';
                                                    };

                                                    const isGoogleUrl = (url) => {
                                                        if (!url) return false;
                                                        const urlLower = url.toLowerCase();
                                                        return urlLower.includes('google.com') ||
                                                            urlLower.includes('googleadservices.com') ||
                                                            urlLower.includes('/aclk') ||
                                                            urlLower.includes('gclid=') ||
                                                            urlLower.includes('googleads');
                                                    };

                                                    const isDirectWebsiteUrl = (url, providerName) => {
                                                        if (!url) return false;
                                                        const urlLower = url.toLowerCase();
                                                        const providerLower = providerName?.toLowerCase() || '';

                                                        if (providerLower.includes('booking')) {
                                                            return urlLower.includes('booking.com') && !isGoogleUrl(url);
                                                        } else if (providerLower.includes('expedia')) {
                                                            return (urlLower.includes('expedia.com') || urlLower.includes('expedia.co')) && !isGoogleUrl(url);
                                                        }
                                                        return false;
                                                    };

                                                    const replaceAidInUrl = (url) => {
                                                        if (!url) return '';

                                        if (isGoogleUrl(url)) {
                                            return '';
                                        }

                                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                            return '';
                                        }

                                                        let cleanUrl = url;

                                                     remove code herere xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

                                            const hasQuery = cleanUrl.includes('?');
                                            const separator = hasQuery ? '&' : '?';

                                            if (!cleanUrl.includes('aid=818288')) {
                                                cleanUrl = `${cleanUrl}${separator}aid=818288`;
                                                        }

                                            return cleanUrl;
                                                    };

                                            const uniqueItems = [bookingItem, expediaItem].filter(Boolean);

                                                    return uniqueItems.map((item, i) => {

                                                let finalUrl = '';

                                            if (item?.bookingUrl && !isGoogleUrl(item?.bookingUrl)) {
                                                            if (isDirectWebsiteUrl(item?.bookingUrl, item?.title)) {
                                                finalUrl = replaceAidInUrl(item?.bookingUrl);
                                                            } else {
                                                finalUrl = createUrlForLocation(item?.title, title_url);
                                                            }
                                                        } else {
                                            finalUrl = createUrlForLocation(item?.platform, title_url);
                                                        }

                                            return (
                                            <div className="hotel_price_card flex items-center justify-between  border-t-1 border-gray-300" key={i}>
                                                <table className='table m-0'>
                                                    <tbody>
                                                        <tr className=' border-none '>
                                                            <td className='border-0 text-left align-middle'>
                                                                <div className="booking_icon flex items-center">
                                                                    <img src={getAssetPath((item?.platform?.toLowerCase() || '').includes('expedia') ? "/logo/hoteldetail/expedia_logo.svg" : "/logo/hoteldetail/Booking_Com.png")} alt={`${item?.platform} booking logo - Compare hotel prices`} />


                                                                </div>
                                                            </td>

                                                            <td className='border-0 text-center align-middle'>

                                                                <h6 className='m-0'>
                                                                    ${item?.totalPriceINR}
                                                                </h6>

                                                            </td>

                                                            <td className='border-0 text-right align-middle'>

                                                                <a href={finalUrl || '#'} target='_blank' rel="noopener noreferrer" className='button_bg bg-color-green color_bl'>
                                                                    View Details
                                                                </a>

                                                            </td>

                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                            )
                                                    });

                                                })()
                                             */}
                    {/* ******************************************* */}
                    {Pricing?.map((item, i) => {
                      return (
                        <>
                          <div
                            className="hotel_price_card flex items-center justify-between  border-t-1 border-gray-300"
                            key={i}
                          >
                            <table className="table m-0">
                              <tbody>
                                <tr className=" border-none ">
                                  <td className="border-0 text-left align-middle">
                                    <div className="booking_icon flex items-center">
                                      {/* <img src={getAssetPath((item?.platform?.toLowerCase() || '').includes('expedia') ? "/logo/hoteldetail/expedia_logo.svg" : "/logo/hoteldetail/Booking_Com.png")} alt={`${item?.platform} booking logo - Compare hotel prices`} /> */}
                                      <h6>{item?.platform}</h6>
                                    </div>
                                  </td>

                                  <td className="border-0 text-center align-middle">
                                    <h6 className="m-0">
                                      ${item?.totalPriceINR}
                                    </h6>
                                  </td>

                                  <td className="border-0 text-right align-middle">
                                    <a
                                      href={"#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="button_bg bg-color-green color_bl"
                                    >
                                      View Deals
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
                {/* ************************ */}
              </div>
              {/* ****************************************** */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
