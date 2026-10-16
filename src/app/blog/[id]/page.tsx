import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import PostDetail from '@/components/blog/PostDetail'
import PostDetailAnimations from '@/components/blog/PostDetailAnimations'
import PostLanguageSwitchOverride from '@/components/blog/PostLanguageSwitchOverride'
import { getPostBySlug, getTranslatedPostSlug } from '@/actions/seoPostActions'

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params
  
  try {
    const frPost = await getPostBySlug(slug, 'fr')
    const post = frPost ?? await getPostBySlug(slug, 'en')

    if (!post) {
      return {
        title: 'Article non trouvé',
        description: 'Cet article n\'existe pas ou a été supprimé.'
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'
    const articleUrl = `${baseUrl}/blog/${slug}`

    // hreflang FR/EN réciproques (IRA-06) : chaque version pointe vers sa traduction publiée
    const lang = frPost ? 'fr' : 'en'
    const otherLang = lang === 'fr' ? 'en' : 'fr'
    const otherSlug = await getTranslatedPostSlug(post.id, otherLang)
    const otherPost = otherSlug ? await getPostBySlug(otherSlug, otherLang) : null
    // Version anglaise non traduite (titre identique à l'original français) : noindex, pas de hreflang
    const untranslated = lang === 'en' && !!otherPost && otherPost.title.trim() === post.title.trim()
    const languages: Record<string, string> = untranslated ? {} : { [lang]: articleUrl }
    if (otherPost && !untranslated) languages[otherLang] = `${baseUrl}/blog/${otherSlug}`
    if (!untranslated) languages['x-default'] = languages.fr ?? articleUrl

    return {
      title: post.title,
      description: post.metaDescription,
      authors: [{ name: post.author, url: post.authorLink || undefined }],
      
      // Open Graph
      openGraph: {
        title: post.title,
        description: post.metaDescription,
        url: articleUrl,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author],
        section: post.category.name,
        tags: post.listTags,
        images: post.mainImageUrl ? [{
          url: post.mainImageUrl,
          alt: post.mainImageAlt || post.title,
          width: 1200,
          height: 630
        }] : []
      },

      // Twitter
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription,
        images: post.mainImageUrl ? [post.mainImageUrl] : []
      },

      // URL canonique
      alternates: {
        canonical: articleUrl,
        ...(Object.keys(languages).length > 1 && { languages })
      },

      // Autres métadonnées
      robots: {
        index: !untranslated,
        follow: true,
        googleBot: {
          index: !untranslated,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error)
    return {
      title: 'Erreur',
      description: 'Une erreur est survenue lors du chargement de l\'article.'
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { id: slug } = await params

  // Fetch the post server-side (French first, then English fallback) for SSR/SEO
  const initialPost = await getPostBySlug(slug, 'fr') ?? await getPostBySlug(slug, 'en')

  if (!initialPost) {
    permanentRedirect('/blog')
  }

  return (
    <main className="min-h-screen pt-headerSize bg-[var(--canvas-bg)] text-[var(--ink-black)]">
      <PostDetailAnimations />
      {/* Surcharge du bouton de langue : redirige vers le slug de l'article
          jumeau traduit. Actif uniquement sur cette page. */}
      <PostLanguageSwitchOverride postId={initialPost.id} slug={slug} />
      <PostDetail slug={slug} initialPost={initialPost} />
    </main>
  )
} 