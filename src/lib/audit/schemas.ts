import { z } from 'zod'
import { DOCS_LINK_KEY, LIMITS, QUESTIONS, cellKey, detailsKey, isAnswered, type Question } from './questionnaire'

const enumOf = (ids: string[]) => z.enum(ids as [string, ...string[]])
// Un choix peut être vidé côté client : la chaîne vide est acceptée dans un brouillon.
const optionalChoice = (ids: string[]) => z.union([enumOf(ids), z.literal('')])
const text = (max: number) => z.string().max(max)

const MAX_ROWS = 30

function shapeFor(q: Question): Record<string, z.ZodTypeAny> {
  const input = q.input
  switch (input.kind) {
    case 'text':
      return { [q.id]: text(LIMITS.text) }
    case 'textarea':
      return { [q.id]: text(LIMITS.textarea) }
    case 'choice': {
      const ids = input.options.map((o) => o.id)
      const shape: Record<string, z.ZodTypeAny> = {
        [q.id]: input.multiple ? z.array(enumOf(ids)).max(ids.length) : optionalChoice(ids),
      }
      if (input.textLabel) shape[detailsKey(q)] = text(LIMITS.details)
      return shape
    }
    case 'table': {
      const row = z.object(Object.fromEntries(input.columns.map((c) => [c.id, text(LIMITS.cell)]))).partial()
      return { [q.id]: z.array(row).max(MAX_ROWS) }
    }
    case 'matrix': {
      const cells = input.rows.flatMap((r) => input.columns.map((c) => [cellKey(r.id, c.id), text(LIMITS.matrixCell)] as const))
      return { [q.id]: z.object(Object.fromEntries(cells)).partial() }
    }
    case 'radioGrid': {
      const ids = input.columns.map((c) => c.id)
      return { [q.id]: z.object(Object.fromEntries(input.rows.map((r) => [r.id, optionalChoice(ids)]))).partial() }
    }
  }
}

const shape = Object.assign({ [DOCS_LINK_KEY]: text(LIMITS.link) }, ...QUESTIONS.map(shapeFor)) as Record<string, z.ZodTypeAny>

/** Brouillon : toutes les clés optionnelles, clés inconnues ignorées. */
export const draftAnswersSchema = z.object(shape).partial()

/** Soumission : mêmes règles, plus toutes les questions non facultatives renseignées (« ? » compte comme une réponse). */
export const completeAnswersSchema = draftAnswersSchema.superRefine((answers, ctx) => {
  for (const q of QUESTIONS) {
    if (!q.optional && !isAnswered(q, answers as Parameters<typeof isAnswered>[1])) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [q.id], message: 'required' })
    }
  }
})

export const consentSchema = z.object({
  accepted: z.literal(true),
  signatureName: z.string().trim().min(2).max(LIMITS.signature),
})

export const emailSchema = z.string().trim().min(3).max(254).email()
