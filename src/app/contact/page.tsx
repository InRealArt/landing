import { Metadata } from 'next'
import Contact from "@/components/contact/Contact";
import { generateStaticMetadata, defaultMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.contact.title,
  description: defaultMetadata.contact.description,
  keywords: defaultMetadata.contact.keywords,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/contact`
})

export default function ContactPage() {
  return (
    <main className="min-h-screen text-white">
      <Contact />
    </main>
  );
} 