
"use client"
import React from 'react'
import Link from 'next/link'
import { SlCalender } from "react-icons/sl";
import { FaRegUserCircle } from "react-icons/fa";
import Blog_Right_Sidebar from '../Blog_Right_Section/Blog_Right_Sidebar';
import Blog_Detail from '../Blog_Detail/Blog_Detail';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import { Get_Blogs, Get_Blog_By_Slug, Get_Blog_category } from '@/app/Route/endpoints';
import { useSearchParams, useParams } from 'next/navigation';

export default function Blog_Detail_section({ initialSlug, initialPost }) {

    const blog_slug = useSearchParams();
    const params = useParams();
    const slug = initialSlug || params?.slug || blog_slug.get("detail");
    const hasSlug = Boolean(slug);

    const { data: singlePost, isLoading: isLoadingSingle } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => Get_Blog_By_Slug(slug),
        enabled: hasSlug && !initialPost,
    });
    const { data: listData, isLoading: isLoadingList } = useQuery({
        queryKey: ["blog"],
        queryFn: () => Get_Blogs(),
        enabled: !hasSlug,
    });
    const { data: categoriesData } = useQuery({
        queryKey: ["blog_category"],
        queryFn: () => Get_Blog_category()
    });

    const selectedPost = initialPost ?? (hasSlug ? singlePost : null) ?? listData?.posts?.find((item) => item?.slug === slug);
    const isLoading = hasSlug ? (initialPost ? false : isLoadingSingle) : isLoadingList;
    const categories = categoriesData?.data || [];
    const firstCategoryId = selectedPost?.categories?.[0];
    const category = categories.find((c) => Number(c.id) === Number(firstCategoryId));
    const blog_content = selectedPost?.content?.rendered || "";
    const blog_img = selectedPost?.yoast_head_json?.og_image || [];

    return (
        <>
            <section className='Blog_Detail_section blog_pt blog_pb blog_pt'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-8 '>

                            {selectedPost && (
                                <div className="title flex flex-col gap-2 padding_b30">
                                    {/* **************************************** */}
                                    <div className='blog_section_left_bar'>
                                        <div className="breadcrumb m-0">
                                            <p className='flex flex-wrap items-center gap-1 m-0'>
                                                <Link href="/" className="g_color_hover">Home</Link>
                                                <span className='g_color'><MdKeyboardDoubleArrowRight /></span>
                                                <Link href={`/blog?category=${category?.slug || ''}`} className="g_color_hover">{category?.name || "Blog"}</Link>
                                                <span className='g_color'><MdKeyboardDoubleArrowRight /></span>
                                                <span className="breadcrumb_current" dangerouslySetInnerHTML={{ __html: selectedPost?.title?.rendered || selectedPost?.slug || "" }} />
                                            </p>
                                        </div>
                                    </div>
                                    {/* **************************************** */}
                                    <div className="blog_banner_box p-0">
                                        <div className="title">
                                            <h1 className='capitalize' dangerouslySetInnerHTML={{ __html: selectedPost?.title?.rendered || selectedPost?.slug || "" }} />
                                        </div>
                                    </div>
                                    {/* **************************************** */}
                                    <div className="time_section flex gap-3 items-center ">
                                        <div className="month flex items-center gap-1">
                                            <span className='g_color'><SlCalender /></span>
                                            <span>
                                                {selectedPost?.date
                                                    ? new Date(selectedPost.date).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })
                                                    : ""}
                                            </span>
                                        </div>
                                        <div className="time flex items-center gap-1">
                                            <span className='g_color'>
                                                <FaRegUserCircle />
                                            </span>
                                            <span>
                                                Written by {selectedPost?.yoast_head_json?.author || "JustBuyTravel"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* **************************************** */}
                            <Blog_Detail content={blog_content} blog_image={blog_img} load={isLoading} />
                        </div>
                        <div className='col-lg-4'>
                            <Blog_Right_Sidebar />
                        </div>
                    </div>
                </div>
            </section>



        </>
    )
}
