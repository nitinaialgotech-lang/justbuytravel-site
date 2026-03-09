"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: ' Can I book hotels in New York online through Just Buy Travel?',
        content: <>
            Yes, Just Buy Travel helps travellers compare options and then book hotels in New York City online using trusted booking partners for a secure experience.

        </>,
        key: "0"
    },
    {
        title: 'How can travellers find cheap hotel rooms in New York City?',
        content: <>
            Travellers can save money by choosing flexible dates, staying outside busy areas, and checking reviews. This often helps find cheap hotel rooms in New York City without losing comfort.
        </>,
        key: "1"
    },
    {
        title: ' Which areas are good to stay in New York for tourists?',
        content: 'Popular areas include central districts for sightseeing and nearby neighbourhoods with good transport access. Each area offers a different experience based on travel needs.',
        key: "2"
    },
    {
        title: ' Are there hotel options in New York suitable for families?',
        content: <>
            Yes, many hotels offer family-friendly rooms, extra space, and easy access to parks and attractions. Checking room details helps families choose wisely.
        </>,
        key: "3"
    },
    {
        title: 'Is it safe to book hotels through comparison websites?',
        content: <>
            Yes, booking through reliable comparison platforms is safe when they work with trusted partners. Always review hotel policies and guest feedback before confirming.

        </>,
        key: "4"
    }
]

export default function NewYorkFaqSection() {
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
