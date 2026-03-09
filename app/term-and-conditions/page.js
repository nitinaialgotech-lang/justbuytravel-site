import React from 'react'
import Header from '@/component/Header'
import Footer from '@/component/Footer'
import Link from 'next/link';
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
  title: "Terms and Conditions | Just Buy Travel",
  description: "Read Just Buy Travel's terms and conditions to understand the rules and regulations for using our travel services and website.",
  keywords: "terms and conditions, terms of use, service terms, legal terms, user agreement",
  openGraph: {
    title: "Terms and Conditions | Just Buy Travel",
    description: "Read Just Buy Travel's terms and conditions for using our travel services.",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/term-and-conditions`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', path: '/' },
    { name: 'Terms and Conditions', path: '/term-and-conditions' }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <Header />
      <div className='container policies_pages mt-4'>
        <h1>Terms and Conditions</h1>
        <p>Welcome to Just Buy Travel. By accessing or using this website, you agree to comply with and be bound by these Terms and Conditions, along with any applicable laws and regulations. These terms apply to all visitors, users, and others who access the website for information or comparison purposes. Please read them carefully before using our services.</p>
        <p>Just Buy Travel provides travel-related information and hotel comparison content to help users make informed decisions. If you do not agree with any part of these terms, you should discontinue use of the website immediately. Continued use of the website confirms your acceptance of these Terms and Conditions.</p>
        <h3>1. Purpose of the Website</h3>
        <p>Just Buy Travel is an informational and hotel comparison platform. Our goal is to help users explore, compare, and discover hotels, travel options, and related services available through third-party providers.</p>
        <p>We do not own, operate, manage, or sell hotels, flights, or travel services directly.</p>
        <h3>2. Third-Party Links and Affiliate Relationships</h3>
        <p>Our website contains links to third-party booking platforms and travel service providers. Some of these links may be affiliate links, meaning we may earn a commission if you make a purchase through them, at no additional cost to you.</p>
        <p>All bookings, payments, cancellations, and customer support are handled directly by the third-party provider. Just Buy Travel is not responsible for third-party services, pricing, availability, or policies.</p>
        <h3>3. No Booking or Payment Processing</h3>
        <p>Just Buy Travel does not:</p>
        <ul>
          <li>Process hotel or travel bookings</li>
          <li>Collect payment or credit card information</li>
          <li>Guarantee prices, availability, or reservations</li>
        </ul>
        <p>All transactions occur on external websites operated by third-party partners.</p>
        <h3>4. Accuracy of Information</h3>
        <p>We strive to keep information accurate and up to date. However, prices, availability, hotel details, and policies may change without notice.</p>
        <p>We do not guarantee that all content on the website is complete, current, or error-free. Users should always verify details on the third-party booking website before completing a reservation.</p>
        <h3>5. User Responsibilities</h3>
        <p>By using this website, you agree to:</p>
        <ul>
          <li>Use the website for lawful purposes only</li>
          <li>Not misuse, copy, scrape, or disrupt the website</li>
          <li>Not rely solely on our content without independent verification</li>
        </ul>
        <p>You are responsible for reviewing the terms and policies of third-party websites before making any booking.</p>
        <h3>6. Prohibited Activities</h3>
        <p>You may not:</p>
        <ul>
          <li>Copy or reuse website content without permission</li>
          <li>Use automated tools (bots, scrapers, AI systems) to extract data</li>
          <li>Attempt to bypass website security or access restrictions</li>
          <li>Use the website for fraudulent or harmful purposes</li>
        </ul>
        <p>We reserve the right to restrict access if these terms are violated.</p>
        <h3>7. Intellectual Property</h3>
        <p>All website content, including text, logos, design, and graphics, is the property of Just Buy Travel unless otherwise stated.</p>
        <p>Unauthorized reproduction, distribution, or reuse of content is prohibited.</p>
        <h3>8. Reviews, Comments, and User Content</h3>
        <p>If users submit reviews, feedback, or other content, they grant Just Buy Travel a non-exclusive, royalty-free right to display and use that content for website and promotional purposes.</p>
        <p>Users are responsible for ensuring submitted content is accurate, lawful, and does not violate third-party rights.</p>
        <h3>9. Limitation of Liability</h3>
        <p>Just Buy Travel shall not be liable for:</p>
        <ul>
          <li>Errors, interruptions, or inaccuracies on the website</li>
          <li>Third-party booking issues, cancellations, or disputes</li>
          <li>Losses, damages, or inconveniences related to travel services</li>
        </ul>
        <p>Use of this website is at your own risk.</p>
        <h3>10. External Websites</h3>
        <p>Links to external websites are provided for convenience only. We do not control or endorse third-party websites and are not responsible for their content, policies, or practices.</p>
        <h3>11. Changes to These Terms</h3>
        <p>We may update these Terms and Conditions at any time without prior notice. Changes take effect immediately once published on this page.</p>
        <p>Continued use of the website indicates acceptance of the updated terms.</p>
        <h3>12. Governing Law and Jurisdiction</h3>
        <p>These Terms and Conditions shall be governed by and interpreted in accordance with applicable international laws, without reference to conflict-of-law principles.</p>
        <p>Users agree that any disputes shall be resolved in a competent jurisdiction as permitted by applicable law.</p>
        <h3>13. Contact Information</h3>
        <p>If you have questions about these Terms and Conditions, please contact us at:</p>
        <ul className='address_list'>
          <li>📧 Email: <a href="mailto:contact@justbuytravel.com">contact@justbuytravel.com</a></li>
          <li>🌐 Website: <a href="https://justbuytravel.com">https://justbuytravel.com</a></li>
        </ul>
      </div>
      <Footer />
    </>
  )
}
