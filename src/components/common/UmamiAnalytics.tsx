'use client'

import Script from 'next/script'

interface UmamiAnalyticsProps {
  websiteId: string
}

export default function UmamiAnalytics({ websiteId }: UmamiAnalyticsProps) {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
