"use client"
import React, { useState, useEffect } from 'react'
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'
import "../../HomePage/Faq/faq.css"

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'What types of hotels are available in Dubai?',
        content: <>
            Dubai offers a wide range of hotels, including budget hotels, luxury resorts, and 5-star hotels. Travelers can choose from city hotels, beachfront stays, and hotels near popular areas like Dubai Marina and Downtown Dubai.


        </>,
        key: "0"
    },
    {
        title: 'How can I find the best hotels in Dubai?',
        content: <>
            The best way to find hotels in Dubai is by comparing prices, locations, and guest reviews online. This helps you choose the right hotel based on your budget, travel plans, and preferred area.


        </>,
        key: "1"
    },
    // {
    //     title: 'How can travelers save money on hotel stays?',
    //     content: 'Travelers looking to save money should explore platforms that focus on cheap hotel booking online, which helps identify affordable accommodation options without compromising essential amenities.',
    //     key: "2"
    // },
    {
        title: 'Are there affordable and budget hotels in Dubai?',
        content: <>
            Yes, there are many budget and cheap hotels in Dubai that provide pleasant stay at reasonable prices. These hotels are ideal for travelers who want good value without spending too much.
        </>,
        key: "2"
    },
    {
        title: 'Which areas are the best places to stay in Dubai?',
        content: <>
            Popular places to stay in Dubai include areas near Dubai Mall for shopping, Dubai Marina for waterfront views, and central locations close to major attractions. Each area offers a different experience depending on your travel style.

        </>,
        key: "3"
    },
    {
        title: 'Can I find last-minute hotel deals in Dubai?',
        content: <>
            Yes, travelers can often find last-minute hotel deals in Dubai, especially during off-peak seasons. Comparing hotel options online can help you find good offers even when booking close to your travel date.

        </>,
        key: "4"
    }
]
export default function DubaiFaqSection() {
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
                    {/* <h5 >
                        Simple answers to help you plan your stay with ease.
                    </h5> */}
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
