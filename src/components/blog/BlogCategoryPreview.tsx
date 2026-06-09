import { getLanguageIdByCode, getPostsByCategorySlug } from '@/actions/seoPostActions'
import PostsGrid from './PostsGrid'

interface BlogCategoryPreviewProps {
  /** Slug de la catégorie en base (ex: "interview-artistes") */
  categorySlug: string
  /** Titre affiché au-dessus des cards */
  title: string
  /** Langue des articles — défaut "fr" */
  lang?: string
}

export default async function BlogCategoryPreview({
  categorySlug,
  title,
  lang = 'fr',
}: BlogCategoryPreviewProps) {
  const langId = await getLanguageIdByCode(lang)
  const posts = langId
    ? (await getPostsByCategorySlug(categorySlug, langId, 3)).posts
    : []

  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      <div className="flex items-baseline gap-4 mb-8 md:mb-10">
        <h2
          className="serif text-2xl sm:text-3xl font-bold whitespace-nowrap"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h2>
        <div className="h-px flex-grow" style={{ background: 'var(--border-light)' }} />
      </div>

      <PostsGrid
        posts={posts}
        showPagination={false}
        showViewAllCta={true}
      />
    </section>
  )
}
