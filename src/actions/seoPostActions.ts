'use server'

import { prisma } from '@/lib/prisma'
import { SeoPost } from '@/store/useSeoPostStore'

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
    excludePinned: boolean = false
): Promise<{ posts: SeoPost[], total: number }> {
    try {
        const whereClause = {
            status: 'PUBLISHED' as const,
            languageId: languageId,
            ...(excludePinned && { pinned: false }),
            ...(excludeIds.length > 0 && {
                id: {
                    notIn: excludeIds
                }
            })
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

        return {
            posts: posts as SeoPost[],
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
    limit: number = 3
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

export async function findTranslatedPost(currentPost: SeoPost, targetLanguageCode: string): Promise<SeoPost | null> {
    try {
        // Récupérer l'ID de la langue cible
        const targetLanguageId = await getLanguageIdByCode(targetLanguageCode)
        if (!targetLanguageId) {
            throw new Error(`Langue non trouvée: ${targetLanguageCode}`)
        }

        let translatedPost: any = null

        if (currentPost.originalPostId === null) {
            // Le post courant est l'original, chercher la traduction
            translatedPost = await prisma.seoPost.findFirst({
                where: {
                    originalPostId: currentPost.id,
                    languageId: targetLanguageId,
                    status: 'PUBLISHED'
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
        } else {
            // Le post courant est une traduction, chercher l'original ou une autre traduction
            translatedPost = await prisma.seoPost.findFirst({
                where: {
                    languageId: targetLanguageId,
                    status: 'PUBLISHED',
                    OR: [
                        { id: currentPost.originalPostId }, // L'original
                        { originalPostId: currentPost.originalPostId } // Une autre traduction
                    ]
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
        }

        return translatedPost as SeoPost | null
    } catch (error) {
        console.error('Erreur lors de la recherche du post traduit:', error)
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
    categorySlug: string,
    languageId: number,
    limit: number = 10,
    offset: number = 0
): Promise<{ posts: SeoPost[], total: number, category: { id: number, name: string, color: string | null, url: string | null } | null }> {
    try {
        // Récupérer la catégorie par son slug
        const category = await getCategoryBySlug(categorySlug)

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
                entityId: category.id,
                languageId: languageId,
                field: 'name'
            }
        })

        // Utiliser la traduction si disponible, sinon le nom par défaut
        const translatedCategoryName = categoryTranslation?.value || category.name

        const whereClause = {
            status: 'PUBLISHED' as const,
            languageId: languageId,
            categoryId: category.id
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

        return {
            posts: posts as SeoPost[],
            total,
            category: {
                id: category.id,
                name: translatedCategoryName,
                color: category.color,
                url: category.url
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

        return {
            posts: posts as SeoPost[],
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