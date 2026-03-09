import axios from "axios";

// Only set headers that browsers allow. User-Agent is forbidden in browser XHR/fetch.
const commonHeaders = {
    "Accept": "application/json",
};

export const https_hotels = axios.create({
    baseURL: "https://justbuygear.com/justbuytravel_next/hotel-api/",
    headers: commonHeaders,
    transformResponse: [(data) => data],
});

const blogHeaders = { ...commonHeaders };
if (typeof window === 'undefined') {
    blogHeaders['User-Agent'] = 'JustBuyTravel/1.0 (https://justbuytravel.com)';
}
export const https_blog = axios.create({
    baseURL: "https://justbuytravel.in/wp-json/wp/v2",
    headers: blogHeaders,
    timeout: 20000,
});

export const https_api = axios.create({
    baseURL: "https://justbuygear.com/justbuytravel-api",
    headers: commonHeaders,
});

export const https_SearchCity = axios.create({
    baseURL: "https://justbuygear.com/justbuytravel-api",
    headers: commonHeaders,
});

// **************************
export const https_AutoCompletetion = axios.create({
    baseURL: "https://serpapi.com/",
    headers: commonHeaders,
});
// Internal API client for Next.js routes (e.g., Google Places text/nearby/place-details)
// Use an absolute URL on the server and a relative URL in the browser.
// When NEXT_PUBLIC_BASE_PATH is set, API routes are served under that path.
const isServer = typeof window === "undefined";
const siteBase =
    (isServer ? process.env.NEXT_PUBLIC_SITE_URL : undefined) || "http://localhost:3000";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const apiPrefix = basePath ? `${basePath}/api` : "/api";

export const https_places = axios.create({
    baseURL: isServer ? `${siteBase.replace(/\/$/, "")}${apiPrefix}` : apiPrefix,
    headers: commonHeaders,
});

