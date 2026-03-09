import React from 'react'
import "../app/globals.css"
export default function PopUpForm() {
    return (
        <>


            {/* **************** */}

            <div className="form_box">
                <div className="head">
                    <h4>
                        Get my best tips sent straight to you!
                    </h4>
                </div>
                {/* ************** */}
                <div className="mobile_search_box ">
                    <div className="mobole_boxs relative">
                        <form action="">
                            {/* ********** */}
                            <input
                                type="text"

                                className="block relative w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body input"
                                placeholder="Name"
                            />
                            {/* ********** */}
                            <input
                                type="text"

                                className="block relative w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body input"
                                placeholder="Email"
                            />
                            {/* ********** */}
                            <button type="submit"
                                className="  z-10 mt-2  bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2 w-full w-100  form_padding ">Search</button>
                            {/* ********** */}
                        </form>
                    </div>
                </div>


            </div>



        </>
    )
}
