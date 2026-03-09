"use client";
import React, { useEffect, useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { FaChevronUp } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { TbMailFilled } from "react-icons/tb";
import Link from "next/link";
import { IoLogoFacebook } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { RiTwitterXLine } from "react-icons/ri";
import { getAssetPath } from "../app/utils/assetPath";
import QuickLinks from "@/Components/QuickLinks/QuickLinks";
import FlightQuickLinks from "@/Components/QuickLinks/FlightQuickLinks";
import { usePathname } from "next/navigation";
import { FaLinkedin } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

export default function Footer() {
  // ***************************************
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > 300) setVisible(true);
        else setVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // check on mount
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // ***************************************
  const pathname = usePathname();
  console.log(pathname, ",,,,,,.");

  return (
    <>
      <QuickLinks />

      <section className="footer_section padding_top relative ">
        <div className="bg_back absolute top-0 flex justify-between left-0 right-0">
          <div className="left_img ">
            <img src={getAssetPath("/footer/icon/left_img.svg")} alt="" />
          </div>
          <div className="right_img">
            <img src={getAssetPath("/footer/icon/right_img.svg")} alt="" />
          </div>
        </div>
        <footer className="footer">
          <div className="container ">
            <div className="row items-center justify-center ">
              <div className="col-lg-8">
                <div className="footer_content flex flex-col">
                  <div className="footer_logo">
                    <div className="logo text-center flex justify-center">
                      <Link href={"/"}>
                        <img
                          src={getAssetPath("/footer/icon/footer_logo.webp")}
                          alt="Just Buy Travel Logo"
                        />
                      </Link>
                    </div>
                  </div>
                  {/* ************* */}
                  <div className="footer_desc">
                    <p className="">
                      We provide authentic{" "}
                      <span>
                        travel guides, destination information, local
                        experiences, travel news, expert tips,
                      </span>{" "}
                      and smart suggestions to help travelers plan{" "}
                      <span>better trips.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ****************** icons with full width  */}

          <div className="icon_box">
            <div className="icon_row flex items-center justify-between relative ">
              <div className="before">
                <img
                  src={getAssetPath("/footer/icon/left_line.png")}
                  alt="Just Buy Travel Logo"
                />
              </div>
              {/* *************** */}
              <div className="iocn">
                {/* **************************** */}
                <ul className="example-2 m-0 p-0" id="icon_footer">
                  <li className="icon-content">
                    <Link
                      href="https://www.facebook.com/people/Just-buy-Travel/61577152502232/"
                      aria-label="Facebookk"
                      data-social="Facebook"
                    >
                      <div className="filled"></div>
                      <IoLogoFacebook />
                    </Link>
                  </li>
                  <li className="icon-content">
                    <Link href="" aria-label="GitHub" data-social="github">
                      <div className="filled"></div>
                      <RiTwitterXLine />
                    </Link>
                  </li>
                  <li className="icon-content">
                    <Link
                      href="https://www.instagram.com/justbuytravel/"
                      aria-label="Instagram"
                      data-social="instagram"
                    >
                      <div className="filled"></div>
                      <AiFillInstagram />
                    </Link>
                  </li>
                  <li className="icon-content">
                    <Link
                      href="https://www.linkedin.com/company/just-buy-travel/"
                      aria-label="Linkdin"
                      data-social="Linkdin"
                    >
                      <div className="filled"></div>
                      <FaLinkedin />
                    </Link>
                  </li>
                </ul>
              </div>
              {/* (************) */}
              <div className="after">
                <img
                  src={getAssetPath("/footer/icon/Line22.png")}
                  alt="Just Buy Travel Logo"
                />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row items-center justify-center">
              {/* ****************************** icon  */}
              {/* ****************** links */}
              <div className="col-lg-8">
                <div className="footer_links">
                  <div className="link">
                    <ul className="flex p-0 items-center">
                      <li>
                        <Link href={"/about-us"}> About us</Link>
                      </li>
                      <li className="dot">
                        <GoDotFill />
                      </li>
                      <li>
                        <Link href={"/contact-us"}> Contact Us</Link>
                      </li>
                      <li className="dot">
                        <GoDotFill />
                      </li>
                      <li>
                        <Link href={"/privacy-policy"}> Privacy Policy</Link>
                      </li>
                      <li className="dot">
                        <GoDotFill />
                      </li>
                      <li>
                        <Link href={"/term-and-conditions"}>
                          Terms and Conditions
                        </Link>
                      </li>
                      <li className="dot">
                        <GoDotFill />
                      </li>
                      <li>
                        <Link href={"/desclimer"}> Disclaimer</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ********************************* nav_link in bottom ***********************************I */}

          <div className="footer_bottom_link ">
            <div className="link">
              <ul className="flex  items-center z-1 p-0 m-0">
                <li>
                  <Link href={"/hotels"}> Hotels</Link>
                </li>
                <li className="dot">
                  <GoDotFill />
                </li>
                <li>
                  <Link href={"/flights"}> Flights</Link>
                </li>
                <li className="dot">
                  <GoDotFill />
                </li>
                <li>
                  <Link href={"/book-cruises"}>Cruises</Link>
                </li>
                <li className="dot">
                  <GoDotFill />
                </li>
                <li>
                  <Link href={"/book-packages"}>Packages</Link>
                </li>
                <li className="dot">
                  <GoDotFill />
                </li>
                <li>
                  <Link href={"/blog"}>Blog</Link>
                </li>
              </ul>
            </div>
            <div className="mail_link z-1">
              <ul className="m-0 p-0">
                <li className="md_mail">
                  {/* mailto:support@example.com */}
                  <Link href={""} className="flex items-center gap-1">
                    <strong className="g_color">
                      <TbMailFilled />
                    </strong>{" "}
                    support@justbuytravel.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* ****************************** bottom footer */}
          <div className="botom_footer">
            <div className="web_address">
              <p className="m-0">@2026 justbuytravel. All rights reserved</p>
            </div>
          </div>
          {/* ******************************************************************** botton ooter */}
        </footer>
      </section>
      <button
        type="button"
        title="Scroll to top"
        aria-label="Scroll to top"
        className={`bottom-to-top ${visible ? "show" : ""}`}
        onClick={scrollToTop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            scrollToTop();
          }
        }}
      >
        <FaChevronUp />
      </button>
    </>
  );
}
