
"use client"
import React, { useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Nav } from "react-bootstrap";
import { FiSearch } from 'react-icons/fi';
import HotelIcon, { FlightIcon } from './icons';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import Search from '@/Components/HomePage/Search';
export default function SearchTab() {
    const [activeKey, setActiveKey] = useState("all");
    const [tabActive, setActiveTab] = useState("all");
    return (
        <>
            <div className="search_tab px-3">
                <div className="tab_link ms-1">
                    <Nav variant="tabs" activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                        <Nav.Item>
                            <Nav.Link eventKey="all" onClick={() => setActiveTab("all")}>
                                <span>
                                    {" "}
                                    <FiSearch />
                                </span>{" "}
                                <span>searchAll </span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="profile" onClick={() => setActiveTab("flights")}>

                                <span className="hover_icon">
                                    <FlightIcon />
                                </span>{" "}
                                <span>
                                    flights
                                </span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="hotels" onClick={() => setActiveTab("hotels")}>
                                <span className="hover_icon">
                                    <HotelIcon /></span>{" "}
                                <span>
                                    hotels
                                </span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='resoto'>
                            <Nav.Link eventKey="restaurants" onClick={() => setActiveTab("restaurants")}>
                                <span>
                                    <MdOutlineRestaurantMenu /></span>
                                {" "}
                                <span>
                                    Restaurants
                                </span>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
            </div>
            <Search tabActive={tabActive} />

        </>
    )
}
