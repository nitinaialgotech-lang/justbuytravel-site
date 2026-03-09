/**
 * SEO Utility Functions for Dynamic Metadata Generation
 * Provides helpers for generating SEO-optimized metadata across the site
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';
const siteName = 'Just Buy Travel';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const imageBaseUrl = basePath ? `${siteUrl}${basePath}` : siteUrl;

/**
 * Generate metadata for blog posts
 * @param {Object} post - Blog post data from API
 * @param {string} [categorySlug] - Category slug for canonical URL (e.g. travel-news). When provided, uses /{categorySlug}/{slug} instead of /blog/{slug}
 * @returns {Object} Next.js metadata object
 */
export function generateBlogMetadata(post, categorySlug) {
    const title = post?.title?.rendered || post?.title || 'Travel Blog';
    const excerpt = post?.excerpt?.rendered 
        ? stripHtml(post.excerpt.rendered).substring(0, 160)
        : 'Read our latest travel blog post with tips, guides, and destination insights.';
    
    const featuredImage = post?.featured_image_url || 
                         post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                         `${imageBaseUrl}/logo/cropped-Frame.png`;
    
    const author = post?._embedded?.author?.[0]?.name || 
                   post?.author_name || 
                   'Just Buy Travel';
    
    const publishedDate = post?.date || new Date().toISOString();
    const modifiedDate = post?.modified || publishedDate;
    
    const slug = post?.slug || createSlug(title);
    const canonicalUrl = categorySlug
        ? `${siteUrl}/${categorySlug}/${slug}`
        : `${siteUrl}/blog/${slug}`;

    return {
        title,
        description: excerpt,
        keywords: extractKeywords(title, excerpt),
        authors: [{ name: author }],
        openGraph: {
            title,
            description: excerpt,
            url: canonicalUrl,
            siteName,
            type: 'article',
            publishedTime: publishedDate,
            modifiedTime: modifiedDate,
            authors: [author],
            images: [
                {
                    url: featuredImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: excerpt,
            images: [featuredImage],
            creator: '@justbuytravel',
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    };
}

/**
 * Generate metadata for hotel detail pages
 * @param {Object} hotel - Hotel data from API
 * @returns {Object} Next.js metadata object
 */
export function generateHotelMetadata(hotel) {
    const name = hotel?.displayName?.text || hotel?.name || 'Hotel Details';
    const description = hotel?.editorialSummary?.text || 
                       hotel?.description ||
                       `View detailed information, reviews, amenities, and best prices for ${name}. Compare rates and book your stay.`;
    
    const rating = hotel?.rating || hotel?.averageRating || 0;
    const reviewCount = hotel?.userRatingCount || hotel?.reviewCount || 0;
    const address = hotel?.formattedAddress || hotel?.address || '';
    
    const photos = hotel?.photos || [];
    const mainImage = photos.length > 0 
        ? `https://places.googleapis.com/v1/${photos[0].name}/media?maxHeightPx=1200&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
        : `${imageBaseUrl}/logo/cropped-Frame.png`;
    
    const slug = createHotelSlug(name, hotel?.id || '');
    const canonicalUrl = `${siteUrl}/${slug}`;

    const priceRange = hotel?.priceLevel ? '$'.repeat(hotel.priceLevel) : null;

    return {
        title: `${name} - Reviews, Photos & Best Prices`,
        description: description.substring(0, 160),
        keywords: `${name}, hotel booking, ${address}, hotel reviews, best hotel prices, accommodation`,
        openGraph: {
            title: `${name} - Find Best Deals`,
            description,
            url: canonicalUrl,
            siteName,
            type: 'website',
            images: [
                {
                    url: mainImage,
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${name} - Best Prices`,
            description,
            images: [mainImage],
            creator: '@justbuytravel',
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    };
}

/**
 * Generate metadata for destination pages
 * @param {string} destination - Destination name
 * @param {Object} customData - Additional custom data
 * @returns {Object} Next.js metadata object
 */
export function generateDestinationMetadata(destination, customData = {}) {
    const formattedName = destination
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    const title = customData.title || 
                  `${formattedName} Travel Guide: Hotels, Attractions & Best Deals`;
    
    const description = customData.description ||
                       `Discover the best of ${formattedName}. Find top hotels, attractions, restaurants, and travel deals. Plan your perfect ${formattedName} vacation with expert tips and reviews.`;
    
    const canonicalUrl = `${siteUrl}/${destination}`;
    
    const image = customData.image || `${imageBaseUrl}/logo/cropped-Frame.png`;

    return {
        title,
        description,
        keywords: `${formattedName} travel, ${formattedName} hotels, ${formattedName} attractions, ${formattedName} travel guide, visit ${formattedName}, ${formattedName} tourism, ${formattedName} vacation`,
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName,
            type: 'website',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: `${formattedName} Travel Guide`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@justbuytravel',
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    };
}

/**
 * Generate structured data (JSON-LD) for blog posts
 * @param {Object} post - Blog post data from API
 * @param {string} slug - Post slug
 * @param {string} [categorySlug] - Category slug for article URL (e.g. travel-news). When provided, uses /{categorySlug}/{slug} instead of /blog/{slug}
 */
export function generateBlogStructuredData(post, slug, categorySlug) {
    const title = post?.title?.rendered || post?.title || 'Travel Blog';
    const excerpt = post?.excerpt?.rendered 
        ? stripHtml(post.excerpt.rendered)
        : '';
    
    const featuredImage = post?.featured_image_url || 
                         post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                         `${imageBaseUrl}/logo/cropped-Frame.png`;
    
    const author = post?._embedded?.author?.[0]?.name || 
                   post?.author_name || 
                   'Just Buy Travel';
    
    const publishedDate = post?.date || new Date().toISOString();
    const modifiedDate = post?.modified || publishedDate;
    
    const articleUrl = categorySlug
        ? `${siteUrl}/${categorySlug}/${slug}`
        : `${siteUrl}/blog/${slug}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: excerpt,
        image: featuredImage,
        author: {
            '@type': 'Person',
            name: author,
        },
        publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
                '@type': 'ImageObject',
                url: `${imageBaseUrl}/logo/cropped-Frame.png`,
            },
        },
        datePublished: publishedDate,
        dateModified: modifiedDate,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
        url: articleUrl,
    };
}

/**
 * Generate structured data (JSON-LD) for hotels
 */
export function generateHotelStructuredData(hotel) {
    const name = hotel?.displayName?.text || hotel?.name || 'Hotel';
    const description = hotel?.editorialSummary?.text || hotel?.description || '';
    const rating = hotel?.rating || hotel?.averageRating || 0;
    const reviewCount = hotel?.userRatingCount || hotel?.reviewCount || 0;
    const address = hotel?.formattedAddress || hotel?.address || '';
    
    const photos = hotel?.photos || [];
    const images = photos.slice(0, 5).map(photo => 
        `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=1200&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );

    const priceRange = hotel?.priceLevel ? '$'.repeat(hotel.priceLevel) : undefined;

    return {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name,
        description,
        image: images,
        address: {
            '@type': 'PostalAddress',
            streetAddress: address,
        },
        ...(rating > 0 && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating,
                reviewCount: reviewCount,
                bestRating: '5',
                worstRating: '1',
            },
        }),
        ...(priceRange && { priceRange }),
    };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.path}`,
        })),
    };
}

/**
 * Helper function to strip HTML tags
 */
function stripHtml(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .trim();
}

/**
 * Helper function to create URL-friendly slugs
 */
export function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

/**
 * Create a hotel detail slug that ends with the place ID
 */
export function createHotelSlug(name, id) {
    const safeId = id ? String(id).trim() : '';
    const safeName = name ? createSlug(String(name)) : '';
    if (!safeName) return safeId;
    if (!safeId) return safeName;
    return `${safeName}-${safeId}`;
}

/** Place type prefix for detail URLs */
const PLACE_PREFIX = {
    hotel: '/hotel',
    attraction: '/attraction',
    restaurant: '/restaurant',
};

/**
 * Get the detail URL path for a place based on its type
 * @param {string} placeType - 'hotel' | 'attraction' | 'restaurant'
 * @param {string} name - Place name
 * @param {string} placeId - Google Place ID
 */
export function getPlaceDetailPath(placeType, name, placeId) {
    const prefix = PLACE_PREFIX[placeType] || PLACE_PREFIX.hotel;
    const slug = createHotelSlug(name || '', placeId);
    return `${prefix}/${slug}`;
}

/**
 * Infer place type from Google Places types array
 * @param {string[]} types - e.g. ['tourist_attraction'], ['restaurant'], ['lodging']
 */
export function getPlaceTypeFromTypes(types) {
    if (!Array.isArray(types)) return 'hotel';
    if (types.includes('tourist_attraction')) return 'attraction';
    if (types.includes('restaurant')) return 'restaurant';
    return 'hotel';
}

/**
 * Extract place ID from a hotel slug
 * Google Place IDs start with "ChIJ" and are typically 27 characters long
 * The ID is always at the end of the slug after the last hyphen
 */
export function getHotelIdFromSlug(slug) {
    if (!slug) return null;
    const slugStr = String(slug).trim();
    
    // Google Place IDs start with "ChIJ" - find the position where the ID starts
    const chijIndex = slugStr.lastIndexOf('ChIJ');
    if (chijIndex !== -1) {
        // Extract everything from "ChIJ" to the end
        return slugStr.substring(chijIndex);
    }
    
    // Fallback: if no "ChIJ" found, try to extract the last segment
    // This handles cases where the ID might be at the end
    const parts = slugStr.split('-');
    if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        // If the last part looks like a Place ID (starts with Ch and is long enough)
        if (lastPart && lastPart.length >= 20 && /^[A-Za-z0-9_-]+$/.test(lastPart)) {
            return lastPart;
        }
    }
    
    return null;
}

/**
 * Helper function to extract keywords from text
 */
function extractKeywords(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were'];
    
    const words = text
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 10).join(', ');
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Get default site metadata
 */
export function getDefaultMetadata() {
    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: "Just Buy Travel: Trusted Reviews, Travel Deals & Destination Ideas",
            template: "%s | Just Buy Travel"
        },
        description: "Travel made easy with Just Buy Travel. Explore honest reviews, best hotel offers, tours, attractions & dining deals—all in one place.",
        keywords: [
            "travel deals",
            "hotel reviews",
            "travel booking",
            "vacation packages",
            "destination guides",
        ],
        alternates: {
            canonical: siteUrl,
        },
    };
}

export { siteUrl, siteName, basePath };
