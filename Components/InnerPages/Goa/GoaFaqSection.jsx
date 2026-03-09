"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'Are there cheap hotels in Goa near the beach?',
        content: <>
            Yes, Goa has several budget-friendly hotels near popular beaches. Prices depend on the season and location, so comparing hotel options on trusted booking platforms helps find affordable stays close to the beach.

        </>,
        key: "0"
    },
    {
        title: 'Which are the best hotels in Goa for families?',
        content: <>
            Goa offers many family-friendly hotels with spacious rooms, kid-friendly facilities, and safe locations. Families can compare hotel features and locations to choose a stay that fits their needs.
        </>,
        key: "1"
    },
    {
        title: 'Are there hotels in Goa near the airport?',
        content: 'Yes, there are hotels located near Goa’s airport that are convenient for early flights or short stays. Comparing nearby hotel options makes it easier to find suitable accommodation.',
        key: "2"
    },
    {
        title: 'Are beachfront hotels available in Goa?',
        content: <>
            Yes, Goa is known for its beachfront hotels offering direct access to the beach and sea views. Availability and prices vary, so checking multiple booking platforms is recommended.
        </>,
        key: "3"
    },
    {
        title: 'Can I book hotels in Goa online?',
        content: <>
            Yes, hotels in Goa can be booked online through reliable third-party hotel booking websites. Comparing prices and reviews online helps travelers book with confidence.

        </>,
        key: "4"
    }
]

export default function GoaFaqSection() {
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

