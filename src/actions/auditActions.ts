'use server'

import { randomUUID } from 'crypto'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import {
  clearAttempts,
  emailMatches,
  grantEmailGate,
  isRateLimited,
  loadAuditByToken,
  recordFailedAttempt,
  requireAudit,
} from '@/lib/audit/access'
import {
  MAX_FILES_PER_KIND,
  MAX_FILE_BYTES,
  isFileKind,
  mimeFromFilename,
  sanitizeFilename,
  type AuditFileDto,
} from '@/lib/audit/files'
import { QUESTIONNAIRE_VERSION } from '@/lib/audit/questionnaire'
import { completeAnswersSchema, consentSchema, draftAnswersSchema, emailSchema } from '@/lib/audit/schemas'

// Chaque action valide d'abord le jeton, l'e-mail déjà vérifié, la révocation et l'expiration.
// Un refus renvoie toujours la même réponse. Aucun log de jeton ni de réponses.

const DENIED = { ok: false, code: 'denied' } as const
const MAX_PAYLOAD_CHARS = 200_000

type Denied = typeof DENIED

export type VerifyEmailResult = { ok: true } | { ok: false; code: 'mismatch' | 'rate_limited' | 'denied' }

export async function verifyEmail(token: string, email: string): Promise<VerifyEmailResult> {
  const audit = await loadAuditByToken(token)
  if (!audit) return DENIED
  if (await isRateLimited(audit.tokenHash)) return { ok: false, code: 'rate_limited' }

  const parsed = emailSchema.safeParse(email)
  if (!parsed.success || !emailMatches(audit, parsed.data)) {
    await recordFailedAttempt(audit.tokenHash)
    return { ok: false, code: 'mismatch' }
  }
  if (!(await grantEmailGate(audit.tokenHash))) return DENIED
  await clearAttempts(audit.tokenHash)
  return { ok: true }
}

export async function saveDraft(token: string, answers: unknown): Promise<{ ok: true } | Denied | { ok: false; code: 'invalid' | 'locked' }> {
  const audit = await requireAudit(token)
  if (!audit) return DENIED
  if (audit.status === 'SUBMITTED') return { ok: false, code: 'locked' }
  if (JSON.stringify(answers ?? null).length > MAX_PAYLOAD_CHARS) return { ok: false, code: 'invalid' }

  const parsed = draftAnswersSchema.safeParse(answers)
  if (!parsed.success) return { ok: false, code: 'invalid' }

  const { count } = await prisma.auditClient.updateMany({
    where: { id: audit.id, status: { not: 'SUBMITTED' } },
    data: { answers: parsed.data as Prisma.InputJsonObject, status: 'DRAFT', questionnaireVersion: QUESTIONNAIRE_VERSION },
  })
  return count === 1 ? { ok: true } : { ok: false, code: 'locked' }
}

export async function submitAudit(
  token: string,
  answers: unknown,
  consent: unknown,
): Promise<{ ok: true } | Denied | { ok: false; code: 'invalid' | 'locked' | 'consent'; missing?: string[] }> {
  const audit = await requireAudit(token)
  if (!audit) return DENIED
  if (audit.status === 'SUBMITTED') return { ok: false, code: 'locked' }
  if (JSON.stringify(answers ?? null).length > MAX_PAYLOAD_CHARS) return { ok: false, code: 'invalid' }

  const consentParsed = consentSchema.safeParse(consent)
  if (!consentParsed.success) return { ok: false, code: 'consent' }

  const parsed = completeAnswersSchema.safeParse(answers)
  if (!parsed.success) {
    const missing = parsed.error.issues.filter((i) => i.message === 'required').map((i) => String(i.path[0]))
    return { ok: false, code: 'invalid', missing }
  }

  const now = new Date()
  const { count } = await prisma.auditClient.updateMany({
    where: { id: audit.id, status: { not: 'SUBMITTED' } },
    data: {
      answers: parsed.data as Prisma.InputJsonObject,
      status: 'SUBMITTED',
      submittedAt: now,
      consentAt: now,
      signatureName: consentParsed.data.signatureName,
      questionnaireVersion: QUESTIONNAIRE_VERSION,
    },
  })
  return count === 1 ? { ok: true } : { ok: false, code: 'locked' }
}

// --- Pièces jointes ------------------------------------------------------------------------------

type FileResult<T> = ({ ok: true } & T) | Denied | { ok: false; code: 'invalid' | 'locked' | 'too_large' | 'type' | 'quota' | 'missing' }

