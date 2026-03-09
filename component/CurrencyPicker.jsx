"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { IoPricetag } from "react-icons/io5";

export default function CurrencyPicker() {
  const { currency, setCurrency, supportedCurrencies, currencyLabels } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCodes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return supportedCurrencies;
    return supportedCurrencies.filter((code) => {
      const label = currencyLabels[code];
      const text = `${code} ${label?.name ?? ""} ${label?.symbol ?? ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [search, supportedCurrencies, currencyLabels]);

  const currentLabel = currencyLabels[currency];

  return (
    <>
      <button
        type="button"
        className="d-flex align-items-center gap-2 border-0 bg-transparent p-0"
        onClick={() => setOpen(true)}
      >
        {/* <IoPricetag className={`${open ? "g_color" : ""} `} /> */}
        <span className={`${open ? "g_color" : ""} currency`}>
          {currentLabel
            ? `${currentLabel.symbol} ${currentLabel.code} `
            : currency}
        </span>
      </button>

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded p-3"
            style={{ maxWidth: 400, width: "90%", maxHeight: "70vh", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Select a Currency</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              />
            </div>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search for a currency"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
              {filteredCodes.map((code) => {
                const label = currencyLabels[code];
                return (
                  <button
                    key={code}
                    type="button"
                    className={`w-100 p-2 text-start btn btn-sm mb-1 ${code === currency ? "bg-color-green text-white" : "btn-light"
                      }`}
                    onClick={() => {
                      setCurrency(code);
                      setOpen(false);
                    }}
                  >
                    {label
                      ? `${label.symbol} ${label.code} - ${label.name}`
                      : code}
                  </button>
                );
              })}
              {filteredCodes.length === 0 && (
                <div className="text-muted small">No currencies found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}