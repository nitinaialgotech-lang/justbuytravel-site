"use client";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { CiSearch } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BiRadioCircle } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { VscArrowSwap } from "react-icons/vsc";
import { FiChevronDown, FiUsers } from "react-icons/fi";
import Link from "next/link";
import "../../style/search.scss";
import SideBar from "./SideBar";
export default function ViewHotelPage() {
  const [open, setOpen] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [travelClass, setTravelClass] = useState("Economy");
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
  return (
    <section className="viewhotel_section padding_bottom">
      <div className="container">
        <div className="row">
          {/* * *************************************************** */}
          <div className="col-lg-3">
            <SideBar />
          </div>
          {/* * *************************************************** */}
          <div className="col-lg-9">
            {/* ***************************************** hotel page ********************************** */}
            <div className="list-grid-product-wrap">
              <div className="row" id="sidebar_filter_hotel">
                <div className="col-lg-4 item wow animate fadeInDown">
                  <div className="hotel-card">
                    <div className="hotel-img-wrap">
                      <a href="#" className="hotel-img">
                        <img
                          src={"/cruise/cruide6.jpg"}
                          className="rounded-3xl w-full h-full object-cover"
                          loading="lazy"
                        />
                      </a>
                      {/* <div className="batch">
                                                <span>Sale on!</span>
                                            </div> */}
                    </div>
                    <div className="hotel-content">
                      <div class="rating-area">
                        <div class="rating-text">
                          <div class="rating-stars">
                            <ul>
                              <li>☆</li>
                              <li>☆</li>
                              <li>☆</li>
                              <li>☆</li>
                              <li>☆</li>{" "}
                            </ul>
                          </div>
                          <span class="total">0 reviews</span>
                        </div>
                      </div>
                      <h5> HAIAN Beach Hotel & Spa</h5>
                      <div className="btn-and-price-area">
                        <Link href={``} className="primary-btn1 text-white">
                          <span>
                            Book Now{" "}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z"></path>
                            </svg>
                          </span>
                          <span>
                            Book Now{" "}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z"></path>
                            </svg>
                          </span>
                        </Link>
                        <div class="price-area">
                          <h6>Starting From</h6>
                          <span>₹8,266</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
