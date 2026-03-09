"use client";

import Footer from "@/component/Footer";
import PackageDeals from "./PackageDeals";
import GuidePackage from "./GuidePackage";
import Trust_Guide_Section from "../Aboutus/Trust_Guide_Section";
import Blogs from "../HomePage/Blog/Blogs";
import FaqSection from "../HomePage/Faq/FaqSection";

export default function PackageBanner() {

    return (
        <>


            <section className='about_section only_content_banner relative'>
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-lg-12">
                            <div className="banner_box">
                                <div className="title text-center">
                                    <h1 className='capitalize'>
                                        Your Perfect Trip   <span>Packages</span>
                                    </h1>
                                    {/* <h5 className='capitalize'>
                                        <strong className='g_color'> JustBuyTravel</strong> Your Easy Way to Book Flights and Hotels
                                    </h5> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <PackageDeals />
            <GuidePackage />
            <Trust_Guide_Section />
            <Blogs />
            <FaqSection />





            <Footer />


        </>



    );

}
