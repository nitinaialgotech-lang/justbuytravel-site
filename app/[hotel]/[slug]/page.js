import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import Blog_Detail from '@/Components/Blogs/Blog_Detail/Blog_Detail';
import Blog_Right_Sidebar from '@/Components/Blogs/Blog_Right_Section/Blog_Right_Sidebar';
import { Get_Blog_By_Slug, Get_All_Blog_Categories, Get_All_Blog_Posts_For_Static } from '@/app/Route/endpoints';
import { generateBlogMetadata, generateBlogStructuredData, generateBreadcrumbStructuredData } from '@/app/utils/seo';
import { SlCalender } from 'react-icons/sl';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import "../../../style/responsive.css";

// Reserved first segments that are actual app routes (not blog categories)
const RESERVED_SEGMENTS = new Set([
  'aboutus', 'blog', 'blogs', 'book-cruises', 'book-flights', 'book-hotels',
  'book-hotels-dubai', 'book-packages', 'contactus', 'denmark', 'desclimer',
  'faq', 'hotel', 'hoteldetail', 'hotels', 'hotels-in-australia', 'hotels-in-canada',
  'hotels-in-denmark', 'hotels-in-glasgow', 'hotels-in-goa', 'hotels-in-ireland',
  'hotels-in-manchester', 'hotels-in-new-york', 'hotels-in-paris', 'hotels-in-san-francisco',
  'hotels-in-uk', 'my-favorite-travel-resources', 'newyork', 'privacy-policy',
  'search', 'singapore', 'sydney', 'term-and-conditions', 'tokyo', 'usa',
  'view-all-hotels',
]);

function pickNonReservedCategorySlug(blog, categories) {
  for (const catId of blog?.categories || []) {
    const cat = categories.find((c) => Number(c.id) === Number(catId));
    const slugLower = (cat?.slug || '').toLowerCase();
    if (slugLower && !RESERVED_SEGMENTS.has(slugLower)) return slugLower;
  }
  return 'travel-news';
}

// Static export: pre-render all known (category, slug) blog paths at build time.
export async function generateStaticParams() {
  try {
    const [categoriesRes, allPosts] = await Promise.all([
      Get_All_Blog_Categories(),
      Get_All_Blog_Posts_For_Static(),
    ]);
    const categories = categoriesRes?.data || [];
    const idToSlug = Object.fromEntries(
      categories.map((c) => [String(c.id), (c.slug || '').toLowerCase()])
    );
    const params = [];
    for (const post of allPosts) {
      const slug = post.slug;
      if (!slug) continue;
      const categoryIds = post.categories || [];
      for (const id of categoryIds) {
        const categorySlug = idToSlug[String(id)];
        if (categorySlug && !RESERVED_SEGMENTS.has(categorySlug)) {
          params.push({ hotel: categorySlug, slug });
        }
      }
    }
    return params;
  } catch (err) {
    console.warn('generateStaticParams [hotel]/[slug]:', err?.message);
    return [];
  }
}

// Always render on server so category blog URLs work on Hostinger even when build had no API access.
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  try {
    const { hotel: categorySlug, slug } = await params;
    const categorySlugLower = (categorySlug || '').toLowerCase();

    if (RESERVED_SEGMENTS.has(categorySlugLower)) {
      return { title: 'Not Found' };
    }

    const [categoriesRes, blog] = await Promise.all([
      Get_All_Blog_Categories(),
      Get_Blog_By_Slug(slug),
    ]);
    const categories = categoriesRes?.data || [];
    const validCategorySlugs = categories.map((c) => (c.slug || '').toLowerCase());
    if (!validCategorySlugs.includes(categorySlugLower)) {
      return { title: 'Not Found' };
    }

    if (!blog) {
      return {
        title: 'Blog Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    return generateBlogMetadata(blog, categorySlugLower);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Travel Blog',
      description: 'Read our latest travel insights and tips.',
    };
  }
}

export default async function BlogDetailWithCategoryPage({ params }) {
  const { hotel: categorySlug, slug } = await params;
  const categorySlugLower = (categorySlug || '').toLowerCase();

  if (RESERVED_SEGMENTS.has(categorySlugLower)) {
    notFound();
  }

  try {
    const [categoriesRes, blog] = await Promise.all([
      Get_All_Blog_Categories(),
      Get_Blog_By_Slug(slug),
    ]);
    const categories = categoriesRes?.data || [];
    const validCategorySlugs = categories.map((c) => (c.slug || '').toLowerCase());

    if (!blog) {
      notFound();
    }

    if (!validCategorySlugs.includes(categorySlugLower)) {
      const targetSlug = pickNonReservedCategorySlug(blog, categories);
      if (targetSlug !== categorySlugLower) redirect(`/${targetSlug}/${slug}`, 308);
    }

    const categoryInUrl = categories.find((c) => (c.slug || '').toLowerCase() === categorySlugLower);
    const postCategoryIds = blog.categories || [];
    const postHasThisCategory = categoryInUrl && postCategoryIds.some((id) => Number(id) === Number(categoryInUrl.id));
    if (!postHasThisCategory) {
      const targetSlug = pickNonReservedCategorySlug(blog, categories);
      // Only redirect if different – otherwise we'd loop (e.g. blog only has "denmark", we're at /travel-news/slug)
      if (targetSlug !== categorySlugLower) redirect(`/${targetSlug}/${slug}`, 308);
    }

    const blogContent = blog?.content?.rendered || '';
    const blogImage = blog?.yoast_head_json?.og_image || [];
    const categoryForBreadcrumb = categories.find((c) => (c.slug || '').toLowerCase() === categorySlugLower);

    const blogStructuredData = generateBlogStructuredData(blog, slug, categorySlugLower);
    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: blog.title?.rendered || 'Blog Post', path: `/${categorySlug}/${slug}` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />

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
                        <Link href={`/blog?category=${categorySlug}`} className="g_color_hover">{categoryForBreadcrumb?.name || 'Blog'}</Link>
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
                        {blog?.date
                          ? new Date(blog.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : ''}
                      </span>
                    </div>
                    <div className="time flex items-center gap-1">
                      <span className="g_color">
                        <FaRegUserCircle />
                      </span>
                      <span>
                        Written by {blog?.yoast_head_json?.author || 'JustBuyTravel'}
                      </span>
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
  } catch (error) {
    if (error?.digest !== 'NEXT_HTTP_ERROR_FALLBACK;404') {
      console.error('Error loading blog:', error);
    }
    notFound();
  }
}
