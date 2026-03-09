"use client"
import React, { useState, useEffect } from 'react'
import "../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'How do I book flights with JustBuyTravel?',
        content: <>
            You can book airline tickets quickly by comparing choices and pricing from several sources.

        </>,
        key: "0"
    },
    {
        title: 'May I book international flights?',
        content: <>
            Absolutely! We specialise in cheap local and international flight bookings.
        </>,
        key: "1"
    },
    {
        title: 'How can I get the greatest deals?',
        content: 'JustBuyTravel provides affordable air tickets, the best flight offers today, and special flight booking deals.',
        key: "2"
    },
    {
        title: 'Will I receive a booking confirmation?',
        content: <>
            Yes, after you book airline tickets, your travel partner will email you an immediate confirmation.
        </>,
        key: "3"
    },
    {
        title: 'Are there any other miscellaneous charges?',
        content: <>
            Yes, after you book airline tickets, your travel partner will email you an immediate confirmation.

        </>,
        key: "4"
    }
]
export default function Flight_Faq_Section() {
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
        <section className="faq-wrapper  padding_bottom ">
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
