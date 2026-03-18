import { SeoPost } from '@/types/seoPost'
import { BlogPost } from '@/types/blog'

/**
 * Convertit un SeoPost en BlogPost pour la compatibilité avec les composants existants
 */
export function seoPostToBlogPost(seoPost: SeoPost): BlogPost {
    // Calculer le temps de lecture estimé
    const readTime = seoPost.estimatedReadTime
        ? `${seoPost.estimatedReadTime} min`
        : '5 min' // valeur par défaut

    // Formater la date
    const date = new Date(seoPost.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    // Utiliser les tags de la liste ou créer des tags basés sur la catégorie
    const tags = seoPost.listTags.length > 0
        ? seoPost.listTags
        : [seoPost.category.name]

    return {
        id: seoPost.slug, // Utiliser le slug comme ID pour les URLs
        date,
        readTime,
        title: seoPost.title,
        description: seoPost.excerpt || seoPost.metaDescription,
        tags,
        imageUrl: seoPost.mainImageUrl || '/images/blog/default-blog-image.webp',
        content: {
            introduction: seoPost.excerpt || '',
            sections: [] // Le contenu détaillé sera géré séparément
        }
    }
}

/**
 * Convertit un tableau de SeoPost en BlogPost
 */
export function seoPostsToBlogPosts(seoPosts: SeoPost[]): BlogPost[] {
    return seoPosts.map(seoPostToBlogPost)
}

/**
 * Filtre les posts par tags
 */
export function filterPostsByTags(posts: SeoPost[], tags: string[]): SeoPost[] {
    if (tags.length === 0) return posts

    return posts.filter(post =>
        tags.some(tag =>
            post.listTags.some(postTag =>
                postTag.toLowerCase().includes(tag.toLowerCase())
            ) ||
            post.category.name.toLowerCase().includes(tag.toLowerCase())
        )
    )
}

/**
 * Recherche dans les posts par titre ou description
 */
export function searchPosts(posts: SeoPost[], query: string): SeoPost[] {
    if (!query.trim()) return posts

    const searchTerm = query.toLowerCase()

    return posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.metaDescription.toLowerCase().includes(searchTerm) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm))
    )
} 