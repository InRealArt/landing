import { createHash, timingSafeEqual } from 'crypto'

// Jeton : 32 octets en base64url = 43 caractères. Tout ce qui n'a pas cette forme est rejeté avant d'interroger la base.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/

export function isWellFormedToken(token: unknown): token is string {
  return typeof token === 'string' && TOKEN_PATTERN.test(token)
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Comparaison à temps constant, indépendante de la longueur (on compare des empreintes SHA-256). */
export function safeEqual(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest()
  const db = createHash('sha256').update(b).digest()
  return timingSafeEqual(da, db)
}
