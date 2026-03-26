import { EXTERNAL_URLS } from '@/constants/constants'

/**
 * Utility to manage image URLs, specifically to transition from Firebase Storage to Cloudflare R2.
 */

const FIREBASE_STORAGE_DOMAIN = 'firebasestorage.googleapis.com'

/**
 * Detects if a URL is a Firebase Storage URL and extracts the relative path.
 * Then prefixes it with the Cloudflare R2 bucket URL.
 * 
 * Firebase URL structure: 
 * https://firebasestorage.googleapis.com/v0/b/[BUCKET]/o/[ENCODED_PATH]?alt=media&token=[TOKEN]
 */
export function getSmartImageUrl(src: string): string {
  if (!src) return src

  // If it's already a relative path or doesn't look like a URL, return as is
  if (!src.startsWith('http')) return src

  try {
    const url = new URL(src)

    if (url.hostname === FIREBASE_STORAGE_DOMAIN) {
      // Find the index of '/o/' to extract the path accurately
      const oIndex = url.pathname.indexOf('/o/')
      
      if (oIndex !== -1) {
        // Extract everything after '/o/'
        const encodedPath = url.pathname.substring(oIndex + 3)
        const filePath = decodeURIComponent(encodedPath)
        
        const r2BaseUrl = EXTERNAL_URLS.CLOUDFLARE_R2_URL || ''
        
        if (!r2BaseUrl) return src

        // Return the path prefixed with R2 URL
        // Ensure no double slashes between R2 URL and file path
        const baseUrl = r2BaseUrl.endsWith('/') 
          ? r2BaseUrl.slice(0, -1) 
          : r2BaseUrl
          
        return `${baseUrl}/${filePath}`
      }
    }
  } catch (error) {
    // If URL parsing fails, it's likely not a full URL or malformed
    return src
  }

  return src
}
