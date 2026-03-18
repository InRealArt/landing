import { create } from 'zustand'
import { getFeaturedPost, getLanguageIdByCode, getPublishedPosts, getPostBySlug, incrementPostViews, getRelatedPosts, findTranslatedPost } from '@/actions/seoPostActions'
export type { SeoPost } from '@/types/seoPost'
import type { SeoPost } from '@/types/seoPost'

interface SeoPostState {
    // Featured post state
    featuredPost: SeoPost | null
    isLoadingFeatured: boolean
    featuredError: string | null

    // Published posts state
    publishedPosts: SeoPost[]
    isLoadingPublished: boolean
    publishedError: string | null
    totalPublishedPosts: number
    currentPage: number
    postsPerPage: number
    hasMorePosts: boolean

    // Single post state
    currentPost: SeoPost | null
    isLoadingPost: boolean
    postError: string | null

    // Related posts state
    relatedPosts: SeoPost[]
    isLoadingRelated: boolean
    relatedError: string | null

    // Common state
    currentLanguage: string | null

    // Featured post actions
    fetchFeaturedPost: (languageCode: string) => Promise<void>
    clearFeaturedPost: () => void

    // Published posts actions
    fetchPublishedPosts: (languageCode: string, page?: number, excludeFeatured?: boolean) => Promise<void>
    loadMorePosts: (languageCode: string, excludeFeatured?: boolean) => Promise<void>
    clearPublishedPosts: () => void
    refreshPublishedPosts: (languageCode: string, excludeFeatured?: boolean) => Promise<void>

    // Single post actions
    fetchPostBySlug: (slug: string, languageCode: string) => Promise<void>
    findTranslatedPost: (targetLanguageCode: string) => Promise<SeoPost | null>
    incrementPostViews: (postId: number) => Promise<void>
    clearCurrentPost: () => void

    // Related posts actions
    fetchRelatedPosts: (categoryId: number, currentPostId: number, languageCode: string) => Promise<void>
    clearRelatedPosts: () => void
}

