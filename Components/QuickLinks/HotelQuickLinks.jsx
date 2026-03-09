import Link from 'next/link'
import React from 'react'

export default function HotelQuickLinks() {
    return (

        <div className="quick_links">
            <div className="quick_link_box">


                <div className="quick_link_items">
                    <h4 className="p-0 m-0">Asia Hotels</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="/hotels-in-dubai">Dubai Hotel</Link>,</li>
                        <li><Link href="/hotels-in-goa">Goa Hotel</Link>,</li>
                        <li><Link href="/hotels-in-singapore">Singapore Hotel</Link>,</li>
                        <li><Link href="/hotels-in-tokyo">Tokyo Hotel</Link></li>
                    </ul>
                </div>


                <div className="quick_link_items">
                    <h4 className="p-0 m-0">Europe Hotels</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="/hotels-in-denmark">Denmark Hotel</Link>,</li>
                        <li><Link href="/hotels-in-glasgow">Glasgow Hotel</Link>,</li>
                        <li><Link href="/hotels-in-ireland">Ireland Hotel</Link>,</li>
                        <li><Link href="/hotels-in-manchester">Manchester Hotel</Link>,</li>
                        <li><Link href="/hotels-in-paris">Paris Hotel</Link>,</li>
                        <li><Link href="/hotels-in-uk">United Kingdom Hotel</Link></li>
                    </ul>

                </div>


                <div className="quick_link_items">
                    <h4 className="p-0 m-0">North America Hotels</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="/hotels-in-canada">Canada Hotel</Link>,</li>
                        <li><Link href="/hotels-in-new-york">New York Hotel</Link>,</li>
                        <li><Link href="/hotels-in-san-francisco">San Francisco Hotel</Link>,</li>
                        <li><Link href="/hotels-in-usa">USA Hotel</Link></li>
                    </ul>

                </div>


                <div className="quick_link_items">
                    <h4 className="p-0 m-0">Australia Hotels</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="/hotels-in-australia">Australia Hotel</Link>,</li>
                        <li><Link href="/hotels-in-sydney">Sydney Hotel</Link></li>
                    </ul>

                </div>

            </div>
        </div>


    )
}
