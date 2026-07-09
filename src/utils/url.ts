/**
 * Returns the URL unchanged if it's a safe http(s) link, otherwise null.
 * Use before rendering any DB-sourced string as an href to block javascript:/data: URIs.
 */
export function getSafeExternalUrl(url: string | null | undefined): string | null {
  if (url && /^https?:\/\//i.test(url)) {
    return url
  }
  return null
}
