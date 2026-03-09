"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'What types of hotels can I find in Australia?',
        content: <>
            Australia offers a wide range of hotels, including budget hotels, family-friendly stays, and luxury hotels. Travelers can choose options in city centers, coastal areas, and regional destinations.


        </>,
        key: "0"
    },
    {
        title: 'Are there affordable hotels available across Australia?',
        content: <>
            Yes, there are many affordable and budget hotels across Australia that provide clean rooms, good service, and convenient locations for different travel needs.


        </>,
        key: "1"
    },
    {
        title: 'How can I find the best hotel deals in Australia?',
        content: 'Comparing hotel prices online and checking different travel dates can help you find better hotel deals. Flexible travel plans often lead to better value.',
        key: "2"
    },
    {
        title: 'Are hotels in Australia suitable for family travel?',
        content: <>
            Yes, many hotels in Australia offer family-friendly features such as larger rooms, convenient locations, and services designed for traveling with children.
        </>,
        key: "3"
    },
    {
        title: 'Can I find last-minute hotel deals in Australia?',
        content: <>
            Yes, last-minute hotel deals are sometimes available, especially during off-peak travel periods or in less crowded destinations.

        </>,
        key: "4"
    }
]


export default function BaliFaq_Section() {
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
