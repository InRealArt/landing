'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'
import { useLanguageSwitchOverride } from '@/contexts/LanguageSwitchContext'
import { getTranslatedPostSlug } from '@/actions/seoPostActions'

interface PostLanguageSwitchOverrideProps {
    /** Id du post actuellement affiché (celui rendu côté serveur). */
    postId: number
    /** Slug actuel, pour éviter une navigation inutile. */
    slug: string
}

/**
 * Surcharge le bouton de langue **uniquement** sur la page de détail d'un
 * article de blog : au changement de langue, on cherche en base le post
 * "jumeau" (via `originalPostId`) dans la langue cible et on redirige vers
 * son slug.
 *
 * Si aucune traduction n'existe, on se contente de changer la langue :
 * l'URL reste inchangée et `PostDetail` gère l'affichage comme avant.
 *
 * La surcharge est retirée dès que ce composant est démonté, donc toutes
 * les autres pages conservent le comportement natif.
 */
export default function PostLanguageSwitchOverride({
    postId,
    slug
}: PostLanguageSwitchOverrideProps) {
    const router = useRouter()
    const setLanguage = useLanguageStore((state) => state.setLanguage)

    const handleLanguageSwitch = useCallback(
        async (targetLanguage: 'fr' | 'en') => {
            await setLanguage(targetLanguage)

            try {
                const translatedSlug = await getTranslatedPostSlug(postId, targetLanguage)
                if (translatedSlug && translatedSlug !== slug) {
                    router.push(`/blog/${translatedSlug}`)
                }
            } catch (error) {
                // Pas de traduction accessible : on reste sur l'article courant.
                console.error('Erreur lors de la redirection vers la traduction:', error)
            }
        },
        [postId, slug, router, setLanguage]
    )

    useLanguageSwitchOverride(handleLanguageSwitch)

    return null
}
