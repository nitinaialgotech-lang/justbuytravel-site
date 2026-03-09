"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaHotel } from "react-icons/fa";
import { MdFlight } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { GrBike } from "react-icons/gr";
import { IoIosDocument } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";
import { CgMenuRightAlt } from "react-icons/cg";
import { FiPlus } from "react-icons/fi";
import { IoPricetag } from "react-icons/io5";
import Offcanvas from "react-bootstrap/Offcanvas";
import { getAssetPath } from "../app/utils/assetPath";
import CurrencyPicker from "./CurrencyPicker";
import "../app/globals.css";
import "../style/responsive.css";
import {
  HotelIcon,
  FlightIcon,
  CruiseIcon,
  PackagesIcon,
  HeaderBlogIcon,
  HeaderAboutUsIcon,
} from "./icons";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathnamne = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [servicesOpen, setServicesOpen] = useState(false);

  let closeTimeout;

  function openMenu() {
    clearTimeout(closeTimeout);
    setServicesOpen(true);
  }

  function closeMenu() {
    closeTimeout = setTimeout(() => {
      setServicesOpen(false);
    }, 150); // 150ms delay
  }
  const pathname = pathnamne ?? "";
  const isBookHotels = pathname.includes("hotels");
  const isBookFlights = pathname.includes("flights");
  const isBookCruises = pathname.includes("book-cruises");
  const isBookPackages = pathname.includes("book-packages");
  const isBlog = pathname.includes("/blog");
  const isAboutUs = pathname.includes("about-us");

  return (
    <>
      {/* ************************************************************************************************************ */}
      <section className="header_section">
        <div className="container">
          <Navbar expand="lg" className="">
            <Container fluid className="p-0">
              <Navbar.Brand
                as={Link}
                href="/"
                onClick={() => window.dispatchEvent(new Event("reset-search"))}
              >
                <img
                  src={getAssetPath("/logo/logo_svg.svg")}
                  width={176}
                  alt="Just Buy Travel - Your Trusted Travel Companion"
                />
              </Navbar.Brand>
              {/* *********************** */}
              <button onClick={handleShow} className="d-block d-lg-none">
                <CgMenuRightAlt size={30} />
              </button>

              {/* ************************ */}
              <div className="d-none d-lg-flex flex-grow-1 justify-content-end navbar_link_item">
                {/* ******** */}
                <Nav className="gap-4 nav-max-height-100" navbarScroll>
                  <Nav.Link
                    as={Link}
                    href="/hotels"
                    className={`capitalize ${isBookHotels ? "g_color" : ""}`}
                  >
                    <span>
                      <HotelIcon color={isBookHotels ? undefined : "#1D1F27"} />
                    </span>
                    <span className={isBookHotels ? "g_color" : ""}>
                      Hotels
                    </span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href="/flights"
                    className={`capitalize ${isBookFlights ? "g_color" : ""}`}
                  >
                    <span>
                      <FlightIcon
                        color={isBookFlights ? undefined : "#1D1F27"}
                      />
                    </span>
                    <span className={isBookFlights ? "g_color" : ""}>
                      Flights
                    </span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href="/book-cruises"
                    className={`capitalize ${isBookCruises ? "g_color" : ""}`}
                  >
                    <span>
                      <CruiseIcon
                        color={isBookCruises ? undefined : "#1D1F27"}
                      />
                    </span>
                    <span className={isBookCruises ? "g_color" : ""}>
                      Cruises
                    </span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href="/book-packages"
                    className={`capitalize ${isBookPackages ? "g_color" : ""}`}
                  >
                    <span>
                      <PackagesIcon
                        color={isBookPackages ? undefined : "#1D1F27"}
                      />
                    </span>
                    <span className={isBookPackages ? "g_color" : ""}>
                      Packages
                    </span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href="/blog"
                    className={`capitalize ${isBlog ? "g_color" : ""}`}
                  >
                    <span>
                      <HeaderBlogIcon color={isBlog ? undefined : "#1D1F27"} />
                    </span>
                    <span className={isBlog ? "g_color" : ""}>blog</span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href="/about-us"
                    className={`capitalize ${isAboutUs ? "g_color" : ""}`}
                  >
                    <span>
                      <HeaderAboutUsIcon
                        color={isAboutUs ? undefined : "#1D1F27"}
                      />
                    </span>
                    <span className={isAboutUs ? "g_color" : ""}>about us</span>
                  </Nav.Link>
                  <CurrencyPicker />
                </Nav>
                {/* ******** */}
              </div>
            </Container>
          </Navbar>

          {/* ********************  offcanvas */}
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className="fullscreen-offcanvas"
          >
            <Offcanvas.Header closeButton className="text-light header_shadow">
              <Offcanvas.Title>
                <div className="logo">
                  <img
                    src={getAssetPath("/logo/logo_svg.svg")}
                    width={100}
                    height={"auto"}
                    alt="Just Buy Travel - Your Trusted Travel Companion"
                  />
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            {/* ******************* */}
            <Offcanvas.Body className="p-0">
              <div className="mega-menu">
                <div className="container p-0">
                  <div className="row flex justify-center items-center">
                    <div className="col-md-12">
                      <div className="mega_menu_item">
                        <div className="mega_menu_link">
                          <ul>
                            <li>
                              <Link
                                href={"/hotels"}
                                className={`flex justify-between items-center ${isBookHotels ? "g_color" : ""}`}
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <span>
                                    <img
                                      className="icon_link"
                                      src={getAssetPath(
                                        "/header_icon/icon_hotel.webp",
                                      )}
                                      alt=""
                                    />
                                  </span>
                                  <span>Hotels</span>
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={"/flights"}
                                className={`flex justify-between items-center ${isBookFlights ? "g_color" : ""}`}
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <span>
                                    <img
                                      className="icon_link"
                                      src={getAssetPath(
                                        "/header_icon/icon_flight.webp",
                                      )}
                                      alt=""
                                    />
                                  </span>
                                  <span>Flights</span>
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={"/book-cruises"}
                                className={`flex justify-between items-center ${isBookCruises ? "g_color" : ""}`}
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <span>
                                    <CruiseIcon />
                                  </span>
                                  <span>cruises</span>
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={"/book-packages"}
                                className={`flex justify-between items-center ${isBookPackages ? "g_color" : ""}`}
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <span>
                                    <PackagesIcon />
                                  </span>
                                  <span>Packages</span>
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={"/blog"}
                                className={`flex justify-between items-center ${isBlog ? "g_color" : ""}`}
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <span>
                                    <HeaderBlogIcon />
                                  </span>
                                  <span>blog</span>
                                </span>
                              </Link>
                            </li>

                            <li className="">
                              <Link
                                href={"/about-us"}
                                className={`flex justify-between items-center ${isAboutUs ? "g_color" : ""}`}
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <span>
                                    <HeaderAboutUsIcon />
                                  </span>
                                  <span>about us</span>
                                </span>
                              </Link>
                            </li>
                            <li className="">
                              <Link
                                href={""}
                                className="flex justify-between items-center"
                              >
                                <span className="flex gap-2 items-center capitalize">
                                  <CurrencyPicker />
                                </span>{" "}
                                {/* <span>
                                  <FiPlus />
                                </span> */}
                              </Link>
                            </li>
                            <div className="button_nav  text-center px-2 py-2 rounded">
                              <Link href={"#"} className="">
                                Subscriber
                              </Link>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Offcanvas.Body>
            {/* ******************** */}
          </Offcanvas>
        </div>
      </section>
    </>
  );
}
