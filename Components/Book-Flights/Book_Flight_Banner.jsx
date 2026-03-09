import React from "react";
import Search_flight_section from "./Search_flight_section";
import "../../style/responsive.css";
import Search from "../HomePage/Search";
import Flight_Departure from "./Flight_Departure";
import Flight_Search_Input from "@/Components/Book-Flights/Flight_Details/Flight_Search_Input";
// import Google_flights from "./Google_flights.jsx";
export default function Book_Flight_Banner() {
  return (
    <>
      <section className="book-flight-section  d-none d-lg-block padding_top_0_md">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="book-flight-title ">
                <div className="banner_box home_banner">
                  <div className="title text-center">
                    <h1 className="capitalize">
                      {/* Quick Flights Booking with <span> Trusted Guidance</span> */}
                      Book Flights Online <span> via Trusted</span> Partners
                    </h1>
                    <p className="capitalize">
                      Access verified flight listings, transparent prices, and
                      secure booking options through trusted global airline
                      partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Google_flights /> */}
      <Search />
    </>
  );
}
