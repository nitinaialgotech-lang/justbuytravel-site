import Link from 'next/link'
import React from 'react'

export default function Trusted_Partner_Banner() {
    return (
        <>
            <section className='Trusted_Banner_Section padding_bottom padding_top'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="trusted_banner_img">
                                <div className="trusted_banner_inner">
                                    <div className="item">
                                        <div className="title">
                                            <h3 className='m-0'>
                                                Top Hotels Around the World
                                            </h3>
                                            <h2 className='m-0'>
                                                Book with JustBuyTravel
                                            </h2>
                                            <div className="search_sign_button flex gap-2 items-center"><Link className="sign-in-button bg-color-black text-white" variant="outline-success" href="">Book Hotels</Link></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section></>
    )
}
