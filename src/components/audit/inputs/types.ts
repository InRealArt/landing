import type { AnswerValue, Answers, Question } from '@/lib/audit/questionnaire'

export interface InputProps {
  q: Question
  answers: Answers
  onChange: (key: string, value: AnswerValue | undefined) => void
  /** Id de l'élément qui porte le titre de la question (aria-labelledby). */
  labelId: string
  describedBy?: string
}
