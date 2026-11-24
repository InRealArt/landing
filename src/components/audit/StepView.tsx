import { DOCS_SECTION, SECTIONS, type AnswerValue, type Answers, type Question } from '@/lib/audit/questionnaire'
import type { AuditFileDto } from '@/lib/audit/files'
import ChoiceInput from './inputs/ChoiceInput'
import FilesStep from './inputs/FilesStep'
import MatrixInput from './inputs/MatrixInput'
import RadioGridInput from './inputs/RadioGridInput'
import TableInput from './inputs/TableInput'
import TextInput from './inputs/TextInput'
import type { InputProps } from './inputs/types'

export type Step = { type: 'question'; q: Question } | { type: 'docs' }

interface Props {
  step: Step
  answers: Answers
  onChange: (key: string, value: AnswerValue | undefined) => void
  token: string
  files: AuditFileDto[]
  onFilesChange: (update: (prev: AuditFileDto[]) => AuditFileDto[]) => void
}

function QuestionInput(props: InputProps) {
  switch (props.q.input.kind) {
    case 'text':
    case 'textarea':
      return <TextInput {...props} />
    case 'choice':
      return <ChoiceInput {...props} />
    case 'table':
      return <TableInput {...props} />
    case 'matrix':
      return <MatrixInput {...props} />
    case 'radioGrid':
      return <RadioGridInput {...props} />
  }
}

export default function StepView({ step, answers, onChange, token, files, onFilesChange }: Props) {
  const isDocs = step.type === 'docs'
  const q = step.type === 'question' ? step.q : null
  const section = q ? q.section : DOCS_SECTION
  const titleId = q ? `title-${q.id}` : 'title-docs'
  const hintId = q ? `hint-${q.id}` : 'hint-docs'
  const hint = q ? q.hint : 'Facultatif, mais utile : joignez ce que vous avez sous la main. Vous pourrez aussi les transmettre plus tard.'

  return (
    <div>
      <div data-anim className="mb-6 flex items-end gap-5">
        <span
          aria-hidden="true"
          className="unbounded select-none text-[clamp(3.5rem,13vw,7rem)] font-extralight leading-[0.85] text-transparent"
          style={{ WebkitTextStroke: '1px var(--gold-accent)' }}
        >
          {q ? String(q.n).padStart(2, '0') : '+'}
        </span>
        <span className="pb-1 text-xs uppercase tracking-[0.3em] text-textColor/70">
          {section}/14 · {SECTIONS[section - 1]}
        </span>
      </div>

      {q?.lead && (
        <p data-anim className="mb-6 border-l-2 border-gold-accent pl-4 text-base italic leading-relaxed text-textColor/80">{q.lead}</p>
      )}

      <h2 id={titleId} data-step-heading tabIndex={-1} data-anim className="serif mb-3 text-3xl font-normal leading-snug text-textColor outline-none sm:text-4xl">
        {q ? q.title : 'Documents à joindre'}
        {(q?.optional || isDocs) && <span className="ml-3 align-middle text-xs font-normal uppercase tracking-[0.25em] text-gold-accent">Facultatif</span>}
      </h2>
      {hint && <p id={hintId} data-anim className="mb-8 max-w-2xl text-base leading-relaxed text-textColor/70">{hint}</p>}

      <div data-anim className={hint ? '' : 'mt-8'}>
        {q ? (
          <QuestionInput q={q} answers={answers} onChange={onChange} labelId={titleId} describedBy={hint ? hintId : undefined} />
        ) : (
          <FilesStep token={token} files={files} onFilesChange={onFilesChange} answers={answers} onChange={onChange} />
        )}
      </div>
    </div>
  )
}
