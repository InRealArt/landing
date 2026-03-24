import { getLanguageIdByCode, getPublishedPostsPaginated } from '@/actions/seoPostActions'
import MediaArticlesSectionClient from './MediaArticlesSectionClient'

const PREVIEW_LIMIT = 6

export default async function MediaArticlesSection() {
  const langId = await getLanguageIdByCode('fr')

  const initialPosts = langId
    ? (await getPublishedPostsPaginated(langId, 1, PREVIEW_LIMIT, true)).posts
    : []

  return <MediaArticlesSectionClient initialPosts={initialPosts} />
}
