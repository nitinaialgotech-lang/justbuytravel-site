"use client";
import React, { useEffect, useState, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../style/searchresult.css";
import HotelDetailContent from "./HotelDetailContent";
import { useQuery } from "@tanstack/react-query";
import {
  GetHotel_Detail,
  HotelDetail,
  searchHotelDetail,
  GetSerpHotelDetail,
  GetAiModal,
} from "@/app/Route/endpoints";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import AboutHotelDetail from "./AboutHotelDetail";
import SerpAiModalContent from "./SerpAiModalContent";
import NearByHotel from "./NearByHotel";
import HotelLocation from "./HotelLocation";
import Footer from "@/component/Footer";
import HotelFacilities from "./HotelFacilities";
import ImageGallery from "./ImageGallery";
import { IoShareOutline } from "react-icons/io5";
// Swiper React components
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoLocationOutline } from "react-icons/io5";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import Blogs from "@/Components/HomePage/Blog/Blogs";
import Header from "@/component/Header";
import HotelReviews from "./HotelReviews";
import { TbWorld } from "react-icons/tb";
import Link from "next/link";
import { PiPhoneLight } from "react-icons/pi";
import HotelAllReview from "./HotelAllReview";
import PopularHotelAroundWorld from "./PopularHotelAroundWorld";
import HotelSearchNearByLocation from "../HotelSearchNearByLocation";
import HotelSearchIconicPlaces from "../HotelSearchIconicPlaces";
import HotelSerpDataSection from "./HotelSerpDataSection";
import { FaQ } from "react-icons/fa6";
import FaqSection from "@/Components/HomePage/Faq/FaqSection";
import GalleryModal from "./GalleryModal";
import {
  MdOutlineKeyboardArrowLeft,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import {
  LuBedDouble,
  LuBedSingle,
  LuBed,
  LuHotel,
  LuHouse,
  LuWaves,
  LuTreePalm,
} from "react-icons/lu";
import { useCurrency } from "@/context/CurrencyContext";
import { getHotelIdFromSlug, createHotelSlug } from "@/app/utils/seo";
import { saveRecentlyViewedProperty } from "@/app/utils/recentlyViewed";
import { getAssetPath } from "@/app/utils/assetPath";
import { AFFILIATE_BASES } from "@/lib/affiliateBases";
import { buildAffiliateLinkWithSubId } from "@/lib/tpLink";
import { format, differenceInDays } from "date-fns";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";
import Search from "@/Components/HomePage/Search";
import SearchTab from "@/component/SearchTab";
import { FaShareAlt, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
export default function SearchHotelDetail() {
  const { formatPrice, currency } = useCurrency();
  const navigate = useRouter();
  const search_detail = useSearchParams();
  const params = useParams();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const slugParam = params?.hotel || params?.slug;
  const codeFromSlug = getHotelIdFromSlug(slugParam);
  const codeFromQuery =
    search_detail.get("hotel") ||
    search_detail.get("id") ||
    search_detail.get("code");
  const code = codeFromQuery || codeFromSlug;
  const locationSectionRef = useRef(null);
  const [hoverDate, setHoverDate] = useState(null);
  // ******************************** location section scroll into view handler
  const handleScrollToLocation = () => {
    if (!locationSectionRef.current) return;

    const headerOffset = 80; // adjust if sticky header height differs
    const elementPosition =
      locationSectionRef.current.getBoundingClientRect().top +
      window.pageYOffset;

    window.scrollTo({
      top: elementPosition - headerOffset,
      behavior: "smooth",
    });
  };
  // const cityhotel = search_detail.get("city");

  // Date state for pricing - default to 3 and 4 days from today
  const getDefaultCheckin = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };
  const getDefaultCheckout = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toISOString().split("T")[0];
  };

  const [searchCheckin, setSearchCheckin] = useState(() => getDefaultCheckin());
  const [searchCheckout, setSearchCheckout] = useState(() =>
    getDefaultCheckout(),
  );
  const [expandedPartners, setExpandedPartners] = useState(new Set());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const datePickerWrapperRef = useRef(null);
  const [monthsShown, setMonthsShown] = useState(2);
  const [isMobileView, setIsMobileView] = useState(false);

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAge, setChildrenAge] = useState([0]);

  // const StartDate = searchCheckin ? new Date(searchCheckin) : null;
  // const EndDate = searchCheckout ? new Date(searchCheckout) : null;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [autoSelected, setAutoSelected] = useState(false);
  const [openToDate, setOpenToDate] = useState(null);
  const [calendarKey, setCalendarKey] = useState(0); // force rerender
  const selectionPhaseRef = useRef("start"); // "start" = next click is check-in, "end" = next click is check-out
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarOpen &&
        datePickerWrapperRef.current &&
        !datePickerWrapperRef.current.contains(e.target)
      ) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calendarOpen]);

  const dateRange = {
    from: searchCheckin ? new Date(searchCheckin) : undefined,
    to: searchCheckout ? new Date(searchCheckout) : undefined,
  };
  const nightsCount =
    dateRange?.from && dateRange?.to
      ? Math.max(1, differenceInDays(dateRange.to, dateRange.from))
      : null;

  useEffect(() => {
    if (calendarOpen) {
      setStartDate(searchCheckin ? new Date(searchCheckin) : null);
      setEndDate(searchCheckout ? new Date(searchCheckout) : null);
      // selectionPhaseRef.current = "start";
    }
  }, [calendarOpen]);

  // ***************************************
  // react-datepicker selectsRange: first click can send single Date, second click sends [start, end]
  // Use selection phase so after refresh, first click = check-in, second click = check-out
  const handleRangeChange = (value) => {
    const start = Array.isArray(value) ? value[0] : value;
    const end = Array.isArray(value) ? value[1] : null;
    if (!start) return;
    setHoverDate(null)
    const nextDay = new Date(start);
    nextDay.setDate(nextDay.getDate() + 1);

    // Full range received (library sent both dates)
    if (end && end > start) {
      setStartDate(start);
      setEndDate(end);
      setSearchCheckin(format(start, "yyyy-MM-dd"));
      setSearchCheckout(format(end, "yyyy-MM-dd"));
      setCalendarOpen(false);
      return;
    }

    // Single date: use phase so first click after opening = check-in, second = check-out
    if (selectionPhaseRef.current === "end") {
      setEndDate(start);
      setSearchCheckin(format(startDate, "yyyy-MM-dd"));
      setSearchCheckout(format(start, "yyyy-MM-dd"));
      setCalendarOpen(false);
      return;
    }
    // Second click = checkout


    // First click = user chose check-in
    selectionPhaseRef.current = "end";
    setStartDate(start);
    setEndDate(nextDay);
    setSearchCheckin(format(start, "yyyy-MM-dd"));
    setSearchCheckout(format(nextDay, "yyyy-MM-dd"));
    if (
      monthsShown === 1 &&
      (nextDay.getMonth() !== start.getMonth() ||
        nextDay.getFullYear() !== start.getFullYear())
    ) {
      setOpenToDate(nextDay);
      setCalendarKey((prev) => prev + 1);
    }
  };

  // ******************************
  const minSelectableDate =
    selectionPhaseRef.current === "start"
      ? new Date()
      : startDate
        ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date();
  // ***************************** hover effect 

  // Hover range logic
  // const isInHoverRange = (date) => {
  //   if (!startDate || !hoverDate) return false;
  //   const start = startDate < hoverDate ? startDate : hoverDate;
  //   const end = startDate < hoverDate ? hoverDate : startDate;
  //   return date >= start && date <= end;
  // };
  // Day class logic
  // const dayClassName = (date) => {
  //   if (!date) return "";
  //   if (startDate && date.toDateString() === startDate.toDateString())
  //     return "ta_range_start";
  //   if (endDate && date.toDateString() === endDate.toDateString())
  //     return "ta_range_end";
  //   if (selectionPhaseRef.current === "end" && hoverDate && isInHoverRange(date)) return "ta_range_middle";
  //   return "";
  // };

  const isInHoverRange = (date) => {
    if (!startDate || !hoverDate) return false;
    const start = startDate < hoverDate ? startDate : hoverDate;
    const end = startDate < hoverDate ? hoverDate : startDate;
    return date >= start && date <= end;
  };

  const dayClassName = (date) => {
    if (!date) return "";

    if (startDate && date.toDateString() === startDate.toDateString())
      return "ta_range_start";

    if (
      selectionPhaseRef.current === "end" &&
      hoverDate &&
      isInHoverRange(date)
    ) {
      if (date.toDateString() === hoverDate.toDateString()) {

        return "ta_range_end";
      }
      return "ta_range_middle";
    }
    if (selectionPhaseRef.current === "start" && endDate && date.toDateString() === endDate.toDateString())
      return "ta_range_end";

    return "";
  };






















  // ****************************************************************************************************************
  const ShimmerCard = () => (
    <div className="hoteldetail_banner pt-5">
      <div className="content">
        <p className="m-0 flex gap-2">
          <span className="shimmer-text shimmer-text-120x20"></span>
          <span className="shimmer-text shimmer-text-80x20"></span>
        </p>
        <h2 className="pb-4">
          <span className="shimmer-text shimmer-text-60p-40"></span>
        </h2>
      </div>

      <div className="banner_img d-none d-lg-block">
        <div className="row px-3">
          <div className="col-lg-6 p-1">
            <div className="image_head shimmer-container shimmer-min-250">
              <div className="shimmer"></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="col-lg-6 p-1" key={i}>
                  <div className="image_head shimmer-container shimmer-min-120">
                    <div className="shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hotel_detail_slider d-block d-lg-none">
        <div className="slider">
          <div className="shimmer-container shimmer-mobile-card">
            <div className="shimmer"></div>
          </div>
          <div className="shimmer-container shimmer-mobile-card">
            <div className="shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
  /************************************************************************** */
  const { data, isLoading } = useQuery({
    queryKey: ["gethoteldetail", code],
    queryFn: () => GetHotel_Detail(code),
    enabled: Boolean(code),
    retry: 1,
  });
  const HotelDetail = data?.data;
  const longitude = HotelDetail?.location?.longitude;
  const latitude = HotelDetail?.location?.latitude;
  const itemrating = HotelDetail?.rating;
  const ratingCount = HotelDetail?.userRatingCount;
  const userReviews = HotelDetail?.reviews;
  console.log(HotelDetail, "hotttttttttttttttttttttttttttttt");

  // ****************************************** to fetch the detail of hotel api >>>>>>>>>>>>>>>>>>>>>>>>
  const locationName = (
    HotelDetail?.displayName?.text ??
    HotelDetail?.displayName ??
    ""
  )
    .toString()
    .trim();
  const locationAddress = (
    HotelDetail?.formattedAddress?.text ??
    HotelDetail?.formattedAddress ??
    ""
  )
    .toString()
    .trim();
  const isHotelLodging = Array.isArray(HotelDetail?.types)
    ? HotelDetail.types.includes("lodging")
    : false;

  // Save to recently viewed when hotel loads (lodging only)
  useEffect(() => {
    if (!HotelDetail || !code || !isHotelLodging) return;
    const name = (
      HotelDetail?.displayName?.text ??
      HotelDetail?.displayName ??
      HotelDetail?.name ??
      ""
    )
      .toString()
      .trim();
    if (!name) return;
    const slug = createHotelSlug(name, code);
    saveRecentlyViewedProperty({
      id: code,
      name,
      slug,
      address:
        (
          HotelDetail?.formattedAddress?.text ??
          HotelDetail?.formattedAddress ??
          ""
        )
          .toString()
          .trim() || undefined,
    });
  }, [HotelDetail, code, isHotelLodging]);

  // ****************************************** derive hotel amenities from Google Places amenityOptions
  const hotelAmenties = useMemo(() => {
    const rawOptions = HotelDetail?.amenityOptions;
    if (!Array.isArray(rawOptions) || rawOptions.length === 0) return [];

    const labels = rawOptions
      .map((opt) => {
        if (!opt) return null;

        // Prefer any human-readable text Google provides
        const rawName =
          opt.displayName?.text ||
          opt.localizedText ||
          opt.amenityType ||
          opt.type ||
          opt.category ||
          null;

        if (!rawName) return null;

        const label = rawName
          .toString()
          .replace(/_/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return label || null;
      })
      .filter(Boolean);

    // Deduplicate while preserving order
    return Array.from(new Set(labels));
  }, [HotelDetail]);

  const formatPassengerLabel = () => {
    const parts = [];
    if (passengerCount > 0)
      parts.push(`${passengerCount} Adult${passengerCount > 1 ? "s" : ""}`);
    if (childrenCount > 0)
      parts.push(`${childrenCount} Child${childrenCount > 1 ? "ren" : ""}`);
    if (childrenAge > 0)
      parts.push(`${childrenAge} Infant${childrenAge > 1 ? "s" : ""}`);
    return parts.length ? parts.join(", ") : "1 Adult";
  };
  // ********************************************************** SerpAPI hotel details (only for lodging / hotel detail page)
  const [adultOptions, setAdultoption] = useState({
    adult: 1,
    child: 0,
    childage: [],
  });
  const childrenAgesString = adultOptions.childage.map((age) => age).join(",");

  // ***************************************************** onclick submit
  const handlePassengerChange = (
    passengerCount,
    childrenCount,
    childrenAge,
  ) => {
    // if (passengerCount + childrenCount > 6) {
    //     alert("Maximum 6 passengers allowed (including children) due to OTA restrictions.");
    //     setChildrenCount(0);
    //     setPassengerCount(1)
    //     return
    // }
    // else if (childrenAge > 17) {
    //     alert("Children age must be 0-17.");
    //     return
    // }
    // else {
    //     setPassengerCount(passengerCount);
    //     setAdultoption({
    //         adult: passengerCount,
    //         child: childrenCount,
    //         childage: [childrenAge],
    //     })
    // }
  };
  // Add a child
  const handleAddChild = () => {
    setAdultoption((prev) => {
      if (prev.adult + prev.child >= 6) {
        alert("Maximum 6 passengers allowed (including children).");

        return prev;
      }
      return {
        ...prev,
        child: prev.child + 1,
        childage: [...prev.childage, 0], // add new child with default age 0
      };
    });
  };

  // Remove a child
  const handleRemoveChild = () => {
    setAdultoption((prev) => {
      if (prev.child === 0) return prev;
      return {
        ...prev,
        child: prev.child - 1,
        childage: prev.childage.slice(0, -1), // remove last child age
      };
    });
  };

  // Update a child's age
  const handleChildAgeChange = (index, newAge) => {
    if (newAge < 0 || newAge > 17) return; // limit 0-17
    setAdultoption((prev) => {
      const newAges = [...prev.childage];
      newAges[index] = newAge;
      return { ...prev, childage: newAges };
    });
  };

  // Currency excluded from queryKey – details (address, amenities, reviews) must not refetch when currency changes.
  // Prices are fetched in USD and converted client-side via formatPrice.
  const { data: serpHotelData, isLoading: isSerpPriceLoading } = useQuery({
    queryKey: [
      "serpHotelDetail",
      locationName,
      searchCheckin,
      searchCheckout,
      passengerCount,
      "USD",
    ],
    queryFn: () =>
      GetSerpHotelDetail(
        locationName,
        searchCheckin,
        searchCheckout,
        passengerCount,
        "USD",
      ),
    enabled:
      Boolean(locationName) &&
      isHotelLodging &&
      Boolean(searchCheckin) &&
      Boolean(searchCheckout),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const isSerpPriceBusy = isSerpPriceLoading;
  const apiResponse = serpHotelData?.data;
  const serpHotelDetail =
    apiResponse?.raw ?? apiResponse?.details ?? apiResponse?.property;
  const rawPrices =
    serpHotelDetail?.featured_prices || serpHotelDetail?.prices || [];

  console.log(serpHotelData, "RESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");

  // Gallery images: prefer Google Places photos, fallback to SerpAPI images
  const galleryImages = useMemo(() => {
    const googlePhotos = HotelDetail?.photos;
    if (Array.isArray(googlePhotos) && googlePhotos.length > 0) {
      return googlePhotos
        .map((p) => ({ type: "google", name: p?.name }))
        .filter((p) => p.name);
    }
    const serpImages = serpHotelDetail?.images || apiResponse?.details?.images;
    if (Array.isArray(serpImages) && serpImages.length > 0) {
      return serpImages
        .map((img) => {
          const url =
            typeof img === "string"
              ? img
              : img?.original_image ||
              img?.original ||
              img?.url ||
              img?.thumbnail;
          return url ? { type: "url", url } : null;
        })
        .filter(Boolean);
    }
    return [];
  }, [
    HotelDetail?.photos,
    serpHotelDetail?.images,
    apiResponse?.details?.images,
  ]);
  const hasPriceData = Array.isArray(rawPrices) && rawPrices.length > 0;
  const propertyNotFound = apiResponse?.found === false && !hasPriceData;

  // Only show OTAs with affiliate accounts: Booking.com, Expedia, Trip.com
  const AFFILIATE_PARTNERS = ["Booking", "Expedia", "Trip"];

  const normalizePartnerSource = (source) => {
    if (!source) return "";
    const value = source.toString().toLowerCase();
    // Exact matches only – avoid false positives (e.g. "Hotel Booking Zone", "Cleartrip.com", "MakeMyTrip.com")
    if (value.includes("booking.com")) return "Booking";
    if (value.includes("expedia")) return "Expedia";
    if (
      value.includes("trip.com") &&
      !value.includes("cleartrip") &&
      !value.includes("makemytrip")
    )
      return "Trip";
    return null;
  };

  // Merge featured_prices and prices – if an OTA is missing from featured_prices, pick it from prices
  const filteredPartnerPrices = useMemo(() => {
    const featured = Array.isArray(serpHotelDetail?.featured_prices)
      ? serpHotelDetail.featured_prices
      : [];
    const prices = Array.isArray(serpHotelDetail?.prices)
      ? serpHotelDetail.prices
      : [];
    const allItems = [...featured, ...prices]
      .map((item) => {
        const normalizedSource = normalizePartnerSource(item?.source);
        const hasDeal = Boolean(
          (Array.isArray(item?.discount_remarks) &&
            item.discount_remarks.length > 0) ||
          item?.original_rate_per_night?.lowest != null ||
          item?.original_total_rate?.lowest != null,
        );
        return {
          ...item,
          normalizedSource: normalizedSource || item?.source || "Other",
          hasDeal,
        };
      })
      .filter((item) => AFFILIATE_PARTNERS.includes(item.normalizedSource));

    // Deduplicate by OTA: prefer featured_prices, then first from prices
    const seen = new Set();
    const deduped = allItems.filter((item) => {
      const key = item.normalizedSource;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort: deals first (hasDeal), then by lowest price
    return deduped.sort((a, b) => {
      if (a.hasDeal && !b.hasDeal) return -1;
      if (!a.hasDeal && b.hasDeal) return 1;
      const getNum = (x) => {
        const t = x.total_rate?.lowest ?? x.rate_per_night?.lowest;
        return typeof t === "number"
          ? t
          : parseFloat(String(t || "").replace(/[^0-9.]/g, "")) || Infinity;
      };
      return getNum(a) - getNum(b);
    });
  }, [serpHotelDetail?.featured_prices, serpHotelDetail?.prices]);

  // Best price for top: prefer SerpAPI (matches deal section), fallback to PriceData; show provider from API
  const { displayBestPrice, displayBestProvider, bestDealIndex } =
    useMemo(() => {
      if (filteredPartnerPrices.length > 0) {
        const nights = nightsCount || 1;
        let best = null;
        let bestIdx = -1;
        let minTotal = Infinity;
        for (let i = 0; i < filteredPartnerPrices.length; i++) {
          const item = filteredPartnerPrices[i];
          let total = item.total_rate?.lowest;
          if (total == null) {
            const perNight = item.rate_per_night?.lowest;
            total = perNight != null ? perNight * nights : null;
          }
          const num =
            typeof total === "number"
              ? total
              : total
                ? parseFloat(String(total).replace(/[^0-9.]/g, ""))
                : null;
          if (num != null && num > 0 && num < minTotal) {
            minTotal = num;
            best = item;
            bestIdx = i;
          }
        }
        if (best) {
          const provider = best.source || best.normalizedSource || null;
          return {
            displayBestPrice: minTotal,
            displayBestProvider: provider || "Best price",
            bestDealIndex: bestIdx,
          };
        }
      }
      return {
        displayBestPrice: null,
        displayBestProvider: "Best price",
        bestDealIndex: -1,
      };
    }, [filteredPartnerPrices, nightsCount]);

  const aiModalQuery = [locationName, locationAddress]
    .filter(Boolean)
    .join(" ");
  const { data: aimodal } = useQuery({
    queryKey: ["aimodal", aiModalQuery],
    queryFn: () => GetAiModal("About " + aiModalQuery),
    enabled: Boolean(aiModalQuery),
    retry: 1,
  });

  const PARTNER_LOGOS = {
    Booking: getAssetPath("/logo/hoteldetail/Booking.com_logo.svg.png"),
    Expedia: getAssetPath("/logo/hoteldetail/expedia_logo.svg"),
    Trip: getAssetPath("/logo/hoteldetail/tripcom.webp"),
  };

  // Full address string reused for affiliate / search URLs
  const fullAddress =
    [locationName, locationAddress].filter(Boolean).join(", ").trim() ||
    locationName ||
    locationAddress ||
    "";

  const pathname = usePathname() || "/";

  const buildAffiliateLink = (affiliateBase, hotelUrl) => {
    if (!hotelUrl) return null;
    if (!affiliateBase) return hotelUrl;
    return buildAffiliateLinkWithSubId(affiliateBase, hotelUrl, {
      page: pathname,
      placement: "serp_deal",
    });
  };

  // SerpAPI prices are fetched in USD; parse and convert to selected currency for display
  const formatSerpPrice = (priceValue) => {
    if (priceValue == null) return null;
    if (typeof priceValue === "number") return formatPrice(priceValue);
    if (typeof priceValue === "string") {
      const num = parseFloat(priceValue.replace(/[^0-9.]/g, ""));
      return Number.isNaN(num) ? priceValue : formatPrice(num);
    }
    return priceValue;
  };

  const hotelsMatch = useMemo(() => {
    const serpName = (serpHotelDetail?.name || "").toLowerCase().trim();
    const ourName = (locationName || "").toLowerCase().trim();
    if (!serpName || !ourName) return false;
    const ourKey = ourName.split(/[,.]/)[0]?.trim() || ourName;
    const serpKey = serpName.split(/[,.]/)[0]?.trim() || serpName;
    return (
      serpName.includes(ourKey) ||
      ourName.includes(serpKey) ||
      serpKey.includes(ourKey) ||
      ourKey.includes(serpKey)
    );
  }, [serpHotelDetail?.name, locationName]);

  // Ensure direct link domain matches the displayed partner (e.g. Trip.com row must go to trip.com, not makemytrip)
  const directLinkMatchesSource = (url, source) => {
    if (!url || typeof url !== "string") return false;
    const lower = url.toLowerCase();
    if (source === "Booking") return lower.includes("booking.com");
    if (source === "Expedia") return lower.includes("expedia");
    if (source === "Trip")
      return (
        lower.includes("trip.com") &&
        !lower.includes("makemytrip") &&
        !lower.includes("cleartrip")
      );
    return false;
  };

  const buildPartnerHotelUrl = (
    item,
    normalizedSource,
    checkin,
    checkout,
    pasengercount,
    childrencount,
  ) => {
    const searchTerm = (locationName || fullAddress || "").trim();
    if (!searchTerm) return null;
    const directLink =
      item?.deep_link || item?.booking_url || item?.url || item?.link;
    const hasValidDirectLink =
      directLink &&
      typeof directLink === "string" &&
      (directLink.startsWith("http://") || directLink.startsWith("https://"));
    const linkMatchesPartner =
      hasValidDirectLink &&
      directLinkMatchesSource(directLink, normalizedSource);

    if (hotelsMatch && linkMatchesPartner) {
      return directLink;
    }

    const encodedHotel = encodeURIComponent(searchTerm);
    console.log("searchTerm", searchTerm);

    // Booking.com: "ss" supports free-text hotel name search – works correctly
    if (normalizedSource === "Booking") {
      // return `https://www.booking.com/searchresults.html?ss=${encodedHotel}&checkin=${checkin}&checkout=${checkout}&group_adults=${pasengercount}&group_children=${childrencount}&age=${childrenAgesString}`;

      let url = `https://www.booking.com/searchresults.en-us.html?ss=${encodedHotel}&checkin=${checkin}&checkout=${checkout}&group_adults=${pasengercount}&no_rooms=1&group_children=${childrencount}`;

      // 👇 Add ages like &age=4&age=4&age=4
      if (childrencount > 0 && childrenAgesString) {
        const agesArray = childrenAgesString.split(",");

        agesArray.forEach((age) => {
          url += `&age=${Math.max(1, age)}`;
        });
      }

      return url;
    }

    if (normalizedSource === "Expedia") {
      const isIndia = (locationAddress || locationName || "")
        .toLowerCase()
        .includes("india");
      const expediaHost = isIndia ? "www.expedia.co.in" : "www.expedia.com";
      // hotelName filters results to the specific property; destination provides city/region
      const hotelName =
        (locationName || searchTerm).split(",")[0]?.trim() || searchTerm;
      const encodedHotelName = encodeURIComponent(hotelName);
      return `https://${expediaHost}/Hotel-Search?destination=${encodedHotel}&hotelName=${encodedHotelName}&startDate=${checkin}&endDate=${checkout}&adults=${pasengercount}&children=${childrencount}&rooms=1`;
    }
    if (normalizedSource === "Trip") {
      // Trip.com: use same full search string as Booking.com (ss) for consistency
      const isIndia = (locationAddress || locationName || "")
        .toLowerCase()
        .includes("india");
      const tripLocale = isIndia ? "en-in" : "en-US";
      const tripCurr = isIndia ? "INR" : currency;
      return `https://www.trip.com/hotels/detail/?cityEnName=1&destName=${encodedHotel}&searchWord=${encodedHotel}&searchType=H&checkin=${checkin}&checkout=${checkout}&crn=1&adult=${pasengercount}&curr=${encodeURIComponent(tripCurr)}&locale=${tripLocale}&old=1`;
    }

    // Fallback: general Google search (for unknown sources)
    return `https://www.google.com/search?q=hotel+${encodedHotel}+${encodeURIComponent(item?.source || "")}`;
  };

  // Fallback OTAs with affiliate IDs – shown when API returns no prices (same as flights)
  const fallbackOTAs = useMemo(() => {
    if (!searchCheckin || !searchCheckout || !locationName) return [];
    const partners = [
      { name: "Booking.com", normalizedSource: "Booking" },
      { name: "Expedia", normalizedSource: "Expedia" },
      { name: "Trip.com", normalizedSource: "Trip" },
    ];
    return partners
      .map((ota) => {
        const hotelUrl = buildPartnerHotelUrl(
          {},
          ota.normalizedSource,
          searchCheckin,
          searchCheckout,
          passengerCount,
          childrenCount,
        );
        const affiliateBase = AFFILIATE_BASES[ota.normalizedSource];
        const finalLink = hotelUrl
          ? buildAffiliateLink(affiliateBase, hotelUrl)
          : null;
        return {
          ...ota,
          url: finalLink,
          logo: PARTNER_LOGOS[ota.normalizedSource],
        };
      })
      .filter((ota) => ota.url);
  }, [
    searchCheckin,
    searchCheckout,
    locationName,
    fullAddress,
    locationAddress,
    currency,
    pathname,
  ]);

  // Inspect full SerpAPI response in the browser devtools console
  useEffect(() => {
    if (serpHotelDetail) {
      // eslint-disable-next-line no-console
      console.log("SerpAPI hotel detail (serpHotelDetail):", serpHotelDetail);
    }
  }, [serpHotelDetail]);

  // ****************************************** Derive human-friendly description (prefer SerpAPI, fallback to Google Places)
  const hotelDescription = useMemo(() => {
    const serpDetails = serpHotelDetail?.description;
    return (
      serpDetails ||
      (locationAddress ? `About ${locationName} – ${locationAddress}` : "") ||
      ""
    );
  }, [serpHotelDetail?.description, locationAddress, locationName]);

  // ****************************************** Merge amenities from Google Places & SerpAPI
  const serpAmenities = useMemo(() => {
    const raw = serpHotelDetail?.amenities || [];
    if (!Array.isArray(raw)) return [];

    const labels = raw
      .map((item) => {
        if (!item) return null;
        const name =
          (typeof item === "string"
            ? item
            : item.name || item.title || item.type) || null;
        if (!name) return null;
        const label = name
          .toString()
          .replace(/_/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return label || null;
      })
      .filter(Boolean);

    return Array.from(new Set(labels));
  }, [serpHotelDetail]);

  const combinedAmenities = useMemo(() => {
    const base = Array.isArray(hotelAmenties) ? hotelAmenties : [];
    const extra = Array.isArray(serpAmenities) ? serpAmenities : [];
    return Array.from(new Set([...base, ...extra]));
  }, [hotelAmenties, serpAmenities]);

  const handleSearchDates = async (checkin, checkout) => {
    setSearchCheckin(checkin);
    setSearchCheckout(checkout);
  };

  const getRoomIcon = (roomName, fallbackIndex) => {
    const name = (roomName || "").toLowerCase();
    if (
      name.includes("king") ||
      name.includes("queen") ||
      name.includes("double")
    )
      return LuBedDouble;
    if (name.includes("single") || name.includes("twin")) return LuBedSingle;
    if (
      name.includes("suite") ||
      name.includes("deluxe") ||
      name.includes("premium")
    )
      return LuHotel;
    if (name.includes("villa") || name.includes("apartment")) return LuHouse;
    if (
      name.includes("ocean") ||
      name.includes("sea") ||
      name.includes("beach") ||
      name.includes("coastal")
    )
      return LuWaves;
    if (name.includes("pool") || name.includes("swim")) return LuWaves;
    if (
      name.includes("garden") ||
      name.includes("resort") ||
      name.includes("holiday")
    )
      return LuTreePalm;
    const icons = [LuBedDouble, LuBedSingle, LuBed, LuHotel, LuHouse, LuWaves];
    return icons[fallbackIndex % icons.length];
  };

  const togglePartnerExpand = (partnerIndex) => {
    setExpandedPartners((prev) => {
      const next = new Set(prev);
      if (next.has(partnerIndex)) next.delete(partnerIndex);
      else next.add(partnerIndex);
      return next;
    });
  };

  // ********************************** auto scroll
  const priceSectionRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const slowScrollTo = (targetY, duration = 1200) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };
  // *************************************
  const handleScrollToPrice = () => {
    if (!priceSectionRef.current) return;
    setTimeout(() => {
      priceSectionRef.current?.classList.add("pulse");
    }, 1500);

    const headerOffset = 80; // sticky header height
    const elementPosition =
      priceSectionRef.current.getBoundingClientRect().top + window.pageYOffset;

    slowScrollTo(elementPosition - headerOffset, 1500); // 👈 slower = bigger number
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  // ****************************** share facebookil twitter linkedin
  const handleFacebookShare = () => {
    const currentUrl = window.location.href;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl,
    )}`;

    window.open(facebookShareUrl, "_blank", "width=600,height=500");
  };
  // ********************************

  // ********************** responsive month show
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMonthsShown(isMobile ? 1 : 2);
      setIsMobileView(isMobile);
    };

    handleResize(); // first load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const multiPassengerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        multiPassengerRef.current &&
        !multiPassengerRef.current.contains(e.target)
      ) {
        setShowPassengerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log(hoverDate, "hover,,,,,,,,,,,,,,,,,,,");

  return (
    <>
      <Header />

      <style
        dangerouslySetInnerHTML={{
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
          border-radius: 12px;
          background-color: #e5e7eb;
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
        .shimmer-text {
          display: inline-block;
          border-radius: 4px;
          background-color: #e5e7eb;
          position: relative;
          overflow: hidden;
        }
      `,
        }}
      />
      <section className="hoteldetail ">
        <div className="container">
          <SearchTab />

          <div className="row">
            <div className="col-lg-12">
              <div className="hoteldetail_banner">
                {/* ********************** header content  */}
                <div className="content padding_top  ">
                  <div className="content_p">
                    {/* ****************** mobile show modall */}
                    <div className="mobile_title d-block d-lg-none ">
                      <div className="mobile_top_bar flex justify-between items-center">
                        <div className="back" onClick={() => navigate.back()}>
                          <MdOutlineKeyboardArrowLeft />
                        </div>
                        <div className="mobile_share_icon">
                          <div className="icon flex gap-2 items-center share-detail ">
                            <Link href={""} onClick={handleFacebookShare}>
                              <span>
                                <FaShareAlt />
                              </span>
                              {/* <span className="share" >
                                                                Share
                                                            </span> */}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ******************** end mobile view */}
                    <div className="title flex items-center justify-between">
                      <h2 className="m-0 hotel_botom_margin ">
                        {HotelDetail?.displayName?.text}
                      </h2>
                      <div className="icon flex gap-2 items-center d-none pe-2 d-lg-block justify-center share-detail">
                        <Link href={""} onClick={handleFacebookShare}>
                          <span>
                            <FaShareAlt />
                          </span>
                          {/* <span className="share">Share</span> */}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="hotel_contact_info flex items-center justify-between">
                    <div className="hotel_contact_link hotel_botom_margin ">
                      <p className="m-0">
                        <span className="rating-stars">
                          {(() => {
                            // Assume first review object for star rendering, fallback to 0
                            const rating = itemrating || 0;
                            const fullStars = Math.floor(rating);
                            const hasHalfStar =
                              rating - fullStars >= 0.5 &&
                              rating - fullStars < 1;
                            return Array.from({ length: 5 }).map((_, idx) => (
                              <span key={idx}>
                                {idx < fullStars ? (
                                  <i className="bi bi-star-fill g_color"></i>
                                ) : idx === fullStars && hasHalfStar ? (
                                  <i className="bi bi-star-half g_color"></i>
                                ) : (
                                  <i className="bi bi-star g_color"></i>
                                )}
                              </span>
                            ));
                          })()}
                        </span>
                        <span>  {HotelDetail?.rating} ({ratingCount} reviews )</span>
                      </p>
                      <ul className="flex p-0 m-0 hotel_botom_margin">
                        {/* <li>
                                                    <span><img src={getAssetPath("/hoteldetail/global.svg")} width={20} alt="" /></span>
                                                    <span><Link href={""}>visit hotel website</Link></span>
                                                </li> */}
                        {/* ******* */}
                        <li>
                          <span>
                            <img
                              src={getAssetPath(
                                "/hoteldetail/location-minus.svg",
                              )}
                              width={20}
                              alt=""
                            />
                          </span>
                          <span>
                            <Link href={""} onClick={handleScrollToLocation}>
                              view location
                            </Link>
                          </span>
                        </li>
                        {/* ************ */}
                      </ul>

                      {/* ********************* */}
                    </div>

                    {/* ***************** price section – hotels only, hidden for iconic places & nearby restaurants */}
                    {isHotelLodging && (
                      <div className="price_hotel flex  gap-3">
                        <div className="price">
                          {isSerpPriceBusy &&
                            !displayBestPrice &&
                            searchCheckout ? (
                            <>
                              <div
                                className="shimmer-container shimmer-90x28 mb-2"
                                style={{ width: 80 }}
                              >
                                <div className="shimmer" />
                              </div>
                              <div className="shimmer-container shimmer-80x16">
                                <div className="shimmer" />
                              </div>
                            </>
                          ) : (
                            <>
                              <h4 className="m-0">
                                {displayBestPrice != null
                                  ? formatPrice(displayBestPrice)
                                  : "—"}
                              </h4>
                              <p className="m-0">{displayBestProvider}</p>
                            </>
                          )}
                        </div>
                        <div className="price_view_detail">
                          <button
                            className="hotel_detail_button text-white"
                            onClick={handleScrollToPrice}
                          >
                            View Deals
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* **************** end ************ */}

                {/* Image Gallery */}

                {/* ******************* desktop view wwwwwwwwwwwwwwwwwwwwww */}
                <div className="banner_img d-none d-lg-block ">
                  <div className="container">
                    {isLoading ? (
                      <div className="row">
                        <div className="col-lg-6 p-1">
                          <div className="image_head shimmer-container shimmer-min-410">
                            <div className="shimmer" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="row">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div className="col-lg-6 p-1" key={i}>
                                <div className="image_head shimmer-container shimmer-min-200">
                                  <div className="shimmer" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : galleryImages.length > 0 ? (
                      <div className="row ">
                        <div className="col-lg-8 p-1">
                          <div className="image_head side_image_head">
                            <img
                              className="cursor-pointer"
                              src={
                                galleryImages[0]?.type === "google"
                                  ? `/api/get-photo?name=${encodeURIComponent(galleryImages[0].name)}&maxWidthPx=2400`
                                  : galleryImages[0]?.url
                              }
                              alt={locationName || "Hotel"}
                              onClick={() => {
                                setGalleryInitialIndex(0);
                                setGalleryOpen(true);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="row">
                            {galleryImages.slice(1, 4).map((item, index) => (
                              <div className="col-lg-12 p-1" key={index}>
                                <div className="image_head">
                                  <img
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setGalleryInitialIndex(index + 1);
                                      setGalleryOpen(true);
                                    }}
                                    src={
                                      item?.type === "google"
                                        ? `/api/get-photo?name=${encodeURIComponent(item.name)}&maxWidthPx=300`
                                        : item?.url
                                    }
                                    alt={`${locationName || "Hotel"} - ${index + 2}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-12 p-1">
                          <div
                            className="image_head side_image_head d-flex align-items-center justify-content-center bg-light"
                            style={{ minHeight: 200 }}
                          >
                            <span className="text-muted">
                              No images available
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery modal */}
                <GalleryModal
                  isOpen={galleryOpen}
                  onClose={() => setGalleryOpen(false)}
                  images={galleryImages}
                  hotelName={HotelDetail?.displayName?.text || locationName}
                  initialIndex={galleryInitialIndex}
                  onViewDeals={isHotelLodging ? handleScrollToPrice : undefined}
                />

                {/* ********************** mobile viewwwwwwwwwwwwwwwwwwwww  */}
                <div className="hotel_detail_slider d-block d-lg-none">
                  {isLoading ? (
                    <div className="slider">
                      {Array.from({ length: 1 }).map((_, i) => (
                        <div
                          key={i}
                          className="shimmer-container shimmer-slide-220"
                        >
                          <div className="shimmer" />
                        </div>
                      ))}
                    </div>
                  ) : galleryImages.length > 0 ? (
                    <Swiper
                      spaceBetween={30}
                      effect="fade"
                      navigation
                      modules={[Navigation, Pagination, EffectFade]}
                      className="mySwiper"
                    >
                      {galleryImages.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="banner_img mobile_banner cursor-pointer"
                            onClick={() => {
                              setGalleryInitialIndex(index);
                              setGalleryOpen(true);
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <img
                              src={
                                item?.type === "google"
                                  ? `/api/get-photo?name=${encodeURIComponent(item.name)}&maxWidthPx=1200`
                                  : item?.url
                              }
                              width="100%"
                              className="card_rounded"
                              alt={`${locationName || "Hotel"} - ${index + 1}`}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div
                      className="slider d-flex align-items-center justify-content-center bg-light"
                      style={{ minHeight: 200 }}
                    >
                      <span className="text-muted">No images available</span>
                    </div>
                  )}
                </div>

                {/* ******************** end ******* */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ************** Main detail content below gallery: description, amenities & pricing ************** */}
      {isHotelLodging ? (
        <>
          <section className="detail_page_padding">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="content_box_detail"
                    id="price_section"
                    ref={priceSectionRef}
                  >
                    <h3 className="serp_sub_title">
                      View prices for your travel dates
                    </h3>
                    <p className="serp_google_reviews_text">
                      Prices shown are based on available data and may not
                      always be accurate. Final prices are confirmed at the time
                      of booking.
                    </p>

                    {filteredPartnerPrices.some((p) => p.hasDeal) && (
                      <div className="ta_deals_summary">
                        <span className="ta_deals_summary_icon">🏷️</span>
                        <span>
                          Deals available for your dates — compare prices below
                        </span>
                      </div>
                    )}

                    {/* Premium date picker – separate inputs + beautiful calendar */}
                    <div
                      className="ta_dates_section mb-4"
                      ref={datePickerWrapperRef}
                    >
                      <div className="calender_input">
                        <div
                          className={`ta_dates_card ${calendarOpen ? "ta_dates_card_open" : ""}`}
                          onClick={() => {
                            setCalendarOpen(!calendarOpen);
                            setShowPassengerDropdown(false);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setCalendarOpen(!calendarOpen)
                          }
                        >
                          <div className="ta_dates_row">
                            {/* *********************************** */}
                            <div
                              className="ta_date_field ta_date_checkin"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalendarOpen(true);
                                selectionPhaseRef.current = "start"; // 👈 start select

                                if (startDate) {
                                  setOpenToDate(startDate);
                                  setCalendarKey((prev) => prev + 1);
                                }
                              }}
                            >
                              <span className="ta_date_label">Check-in</span>
                              <span className="ta_date_value">
                                {dateRange?.from
                                  ? format(
                                    dateRange.from,
                                    isMobileView ? "MMM d" : "EEE, MMM d",
                                  )
                                  : "Select"}
                              </span>
                            </div>
                            {/* *********************************** */}
                            <div className="ta_dates_divider">
                              <span className="ta_nights_badge">
                                {nightsCount
                                  ? `${nightsCount} night${nightsCount > 1 ? "s" : ""}`
                                  : "—"}
                              </span>
                            </div>
                            {/* *********************************** */}
                            <div
                              className="ta_date_field ta_date_checkout"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalendarOpen(true);
                                selectionPhaseRef.current = "end"; // 👈 important

                                if (endDate) {
                                  setOpenToDate(endDate);
                                } else if (startDate) {
                                  const nextDay = new Date(startDate);
                                  nextDay.setDate(nextDay.getDate() + 1);
                                  setOpenToDate(nextDay);
                                }

                                setCalendarKey((prev) => prev + 1);
                              }}
                            >
                              <span className="ta_date_label">Check-out</span>
                              <span className="ta_date_value">
                                {dateRange?.to
                                  ? format(
                                    dateRange.to,
                                    isMobileView ? "MMM d" : "EEE, MMM d",
                                  )
                                  : "Select"}
                              </span>
                            </div>
                            {/* *********************************** */}
                            <div className="ta_calendar_icon">
                              <SlCalender className="ta_calendar_svg" />
                            </div>

                            {/* ************************************************** */}
                          </div>
                        </div>









                        {calendarOpen && (
                          <div className="ta_premium_calendar_wrapper" onMouseLeave={() => setHoverDate(null)}>
                            <DatePicker
                              key={calendarKey}
                              selected={startDate}
                              onChange={handleRangeChange}
                              startDate={startDate}
                              endDate={endDate}
                              selectsRange
                              minDate={minSelectableDate}
                              monthsShown={monthsShown}
                              inline
                              openToDate={openToDate}
                              calendarClassName="ta_premium_calendar "
                              focusSelectedMonth
                              onDayMouseEnter={(date) => {
                                if (startDate && selectionPhaseRef.current === "end") setHoverDate(date);
                              }}
                              onMouseLeave={() => setHoverDate(null)}
                              dayClassName={dayClassName}
                              onDayMouseLeave={() => setHoverDate(null)}
                              renderCustomHeader={({
                                monthDate,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                              }) => (
                                <div className="ta_calendar_header">
                                  <button
                                    type="button"
                                    className="ta_calendar_nav ta_calendar_nav_prev"
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                    aria-label="Previous month"
                                  >
                                    ‹
                                  </button>
                                  <span className="ta_calendar_month_title">
                                    {format(monthDate, "MMMM yyyy")}
                                  </span>
                                  <button
                                    type="button"
                                    className="ta_calendar_nav ta_calendar_nav_next"
                                    onClick={increaseMonth}
                                    disabled={nextMonthButtonDisabled}
                                    aria-label="Next month"
                                  >
                                    ›
                                  </button>
                                </div>
                              )}
                            />
                          </div>
                        )}
                      </div>
                      {/* ********************************************* Adults section addedd ***************************/}
                      <div
                        className="header_input hotel_setail_input relative"
                        ref={multiPassengerRef}
                      >
                        {/* Input Trigger */}

                        <div className="icon icon absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search">
                          <FaUser />
                        </div>
                        <input
                          type="text"
                          readOnly
                          onClick={() =>
                            setShowPassengerDropdown((prev) => !prev)
                          }
                          value={formatPassengerLabel()}
                          className="block w-full cursor-pointer h-full bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        />

                        {/* Arrow Icon */}
                        <FiChevronDown
                          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 ${showPassengerDropdown ? "rotate-180" : "rotate-0"
                            }`}
                          size={18}
                        />

                        {/*........................................ Dropdown ........................................ */}
                        <div
                          className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 
                                                    rounded-xl shadow-2xl transition-all duration-300 ease-out origin-top z-50 pt-3
                                                    ${showPassengerDropdown
                              ? "opacity-100 scale-100 translate-y-0"
                              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}
                        >
                          <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                            <span className="text-sm text-gray-600 text-height">
                              Adults <br></br>{" "}
                              <span className="ft-sm"> (17+ yrs)</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setPassengerCount((c) => {
                                    const next = Math.max(1, c - 1);
                                    if (passengerCount > next)
                                      setPassengerCount(next);
                                    return next;
                                  })
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                              >
                                –
                              </button>
                              <span className="min-w-[20px] text-center font-medium">
                                {passengerCount}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setPassengerCount((c) => Math.min(9, c + 1))
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          {/* ************************** */}
                          <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                            <span className="text-sm text-gray-600 text-height">
                              Children <br />{" "}
                              <span className="ft-sm ">(1-17 yrs)</span>
                            </span>
                            <div className="flex  items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  (setChildrenCount((c) => Math.max(0, c - 1)),
                                    handleRemoveChild());
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                              >
                                –
                              </button>
                              <span className="min-w-[20px] text-center font-medium">
                                {childrenCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  (setChildrenCount((c) => Math.min(9, c + 1)),
                                    handleAddChild());
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          {/* ******************** childereednnnnn */}
                          <div className="px-3 py-2 flex flex-col gap-2 items-center justify-between border-b border-gray-100">
                            {adultOptions.childage.map((age, index) => (
                              <div
                                key={index}
                                className="flex  items-center justify-between gap-3"
                                style={{ width: "100%" }}
                              >
                                <span className="text-sm text-gray-600 text-height">
                                  Children Age <br />{" "}
                                  <span className="ft-sm ">(1–17 yrs)</span>
                                </span>
                                <div className="children flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChildAgeChange(index, age - 1)
                                    }
                                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                                  >
                                    –
                                  </button>
                                  <span className="min-w-[20px] text-center">
                                    {age}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChildAgeChange(index, age + 1)
                                    }
                                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* ******************************* */}
                          {/* <p className="px-3 pb-2 text-xs text-gray-500">Max 1 infant per adult</p> */}
                          <div className="px-3 pb-4">
                            <button
                              type="button"
                              onClick={() => {
                                handlePassengerChange(
                                  passengerCount,
                                  childrenCount,
                                  childrenAge,
                                );
                                setShowPassengerDropdown(false);
                                // dispatch(SetPassengers({ adults: passengerCount, children: childrenCount, infants: infantCount }));
                              }}
                              className="w-full bg-brand text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition button_bg2"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* **********************************************  adulst section ended ******************** */}
                    </div>

                    <div className="ta_price_comparison">
                      {!searchCheckout ? (
                        <div className="ta_price_empty">
                          <img
                            src={getAssetPath("/price_img/price-icon1.png")}
                            alt=""
                            className="ta_price_empty_img"
                          />
                          <h5 className="ta_price_empty_title">
                            Select check-out date to view prices
                          </h5>
                          <p className="ta_price_empty_text">
                            Choose your check-out date in the calendar above to
                            see available prices from our partners.
                          </p>
                        </div>
                      ) : isSerpPriceBusy ? (
                        <div className="ta_price_shimmer">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="ta_price_row ta_price_shimmer_row"
                            >
                              <div className="ta_price_partner">
                                <div className="ta_price_logo shimmer-container shimmer-min-100">
                                  <div className="shimmer" />
                                </div>
                                <div className="ta_price_partner_info">
                                  <div
                                    className="shimmer-container shimmer-80x16"
                                    style={{ marginBottom: 6 }}
                                  >
                                    <div className="shimmer" />
                                  </div>
                                  <div className="shimmer-container shimmer-120x14">
                                    <div className="shimmer" />
                                  </div>
                                </div>
                              </div>
                              <div className="ta_price_mid">
                                <div className="shimmer-container shimmer-60x20">
                                  <div className="shimmer" />
                                </div>
                              </div>
                              <div className="ta_price_cta">
                                <div className="shimmer-container shimmer-90x36">
                                  <div className="shimmer" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : propertyNotFound ? (
                        <div className="ta_price_empty">
                          <img
                            src={getAssetPath("/price_img/price-icon2.png")}
                            alt=""
                            className="ta_price_empty_img"
                          />
                          <h5 className="ta_price_empty_title">
                            This property has no prices
                          </h5>
                          <p className="ta_price_empty_text">
                            We couldn&apos;t find any pricing for this property.
                            Try searching for a different hotel.
                          </p>
                        </div>
                      ) : filteredPartnerPrices.length === 0 &&
                        fallbackOTAs.length === 0 ? (
                        <div className="ta_price_empty justify-content-center align-items-center">
                          <h5 className="ta_price_empty_title">
                            No prices for these dates
                          </h5>
                          <p className="ta_price_empty_text">
                            We couldn&apos;t find any prices for your selected
                            dates. Try changing your check-in or check-out
                            dates.
                          </p>
                        </div>
                      ) : filteredPartnerPrices.length === 0 ? (
                        /* OTA fallback – always with affiliate IDs (same as flights) */
                        <>
                          <div className="ta_price_empty ta_price_ota_note mb-3">
                            <p className="ta_price_empty_text ps-4">
                              Prices not available from our data. Compare and
                              book with our partners below.
                            </p>
                          </div>
                          {fallbackOTAs.map((ota, idx) => (
                            <div
                              key={`fallback-${idx}`}
                              className="ta_price_row"
                            >
                              <div className="ta_price_partner">
                                <div className="ta_price_logo">
                                  <img src={ota.logo} alt={ota.name} />
                                </div>
                              </div>
                              <div className="ta_price_mid">
                                <span className="ta_price_check">
                                  Check price
                                </span>
                              </div>
                              <div className="ta_price_cta">
                                <a
                                  href={ota.url}
                                  target="_blank"
                                  rel="noopener noreferrer sponsored"
                                  className="ta_view_deal_btn"
                                >
                                  View Deals
                                </a>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {filteredPartnerPrices.flatMap(
                            (item, partnerIndex) => {
                              const hotelUrl = buildPartnerHotelUrl(
                                item,
                                item.normalizedSource,
                                searchCheckin,
                                searchCheckout,
                                passengerCount,
                                childrenCount,
                              );
                              const affiliateBase =
                                AFFILIATE_BASES[item.normalizedSource];
                              const finalLink = buildAffiliateLink(
                                affiliateBase,
                                hotelUrl,
                              );
                              const remarks = item.remarks || [];
                              const discountRemarks =
                                item.discount_remarks || [];
                              const isOfficial = item.official === true;
                              const nights = nightsCount || 1;
                              const rooms =
                                item.rooms && item.rooms.length > 0
                                  ? item.rooms
                                  : [
                                    {
                                      name: null,
                                      rate_per_night: item.rate_per_night,
                                      total_rate: item.total_rate,
                                    },
                                  ];
                              const hasMultipleRooms = rooms.length > 1;
                              const isExpanded =
                                expandedPartners.has(partnerIndex);
                              const hiddenCount = rooms.length;

                              const mainPricePerNight =
                                item.rate_per_night?.lowest;
                              const mainPriceTotal = item.total_rate?.lowest;
                              const mainBeforeTaxes =
                                item.rate_per_night?.before_taxes_fees;

                              return [
                                /* First row: partner + normal/aggregate price */
                                <div
                                  key={`${partnerIndex}-main`}
                                  className={`ta_price_row ${item.hasDeal ? "ta_price_row_deal" : ""} ${partnerIndex === bestDealIndex && item.hasDeal ? "ta_price_row_best_deal" : ""}`}
                                >
                                  <div className="ta_price_partner">
                                    <div className="ta_price_logo mhotle-0">
                                      <img
                                        src={
                                          PARTNER_LOGOS[
                                          item.normalizedSource
                                          ] || item.logo
                                        }
                                        alt={item.source}
                                      />
                                      {/* ************************* display show on mobile */}
                                      {(remarks.length > 0 ||
                                        discountRemarks.length > 0) && (
                                          <div className="d-block d-lg-none">
                                            <div className="ta_price_remarks ">
                                              {discountRemarks.map((r, i) => (
                                                <span
                                                  key={`disc-${i}`}
                                                  className="ta_remark ta_discount"
                                                >
                                                  {r}
                                                </span>
                                              ))}
                                              {remarks.map((r, i) => (
                                                <span
                                                  key={`rem-${i}`}
                                                  className="ta_remark"
                                                >
                                                  {r}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                    <div className="ta_price_partner_info">
                                      <div className="ta_price_badges">
                                        {partnerIndex === bestDealIndex &&
                                          item.hasDeal && (
                                            <span className="ta_deal_badge ta_deal_badge_best">
                                              Best deal
                                            </span>
                                          )}
                                        {item.hasDeal &&
                                          partnerIndex !== bestDealIndex && (
                                            <span className="ta_deal_badge">
                                              Deal
                                            </span>
                                          )}
                                      </div>
                                      {/* ************************ display on window  */}
                                      {(remarks.length > 0 ||
                                        discountRemarks.length > 0) && (
                                          <div className="d-none d-lg-block">
                                            <div className="ta_price_remarks ">
                                              {discountRemarks.map((r, i) => (
                                                <span
                                                  key={`disc-${i}`}
                                                  className="ta_remark ta_discount"
                                                >
                                                  {r}
                                                </span>
                                              ))}
                                              {remarks.map((r, i) => (
                                                <span
                                                  key={`rem-${i}`}
                                                  className="ta_remark"
                                                >
                                                  {r}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <div className="ta_price_mid">
                                    {mainPricePerNight || mainPriceTotal ? (
                                      <div className="ta_price_details">
                                        {item.original_rate_per_night?.lowest !=
                                          null &&
                                          mainPricePerNight && (
                                            <span className="ta_price_original">
                                              {formatSerpPrice(
                                                item.original_rate_per_night
                                                  .lowest,
                                              )}
                                              /night
                                            </span>
                                          )}
                                        {mainPricePerNight && (
                                          <span className="ta_price_primary">
                                            <span className="ta_price_amount">
                                              {formatSerpPrice(
                                                mainPricePerNight,
                                              )}
                                            </span>
                                            <span className="ta_price_unit">
                                              /night
                                            </span>
                                          </span>
                                        )}
                                        {mainPriceTotal && nights > 1 && (
                                          <span className="ta_price_total">
                                            {item.original_total_rate?.lowest !=
                                              null && (
                                                <span className="ta_price_original_inline">
                                                  {formatSerpPrice(
                                                    item.original_total_rate
                                                      .lowest,
                                                  )}{" "}
                                                </span>
                                              )}
                                            {formatSerpPrice(mainPriceTotal)}{" "}
                                            total
                                          </span>
                                        )}
                                        {mainBeforeTaxes &&
                                          mainBeforeTaxes !==
                                          mainPricePerNight && (
                                            <span className="ta_price_before_taxes">
                                              Before taxes & fees:{" "}
                                              {formatSerpPrice(mainBeforeTaxes)}
                                              /night
                                            </span>
                                          )}
                                      </div>
                                    ) : (
                                      <span className="ta_price_na">—</span>
                                    )}
                                  </div>
                                  <div className="ta_price_cta">
                                    {finalLink ? (
                                      <a
                                        href={finalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ta_view_deal_btn"
                                      >
                                        View Deals
                                      </a>
                                    ) : (
                                      <button
                                        type="button"
                                        className="ta_view_deal_btn"
                                        disabled
                                      >
                                        View Deals
                                      </button>
                                    )}

                                    {/* ****************** show on mobile  */}

                                    {hasMultipleRooms && (
                                      <>
                                        <div className="d-block d-lg-none">
                                          <div
                                            key={`${partnerIndex}-rooms`}
                                            className={`ta_rooms_collapsible ${isExpanded ? "ta_rooms_expanded" : ""}`}
                                          ></div>

                                          <div
                                            key={`${partnerIndex}-toggle`}
                                            className={`${isExpanded ? "ta_toggle_expanded" : ""}`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                              togglePartnerExpand(partnerIndex)
                                            }
                                            onKeyDown={(e) =>
                                              e.key === "Enter" &&
                                              togglePartnerExpand(partnerIndex)
                                            }
                                          >
                                            <div className="ta_price_partner">
                                              {/* <div className="ta_price_logo">
                                                                    <span className="ta_logo_placeholder" aria-hidden="true" />
                                                                </div> */}
                                              <div className="ta_price_partner_info">
                                                <button
                                                  type="button"
                                                  className="ta_toggle_btn"
                                                >
                                                  {isExpanded ? (
                                                    <>
                                                      <MdExpandLess className="ta_toggle_icon" />
                                                      Show less
                                                    </>
                                                  ) : (
                                                    <>
                                                      <MdExpandMore className="ta_toggle_icon" />
                                                      Show {hiddenCount} room
                                                      type
                                                      {hiddenCount > 1
                                                        ? "s"
                                                        : ""}
                                                    </>
                                                  )}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>,
                                /* Room type rows - collapsible with animation  show on desktop */

                                hasMultipleRooms && (
                                  <div
                                    key={`${partnerIndex}-desktop-rooms`}
                                    className=""
                                  >
                                    <div
                                      className={`ta_rooms_collapsible ${isExpanded ? "ta_rooms_expanded" : ""}`}
                                    >
                                      <div className="ta_rooms_inner">
                                        {rooms.map((room, roomIndex) => {
                                          const roomPricePerNight =
                                            room.rate_per_night?.lowest;
                                          const roomPriceTotal =
                                            room.total_rate?.lowest;
                                          const beforeTaxes =
                                            room.rate_per_night
                                              ?.before_taxes_fees;
                                          const RoomIcon = getRoomIcon(
                                            room.name,
                                            roomIndex,
                                          );

                                          return (
                                            <div
                                              key={`${partnerIndex}-${roomIndex}`}
                                              className="ta_price_row ta_price_row_sub"
                                            >
                                              <div className="ta_price_partner ">
                                                <div className="ta_price_logo ta_room_icon_wrapper md-no-flex">
                                                  <RoomIcon
                                                    className="ta_room_icon"
                                                    aria-hidden="true"
                                                  />
                                                  {/* ************* show on mobile */}
                                                  <div className="d-block d-lg-none">
                                                    <div className="ta_price_partner_info ">
                                                      {room.name && (
                                                        <span className="ta_room_name">
                                                          {room.name}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="d-none d-lg-block">
                                                  <div className="ta_price_partner_info">
                                                    {room.name && (
                                                      <span className="ta_room_name">
                                                        {room.name}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="ta_price_mid">
                                                {roomPricePerNight ||
                                                  roomPriceTotal ? (
                                                  <div className="ta_price_details">
                                                    {roomPricePerNight && (
                                                      <span className="ta_price_primary">
                                                        <span className="ta_price_amount">
                                                          {formatSerpPrice(
                                                            roomPricePerNight,
                                                          )}
                                                        </span>
                                                        <span className="ta_price_unit">
                                                          /night
                                                        </span>
                                                      </span>
                                                    )}
                                                    {roomPriceTotal &&
                                                      nights > 1 && (
                                                        <span className="ta_price_total">
                                                          {formatSerpPrice(
                                                            roomPriceTotal,
                                                          )}{" "}
                                                          total
                                                        </span>
                                                      )}
                                                    {beforeTaxes &&
                                                      beforeTaxes !==
                                                      roomPricePerNight && (
                                                        <span className="ta_price_before_taxes">
                                                          Before taxes & fees:{" "}
                                                          {formatSerpPrice(
                                                            beforeTaxes,
                                                          )}
                                                          /night
                                                        </span>
                                                      )}
                                                  </div>
                                                ) : (
                                                  <span className="ta_price_na">
                                                    —
                                                  </span>
                                                )}
                                              </div>
                                              <div className="ta_price_cta">
                                                {finalLink ? (
                                                  <a
                                                    href={finalLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ta_view_deal_btn"
                                                  >
                                                    View Deals
                                                  </a>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    className="ta_view_deal_btn"
                                                    disabled
                                                  >
                                                    View Deals
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ),
                                hasMultipleRooms && (
                                  <div
                                    key={`${partnerIndex}-toggle-desktop`}
                                    className="d-none d-lg-block"
                                  >
                                    <div
                                      className={`ta_price_row ta_price_toggle_row ${isExpanded ? "ta_toggle_expanded" : ""}`}
                                      role="button"
                                      tabIndex={0}
                                      onClick={() =>
                                        togglePartnerExpand(partnerIndex)
                                      }
                                      onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        togglePartnerExpand(partnerIndex)
                                      }
                                    >
                                      <div className="ta_price_partner">
                                        {/* <div className="ta_price_logo">
                                                                    <span className="ta_logo_placeholder" aria-hidden="true" />
                                                                </div> */}
                                        <div className="ta_price_partner_info">
                                          <button
                                            type="button"
                                            className="ta_toggle_btn"
                                          >
                                            {isExpanded ? (
                                              <>
                                                <MdExpandLess className="ta_toggle_icon" />
                                                Show less
                                              </>
                                            ) : (
                                              <>
                                                <MdExpandMore className="ta_toggle_icon" />
                                                Show {hiddenCount} room type
                                                {hiddenCount > 1 ? "s" : ""}
                                              </>
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              ].filter(Boolean);
                            },
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hotel data from SerpAPI: address, amenities, nearby places, reviews – hide only on initial load, not when refetching (e.g. currency change) */}
          <HotelSerpDataSection
            data={serpHotelDetail}
            isLoading={isSerpPriceLoading}
            googleReviews={userReviews}
          />
        </>
      ) : (
        <>
          <div className="container">
            <div className="row matrix_fix">
              <div className="col-lg-8">
                <div className="content_box_detail rounded-2xl border border-gray-300 bg-white">
                  {aimodal?.data && (
                    <div className="px-3 pb-3">
                      <h4 className="mb-3 fw-semibold">About this place</h4>
                      <SerpAiModalContent data={aimodal.data} />
                    </div>
                  )}
                  <HotelFacilities
                    hotelAmenties={combinedAmenities}
                    load={isLoading}
                  />
                </div>
              </div>
              <div className="col-lg-4"></div>
            </div>
          </div>
        </>
      )}
      <div ref={locationSectionRef} id="location_section">
        <HotelLocation lat={latitude} long={longitude} load={isLoading} />
      </div>
      <PopularHotelAroundWorld lat={latitude} long={longitude} />
      <HotelSearchNearByLocation
        lat={latitude}
        long={longitude}
        locationName={locationName}
        excludePlaceId={code}
      />
      <HotelSearchIconicPlaces
        lat={latitude}
        long={longitude}
        locationName={locationName}
      />
      <Blogs />
      <FaqSection />
      {/* ************************************* on mobile view shoqw section */}

      {/* ******************************************************** */}
      {/* <div className="container">
                <div className="row matrix_fix">
                    <div className="col-lg-12 ">
                        <div className=" content_box_detail  rounded-2xl border border-gray-300">
                            <AboutHotelDetail detail={hotelDescription} load={isLoading} />

                            <HotelFacilities hotelAmenties={hotelAmenties} load={isLoading} />
                            <HotelReviews reviews={userReviews} />

                            <NearByHotel places={near_by_places} />

                            <HotelLocation lat={latitude} long={longitude} load={isLoading} />
                        </div>
                    </div>
                    <div className="col-lg-5 order-first order-lg-last">
                        <SearchSidebar hotelPricing={hotelPricing} load={isLoading} />
                    </div>
                </div>
            </div> */}
      <Footer />
    </>
  );
}
