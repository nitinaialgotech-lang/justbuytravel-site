import { https_api, https_blog, https_blog_category, https_checkIn, https_hotels, https_SearchCity, https_places, https_flights, https_AutoCompletetion } from "./https"

// Helper function to disambiguate common city names
const key = process.env.NEXT_PUBLIC_SERPAPI_KEY;

export const SearchLocation = async (search, address) => {
    return await https_api.get(`/search.php?city=${search}&full_address=${address}`)
}

export const HotelDetail = async (hotel_id, code) => {
    return await https_api.get(`/result.php?hotel_identifier=${hotel_id}&location_code=${code}`)
    // {
    //     catche: "no-store"
    // }
}

export const Get_Blogs = async () => {
    const res = await https_blog.get("/posts", {
        params: {
            per_page: 10, // or 1 if you only want count
        },
    });

    return {
        posts: res.data,
        totalPosts: Number(res.headers["x-wp-total"]),
        totalPages: Number(res.headers["x-wp-totalpages"]),
    };
};

/** Fetch a single post by slug (for blog detail pages - works for any post, not just first 10) */
export const Get_Blog_By_Slug = async (slug) => {
    const res = await https_blog.get("/posts", {
        params: { slug, per_page: 1 },
    });
    const post = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
    return post;
};

export const Get_Blog_category = async () => {
    return await https_blog.get("/categories?per_page=20")
}

/** Fetch all categories (for static export generateStaticParams). */
export const Get_All_Blog_Categories = async () => {
    return await https_blog.get("/categories?per_page=100")
}

/** Fetch all posts in pages (for static export generateStaticParams). Max 50 pages × 100 = 5000 posts. */
export const Get_All_Blog_Posts_For_Static = async () => {
    const first = await https_blog.get("/posts?per_page=100&page=1");
    const totalPages = Number(first.headers["x-wp-totalpages"]) || 1;
    const allPosts = [...(first.data || [])];
    const maxPages = Math.min(totalPages, 50);
    for (let page = 2; page <= maxPages; page++) {
        const res = await https_blog.get(`/posts?per_page=100&page=${page}`);
        allPosts.push(...(res.data || []));
    }
    return allPosts;
}
// export const Get_Blog_data = async (id) => {


//     return await https_blog.get(`/posts?categories=${id}`)
// }


export const Get_Blog_data = async (id, page) => {
    if (!id) {
        // Fetch All Posts
        const response = await https_blog.get(`/posts?page=${page}`);
        return {
            posts: response.data,
            totalPosts: Number(response.headers["x-wp-total"]),
            totalPages: Number(response.headers["x-wp-totalpages"]),
        }
    }

    // Fetch by Category
    const response = await https_blog.get(`/posts?categories=${id}`);
    return {
        posts: response.data,
        totalPosts: Number(response.headers["x-wp-total"]),
        totalPages: Number(response.headers["x-wp-totalpages"]),
    }
};

export const Dropdown_Get = async (data) => {
    return await https_api.get(`/location.php?q=${data}`)
}

