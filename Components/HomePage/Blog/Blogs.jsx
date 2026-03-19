'use client';
import Link from 'next/link'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import { Get_Blogs, Get_Blog_category } from '@/app/Route/endpoints';
import { useRouter } from 'next/navigation';
export default function Blogs() {
    // (((((((((((((((((())))))))))))))))))
    const [isBlogActive, BlogActive] = useState(true);
    const route = useRouter()
    // ******************************************************
    const { data, isLoading } = useQuery({
        queryKey: ["blog"],
        queryFn: () => Get_Blogs()
    })
    const { data: categoriesData } = useQuery({
        queryKey: ["blog_category"],
        queryFn: () => Get_Blog_category(),
    })
    const categories = categoriesData?.data || []
    const getBlogHref = (item) => {
        const firstCatId = item?.categories?.[0]
        const cat = categories.find((c) => Number(c.id) === Number(firstCatId))
        const catSlug = cat?.slug
        return catSlug ? `/${catSlug}/${item?.slug}` : `/blog/${item?.slug}`
    }

    if (isLoading) return <div className='pt-20 pb-20 text-center'>
        <h4>
            Blog is Loading .....
        </h4>
    </div>


    return (
        <>
            <section className='blog_section container padding_top padding_bottom  '>
                {/* <div className="blog flex justify-between items-center">
                    <div className="section_title ">
                        <h2 className='mb-0 capitalize'>
                            From the blog
                        </h2>
                        <p>
                            Read our travel blog for tips, destination ideas, and smart travel inspiration.
                        </p>
                    </div>
                    <div className="view_all_blog mt-2">
                        <button className="button_bg2 " onClick={() => route.push("/blog")}>View all</button>
                    </div>
                </div> */}
                <div className="d-none d-lg-block">
                    <div className="section_title relative flex items-center justify-between">
                        <span>
                            <h2 className="mb-0"> From the blog</h2>
                            <p>Read our travel blog for tips, destination ideas, and smart travel inspiration.</p>
                        </span>
                        <span className='font-semibold g_color'>
                            <button className='button_bg2 me-2 mt-4' onClick={() => route.push("/blog")}>view all</button>
                        </span>

                    </div>
                </div>

                {/* ************************** mobile view show  */}
                <div className="section_title  d-block d-lg-none">

                    <h2 className="mb-0">From the blog</h2>
                    <div className="section_title relative flex items-center justify-between">
                        <span>
                            <p>Read our travel blog for tips, destination ideas, and smart travel inspiration.</p>
                        </span>
                        <span className='font-semibold g_color'>
                            <button className='button_bg2 me-2 mt-2' onClick={() => route.push("/blog")}>view all</button>
                        </span>
                    </div>
                </div>
                {/* ********************** */}
                <div className="d-none d-lg-block">
                    <div className="row">
                        {
                            data?.posts?.slice(1, 5).map((item, i) => {
                                const limitWords = (text, limit) => {
                                    if (!text) return "";
                                    const words = text.split("");
                                    return words.length > limit
                                        ? words.slice(0, limit).join("") + " ..."
                                        : text;
                                };
                                return (

                                    <div className="col-12 col-md-6 col-lg-3" key={i}>
                                        {/* **************** */}
                                        <div className="blog_box">
                                            <div className="blog_img relative ">
                                                <img src={item?.yoast_head_json?.og_image?.map((item) => item?.url)} className='card_rounded' alt={item?.title?.rendered || "Travel blog post image"} />
                                                {/* <div className="inner_content absolute top-6 left-4"
                                                    Top Rated
                                                </div> */}
                                                <div className="content mt-2">
                                                    <Link href={getBlogHref(item)}>
                                                        {limitWords(item?.title?.rendered, 50)}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        {/* **************** */}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {/* ****************************************************************************************   display block >>>>>>>>>>>>>>>>>>>> */}
                <div className="container  d-block d-lg-none">

                    <div className="row relative">
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={15}

                            navigation={{
                                prevEl: "#blog_prev",
                                nextEl: "#blog_next",
                            }}
                            loop={true}
                            // autoplay={{
                            //     delay: 3200,
                            //     disableOnInteraction: false,
                            // }}
                            modules={[Navigation, Pagination]}
                            onSwiper={(swiper) => BlogActive(swiper.isBeginning)}
                            onSlideChange={(swiper) => BlogActive(swiper.isBeginning)}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1.5

                                },
                                375: {
                                    slidesPerView: 1.5

                                },
                                425: {
                                    slidesPerView: 1.5

                                },

                                640: {
                                    slidesPerView: 1.5
                                },

                                768: {
                                    slidesPerView: 2.5,
                                },
                                992: {
                                    slidesPerView: 4,
                                    spaceBetween: 24,
                                },
                            }}

                            className="mySwiper relative"
                        >
                            {
                                data?.posts?.map((item, i) => {

                                    return (


                                        <>

                                            <SwiperSlide key={i}>
                                                <div className="blog_box">
                                                    <div className="blog_img relative ">
                                                        <img src={item?.yoast_head_json?.og_image?.map((item) => item?.url)} className='card_rounded' alt={item?.title?.rendered || "Travel blog post image"} />
                                                        {/* <div className="inner_content absolute top-6 left-4">
                                                            Top Rated
                                                        </div> */}
                                                        <div className="content mt-2">
                                                            <Link href={getBlogHref(item)}>
                                                                {item?.title?.rendered}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>


                                            </SwiperSlide>
                                            {/* ********************** */}

                                        </>
                                    )



                                })
                            }
                        </Swiper>
                        <div className="button_swiper absolute ">
                            <div className="buttons_icon relative">


                                <button id='blog_prev' aria-label="Previous" className={`absolute ${isBlogActive ? 'd-none pointer-events-none' : ''}`}>
                                    <MdOutlineKeyboardArrowLeft size={30} />
                                </button>


                                <button id='blog_next' aria-label="Next" className='absolute'>
                                    <MdOutlineKeyboardArrowRight size={30} />
                                </button>
                            </div>
                        </div>

                    </div>


                </div>

            </section>

        </>
    )
}
