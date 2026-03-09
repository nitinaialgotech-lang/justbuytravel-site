"use client";
import React, { useEffect, useState } from "react";
import { VscArrowSwap } from "react-icons/vsc";
import { BiRadioCircle } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { FaUser } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  resetSearchFlight,
  SetFlightType,
  Setpassen_count,
  SetPassengers,
  setSearchFlight,
  SetTravelClass,
} from "@/Components/Redux/Reducer";
import { Flight_AutoCompletion } from "@/app/Route/endpoints";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";
import Flight_MultiCity_Input from "./Flight_MultiCity_Input";
import { addDays } from "date-fns";
// **************************************************************
export default function Flight_Search_Input({ Tabin }) {
  const dispatch = useDispatch();
  const [from, setFrom] = useState("");
  const [fr, setFr] = useState("");
  const [dayto, setdayTo] = useState("");
  const router = useRouter();
  const [to, setTo] = useState("");
  const [range, setRange] = useState();
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [typed, setType] = useState(2);
  const [showToDropdown, setShowToDropdown] = useState(false);
  // ****************
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showFrom, setShowFrom] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const passengerRef = useRef(null);
  // ************************************
  const q = from;
  const qTo = to;
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [travelClass, setTravelClass] = useState("Economy");
  const [travelId, setTravelClassId] = useState(1);
  // *******************************
  const departure_id = useSelector(
    (state) => state.user.SearchFlight.startfrom,
  );
  const start_date = useSelector((state) => state.user.SearchFlight.startDate);
  const back_date = useSelector((state) => state.user.SearchFlight.endDate);
  const arrival_id = useSelector((state) => state.user.SearchFlight.endto);
  const checkType = useSelector((state) => state?.user?.type) ?? 2;
  const passen_count = useSelector((state) => state?.user?.passen_count);
  const children_count = useSelector((state) => state?.user?.children_count);
  const infant_count = useSelector((state) => state?.user?.infant_count);
  const reduxTravelClass = useSelector((state) => state?.user?.travelClass);

  const pathname = usePathname();

  // Sync local typed with Redux checkType (handles rehydration + ensures a radio is always marked)
  useEffect(() => {
    if (checkType != null) setType(Number(checkType));
  }, [checkType]);
  // Sync passenger count and travel class from Redux (e.g. when on flight-details)
  useEffect(() => {
    if (passen_count != null && passen_count !== "") {
      const n = parseInt(passen_count, 10);
      if (!isNaN(n) && n >= 1) setPassengerCount(n);
    }
  }, [passen_count]);
  useEffect(() => {
    if (children_count != null && children_count !== "") {
      const n = parseInt(children_count, 10);
      if (!isNaN(n) && n >= 0) setChildrenCount(n);
    }
  }, [children_count]);
  useEffect(() => {
    if (infant_count != null && infant_count !== "") {
      const n = parseInt(infant_count, 10);
      if (!isNaN(n) && n >= 0) setInfantCount(n);
    }
  }, [infant_count]);
  useEffect(() => {
    if (reduxTravelClass != null) {
      const id = Number(reduxTravelClass) || 1;
      setTravelClassId(id);
      const names = {
        1: "Economy ",
        2: "Premium Economy",
        3: "Business Class",
        4: "First Class",
      };
      setTravelClass(names[id] || "Economy ");
    }
  }, [reduxTravelClass]);
  // *********************
  const handlePassengerToggle = () => {
    setShowPassengerDropdown((prev) => !prev);
    setShowClassDropdown(false);
  };

  const formatted =
    range?.from && range?.to
      ? `${format(range.from, "EEE, MMM d")} - ${format(
        range.to,
        "EEE, MMM d",
      )}`
      : "";

  // Fetch autocomplete results for departure airport
  const { data: autoCompleteData, isLoading } = useQuery({
    queryKey: ["flight_autoComplete", q],
    queryFn: () => Flight_AutoCompletion(q),
    enabled: !!q && q.trim().length > 1,
    staleTime: 30000,
  });

  const autoDropdownData = autoCompleteData?.data?.suggestions || [];

  // Fetch autocomplete results for destination airport
  const { data: autoCompleteToData, isLoading: isLoadingTo } = useQuery({
    queryKey: ["flight_autoComplete_to", qTo],
    queryFn: () => Flight_AutoCompletion(qTo),
    enabled: !!qTo && qTo.trim().length > 1,
    staleTime: 30000,
  });

  const autoToDropdownData = autoCompleteToData?.data?.suggestions || [];

  // ******************************** formik & yup

  const formik = useFormik({
    initialValues: {
      From: "",
      To: "",
      range: null,
      // EndDate: range?.to,
    },
    validationSchema: yup.object({
      From: yup.string().required("This Field is Reaquired !!!"),
      To: yup.string().required("This Field is Reaquired !!!"),
      range: yup
        .mixed()
        .required("Please select a date")
        .test("valid-date", "Please select a date", function (value) {
          if (!value) return false;
          const t = typed;
          if (t === 2 || t === 3)
            return !!(value?.from || value instanceof Date);
          if (t === 1) return !!(value?.from && value?.to);
          return !!value?.from;
        }),
    }),
    onSubmit: () => {
      dispatch(
        setSearchFlight({
          startfrom: from,
          endto: to,
          // startDate: range?.from,
          startDate: range instanceof Date ? range : range?.from,
          endDate: range?.to,
          passen_count: String(passengerCount),
          children_count: String(childrenCount),
          infant_count: String(infantCount),
          type: typed,
          travelClass: String(travelId),
          triggerSearch: true,
        }),
      );
      router.push("/flight-details");
    },
  });
  // ***************** unset redux

  // useEffect(() => {
  //   if (pathname === "/flight") {
  //     dispatch(resetSearchFlight());
  //   }
  // }, [pathname]);
  // useEffect(() => {
  //   if (departure_id) {
  //     setFrom(departure_id);
  //     formik.setFieldValue("From", departure_id);
  //   }

  //   if (arrival_id) {
  //     setTo(arrival_id);
  //     formik.setFieldValue("To", arrival_id);
  //   }

  //   if (start_date) {
  //     if (typed === 1 && back_date) {
  //       setRange({
  //         from: new Date(start_date),
  //         to: new Date(back_date),
  //       });

  //       formik.setFieldValue("range", {
  //         from: new Date(start_date),
  //         to: new Date(back_date),
  //       });
  //     } else {
  //       setRange(new Date(start_date));
  //       formik.setFieldValue("range", new Date(start_date));
  //     }
  //   }
  // }, [departure_id, arrival_id, start_date, back_date]);
  useEffect(() => {
    if (departure_id) {
      setFrom(departure_id);
      formik.setFieldValue("From", departure_id);
    }

    if (arrival_id) {
      setTo(arrival_id);
      formik.setFieldValue("To", arrival_id);
    }

    if (start_date) {
      // Round Trip
      if (typed === 1 && back_date) {
        const newRange = {
          from: new Date(start_date),
          to: new Date(back_date),
        };

        setRange(newRange);
        formik.setFieldValue("range", newRange);
      }

      // One Way
      else {
        const newDate = new Date(start_date);

        setRange(newDate);
        formik.setFieldValue("range", newDate);
      }
    }
  }, [departure_id, arrival_id, start_date, back_date, typed]);

  // ************************************************
  const formatPassengerLabel = () => {
    const parts = [];
    if (passengerCount > 0)
      parts.push(`${passengerCount} Adult${passengerCount > 1 ? "s" : ""}`);
    if (childrenCount > 0)
      parts.push(`${childrenCount} Child${childrenCount > 1 ? "ren" : ""}`);
    if (infantCount > 0)
      parts.push(`${infantCount} Infant${infantCount > 1 ? "s" : ""}`);
    return parts.length ? parts.join(", ") : "1 Adult";
  };

  const whatType = [
    {
      id: 2,
      name: "One Way",
    },
    {
      id: 1,
      name: "Round Trip",
    },
    {
      id: 3,
      name: "Multi-city",
    },
  ];
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
  console.log(travelClass, "..................");
  // **************************************************************************
  const UpdateFlight_Detail = () => {
    dispatch(
      setSearchFlight({
        startfrom: departure_id,
        endto: arrival_id,
        startDate: start_date,
        endDate: back_date,
      }),
    );
  };
  // ******************************************
  const calendarRef = useRef(null);
  const classRef = useRef(null);
  const multiPassengerRef = useRef(null);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !multiPassengerRef.current?.contains(e.target) &&
        !passengerRef.current?.contains(e.target)
      ) {
        setShowPassengerDropdown(false);
      }
      if (classRef.current && !classRef.current.contains(e.target)) {
        setShowClassDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log(
    typed,
    ".......................>>>>>>>>>>>>>>>>",
    autoCompleteData,
  );
  // **************************************
  const allAirports = autoDropdownData
    .filter((item) => Array.isArray(item.airports))
    .flatMap((item) => item.airports);
  const allAirPortsTO = autoToDropdownData
    .filter((item) => Array.isArray(item.airports))
    .flatMap((item) => item.airports);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  console.log(fr, to, "tPPPPPppppppppppppppppppppppppppppppppppppp");
  const today = new Date();
  const selectionPhaseRef = useRef("start");
  // *******************************************************
  const [month, setMonth] = useState(new Date());
  // Calendar open → show previous selection
  const handleOpenCalendar = () => {
    setOpen(true);
    selectionPhaseRef.current = "start";
  };

  useEffect(() => {
    if (open) {
      // setRange(range ? new Date(range) : null)
      selectionPhaseRef.current = "start";
      if (range?.from && range?.to) {
        setRange({
          from: new Date(range.from),
          to: new Date(range.to),
        });
      } else if (range?.from) {
        const start = addDays(new Date(range.from), 3);
        setRange({ from: new Date(start), to: addDays(start, 1) });
      }

      // selectionPhaseRef.current = "end"
    }
  }, [open]);

  const handleRoundTripSelect = (rangeDate, selectedDay) => {
    const pickedDay = selectedDay ?? rangeDate?.to ?? rangeDate?.from;
    if (!pickedDay) return;

    const clickedDay = new Date(
      pickedDay.getFullYear(),
      pickedDay.getMonth(),
      pickedDay.getDate(),
    );
    const todayDate = new Date();
    const todayStart = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate(),
    );

    if (clickedDay < todayStart) return;

    // First click always starts a fresh round-trip so departure can be changed forward/backward.
    // if (selectionPhaseRef.current === "start") {
    //   const newRange = { from: clickedDay, to: undefined };
    //   setRange(newRange);
    //   formik.setFieldValue("range", null);
    //   selectionPhaseRef.current = "end";
    //   return;
    // }
    if (selectionPhaseRef.current === "start") {
      const nextDay = addDays(clickedDay, 1);

      const newRange = { from: clickedDay, to: nextDay };
      setRange(newRange);
      formik.setFieldValue("range", newRange);

      // 👇 agar next day next month me hai to calendar shift karo
      if (clickedDay.getMonth() !== nextDay.getMonth()) {
        setMonth(nextDay);
      }

      selectionPhaseRef.current = "end";
      return;
    }

    const currentFrom = range?.from
      ? new Date(
        range.from.getFullYear(),
        range.from.getMonth(),
        range.from.getDate(),
      )
      : clickedDay;

    // If user clicks an earlier/same day while selecting return, treat it as a new departure.
    if (clickedDay <= currentFrom) {
      const restartRange = { from: clickedDay, to: undefined };
      setRange(restartRange);
      formik.setFieldValue("range", null);
      selectionPhaseRef.current = "end";
      return;
    }

    const finalRange = { from: currentFrom, to: clickedDay };
    setRange(finalRange);
    formik.setFieldValue("range", finalRange);
    setOpen(false);
    selectionPhaseRef.current = "start";
  };

  // *****************************
  const getMinSelectableDate = () => {
    const today = new Date();

    // first click → start date select
    if (selectionPhaseRef.current === "start") {
      return today;
    }

    // second click → end date select
    if (selectionPhaseRef.current === "end" && range?.from) {
      const nextDay = new Date(range.from);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }

    return today;
  };
  console.log(range, "range..............................");
  return (
    <section
      className={`flight_detail_section  ${pathname !== "/" ? "padding_bottom" : ""} ${pathname === "/flights" ? "padding_t20" : ""} ${Tabin === "flights" ? "padding_t20 pb-0" : ""} `}
    >
      <div className="container mx-auto md-p0 p-0 ">
        <div
          className={`flight_chart_box_input bg-white custorm ${pathname !== "/" ? "" : " "} ${pathname === "/flights" ? "" : "flight_home_path"} ${Tabin === "flights" ? "bg-transparent" : ""}    space-y-5`}
        >
          <div className="row m-0 ">
            <div
              className={`header_input_head space-y-4 ${Tabin === "flights" ? "p-0" : ""}`}
            >
              <div className="header_title m-0">
                <div className="content flex flex-wrap items-center gap-3 md:gap-5">
                  <div className="item flex items-center gap-2">
                    {/* <div className="relative">
                      <span>
                        <VscArrowSwap />
                      </span>
                    </div> */}
                    {/* *****************************************************************   typexxxxxxxxxxxxxxxx */}
                    <div className="type_item flex gap-3">
                      {whatType?.map((item) => {
                        const isChecked = Number(typed) === Number(item?.id);
                        return (
                          <div className="type" key={item?.id}>
                            <label
                              className="flex items-center cursor-pointer gap-2"
                              onClick={() => {
                                setType(Number(item?.id));
                                // dispatch(SetFlightType(item?.id));
                              }}
                            >
                              <span
                                className={`trip-radio-dot ${isChecked ? "trip-radio-dot-checked" : ""}`}
                                role="presentation"
                              />
                              <input
                                type="radio"
                                name="tripType"
                                value={Number(item?.id)}
                                checked={isChecked}
                                onChange={() => {
                                  setType(Number(item?.id));
                                  setRange();
                                  // dispatch(SetFlightType(item?.id));
                                }}
                                onClick={() => setRange(null)}
                                onMouseDown={() => setRange()}
                                className="sr-only"
                              />
                              <span>{item?.name}</span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* *****************************************************************   adult show if Multi-city  xxxxxxxxxxxxxxxxx */}
                  <div
                    className={`item relative ${typed === 3 ? "d-block" : "d-none"}`}
                    ref={multiPassengerRef}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassengerDropdown((prev) => !prev);
                        setShowClassDropdown(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer select-none bg-transparent border-0 p-0 text-inherit hover:opacity-80 transition-opacity"
                    >
                      <FaUser />

                      <span>{formatPassengerLabel()}</span>

                      <FiChevronDown
                        className={`shrink-0 transition-transform duration-300 ease-out ${showPassengerDropdown ? "rotate-180" : "rotate-0"
                          }`}
                        size={18}
                      />
                    </button>

                    {showPassengerDropdown && (
                      <div className="absolute left-0 top-10 z-20 pt-3  min-w-[220px] bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-300 ease-out origin-top">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600 text-height">
                            Adults <br></br>{" "}
                            <span className="ft-sm">(12+ yrs)</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setPassengerCount((c) => {
                                  const next = Math.max(1, c - 1);
                                  if (infantCount > next) setInfantCount(next);
                                  return next;
                                })
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                            >
                              –
                            </button>
                            <span className="text-center font-medium min-w-[20px]">
                              {passengerCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setPassengerCount((c) => Math.min(9, c + 1))
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600 text-height">
                            Children <br></br>{" "}
                            <span className="ft-sm">(2–11 yrs) </span>{" "}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setChildrenCount((c) => Math.max(0, c - 1))
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                            >
                              –
                            </button>
                            <span className="text-center font-medium min-w-[20px]">
                              {childrenCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setChildrenCount((c) => Math.min(9, c + 1))
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600 text-height">
                            Infants <br></br>{" "}
                            <span className="ft-sm"> (under 2)</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setInfantCount((c) => Math.max(0, c - 1))
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                            >
                              –
                            </button>
                            <span className="text-center font-medium min-w-[20px]">
                              {infantCount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setInfantCount((c) =>
                                  Math.min(passengerCount, c + 1),
                                )
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <p className="px-4 pb-2 pt-3 text-xs text-gray-500 m-0">
                          Max 1 infant per adult
                        </p>
                        <div className="px-4 pb-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPassengerDropdown(false);
                              dispatch(
                                SetPassengers({
                                  adults: passengerCount,
                                  children: childrenCount,
                                  infants: infantCount,
                                }),
                              );
                            }}
                            className="w-full bg-brand text-black py-2 text-sm bg-color-green rounded font-medium hover:opacity-90 transition"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ***************************************************************** economy  Class Type*/}
                  <div className="item relative" ref={classRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowClassDropdown((prev) => !prev);
                        setShowPassengerDropdown(false);
                      }}
                      className="flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 text-inherit"
                    >
                      <span className="whitespace-nowrap">{travelClass}</span>
                      <FiChevronDown
                        className={`shrink-0 transition-transform duration-300 ease-out ${showClassDropdown ? "rotate-180" : "rotate-0"
                          }`}
                        size={18}
                      />
                    </button>

                    {showClassDropdown && (
                      <div className="absolute left-0 top-10 z-20 px-3  pt-1 pb-4 bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-300 ease-out origin-top">
                        {economy?.map((item, index) => (
                          <div className="flex flex-col width-btn border-b border-gray-200 py-2">
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setTravelClass(item?.eco_name);
                                setTravelClassId(item?.id);
                                dispatch(SetTravelClass(item?.id));
                                setShowClassDropdown(false);
                                if (pathname == "/flight-details") {
                                  UpdateFlight_Detail();
                                }
                              }}
                              className="text-left text-eco  rounded-md  transition"
                            >
                              {item?.eco_name}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ************ */}
                </div>
              </div>
              {/* *****************************************************************   intput m,,,,,,,,,,,, */}
              <div
                className={`header_input_item flex flex-col md:flex-row gap-3 md:gap-4 ${typed === 3 ? "d-none" : ""}`}
              >
                {/* From input with autocomplete */}
                {/* ******************* without modal input show on desktop >>>>>>>>>>>> */}
                <div className="d-none d-lg-block">
                  <div className="header_input_1 relative HEADER_IN flex flex-1 gap-2">
                    <div className="header_input relative h-12">
                      <div className="icon   absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search ">
                        <BiRadioCircle />
                      </div>
                      <input
                        type="text"
                        name="From"
                        id="from"
                        value={formik.values.From || from}
                        placeholder="Leaving From"
                        className="block w-full  bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onChange={(e) => {
                          const value = e.target.value;
                          formik?.handleChange(e);
                          setFrom(value);
                          if (value.trim().length > 1) {
                            setShowDropdown(true);
                          } else {
                            setShowDropdown(false);
                          }
                        }}
                        onFocus={() => {
                          if (
                            from.trim().length > 1 &&
                            autoDropdownData.length
                          ) {
                            setShowDropdown(true);
                          }
                        }}
                        onBlur={() => {
                          // small delay so click/mousedown on an item still works
                          setTimeout(() => setShowDropdown(false), 150);
                        }}
                        aria-label="Leaving From"
                      />
                      {formik.touched.From && formik?.errors?.From && (
                        <p className="text-red-400  err_p mt-1 mb-1">
                          <span className="g_color">*</span>
                          {formik?.errors?.From}
                        </p>
                      )}
                      {/* *********************** auto dropdown data *********************** */}
                      {showDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                          {isLoading && allAirports.length === 0 ? (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              Loading airports...
                            </div>
                          ) : allAirports.length > 0 ? (
                            allAirports.map((airport, index) => (
                              <button
                                key={index}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setShowDropdown(false);
                                  setFrom(airport.id);
                                  formik?.setFieldValue("From", airport.id);
                                  setShow(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              >
                                <div className="text-sm font-medium text-gray-900">
                                  <strong>{airport.id} - </strong>
                                  {airport.name}
                                </div>

                                <div className="text-xs text-gray-500">
                                  City {airport.city}
                                </div>
                              </button>
                            ))
                          ) : from.trim().length > 1 ? (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              No airports found for "{from}"
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Swap icon */}
                    <div className="arrow absolute flex items-center justify-center inset-y-0 left-1/2 -translate-x-1/2">
                      <VscArrowSwap />
                    </div>

                    {/* To input (plain text) */}
                    <div className="header_input relative h-12 ">
                      <div className="icon absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search">
                        <IoLocationSharp />
                      </div>
                      <input
                        type="text"
                        name="To"
                        id="to"
                        className="block w-full h-full bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onChange={(e) => {
                          const value = e.target.value;
                          formik?.handleChange(e);
                          setTo(value);
                          if (value.trim().length > 1) {
                            setShowToDropdown(true);
                          } else {
                            setShowToDropdown(false);
                          }
                        }}
                        placeholder="Going to"
                        value={formik.values.To}
                        aria-label="Destination airport"
                        onFocus={() => {
                          if (
                            to.trim().length > 1 &&
                            autoToDropdownData.length
                          ) {
                            setShowToDropdown(true);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowToDropdown(false), 150);
                        }}
                      />
                      {formik.touched.To && formik?.errors?.To && (
                        <p className="text-red-400 err_p mt-1 mb-1">
                          <span className="g_color">*</span>
                          {formik?.errors?.To}
                        </p>
                      )}
                      {/* *********************** auto dropdown data for destination *********************** */}
                      {showToDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto drop_in">
                          {isLoadingTo && allAirPortsTO.length === 0 ? (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              Loading airports...
                            </div>
                          ) : allAirPortsTO.length > 0 ? (
                            allAirPortsTO.map((airport, index) => (
                              <button
                                key={index}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setShowDropdown(false);
                                  setTo(airport.id);
                                  formik?.setFieldValue("To", airport.id);
                                  setShowFrom(false);
                                  setShow(false)

                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              >
                                <div className="text-sm font-medium text-gray-900">
                                  <strong>{airport.id} - </strong>
                                  {airport.name}
                                </div>

                                <div className="text-xs text-gray-500">
                                  City {airport.city}
                                </div>
                              </button>
                            ))
                          ) : to.trim().length > 1 ? (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              No airports found for "{to}"
                            </div>
                          ) : null}
                          {/* 88888888888888888888888888 */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ********************  xxxxxxxxxxxxxxxxxxxx   show first  modal inpu twith show in modile view        >>>>>>>>>>>>> */}
                {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                <div className="d-block d-lg-none">
                  <div className="header_input_1 relative flex flex-1 gap-2">
                    <div className="header_input relative h-12">
                      <div className="icon   absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search ">
                        <BiRadioCircle />
                      </div>
                      <input
                        type="text"
                        name="From"
                        id="from"
                        value={from}
                        readOnly
                        placeholder="Leaving From"
                        className="block w-full  bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onClick={handleShow}
                        onBlur={() => {
                          // small delay so click/mousedown on an item still works
                          setTimeout(() => setShowDropdown(false), 150);
                        }}
                        aria-label="Leaving From"
                      />
                      {formik.touched.From && formik?.errors?.From && (
                        <p className="text-red-400 err_p mt-1 mb-1">
                          <span className="g_color">*</span>
                          {formik?.errors?.From}
                        </p>
                      )}
                      {/* ***************************** open dropdown input >>>>>>>>>>> */}
                      <Modal show={show} onHide={handleClose} fullscreen>
                        <Modal.Header closeButton>
                          <Modal.Title>Leaving From </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="header_input relative h-12">
                            <div className="icon   absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search ">
                              <BiRadioCircle />
                            </div>
                            <input
                              type="text"
                              name="From"
                              id="from"
                              value={from}
                              placeholder="Leaving From"
                              className="block w-full  bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                              onChange={(e) => {
                                const value = e.target.value;
                                formik?.handleChange(e);
                                setFrom(value);
                                if (value.trim().length > 1) {
                                  setShowDropdown(true);
                                } else {
                                  setShowDropdown(false);
                                }
                              }}
                              onFocus={() => {
                                if (
                                  from.trim().length > 1 &&
                                  autoDropdownData.length
                                ) {
                                  setShowDropdown(true);
                                }
                              }}
                              onBlur={() => {
                                // small delay so click/mousedown on an item still works
                                setTimeout(() => setShowDropdown(false), 150);
                              }}
                              aria-label="Leaving From"
                            />
                            {formik.touched.From && formik?.errors?.From && (
                              <p className="text-red-400 err_p mt-1 mb-1">
                                <span className="g_color">*</span>
                                {formik?.errors?.From}
                              </p>
                            )}
                            {/* *********************** modal dropdown  dropdown data *********************** */}
                            {showDropdown && (
                              <div className="absolute z-10 w-full  mt-1 bg-white border border-gray-200 rounded-lg shadow-xl  mobil_input_dropdown overflow-y-auto">
                                {isLoading ? (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    Loading airports...
                                  </div>
                                ) : allAirports.length > 0 ? (
                                  allAirports.map((airport, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowDropdown(false);
                                        setFrom(airport.id);
                                        formik?.setFieldValue(
                                          "From",
                                          airport.id,
                                        );
                                        setShow(false);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                      <div className="text-sm font-medium text-gray-900">
                                        <strong>{airport.id} - </strong>
                                        {airport.name}
                                      </div>

                                      <div className="text-xs text-gray-500">
                                        City {airport.city}
                                      </div>
                                    </button>
                                  ))
                                ) : from.trim().length > 1 ? (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No airports found for "{from}"
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </Modal.Body>
                      </Modal>
                      {/* *********************** auto dropdown data *********************** */}
                    </div>

                    {/* ********* SECOND INPU TOF MOBILE  */}

                    {/* Swap icon */}
                    <div className="arrow absolute flex items-center justify-center inset-y-0 left-1/2 -translate-x-1/2">
                      <VscArrowSwap />
                    </div>

                    {/* To input XXXXXXX second  (plain text) */}
                    <div className="header_input relative h-12 ">
                      <div className="icon absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search">
                        <IoLocationSharp />
                      </div>
                      <input
                        type="text"
                        name="To"
                        id="to"
                        value={to}
                        className="block w-full h-full bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onClick={() => setShowFrom(true)}
                        readOnly
                        placeholder="Going to"
                        aria-label="Destination airport"
                      />
                      {formik.touched.To && formik?.errors?.To && (
                        <p className="text-red-400 err_p mt-1 mb-1">
                          <span className="g_color">*</span>
                          {formik?.errors?.To}
                        </p>
                      )}
                      {/* ***************************** open dropdown input >>>>>>>>>>> */}
                      <Modal
                        show={showFrom}
                        onHide={() => setShowFrom(false)}
                        fullscreen
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Going To </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="header_input relative h-12">
                            <div className="icon   absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search ">
                              <BiRadioCircle />
                            </div>

                            <input
                              type="text"
                              name="To"
                              id="to"
                              className="block w-full h-full bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                              onChange={(e) => {
                                const value = e.target.value;
                                formik?.handleChange(e);
                                setTo(value);
                                if (value.trim().length > 1) {
                                  setShowToDropdown(true);
                                } else {
                                  setShowToDropdown(false);
                                }
                              }}
                              placeholder="Going to"
                              value={to}
                              aria-label="Destination airport"
                            />
                            {formik.touched.From && formik?.errors?.From && (
                              <p className="text-red-400 err_p mt-1 mb-1">
                                <span className="g_color">*</span>
                                {formik?.errors?.From}
                              </p>
                            )}
                            {/* *********************** modal dropdown  dropdown data *********************** */}
                            {showToDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto drop_in">
                                {isLoadingTo ? (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    Loading airports...
                                  </div>
                                ) : allAirPortsTO.length > 0 ? (
                                  allAirPortsTO.map((airport, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowDropdown(false);
                                        setTo(airport.id);
                                        formik?.setFieldValue("To", airport.id);
                                        setShowFrom(false);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                      <div className="text-sm font-medium text-gray-900">
                                        <strong>{airport.id} - </strong>
                                        {airport.name}
                                      </div>

                                      <div className="text-xs text-gray-500">
                                        City {airport.city}
                                      </div>
                                    </button>
                                  ))
                                ) : to.trim().length > 1 ? (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No airports found for "{to}"
                                  </div>
                                ) : null}
                              </div>
                            )}
                            {/* ****************** */}
                          </div>
                        </Modal.Body>
                      </Modal>
                      {/* *********************** auto dropdown data *********************** */}
                      {/* *********************** auto dropdown data for destination *********************** */}
                    </div>
                  </div>
                </div>
                {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                {/* *********************** DATE SECTION *********************** */}
                <div className="header_input relative h-12" ref={calendarRef}>
                  <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none">
                    <SlCalender />
                  </div>

                  <input
                    type="text"
                    readOnly
                    name="range"
                    onClick={() => handleOpenCalendar()}
                    className="block w-full  bg-neutral-secondary-medium text-sm rounded-base ps-10 cursor-pointer focus:outline-none focus:ring-0"
                    placeholder={
                      typed === 2
                        ? "Select departure date"
                        : typed === 1
                          ? "Select departure & return"
                          : "Select first flight date"
                    }
                    value={
                      typed === 2
                        ? range
                          ? format(
                            range instanceof Date ? range : range?.from,
                            "EEE MMM d",
                          )
                          : ""
                        : typed === 1
                          ? range?.from && range?.to
                            ? `${format(range.from, "MMM d")} - ${format(
                              range.to,
                              "MMM d",
                            )}`
                            : ""
                          : range?.from
                            ? format(range.from, "EEE MMM d")
                            : ""
                    }
                  />
                  {formik.touched.range && formik?.errors?.range && (
                    <p className="text-red-400 err_p mt-1 mb-1">
                      <span className="g_color">*</span>
                      {formik?.errors?.range}
                    </p>
                  )}

                  {open && (
                    <div className="absolute z-50 mt-2 bg-white shadow-xl rounded-lg p-4">
                      {/* ******* one way trip  */}
                      {typed == 2 && (
                        <DayPicker
                          mode="single"
                          // selected={range}
                          selected={range instanceof Date ? range : range?.from}
                          month={currentMonth}
                          fromMonth={today}
                          onMonthChange={(month) => setCurrentMonth(month)}
                          onSelect={(date) => {
                            setRange(date);
                            dispatch(
                              setSearchFlight({
                                startDate: date,
                                endDate: undefined,
                              }),
                            );
                            if (date) {
                              setCurrentMonth(date);
                            }

                            setCurrentMonth(date);
                            console.log(date, "date,,,,,,");

                            formik?.setFieldValue("range", date);
                            setOpen(false);
                          }}
                          disabled={{ before: new Date() }}
                        />
                      )}
                      {/* *************Round trip */}
                      {typed == 1 && (
                        // <DayPicker
                        //   mode="range"
                        //   selected={range}
                        //   defaultMonth={range?.to ?? range?.from ?? new Date()}
                        //   disabled={{ before: new Date() }}
                        //   onSelect={(rangeDate) => {
                        //     if (!rangeDate) return;
                        //     const from = rangeDate.from ?? rangeDate.to;
                        //     if (!from) return;
                        //     const to = rangeDate.to;
                        //     const isSingleDay =
                        //       !to || from.getTime() === to.getTime();
                        //     const finalRange = isSingleDay
                        //       ? { from, to: addDays(from, 1) }
                        //       : rangeDate;
                        //     setRange(finalRange);
                        //     setFr(finalRange.from);
                        //     setdayTo(finalRange.to);
                        //     formik?.setFieldValue("range", finalRange);
                        //     if (finalRange.from && finalRange.to) {
                        //       setOpen(false);
                        //     }
                        //   }}
                        // />

                        // <DayPicker
                        //   mode="range"
                        //   selected={range}
                        //   disabled={{ before: getMinSelectableDate() }}
                        //   defaultMonth={range?.from ?? new Date()}
                        //   onSelect={handleRoundTripSelect}
                        // />
                        <DayPicker
                          mode="range"
                          // selected={range}
                          selected={
                            range instanceof Date
                              ? { from: range, to: undefined }
                              : range
                          }
                          disabled={{ before: getMinSelectableDate() }}
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={handleRoundTripSelect}
                        />
                      )}
                      {/* *****mutiway */}
                      {typed == 3 && (
                        <DayPicker
                          mode="single"
                          selected={range?.from}
                          fromMonth={today}
                          onSelect={(date) => {
                            const newRange = { from: date };
                            setRange(newRange);
                            formik?.setFieldValue("range", newRange);
                          }}
                          disabled={{ before: new Date() }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* *********************** adultsssssssssssssssssssssss *********************** */}
                <div className="header_input relative h-12" ref={passengerRef}>
                  {/* Input Trigger */}

                  <div className="icon icon absolute inset-y-0 start-3 flex items-center  pointer-events-none icon_search">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    readOnly
                    onClick={() => setShowPassengerDropdown((prev) => !prev)}
                    value={formatPassengerLabel()}
                    className="block w-full cursor-pointer h-full bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                  />

                  {/* Arrow Icon */}
                  <FiChevronDown
                    onClick={() => {
                      setShowPassengerDropdown((prev) => !prev);
                      setShowClassDropdown(false);
                    }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 cursor-pointer ${showPassengerDropdown ? "rotate-180" : "rotate-0"
                      }`}
                    size={18}
                  />

                  {/*........................................ Dropdown ........................................ */}
                  <div
                    className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 
                                                             rounded-xl shadow-2xl transition-all duration-300 ease-out origin-top z-50
                    ${showPassengerDropdown
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                      <span className="text-sm text-gray-600 text-height">
                        Adult <br></br>{" "}
                        <span className="ft-sm"> (12+ yrs)</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPassengerCount((c) => {
                              const next = Math.max(1, c - 1);
                              if (infantCount > next) setInfantCount(next);
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
                            setPassengerCount((c) => Math.min(9, c + 1))
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                      <span className="text-sm text-gray-600 text-height">
                        Children <br />{" "}
                        <span className="ft-sm ">(2–11 yrs)</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setChildrenCount((c) => Math.max(0, c - 1))
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                        >
                          –
                        </button>
                        <span className="min-w-[20px] text-center font-medium">
                          {childrenCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setChildrenCount((c) => Math.min(9, c + 1))
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                      <span className="text-sm text-gray-600 text-height">
                        Infants <br />{" "}
                        <span className="ft-sm"> (under 2)</span>{" "}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setInfantCount((c) => Math.max(0, c - 1))
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                        >
                          –
                        </button>
                        <span className="min-w-[20px] text-center font-medium">
                          {infantCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setInfantCount((c) =>
                              Math.min(passengerCount, c + 1),
                            )
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="px-3 pb-2 text-xs text-gray-500">
                      Max 1 infant per adult
                    </p>
                    <div className="px-3 pb-4">
                      <button
                        type="button"
                        onClick={() => {
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

                {/* *********************** >>>>>>>>>>>>>>>>>> *********************** */}
                <button
                  type="button"
                  className="bsolute top-2 end-3 bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs focus:outline-none button_bg2 text-white rounded search_full_button_padding"
                  onClick={() => formik?.handleSubmit()}
                >
                  Search
                </button>
              </div>
              {/* (((((((((((((((((((((((((((((((((((((((((((((((  multicity input ))))))))))))))))))))))))))))))))))))))))))))))) */}
              {typed == 3 && <Flight_MultiCity_Input />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
