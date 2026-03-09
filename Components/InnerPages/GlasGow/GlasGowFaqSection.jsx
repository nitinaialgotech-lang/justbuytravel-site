"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'Are there cheap hotels in Glasgow?',
        content: <>
            Yes, Glasgow has many budget and affordable hotel options across different areas. Prices can change based on location, season, and availability, so comparing hotels on trusted booking platforms helps find better deals.

        </>,
        key: "0"
    },
    {
        title: 'Can I book hotels in Glasgow online?',
        content: <>
            Yes, hotels in Glasgow can be booked online through reliable third-party hotel booking websites. Comparing options online makes it easier to check prices, locations, and guest reviews before booking.


        </>,
        key: "1"
    },
    {
        title: 'Which are the best family friendly hotels in Glasgow?',
        content: 'Glasgow offers several family-friendly hotels with spacious rooms, child-friendly facilities, and convenient locations. Families can compare hotel features to find stays that suit their needs and budget.',
        key: "2"
    },
    {
        title: 'Are there last minute hotel deals in Glasgow?',
        content: <>
            Yes, last-minute hotel deals are sometimes available in Glasgow, especially during quieter travel periods. Checking multiple booking platforms increases the chances of finding discounted stays.
        </>,
        key: "3"
    },
    {
        title: 'Is staying in Glasgow city centre a good option?',
        content: <>
            Yes, staying in Glasgow city centre is popular because it offers easy access to shopping areas, restaurants, entertainment venues, and public transport, making sightseeing more convenient.

        </>,
        key: "4"
    }
]

export default function GlasGowFaqSection() {
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
                                    <h3 className='fw-semibold '>{item.title}</h3>

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
