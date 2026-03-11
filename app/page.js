
// import SearchSection from "@/Components/HomePage/SearchSectionhhh";

import IndexPage from "@/Components/HomePage/IndexPage/IndexPage";
import "../style/responsive.css"


export const metadata = {
  title: "Smart Travel Planning for Hotels & Flights | Just Buy Travel",
  description: "Plan smart trips with verified hotel and flight options. Compare prices, read genuine reviews, and book with confidence for every trip with Just Buy Travel",
  keywords: "travel deals, hotel reviews, travel booking, vacation packages, destination guides, travel tips, hotel comparison, travel offers, cheap flights, travel destinations",
  openGraph: {
    title: "Smart Travel Planning for Hotels & Flights | Just Buy Travel",
    description: "Plan smart trips with verified hotel and flight options. Compare prices, read genuine reviews, and book with confidence for every trip with Just Buy Travel",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}`,
  },
};

export default function Home() {
  // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';
  const FaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does Just Buy Travel work as a travel research platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Just Buy Travel works as a travel research platform that helps users compare hotels, flights, holidays, and cruises using trusted third-party travel websites before making a booking decision."
        }
      },
      {
        "@type": "Question",
        "name": "Can I book hotels or flights directly on Just Buy Travel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Just Buy Travel does not process hotel or flight bookings directly. We help users compare hotel booking sites and flight comparison websites, then redirect them to trusted platforms to complete the booking."
        }
      },
      {
        "@type": "Question",
        "name": "Which are the best hotel booking sites to compare on Just Buy Travel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Just Buy Travel compares popular and trusted hotel booking sites, allowing users to research hotel prices, availability, and options in one place."
        }
      },
      {
        "@type": "Question",
        "name": "Does Just Buy Travel show real hotel and flight prices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Just Buy Travel displays hotel and flight prices provided by trusted travel websites. Final prices, availability, and taxes are confirmed on the partner website before booking."
        }
      },
      {
        "@type": "Question",
        "name": "Is Just Buy Travel suitable for worldwide and international travel research?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Just Buy Travel supports worldwide travel research, helping users compare hotels and flights globally using the best online travel websites."
        }
      }
    ]
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Just Buy Travel",
    "url": "https://justbuytravel.com/",
    "logo": "https://justbuytravel.com/logo/logo.png.webp",
    "sameAs": [
      "https://www.facebook.com/people/Just-buy-Travel/61577152502232/",
      "https://www.instagram.com/justbuytravel/",
      "https://www.linkedin.com/company/just-buy-travel/",
      ""
    ]
  }
  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Just Buy Travel",
    "url": "https://justbuytravel.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://justbuytravel.com//search?lat={lat}&long={long}&name={search_term_string}{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }




  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />


      <IndexPage />

    </>
  )
}
