"use client"
import Link from 'next/link'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Get_Blogs, Get_Blog_category } from '@/app/Route/endpoints'
import { getAssetPath } from '@/app/utils/assetPath'

export default function Blog_Right_Sidebar() {
    const { data, isLoading } = useQuery({
        queryKey: ["blog_sidebar_recent"],
        queryFn: () => Get_Blogs(),
    })
    const { data: categoriesData } = useQuery({
        queryKey: ["blog_category"],
        queryFn: () => Get_Blog_category(),
    })

    const posts = data?.posts || []
    const recentPosts = posts.slice(0, 4)
    const categories = categoriesData?.data || []
    const getPostHref = (post) => {
        const firstCatId = post?.categories?.[0]
        const cat = categories.find((c) => Number(c.id) === Number(firstCatId))
        const catSlug = cat?.slug
        return catSlug ? `/${catSlug}/${post?.slug || ""}` : `/blog/${post?.slug || ""}`
    }

    return (
        <>
            <div className="blog_post_section">
                <div className="post_title ">
                    <h4>
                        Recent Post
                    </h4>
                    {/* ************************** */}
                    <ul className="blog_post_box p-0">
                        {isLoading && (
                            <li>
                                <span className="box_post_title">
                                    <h5 className="m-0">Loading...</h5>
                                </span>
                            </li>
                        )}
                        {!isLoading && recentPosts.length === 0 && (
                            <li>
                                <span className="box_post_title">
                                    <h5 className="m-0">No posts found</h5>
                                </span>
                            </li>
                        )}
                        {!isLoading && recentPosts.map((post) => {
                            const title = post?.title?.rendered || post?.slug || "Post"
                            const imageUrl =
                                post?.yoast_head_json?.og_image?.[0]?.url ||
                                getAssetPath("/blog/Budget-Travel.webp")
                            const date = post?.date
                                ? new Date(post.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : ""

                            return (
                                <li key={post?.id || post?.slug}>
                                    <Link href={getPostHref(post)} className="post_img">
                                        <img src={imageUrl} className="rounded" alt={title} />
                                    </Link>
                                    <Link href={getPostHref(post)} className="box_post_title text-decoration-none text-dark">
                                        <h5 className="m-0">
                                            {title}
                                        </h5>
                                        {date && (
                                            <p className="m-0">
                                                {date}
                                            </p>
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    {/* ************************** */}
                </div>

            </div>


        </>
    )
}
