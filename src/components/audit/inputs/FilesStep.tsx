'use client'

import { useState } from 'react'
import { deleteUpload, presignUpload, registerUpload } from '@/actions/auditActions'
import {
  AUDIT_FILE_KINDS,
  FILE_ACCEPT,
  FILE_KIND_LABELS,
  MAX_FILES_PER_KIND,
  MAX_FILE_BYTES,
  formatBytes,
  mimeFromFilename,
  type AuditFileDto,
  type AuditFileKindId,
} from '@/lib/audit/files'
import { DOCS_LINK_KEY, LIMITS, type Answers, type AnswerValue } from '@/lib/audit/questionnaire'
import { shake } from '../anim'
import { fieldClass, ghostButton, labelClass } from '../ui'

interface Props {
  token: string
  files: AuditFileDto[]
  onFilesChange: (update: (prev: AuditFileDto[]) => AuditFileDto[]) => void
  answers: Answers
  onChange: (key: string, value: AnswerValue | undefined) => void
}

const ERRORS: Record<string, string> = {
  too_large: 'Ce fichier dépasse 15 Mo.',
  type: 'Format non accepté (PDF, JPG, PNG, DOCX ou XLSX).',
  quota: 'Vous avez atteint le maximum de 5 fichiers pour ce document.',
  locked: 'Le questionnaire a déjà été envoyé.',
}

function putFile(url: string, file: File, mime: string, onProgress: (pct: number) => void): Promise<boolean> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', mime)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300)
    xhr.onerror = () => resolve(false)
    xhr.send(file)
  })
}

export default function FilesStep({ token, files, onFilesChange, answers, onChange }: Props) {
  const [progress, setProgress] = useState<Partial<Record<AuditFileKindId, number>>>({})
  const [errors, setErrors] = useState<Partial<Record<AuditFileKindId, string>>>({})
  const link = typeof answers[DOCS_LINK_KEY] === 'string' ? (answers[DOCS_LINK_KEY] as string) : ''

  function fail(kind: AuditFileKindId, message: string, el: Element | null) {
    setErrors((e) => ({ ...e, [kind]: message }))
    shake(el)
  }

  async function upload(kind: AuditFileKindId, file: File, card: Element | null) {
    setErrors((e) => ({ ...e, [kind]: undefined }))
    const mime = mimeFromFilename(file.name)
    if (!mime) return fail(kind, ERRORS.type, card)
    if (file.size > MAX_FILE_BYTES) return fail(kind, ERRORS.too_large, card)
    setProgress((p) => ({ ...p, [kind]: 0 }))
    try {
      const signed = await presignUpload(token, kind, file.name, file.size)
      if (!signed.ok) return fail(kind, ERRORS[signed.code] ?? 'Envoi impossible pour le moment.', card)
      const sent = await putFile(signed.uploadUrl, file, mime, (pct) => setProgress((p) => ({ ...p, [kind]: pct })))
      if (!sent) return fail(kind, 'L’envoi a échoué. Vérifiez votre connexion et réessayez.', card)
      const registered = await registerUpload(token, kind, signed.key, file.name)
      if (!registered.ok) return fail(kind, ERRORS[registered.code] ?? 'Envoi impossible pour le moment.', card)
      onFilesChange((prev) => [...prev, registered.file])
    } catch {
      fail(kind, 'Envoi impossible pour le moment.', card)
    } finally {
      setProgress((p) => ({ ...p, [kind]: undefined }))
    }
  }

  async function remove(file: AuditFileDto, card: Element | null) {
    const result = await deleteUpload(token, file.id)
    if (result.ok) onFilesChange((prev) => prev.filter((f) => f.id !== file.id))
    else fail(file.kind, 'Suppression impossible pour le moment.', card)
  }

  return (
    <div className="space-y-6">
      {AUDIT_FILE_KINDS.map((kind) => {
        const list = files.filter((f) => f.kind === kind)
        const uploading = progress[kind] !== undefined
        const meta = FILE_KIND_LABELS[kind]
        const inputId = `file-${kind}`
        return (
          <div key={kind} data-card className="border border-borderColor bg-cardBackground/40 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base text-textColor">{meta.title}</p>
                {meta.hint && <p className="text-sm text-textColor/70">{meta.hint}</p>}
              </div>
              {list.length < MAX_FILES_PER_KIND && (
                <>
                  <input
                    id={inputId}
                    type="file"
                    accept={FILE_ACCEPT}
                    disabled={uploading}
                    className="peer sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      const card = e.target.closest('[data-card]')
                      e.target.value = ''
                      if (file) void upload(kind, file, card)
                    }}
                  />
                  <label htmlFor={inputId} className={`${ghostButton} cursor-pointer peer-disabled:opacity-40 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-backgroundColor`}>
                    {uploading ? 'Envoi…' : '+ Ajouter un fichier'}
                  </label>
                </>
              )}
            </div>
            {uploading && (
              <div className="mt-4 h-0.5 w-full bg-textColor/15" role="progressbar" aria-valuenow={progress[kind]} aria-valuemin={0} aria-valuemax={100} aria-label={`Envoi de ${meta.title}`}>
                <div className="h-full bg-gold-accent transition-[width] duration-200" style={{ width: `${progress[kind]}%` }} />
              </div>
            )}
            {list.length > 0 && (
              <ul className="mt-4 divide-y divide-borderColor">
                {list.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="min-w-0 truncate text-textColor">{f.filename} <span className="text-textColor/60">({formatBytes(f.sizeBytes)})</span></span>
                    <button
                      type="button"
                      onClick={(e) => void remove(f, e.currentTarget.closest('[data-card]'))}
                      aria-label={`Supprimer ${f.filename}`}
                      className="min-h-[44px] shrink-0 px-2 text-xs uppercase tracking-[0.2em] text-textColor/70 hover:text-gold-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p role="alert" className="mt-3 text-sm text-textColor empty:hidden">
              {errors[kind] && <span className="border-l-2 border-gold-accent pl-3">{errors[kind]}</span>}
            </p>
          </div>
        )
      })}
      <div>
        <label htmlFor="field-docs-link" className={labelClass}>Ou un lien vers votre portfolio (facultatif)</label>
        <input
          id="field-docs-link"
          type="url"
          inputMode="url"
          autoComplete="off"
          value={link}
          onChange={(e) => onChange(DOCS_LINK_KEY, e.target.value || undefined)}
          maxLength={LIMITS.link}
          placeholder="https://"
          className={fieldClass}
        />
      </div>
      <p className="text-sm text-textColor/60">PDF, JPG, PNG, DOCX ou XLSX · 15 Mo maximum par fichier · 5 fichiers par document</p>
    </div>
  )
}
