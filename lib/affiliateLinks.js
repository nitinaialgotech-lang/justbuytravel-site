import moment from "moment";

/**
 * Affiliate link builders for OTAs (Travelpayouts tp.media)
 * marker=620562, trs=404603 are your affiliate params
 */
const AFFILIATE_BASE = "https://tp.media/r";
const MARKER = "620562";
const TRS = "404603";
const BOOKING_AID = "818288";
const BOOKING_LABEL = "affnetcj-11916287_pub-5108952_site-101601019_pname-Go+Travel+Un+Limited";

const cabinClassMap = {
  1: "ECONOMY",
  2: "PREMIUM_ECONOMY",
  3: "BUSINESS",
  4: "FIRST",
};

function wrapAffiliate(baseUrl, params) {
  const q = new URLSearchParams({
    campaign_id: params.campaignId,
    marker: MARKER,
    p: params.partnerId,
    trs: TRS,
    u: baseUrl,
    ...(params.subId && { sub_id: params.subId }),
  }).toString();
  return `${AFFILIATE_BASE}?${q}`;
}

/**
 * Build OTA URLs from search params
 * @param {Object} opts - { dep, arr, outboundDate, returnDate, adults, travelClass, tripType }
 */
export function buildAffiliateLinks(opts) {
  const dep = (opts.dep || "IXC").toUpperCase();
  const arr = (opts.arr || "DEL").toUpperCase();
  const depLower = dep.toLowerCase();
  const arrLower = arr.toLowerCase();
  const outD = opts.outboundDate || "2026-02-21";
  const retD = opts.returnDate || "";
  const adults = Math.max(1, parseInt(opts.adults, 10) || 1);
  const children = Math.max(0, parseInt(opts.children, 10) || 0);
  const infants = Math.max(0, parseInt(opts.infants, 10) || parseInt(opts.infants_on_lap, 10) || 0);
  const cabin = cabinClassMap[opts.travelClass] || "ECONOMY";
  const isRound = opts.tripType === 1 || opts.tripType === "1";

  const m = moment(outD);
  const dd = m.format("DD");
  const mm = m.format("MM");
  const yyyy = m.format("YYYY");
  const slashDate = `${mm}/${dd}/${yyyy}`;
  const slashDateEnc = encodeURIComponent(slashDate);

  const links = [];

  // Traveloka: ap=IXC.DEL, dt=21-2-2026.NA (one-way) or 21-2-2026.25-2-2026 (round), ps=adults.children.infants
  const travelokaDt = retD && isRound
    ? `${dd}-${parseInt(mm, 10)}-${yyyy}.${moment(retD).format("DD-M-YYYY")}`
    : `${dd}-${parseInt(mm, 10)}-${yyyy}.NA`;
  const travelokaUrl = `https://www.traveloka.com/en-en/flight/fullsearch?ap=${dep}.${arr}&dt=${travelokaDt}&funnelSource=SEO-Default-SearchForm&ps=${adults}.${children}.${infants}&sc=${cabin}`;
  links.push({
    name: "Traveloka",
    logo: "/logo/hoteldetail/travelok.svg",
    url: wrapAffiliate(travelokaUrl, { campaignId: "632", partnerId: "9048" }),
    priceOffset: -0.02,
  });

  // Aviasales: /search/IXC2102DEL1 (dep+DD+MM+arr+adults) - uses total paying passengers
  const aviasalesAdults = adults + children;
  const aviasalesUrl = `https://www.aviasales.in/search/${dep}${dd}${mm}${arr}${aviasalesAdults || 1}`;
  links.push({
    name: "Aviasales",
    logo: "/logo/hoteldetail/aviasales.png",
    url: wrapAffiliate(aviasalesUrl, { campaignId: "100", partnerId: "4114" }),
    priceOffset: 0.01,
  });

  // Expedia: leg1 with from, to, departure, passengers=adults:X,children:Y,infantinlap:Y/N
  const expediaLegEnc = encodeURIComponent(`from:${dep},to:${arr},departure:${slashDate}TANYT,fromType:U,toType:AIRPORT`);
  const expediaPassengers = `adults%3A${adults}%2Cchildren%3A${children}%2Cinfantinlap%3A${infants > 0 ? "Y" : "N"}`;
  const expediaUrlFinal = `https://www.expedia.com/Flights-Search?d1=${yyyy}-${parseInt(mm, 10)}-${dd}&flight-type=on&fromDate=${slashDateEnc}&leg1=${expediaLegEnc}&mode=search&options=cabinclass%3Aeconomy&passengers=${expediaPassengers}&trip=oneway`;
  links.push({
    name: "Expedia",
    logo: "/logo/hoteldetail/expedia_logo.svg",
    url: wrapAffiliate(expediaUrlFinal, { campaignId: "594", partnerId: "8645" }),
    priceOffset: 0.03,
  });

  // Booking.com: keep params strict/valid so provider can resolve results reliably.
  const bookingChildren = children > 0 ? Array(children).fill("8").join(",") : "";
  const bookingFromName = opts.fromLocationName || `${dep} Airport`;
  const bookingToName = opts.toLocationName || `${arr} Airport`;
  const bookingParams = new URLSearchParams({
    type: isRound && retD ? "ROUNDTRIP" : "ONEWAY",
    adults: String(adults),
    cabinClass: cabin,
    children: bookingChildren,
    from: `${dep}.AIRPORT`,
    to: `${arr}.AIRPORT`,
    fromCountry: "IN",
    toCountry: "IN",
    fromLocationName: bookingFromName,
    toLocationName: bookingToName,
    depart: outD,
    sort: "BEST",
    travelPurpose: "leisure",
    ca_source: "flights_search_sb",
  });
  if (isRound && retD) bookingParams.set("return", retD);
  const bookingUrl = `https://flights.booking.com/flights/${dep}.AIRPORT-${arr}.AIRPORT/?${bookingParams.toString()}`;
  const bookingDirectUrl = `${bookingUrl}&aid=${BOOKING_AID}&label=${BOOKING_LABEL}&utm_source=affnetcj&utm_medium=bannerindex&utm_campaign=xx&utm_term=index-11916287`;
  links.push({
    name: "Booking.com",
    logo: "/logo/hoteldetail/Booking.com_logo.svg.png",
    url: bookingDirectUrl,
    priceOffset: -0.01,
  });

  // Trip.com: quantity = adults + children (infants on lap typically don't add to quantity)
  const tripQuantity = adults + children || 1;
  const tripType = isRound && retD ? "rt" : "ow";
  const tripUrl = `https://www.trip.com/flights/showfarefirst?acity=${arrLower}&class=y&curr=INR&dcity=${depLower}&ddate=${outD}&locale=en-XX&lowpricesource=searchform&nonstoponly=off&quantity=${tripQuantity}&rdate=${retD || outD}&searchboxarg=t&triptype=${tripType}`;
  links.push({
    name: "Trip.com",
    logo: "/logo/hoteldetail/tripcom.webp",
    url: wrapAffiliate(tripUrl, { campaignId: "121", partnerId: "8980" }),
    priceOffset: 0.02,
  });

  return links;
}
