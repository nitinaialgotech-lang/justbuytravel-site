import Link from 'next/link'
import React from 'react'

export default function TrustedPartner_content() {
    return (
        <>
            <section className='padding_top padding_bottom bg_grey'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="trusted_content_title section_title ">
                                <h2>
                                    MY FAVORITE TRAVEL RESOURCES
                                </h2>
                                <h3>
                                    Below are my favorite companies to use when I travel. They are always my starting point when I need to book a flight, accommodation, tour, or vehicle!
                                </h3>
                                <div className="content_order_list">
                                    <ul className='p-0 ps-3'>
                                        {/* ******** */}

                                        {/* ************* */}

                                        {/* ************* */}
                                        <li><Link href={""}>Hostelworld </Link> <span>This is the best hostel accommodation site out there, with the largest inventory, best search interface, and widest availability.</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>Booking.com</Link> <span>The best all-around booking site. It constantly provides the cheapest and lowest rates and has the widest selection of budget accommodation. In all my tests, it has always had the cheapest rates out of all the booking websites.</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>Take Walks </Link> <span> Walks offers in-depth history, food, and cultural tours in cities around the world. Its small-group tours offer exclusive behind-the-scenes access other companies can’t get and use really incredible and knowledgeable guides. I can’t recommend them enough.</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>Get Your Guide</Link> <span> This is a huge online marketplace for tours and excursions. It has tons of tour options in cities all around the world, including everything from cooking classes and walking tours to street art lessons!</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>SafetyWing </Link> <span>This site offers convenient and affordable plans tailored to digital nomads and long-term travelers. It has cheap monthly plans, great customer service, and an easy-to-use claims process that makes it perfect for those on the road.</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>World Nomads</Link> <span>World Nomads offers comprehensive plans for adventurous travelers who plan to do things like hiking, kayaking, and even some extreme sports like rock climbing or bungy jumping. With 200 different activities covered, World Nomads is the best choice for active travelers.</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>Discover Cars</Link> <span>Discover Cars is a car rental aggregator that can help you find the best deals for your next road trip. It pulls data from over 8,000 car rental locations to ensure you always find a great deal!</span></li>
                                        {/* ************* */}
                                        <li><Link href={""}>Trainline</Link> <span>If you are going to Europe and taking a lot of trains, use Trainline to book your tickets. They make it easy to get around the continent and they even sell Eurail passes! You can read about my experience using rail passes by clicking this link.</span></li>
                                        {/* ************* */}

                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
