/**
 * Destination-specific metadata configuration
 * Customize SEO content for each destination page
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const destinationData = {
    'usa': {
        title: 'USA Travel Guide: Best Hotels, Attractions & Travel Deals',
        description: 'Discover the United States with our comprehensive travel guide. Find the best hotels, top attractions, travel tips, and exclusive deals for your American adventure.',
        keywords: 'USA travel, United States hotels, American attractions, USA vacation, visit USA, travel to America, USA tourism',
        image: `${basePath}/destination/usa.jpg`,
    },
    'dubai': {
        title: 'Dubai Travel Guide: Luxury Hotels, Desert Safari & Best Experiences',
        description: 'Experience the magic of Dubai. Explore luxury hotels, world-class shopping, desert safaris, and iconic landmarks. Book your Dubai vacation with the best deals.',
        keywords: 'Dubai travel, Dubai hotels, Dubai attractions, visit Dubai, Dubai vacation, UAE tourism, Dubai desert safari',
        image: `${basePath}/destination/dubai.jpg`,
    },
    'paris': {
        title: 'Paris Travel Guide: Romantic Hotels, Eiffel Tower & French Experience',
        description: 'Fall in love with Paris. Discover romantic hotels, iconic landmarks like the Eiffel Tower, charming cafes, and authentic French experiences. Plan your perfect Paris getaway.',
        keywords: 'Paris travel, Paris hotels, Eiffel Tower, visit Paris, Paris vacation, France tourism, romantic Paris',
        image: `${basePath}/destination/paris.jpg`,
    },
    'tokyo': {
        title: 'Tokyo Travel Guide: Best Hotels, Temples & Japanese Culture',
        description: 'Explore Tokyo\'s perfect blend of tradition and modernity. Find top hotels, ancient temples, cutting-edge technology, and authentic Japanese cuisine.',
        keywords: 'Tokyo travel, Tokyo hotels, Japan attractions, visit Tokyo, Tokyo vacation, Japan tourism, Tokyo culture',
        image: `${basePath}/destination/tokyo.jpg`,
    },
    'london': {
        title: 'London Travel Guide: Historic Hotels, Big Ben & British Heritage',
        description: 'Discover London\'s rich history and vibrant culture. Explore historic hotels, iconic landmarks, world-class museums, and traditional British experiences.',
        keywords: 'London travel, London hotels, visit London, London attractions, UK tourism, British heritage, Big Ben',
        image: `${basePath}/destination/london.jpg`,
    },
    'singapore': {
        title: 'Singapore Travel Guide: Modern Hotels, Gardens & Asian Fusion',
        description: 'Experience Singapore\'s unique blend of cultures. Find luxurious hotels, stunning gardens, diverse cuisine, and modern attractions in this garden city.',
        keywords: 'Singapore travel, Singapore hotels, visit Singapore, Singapore attractions, Singapore tourism, Gardens by the Bay',
        image: `${basePath}/destination/singapore.jpg`,
    },
    'sydney': {
        title: 'Sydney Travel Guide: Beachfront Hotels, Opera House & Australian Adventure',
        description: 'Explore Sydney\'s stunning harbor, iconic Opera House, beautiful beaches, and vibrant culture. Book your Australian adventure with exclusive deals.',
        keywords: 'Sydney travel, Sydney hotels, Sydney Opera House, visit Sydney, Australia tourism, Bondi Beach',
        image: `${basePath}/destination/sydney.jpg`,
    },
    'newyork': {
        title: 'New York Travel Guide: Manhattan Hotels, Statue of Liberty & Big Apple',
        description: 'Experience the city that never sleeps. Discover Manhattan hotels, Times Square, Central Park, and endless entertainment in New York City.',
        keywords: 'New York travel, NYC hotels, Manhattan attractions, visit New York, NYC vacation, Big Apple, Times Square',
        image: `${basePath}/destination/newyork.jpg`,
    },
    'goa': {
        title: 'Goa Travel Guide: Beach Resorts, Water Sports & Coastal Paradise',
        description: 'Relax in Goa\'s beach paradise. Find beachfront resorts, water sports, vibrant nightlife, and Portuguese heritage in India\'s favorite coastal destination.',
        keywords: 'Goa travel, Goa hotels, Goa beaches, visit Goa, Goa vacation, India tourism, beach resorts',
        image: `${basePath}/destination/goa.jpg`,
    },
    'canada': {
        title: 'Canada Travel Guide: Mountain Lodges, Natural Wonders & Great Outdoors',
        description: 'Discover Canada\'s breathtaking landscapes. Explore mountain lodges, pristine wilderness, cosmopolitan cities, and unforgettable natural wonders.',
        keywords: 'Canada travel, Canada hotels, Canadian attractions, visit Canada, Canada vacation, Rocky Mountains',
        image: `${basePath}/destination/canada.jpg`,
    },
    'australia': {
        title: 'Australia Travel Guide: Outback Adventures, Reef Diving & Wildlife',
        description: 'Explore Australia\'s diverse landscapes. From the Great Barrier Reef to the Outback, find unique wildlife, stunning beaches, and world-class hotels.',
        keywords: 'Australia travel, Australia hotels, Great Barrier Reef, visit Australia, Australian tourism, Outback adventure',
        image: `${basePath}/destination/australia.jpg`,
    },
    'denmark': {
        title: 'Denmark Travel Guide: Copenhagen Hotels, Viking History & Scandinavian Design',
        description: 'Discover Denmark\'s charm. Experience Copenhagen\'s design culture, Viking history, cozy cafes, and the happiest country in the world.',
        keywords: 'Denmark travel, Copenhagen hotels, visit Denmark, Danish culture, Scandinavia tourism, Copenhagen attractions',
        image: `${basePath}/destination/denmark.jpg`,
    },
    'ireland': {
        title: 'Ireland Travel Guide: Castle Hotels, Cliffs of Moher & Celtic Heritage',
        description: 'Experience Ireland\'s legendary hospitality. Explore castle hotels, dramatic cliffs, charming pubs, and rich Celtic heritage across the Emerald Isle.',
        keywords: 'Ireland travel, Irish hotels, visit Ireland, Cliffs of Moher, Irish tourism, Dublin attractions',
        image: `${basePath}/destination/ireland.jpg`,
    },
    'united-kingdom': {
        title: 'United Kingdom Travel Guide: Historic Castles, Countryside & British Culture',
        description: 'Explore the United Kingdom\'s rich heritage. From historic castles to rolling countryside, experience the best of England, Scotland, Wales, and Northern Ireland.',
        keywords: 'UK travel, United Kingdom hotels, visit UK, British attractions, UK tourism, English countryside',
        image: `${basePath}/destination/uk.jpg`,
    },
    'manchester': {
        title: 'Manchester Travel Guide: Football Heritage, Music Scene & Northern Charm',
        description: 'Discover Manchester\'s vibrant culture. Experience legendary football stadiums, music history, industrial heritage, and dynamic nightlife in Northwest England.',
        keywords: 'Manchester travel, Manchester hotels, visit Manchester, Manchester United, UK tourism, Manchester attractions',
        image: `${basePath}/destination/manchester.jpg`,
    },
    'glasgow': {
        title: 'Glasgow Travel Guide: Scottish Culture, Architecture & Friendly Locals',
        description: 'Experience Glasgow\'s warmth. Explore Victorian architecture, world-class museums, vibrant music scene, and authentic Scottish hospitality.',
        keywords: 'Glasgow travel, Glasgow hotels, visit Glasgow, Scotland tourism, Scottish culture, Glasgow attractions',
        image: `${basePath}/destination/glasgow.jpg`,
    },
    'san-francisco': {
        title: 'San Francisco Travel Guide: Golden Gate Bridge, Cable Cars & Bay Area',
        description: 'Explore San Francisco\'s iconic landmarks. From the Golden Gate Bridge to Alcatraz, experience the City by the Bay\'s unique culture and stunning views.',
        keywords: 'San Francisco travel, SF hotels, Golden Gate Bridge, visit San Francisco, Bay Area tourism, SF attractions',
        image: `${basePath}/destination/san-francisco.jpg`,
    },
    'saudi-to-india': {
        title: 'Saudi Arabia to India Travel Guide: Flight Deals & Travel Tips',
        description: 'Plan your journey from Saudi Arabia to India. Find the best flight deals, travel tips, visa information, and accommodation options for your trip.',
        keywords: 'Saudi to India travel, flights to India, India visa, Saudi Arabia travel, travel deals, India tourism',
        image: `${basePath}/destination/saudi-india.jpg`,
    },
};

/**
 * Get metadata for a destination, with fallback to dynamic generation
 */
export function getDestinationMetadata(destination) {
    return destinationData[destination] || null;
}
