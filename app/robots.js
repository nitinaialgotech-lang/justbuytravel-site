export const dynamic = 'force-static';

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justbuytravel.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/fx-rates'],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

