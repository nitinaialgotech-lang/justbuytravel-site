"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'What are the best hotels in the UK for tourists?',
        content: <>
            The UK offers a wide range of hotels for tourists, including city hotels, countryside stays, and family-friendly accommodations across popular destinations.

        </>,
        key: "0"
    },
    {
        title: 'Can I book hotels in the UK online easily?',
        content: <>
            Yes, you can book hotels in the UK online by comparing prices, checking availability, and choosing trusted hotel partners in one place.
        </>,
        key: "1"
    },
    {
        title: ' Are there affordable hotels in the UK for budget travelers?',
        content: 'Affordable hotels are available across the UK, offering comfortable stays with essential amenities for travelers on a budget.',
        key: "2"
    },
    {
        title: 'Do UK hotels offer free cancellation options?',
        content: <>
            Many hotels in the UK provide free cancellation or flexible booking policies, depending on the hotel and booking partner.
        </>,
        key: "3"
    },
    {
        title: 'Are luxury hotels available across major UK cities?',
        content: <>
            Yes, luxury hotels are widely available in major UK cities, offering premium services, modern amenities, and central locations.
        </>,
        key: "4"
    }
]

export default function UKFaq_Section() {
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
