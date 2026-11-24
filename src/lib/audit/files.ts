// Constantes et helpers partagés client/serveur pour les pièces jointes de l'audit.

export const AUDIT_FILE_KINDS = [
  'CV_PORTFOLIO',
  'REVENUE_DECLARATIONS',
  'GALLERY_CONTRACTS',
  'INVENTORY',
  'PRICE_LIST',
  'RETIREMENT_STATEMENT',
] as const

export type AuditFileKindId = (typeof AUDIT_FILE_KINDS)[number]

export const FILE_KIND_LABELS: Record<AuditFileKindId, { title: string; hint?: string }> = {
  CV_PORTFOLIO: { title: 'CV d’artiste et portfolio', hint: 'PDF ou lien' },
  REVENUE_DECLARATIONS: { title: 'Déclarations de revenus artistiques', hint: 'Des trois dernières années' },
  GALLERY_CONTRACTS: { title: 'Contrat(s) de galerie en cours' },
  INVENTORY: { title: 'Inventaire des œuvres', hint: 'Même partiel' },
  PRICE_LIST: { title: 'Liste de prix actuelle' },
  RETIREMENT_STATEMENT: { title: 'Relevé de carrière retraite', hint: 'Si disponible' },
}

export const MAX_FILE_BYTES = 15 * 1024 * 1024
export const MAX_FILES_PER_KIND = 5

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const FILE_ACCEPT = Object.keys(MIME_BY_EXTENSION).map((e) => `.${e}`).join(',')

export function isFileKind(value: unknown): value is AuditFileKindId {
  return typeof value === 'string' && (AUDIT_FILE_KINDS as readonly string[]).includes(value)
}

export function extensionOf(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i < 0 ? '' : filename.slice(i + 1).toLowerCase()
}

/** Le type MIME est déduit de l'extension : on ne fait jamais confiance au type déclaré par le navigateur. */
export function mimeFromFilename(filename: string): string | null {
  return MIME_BY_EXTENSION[extensionOf(filename)] ?? null
}

export function sanitizeFilename(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? 'fichier'
  const ext = extensionOf(base)
  const stem = (ext ? base.slice(0, -(ext.length + 1)) : base)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80)
  return `${stem || 'fichier'}.${ext}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}

export interface AuditFileDto {
  id: string
  kind: AuditFileKindId
  filename: string
  sizeBytes: number
}
