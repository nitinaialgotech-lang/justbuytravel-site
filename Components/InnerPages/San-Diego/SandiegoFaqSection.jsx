"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'Are there good budget hotels in Manchester?',
        content: <>
            Yes. Manchester has plenty of budget-friendly hotels that still offer clean rooms, good transport links, and convenient locations. Compare prices by area and travel dates to find the best value, especially around weekends and event days.

        </>,
        key: "0"
    },
    {
        title: 'Which areas are best to stay in Manchester?',
        content: <>
            For central access, stay around the City Centre, Northern Quarter, Deansgate, or Piccadilly. If your trip is football-focused, hotels near Old Trafford can be a practical choice. Choose based on your plans, transport needs, and the type of stay you want.
        </>,
        key: "1"
    },
    {
        title: 'Can families find suitable hotels in the city?',
        content: 'Yes. Many hotels in Manchester offer family rooms, extra bedding options, and easy access to attractions, shopping areas, and public transport. Filtering for family-friendly stays helps narrow down the best options quickly.',
        key: "2"
    },
    {
        title: 'Do hotels offer flexible cancellation options?',
        content: <>
            Many hotels do offer flexible cancellation, but policies vary by property and rate type. Always check the cancellation terms shown before booking, especially for discounted or non-refundable deals.
        </>,
        key: "3"
    },
    {
        title: 'When is the best time to book a hotel in Manchester?',
        content: <>
            Booking early is usually best if you’re travelling during <span className='fw-semibold g_color'>major matches, concerts, holidays, or peak weekends.</span>  For normal dates, you can often find good deals by comparing prices across multiple properties and staying flexible with check-in days.

        </>,
        key: "4"
    }
]
export default function SandiegoFaqSection() {
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
