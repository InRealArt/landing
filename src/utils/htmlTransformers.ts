/**
 * Transforms YouTube watch URLs to embed URLs in iframe src attributes.
 * Handles:
 *   - https://www.youtube.com/watch?v=ID  → https://www.youtube.com/embed/ID
 *   - https://youtu.be/ID                 → https://www.youtube.com/embed/ID
 * Extra params (e.g. t=30s) are preserved as query string on the embed URL.
 */
function fixYouTubeEmbedUrls(html: string): string {
  // youtube.com/watch?v=ID(&extra=params)
  html = html.replace(
    /src="https:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)([^"]*)"/g,
    (_match, id, rest) => {
      const extra = rest.replace(/^&/, '?')
      return `src="https://www.youtube.com/embed/${id}${extra}"`
    }
  )

  // youtu.be/ID(?extra=params)
  html = html.replace(
    /src="https:\/\/youtu\.be\/([\w-]+)([^"]*)"/g,
    (_match, id, rest) => {
      const extra = rest.startsWith('?') ? rest : ''
      return `src="https://www.youtube.com/embed/${id}${extra}"`
    }
  )

  return html
}

/**
 * Applies all HTML transformations before rendering a blog post.
 */
export function transformPostHtml(html: string): string {
  return fixYouTubeEmbedUrls(html)
}
