"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'Are there cheap hotels in Denmark?',
        content: <>
            Yes, Denmark offers many budget-friendly hotel options across cities and smaller towns. Travelers can find clean, comfortable stays at reasonable prices by comparing locations, amenities, and guest reviews before booking.

        </>,
        key: "0"
    },
    {
        title: 'Can I book hotels in Denmark online?',
        content: <>
            Yes, you can book hotels in Denmark online through trusted hotel booking platforms. Just Buy Travel helps you compare listings, prices, and policies so you can choose the right option before completing your booking on a partner website.


        </>,
        key: "1"
    },
    {
        title: 'Are there last-minute hotels in Denmark?',
        content: 'Yes, travelers can often find last-minute hotels in Denmark, especially during off-peak seasons or less crowded travel periods. Availability depends on location and travel dates, so flexibility can help secure better options.',
        key: "2"
    },
    {
        title: 'How can I find the best Denmark hotel deals?',
        content: <>
            The best Denmark hotel deals are usually found by comparing multiple booking platforms, checking flexible dates, and reviewing cancellation policies. Early planning and regular price comparisons can also help you save more.
        </>,
        key: "3"
    },
    {
        title: 'Is it safe to book hotels through comparison websites?',
        content: <>
            Yes, booking through reliable comparison platforms is safe when they work with trusted hotel partners. Always review hotel details, guest ratings, and booking terms before confirming your stay.

        </>,
        key: "4"
    }
]

export default function DenMarkFaqSection() {
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
