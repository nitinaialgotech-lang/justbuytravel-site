import SearchHotelDetail from '@/Components/SearchResultPage/HotelDetail/SearchHotelDetail';
import { GetHotel_Detail } from '@/app/Route/endpoints';
import { generateHotelMetadata, generateHotelStructuredData, generateBreadcrumbStructuredData, getHotelIdFromSlug } from '@/app/utils/seo';
import "../../../style/responsive.css";

export const dynamic = 'force-dynamic';
export function generateStaticParams() { return []; }

export async function generateMetadata({ params, searchParams }) {
    try {
        const { slug } = await params;
        const placeId = searchParams?.id || (slug ? getHotelIdFromSlug(slug) : null);
        if (!placeId) return { title: 'Restaurant' };
        const response = await GetHotel_Detail(placeId);
        const place = response?.data;
        if (place) return generateHotelMetadata(place);
        return { title: 'Restaurant' };
    } catch {
        return { title: 'Restaurant' };
    }
}

export default async function RestaurantDetailPage({ params, searchParams }) {
    const { slug } = await params;
    const placeId = searchParams?.id || searchParams?.hotel_id || searchParams?.code || (slug ? getHotelIdFromSlug(slug) : null);

    try {
        if (!placeId) return <SearchHotelDetail />;
        const response = await GetHotel_Detail(placeId);
        const place = response?.data;
        if (!place) return <SearchHotelDetail />;

        const name = place?.displayName?.text || place?.name || 'Restaurant';
        const structuredData = generateHotelStructuredData(place);
        const breadcrumbData = generateBreadcrumbStructuredData([
            { name: 'Home', path: '/' },
            { name: 'Restaurants', path: '/hotels' },
            { name, path: `/restaurant/${slug}` },
        ]);

        return (
            <>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
                <SearchHotelDetail />
            </>
        );
    } catch {
        return <SearchHotelDetail />;
    }
}
