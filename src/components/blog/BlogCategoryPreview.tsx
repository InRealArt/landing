import { getLanguageIdByCode, getPostsByCategorySlug } from '@/actions/seoPostActions'
import BlogCategoryPreviewClient from './BlogCategoryPreviewClient'

interface BlogCategoryPreviewProps {
  /** Slug de la catégorie en base (ex: "interview-artistes") */
  categorySlug: string
  /** Clé de traduction du titre affiché au-dessus des cards */
  titleKey: string
}

// French is the default language and is always pre-rendered on the server.
// BlogCategoryPreviewClient re-fetches client-side when the user switches language.
export default async function BlogCategoryPreview({
  categorySlug,
  titleKey,
}: BlogCategoryPreviewProps) {
  const langId = await getLanguageIdByCode('fr')
  const initialPosts = langId
    ? (await getPostsByCategorySlug(categorySlug, langId, 3)).posts
    : []

  return (
    <BlogCategoryPreviewClient
      categorySlug={categorySlug}
      titleKey={titleKey}
      initialPosts={initialPosts}
    />
  )
}
