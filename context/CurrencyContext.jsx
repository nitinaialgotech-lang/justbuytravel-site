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

// Use internal API route to avoid CORS and "Failed to fetch" (proxies external FX APIs server-side)
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

// Currencies we have explicit conversion rates for.
// react-select-currency can return many more codes; for those we still
// allow selection but treat the rate as 1:1 with USD.
const SUPPORTED_RATE_CURRENCIES = Object.keys(CURRENCY_RATES);
const DEFAULT_CURRENCY = "USD";

const CurrencyContext = createContext(null);

function getInitialCurrency() {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (typeof stored === "string" && stored.trim()) {
    return stored.toUpperCase();
  }
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [rates, setRates] = useState(CURRENCY_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);

  useEffect(() => {
    setCurrencyState(getInitialCurrency());
  }, []);

  // Fetch dynamic FX rates (with graceful fallback to static defaults)
  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      try {
        const res = await fetch(FX_API_URL);
        if (!res.ok) return;
        const json = await res.json();
        if (!json?.rates || typeof json.rates !== "object") return;

        if (cancelled) return;

        // Merge server rates with our defaults so we always have at least the known ones
        setRates((prev) => ({
          ...prev,
          ...json.rates,
        }));
        setRatesLastUpdated(json.date || new Date().toISOString());
      } catch (e) {
        // eslint-disable-next-line no-console
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
      return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
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
    // only the currencies we have real FX rates for
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
