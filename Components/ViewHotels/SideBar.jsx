import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
export default function SideBar() {
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [travelClass, setTravelClass] = useState("Economy");
  const [star_type, setStartType] = useState(3);
  const [typed, setType] = useState(3);
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

  const sort_price = [
    { price_type: "Lowest Price", p_no: 3 },
    {
      price_type: "Highest Rating",
      p_no: 8,
    },
    {
      price_type: "Most Reviewed",
      p_no: 13,
    },
  ];
  const reviews = [
    {
      star: (
        <>
          <ul className="flex p-0 m-0 gap-2 items-center">
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
          </ul>
        </>
      ),
      review: 5,
      id: 1,
    },
    {
      star: (
        <>
          <ul className="flex p-0 m-0 gap-2 items-center">
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
          </ul>
        </>
      ),
      review: 4,
      id: 1,
    },
    {
      star: (
        <>
          <ul className="flex p-0 m-0 gap-2 items-center">
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
          </ul>
        </>
      ),
      review: 3,
      id: 1,
    },
    {
      star: (
        <>
          <ul className="flex p-0 m-0 gap-2 items-center">
            <li>
              {" "}
              <FaStar />
            </li>
            <li>
              {" "}
              <FaStar />
            </li>
          </ul>
        </>
      ),
      review: 2,
      id: 1,
    },
    {
      star: (
        <>
          {" "}
          <ul className="flex p-0 m-0 gap-2 items-center">
            <li>
              {" "}
              <FaStar />
            </li>
          </ul>
        </>
      ),
      review: 1,
      id: 1,
    },
  ];

  const MIN = 0;
  const MAX = 300;

  const [minPrice, setMinPrice] = useState(138);
  const [maxPrice, setMaxPrice] = useState(300);

  const handleMin = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1);
    setMinPrice(value);
  };

  const handleMax = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1);
    setMaxPrice(value);
  };
  return (
    <>
      <div className="hotel_filter_sidebar">
        {/* *************************************** */}
        <div className="sort_by">
          <div className="box">
            <div className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-lg">
              <div className="filter-item relative w-full">
                <div className="siderbar_heading title-area">
                  <h3>Filter</h3>
                </div>

                {/* ************** sidebar content ******** */}
                <div className="sort_item single-widgets">
                  <div className="widget-title">
                    <h4>Sort By</h4>
                  </div>
                  {sort_price?.map((item, i) => {
                    const isChecked = Number(typed) === Number(item?.p_no);
                    return (
                      <>
                        <div class="type2 " key={i}>
                          <label
                            class="flex items-center cursor-pointer gap-2"
                            onClick={() => setType(item?.p_no)}
                          >
                            <span
                              class={`trip-radio-dot ${isChecked ? "trip-radio-dot-checked" : ""} radio`}
                              role="presentation"
                            ></span>
                            <input
                              class="sr-only"
                              type="radio"
                              value={item?.p_no}
                              checked={isChecked}
                              name="tripType"
                            />
                            <span>{item?.price_type}</span>
                          </label>
                        </div>
                      </>
                    );
                  })}
                </div>
                {/* ****************************** price range ********* */}
                <div className="price_range_item single-widgets">
                  <div className="widget-title">
                    <h4>Pricing</h4>
                  </div>
                  <div className="range-slider">
                    <div className="slider-track"></div>

                    <div
                      className="slider-range"
                      style={{
                        left: `${(minPrice / MAX) * 100}%`,
                        right: `${100 - (maxPrice / MAX) * 100}%`,
                      }}
                    ></div>

                    <input
                      type="range"
                      min={MIN}
                      max={MAX}
                      value={minPrice}
                      onChange={handleMin}
                      className="thumb thumb-left"
                    />

                    <input
                      type="range"
                      min={MIN}
                      max={MAX}
                      value={maxPrice}
                      onChange={handleMax}
                      className="thumb thumb-right"
                    />
                  </div>

                  <div className="price-values">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                  </div>
                </div>
                {/* ************************************** */}
                <div className="sort_item single-widgets">
                  <div className="widget-title">
                    <h4>Travelller Rating</h4>
                  </div>
                  {reviews?.map((item, i) => {
                    const isChecked =
                      Number(star_type) === Number(item?.review);
                    return (
                      <>
                        <div class="type2 " key={i}>
                          <label
                            class="flex items-center cursor-pointer gap-2"
                            onClick={() => setStartType(item?.review)}
                          >
                            <span
                              class={`trip-radio-dot ${isChecked ? "trip-radio-dot-checked" : ""} `}
                              role="presentation"
                            ></span>
                            <input
                              class="sr-only"
                              type="radio"
                              value={item?.p_no}
                              checked={isChecked}
                              name="tripType"
                            />
                            <span className={`${isChecked ? "check" : ""}`}>
                              {item?.star}
                            </span>
                          </label>
                        </div>
                      </>
                    );
                  })}
                </div>
                {/* *********************************** */}
              </div>
            </div>
          </div>
        </div>
        {/* *************************************** */}
      </div>
    </>
  );
}
