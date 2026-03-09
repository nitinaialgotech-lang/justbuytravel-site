import Link from 'next/link';
import SearchHotelDetail from '@/Components/SearchResultPage/HotelDetail/SearchHotelDetail';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import Blog_Detail from '@/Components/Blogs/Blog_Detail/Blog_Detail';
import Blog_Right_Sidebar from '@/Components/Blogs/Blog_Right_Section/Blog_Right_Sidebar';
import { redirect } from 'next/navigation';
import { GetHotel_Detail, Get_Blog_By_Slug, Get_Blog_category } from '@/app/Route/endpoints';
import { generateHotelMetadata, generateBlogMetadata, generateHotelStructuredData, generateBlogStructuredData, generateBreadcrumbStructuredData, getHotelIdFromSlug, getPlaceTypeFromTypes } from '@/app/utils/seo';
import { SlCalender } from 'react-icons/sl';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import "../../../style/responsive.css";

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
    return [];
}

// Generate dynamic metadata for hotel or blog (when /hotel/slug is a blog post from Hotel category)
export async function generateMetadata({ params, searchParams }) {
    try {
        const { slug } = await params;
        const { id } = searchParams;
        const placeId = id || (slug ? getHotelIdFromSlug(slug) : null);

        if (id && placeId) {
            const response = await GetHotel_Detail(placeId);
            const hotel = response?.data;
            if (hotel) return generateHotelMetadata(hotel);
        }

        if (placeId) {
            const response = await GetHotel_Detail(placeId);
            const hotel = response?.data;
            if (hotel) return generateHotelMetadata(hotel);
        }

        const blog = await Get_Blog_By_Slug(slug);
        if (blog) {
            const categoriesRes = await Get_Blog_category();
            const categories = categoriesRes?.data || [];
            const firstCatId = blog.categories?.[0];
            const correctCat = categories.find((c) => Number(c.id) === Number(firstCatId));
            const categorySlug = (correctCat?.slug || 'travel-news').toLowerCase();
            return generateBlogMetadata(blog, categorySlug);
        }

        return {
            title: 'Hotel Details',
            description: 'View detailed hotel information, reviews, and prices.',
        };
    } catch (error) {
        console.error('Error generating hotel metadata:', error);
        return {
            title: 'Hotel Details',
            description: 'View hotel information and compare prices.',
        };
    }
}

export default async function HotelDetailPage({ params, searchParams }) {
    const { slug } = await params;
    const { id, hotel_id, code } = searchParams;
    const placeId = id || hotel_id || code || (slug ? getHotelIdFromSlug(slug) : null);

    try {
        if (id || hotel_id || code) {
            const response = await GetHotel_Detail(placeId);
            const place = response?.data;
            if (place) {
                const types = place?.types || place?.primaryType ? [place.primaryType] : [];
                const placeType = getPlaceTypeFromTypes(types);
                if (placeType === 'attraction') redirect(`/attraction/${slug}`, 308);
                if (placeType === 'restaurant') redirect(`/restaurant/${slug}`, 308);

                const hotelName = place?.displayName?.text || place?.name || 'Hotel';
                const structuredData = generateHotelStructuredData(place);
                const breadcrumbData = generateBreadcrumbStructuredData([
                    { name: 'Home', path: '/' },
                    { name: 'Hotels', path: '/hotels' },
                    { name: hotelName, path: `/hotel/${slug}?id=${placeId}` }
                ]);
                return (
                    <>
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
                        <SearchHotelDetail />
                    </>
                );
            }
        }

        if (placeId) {
            const response = await GetHotel_Detail(placeId);
            const place = response?.data;
            if (place) {
                const types = place?.types || place?.primaryType ? [place.primaryType] : [];
                const placeType = getPlaceTypeFromTypes(types);
                if (placeType === 'attraction') redirect(`/attraction/${slug}`, 308);
                if (placeType === 'restaurant') redirect(`/restaurant/${slug}`, 308);

                const hotelName = place?.displayName?.text || place?.name || 'Hotel';
                const structuredData = generateHotelStructuredData(place);
                const breadcrumbData = generateBreadcrumbStructuredData([
                    { name: 'Home', path: '/' },
                    { name: 'Hotels', path: '/hotels' },
                    { name: hotelName, path: `/hotel/${slug}?id=${placeId}` }
                ]);
                return (
                    <>
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
                        <SearchHotelDetail />
                    </>
                );
            }
        }

        const [blog, categoriesRes] = await Promise.all([
            Get_Blog_By_Slug(slug),
            Get_Blog_category()
        ]);
        const categories = categoriesRes?.data || [];
        const hotelCategory = categories.find((c) => (c.slug || '').toLowerCase() === 'hotel');
        const postHasHotelCategory = hotelCategory && blog?.categories?.some((cid) => Number(cid) === Number(hotelCategory.id));

        if (blog && postHasHotelCategory) {
            const blogContent = blog?.content?.rendered || '';
            const blogImage = blog?.yoast_head_json?.og_image || [];
            const blogStructuredData = generateBlogStructuredData(blog, slug, 'hotel');
            const breadcrumbData = generateBreadcrumbStructuredData([
                { name: 'Home', path: '/' },
                { name: 'Blog', path: '/blog' },
                { name: blog.title?.rendered || 'Blog Post', path: `/hotel/${slug}` }
            ]);

            return (
                <>
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }} />
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
                    <Header />
                    <section className="Blog_Detail_section blog_pt blog_pb blog_pt">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="title flex flex-col gap-2 padding_b30">
                                        <div className="blog_section_left_bar">
                                            <div className="breadcrumb m-0">
                                                <p className="flex flex-wrap items-center gap-1 m-0">
                                                    <Link href="/" className="g_color_hover">Home</Link>
                                                    <span className="g_color"><MdKeyboardDoubleArrowRight /></span>
                                                    <Link href="/blog?category=hotel" className="g_color_hover">Hotel</Link>
                                                    <span className="g_color"><MdKeyboardDoubleArrowRight /></span>
                                                    <span className="breadcrumb_current" dangerouslySetInnerHTML={{ __html: blog.title?.rendered || blog.slug || '' }} />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="blog_banner_box p-0">
                                            <div className="title">
                                                <h1 className="capitalize" dangerouslySetInnerHTML={{ __html: blog.title?.rendered || blog.slug || '' }} />
                                            </div>
                                        </div>
                                        <div className="time_section flex gap-3 items-center ">
                                            <div className="month flex items-center gap-1">
                                                <span className="g_color"><SlCalender /></span>
                                                <span>
                                                    {blog?.date ? new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <div className="time flex items-center gap-1">
                                                <span className="g_color"><FaRegUserCircle /></span>
                                                <span>Written by {blog?.yoast_head_json?.author || 'JustBuyTravel'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Blog_Detail content={blogContent} blog_image={blogImage} load={false} />
                                </div>
                                <div className="col-lg-4">
                                    <Blog_Right_Sidebar />
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </>
            );
        }

        if (blog) {
            const { redirect } = await import('next/navigation');
            const firstCatId = blog.categories?.[0];
            const correctCat = categories.find((c) => Number(c.id) === Number(firstCatId));
            const categorySlug = (correctCat?.slug || 'travel-news').toLowerCase();
            redirect(`/${categorySlug}/${slug}`, 308);
        }

        return <SearchHotelDetail />;
    } catch (error) {
        if (error?.digest === 'NEXT_REDIRECT') throw error;
        console.error('Error loading hotel:', error);
        return <SearchHotelDetail />;
    }
}
