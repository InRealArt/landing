/**
 * Organise les traductions par entité et par champ à partir d'un tableau de traductions
 * @param translations Tableau des traductions récupérées depuis la base de données
 * @returns Un objet organisé par entité, champ et code de langue
 */
export const organizeTranslations = (translations: any[]) => {
    return translations.reduce((acc, t) => {
        const entityKey = `${t.entityType}-${t.entityId}`

        if (!acc[entityKey]) {
            acc[entityKey] = {}
        }

        // Skip translations without a field
        if (t.field === null) return acc

        if (!acc[entityKey][t.field]) {
            acc[entityKey][t.field] = {}
        }

        acc[entityKey][t.field][t.language.code] = t.value
        return acc
    }, {} as Record<string, Record<string, Record<string, string>>>)
} 