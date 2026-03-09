"use client";
import React, { useEffect, useRef, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { BiRadioCircle } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { format, differenceInDays } from "date-fns";
// import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import { FaUser } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";
import "../../style/searchresult.css";
import { FiSearch } from "react-icons/fi";
export default function HotelCheckOutSearch() {
  const [open, setOpen] = useState(false);
  const datePickerWrapperRef = useRef(null);
  // const [monthsShown, setMonthsShown] = useState(2)
  //
  const multiPassengerRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [travelClass, setTravelClass] = useState("Economy");
  const [calendarOpen, setCalendarOpen] = useState(false);
  // const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAge, setChildrenAge] = useState([0]);
  //  *********************************************************************
  const [calendarKey, setCalendarKey] = useState(0); // force rerender
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
  const [monthsShown, setMonthsShown] = useState(2);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openToDate, setOpenToDate] = useState(null);
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
  const handleRangeChange = (value) => {
    const start = Array.isArray(value) ? value[0] : value;
    const end = Array.isArray(value) ? value[1] : null;
    if (!start) return;

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
      // Second click = user chose check-out
      setEndDate(start);
      setSearchCheckin(format(startDate, "yyyy-MM-dd"));
      setSearchCheckout(format(start, "yyyy-MM-dd"));
      setCalendarOpen(false);
      return;
    }

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
  const minSelectableDate =
    selectionPhaseRef.current === "start"
      ? new Date()
      : startDate
        ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date();
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const economy = [
    {
      eco_name: "Economy",
      id: "1",
    },
    {
      eco_name: "Premium Economy",
      id: "2",
    },
    {
      eco_name: "Business Class",
      id: "3",
    },
    {
      eco_name: "First Class",
      id: "4",
    },
  ];
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
  const [adultOptions, setAdultoption] = useState({
    adult: 1,
    child: 0,
    childage: [],
  });
  const childrenAgesString = adultOptions.childage.map((age) => age).join(",");
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

  return (
    <>
      <section
        className={`flight_detail_section  padding_bottom  padding_t20   `}
      >
        <div className="container mx-auto md-p0 p-0 ">
          <div
            className={`flight_chart_box_input bg-black h-12 custorm flight_home_path  bg-transparent   space-y-5`}
          >
            <div className="row m-0 ">
              <div className="viewhotel_from">
                <div className="sidebar_section">
                  <div className="  w-full">
                    <div className="search_box_input d-none d-lg-block w-full ">
                      <form className="mx-auto flex justify-between gap-2 block ">
                        <div className="header_input3   relative flex flex-1 gap-2 d-block">
                          {/* Leaving From */}
                          <div className="header_input header-search-in relative  ">
                            <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none icon_search">
                              <BiTargetLock />
                            </div>

                            <input
                              type="text"
                              placeholder="Destination"
                              className="block w-full bg-neutral-secondary-medium border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                            />
                          </div>
                        </div>
                        {/* Calendar********************************************* */}
                        <div
                          className="ta_dates_section checkin_search_calender   z-10"
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
                                e.key === "Enter" &&
                                setCalendarOpen(!calendarOpen)
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
                                    // 👇 show selected check-in month
                                    if (startDate) {
                                      setOpenToDate(startDate);
                                      setCalendarKey((prev) => prev + 1);
                                    }
                                  }}
                                >
                                  <span className="ta_date_label">
                                    Check-in
                                  </span>
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
                                  <span className="ta_date_label">
                                    Check-out
                                  </span>
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
                              <div className="ta_premium_calendar_wrapper flex">
                                <DatePicker
                                  key={calendarKey}
                                  className="ta_premium_calendar"
                                  selected={startDate}
                                  onChange={handleRangeChange}
                                  startDate={startDate}
                                  endDate={endDate}
                                  selectsRange
                                  minDate={minSelectableDate}
                                  monthsShown={monthsShown}
                                  inline
                                  openToDate={openToDate}
                                  calendarClassName="ta_premium_calendar"
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
                              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 ${
                                showPassengerDropdown
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                              size={18}
                            />

                            {/*........................................ Dropdown ........................................ */}
                            <div
                              className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 
                                                    rounded-xl shadow-2xl transition-all duration-300 ease-out origin-top z-50 pt-3
                                                    ${
                                                      showPassengerDropdown
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
                                      setPassengerCount((c) =>
                                        Math.min(9, c + 1),
                                      )
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
                                      (setChildrenCount((c) =>
                                        Math.max(0, c - 1),
                                      ),
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
                                      (setChildrenCount((c) =>
                                        Math.min(9, c + 1),
                                      ),
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
                        <div className="search_button button_check relative d-block">
                          <button className="button_bg  flex bg-color-green justify-center items-center gap-1">
                            <span>
                              <FiSearch />
                            </span>
                            Search
                          </button>
                        </div>

                        {/* From****************************************** / To Section */}
                        {/* Calendar */}

                        {/* From / To Section */}

                        {/* *********** */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
