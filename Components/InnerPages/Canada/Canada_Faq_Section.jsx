"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'What types of hotels are available in Canada?',
        content: <>
            Canada offers a wide range of accommodation options, including budget hotels, mid-range stays, and luxury hotels. Travelers can find hotels in major cities, popular tourist destinations, and quieter regions across the country.

        </>,
        key: "0"
    },
    {
        title: 'Can I book hotels through your website?',
        content: <>
            We do not process hotel bookings directly. Our platform helps you research and compare hotels using trusted hotel booking partners, allowing you to choose the best option before completing your booking on the partner’s website.


        </>,
        key: "1"
    },
    {
        title: 'Are hotel prices the same on all booking websites?',
        content: 'Hotel prices may vary across booking platforms due to special offers, availability, and cancellation policies. Comparing multiple hotel booking websites helps you find the best prices and deals for your stay.',
        key: "2"
    },
    {
        title: 'Is it safe to book hotels through partner websites?',
        content: <>
            Yes, we work with trusted and well-known hotel booking platforms that follow secure payment and data protection standards. Always review hotel details, policies, and guest ratings before confirming your booking.
        </>,
        key: "3"
    },
    {
        title: 'Are affordable hotels in Canada suitable for families?',
        content: <>
            Yes, many affordable hotels in Canada are family-friendly and offer spacious rooms, convenient locations, and essential amenities. These hotels are ideal for family vacations, short stays, and longer trips.

        </>,
        key: "4"
    }
]


export default function Canada_Faq_Section() {

    const [activeKey, setActiveKey] = useState(DEFAULT_KEY)
    const [isDesktop, setIsDesktop] = useState(false)

    // Detect screen size
    useEffect(() => {
        const checkScreen = () => setIsDesktop(window.innerWidth >= 992)
        checkScreen()
        window.addEventListener('resize', checkScreen)
        return () => window.removeEventListener('resize', checkScreen)
    }, [])

    // Desktop hover
    const handleEnter = (key) => {
        if (isDesktop) {
            setActiveKey(key)
        }
    }

    // Restore default item on hover out
    const handleLeave = () => {
        if (isDesktop) {
            setActiveKey(DEFAULT_KEY)
        }
    }

    // Mobile click
    const handleClick = (key) => {
        if (!isDesktop) {
            setActiveKey(activeKey === key ? null : key)
        }
    }
    return (
        <section className="faq-wrapper  padding_bottom">
            <div className="container ">
                <div className="section_title ">
                    <h2 className='mb-0 capitalize'>
                        Frequently Asked Questions
                    </h2>
                    <h5 >
                        Simple answers to help you plan your stay with ease.
                    </h5>
                </div>
                <Accordion activeKey={activeKey}>
                    {FAQS.map((item) => (
                        <Accordion.Item
                            key={item.key}
                            eventKey={item.key}
                            className={activeKey === item.key ? "open" : ""}
                            onMouseEnter={() => handleEnter(item.key)}
                            onMouseLeave={handleLeave}
                        >
                            <Accordion.Header onClick={() => handleClick(item.key)}>
                                <div className="accordian_header flex justify-between items-center w-full header_accordian" id='accordian_gap'>
                                    <h3 className='fw-semibold capitalize'>{item.title}</h3>

                                    <div className="accordian_icon">
                                        {activeKey === item.key ? (
                                            <span className="bg-color-green">
                                                <MdArrowOutward className='bg-color-green text-white rounded-full p-1' />
                                            </span>
                                        ) : (
                                            <GoPlusCircle />
                                        )}
                                    </div>
                                </div>
                            </Accordion.Header>

                            <Accordion.Body>
                                <div className="accordion_body">
                                    <p>{item.content}</p>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </section>
    )

}
