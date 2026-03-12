import React, { useEffect, useState, useRef } from "react";
import { VscArrowSwap } from "react-icons/vsc";
import { BiRadioCircle } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  resetSearchFlight,
  SetFlightType,
  setMultiCity,
  setSearchFlight,
} from "@/Components/Redux/Reducer";
import { Flight_AutoCompletion } from "@/app/Route/endpoints";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import { useFormik } from "formik";
import Modal from "react-bootstrap/Modal";
import * as yup from "yup";
import moment from "moment";
import Boooking_options from "./Boooking_options";
export default function Flight_MultiCity_Input() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  // ****************
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showFrom, setShowFrom] = useState(false);
  // ********************

  // First leg states
  const [fromFirst, setFromFirst] = useState("");
  const [toFirst, setToFirst] = useState("");
  const [dateFirstFrom, setDateFirstFrom] = useState();
  const [openflight, setopenFlight] = useState([
    {
      id: "",
      departure_id: "",
      arrival_id: "",
      dateTime: "",
    },
    {
      id: "",
      departure_id: "",
      arrival_id: "",
      dateTime: "",
    },
  ]);

  // Dropdown states (store open dropdown index or null)
  const [showFirstFromDropdown, setShowFirstFromDropdown] = useState(null);
  const [showFirstToDropdown, setShowFirstToDropdown] = useState(null);

  const [showFirstFromModalDropdown, setShowFirstFromModal] = useState(null);
  const [showFirstToModalDropdown, setShowFirstToModal] = useState(null);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // *************************************************************
  // Fetch autocomplete results for from/to inputs
  const { data: autoCompleteFirstFromData, isLoading: isLoadingFirstFrom } =
    useQuery({
      queryKey: ["flight_autoComplete", fromFirst],
      queryFn: () => Flight_AutoCompletion(fromFirst),
      enabled: (fromFirst || "").trim().length > 0,
      staleTime: 30000,
    });
  const autoFirstFromData = autoCompleteFirstFromData?.data?.suggestions || [];
  const allAirports = autoFirstFromData
    .filter((item) => Array.isArray(item.airports))
    .flatMap((item) => item.airports);

  const { data: autoCompleteFirstToData, isLoading: isLoadingFirstTo } =
    useQuery({
      queryKey: ["flight_autoComplete", toFirst],
      queryFn: () => Flight_AutoCompletion(toFirst),
      enabled: (toFirst || "").trim().length > 0,
      staleTime: 30000,
    });
  const autoFirstToData = autoCompleteFirstToData?.data?.suggestions || [];
  const allAirPortsTO = autoFirstToData
    .filter((item) => Array.isArray(item.airports))
    .flatMap((item) => item.airports);

  // *************************************************************
  const travelType = useSelector((state) => state?.user?.type);
  const travel_Class = useSelector((state) => state?.user?.travel_class);
  const adult = useSelector(
    (state) => state?.user?.passen_count || state?.user?.adults,
  );
  // Calendar states
  const [openCalendarIndex, setOpenCalendarIndex] = useState(null);

  // Refs
  const passengerRef = useRef(null);
  const classRef = useRef(null);
  const firstCalendarRefs = useRef([]);
  // ********************* formik
  const formik = useFormik({
    initialValues: {
      flights: [
        { departure_id: "", arrival_id: "", dateTime: "" },
        { departure_id: "", arrival_id: "", dateTime: "" },
      ],
    },
    validationSchema: yup.object({
      flights: yup.array().of(
        yup.object({
          departure_id: yup.string().required("This Field is Required !!!"),
          arrival_id: yup.string().required("This Field is Required !!!"),
          dateTime: yup.date().required("This Field is Required !!!"),
        }),
      ),
    }),
    onSubmit: (values) => {
      console.log("value", values);
      dispatch(setMultiCity(values?.flights));
      handleSubmit1();
    },
  });
  // ****************************************

  // ***************************************************************
  // Reset flight search on page mount
  // useEffect(() => {
  //   if (pathname === "/flight") {
  //     dispatch(resetSearchFlight());
  //   }
  // }, [pathname, dispatch]);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (passengerRef.current && !passengerRef.current.contains(e.target)) {
        setShowPassengerDropdown(false);
      }
      if (classRef.current && !classRef.current.contains(e.target)) {
        setShowClassDropdown(false);
      }
      const anyCalendarContains = (firstCalendarRefs.current || []).some(
        (el) => el && el.contains && el.contains(e.target),
      );
      const clickedInsideInput =
        e.target.closest && e.target.closest(".header_input");
      if (!anyCalendarContains && !clickedInsideInput) {
        setOpenCalendarIndex(null);
      }
      if (!clickedInsideInput) {
        setShowFirstFromDropdown(null);
        setShowFirstToDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // *************************************************************
  const PlusInput = () => {
    if (openflight?.length <= 4) {
      const newOpen = [
        ...openflight,
        {
          id: "",
          departure_id: "",
          arrival_id: "",
          dateTime: "",
        },
      ];
      setopenFlight(newOpen);
      const newFormikFlights = [
        ...(formik.values.flights || []),
        { departure_id: "", arrival_id: "", dateTime: "" },
      ];
      formik.setFieldValue("flights", newFormikFlights);
    } else {
      return " ";
    }
  };
  // *********************************************************
  const removeInput = (index) => {
    if (openflight.length <= 2) return;
    const updated = openflight.filter((_, i) => i !== index);
    setopenFlight(updated);
    const updatedFormik = (formik.values.flights || []).filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue("flights", updatedFormik);
  };
  // *******************************************************
  console.log(formik?.errors?.flights, "errrrrrrrrrrrrrrrrr");

  // *******************************
  const legs = formik?.values?.flights?.map((flight) => ({
    departure_id: flight.departure_id,
    arrival_id: flight.arrival_id,
    date: flight.dateTime ? moment(flight.dateTime).format("YYYY-MM-DD") : "",
  }));

  const payload = {
    mode: "multi_city",
    type: travelType,
    travel_class: travel_Class,
    adults: adult,
    currency: "USD",
    hl: "en",
    legs,
  };
  // ********************** apis
  const handleSubmit1 = async () => {
    dispatch(SetFlightType(3));
    router.push("/multi-flight-detail");
  };
  console.log(formik?.errors, "errrrrr");
  const today = new Date();
  return (
    <>
      <form onSubmit={formik?.handleSubmit}>
        {/* FIRST LEG SECTION */}
        {openflight?.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <div className="d-none d-lg-block">
                <div
                  className={`header_input_item header_multiple_input flex flex-col ${formik?.errors?.flights ? "pb-2 pad-b mb-3 mt-4" : "pb-3"} md:flex-row gap-3 md:gap-4`}
                  key={index}
                >
                  {/* First leg: From input */}
                  <div className="d-block d-lg-none">
                    {/* First leg: Date input */}
                    <div className="flex cross_btn items-center justify-end relativ">
                      <button
                        className="btn  p-0 "
                        type="button"
                        onClick={() => removeInput(index)}
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                  {/* *********************************** */}
                  <div className="header_input_1 header_in2 relative flex flex-1 gap-2">
                    <div className="header_input header_inpu relative h-12">
                      <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none icon_search">
                        <BiRadioCircle />
                      </div>
                      <input
                        type="text"
                        name={`flights[${index}].departure_id`}
                        placeholder="Leaving From"
                        value={
                          formik?.values?.flights?.[index]?.departure_id || ""
                        }
                        className="block w-full bg-neutral-secondary-medium border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onChange={(e) => {
                          formik.handleChange(e);
                          const value = e.target.value;
                          setFromFirst(value);
                          setShowFirstFromDropdown(
                            value.trim().length > 1 ? index : null,
                          );
                          const updated = [...openflight];
                          updated[index] = {
                            ...updated[index],
                            departure_id: value,
                          };
                          setopenFlight(updated);
                        }}
                        onFocus={() => {
                          if (
                            (fromFirst || "").trim().length > 1 &&
                            autoFirstFromData.length
                          ) {
                            setShowFirstFromDropdown(index);
                          }
                        }}
                        onBlur={(e) => {
                          formik.handleBlur(e);
                          setTimeout(() => setShowFirstFromDropdown(null), 150);
                        }}
                        aria-label="Leaving From"
                      />
                      {formik.touched.flights?.[index]?.departure_id &&
                        formik?.errors?.flights?.[index]?.departure_id &&
                        (formik?.touched?.flights?.[index]?.departure_id ||
                          formik?.submitCount > 0) && (
                          <p className="text-red-400  err_p mt-1 mb-1">
                            <span className="g_color">*</span>
                            {formik?.errors?.flights?.[index]?.departure_id}
                          </p>
                        )}
                      {/* First leg: From dropdown */}
                      {showFirstFromDropdown === index && (
                        <div className="absolute z-10 w-full mt-1  bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                          {isLoadingFirstFrom ? (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              Loading airports...
                            </div>
                          ) : allAirports.length > 0 ? (
                            allAirports.map((airport, sIndex) => {
                              return (
                                <button
                                  key={sIndex}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    formik.setFieldValue(
                                      `flights[${index}].departure_id`,
                                      airport?.id || "",
                                    );
                                    const updated = [...openflight];
                                    updated[index] = {
                                      ...updated[index],
                                      departure_id: airport?.id || "",
                                    };
                                    setopenFlight(updated);
                                    setFromFirst(airport?.id || "");
                                    setShowFirstFromDropdown(null);
                                    dispatch(
                                      setSearchFlight({
                                        multicity: {
                                          OneStartFrom: airport?.id || "",
                                        },
                                      }),
                                    );
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <div className="text-sm font-medium text-gray-900">
                                    <strong>{airport?.id} - </strong>
                                    {airport?.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    City {airport?.city}
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              No airports found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Swap icon */}
                    <div className="arrow absolute flex items-center justify-center inset-y-0 left-1/2 -translate-x-1/2">
                      <VscArrowSwap />
                    </div>

                    {/* First leg: To input */}
                    <div className="header_input header_inpu relative h-12">
                      <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none icon_search">
                        <IoLocationSharp />
                      </div>
                      <input
                        type="text"
                        placeholder="Going to"
                        name={`flights[${index}].arrival_id`}
                        value={
                          formik?.values?.flights?.[index]?.arrival_id || ""
                        }
                        className="block w-full h-full bg-neutral-secondary-medium border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onChange={(e) => {
                          formik.handleChange(e);
                          const value = e.target.value;
                          setToFirst(value);
                          setShowFirstToDropdown(
                            value.trim().length > 1 ? index : null,
                          );
                          const updated = [...openflight];
                          updated[index] = {
                            ...updated[index],
                            arrival_id: value,
                          };
                          setopenFlight(updated);
                        }}
                        onFocus={() => {
                          if (
                            (toFirst || "").trim().length > 1 &&
                            autoFirstToData.length
                          ) {
                            setShowFirstToDropdown(index);
                          }
                        }}
                        onBlur={(e) => {
                          formik.handleBlur(e);
                          setTimeout(() => setShowFirstToDropdown(null), 150);
                        }}
                        aria-label="Destination airport"
                      />

                      {/* First leg: To dropdown */}
                      {showFirstToDropdown === index && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                          {isLoadingFirstTo ? (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              Loading airports...
                            </div>
                          ) : allAirPortsTO.length > 0 ? (
                            allAirPortsTO.map((airport, sIndex) => {
                              return (
                                <button
                                  key={sIndex}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    formik.setFieldValue(
                                      `flights[${index}].arrival_id`,
                                      airport?.id || "",
                                    );
                                    const updated = [...openflight];
                                    updated[index] = {
                                      ...updated[index],
                                      arrival_id: airport?.id || "",
                                    };
                                    setopenFlight(updated);
                                    setToFirst(airport?.id || "");
                                    setShowFirstToDropdown(null);
                                    dispatch(
                                      setSearchFlight({
                                        multicity: {
                                          OneEndTO: airport?.id || "",
                                        },
                                      }),
                                    );
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <div className="text-sm font-medium text-gray-900">
                                    <strong>{airport?.id} - </strong>
                                    {airport?.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    City {airport?.city}
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                              No airports found
                            </div>
                          )}
                        </div>
                      )}
                      {formik?.touched?.flights?.[index]?.arrival_id &&
                        formik?.errors?.flights?.[index]?.arrival_id &&
                        (formik?.touched?.flights?.[index]?.arrival_id ||
                          formik?.submitCount > 0) && (
                          <p className="text-red-400 err_p mt-1 mb-1">
                            <span className="g_color">*</span>
                            {formik?.errors?.flights?.[index]?.arrival_id}
                          </p>
                        )}
                    </div>
                  </div>
                  {/* ************** First leg: Date input  *************************/}
                  <div
                    className="header_input header_inpu header_inpu relative h-12"
                    ref={(el) => (firstCalendarRefs.current[index] = el)}
                  >
                    <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none">
                      <SlCalender />
                    </div>
                    {(() => {
                      const selectedDate =
                        formik?.values?.flights?.[index]?.dateTime;
                      return (
                        <input
                          type="text"
                          readOnly
                          onClick={() => {
                            setOpenCalendarIndex(
                              openCalendarIndex === index ? null : index,
                            );
                          }}
                          className="block w-full h-full bg-neutral-secondary-medium text-sm rounded-base ps-10 cursor-pointer focus:outline-none focus:ring-0"
                          placeholder={
                            selectedDate
                              ? format(new Date(selectedDate), "EEE, MMM d")
                              : "Select date"
                          }
                          value={
                            selectedDate
                              ? format(new Date(selectedDate), "EEE, MMM d")
                              : ""
                          }
                        />
                      );
                    })()}
                    {/* ********** */}
                    {openCalendarIndex === index && (
                      <div className="absolute z-50 bg-white mt-2 shadow-xl rounded-lg p-4">
                        <DayPicker
                          mode="single"
                          selected={formik?.values?.flights?.[index]?.dateTime}
                          fromMonth={today}
                          onSelect={(date) => {
                            formik?.setFieldValue(
                              `flights[${index}].dateTime`,
                              moment(date).format("YYYY-MM-DD"),
                            );
                            setDateFirstFrom(date);
                            const updated = [...openflight];
                            updated[index] = {
                              ...updated[index],
                              dateTime: date,
                            };
                            setopenFlight(updated);

                            setOpenCalendarIndex(null);
                          }}
                          disabled={{ before: new Date() }}
                        />
                      </div>
                    )}
                    {/* ********** */}
                    {formik?.touched?.flights?.[index]?.dateTime &&
                      formik?.errors?.flights?.[index]?.dateTime &&
                      (formik?.touched?.flights?.[index]?.dateTime ||
                        formik?.submitCount > 0) && (
                        <p className="text-red-400 err_p mt-1 mb-1">
                          <span className="g_color">*</span>
                          {formik?.errors?.flights?.[index]?.dateTime}
                        </p>
                      )}
                  </div>
                  {/* Remove leg - visible on desktop, right side */}
                  {index > 1 && (
                    <div className="flex cross_btn items-center justify-end ms-auto">
                      <button
                        className="btn p-0"
                        type="button"
                        onClick={() => removeInput(index)}
                        aria-label="Remove flight"
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx show on mobile view xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
              <div className="d-block d-lg-none">
                <div
                  className={`header_input_item header_multiple_input flex flex-col ${formik?.errors?.flights ? "pb-4" : "pb-3"} md:flex-row gap-3 md:gap-4`}
                  key={index}
                >
                  {index > 1 && (
                    <div className="flex cross_btn items-center justify-end ms-auto">
                      <button
                        className="btn p-0"
                        type="button"
                        onClick={() => removeInput(index)}
                        aria-label="Remove flight"
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  )}
                  {/* *********************************** */}
                  <div className="header_input_1 header_in2 relative flex flex-1 gap-2">
                    <div className="header_input header_inpu relative h-12">
                      <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none icon_search">
                        <BiRadioCircle />
                      </div>
                      <input
                        type="text"
                        name={`flights[${index}].departure_id`}
                        placeholder="Leaving From"
                        value={
                          formik?.values?.flights?.[index]?.departure_id || ""
                        }
                        readOnly
                        className="block w-full bg-neutral-secondary-medium border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize cursor-pointer"
                        onClick={() => setShowFirstFromModal(index)}
                        aria-label="Leaving From"
                      />

                      {formik?.touched?.flights?.[index]?.departure_id &&
                        formik?.errors?.flights?.[index]?.departure_id &&
                        (formik?.touched?.flights?.[index]?.departure_id ||
                          formik?.submitCount > 0) && (
                          <p className="text-red-400 err_p mt-1 mb-1">
                            <span className="g_color">*</span>
                            {formik?.errors?.flights?.[index]?.departure_id}
                          </p>
                        )}
                      {/* ***************************** open dropdown input >>>>>>>>>>> */}
                      <Modal
                        show={showFirstFromModalDropdown === index}
                        onHide={() => setShowFirstFromModal(null)}
                        backdrop="static"
                        keyboard={false}
                        fullscreen
                      >
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
                              name={`flights[${index}].departure_id`}
                              placeholder="Leaving From"
                              value={
                                formik?.values?.flights?.[index]
                                  ?.departure_id || ""
                              }
                              className="block w-full bg-neutral-secondary-medium border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                              onChange={(e) => {
                                formik.handleChange(e);
                                const value = e.target.value;
                                setFromFirst(value);
                                setShowFirstFromDropdown(
                                  value.trim().length > 1 ? index : null,
                                );
                                const updated = [...openflight];
                                updated[index] = {
                                  ...updated[index],
                                  departure_id: value,
                                };
                                setopenFlight(updated);
                              }}
                              onFocus={() => {
                                if (
                                  (fromFirst || "").trim().length > 1 &&
                                  autoFirstFromData.length
                                ) {
                                  setShowFirstFromDropdown(index);
                                }
                              }}
                              onBlur={(e) => {
                                formik.handleBlur(e);
                                setTimeout(
                                  () => setShowFirstFromDropdown(null),
                                  150,
                                );
                              }}
                              aria-label="Leaving From"
                            />
                            {formik?.touched?.From && formik?.errors?.From && (
                              <p className="text-red-400 mt-1 mb-1">
                                <span className="g_color">*</span>
                                {formik?.errors?.From}
                              </p>
                            )}
                            {/* *********************** modal dropdown  dropdown data *********************** */}
                            {/* First leg: From dropdown */}
                            {showFirstFromDropdown === index && (
                              <div className="absolute z-10 w-full mt-1  bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                                {isLoadingFirstFrom ? (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    Loading airports...
                                  </div>
                                ) : allAirports.length > 0 ? (
                                  allAirports.map((airport, sIndex) => {
                                    return (
                                      <button
                                        key={sIndex}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          formik.setFieldValue(
                                            `flights[${index}].departure_id`,
                                            airport?.id || "",
                                          );
                                          const updated = [...openflight];
                                          updated[index] = {
                                            ...updated[index],
                                            departure_id: airport?.id || "",
                                          };
                                          setopenFlight(updated);
                                          setFromFirst(airport?.id || "");
                                          setShowFirstFromDropdown(null);
                                          setShowFirstFromModal(null);
                                          dispatch(
                                            setSearchFlight({
                                              multicity: {
                                                OneStartFrom: airport?.id || "",
                                              },
                                            }),
                                          );
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                      >
                                        <div className="text-sm font-medium text-gray-900">
                                          <strong>{airport?.id} - </strong>
                                          {airport?.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          City {airport?.city}
                                        </div>
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No airports found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Modal.Body>
                        {/* <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary">Understood</Button>
                          </Modal.Footer> */}
                      </Modal>
                      {/* *********************** auto dropdown data *********************** */}
                    </div>

                    {/* Swap icon */}
                    <div className="arrow absolute flex items-center justify-center inset-y-0 left-1/2 -translate-x-1/2">
                      <VscArrowSwap />
                    </div>

                    {/* First leg: To input */}
                    <div className="header_input header_inpu relative h-12">
                      <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none icon_search">
                        <IoLocationSharp />
                      </div>
                      <input
                        type="text"
                        placeholder="Going to"
                        name={`flights[${index}].arrival_id`}
                        value={
                          formik?.values?.flights?.[index]?.arrival_id || ""
                        }
                        className="block w-full h-full bg-neutral-secondary-medium border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                        onClick={() => setShowFirstToModal(index)}
                        onChange={(e) => {
                          formik.handleChange(e);
                          const value = e.target.value;
                          setToFirst(value);
                          setShowFirstToDropdown(
                            value.trim().length > 1 ? index : null,
                          );
                          const updated = [...openflight];
                          updated[index] = {
                            ...updated[index],
                            arrival_id: value,
                          };
                          setopenFlight(updated);
                        }}
                        onFocus={() => {
                          if (
                            (toFirst || "").trim().length > 1 &&
                            autoFirstToData.length
                          ) {
                            setShowFirstToDropdown(index);
                          }
                        }}
                        onBlur={(e) => {
                          formik.handleBlur(e);
                          setTimeout(() => setShowFirstToDropdown(null), 150);
                        }}
                        aria-label="Destination airport"
                      />

                      {/* First leg: To dropdown */}

                      {formik?.touched?.flights?.[index]?.arrival_id &&
                        formik?.errors?.flights?.[index]?.arrival_id &&
                        (formik?.touched?.flights?.[index]?.arrival_id ||
                          formik?.submitCount > 0) && (
                          <p className="text-red-400 err_p mb-3">
                            <span className="g_color">*</span>
                            {formik?.errors?.flights?.[index]?.arrival_id}
                          </p>
                        )}

                      {/* ***************************** open dropdown input >>>>>>>>>>> */}
                      <Modal
                        show={showFirstToModalDropdown === index}
                        onHide={() => setShowFirstToModal(null)}
                        backdrop="static"
                        keyboard={false}
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
                              name={`flights[${index}].arrival_id`}
                              id="to"
                              value={
                                formik?.values?.flights?.[index]?.arrival_id ||
                                ""
                              }
                              className="block w-full h-full bg-neutral-secondary-medium  border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body ps-10 capitalize"
                              onChange={(e) => {
                                formik.handleChange(e);
                                const value = e.target.value;
                                setToFirst(value);
                                setShowFirstToDropdown(
                                  value.trim().length > 1 ? index : null,
                                );
                                const updated = [...openflight];
                                updated[index] = {
                                  ...updated[index],
                                  arrival_id: value,
                                };
                                setopenFlight(updated);
                              }}
                              onFocus={() => {
                                if (
                                  (toFirst || "").trim().length > 1 &&
                                  autoFirstToData.length
                                ) {
                                  setShowFirstToDropdown(index);
                                }
                              }}
                              onBlur={(e) => {
                                formik.handleBlur(e);
                                setTimeout(
                                  () => setShowFirstToDropdown(null),
                                  150,
                                );
                              }}
                              placeholder="Going to"
                              aria-label="Destination airport"
                            />
                            {formik?.touched?.From && formik?.errors?.From && (
                              <p className="text-red-400 mt-1 mb-1">
                                <span className="g_color">*</span>
                                {formik?.errors?.From}
                              </p>
                            )}
                            {/* *********************** modal dropdown  dropdown data *********************** */}

                            {/* ****************** */}
                            {showFirstToDropdown === index && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                                {isLoadingFirstTo ? (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    Loading airports...
                                  </div>
                                ) : allAirPortsTO.length > 0 ? (
                                  allAirPortsTO.map((airport, sIndex) => {
                                    return (
                                      <button
                                        key={sIndex}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          formik.setFieldValue(
                                            `flights[${index}].arrival_id`,
                                            airport?.id || "",
                                          );
                                          const updated = [...openflight];
                                          updated[index] = {
                                            ...updated[index],
                                            arrival_id: airport?.id || "",
                                          };
                                          setopenFlight(updated);
                                          setToFirst(airport?.id || "");
                                          setShowFirstToDropdown(null);
                                          setShowFirstToModal(null);
                                          dispatch(
                                            setSearchFlight({
                                              multicity: {
                                                OneEndTO: airport?.id || "",
                                              },
                                            }),
                                          );
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                      >
                                        <div className="text-sm font-medium text-gray-900">
                                          <strong>{airport?.id} - </strong>
                                          {airport?.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          City {airport?.city}
                                        </div>
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No airports found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Modal.Body>
                        {/* <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary">Understood</Button>
                          </Modal.Footer> */}
                      </Modal>
                      {/* *********************** auto dropdown data *********************** */}
                    </div>
                  </div>
                  {/* ************** First leg: Date input  *************************/}
                  <div
                    className="header_input header_inpu header_inpu relative h-12"
                    ref={(el) => (firstCalendarRefs.current[index] = el)}
                  >
                    <div className="icon absolute inset-y-0 start-3 flex items-center pointer-events-none">
                      <SlCalender />
                    </div>
                    {(() => {
                      const selectedDate =
                        formik?.values?.flights?.[index]?.dateTime;
                      return (
                        <input
                          type="text"
                          readOnly
                          onClick={() => {
                            setOpenCalendarIndex(
                              openCalendarIndex === index ? null : index,
                            );
                          }}
                          className="block w-full h-full bg-neutral-secondary-medium text-sm rounded-base ps-10 cursor-pointer focus:outline-none focus:ring-0"
                          placeholder={
                            selectedDate
                              ? format(new Date(selectedDate), "EEE, MMM d")
                              : "Select date"
                          }
                          value={
                            selectedDate
                              ? format(new Date(selectedDate), "EEE, MMM d")
                              : ""
                          }
                        />
                      );
                    })()}
                    {/* ********** */}
                    {openCalendarIndex === index && (
                      <div className="absolute z-50 bg-white mt-2 shadow-xl rounded-lg p-4">
                        <DayPicker
                          mode="single"
                          selected={formik?.values?.flights?.[index]?.dateTime}
                          fromMonth={today}
                          onSelect={(date) => {
                            formik?.setFieldValue(
                              `flights[${index}].dateTime`,
                              moment(date).format("YYYY-MM-DD"),
                            );
                            setDateFirstFrom(date);
                            const updated = [...openflight];
                            updated[index] = {
                              ...updated[index],
                              dateTime: date,
                            };
                            setopenFlight(updated);

                            setOpenCalendarIndex(null);
                          }}
                          disabled={{ before: new Date() }}
                        />
                      </div>
                    )}
                    {/* ********** */}
                    {formik?.touched?.flights?.[index]?.dateTime &&
                      formik?.errors?.flights?.[index]?.dateTime &&
                      (formik?.touched?.flights?.[index]?.dateTime ||
                        formik?.submitCount > 0) && (
                        <p className="text-red-400 err_p mt-1 mb-2">
                          <span className="g_color">*</span>
                          {formik?.errors?.flights?.[index]?.dateTime}
                        </p>
                      )}
                  </div>
                  {/* Remove leg - right side on mobile */}

                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* SECOND LEG SECTION */}

        {/* SEARCH BUTTON */}
        <div className="button flex items-center mt-2 flight_search_button  justify-between font-semibold ">
          <Link
            href={""}
            className="no-underline font_cross"
            onClick={() => PlusInput()}
          >
            Add Flight
          </Link>
          <button
            type="submit"
            className="bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs focus:outline-none button_bg2 text-white rounded search_full_button_padding"
          >
            Search
          </button>
        </div>
      </form>
    </>
  );
}
