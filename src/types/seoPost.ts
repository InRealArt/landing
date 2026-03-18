export interface SeoPost {
    id: number
    languageId: number
    originalPostId: number | null
    title: string
    mainImageUrl: string | null
    mainImageAlt: string | null
    metaDescription: string
    metaKeywords: string[]
    content: string
    slug: string
    excerpt: string | null
    author: string
    authorLink: string | null
    viewsCount: number
    estimatedReadTime: number | null
    createdAt: Date
    updatedAt: Date
    pinned: boolean
    listTags: string[]
    generatedArticleHtml: string | null
    jsonLd: string | null
    category: {
        id: number
        name: string
        color: string | null
    }
}