export const useSeoPostStore = create<SeoPostState>((set, get) => ({
    // Featured post state
    featuredPost: null,
    isLoadingFeatured: false,
    featuredError: null,

    // Published posts state
    publishedPosts: [],
    isLoadingPublished: false,
    publishedError: null,
    totalPublishedPosts: 0,
    currentPage: 0,
    postsPerPage: 10,
    hasMorePosts: true,

    // Single post state
    currentPost: null,
    isLoadingPost: false,
    postError: null,

    // Related posts state
    relatedPosts: [],
    isLoadingRelated: false,
    relatedError: null,

    // Common state
    currentLanguage: null,

    fetchFeaturedPost: async (languageCode: string) => {
        const { currentLanguage } = get()

        // Si on change de langue (et qu'on a déjà une langue), on réinitialise le post
        if (currentLanguage && currentLanguage !== languageCode) {
            set({
                featuredPost: null,
                currentLanguage: languageCode,
                isLoadingFeatured: true,
                featuredError: null
            })
        } else {
            // Premier chargement ou même langue
            set({
                isLoadingFeatured: true,
                featuredError: null,
                currentLanguage: languageCode
            })
        }

        try {
            // Récupérer l'ID de la langue
            const languageId = await getLanguageIdByCode(languageCode)
            if (!languageId) {
                throw new Error(`Langue non trouvée: ${languageCode}`)
            }

            // Récupérer le post épinglé
            const post = await getFeaturedPost(languageId)

            set({
                featuredPost: post,
                isLoadingFeatured: false,
                currentLanguage: languageCode
            })
        } catch (error) {
            console.error('Erreur lors de la récupération du post épinglé:', error)
            set({
                featuredError: error instanceof Error ? error.message : 'Erreur lors de la récupération du post épinglé',
                isLoadingFeatured: false,
                currentLanguage: languageCode
            })
        }
    },

    clearFeaturedPost: () => {
        set({
            featuredPost: null,
            isLoadingFeatured: false,
            featuredError: null
        })
    },

    fetchPublishedPosts: async (languageCode: string, page = 1, excludeFeatured = true) => {
        const { currentLanguage, postsPerPage, featuredPost } = get()

        // Si on change de langue, on réinitialise tout
        if (currentLanguage && currentLanguage !== languageCode) {
            set({
                publishedPosts: [],
                currentPage: 0,
                totalPublishedPosts: 0,
                hasMorePosts: true,
                currentLanguage: languageCode,
                isLoadingPublished: true,
                publishedError: null
            })
        } else {
            set({
                isLoadingPublished: true,
                publishedError: null,
                currentLanguage: languageCode
            })
        }

        try {
            // Récupérer l'ID de la langue
            const languageId = await getLanguageIdByCode(languageCode)
            if (!languageId) {
                throw new Error(`Langue non trouvée: ${languageCode}`)
            }

            // Calculer l'offset
            const offset = (page - 1) * postsPerPage

            // Récupérer les posts publiés (excludePinned gère automatiquement l'exclusion du featured post)
            const { posts, total } = await getPublishedPosts(languageId, postsPerPage, offset, [], excludeFeatured)

            set({
                publishedPosts: page === 1 ? posts : [...get().publishedPosts, ...posts],
                totalPublishedPosts: total,
                currentPage: page,
                hasMorePosts: posts.length === postsPerPage && (offset + posts.length) < total,
                isLoadingPublished: false,
                currentLanguage: languageCode
            })
        } catch (error) {
            console.error('Erreur lors de la récupération des posts publiés:', error)
            set({
                publishedError: error instanceof Error ? error.message : 'Erreur lors de la récupération des posts publiés',
                isLoadingPublished: false,
                currentLanguage: languageCode
            })
        }
    },

    loadMorePosts: async (languageCode: string, excludeFeatured = true) => {
        const { currentPage, hasMorePosts, isLoadingPublished } = get()

        if (!hasMorePosts || isLoadingPublished) return

        await get().fetchPublishedPosts(languageCode, currentPage + 1, excludeFeatured)
    },

    clearPublishedPosts: () => {
        set({
            publishedPosts: [],
            isLoadingPublished: false,
            publishedError: null,
            totalPublishedPosts: 0,
            currentPage: 0,
            hasMorePosts: true
        })
    },

    refreshPublishedPosts: async (languageCode: string, excludeFeatured = true) => {
        set({
            publishedPosts: [],
            currentPage: 0,
            totalPublishedPosts: 0,
            hasMorePosts: true
        })

        await get().fetchPublishedPosts(languageCode, 1, excludeFeatured)
    },

    // Single post actions
    fetchPostBySlug: async (slug: string, languageCode: string) => {
        set({
            isLoadingPost: true,
            postError: null
        })

        try {
            // Récupérer le post par slug
            const post = await getPostBySlug(slug, languageCode)

            set({
                currentPost: post,
                isLoadingPost: false
            })
        } catch (error) {
            console.error('Erreur lors de la récupération du post:', error)
            set({
                postError: error instanceof Error ? error.message : 'Erreur lors de la récupération du post',
                isLoadingPost: false
            })
        }
    },

    findTranslatedPost: async (targetLanguageCode: string) => {
        try {
            const { currentPost } = get()
            if (currentPost) {
                const translatedPost = await findTranslatedPost(currentPost, targetLanguageCode)
                if (translatedPost) {
                    set({
                        currentPost: translatedPost
                    })
                    return translatedPost
                }
            }
            return null
        } catch (error) {
            console.error('Erreur lors de la récupération du post traduit:', error)
            return null
        }
    },

    incrementPostViews: async (postId: number) => {
        try {
            await incrementPostViews(postId)
            // Mettre à jour le post dans le store si c'est le post actuel
            const { currentPost } = get()
            if (currentPost && currentPost.id === postId) {
                set({
                    currentPost: {
                        ...currentPost,
                        viewsCount: currentPost.viewsCount + 1
                    }
                })
            }
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation des vues:', error)
        }
    },

    clearCurrentPost: () => {
        set({
            currentPost: null,
            isLoadingPost: false,
            postError: null
        })
    },

    // Related posts actions
    fetchRelatedPosts: async (categoryId: number, currentPostId: number, languageCode: string) => {
        set({
            isLoadingRelated: true,
            relatedError: null
        })

        try {
            // Récupérer l'ID de la langue
            const languageId = await getLanguageIdByCode(languageCode)
            if (!languageId) {
                throw new Error(`Langue non trouvée: ${languageCode}`)
            }

            const relatedPosts = await getRelatedPosts(categoryId, currentPostId, languageId)
            set({
                relatedPosts,
                isLoadingRelated: false
            })
        } catch (error) {
            console.error('Erreur lors de la récupération des posts similaires:', error)
            set({
                relatedError: error instanceof Error ? error.message : 'Erreur lors de la récupération des posts similaires',
                isLoadingRelated: false
            })
        }
    },

    clearRelatedPosts: () => {
        set({
            relatedPosts: [],
            isLoadingRelated: false,
            relatedError: null
        })
    }
})) 