'use server'

import { prisma } from '@/lib/prisma'
import { SeoPost } from '@/types/seoPost'

export async function getFeaturedPost(languageId: number): Promise<SeoPost | null> {
    try {
        console.log('languageId', languageId)
        const post = await prisma.seoPost.findFirst({
            where: {
                status: 'PUBLISHED',
                pinned: true,
                languageId: languageId
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return post as SeoPost | null
    } catch (error) {
        console.error('Erreur lors de la récupération du post épinglé:', error)
        return null
    }
}

export async function getPublishedPosts(
    languageId: number,
    limit: number = 10,
    offset: number = 0,
    excludeIds: number[] = [],
    excludePinned: boolean = false,
    categoryId?: number
): Promise<{ posts: SeoPost[], total: number }> {
    try {
        const whereClause = {
            status: 'PUBLISHED' as const,
            languageId: languageId,
            ...(excludePinned && { pinned: false }),
            ...(categoryId && { categoryId: categoryId }),
            ...(excludeIds.length > 0 && {
                id: {
                    notIn: excludeIds
                }
            })
        }
        
        const [posts, total] = await Promise.all([
            prisma.seoPost.findMany({
                where: whereClause,
                select: {
                    id: true,
                    languageId: true,
                    originalPostId: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    metaDescription: true,
                    metaKeywords: true,
                    listTags: true,
                    mainImageUrl: true,
                    mainImageAlt: true,
                    status: true,
                    pinned: true,
                    author: true,
                    authorLink: true,
                    viewsCount: true,
                    estimatedReadTime: true,
                    categoryId: true,
                    createdAt: true,
                    updatedAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            color: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip: offset
            }),
            prisma.seoPost.count({
                where: whereClause
            })
        ])
        return {
            posts: posts as unknown as SeoPost[],
            total
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des posts publiés:', error)
        return {
            posts: [],
            total: 0
        }
    }
}

export async function getLanguageIdByCode(languageCode: string): Promise<number | null> {
    try {
        const language = await prisma.language.findUnique({
            where: {
                code: languageCode
            }
        })

        return language?.id || null
    } catch (error) {
        console.error('Erreur lors de la récupération de la langue:', error)
        return null
    }
}

export async function getPostBySlug(slug: string, languageCode: string): Promise<SeoPost | null> {
    try {
        // Récupérer l'ID de la langue
        const languageId = await getLanguageIdByCode(languageCode)
        if (!languageId) {
            throw new Error(`Langue non trouvée: ${languageCode}`)
        }

        const post = await prisma.seoPost.findFirst({
            where: {
                slug: slug,
                status: 'PUBLISHED',
                languageId: languageId
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true
                    }
                }
            }
        })

        return post as SeoPost | null
    } catch (error) {
        console.error('Erreur lors de la récupération du post par slug:', error)
        return null
    }
}

export async function incrementPostViews(postId: number): Promise<void> {
    try {
        await prisma.seoPost.update({
            where: { id: postId },
            data: {
                viewsCount: {
                    increment: 1
                }
            }
        })
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des vues:', error)
        throw error
    }
}

export async function getRelatedPosts(
    categoryId: number,
    currentPostId: number,
    languageId: number,
    limit: number = 6
): Promise<SeoPost[]> {
    try {
        const posts = await prisma.seoPost.findMany({
            where: {
                status: 'PUBLISHED',
                languageId: languageId,
                categoryId: categoryId,
                id: {
                    not: currentPostId // Exclure le post actuel
                }
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        return posts.map(post => ({
            id: post.id,
            languageId: post.languageId,
            originalPostId: post.originalPostId,
            title: post.title,
            mainImageUrl: post.mainImageUrl,
            mainImageAlt: post.mainImageAlt,
            metaDescription: post.metaDescription,
            metaKeywords: post.metaKeywords,
            content: post.content,
            slug: post.slug,
            excerpt: post.excerpt,
            author: post.author,
            authorLink: post.authorLink,
            viewsCount: post.viewsCount,
            estimatedReadTime: post.estimatedReadTime,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            pinned: post.pinned,
            listTags: post.listTags,
            generatedArticleHtml: post.generatedArticleHtml,
            jsonLd: post.jsonLd,
            category: {
                id: post.category.id,
                name: post.category.name,
                color: post.category.color
            }
        }))
    } catch (error) {
        console.error('Erreur lors de la récupération des posts similaires:', error)
        throw error
    }
}

/**
 * Construit la clause Prisma qui identifie le "jumeau" d'un post dans une
 * langue donnée, en suivant la relation `originalPostId` de SeoPost.
 *
 * Deux cas :
 * - le post courant est l'original  -> le jumeau a `originalPostId = post.id`
 * - le post courant est une traduction -> le jumeau est soit l'original,
 *   soit une autre traduction du même original
 */
function buildTranslationWhere(
    post: Pick<SeoPost, 'id' | 'originalPostId'>,
    targetLanguageId: number
) {
    const base = {
        languageId: targetLanguageId,
        status: 'PUBLISHED' as const
    }

    if (post.originalPostId === null) {
        return { ...base, originalPostId: post.id }
    }

    return {
        ...base,
        OR: [
            { id: post.originalPostId }, // L'original
            { originalPostId: post.originalPostId } // Une autre traduction
        ]
    }
}

export async function findTranslatedPost(currentPost: SeoPost, targetLanguageCode: string): Promise<SeoPost | null> {
    try {
        // Récupérer l'ID de la langue cible
        const targetLanguageId = await getLanguageIdByCode(targetLanguageCode)
        if (!targetLanguageId) {
            throw new Error(`Langue non trouvée: ${targetLanguageCode}`)
        }

        const translatedPost = await prisma.seoPost.findFirst({
            where: buildTranslationWhere(currentPost, targetLanguageId),
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true
                    }
                }
            }
        })

        return translatedPost as SeoPost | null
    } catch (error) {
        console.error('Erreur lors de la recherche du post traduit:', error)
        return null
    }
}

/**
 * Retourne le slug du post jumeau publié dans `targetLanguageCode`, ou `null`
 * si aucune traduction n'existe.
 *
 * Utilisé par la page de détail d'article pour rediriger vers l'URL de la
 * traduction lors d'un changement de langue.
 */
export async function getTranslatedPostSlug(
    postId: number,
    targetLanguageCode: string
): Promise<string | null> {
    try {
        const targetLanguageId = await getLanguageIdByCode(targetLanguageCode)
        if (!targetLanguageId) return null

        const currentPost = await prisma.seoPost.findUnique({
            where: { id: postId },
            select: { id: true, originalPostId: true, languageId: true, slug: true }
        })
        if (!currentPost) return null

        // Déjà dans la langue cible : aucune redirection nécessaire
        if (currentPost.languageId === targetLanguageId) return null

        const translatedPost = await prisma.seoPost.findFirst({
            where: buildTranslationWhere(currentPost, targetLanguageId),
            select: { slug: true }
        })

        return translatedPost?.slug ?? null
    } catch (error) {
        console.error('Erreur lors de la récupération du slug traduit:', error)
        return null
    }
}

export async function getAllCategories(): Promise<{ id: number, name: string, color: string | null }[]> {
    try {
        const categories = await prisma.seoCategory.findMany({
            select: {
                id: true,
                name: true,
                color: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return categories
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error)
        return []
    }
}

export async function getCategoriesWithTranslations(languageCode: string = 'fr'): Promise<{ id: number, name: string, color: string | null, url: string | null }[]> {
    try {
        // 1. Récupérer l'ID de la langue
        const language = await prisma.language.findUnique({
            where: {
                code: languageCode
            }
        })

        if (!language) {
            console.error(`Langue avec code ${languageCode} non trouvée`)
            return []
        }

        // 2. Récupérer toutes les catégories
        const categories = await prisma.seoCategory.findMany({
            select: {
                id: true,
                name: true,
                color: true,
                url: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        // 3. Récupérer les traductions des catégories pour cette langue
        const categoryTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'SeoCategory',
                languageId: language.id,
                field: 'name'
            }
        })

        // 4. Organiser les traductions par ID de catégorie
        const translationsMap = new Map()
        categoryTranslations.forEach(t => {
            translationsMap.set(t.entityId, t.value)
        })

        // 5. Construire le tableau des catégories avec les noms traduits
        const categoriesWithTranslations = categories.map(category => ({
            id: category.id,
            name: translationsMap.get(category.id) || category.name, // Utiliser la traduction si disponible, sinon le nom par défaut
            color: category.color,
            url: category.url
        }))

        return categoriesWithTranslations
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories avec traductions:', error)
        return []
    }
}

export async function getCategoryBySlug(slug: string): Promise<{ id: number, name: string, color: string | null, url: string | null } | null> {
    try {
        const category = await prisma.seoCategory.findFirst({
            where: {
                url: slug
            },
            select: {
                id: true,
                name: true,
                color: true,
                url: true
            }
        })

        return category
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie par slug:', error)
        return null
    }
}

export async function getPostsByCategorySlug(
    categorySlug: string | string[],
    languageId: number,
    limit: number = 10,
    offset: number = 0
): Promise<{ posts: SeoPost[], total: number, category: { id: number, name: string, color: string | null, url: string | null } | null }> {
    try {
        const categorySlugs = Array.isArray(categorySlug) ? categorySlug : [categorySlug]

        // Récupérer les catégories correspondant aux slugs demandés
        const categories = await prisma.seoCategory.findMany({
            where: {
                url: { in: categorySlugs }
            },
            select: {
                id: true,
                name: true,
                color: true,
                url: true
            }
        })

        if (categories.length === 0) {
            return {
                posts: [],
                total: 0,
                category: null
            }
        }

        const categoryIds = categories.map(c => c.id)
        const primaryCategory = categories[0]

        // Récupérer la traduction du nom de la catégorie principale pour cette langue
        const categoryTranslation = await prisma.translation.findFirst({
            where: {
                entityType: 'SeoCategory',
                entityId: primaryCategory.id,
                languageId: languageId,
                field: 'name'
            }
        })

        // Utiliser la traduction si disponible, sinon le nom par défaut
        const translatedCategoryName = categoryTranslation?.value || primaryCategory.name

        const whereClause = {
            status: 'PUBLISHED' as const,
            languageId: languageId,
            categoryId: { in: categoryIds }
        }

        const [posts, total] = await Promise.all([
            prisma.seoPost.findMany({
                where: whereClause,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            color: true,
                            url: true
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                take: limit,
                skip: offset
            }),
            prisma.seoPost.count({
                where: whereClause
            })
        ])

        const postsWithTranslatedCategory = posts.map(post => ({
            ...post,
            category: {
                ...post.category,
                name: translatedCategoryName
            }
        }))

        return {
            posts: postsWithTranslatedCategory as SeoPost[],
            total,
            category: {
                id: primaryCategory.id,
                name: translatedCategoryName,
                color: primaryCategory.color,
                url: primaryCategory.url
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des posts par slug de catégorie:', error)
        return {
            posts: [],
            total: 0,
            category: null
        }
    }
}

export async function getPostsByCategory(
    categoryId: number,
    languageId: number,
    limit: number = 10,
    offset: number = 0
): Promise<{ posts: SeoPost[], total: number, category: { id: number, name: string, color: string | null } | null }> {
    try {
        // Récupérer les informations de la catégorie
        const category = await prisma.seoCategory.findUnique({
            where: { id: categoryId },
            select: {
                id: true,
                name: true,
                color: true
            }
        })

        if (!category) {
            return {
                posts: [],
                total: 0,
                category: null
            }
        }

        // Récupérer la traduction de la catégorie pour cette langue
        const categoryTranslation = await prisma.translation.findFirst({
            where: {
                entityType: 'SeoCategory',
                entityId: categoryId,
                languageId: languageId,
                field: 'name'
            }
        })

        // Utiliser la traduction si disponible, sinon le nom par défaut
        const translatedCategoryName = categoryTranslation?.value || category.name

        const whereClause = {
            status: 'PUBLISHED' as const,
            languageId: languageId,
            categoryId: categoryId
        }

        const [posts, total] = await Promise.all([
            prisma.seoPost.findMany({
                where: whereClause,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            color: true
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                take: limit,
                skip: offset
            }),
            prisma.seoPost.count({
                where: whereClause
            })
        ])

        const postsWithTranslatedCategory = posts.map(post => ({
            ...post,
            category: {
                ...post.category,
                name: translatedCategoryName
            }
        }))

        return {
            posts: postsWithTranslatedCategory as SeoPost[],
            total,
            category: {
                id: category.id,
                name: translatedCategoryName,
                color: category.color
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des posts par catégorie:', error)
        return {
            posts: [],
            total: 0,
            category: null
        }
    }
}

export async function getPublishedPostsPaginated(
    languageId: number,
    page: number,
    limit: number = 6,
    excludePinned: boolean = true,
    categoryId?: number
): Promise<{ posts: SeoPost[]; total: number; totalPages: number }> {
    const offset = Math.max(0, (page - 1) * limit)
    const { posts, total } = await getPublishedPosts(
        languageId,
        limit,
        offset,
        [],
        excludePinned,
        categoryId
    )
    return {
        posts,
        total,
        totalPages: Math.ceil(total / limit),
    }
}

export async function getPostsMentioningArtist(
    artistName: string,
    artistSurname: string,
    languageId: number,
    limit: number = 4
): Promise<SeoPost[]> {
    try {
        const fullName = `${artistName} ${artistSurname}`
        const posts = await prisma.seoPost.findMany({
            where: {
                status: 'PUBLISHED',
                languageId,
                OR: [
                    { title: { contains: fullName, mode: 'insensitive' } },
                    { title: { contains: artistSurname, mode: 'insensitive' } },
                    { metaKeywords: { hasSome: [fullName, artistName, artistSurname] } },
                    { listTags: { hasSome: [fullName, artistName, artistSurname] } },
                    { metaDescription: { contains: fullName, mode: 'insensitive' } },
                ],
            },
            include: {
                category: {
                    select: { id: true, name: true, color: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        })

        return posts.map(post => ({
            id: post.id,
            languageId: post.languageId,
            originalPostId: post.originalPostId,
            title: post.title,
            mainImageUrl: post.mainImageUrl,
            mainImageAlt: post.mainImageAlt,
            metaDescription: post.metaDescription,
            metaKeywords: post.metaKeywords,
            content: post.content,
            slug: post.slug,
            excerpt: post.excerpt,
            author: post.author,
            authorLink: post.authorLink,
            viewsCount: post.viewsCount,
            estimatedReadTime: post.estimatedReadTime,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            pinned: post.pinned,
            listTags: post.listTags,
            generatedArticleHtml: post.generatedArticleHtml,
            jsonLd: post.jsonLd,
            category: {
                id: post.category.id,
                name: post.category.name,
                color: post.category.color,
            },
        }))
    } catch (error) {
        console.error('Error fetching posts mentioning artist:', error)
        return []
    }
}