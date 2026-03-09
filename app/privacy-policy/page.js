import React from 'react'
import Header from '@/component/Header'
import Footer from '@/component/Footer'
import { generateBreadcrumbStructuredData } from '@/app/utils/seo'

export const metadata = {
  title: "Privacy Policy | Just Buy Travel",
  description: "Read Just Buy Travel's privacy policy to understand how we collect, use, and protect your personal information when you use our travel services.",
  keywords: "privacy policy, data protection, personal information, privacy rights, data security",
  openGraph: {
    title: "Privacy Policy | Just Buy Travel",
    description: "Read Just Buy Travel's privacy policy to understand how we protect your personal information.",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com'}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy-policy' }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <Header />
      <div className='container privacy_policy policies_pages mt-4'>
        <h1>Privacy Policy</h1>
        <p>
          <strong>At JustBuyTravel, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website. By using JustBuyTravel, you agree to the practices described in this policy.</strong>
        </p>
        <h3>Information We Collect</h3>
        <p>We do not require users to create accounts or provide personal details to browse our website. However, we may collect limited information in the following ways:</p>
        <ul>
          <li><strong>Non-personal information</strong> such as browser type, device information, IP address, pages visited, and referral sources.</li>
          <li><strong>Cookies and tracking technologies</strong> to improve website performance, user experience, and analytics.</li>
        </ul>
        <p>We do not collect sensitive personal data such as payment details, identification numbers, or passwords.</p>
        <h3>How We Use Your Information</h3>
        <p>The information we collect is used to:</p>
        <ul>
          <li>Improve website functionality and content</li>
          <li>Understand user behavior and preferences</li>
          <li>Monitor website performance and traffic</li>
          <li>Enhance security and prevent fraudulent activity</li>
        </ul>
        <p>We do not sell, trade, or rent user information to third parties.</p>
        <h3>Affiliate Links and Third-Party Websites</h3>
        <p>JustBuyTravel is a travel research and comparison platform. We may display affiliate links to third-party travel websites such as hotel, flight, holiday package, or cruise providers. When you click on these links, you are redirected to external websites.</p>
        <p>Please note:</p>
        <ul>
          <li>We do not control third-party websites</li>
          <li>Any bookings, transactions, or data shared on those websites are governed by their respective privacy policies</li>
          <li>We are not responsible for the privacy practices of external websites</li>
        </ul>
        <h3>Cookies Policy</h3>
        <p>We use cookies to:</p>
        <ul>
          <li>Analyze traffic and user interactions</li>
          <li>Improve website performance</li>
          <li>Provide a better browsing experience</li>
        </ul>
        <p>You can choose to disable cookies through your browser settings. However, some features of the website may not function properly if cookies are disabled.</p>
        <h3>Third-Party Services</h3>
        <p>We may use third-party services such as analytics tools to understand website usage. These services may collect non-personal data in accordance with their own privacy policies.</p>
        <p>JustBuyTravel does not share personal user data with third parties.</p>
        <h3>Data Security</h3>
        <p>We take reasonable measures to protect website data from unauthorized access, misuse, or disclosure. However, no method of data transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        <h3>Children’s Information</h3>
        <p>JustBuyTravel does not knowingly collect personal information from children under the age of 13. If you believe that a child has provided personal data on our website, please contact us so we can take appropriate action.</p>
        <h3>Your Consent</h3>
        <p>By using our website, you consent to this Privacy Policy and agree to its terms.</p>
        <h3>Updates to This Privacy Policy</h3>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised effective date.</p>
        <h3>Contact Us</h3>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us through our website.</p>
      </div>
      <Footer />
    </>
  )
}

