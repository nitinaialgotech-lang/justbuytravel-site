
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import ReduxProvider from "./ReduxProvider";

export const dynamic = 'force-dynamic';

const metadata = {
  title: "Just Buy Travel",
  description: "Just Buy Travel is a travel agency that helps you find the best hotels and flights for your trip.",
  keywords: "travel, hotels, flights, packages, deals, discounts, travel agency, travel booking, travel planning",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/ico" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "2eXVbbybyASbG_ZLf-HKvKorBCAkehCJQfFmY_p_y-I",
  },
  openGraph: {
    title: "Just Buy Travel",
    description: "Just Buy Travel is a travel agency that helps you find the best hotels and flights for your trip.",
  },
};

export { metadata };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';



export default function RootLayout({ children }) {
  const layoutBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Just Buy Travel",
    "url": siteUrl,
    "logo": `${layoutBasePath}/android-chrome-192x192.png`,
    "description": "Travel made easy with Just Buy Travel. Explore honest reviews, best hotel offers, tours, attractions & dining deals—all in one place.",
    "sameAs": [
      // Add your social media links here
      // "https://www.facebook.com/justbuytravel",
      // "https://www.twitter.com/justbuytravel",
      // "https://www.instagram.com/justbuytravel"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Just Buy Travel",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <link rel="preload" href="/fonts/Gilroy-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Gilroy-Black.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="msvalidate.01" content="B4F829067BFD2025B044EFFA10053BAF" />

        {/* Travelpayout Tech Solutions: Content Analytics, LinkSwitcher, Emerald */}
        {/* Place first so it loads faster. Get script URL from: Travelpayouts → AI tools → your Project → Install & Activate */}
        {process.env.NEXT_PUBLIC_TRAVELPAYOUT_SCRIPT_SRC && (
          <Script
            src={process.env.NEXT_PUBLIC_TRAVELPAYOUT_SCRIPT_SRC}
            strategy="afterInteractive"
          />
        )}

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y79K6935MZ"
          strategy="afterInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y79K6935MZ');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {'send_to': 'G-Y79K6935MZ/lSTWCKuLh5IDENOrkoAD'});
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`antialiased`}
      >
        {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
        <ReduxProvider>
          {children}
        </ReduxProvider>

      </body>

    </html>
  );
}
