"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'What are the best areas to stay in San Francisco?',
        content: <>
            Union Square suits travellers who want central access, Fisherman’s Wharf works well for first-time visits, and SoMa is ideal for business stays.

        </>,
        key: "0"
    },
    {
        title: 'Are there affordable hotels in San Francisco with good locations?',
        content: <>
            Yes. Many budget-friendly hotels are located near transit lines and popular districts, helping travellers save money without losing convenience.
        </>,
        key: "1"
    },
    {
        title: 'Are there pet friendly hotels San Francisco travellers can choose from?',
        content: 'Yes. Several hotels in San Francisco welcome pets, often offering pet-friendly policies, nearby walking areas, and flexible stay options.',
        key: "2"
    },
    {
        title: 'Are there hotels near San Francisco airport for early flights?',
        content: <>
            Yes. Airport-area hotels are convenient for early departures, late arrivals, or short overnight stays between connections.
        </>,
        key: "3"
    },
    {
        title: 'Can I book hotels in San Francisco directly through Just Buy Travel?',
        content: <>
            Just Buy Travel does not handle bookings directly. We help travellers review hotel options and pricing before completing bookings on trusted partner sites.

        </>,
        key: "4"
    }
]
export default function SanFrancFaqSection() {

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
