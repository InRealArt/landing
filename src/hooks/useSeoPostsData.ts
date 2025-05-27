import { useEffect } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useSeoPostStore } from '@/store/useSeoPostStore'
import { seoPostsToBlogPosts } from '@/utils/seoPostUtils'

interface UseSeoPostsDataOptions {
    excludeFeatured?: boolean
    autoFetch?: boolean
    limit?: number
}

/**
 * Hook personnalisé pour gérer les données des posts SEO
 */
export function useSeoPostsData(options: UseSeoPostsDataOptions = {}) {
    const {
        excludeFeatured = true,
        autoFetch = true,
        limit = 6
    } = options

    const { language } = useLanguageStore()
    const {
        publishedPosts,
        isLoadingPublished,
        publishedError,
        hasMorePosts,
        totalPublishedPosts,
        currentPage,
        fetchPublishedPosts,
        loadMorePosts,
        refreshPublishedPosts,
        clearPublishedPosts
    } = useSeoPostStore()

    // Auto-fetch des posts au changement de langue
    useEffect(() => {
        if (autoFetch && language) {
            fetchPublishedPosts(language, 1, excludeFeatured)
        }
    }, [language, autoFetch, excludeFeatured, fetchPublishedPosts])

    // Convertir les SeoPost en BlogPost pour la compatibilité
    const blogPosts = seoPostsToBlogPosts(publishedPosts)

    // Fonctions utilitaires
    const loadMore = () => {
        if (language && hasMorePosts && !isLoadingPublished) {
            loadMorePosts(language, excludeFeatured)
        }
    }

    const refresh = () => {
        if (language) {
            refreshPublishedPosts(language, excludeFeatured)
        }
    }

    const retry = () => {
        if (language) {
            fetchPublishedPosts(language, 1, excludeFeatured)
        }
    }

    return {
        // Données
        posts: publishedPosts,
        blogPosts,
        totalPosts: totalPublishedPosts,
        currentPage,

        // États
        isLoading: isLoadingPublished,
        error: publishedError,
        hasMore: hasMorePosts,
        isEmpty: publishedPosts.length === 0,
        isInitialLoading: isLoadingPublished && publishedPosts.length === 0,

        // Actions
        loadMore,
        refresh,
        retry,
        clear: clearPublishedPosts,

        // Métadonnées
        language,
        options: {
            excludeFeatured,
            autoFetch,
            limit
        }
    }
}

/**
 * Hook spécialisé pour les "autres posts" (excluant le post épinglé)
 */
export function useOtherPosts() {
    return useSeoPostsData({
        excludeFeatured: true,
        autoFetch: true,
        limit: 6
    })
}

/**
 * Hook spécialisé pour tous les posts publiés
 */
export function useAllPublishedPosts() {
    return useSeoPostsData({
        excludeFeatured: false,
        autoFetch: true,
        limit: 10
    })
} 