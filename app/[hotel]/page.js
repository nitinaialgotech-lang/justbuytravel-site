import { notFound } from 'next/navigation';
import SearchHotelDetail from '@/Components/SearchResultPage/HotelDetail/SearchHotelDetail';
import { GetHotel_Detail } from '@/app/Route/endpoints';
import {
    generateHotelMetadata,
    generateHotelStructuredData,
    generateBreadcrumbStructuredData,
    getHotelIdFromSlug,
} from '@/app/utils/seo';
import "../../style/responsive.css";

const RESERVED_STATIC_SEGMENTS = new Set([
    'about-us',
    'blog',
    'blogs',
    'book-cruises',
    'book-packages',
    'contact-us',
    'desclimer',
    'flights',
    'hotels',
    'my-favorite-travel-resources',
    'privacy-policy',
    'search',
    'term-and-conditions',
    'view-all-hotels',
]);

// Pre-render a placeholder; allow all other [hotel] slugs at request time (avoids 404 for place slugs like /london-eye-ChIJ...).
export async function generateStaticParams() {
    return [{ hotel: "placeholder" }];
}
export const dynamicParams = true;

export async function generateMetadata({ params }) {
    try {
        // Await params in Next.js 15+
        const resolvedParams = await params;
        const slug = (resolvedParams?.hotel || '').toLowerCase();
        if (RESERVED_STATIC_SEGMENTS.has(slug)) {
            return {
                title: 'Not Found',
                robots: { index: false, follow: false },
            };
        }
        const hotelId = getHotelIdFromSlug(resolvedParams?.hotel);
        if (!hotelId) {
            return {
                title: 'Hotel Details',
                description: 'View detailed hotel information, reviews, and prices.',
            };
        }

        const response = await GetHotel_Detail(hotelId);
        const body = response?.data;
        const hotel = body?.displayName || body?.id ? body : body?.data ?? null;

        if (!hotel) {
            return {
                title: 'Hotel Details',
                description: 'View detailed hotel information, reviews, and prices.',
            };
        }

        return generateHotelMetadata(hotel);
    } catch {
        return {
            title: 'Hotel Details',
            description: 'View hotel information and compare prices.',
        };
    }
}

export default async function HotelDetailPage({ params }) {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams?.hotel;
        if (RESERVED_STATIC_SEGMENTS.has((slug || '').toLowerCase())) {
            notFound();
        }
        const hotelId = getHotelIdFromSlug(slug);

        // Only 404 when the URL is not a valid hotel slug (no place ID)
        if (!slug || !hotelId) {
            notFound();
        }

        let hotel = null;
        try {
            const response = await GetHotel_Detail(hotelId);
            // API returns hotel at top level (response.data) or wrapped in .data
            const body = response?.data;
            hotel = body?.displayName || body?.id ? body : body?.data ?? null;
        } catch {
            // API failed; hotel stays null, SearchHotelDetail will fetch on client
        }

        // Always render detail page when we have a valid place ID; let client handle loading/error
        if (!hotel) {
            return <SearchHotelDetail />;
        }

        const hotelName = hotel?.displayName?.text || hotel?.name || 'Hotel';
        const structuredData = generateHotelStructuredData(hotel);
        const breadcrumbData = generateBreadcrumbStructuredData([
            { name: 'Home', path: '/' },
            { name: 'Hotels', path: '/hotels' },
            { name: hotelName, path: `/${slug}` },
        ]);

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
                />
                <SearchHotelDetail />
            </>
        );
    } catch (error) {
        if (error?.digest === 'NEXT_HTTP_ERROR_FALLBACK;404') {
            throw error;
        }
        return <SearchHotelDetail />;
    }
}
