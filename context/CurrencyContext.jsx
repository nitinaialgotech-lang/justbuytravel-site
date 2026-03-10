"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CURRENCY_STORAGE_KEY = "justbuytravel_currency";

export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  INR: 83.12,
};

// ✅ Country → Currency mapping
const COUNTRY_CURRENCY_MAP = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AE: "AED",
  SA: "SAR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
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

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [rates, setRates] = useState(CURRENCY_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);

  // ✅ localStorage check karo, nahi toh country detect karo
  useEffect(() => {
    sessionStorage.clear()
    localStorage.clear()
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && stored.trim()) {
      setCurrencyState(stored.toUpperCase());
      return;
    }
    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const countryCode = data?.country_code;
        console.log("Detected country:", countryCode);
        const detectedCurrency = COUNTRY_CURRENCY_MAP[countryCode];
        if (detectedCurrency) {
          setCurrencyState(detectedCurrency);
        }
      } catch (e) {
        console.error("Country detect failed", e);
      }
    }

    detectCountry();
  }, []);

  // FX rates fetch
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
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((newCurrency) => {
    if (!newCurrency || typeof newCurrency !== "string") return;
    const upper = newCurrency.toUpperCase();
    setCurrencyState(upper);
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENCY_STORAGE_KEY, upper);
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