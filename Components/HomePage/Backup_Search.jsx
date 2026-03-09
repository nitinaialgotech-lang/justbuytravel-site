"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaHotel, FaUser } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import {
    Dropdown_Get,
    Get_cityName,
    RestaurantApi,
    searchHotel,
    SearchLocation,
} from "@/app/Route/endpoints";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { autoComplete, searchText } from "@/app/Route/endpoints";
import Search_flight_section from "../Book-Flights/Search_flight_section";
import HotelIcon, { FlightIcon } from "@/component/icons";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useDispatch } from "react-redux";
import { nameCity, setLat, setLong, SetSelectAll } from "../Redux/Reducer";
import { getPlacePhotoUrl } from "@/app/utils/assetPath";
import {
    createHotelSlug,
    getPlaceDetailPath,
    getPlaceTypeFromTypes,
} from "@/app/utils/seo";
import Flight_Search_Input from "../Book-Flights/Flight_Details/Flight_Search_Input";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { getRecentlyViewedProperties } from "@/app/utils/recentlyViewed";
import { set } from "date-fns";

const RECENT_SEARCHES_KEY = "justbuytravel_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches() {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(item) {
    const recent = getRecentSearches();
    const filtered = recent.filter(
        (r) => r.name !== item.name || r.lat !== item.lat || r.long !== item.long,
    );
    const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(
        0,
        MAX_RECENT_SEARCHES,
    );
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

