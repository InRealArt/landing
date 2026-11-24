import { createHmac } from 'crypto'
import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { hashToken, isWellFormedToken, normalizeEmail, safeEqual } from './token'

// Aucun log ici : ni jeton, ni e-mail, ni réponses.

export const GATE_COOKIE_TTL_SECONDS = 7 * 24 * 60 * 60
const COOKIE_PREFIX = 'ira_audit_'

/** Charge l'audit si le jeton est valide, non révoqué et non expiré ; null sinon (même résultat dans tous les cas). */
export async function loadAuditByToken(token: unknown) {
  if (!isWellFormedToken(token)) return null
  const audit = await prisma.auditClient.findUnique({ where: { tokenHash: hashToken(token) } })
  if (!audit || audit.revokedAt !== null || audit.expiresAt.getTime() <= Date.now()) return null
  return audit
}

export type LoadedAudit = NonNullable<Awaited<ReturnType<typeof loadAuditByToken>>>

// --- Cookie de porte e-mail --------------------------------------------------------------------

function cookieSecret(): string | null {
  // En production, le secret dédié est obligatoire ; le repli sur reCAPTCHA reste toléré en développement seulement.
  if (process.env.AUDIT_COOKIE_SECRET) return process.env.AUDIT_COOKIE_SECRET
  return process.env.NODE_ENV === 'production' ? null : process.env.RECAPTCHA_SECRET_KEY || null
}

function sign(tokenHash: string, expiresAt: number, secret: string): string {
  return createHmac('sha256', secret).update(`${tokenHash}.${expiresAt}`).digest('base64url')
}

function cookieName(tokenHash: string): string {
  return `${COOKIE_PREFIX}${tokenHash.slice(0, 16)}`
}

export async function grantEmailGate(tokenHash: string): Promise<boolean> {
  const secret = cookieSecret()
  if (!secret) return false
  const expiresAt = Date.now() + GATE_COOKIE_TTL_SECONDS * 1000
  const jar = await cookies()
  jar.set(cookieName(tokenHash), `${expiresAt}.${sign(tokenHash, expiresAt, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/audit',
    maxAge: GATE_COOKIE_TTL_SECONDS,
  })
  return true
}

export async function hasEmailGate(tokenHash: string): Promise<boolean> {
  const secret = cookieSecret()
  if (!secret) return false
  const raw = (await cookies()).get(cookieName(tokenHash))?.value
  if (!raw) return false
  const [expRaw, signature] = raw.split('.')
  const expiresAt = Number(expRaw)
  if (!signature || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false
  return safeEqual(signature, sign(tokenHash, expiresAt, secret))
}

/** Garde commune aux server actions : jeton valide + e-mail déjà vérifié. Null = accès refusé (réponse identique). */
export async function requireAudit(token: unknown): Promise<LoadedAudit | null> {
  const audit = await loadAuditByToken(token)
  if (!audit || !(await hasEmailGate(audit.tokenHash))) return null
  return audit
}

export function emailMatches(audit: { clientEmail: string }, candidate: string): boolean {
  return safeEqual(normalizeEmail(audit.clientEmail), normalizeEmail(candidate))
}

// --- Limitation des tentatives (en mémoire, best effort : propre à chaque instance serveur) -----

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const attempts = new Map<string, { count: number; resetAt: number }>()

async function attemptKey(tokenHash: string): Promise<string> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  return `${tokenHash}:${ip}`
}

export async function isRateLimited(tokenHash: string): Promise<boolean> {
  const entry = attempts.get(await attemptKey(tokenHash))
  return !!entry && entry.resetAt > Date.now() && entry.count >= MAX_ATTEMPTS
}

export async function recordFailedAttempt(tokenHash: string): Promise<void> {
  const now = Date.now()
  for (const [key, entry] of attempts) if (entry.resetAt <= now) attempts.delete(key)
  const key = await attemptKey(tokenHash)
  const entry = attempts.get(key)
  if (entry && entry.resetAt > now) entry.count += 1
  else attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
}

export async function clearAttempts(tokenHash: string): Promise<void> {
  attempts.delete(await attemptKey(tokenHash))
}
