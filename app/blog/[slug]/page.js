import { notFound } from 'next/navigation';
import "../../../style/responsive.css";

// Middleware redirects /blog/:slug to /:category/:slug when the blog exists.
// This page runs only if middleware passed through (blog not found) – show 404.
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateMetadata() {
  return { title: 'Blog Not Found' };
}

export default function BlogPostPage() {
  notFound();
}
