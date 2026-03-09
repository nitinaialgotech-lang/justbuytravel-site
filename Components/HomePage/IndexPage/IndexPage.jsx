"use client"
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import { getAssetPath } from "@/app/utils/assetPath";
import Blogs from "@/Components/HomePage/Blog/Blogs";
import DestinationSection from "@/Components/HomePage/DestinationSection/DestinationSection";
import ExperienceExploreSection from "@/Components/HomePage/ExpereinceExploreSection/ExperienceExploreSection";
import GetOfferSection from "@/Components/HomePage/GetOfferSection/GetOfferSection";
import HomeBannerSection from "@/Components/HomePage/HomeBannerSection";
import FaqSection from "@/Components/HomePage/Faq/FaqSection";
import Trust_Guide_Section from "@/Components/Aboutus/Trust_Guide_Section";
import Recomended from "@/Components/HomePage/RecommendedSection/Recomended";
import Popup from "reactjs-popup";
import PopUpForm from "@/component/PopUpForm";

import { RxCross2 } from "react-icons/rx";
import 'reactjs-popup/dist/index.css';
import { useEffect, useState } from "react";
import store from "@/Components/Redux/Store";
export default function IndexPage() {
    // const [open, setOpen] = useState(false);
    // useEffect(() => {
    //     const lastShown = sessionStorage.getItem("popupLastShown");
    //     const now = new Date().getTime();
    //     const TEN_MINUTES = 10 * 60 * 1000;


    //     if (!lastShown || now - parseInt(lastShown) > TEN_MINUTES) {
    //         setTimeout(() => {
    //             setOpen(true);
    //             sessionStorage.setItem("popupLastShown", now.toString());
    //         }, 500);
    //     }
    // }, []);

    return (
        <>
            {/* <Popup open={open} onClose={() => setOpen(false)}  >
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-lg-12">
                            <div className="popup">
                                <div className="row ">
                                    <div className="col-lg-6 p-0">
                                        <div className="popup_inner">
                                            <div className="popup_logo">
                                                <img src={getAssetPath("/popup/popup_logo.webp")} alt="" width={800} height={800} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 ">
                                        <div className="popup_form relative flex items-center">
                                            <div className="popup_form_item">
                                                <div className="popup_header_close absolute  top-4 end-5">
                                                    <button className=' bg-black text-amber-50 font-semibold' onClick={() => setOpen(false)}
                                                    >
                                                        <RxCross2 />
                                                    </button>
                                                </div>
                                                <PopUpForm />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Popup> */}
            {/* *********** */}

            <Header />
            {/* <Searchinput /> */}
            <HomeBannerSection />
            {/* <RecomendSection /> */}
            <Recomended />
            <ExperienceExploreSection />
            <DestinationSection />
            <Trust_Guide_Section />
            {/* <QuickLinks /> */}
            <Blogs />
            <FaqSection />
            <Footer />

        </>
    )
}
