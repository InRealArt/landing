import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import PostDetail from '@/components/blog/PostDetail'
import { getPostBySlug } from '@/actions/seoPostActions'

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params
  
  try {
    const post = await getPostBySlug(slug, 'fr') ?? await getPostBySlug(slug, 'en')

    if (!post) {
      return {
        title: 'Article non trouvé | InRealArt',
        description: 'Cet article n\'existe pas ou a été supprimé.'
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
    const articleUrl = `${baseUrl}/blog/${slug}`

    return {
      title: `${post.title} | InRealArt`,
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
      title: 'Erreur | InRealArt',
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
    <main className="min-h-screen pt-headerSize text-textColor">
      <PostDetail slug={slug} initialPost={initialPost} />
    </main>
  )
} 