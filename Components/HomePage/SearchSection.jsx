"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaHotel, FaUser } from "react-icons/fa";
import { MdFlight } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { GrBike } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import { SearchLocation } from "@/app/Route/endpoints";

export default function SearchSection() {
    const [locationFetching, setLocationFetching] = useState(true);
    const [search, setsearch] = useState("");
    // Reverse geocoding function
    // ********************************************************************************************************************************************************************
    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                { headers: { "User-Agent": "JustBuyTravel/1.0" } }
            );
            const data = await response.json();
            if (data && data.address) {
                // Only prioritize city, town, or village
                const city =
                    data.address.city || data.address.town || data.address.village;
                if (city) return city;

                // Optional: fallback to municipality or county if no city
                return (
                    data.address.municipality || data.address.county || "Unknown Location"
                );
            }
            return "Unknown Location";
        } catch (error) {
            return "Unknown Location";
        }
    }, []);







    // ********************************************************************************************************************************************************************
    // Fetch current location on mount

    useEffect(() => {
        const getLocation = async () => {
            if (typeof navigator === "undefined" || !navigator?.geolocation) {
                setsearch("New York");
                setLocationFetching(false);
                return;
            }

            try {
                const position = await new Promise((resolve, reject) => {
                    navigator?.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000,
                    });
                });

                const { latitude, longitude } = position.coords;
                const cityName = await reverseGeocode(latitude, longitude);

                setsearch(cityName);



            } catch (err) {
                setsearch("New York"); // fallback
            } finally {
                setLocationFetching(false);
            }
        };

        getLocation();
    }, [reverseGeocode]);

    // ********************************************************************************************************************************************************************
    // Search function
    const doSearch = useCallback(async (query) => {
        try {

            const results = await SearchLocation(query);
        } catch (err) {
        }
    }, []);

    // Refetch data when search changes
    useEffect(() => {
        if (search) {
            doSearch(search);
        }
    }, [search, doSearch]);



    // ********************************************************************************************************************************************************************
    return (
        <section className="Search_section pb-20">
            <div className="container">
                <div className="search_container">
                    <div className="search_container_box bg-white rounded-2xl pb-4 w-full">
                        <div className="search_tab ps-5 pe-5 pt-4 pb-4">
                            <div className="tab_link flex justify-between">
                                <ul className="flex items-center gap-3 p-0">
                                    <li>
                                        <Link href={""} className="button_bg text-white">
                                            search all
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={""}>
                                            <FaHotel /> hotels
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={""}>
                                            <MdFlight /> flights
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={""}>
                                            <FaCar /> Things to do
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={""}>
                                            <GrBike /> Restaurant
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

                        <div className="search_box_input">
                            <form
                                className="px-15 mx-auto"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const trimmed = (search || "").trim();
                                    if (trimmed.length === 0) return;
                                    setsearch(trimmed);

                                }}
                            >
                                <div className="relative search_box">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none icon_search">
                                        <CiSearch />
                                    </div>
                                    <input
                                        type="text"
                                        onChange={(e) => setsearch(e.target.value)}
                                        className="block w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body"
                                        placeholder="Places to go, things to do, hotels..."

                                    />
                                    <button
                                        type="submit"

                                        className="absolute top-2 end-3 bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs px-3 focus:outline-none button_bg2"
                                    >
                                        Search
                                    </button>



                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
