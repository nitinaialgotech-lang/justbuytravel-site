"use client"
import React, { useState, useEffect } from 'react'
import "../../HomePage/Faq/faq.css"
import { Accordion } from 'react-bootstrap'
import { GoPlusCircle } from "react-icons/go"
import { MdArrowOutward } from 'react-icons/md'

const DEFAULT_KEY = "0"

const FAQS = [
    {
        title: 'Are there luxury hotels near Eiffel Tower Paris?',
        content: <>
            Yes, travellers can find several luxury hotels near Eiffel Tower Paris that offer premium comfort, scenic surroundings, and convenient access to major landmarks.

        </>,
        key: "0"
    },
    {
        title: 'What are the best hotels to stay in Paris for tourists?',
        content: <>
            The best hotels to stay in Paris for tourists are usually located near central districts, popular attractions, and metro stations, making sightseeing easier and more efficient.
        </>,
        key: "1"
    },
    {
        title: 'Can I find cheap hotels in Paris city centre?',
        content: 'Yes, there are cheap hotels in Paris city centre, especially in nearby neighbourhoods with strong public transport connections and good value accommodation options.',
        key: "2"
    },
    {
        title: 'How do travellers choose the right hotel location in Paris?',
        content: <>
            Travellers often consider proximity to attractions, transport access, budget range, and guest reviews before selecting a suitable hotel area.
        </>,
        key: "3"
    },
    {
        title: 'Do hotel prices in Paris vary by season?',
        content: <>
            Yes, hotel prices in Paris change based on season, demand, and local events, so flexible travel dates can help travellers find better value.

        </>,
        key: "4"
    }
]

export default function Greece_Faq() {
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
