"use client"
import React, { useState, useEffect } from 'react'
import "../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'How can I choose the right hotel for my trip?',
        content: <>
            Choosing the right hotel becomes easier when you compare hotel prices online across multiple trusted travel platforms. This helps travelers understand price differences, locations, and available options before deciding where to stay.

        </>,
        key: "0"
    },
    {
        title: ' What is the best way to plan hotel stays online?',
        content: <>
            Planning hotel stays online works best when travelers research different platforms offering online hotel booking, allowing them to evaluate prices, features, and reliability before moving forward.

        </>,
        key: "1"
    },
    {
        title: 'How can travelers save money on hotel stays?',
        content: 'Travelers looking to save money should explore platforms that focus on cheap hotel booking online, which helps identify affordable accommodation options without compromising essential amenities.',
        key: "2"
    },
    {
        title: 'Is it possible to book hotels for international trips safely?',
        content: <>
            Yes, many travelers rely on trusted platforms for international hotel booking, especially when planning trips abroad. Comparing reliable websites helps ensure secure and well-informed decisions.
        </>,
        key: "3"
    },
    {
        title: 'How do I know which platform suits my travel needs best?',
        content: <>
            Understanding your travel requirements and researching multiple platforms helps identify the best hotel booking site based on destination, budget, and overall value.

        </>,
        key: "4"
    }
]
export default function Book_Hotel_Faq_section() {
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