// (((((((((((((())))))))))))))
export const Get_cityName = async (id) => {
    return await https_SearchCity.get(`/search.php?city=${id}`)
}
// *************************** search text 
export const searchText = async (text, limit = 50) => {
    return await https_places.get(`/text-search`, {
        params: {
            textQuery: text,
            maxResultCount: limit,
        },
    });
}
export const searchHotel = async (text, limit = 50) => {
    return await https_places.get(`/text-search`, {
        params: {
            textQuery: `low prices hotels and tourist_attraction in ${text}`,
            maxResultCount: limit,
        },
    });
}
export const searchHotel1 = async (text, limit = 50) => {
    return await https_places.get(`/text-search`, {
        params: {
            textQuery: `low prices hotels in ${text}`,
            maxResultCount: limit,
            includedType: "lodging",
        },
    });
}
export const searchTouristAttraction = async (text, limit = 50) => {
    return await https_places.get(`/text-search`, {
        params: {
            textQuery: `tourist_attraction in ${text}`,
            maxResultCount: limit,
        },
    });
}
export const NearbyRestaurant = async (text, limit = 50) => {
    return await https_places.get(`/text-search`, {
        params: {
            textQuery: `Restaurant in ${text}`,
            maxResultCount: limit,
            includedType: "restaurant",
        },
    });
}
/********************************** check in check out apis >>>>>>>>>>>> */
// Now use internal Next.js pricing API instead of legacy PHP endpoint.
// This keeps all traffic on the Node.js stack while still talking to Xotelo from the server.
export const HotelCheckInCheckOut = async (hotelkey, checkin, checkout, currency = "USD") => {
    // Guard against accidental calls without a hotel key so we don't hit /api/pricing incorrectly.
    if (!hotelkey) {
        throw new Error("Missing hotel key – cannot fetch pricing");
    }

    // Default to 1 night if dates not provided
    const defaultCheckin = checkin || new Date().toISOString().split("T")[0];
    const defaultCheckout =
        checkout ||
        (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date.toISOString().split("T")[0];
        })();

    // Call internal /api/pricing route via https_places (base: /api in browser, full URL on server)
    return await https_places.get(`/pricing`, {
        params: {
            hotel_key: hotelkey,
            chk_in: defaultCheckin,
            chk_out: defaultCheckout,
            currency,
        },
    });
}
export const TopHotelAroundWorld = async () => {
    try {
        // Primary source: Next.js Google Places aggregation
        const res = await https_places.get(`/top-hotels`, {
            params: {
                includedType: "lodging",
            },
        });

        // If we already have results, return as-is
        if (Array.isArray(res?.data?.results) && res.data.results.length > 0) {
            return res;
        }
    } catch (e) {
        // swallow and try legacy fallback
    }

    // Fallback: legacy PHP endpoint (ensures Hotels page still shows data)
    const legacy = await https_SearchCity.get(`/top-hotels.php?includedType=lodging`);
    const raw = legacy?.data;
    const legacyResults = Array.isArray(raw?.results)
        ? raw.results
        : Array.isArray(raw?.places)
            ? raw.places
            : Array.isArray(raw)
                ? raw
                : [];

    return {
        data: {
            includedType: "lodging",
            count: legacyResults.length,
            results: legacyResults,
        },
    };
}
export const TouristAttractionApi = async () => {
    try {
        const res = await https_places.get(`/top-hotels`, {
            params: { includedType: "tourist_attraction" },
        });
        if (Array.isArray(res?.data?.results) && res.data.results.length > 0) return res;
    } catch (e) {
        // swallow and try legacy fallback
    }
    try {
        const legacy = await https_SearchCity.get(`/top-hotels.php?includedType=tourist_attraction`);
        const raw = legacy?.data;
        const legacyResults = Array.isArray(raw?.results) ? raw.results : Array.isArray(raw?.places) ? raw.places : Array.isArray(raw) ? raw : [];
        return { data: { results: legacyResults } };
    } catch (e) {
        return { data: { results: [] } };
    }
}
export const RestaurantApi = async (text) => {
    // Use the same suggest pipeline for restaurants, filtered server-side
    return await autoComplete(text, 10, "restaurant");
}


export const autoComplete = async (text, limit = 10, mode = "all") => {
    return await https_places.get(`/search-suggest`, {
        params: {
            input: text,
            maxResultCount: limit,
            mode,
        },
    });
}
// export const autoComplete = async (text) => {
//     return await https_places.get(`/search-suggest`, {
//         params: {
//             input: text,
//         },
//     });
// }



export const nearbyPlaces = async (lat, lng, maxResultCount = 20, pageToken = null) => {
    const params = {
        latitude: lat,
        longitude: lng,
        radius: 10000,
        maxResultCount,
        includedTypes: "lodging",
    };
    if (pageToken) {
        params.pageToken = pageToken;
    }
    return await https_places.get(`/nearby-search`, { params });
};

