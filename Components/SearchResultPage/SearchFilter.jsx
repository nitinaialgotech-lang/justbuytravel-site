import { CustomToggle } from '@/component/CustomToggle';
import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";
import Link from 'next/link';
export default function SearchFilter() {
    const [showDropdown, setShowDropdown] = useState(false);
    const menuRef = useRef(null);
    return (
        <>

            <section className='search_filter_section padding_b30  d-block d-lg-none'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 p-0">
                            <div className="search_filter">
                                <div className="filter_items">
                                    <div className="default flex ">
                                        <Dropdown
                                            show={showDropdown}
                                            onToggle={(isOpen) => setShowDropdown(isOpen)}
                                        >
                                            <Dropdown.Toggle
                                                as={CustomToggle}
                                                show={showDropdown}
                                                className="text-white capitalize"
                                            >
                                                <p className="m-0">Short By</p> : <span>Latest</span>
                                            </Dropdown.Toggle>

                                            <CSSTransition
                                                in={showDropdown}
                                                timeout={200}
                                                classNames="dropdown"
                                                unmountOnExit
                                                nodeRef={menuRef}
                                            >
                                                <Dropdown.Menu ref={menuRef} className='p-0'>
                                                    <Dropdown.Item>


                                                        <Link href={""}>Cheapest</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item><Link href={""}>Middle</Link></Dropdown.Item>
                                                    <Dropdown.Item><Link href={""}>Top Hotels</Link></Dropdown.Item>
                                                </Dropdown.Menu>
                                            </CSSTransition>
                                        </Dropdown>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >




        </>
    )
}
