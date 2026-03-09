import Header from '@/component/Header'
import BookHotels_Banner from '@/Components/Book-Hotels/BookHotels_Banner'
import React, { Suspense } from 'react'

export const metadata = {
    title: "Book Hotels Online | Hotel Deals Online | Just Buy Travel",
    description: " Book hotels online and find the best hotel deals online with Just Buy Travel. Compare prices, explore cheap hotels, and book your stay securely worldwide.",
    keywords: "book hotels, hotel booking, cheap hotels, hotel deals, hotel reservations, accommodation booking, hotel comparison",
    openGraph: {
        title: "Book Hotels Online | Hotel Deals Online | Just Buy Travel",
        description: " Book hotels online and find the best hotel deals online with Just Buy Travel. Compare prices, explore cheap hotels, and book your stay securely worldwide.",
        type: "website",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/hotels`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function page() {
    const FaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How can I choose the right hotel for my trip?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Choosing the right hotel becomes easier when you compare hotel prices online across multiple trusted travel platforms. This helps travelers understand price differences, locations, and available options before deciding where to stay."
                }
            },
            {
                "@type": "Question",
                "name": "What is the best way to plan hotel stays online?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Planning hotel stays online works best when travelers research different platforms offering online hotel booking, allowing them to evaluate prices, features, and reliability before moving forward."
                }
            },
            {
                "@type": "Question",
                "name": "How can travelers save money on hotel stays?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Travelers looking to save money should explore platforms that focus on cheap hotel booking online, which helps identify affordable accommodation options without compromising essential amenities."
                }
            },
            {
                "@type": "Question",
                "name": "Is it possible to book hotels for international trips safely?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many travelers rely on trusted platforms for international hotel booking, especially when planning trips abroad. Comparing reliable websites helps ensure secure and well-informed decisions."
                }
            },
            {
                "@type": "Question",
                "name": "How do I know which platform suits my travel needs best?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Understanding your travel requirements and researching multiple platforms helps identify the best hotel booking site based on destination, budget, and overall value."
                }
            }
        ]
    }


    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
            />

            <Suspense >
                <Header />
                <BookHotels_Banner />
            </Suspense>
        </>
    )
}