async function r2() {
  // Import différé : le client R2 lève une erreur à l'import si les variables d'environnement manquent.
  const [{ r2Client, R2_BUCKET_NAME }, s3, presigner] = await Promise.all([
    import('@/lib/cloufare/r2/client'),
    import('@aws-sdk/client-s3'),
    import('@aws-sdk/s3-request-presigner'),
  ])
  return { client: r2Client, bucket: R2_BUCKET_NAME, ...s3, getSignedUrl: presigner.getSignedUrl }
}

function toDto(f: { id: string; kind: AuditFileDto['kind']; filename: string; sizeBytes: number }): AuditFileDto {
  return { id: f.id, kind: f.kind, filename: f.filename, sizeBytes: f.sizeBytes }
}

export async function presignUpload(
  token: string,
  kind: string,
  filename: string,
  size: number,
): Promise<FileResult<{ uploadUrl: string; key: string }>> {
  const audit = await requireAudit(token)
  if (!audit) return DENIED
  if (audit.status === 'SUBMITTED') return { ok: false, code: 'locked' }
  if (!isFileKind(kind) || typeof filename !== 'string' || !Number.isInteger(size) || size <= 0) return { ok: false, code: 'invalid' }
  if (size > MAX_FILE_BYTES) return { ok: false, code: 'too_large' }
  const mime = mimeFromFilename(filename)
  if (!mime) return { ok: false, code: 'type' }
  if ((await prisma.auditFile.count({ where: { auditClientId: audit.id, kind } })) >= MAX_FILES_PER_KIND) return { ok: false, code: 'quota' }

  const { client, bucket, PutObjectCommand, getSignedUrl } = await r2()
  const key = `audits/${audit.id}/${randomUUID()}-${sanitizeFilename(filename)}`
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: mime, ContentLength: size }),
    { expiresIn: 300 },
  )
  return { ok: true, uploadUrl, key }
}

export async function registerUpload(
  token: string,
  kind: string,
  key: string,
  filename: string,
): Promise<FileResult<{ file: AuditFileDto }>> {
  const audit = await requireAudit(token)
  if (!audit) return DENIED
  if (audit.status === 'SUBMITTED') return { ok: false, code: 'locked' }
  if (!isFileKind(kind) || typeof key !== 'string' || typeof filename !== 'string') return { ok: false, code: 'invalid' }
  if (!key.startsWith(`audits/${audit.id}/`) || key.includes('..')) return { ok: false, code: 'invalid' }

  // Tout refus après ce point supprime l'objet déjà déposé, pour ne laisser aucun fichier orphelin dans R2.
  const { client, bucket, HeadObjectCommand, DeleteObjectCommand } = await r2()
  const discard = () => client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key })).catch(() => undefined)
  const mime = mimeFromFilename(filename)
  if (!mime) {
    await discard()
    return { ok: false, code: 'type' }
  }
  let size: number
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    size = head.ContentLength ?? 0
  } catch {
    return { ok: false, code: 'missing' }
  }
  const existing = await prisma.auditFile.findFirst({ where: { auditClientId: audit.id, r2Key: key } })
  if (existing) return { ok: true, file: toDto(existing) }

  const overQuota = (await prisma.auditFile.count({ where: { auditClientId: audit.id, kind } })) >= MAX_FILES_PER_KIND
  if (size <= 0 || size > MAX_FILE_BYTES || overQuota) {
    await discard()
    return { ok: false, code: size > MAX_FILE_BYTES ? 'too_large' : overQuota ? 'quota' : 'invalid' }
  }

  const file = await prisma.auditFile.create({
    data: { auditClientId: audit.id, kind, r2Key: key, filename: filename.slice(0, 200), mimeType: mime, sizeBytes: size },
  })
  return { ok: true, file: toDto(file) }
}

export async function deleteUpload(token: string, fileId: string): Promise<FileResult<object>> {
  const audit = await requireAudit(token)
  if (!audit) return DENIED
  if (audit.status === 'SUBMITTED') return { ok: false, code: 'locked' }
  if (typeof fileId !== 'string') return { ok: false, code: 'invalid' }

  const file = await prisma.auditFile.findFirst({ where: { id: fileId, auditClientId: audit.id } })
  if (!file || !file.r2Key.startsWith(`audits/${audit.id}/`)) return { ok: false, code: 'invalid' }

  const { client, bucket, DeleteObjectCommand } = await r2()
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: file.r2Key }))
  } catch {
    return { ok: false, code: 'invalid' }
  }
  await prisma.auditFile.delete({ where: { id: file.id } })
  return { ok: true }
}