export const Restro = async (lat, lng) => {
    return await https_places.get(`/nearby-search`, {
        params: {
            latitude: lat,
            longitude: lng,
            radius: 10000,
            maxResultCount: 10,
            includedTypes: "restaurant",
        },
    });
};

export const IconicPlaces = async (lat, lng) => {
    return await https_places.get(`/nearby-search`, {
        params: {
            latitude: lat,
            longitude: lng,
            radius: 10000,
            maxResultCount: 10,
            includedTypes: "tourist_attraction",
        },
    });
};
export const GetSerpHotelDetail = async (q, checkin, checkout, adults, currency = "USD") => {
    return await https_places.get(`/serp-hotel`, {
        params: {
            q,
            check_in_date: checkin,
            check_out_date: checkout,
            adults,

            currency,
        },
    });
};
export const GetAiModal = async (q) => {
    return await https_places.get(`/serp-ai-modal`, {
        params: {
            q
        },
    });
}

// SerpAPI Google Flights wrapper via internal Next.js API
export const GetSerpFlights = async ({
    engine = "google_flights",
    departure_id,
    arrival_id,
    outbound_date,
    return_date,
    currency = "USD",
    type = "1",
    travel_class = 1,
    adults = 1,
    children = 0,
    infants_on_lap = 0,
}) => {
    const params = {
        engine,
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        currency,
        type,
        travel_class,
        adults,
    };
    if (Number(children) > 0) params.children = Number(children);
    if (Number(infants_on_lap) > 0) params.infants_on_lap = Number(infants_on_lap);
    return await https_places.get(`/serp-flight`, { params });
};

// SerpAPI Google Flights booking options
// Accepts either a `booking_token` directly or a `departure_token`,
// in which case the API route will derive a booking token first.
export const GetSerpBookingOptions = async ({
    engine = "google_flights",
    departure_id,
    arrival_id,
    outbound_date,
    return_date,
    type = "1",
    booking_token,
    departure_token,
    adults = 1,
    children = 0,
    infants_on_lap = 0,
    travel_class,
    currency = "USD",
    multi_city_json,
    hl = "en",
}) => {
    // Build the payload
    // SerpAPI type: 1 = Round trip, 2 = One way, 3 = Multi-city
    const payload = {
        engine,
        type,
        currency,
        hl,
        departure_token,
        booking_token,
        adults: Number(adults) || 1,
    };
    if (Number(children) > 0) payload.children = Number(children);
    if (Number(infants_on_lap) > 0) payload.infants_on_lap = Number(infants_on_lap);
    if (travel_class != null && travel_class !== "") payload.travel_class = Number(travel_class);

    // Decide what kind of flight request it is
    if (multi_city_json && multi_city_json.length > 0) {
        payload.multi_city_json = multi_city_json;
    } else {
        // Single leg / round-trip
        payload.departure_id = departure_id;
        payload.arrival_id = arrival_id;
        payload.outbound_date = outbound_date;
        if (return_date) payload.return_date = return_date;
    }

    console.log(payload, "GetSerpBookingOptions payload");

    // Send POST request with JSON body
    return await https_places.post(`/serp-bookingoptions`, payload);
};


// ***********************************

export const GetHotel_Detail = async (id) => {
    return await https_places.get(`/place-details`, {
        params: {
            placeId: id,
        },
    });
}

// Combined resolver: place details + Xotelo search + pricing
export const GetHotelPlacePricing = async (placeId, chk_in, chk_out, currency = "USD") => {
    return await https_places.get(`/place-pricing`, {
        params: {
            placeId,
            chk_in,
            chk_out,
            currency,
        },
    });
}

export const Flight_AutoCompletion = async (q) => {
    return await https_places.get(`/flightautocomplete`, {
        params: {
            q,
        },
    });
}

