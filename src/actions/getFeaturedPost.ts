'use server'

import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import type { FeaturedPost } from '@/types/featured-item'

export async function getFeaturedPostByLanguage(languageId: number): Promise<FeaturedPost | null> {
  try {
    const post = await prisma.seoPost.findFirst({
      where: {
        isFeatured: true,
        languageId: languageId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        mainImageUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post) return null

    return {
      kind: 'post',
      id: post.id,
      title: post.title,
      slug: post.slug,
      imageUrl: getImageUrl(post.mainImageUrl),
      categoryName: post.category?.name || null,
    }
  } catch (error) {
    console.error('Error fetching featured post:', error)
    return null
  }
}
