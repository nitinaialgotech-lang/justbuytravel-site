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
        if (!placeId) return { title: 'Attraction' };
        const response = await GetHotel_Detail(placeId);
        const place = response?.data;
        if (place) return generateHotelMetadata(place);
        return { title: 'Attraction' };
    } catch {
        return { title: 'Attraction' };
    }
}

export default async function AttractionDetailPage({ params, searchParams }) {
    const { slug } = await params;
    const placeId = searchParams?.id || searchParams?.hotel_id || searchParams?.code || (slug ? getHotelIdFromSlug(slug) : null);

    try {
        if (!placeId) return <SearchHotelDetail />;
        const response = await GetHotel_Detail(placeId);
        const place = response?.data;
        if (!place) return <SearchHotelDetail />;

        const name = place?.displayName?.text || place?.name || 'Attraction';
        const structuredData = generateHotelStructuredData(place);
        const breadcrumbData = generateBreadcrumbStructuredData([
            { name: 'Home', path: '/' },
            { name: 'Attractions', path: '/hotels' },
            { name, path: `/attraction/${slug}` },
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
