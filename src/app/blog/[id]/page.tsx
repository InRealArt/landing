import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostDetail from '@/components/blog/PostDetail'
import { getPostBySlug, getLanguageIdByCode } from '@/actions/seoPostActions'

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params
  
  try {
    // Récupérer l'ID de la langue (par défaut français)
    const languageId = await getLanguageIdByCode('fr')
    if (!languageId) {
      return {
        title: 'Erreur | In Real Art',
        description: 'Une erreur est survenue lors de la récupération de la langue.'
      }
    }
    const post = await getPostBySlug(slug, languageId.toString())
    
    if (!post) {
      return {
        title: 'Article non trouvé | In Real Art',
        description: 'Cet article n\'existe pas ou a été supprimé.'
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
    const articleUrl = `${baseUrl}/blog/${slug}`

    return {
      title: `${post.title} | In Real Art`,
      description: post.metaDescription,
      keywords: Array.isArray(post.metaKeywords) ? post.metaKeywords.join(', ') : post.metaKeywords,
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
        canonical: articleUrl
      },

      // Autres métadonnées
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
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
      title: 'Erreur | In Real Art',
      description: 'Une erreur est survenue lors du chargement de l\'article.'
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { id: slug } = await params

  if (!slug) {
    return (
      <main className="min-h-screen text-white pt-headerSize">
        <div className="max-w-screen-lg mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">Post not found</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-headerSize text-white">
      <PostDetail slug={slug} />
    </main>
  )
} 