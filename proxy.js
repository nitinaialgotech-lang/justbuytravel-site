import { NextResponse } from 'next/server';

const BLOG_API = 'https://justbuytravel.in/wp-json/wp/v2';
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

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const blogPrefix = basePath ? `${basePath}/blog` : '/blog';
  if (!pathname.startsWith(blogPrefix + '/') || pathname === blogPrefix || pathname === blogPrefix + '') {
    return NextResponse.next();
  }
  const slug = pathname.slice(blogPrefix.length + 1).split('/')[0];
  if (!slug) return NextResponse.next();

  try {
    const [postsRes, categoriesRes] = await Promise.all([
      fetch(`${BLOG_API}/posts?slug=${encodeURIComponent(slug)}&per_page=1`, {
        headers: { Accept: 'application/json', 'User-Agent': 'JustBuyTravel/1.0 (https://justbuytravel.com)' },
        next: { revalidate: 0 },
      }),
      fetch(`${BLOG_API}/categories?per_page=100`, {
        headers: { Accept: 'application/json', 'User-Agent': 'JustBuyTravel/1.0 (https://justbuytravel.com)' },
        next: { revalidate: 60 },
      }),
    ]);

    const posts = await postsRes.json();
    const blog = Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
    if (!blog) return NextResponse.next();

    const categoriesData = await categoriesRes.json();
    const categories = Array.isArray(categoriesData) ? categoriesData : [];
    const categorySlug = pickNonReservedCategorySlug(blog, categories);
    const dest = basePath ? `${basePath}/${categorySlug}/${slug}` : `/${categorySlug}/${slug}`;
    return NextResponse.redirect(new URL(dest, request.url), 308);
  } catch (err) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/blog/:slug',  // Only /blog/:slug, not /blog
};