export default function Backup_Search({ tabActive }) {
    console.log(tabActive, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");

    // **************************************************************************************
    // ********************************************************************************************************************
    const router = useRouter();
    const pathname = usePathname();
    const isBookFlightsPage = pathname?.includes("flights") ?? false;
    const isBookHotelsPage = pathname?.includes("hotels") ?? false;
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [imageErrors, setImageErrors] = useState({});
    const [imageLoading, setImageLoading] = useState({});
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const [searchAll, setSearchAll] = useState(!isBookHotelsPage);
    const [searchType, setSearchType] = useState(
        isBookHotelsPage ? "hotels" : "all",
    );
    const [searchContent, setSearchContent] = useState("");
    const [activeTab, setActiveTab] = useState(
        isBookHotelsPage ? "hotels" : "all",
    );
    const [textContent, setContenttext] = useState(
        isBookHotelsPage ? "Search hotels by name or city" : "",
    );
    // When true, we show a default set of suggestions (e.g. popular hotels)
    // as soon as the search input is focused, even if the user hasn't typed yet.
    const [showDefaultOnFocus, setShowDefaultOnFocus] = useState(false);
    const [nearbyLocation, setNearbyLocation] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const dispatch = useDispatch();

    // Reverse geocode to get city name from coordinates
    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                { headers: { "User-Agent": "JustBuyTravel/1.0" } },
            );
            const data = await res.json();
            if (data?.address) {
                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.municipality ||
                    data.address.county;
                if (city) return { name: city, lat, long: lng };
            }
        } catch (_) { }
        return null;
    }, []);

    // Fetch nearby location when user focuses empty input
    const fetchNearbyLocation = useCallback(() => {
        if (typeof navigator === "undefined" || !navigator?.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const result = await reverseGeocode(latitude, longitude);
                if (result) setNearbyLocation(result);
            },
            () => setNearbyLocation(null),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
        );
    }, [reverseGeocode]);

    // Refresh recent searches and recently viewed when dropdown opens with empty input
    useEffect(() => {
        if (showDefaultOnFocus && !searchContent.trim()) {
            setRecentSearches(getRecentSearches());
            setRecentlyViewed(getRecentlyViewedProperties());
        }
    }, [showDefaultOnFocus, searchContent]);
    useEffect(() => {
        setSearchContent(query);
    }, [query]);
    //    ******************************************* on crefresh local value change //
    const reset = () => {
        setActiveTab("all");
        setSearchType("all");
        setSearchAll(true);
        setSearchContent("");
        setContenttext("Search places and hotels");
    };

    const route = useRouter();
    useEffect(() => {
        window.addEventListener("reset-search", reset);
        return () => window.removeEventListener("reset-search", reset);
    }, []);

    // const handleSearch = () => {
    //     if (!searchContent.trim()) return;
    //     router.push(`/search?query=${encodeURIComponent(searchContent)}`);
    // };

    // ********************************

    useEffect(() => {
        if (isBookFlightsPage) {
            setActiveTab("flights");
            setSearchAll(false);
            setSearchType("flights");
            dispatch(SetSelectAll("flights"));
        } else if (isBookHotelsPage) {
            setContenttext("Search hotels by name or city");
            setSearchType("hotels");
            setActiveTab("hotels");
            setSearchAll(false);
            dispatch(SetSelectAll("hotels"));
        }
    }, [pathname]);

    /********************* *********************************************************************************/

    // Helper function to get photo URL from Google Places API response
    const getPhotoUrl = (place) => {
        if (!place?.photos || place.photos.length === 0) {
            return null;
        }

        const photo = place.photos[0];

        // Try different possible paths for photo URL
        // 1. Direct URI field
        if (photo.uri) {
            return photo.uri;
        }

        // 2. Direct URL field
        if (photo.url) {
            return photo.url;
        }

        // 3. Check authorAttributions for photoUri (some API versions)
        if (photo.authorAttributions && photo.authorAttributions.length > 0) {
            if (photo.authorAttributions[0].photoUri) {
                return photo.authorAttributions[0].photoUri;
            }
        }

        // 4. If photo has name, we need to construct URL via backend
        // For Google Places API v1, photo.name needs to be converted to URL
        // This should be handled by backend, but if name exists, return null to use placeholder
        if (photo.name) {
            // You might want to create a backend endpoint like: /photo.php?name={photo.name}
            // For now, return null to show placeholder
            return null;
        }

        return null;
    };

    // Handle image load start
    const handleImageLoadStart = (placeId) => {
        setImageLoading((prev) => ({ ...prev, [placeId]: true }));
    };

    // Handle image load success
    const handleImageLoad = (placeId) => {
        setImageLoading((prev) => ({ ...prev, [placeId]: false }));
        setImageErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[placeId];
            return newErrors;
        });
    };

    // Handle image load error
    const handleImageError = (placeId, e) => {
        setImageLoading((prev) => ({ ...prev, [placeId]: false }));
        setImageErrors((prev) => ({ ...prev, [placeId]: true }));
        e.target.src =
            "https://via.placeholder.com/120x120/f3f4f6/9ca3af?text=Hotel";
        e.target.onerror = null; // Prevent infinite loop
    };
    // *************
    useEffect(() => {
        if (tabActive) {
            setActiveTab(tabActive);
            setSearchType(
                tabActive === "all"
                    ? "all"
                    : tabActive === "flights"
                        ? "flights"
                        : tabActive === "hotels"
                            ? "hotels"
                            : tabActive === "restaurants"
                                ? "restaurants"
                                : "all",
            );
        }
    }, [tabActive]);

    // Fetch autocomplete results
    const { data: autoCompleteData, isLoading } = useQuery({
        queryKey: [
            "autoComplete",
            searchContent,
            searchType,
            activeTab,
            showDefaultOnFocus,
        ],
        queryFn: () => {
            // "Search all" tab: all types (city, country, hotel, restaurant, attractions)
            if (searchType === "all" || activeTab === "all") {
                // If there is no user input yet but the field was focused,
                // seed the query with a generic term so we show something useful.
                const queryText =
                    searchContent && searchContent.trim().length > 0
                        ? searchContent
                        : "hotel";
                return autoComplete(queryText, 10, "all");
            }
            // Hotels tab: hotel-focused suggestions
            if (searchType === "hotels" || activeTab === "hotels") {
                return searchHotel(searchContent);
            }
            // Restaurants tab: restaurant-only suggestions with same UX as hotels
            if (searchType === "restaurants" || activeTab === "restaurants") {
                return autoComplete(searchContent, 10, "restaurant");
            }
            // Default fallback: generic text search
            return searchText(searchContent);
        },
        // API requires min 2 chars - only run when user typed 2+ chars, or show defaults on empty focus
        enabled: showDefaultOnFocus || searchContent.trim().length >= 2,
        staleTime: 30000, // Cache for 30 seconds
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Show dropdown when there are results, or when focused empty (show Nearby/Recent/Popular)
    useEffect(() => {
        const places = autoCompleteData?.data?.places || [];
        const hasTypedResults =
            searchContent.trim().length > 0 && places.length > 0;
        const isEmptyFocusSuggestions = showDefaultOnFocus && !searchContent.trim();
        if (hasTypedResults || isEmptyFocusSuggestions) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [autoCompleteData, searchContent, showDefaultOnFocus]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchContent(value);
        // As soon as the user types something, stop forcing default data.
        if (value.length > 0 && showDefaultOnFocus) {
            setShowDefaultOnFocus(false);
        }
        setShowDropdown(value.length > 0);
        setSelectedIndex(-1);
    };

    // Check if place is a hotel/lodging (redirect to detail page)
    const isHotelPlace = (place) => {
        const types = place?.types || [];
        return types.includes("lodging");
    };

    // Check if place is a restaurant (redirect to detail page)
    const isRestaurantPlace = (place) => {
        const types = place?.types || [];
        return types.includes("restaurant");
    };

    // Check if place is an iconic place / tourist attraction (redirect to detail page)
    const isIconicPlace = (place) => {
        const types = place?.types || [];
        return types.includes("tourist_attraction");
    };

    // Restaurant and iconic places go to detail page; city/region/country go to search page
    const isDetailPlace = (place) =>
        isHotelPlace(place) || isRestaurantPlace(place) || isIconicPlace(place);

    const handleSelectPlace = (place) => {
        setSearchContent(place.displayName?.text || place.formattedAddress || "");
        setShowDropdown(false);
        const lat = place?.location?.latitude || "";
        const long = place?.location?.longitude || "";
        const id = place?.id;
        const name =
            place?.displayName?.text || place?.name || place?.formattedAddress || "";

        // Hotel, restaurant, or iconic place: go to detail page
        if (isDetailPlace(place)) {
            ViewHotels(id, name, place);
            return;
        }

        // City (e.g. New Delhi), country, or region: go to search page (hotels in that location)
        if (name && (lat || long)) {
            saveRecentSearch({ name, lat, long });
        }
        viewSearchAll(place);
    };

    // Handle selecting nearby or recent location (place-like object)
    const handleSelectNearbyOrRecent = (item) => {
        const place = {
            displayName: { text: item.name },
            formattedAddress: item.name,
            location: { latitude: item.lat, longitude: item.long },
        };
        saveRecentSearch({ name: item.name, lat: item.lat, long: item.long });
        viewSearchAll(place);
        setShowDropdown(false);
        setSearchContent(item.name);
    };

    // Handle selecting a recently viewed hotel
    const handleSelectRecentlyViewed = (item) => {
        setShowDropdown(false);
        setSearchContent(item.name);
        router.push(`/hotel/${item.slug}`);
    };

    const handleKeyDown = (e) => {
        const places =
            autoCompleteData?.data?.places || autoCompleteData?.places || [];

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < places.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }

        // else if (e.key === 'Enter' && selectedIndex >= 0) {
        //     e.preventDefault();
        //     handleSelectPlace(places[selectedIndex])
        // }
        if (e.key === "Enter") {
            // Only use results when query has completed (avoid stale data from previous search)
            if (places.length > 0 && !isLoading) {
                e.preventDefault();
                const placeToSelect =
                    selectedIndex >= 0 ? places[selectedIndex] : places[0];
                handleSelectPlace(placeToSelect);
                setShowDropdown(false);
            }
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    // Extract places from response - handle both direct response and nested data
    const places =
        autoCompleteData?.data?.places || autoCompleteData?.places || [];

    // Navigate to search page: show hotels and details for city/region/country
    const viewSearchAll = (place) => {
        const lat = place?.location?.latitude ?? "";
        const long = place?.location?.longitude ?? "";
        const placeName =
            place?.displayName?.text || place?.formattedAddress || place?.name || "";
        const types = place?.types || [];
        const isCountry = types.includes("country");
        const isLargeRegion = types.includes("administrative_area_level_1");
        dispatch(setLat(lat));
        dispatch(setLong(long));
        dispatch(nameCity([placeName]));
        const params = new URLSearchParams();
        if (lat) params.set("lat", lat);
        if (long) params.set("long", long);
        if (placeName) params.set("name", placeName);
        if (isCountry || isLargeRegion) params.set("type", "region");
        router.push(`/search?${params.toString()}`);
    };
    // **************************** hotel search

    const ViewHotels = (id, name, place) => {
        if (!id) return;
        const placeType = getPlaceTypeFromTypes(place?.types) || "hotel";
        router.push(getPlaceDetailPath(placeType, name || "", id));
    };
    // *********************************

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        // localStorage.setItem("searchType", searchType);
    };

    console.log(pathname, "pkpkkpkp");
    const isDetailPage = pathname.includes("ChIJ");
    // ********************************** open flight on hotel details page on click the flight tab
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    useEffect(() => {
        if (isSearchModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isSearchModalOpen]);

    return (
        <>
            {isSearchModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm  transition-opacity duration-300  backdrop"
                    onClick={() => setIsSearchModalOpen(false)}
                ></div>
            )}

            <section
                className={`Search_section  ${isBookFlightsPage ? "padding_topf50 padding_b70" : "padding_bottom"} ${isDetailPage ? "pb-0" : ""}`}
            >
                <div className={`container ${isDetailPage ? "p-0" : ""}`}>
                    <div
                        className={`
${isSearchModalOpen
                                ? "relative    z-50 bg-white shadow-2xl p-6 rounded-2xl search_container input_backdrop "
                                : `${isBookHotelsPage ? "searchhotelcontainer" : "search_container"}`
                            }
${pathname === "/flights" ? "no-shadow p-0" : ""}
${isDetailPage ? "no-shadow pt-0 ps-0 pe-0" : ""}
relative
`}
                    >
                        <div className={`search_container_box  rounded-2xl  w-full `}>
                            {!isBookFlightsPage && !isBookHotelsPage && !isDetailPage ? (
                                <div className="search_tab">
                                    <div className="tab_link flex justify-between items-center">
                                        <ul className="flex items-center p-0">
                                            <li>
                                                <Link
                                                    href={""}
                                                    className={`${activeTab == "all" ? "g_color" : ""} justify-center items-center`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab("all");
                                                        setSearchAll(true);
                                                        setContenttext("Search places and hotels");
                                                        handleSearchTypeChange("all");
                                                        dispatch(SetSelectAll("all"));
                                                    }}
                                                >
                                                    <span>
                                                        {" "}
                                                        <FiSearch />
                                                    </span>{" "}
                                                    <span>searchAll </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={""}
                                                    className={`${activeTab == "flights" ? "g_color" : ""} justify-center items-center`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab("flights");
                                                        handleSearchTypeChange("flights");
                                                        dispatch(SetSelectAll("flights"));
                                                    }}
                                                >
                                                    <span className="hover_icon">
                                                        <FlightIcon
                                                            color={`${activeTab == "flights" ? "#12c081" : "#1D1F27"} `}
                                                        />
                                                    </span>{" "}
                                                    <span>flights</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={""}
                                                    className={`${activeTab == "hotels" ? "g_color" : ""} justify-center items-center`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab("hotels");
                                                        setSearchAll(false);
                                                        setContenttext("Search hotels by name or city");
                                                        handleSearchTypeChange("hotels");
                                                        dispatch(SetSelectAll("hotels"));
                                                    }}
                                                >
                                                    <span className="hover_icon">
                                                        <HotelIcon
                                                            color={`${activeTab == "hotels" ? "#12c081" : "#1D1F27"} `}
                                                        />
                                                    </span>{" "}
                                                    <span>hotels</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={""}
                                                    className={`${activeTab === "restaurants" ? "g_color" : ""} justify-center items-center`}
                                                    onClick={(e) => {
                                                        setActiveTab("restaurants");
                                                        setSearchAll(false);
                                                        handleSearchTypeChange("restaurants");
                                                        setContenttext("Search restaurants or cuisine");
                                                        dispatch(SetSelectAll("restaurants"));
                                                    }}
                                                >
                                                    <span>
                                                        <MdOutlineRestaurantMenu />
                                                    </span>{" "}
                                                    <span>
                                                        <p className="m-0">Restaurants</p>
                                                    </span>
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="help_info">
                                            <p className="flex items-center gap-2">
                                                <FaUser /> need some help ?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                " "
                            )}
                            {/* ********************* search input xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                            <div className="search_box_input d-none d-lg-block">
                                {searchType === "flights" ||
                                    isBookFlightsPage ||
                                    tabActive === "flights" ? (
                                    // <Search_flight_section />
                                    <Flight_Search_Input Tabin={tabActive} />
                                ) : (
                                    <form
                                        className="mx-auto"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const trimmed = searchContent.trim();
                                            if (trimmed.length === 0) return;
                                            // Add your search navigation logic here
                                        }}
                                    >
                                        <div className="searchbox_modal search_box_input">
                                            <div className="relative search_box">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none icon_search">
                                                    <CiSearch />
                                                </div>
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={searchContent}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    onFocus={() => {
                                                        setIsSearchModalOpen(true);
                                                        // When focusing with an empty input, trigger default
                                                        // suggestions (Nearby, Recent, Popular) like TripAdvisor
                                                        if (!searchContent.trim()) {
                                                            setShowDefaultOnFocus(true);
                                                            fetchNearbyLocation();
                                                        }
                                                        if (places.length > 0) setShowDropdown(true);
                                                    }}
                                                    className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-12 capitalize"
                                                    placeholder={
                                                        textContent || "Search places and hotels"
                                                    }
                                                />
                                                {!isSearchModalOpen ? (
                                                    <button
                                                        type="submit"
                                                        className="absolute top-2 end-3 bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs focus:outline-none button_bg2 text-white rounded search_full_button_padding "
                                                    >
                                                        Search
                                                    </button>
                                                ) : (
                                                    ""
                                                )}
                                            </div>

                                            {/* ********************************* seachinf dropdown xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                                            {/* Autocomplete Dropdown */}
                                            {showDropdown && (
                                                <div
                                                    ref={dropdownRef}
                                                    className=" z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
                                                >
                                                    {/* Nearby & Recent sections when input is empty (TripAdvisor-style) */}
                                                    {!searchContent.trim() && showDefaultOnFocus && (
                                                        <div className="border-b border-gray-100">
                                                            {nearbyLocation && (
                                                                <div
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                        handleSelectNearbyOrRecent(nearbyLocation);
                                                                    }}
                                                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                                        <HiOutlineLocationMarker className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                                            Nearby
                                                                        </div>
                                                                        <div className="font-medium text-gray-900">
                                                                            {nearbyLocation.name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {recentSearches.length > 0 && (
                                                                <div className="px-4 py-2">
                                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                                                        <MdHistory className="w-4 h-4" /> Recent
                                                                        searches
                                                                    </div>
                                                                    {recentSearches.map((item, idx) => (
                                                                        <div
                                                                            key={`${item.name}-${idx}`}
                                                                            onMouseDown={(e) => {
                                                                                e.preventDefault();
                                                                                handleSelectNearbyOrRecent(item);
                                                                            }}
                                                                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                                                                        >
                                                                            <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 shrink-0" />
                                                                            <span className="text-sm text-gray-900 truncate">
                                                                                {item.name}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {recentlyViewed.length > 0 && (
                                                                <div className="px-4 py-2">
                                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                                                        <FaHotel className="w-4 h-4" /> Recently
                                                                        viewed
                                                                    </div>
                                                                    {recentlyViewed.map((item, idx) => (
                                                                        <div
                                                                            key={`viewed-${item.id}-${idx}`}
                                                                            onMouseDown={(e) => {
                                                                                e.preventDefault();
                                                                                handleSelectRecentlyViewed(item);
                                                                            }}
                                                                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                                                                        >
                                                                            <FaHotel className="w-4 h-4 text-gray-400 shrink-0" />
                                                                            <div className="flex-1 min-w-0">
                                                                                <span className="text-sm text-gray-900 truncate block">
                                                                                    {item.name}
                                                                                </span>
                                                                                {item.address && (
                                                                                    <span className="text-xs text-gray-500 truncate block">
                                                                                        {item.address}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {!nearbyLocation &&
                                                                recentSearches.length === 0 &&
                                                                recentlyViewed.length === 0 &&
                                                                !isLoading &&
                                                                places.length === 0 && (
                                                                    <div className="px-4 py-4 text-center text-gray-500 text-sm">
                                                                        Allow location access for nearby suggestions
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )}
                                                    {isLoading &&
                                                        !searchContent.trim() &&
                                                        !nearbyLocation &&
                                                        recentSearches.length === 0 &&
                                                        recentlyViewed.length === 0 ? (
                                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                                            Loading suggestions...
                                                        </div>
                                                    ) : places.length > 0 ? (
                                                        <>
                                                            {!searchContent.trim() &&
                                                                showDefaultOnFocus &&
                                                                (nearbyLocation ||
                                                                    recentSearches.length > 0 ||
                                                                    recentlyViewed.length > 0) && (
                                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                                            Popular
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            {places.map((place, index) => {
                                                                const placeId = place.id || `place-${index}`;

                                                                const photoUrl = getPhotoUrl(place);
                                                                const hasImageError = imageErrors[placeId];
                                                                const displayImage =
                                                                    getPlacePhotoUrl(place) ||
                                                                    (photoUrl && !hasImageError
                                                                        ? photoUrl
                                                                        : "https://via.placeholder.com/120x120/f3f4f6/9ca3af?text=Hotel");

                                                                return (
                                                                    <div
                                                                        key={placeId}
                                                                        // onClick={() => handleSelectPlace(place)}
                                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                                        onMouseDown={(e) => {
                                                                            e.preventDefault();
                                                                            handleSelectPlace(place);
                                                                        }}
                                                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ${selectedIndex === index
                                                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                                                : "hover:bg-gray-50 border-l-4 border-transparent"
                                                                            }`}
                                                                    >
                                                                        {/* Hotel Image */}
                                                                        <div className="shrink-0">
                                                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                                                                {imageLoading[placeId] && (
                                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                                                    </div>
                                                                                )}
                                                                                <img
                                                                                    src={displayImage}
                                                                                    alt={
                                                                                        place.displayName?.text || "Hotel"
                                                                                    }
                                                                                    className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoading[placeId]
                                                                                            ? "opacity-0"
                                                                                            : "opacity-100"
                                                                                        }`}
                                                                                    onLoadStart={() =>
                                                                                        handleImageLoadStart(placeId)
                                                                                    }
                                                                                    onLoad={() =>
                                                                                        handleImageLoad(placeId)
                                                                                    }
                                                                                    onError={(e) =>
                                                                                        handleImageError(placeId, e)
                                                                                    }
                                                                                    loading="lazy"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* Hotel Info */}

                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                                                                {place.displayName?.text || "Hotel"}
                                                                            </div>
                                                                            {place.formattedAddress && (
                                                                                <div className="text-gray-600 text-xs mb-2 line-clamp-1">
                                                                                    {place.formattedAddress}
                                                                                </div>
                                                                            )}
                                                                            {place.rating && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex items-center gap-1">
                                                                                        <svg
                                                                                            className="w-4 h-4 text-yellow-400 fill-current"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                                                        </svg>
                                                                                        <span className="text-gray-800 text-xs font-medium">
                                                                                            {place.rating.toFixed(1)}
                                                                                        </span>
                                                                                    </div>
                                                                                    {place.userRatingCount && (
                                                                                        <span className="text-gray-500 text-xs">
                                                                                            (
                                                                                            {place.userRatingCount.toLocaleString()}{" "}
                                                                                            reviews)
                                                                                        </span>
                                                                                    )}
                                                                                    {place.priceLevel !== undefined && (
                                                                                        <span className="text-gray-500 text-xs ml-2">
                                                                                            {place.priceLevel === 0
                                                                                                ? "Free"
                                                                                                : "$".repeat(place.priceLevel)}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Arrow Icon */}
                                                                        <div className="shrink-0">
                                                                            <svg
                                                                                className="w-5 h-5 text-gray-400"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M9 5l7 7-7 7"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </>
                                                    ) : searchContent.length > 0 ? (
                                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            <svg
                                                                className="w-12 h-12 mx-auto mb-2 text-gray-300"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            No hotels found for "{searchContent}"
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </div>
                            {/* **************************************** edning */}

                            {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx **********************************xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx on mobile vooiw show form  */}
                            <div
                                className={`${searchType === "flights" || isBookFlightsPage ? "p-0" : ""} mobile_search_box  d-block d-lg-none`}
                            >
                                {searchType === "flights" ||
                                    isBookFlightsPage ||
                                    tabActive === "flights" ? (
                                    <Flight_Search_Input />
                                ) : (
                                    <div className="mobole_boxs relative">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const trimmed = searchContent.trim();
                                                if (trimmed.length === 0) return;
                                                // Add your search navigation logic here
                                            }}
                                        >
                                            <input
                                                type="text"
                                                ref={inputRef}
                                                value={searchContent}
                                                onChange={handleInputChange}
                                                onKeyDown={handleKeyDown}
                                                onFocus={() => {
                                                    setIsSearchModalOpen(true);
                                                    if (!searchContent.trim()) {
                                                        setShowDefaultOnFocus(true);
                                                        fetchNearbyLocation();
                                                    }
                                                    if (places.length > 0) setShowDropdown(true);
                                                }}
                                                className="block relative w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body"
                                                placeholder={textContent || "Search places and hotels"}
                                            />

                                            {/* **************** */}
                                            {showDropdown && (
                                                <div
                                                    ref={dropdownRef}
                                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
                                                >
                                                    {/* Nearby & Recent on mobile */}
                                                    {!searchContent.trim() && showDefaultOnFocus && (
                                                        <div className="border-b border-gray-100">
                                                            {nearbyLocation && (
                                                                <div
                                                                    onClick={() =>
                                                                        handleSelectNearbyOrRecent(nearbyLocation)
                                                                    }
                                                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                                                                >
                                                                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                                        <HiOutlineLocationMarker className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-xs font-medium text-gray-500 uppercase">
                                                                            Nearby
                                                                        </div>
                                                                        <div className="font-medium text-gray-900">
                                                                            {nearbyLocation.name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {recentSearches.length > 0 && (
                                                                <div className="px-4 py-2">
                                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase mb-2">
                                                                        <MdHistory className="w-4 h-4" /> Recent
                                                                        searches
                                                                    </div>
                                                                    {recentSearches.map((item, idx) => (
                                                                        <div
                                                                            key={`recent-m-${item.name}-${idx}`}
                                                                            onClick={() =>
                                                                                handleSelectNearbyOrRecent(item)
                                                                            }
                                                                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
                                                                        >
                                                                            <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 shrink-0" />
                                                                            <span className="text-sm text-gray-900 truncate">
                                                                                {item.name}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {recentlyViewed.length > 0 && (
                                                                <div className="px-4 py-2">
                                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase mb-2">
                                                                        <FaHotel className="w-4 h-4" /> Recently
                                                                        viewed
                                                                    </div>
                                                                    {recentlyViewed.map((item, idx) => (
                                                                        <div
                                                                            key={`viewed-m-${item.id}-${idx}`}
                                                                            onClick={() =>
                                                                                handleSelectRecentlyViewed(item)
                                                                            }
                                                                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
                                                                        >
                                                                            <FaHotel className="w-4 h-4 text-gray-400 shrink-0" />
                                                                            <div className="flex-1 min-w-0">
                                                                                <span className="text-sm text-gray-900 truncate block">
                                                                                    {item.name}
                                                                                </span>
                                                                                {item.address && (
                                                                                    <span className="text-xs text-gray-500 truncate block">
                                                                                        {item.address}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {isLoading &&
                                                        !searchContent.trim() &&
                                                        !nearbyLocation &&
                                                        recentSearches.length === 0 &&
                                                        recentlyViewed.length === 0 ? (
                                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                                            Loading suggestions...
                                                        </div>
                                                    ) : places.length > 0 ? (
                                                        <>
                                                            {!searchContent.trim() &&
                                                                showDefaultOnFocus &&
                                                                (nearbyLocation ||
                                                                    recentSearches.length > 0 ||
                                                                    recentlyViewed.length > 0) && (
                                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                                        <div className="text-xs font-medium text-gray-500 uppercase">
                                                                            Popular
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            {places.map((place, index) => {
                                                                const placeId = place.id || `place-${index}`;

                                                                const photoUrl = getPhotoUrl(place);
                                                                const hasImageError = imageErrors[placeId];
                                                                const displayImage =
                                                                    getPlacePhotoUrl(place) ||
                                                                    (photoUrl && !hasImageError
                                                                        ? photoUrl
                                                                        : "https://via.placeholder.com/120x120/f3f4f6/9ca3af?text=Hotel");

                                                                return (
                                                                    <div
                                                                        key={placeId}
                                                                        onClick={() => handleSelectPlace(place)}
                                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200 ${selectedIndex === index
                                                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                                                : "hover:bg-gray-50 border-l-4 border-transparent "
                                                                            }`}
                                                                    >
                                                                        {/* Hotel Image */}
                                                                        <div className="shrink-0">
                                                                            <div className="w-15 h-15 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                                                                {imageLoading[placeId] && (
                                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                                                    </div>
                                                                                )}
                                                                                <img
                                                                                    src={displayImage}
                                                                                    alt={
                                                                                        place.displayName?.text || "Hotel"
                                                                                    }
                                                                                    className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoading[placeId]
                                                                                            ? "opacity-0"
                                                                                            : "opacity-100"
                                                                                        }`}
                                                                                    onLoadStart={() =>
                                                                                        handleImageLoadStart(placeId)
                                                                                    }
                                                                                    onLoad={() =>
                                                                                        handleImageLoad(placeId)
                                                                                    }
                                                                                    onError={(e) =>
                                                                                        handleImageError(placeId, e)
                                                                                    }
                                                                                    loading="lazy"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* Hotel Info */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                                                                {place.displayName?.text || "Hotel"}
                                                                            </div>
                                                                            {place.formattedAddress && (
                                                                                <div className="text-gray-600 text-xs mb-2 line-clamp-1">
                                                                                    {place.formattedAddress}
                                                                                </div>
                                                                            )}
                                                                            {place.rating && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex items-center gap-1">
                                                                                        <svg
                                                                                            className="w-4 h-4 text-yellow-400 fill-current"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                                                        </svg>
                                                                                        <span className="text-gray-800 text-xs font-medium">
                                                                                            {place.rating.toFixed(1)}
                                                                                        </span>
                                                                                    </div>
                                                                                    {place.userRatingCount && (
                                                                                        <span className="text-gray-500 text-xs">
                                                                                            (
                                                                                            {place.userRatingCount.toLocaleString()}{" "}
                                                                                            reviews)
                                                                                        </span>
                                                                                    )}
                                                                                    {place.priceLevel !== undefined && (
                                                                                        <span className="text-gray-500 text-xs ml-2">
                                                                                            {place.priceLevel === 0
                                                                                                ? "Free"
                                                                                                : "$".repeat(place.priceLevel)}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Arrow Icon */}
                                                                        <div className="shrink-0">
                                                                            <svg
                                                                                className="w-5 h-5 text-gray-400"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M9 5l7 7-7 7"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </>
                                                    ) : searchContent.length > 0 ? (
                                                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                            <svg
                                                                className="w-12 h-12 mx-auto mb-2 text-gray-300"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            No hotels found for "{searchContent}"
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                            {/* *************************************************** mdropdown */}

                                            <div className="absolute start-0 flex items-center ps-4 pointer-events-none icon_search">
                                                <CiSearch />
                                            </div>
                                            <button
                                                type="submit"
                                                className="  z-10 mt-2  bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2 w-full  search_padding "
                                            >
                                                Search
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
