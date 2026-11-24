import { SECTIONS, TOTAL_QUESTIONS } from '@/lib/audit/questionnaire'
import AuditHero from './AuditHero'
import { primaryButton } from './ui'

interface Props {
  clientName: string
  auditorName: string | null
  dueLabel: string
  answered: number
  onStart: () => void
}

const RULES = [
  'Répondez au plus près de la réalité : il n’y a ni bonne ni mauvaise réponse.',
  'Une estimation vaut mieux qu’une case vide ; indiquez « ? » si vous ne savez pas.',
  'Les questions signalées « facultatif » peuvent être laissées sans réponse.',
  'Sauf mention contraire, la période de référence est celle des trois dernières années civiles (2023, 2024, 2025).',
]

export default function Welcome({ clientName, auditorName, dueLabel, answered, onStart }: Props) {
  const returning = answered > 0
  return (
    <AuditHero
      titleLines={[`${returning ? 'Bon retour' : 'Bonjour'},`, <em key="n" className="text-gold-accent">{clientName}</em>]}
      subtitle={
        returning ? (
          <p className="border-l-2 border-gold-accent pl-4 text-textColor">
            Vous aviez répondu à {answered}/{TOTAL_QUESTIONS} questions. Vous reprenez où vous en étiez.
          </p>
        ) : (
          <p>
            Ce questionnaire est la première étape de votre audit de carrière : il permet de faire le point sur votre situation
            (revenus, atelier, diffusion, reconnaissance, archives) et d’identifier vos priorités.
          </p>
        )
      }
    >
      <dl className="mb-10 grid max-w-2xl gap-6 border-y border-gold-accent/25 py-6 text-sm sm:grid-cols-3">
        <div>
          <dt className="mb-1 text-xs uppercase tracking-[0.25em] text-textColor/70">À retourner avant le</dt>
          <dd className="text-base text-textColor">{dueLabel}</dd>
        </div>
        <div>
          <dt className="mb-1 text-xs uppercase tracking-[0.25em] text-textColor/70">Durée estimée</dt>
          <dd className="text-base text-textColor">45 min à 1 h</dd>
        </div>
        <div>
          <dt className="mb-1 text-xs uppercase tracking-[0.25em] text-textColor/70">{auditorName ? 'Auditeur' : 'Questions'}</dt>
          <dd className="text-base text-textColor">{auditorName ?? TOTAL_QUESTIONS}</dd>
        </div>
      </dl>

      <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="button" onClick={onStart} className={`${primaryButton} group`}>
          {returning ? 'Reprendre' : 'Commencer'}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
        </button>
        <p className="text-sm text-textColor/70">Enregistrement automatique : reprenez plus tard avec le même lien.</p>
      </div>

      <ol aria-label="Les 14 étapes" className="mb-10 flex max-w-3xl flex-wrap gap-2">
        {SECTIONS.map((s, i) => (
          <li key={s} className="border border-textColor/20 px-3 py-1.5 text-xs text-textColor/80">
            <span className="mr-2 text-gold-accent">{String(i + 1).padStart(2, '0')}</span>
            {s}
          </li>
        ))}
      </ol>

      <ul className="mb-8 grid max-w-3xl gap-3 text-sm leading-relaxed text-textColor/80 sm:grid-cols-2">
        {RULES.map((t) => (
          <li key={t} className="border-t border-borderColor pt-3">{t}</li>
        ))}
      </ul>
      <p className="max-w-3xl text-sm leading-relaxed text-textColor/70">
        <strong className="font-semibold text-textColor">Confidentialité.</strong> Vos réponses sont utilisées uniquement pour réaliser votre audit et, si vous y donnez suite,
        votre accompagnement. Elles ne sont ni transmises à des tiers ni réutilisées à d’autres fins, et sont supprimées à votre demande à l’issue de la mission.
      </p>
    </AuditHero>
  )
}
