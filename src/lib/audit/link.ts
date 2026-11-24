import { prisma } from '@/lib/prisma'
import { hashToken, isWellFormedToken } from './token'

/** Vérification légère (sans cookie ni lecture des réponses) utilisée par src/proxy.ts pour répondre une vraie 404. */
export async function auditLinkIsValid(token: string): Promise<boolean> {
  if (!isWellFormedToken(token)) return false
  const audit = await prisma.auditClient.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { revokedAt: true, expiresAt: true },
  })
  return !!audit && audit.revokedAt === null && audit.expiresAt.getTime() > Date.now()
}
