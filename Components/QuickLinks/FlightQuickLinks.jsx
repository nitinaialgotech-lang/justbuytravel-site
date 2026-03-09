import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function FlightQuickLinks() {
    const pathname = usePathname();
    return (
        <div className="quick_links">

            {/* ================= Asia Flights ================= */}
            <div className="quick_link_box">
                <div className="quick_link_items">
                    <h4 className="m-0 p-0">Asia Flights</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="https://booking.tpx.lu/Bv7yjVYW">Dubai Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/2pMmP4fE">Goa Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/48690FgK">Singapore Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/SdK3bsvc">Tokyo Flight</Link></li>
                    </ul>

                </div>

                {/* ================= Europe Flights ================= */}
                <div className="quick_link_items">
                    <h4 className="m-0 p-0">Europe Flights</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="https://booking.tpx.lu/43aXKObz">London Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/uOvSVRTb">Denmark Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/ssoJb8XY">Glasgow Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/fqxoIB4J">Ireland Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/1OmiH8s2">Manchester Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/KkWbGc5Z">Paris Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/zH7lmRUV">United Kingdom Flight</Link></li>
                    </ul>

                </div>

                {/* ================= North America Flights ================= */}
                <div className="quick_link_items">
                    <h4 className="m-0 p-0">North America Flights</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="https://booking.tpx.lu/XaaklYe1">Canada Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/FUU52yPG">New York Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/0XpzXkIF">San Francisco Flight</Link> ,</li>
                        <li><Link href="https://expedia.tpx.lu/RWq9Vgmd">USA Flight</Link></li>
                    </ul>

                </div>

                {/* ================= Australia Flights ================= */}
                <div className="quick_link_items">
                    <h4 className="m-0 p-0">Australia Flights</h4>
                    <ul className="p-0 m-0 flex capitalize">
                        <li><Link href="https://booking.tpx.lu/zq0vtDIT">Australia Flight</Link> ,</li>
                        <li><Link href="https://booking.tpx.lu/QzcTVT3k">Sydney Flight</Link></li>
                    </ul>

                </div>
            </div>
        </div>


    )
    {/* <div className="quick_links ">
                            
                            <div className="quick_link_box">
                                <div className="quick_link_items">
                                 
                                    <ul className='p-0 flex capitalize'>
                                        <li ><Link href="https://booking.tpx.lu/Bv7yjVYW"> Dubai Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/43aXKObz">London Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/zq0vtDIT"> Australia Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/XaaklYe1"> Canada Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/uOvSVRTb"> Denmark Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/ssoJb8XY"> Glasgow Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/2pMmP4fE"> Goa Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/fqxoIB4J"> Ireland Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/1OmiH8s2"> Menchester Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/FUU52yPG"> New york Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/KkWbGc5Z"> Paris Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/0XpzXkIF"> San-francisco Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/zH7lmRUV"> United-kingdom Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/48690FgK"> Singapore Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/QzcTVT3k"> Sydney Flight</Link></li>
                                        <li ><Link href="https://booking.tpx.lu/SdK3bsvc"> Tokyo Flight</Link></li>
                                        <li ><Link href="https://expedia.tpx.lu/RWq9Vgmd"> USA Flight</Link></li>
                                    </ul>
                                </div>
                                <hr></hr>
                            </div>
                          

                        </div> */}



}
