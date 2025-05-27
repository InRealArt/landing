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