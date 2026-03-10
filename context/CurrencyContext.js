"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CURRENCY_STORAGE_KEY = "justbuytravel_currency";
const CURRENCY_MANUAL_KEY = "justbuytravel_currency_manual";

export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  INR: 83.12,
};

const basePath =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BASE_PATH) || "";
const FX_API_URL =
  `${basePath}/api/fx-rates`.replace(/\/+/g, "/") || "/api/fx-rates";

export const CURRENCY_LABELS = {
  USD: { symbol: "$", code: "USD", name: "US Dollar" },
  EUR: { symbol: "€", code: "EUR", name: "Euro" },
  GBP: { symbol: "£", code: "GBP", name: "British Pound" },
  AED: { symbol: "د.إ", code: "AED", name: "UAE Dirham" },
  SAR: { symbol: "﷼", code: "SAR", name: "Saudi Riyal" },
  INR: { symbol: "₹", code: "INR", name: "Indian Rupee" },
};

const SUPPORTED_RATE_CURRENCIES = Object.keys(CURRENCY_RATES);
const DEFAULT_CURRENCY = "USD";
const CurrencyContext = createContext(null);

function detectCurrencyFromBrowser() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("Browser Timezone:", timezone);
    if (timezone.includes("Calcutta") || timezone.includes("Kolkata")) return "INR";
    if (timezone.includes("Dubai") || timezone.includes("Abu_Dhabi")) return "AED";
    if (timezone.includes("Riyadh") || timezone.includes("Arabia")) return "SAR";
    if (timezone.includes("London")) return "GBP";
    if (timezone.includes("New_York") || timezone.includes("Chicago") || timezone.includes("Los_Angeles")) return "USD";
    if (timezone.includes("Paris") || timezone.includes("Berlin") || timezone.includes("Rome") || timezone.includes("Madrid") || timezone.includes("Amsterdam")) return "EUR";
  } catch (e) {
    console.error("Timezone detect failed", e);
  }
  return null;
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [rates, setRates] = useState(CURRENCY_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CURRENCY_STORAGE_KEY); // ✅ purana clear

    const stored = sessionStorage.getItem(CURRENCY_STORAGE_KEY); // ✅ session
    if (stored && stored.trim()) {
      setCurrencyState(stored.toUpperCase());
      return;
    }

    // Detect from timezone
    const detected = detectCurrencyFromBrowser();
    if (detected) setCurrencyState(detected);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CURRENCY_STORAGE_KEY);
    sessionStorage.removeItem(CURRENCY_STORAGE_KEY);

    // Har baar fresh detect karo
    const detected = detectCurrencyFromBrowser();
    if (detected) setCurrencyState(detected);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadRates() {
      try {
        const res = await fetch(FX_API_URL);
        if (!res.ok) return;
        const json = await res.json();
        if (!json?.rates || typeof json.rates !== "object") return;
        if (cancelled) return;
        setRates((prev) => ({ ...prev, ...json.rates }));
        setRatesLastUpdated(json.date || new Date().toISOString());
      } catch (e) {
        console.error("Failed to load FX rates, using static defaults", e);
      }
    }
    loadRates();
    return () => { cancelled = true; };
  }, []);

  // const setCurrency = useCallback((newCurrency) => {
  //   if (!newCurrency || typeof newCurrency !== "string") return;
  //   const upper = newCurrency.toUpperCase();
  //   setCurrencyState(upper);
  //   if (typeof window !== "undefined") {
  //     sessionStorage.setItem(CURRENCY_STORAGE_KEY, upper);
  //     sessionStorage.setItem(CURRENCY_MANUAL_KEY, "true");
  //     localStorage.removeItem(CURRENCY_STORAGE_KEY);
  //     localStorage.removeItem(CURRENCY_MANUAL_KEY);
  //   }
  // }, []);
  const setCurrency = useCallback((newCurrency) => {
    if (!newCurrency || typeof newCurrency !== "string") return;
    const upper = newCurrency.toUpperCase();
    setCurrencyState(upper);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CURRENCY_STORAGE_KEY, upper); // ✅ session
      localStorage.removeItem(CURRENCY_STORAGE_KEY); // ✅ local clear
    }
  }, []);

  const formatPrice = useCallback(
    (amountUsd, options = {}) => {
      if (amountUsd == null || typeof amountUsd !== "number") return "";
      const rate = rates[currency] ?? rates.USD ?? 1;
      const value = amountUsd * rate;
      const { symbol } = CURRENCY_LABELS[currency] ?? { symbol: currency };
      const { decimals = 2 } = options;
      return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    },
    [currency, rates],
  );

  const convertFromUsd = useCallback(
    (amountUsd) => {
      if (amountUsd == null || typeof amountUsd !== "number") return 0;
      return amountUsd * (rates[currency] ?? rates.USD ?? 1);
    },
    [currency, rates],
  );

  const value = {
    currency,
    setCurrency,
    formatPrice,
    convertFromUsd,
    rates,
    ratesLastUpdated,
    supportedCurrencies: SUPPORTED_RATE_CURRENCIES,
    currencyLabels: CURRENCY_LABELS,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}