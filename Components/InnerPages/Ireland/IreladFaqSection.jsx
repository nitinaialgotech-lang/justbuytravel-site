"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'Which hotels in Ireland allow pets?',
        content: <>
            Many hotels in Ireland welcome pets, especially countryside stays, coastal lodges, and select city hotels. Pet policies vary by property, so it’s best to check hotel rules, fees, and size limits before planning your stay.

        </>,
        key: "0"
    },
    {
        title: 'What are the best family-friendly hotels in Ireland?',
        content: <>
            Family-friendly hotels in Ireland often provide larger rooms, child-friendly facilities, and easy access to attractions. These hotels are commonly found near city centres, coastal towns, and popular tourist regions.
        </>,
        key: "1"
    },
    {
        title: 'Are there budget-friendly hotels available across Ireland?',
        content: 'Yes, Ireland offers many budget and affordable hotel options in cities and smaller towns. These stays usually provide essential amenities, convenient locations, and good value for short trips or extended stays.',
        key: "2"
    },
    {
        title: 'Can I find hotels in Ireland suitable for countryside or rural stays?',
        content: <>
            Ireland has a wide selection of countryside hotels and lodges, ideal for travellers seeking quiet surroundings, scenic views, and a relaxed atmosphere away from busy cities.
        </>,
        key: "3"
    },
    {
        title: 'How can I compare hotels in Ireland before booking?',
        content: <>
            Travellers can compare hotels in Ireland by reviewing locations, price ranges, amenities, and guest feedback through trusted travel comparison platforms before completing bookings on partner websites.

        </>,
        key: "4"
    }
]

export default function IreladFaqSection() {
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
