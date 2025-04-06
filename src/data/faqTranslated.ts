import { GridItem } from "@/components/common/annexe/ContentGrid";
import { getTranslatedDetailedFaq, getFaqHeaders } from "@/actions/detailedFaqActions";

// Récupération dynamique des onglets depuis la base de données
// Les onglets correspondent maintenant aux detailedFaqHeader
export async function getFaqTabs(languageCode: string = 'fr'): Promise<string[]> {
    try {
        return await getFaqHeaders(languageCode);
    } catch (error) {
        console.error('Erreur lors de la récupération des onglets de FAQ:', error);
        return [];
    }
}

// Note: cette valeur par défaut est utilisée uniquement si la requête échoue
// Elle sera remplacée par les valeurs dynamiques dès que possible
export const faqTabs: string[] = [];


// Pour un import statique des données traduites, on peut utiliser cette fonction:
export async function getTranslatedFaqItems(languageCode: string = 'fr'): Promise<{
    faqItems: GridItem[]
    faqTabs: string[]
}> {
    try {
        const [items, tabs] = await Promise.all([
            getTranslatedDetailedFaq(languageCode),
            getFaqHeaders(languageCode)
        ]);
        return {
            faqItems: items,
            faqTabs: tabs
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des FAQs traduites:', error);
        return {
            faqItems: [],
            faqTabs: []
        };
    }
} 