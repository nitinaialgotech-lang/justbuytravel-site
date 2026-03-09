"use client"
import React, { useState, useEffect } from 'react'
import './faq.css'
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'How does Just Buy Travel work as a travel research platform?',
        content: <>
            Just Buy Travel works as a travel research platform that helps users compare hotels, flights, holidays, and cruises using trusted third-party travel websites before making a booking decision
        </>,
        key: "0"
    },
    {
        title: 'Can I book hotels or flights directly on Just Buy Travel?',
        content: <>
            No. Just Buy Travel does not process hotel or flight bookings directly. We help users compare hotel booking sites and flight comparison websites, then redirect them to trusted platforms to complete the booking.
        </>,
        key: "1"
    },
    {
        title: 'Which are the best hotel booking sites to compare on Just Buy Travel?',
        content: 'Just Buy Travel compares popular and trusted hotel booking sites, allowing users to research hotel prices, availability, and options in one place before choosing the best platform.',
        key: "2"
    },
    {
        title: 'Does Just Buy Travel show real hotel and flight prices?',
        content: <>
            Yes. Just Buy Travel displays hotel and flight prices provided by trusted travel websites. Final prices, availability, and taxes are confirmed on the partner website before booking.
        </>,
        key: "3"
    },
    {
        title: 'Is Just Buy Travel suitable for worldwide and international travel research?',
        content: <>
            Yes. Just Buy Travel supports worldwide travel research, helping users compare hotels and flights globally using the best online travel websites for international trips.

        </>,
        key: "4"
    }
]

export default function FaqSection() {
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
                    <p>
                        Simple answers to help you plan your stay with ease.

                    </p>
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
