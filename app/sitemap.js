import { Get_All_Blog_Posts_For_Static, Get_All_Blog_Categories } from './Route/endpoints';

const RESERVED_SEGMENTS = new Set([
  'about-us', 'attraction', 'blog', 'blogs', 'book-cruises', 'book-flights', 'book-hotels',
  'book-packages', 'contact-us', 'desclimer', 'flights', 'hotel', 'hoteldetail',
  'hotels', 'hotels-in-australia', 'hotels-in-canada', 'hotels-in-denmark',
  'hotels-in-dubai', 'hotels-in-glasgow', 'hotels-in-goa', 'hotels-in-ireland',
  'hotels-in-manchester', 'hotels-in-new-york', 'hotels-in-paris', 'hotels-in-san-francisco',
  'hotels-in-singapore', 'hotels-in-sydney', 'hotels-in-tokyo', 'hotels-in-uk', 'hotels-in-usa',
  'my-favorite-travel-resources', 'privacy-policy', 'search',   'term-and-conditions',
  'restaurant',
  'view-all-hotels',
]);

export const dynamic = 'force-static';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hotels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/flights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/my-favorite-travel-resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/desclimer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/term-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // Country / city hotel landing pages
    {
      url: `${baseUrl}/hotels-in-uk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-usa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-australia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-canada`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-denmark`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-dubai`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-glasgow`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-goa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-ireland`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-manchester`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-new-york`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-paris`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-san-francisco`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-singapore`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-sydney`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hotels-in-tokyo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];



  // Fetch dynamic blog posts and categories (category URLs = canonical for blogs)
  let blogPages = [];
  try {
    const [blogs, categoriesRes] = await Promise.all([
      Get_All_Blog_Posts_For_Static(),
      Get_All_Blog_Categories(),
    ]);
    const categories = categoriesRes?.data || [];
    const idToSlug = Object.fromEntries(
      categories.map((c) => [String(c.id), (c.slug || '').toLowerCase()])
    );

    blogPages = blogs.flatMap(blog => {
      const lastModified =
        blog.modified || blog.date
          ? new Date(blog.modified || blog.date)
          : new Date();
      const entries = [];
      const categoryIds = blog.categories || [];
      for (const id of categoryIds) {
        const catSlug = idToSlug[String(id)];
        if (catSlug && !RESERVED_SEGMENTS.has(catSlug)) {
          entries.push({
            url: `${baseUrl}/${catSlug}/${blog.slug}`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
          });
          break;
        }
      }
      return entries;
    });
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  return [
    ...staticPages,
    ...blogPages,
  ];
}

