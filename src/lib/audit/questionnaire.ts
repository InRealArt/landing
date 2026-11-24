// Définition du questionnaire d'audit (38 questions). Partagée client/serveur : aucune dépendance serveur ici.
// Les libellés sont repris du questionnaire Word. Le numéro de version doit rester identique à celui du backoffice.

export const QUESTIONNAIRE_VERSION = 1

/** Longueurs maximales : partagées entre les attributs maxLength des champs et les schémas zod. */
export const LIMITS = { text: 500, textarea: 5000, cell: 300, details: 1000, matrixCell: 40, link: 500, signature: 120 } as const

export interface Option {
  id: string
  label: string
}

export interface Column {
  id: string
  label: string
  /** Liste déroulante si renseigné, saisie libre sinon. */
  options?: Option[]
  numeric?: boolean
}

export type Input =
  | { kind: 'text'; placeholder?: string }
  | { kind: 'textarea'; rows?: number; placeholder?: string }
  /** Choix unique (valeur string) ou multiple (string[]), avec un champ texte optionnel stocké sous `<id>_details`. */
  | { kind: 'choice'; multiple: boolean; options: Option[]; textLabel?: string }
  /** Tableau à lignes ajoutables : tableau de { [colonne]: valeur }. */
  | { kind: 'table'; columns: Column[] }
  /** Grille de saisie : { "<ligne>_<colonne>": valeur }. */
  | { kind: 'matrix'; rows: Option[]; columns: Option[]; unit: string }
  /** Grille de cases à cocher (une par ligne) : { [ligne]: colonne }. */
  | { kind: 'radioGrid'; rows: Option[]; columns: Option[]; rowHeader: string }

export interface Question {
  id: string
  n: number
  section: number
  title: string
  hint?: string
  /** Texte d'introduction affiché au-dessus de la question (ex. mention de la partie facultative). */
  lead?: string
  optional?: boolean
  input: Input
}

export const SECTIONS: string[] = [
  'Parcours et formation',
  'Pratique artistique',
  'Atelier et production',
  'Statut et revenus',
  'Expositions',
  'Galeries et ventes',
  'Visibilité en ligne',
  'Résidences, aides et commandes',
  'Réseau et dynamique',
  'Archives et protection sociale',
  'Contraintes personnelles',
  'Vos attentes',
  'Accompagnement',
  'Pièces jointes',
]

export const DOCS_SECTION = SECTIONS.length

const yesNo: Option[] = [
  { id: 'yes', label: 'Oui' },
  { id: 'no', label: 'Non' },
]

export const QUESTIONS: Question[] = [
  {
    id: 'q1', n: 1, section: 1,
    title: 'Année de naissance et commune de résidence',
    input: { kind: 'text', placeholder: 'Ex. 1985, Lyon' },
  },
  {
    id: 'q2', n: 2, section: 1,
    title: 'Formation artistique',
    hint: 'Établissement, diplôme (DNA, DNSEP, autre) et année d’obtention',
    input: {
      kind: 'choice', multiple: true, textLabel: 'Établissement, diplôme et année',
      options: [
        { id: 'national', label: 'École nationale' },
        { id: 'territorial', label: 'École territoriale' },
        { id: 'university', label: 'Université' },
        { id: 'self', label: 'Autodidacte' },
        { id: 'other', label: 'Autre' },
      ],
    },
  },
  {
    id: 'q3', n: 3, section: 1,
    title: 'Depuis quelle année exercez-vous votre pratique artistique de façon continue ? Y a-t-il eu des interruptions (durée, raison) ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q4', n: 4, section: 2,
    title: 'Décrivez votre pratique en quelques lignes : techniques, formats, séries en cours.',
    input: { kind: 'textarea', rows: 7 },
  },
  {
    id: 'q5', n: 5, section: 2,
    title: 'Combien d’œuvres achevez-vous en moyenne par an ? La tendance est-elle à la hausse, stable ou à la baisse ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q6', n: 6, section: 3,
    title: 'Votre espace de travail',
    hint: 'Surface utilisable (m²) et coût mensuel (loyer et charges)',
    input: {
      kind: 'choice', multiple: true, textLabel: 'Surface utilisable (m²) et coût mensuel',
      options: [
        { id: 'dedicated', label: 'Atelier dédié' },
        { id: 'shared', label: 'Atelier partagé' },
        { id: 'home', label: 'Pièce du logement' },
        { id: 'public', label: 'Atelier public / associatif' },
        { id: 'none', label: 'Aucun' },
      ],
    },
  },
  {
    id: 'q7', n: 7, section: 3,
    title: 'Disposez-vous d’un espace de stockage suffisant pour vos œuvres ?',
    input: {
      kind: 'choice', multiple: false,
      options: [
        { id: 'yes', label: 'Oui' },
        { id: 'partly', label: 'Partiellement' },
        { id: 'no', label: 'Non' },
      ],
    },
  },
  {
    id: 'q8', n: 8, section: 3,
    title: 'Qui photographie vos œuvres, et combien cela vous coûte-t-il par an ? Encadrement, transport : faites-vous appel à des prestataires ?',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q9', n: 9, section: 4,
    title: 'Votre statut',
    input: {
      kind: 'choice', multiple: false,
      options: [
        { id: 'author_real', label: 'Artiste-auteur (BNC réel)' },
        { id: 'author_micro', label: 'Artiste-auteur (micro-BNC)' },
        { id: 'micro_entrepreneur', label: 'Micro-entrepreneur' },
        { id: 'other', label: 'Autre' },
      ],
    },
  },
  {
    id: 'q10', n: 10, section: 4,
    title: 'Vos revenus sur les trois dernières années',
    hint: 'Des ordres de grandeur suffisent. Les montants exacts figurent sur vos déclarations, que vous pouvez joindre. Montants annuels (€).',
    input: {
      kind: 'matrix', unit: '€',
      columns: [{ id: '2023', label: '2023' }, { id: '2024', label: '2024' }, { id: '2025', label: '2025' }],
      rows: [
        { id: 'urssaf', label: 'Revenu artistique déclaré (Urssaf)' },
        { id: 'sales', label: 'Chiffre d’affaires des ventes d’œuvres' },
        { id: 'otherArt', label: 'Autres revenus artistiques (commandes, droits, ateliers)' },
        { id: 'otherJobs', label: 'Revenus d’autres activités (salaire, enseignement…)' },
        { id: 'total', label: 'Total approximatif' },
      ],
    },
  },
  {
    id: 'q11', n: 11, section: 4,
    title: 'Quelles sont vos autres activités rémunérées (enseignement, médiation, emploi sans lien avec l’art…) et combien d’heures par semaine y consacrez-vous ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q12', n: 12, section: 4,
    title: 'Vos revenus varient-ils beaucoup d’un mois à l’autre ? Combien de mois pourriez-vous tenir sans aucun revenu ?',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q13', n: 13, section: 5,
    title: 'Vos expositions des trois dernières années',
    hint: 'Ajoutez des lignes si nécessaire, ou joignez votre CV d’artiste. Si vous n’avez rien à indiquer, écrivez « Aucune ».',
    input: {
      kind: 'table',
      columns: [
        { id: 'year', label: 'Année', numeric: true },
        { id: 'place', label: 'Lieu et ville' },
        {
          id: 'type', label: 'Personnelle / collective',
          options: [{ id: 'solo', label: 'Personnelle' }, { id: 'group', label: 'Collective' }],
        },
        { id: 'selected', label: 'Sur sélection ?', options: yesNo },
      ],
    },
  },
  {
    id: 'q14', n: 14, section: 6,
    title: 'Une ou plusieurs galeries vous représentent-elles ? Lesquelles, depuis quand, avec ou sans contrat ?',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q15', n: 15, section: 6,
    title: 'Comment se répartissent vos ventes entre les différents canaux ?',
    hint: 'En % approximatif.',
    input: {
      kind: 'matrix', unit: '%',
      columns: [{ id: 'pct', label: '%' }],
      rows: [
        { id: 'mainGallery', label: 'Galerie principale' },
        { id: 'otherGalleries', label: 'Autres galeries' },
        { id: 'studio', label: 'Vente en atelier' },
        { id: 'online', label: 'Plateformes en ligne' },
        { id: 'fairs', label: 'Foires' },
        { id: 'other', label: 'Autres' },
      ],
    },
  },
  {
    id: 'q16', n: 16, section: 6,
    title: 'Participez-vous à des foires ? Lesquelles et combien par an ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q17', n: 17, section: 6,
    title: 'Vos prix : fourchette actuelle selon les formats, et évolution depuis trois ans.',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q18', n: 18, section: 6,
    title: 'Combien de collectionneurs vous ont acheté au moins deux œuvres ? Vendez-vous parfois avant le vernissage ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q19', n: 19, section: 7,
    title: 'Vos réseaux sociaux et votre site : comptes, audience approximative, ventes générées.',
    input: { kind: 'textarea', rows: 6 },
  },
  {
    id: 'q20', n: 20, section: 8,
    title: 'Résidences, aides, acquisitions et commandes publiques',
    hint: 'Depuis le début de votre carrière. Type : résidence, aide à la création, acquisition, commande, prix, exposition en centre d’art. Si vous n’avez rien à indiquer, écrivez « Aucune ».',
    input: {
      kind: 'table',
      columns: [
        { id: 'year', label: 'Année', numeric: true },
        { id: 'type', label: 'Type' },
        { id: 'structure', label: 'Structure (FRAC, musée, DRAC, centre d’art…)' },
        { id: 'amount', label: 'Montant' },
      ],
    },
  },
  {
    id: 'q21', n: 21, section: 8,
    title: 'Catalogues, monographies ou textes critiques consacrés à votre travail',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q22', n: 22, section: 8,
    title: 'Sur les deux dernières années, combien de candidatures avez-vous déposées (résidences, salons, aides) et combien ont abouti ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q23', n: 23, section: 9,
    title: 'Citez les personnes (galeristes, commissaires, collectionneurs, institutions) qui vous ont apporté une opportunité concrète au cours des 12 derniers mois.',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q24', n: 24, section: 9,
    title: 'Quelle a été votre plus longue période sans exposition, vente ni projet ces cinq dernières années ?',
    input: { kind: 'textarea', rows: 4 },
  },
  {
    id: 'q25', n: 25, section: 10,
    title: 'L’état de vos archives',
    input: {
      kind: 'radioGrid', rowHeader: 'Élément',
      columns: [{ id: 'yes', label: 'Oui' }, { id: 'partly', label: 'En partie' }, { id: 'no', label: 'Non' }],
      rows: [
        { id: 'inventory', label: 'Inventaire de vos œuvres (titre, date, format, technique)' },
        { id: 'photos', label: 'Photographies de qualité de chaque œuvre' },
        { id: 'locations', label: 'Localisation connue des œuvres vendues ou prêtées' },
        { id: 'certificates', label: 'Certificats d’authenticité délivrés' },
        { id: 'contracts', label: 'Contrats (galeries, commandes, cessions de droits) classés' },
      ],
    },
  },
  {
    id: 'q26', n: 26, section: 10,
    title: 'Avez-vous vérifié votre relevé de carrière pour la retraite, y compris les périodes de cotisation en tant qu’artiste-auteur ?',
    input: {
      kind: 'choice', multiple: false,
      options: [
        { id: 'complete', label: 'Oui, il est complet' },
        { id: 'incomplete', label: 'Oui, il est incomplet' },
        { id: 'no', label: 'Non' },
      ],
    },
  },
  {
    id: 'q27', n: 27, section: 10,
    title: 'Adhérez-vous à une société d’auteurs (ADAGP ou autre) ?',
    input: { kind: 'choice', multiple: false, options: yesNo },
  },
  {
    id: 'q28', n: 28, section: 11, optional: true,
    lead: 'Partie facultative. Ces questions aident à comprendre les contraintes qui pèsent sur votre activité. Vous êtes libre de ne pas y répondre.',
    title: 'Avez-vous des contraintes particulières qui limitent votre temps de travail artistique ou vos déplacements (charges familiales, santé, autre emploi) ?',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q29', n: 29, section: 11, optional: true,
    title: 'Êtes-vous la première personne de votre famille à avoir suivi des études supérieures ? Vos proches évoluent-ils dans le milieu de l’art ou de la culture ?',
    input: { kind: 'textarea', rows: 5 },
  },
  {
    id: 'q30', n: 30, section: 12,
    title: 'Qu’attendez-vous de cet audit ? Quelle est la question principale que vous vous posez sur votre carrière aujourd’hui ?',
    input: { kind: 'textarea', rows: 6 },
  },
  {
    id: 'q31', n: 31, section: 12,
    title: 'Où souhaitez-vous en être dans trois ans ?',
    input: { kind: 'textarea', rows: 6 },
  },
  {
    id: 'q32', n: 32, section: 12,
    title: 'Qu’est-ce qui vous freine le plus actuellement ?',
    input: { kind: 'textarea', rows: 6 },
  },
  {
    id: 'q33', n: 33, section: 13,
    lead: 'Ces réponses me permettront, si vous le souhaitez, de vous proposer un accompagnement réellement adapté. Elles ne vous engagent à rien.',
    title: 'Sur quels sujets souhaitez-vous un accompagnement en priorité ?',
    hint: 'Cochez une case par ligne.',
    input: {
      kind: 'radioGrid', rowHeader: 'Sujet',
      columns: [{ id: 'priority', label: 'Prioritaire' }, { id: 'useful', label: 'Utile' }, { id: 'none', label: 'Pas besoin' }],
      rows: [
        { id: 'income', label: 'Revenus, statut, fixation des prix' },
        { id: 'studio', label: 'Atelier, stockage, documentation des œuvres' },
        { id: 'portfolio', label: 'Portfolio, texte de présentation, candidatures' },
        { id: 'gallery', label: 'Trouver ou consolider une galerie' },
        { id: 'direct', label: 'Vente directe, collectionneurs, présence en ligne' },
        { id: 'institutions', label: 'Résidences, aides, institutions, commandes publiques' },
        { id: 'archives', label: 'Archives, inventaire, droits, retraite' },
        { id: 'time', label: 'Organisation du temps, équilibre entre activités' },
      ],
    },
  },
  {
    id: 'q34', n: 34, section: 13,
    title: 'Quel format vous conviendrait le mieux ?',
    input: {
      kind: 'choice', multiple: false,
      options: [
        { id: 'individual', label: 'Séances individuelles' },
        { id: 'video', label: 'Visio' },
        { id: 'studio', label: 'En atelier' },
        { id: 'mixed', label: 'Mixte' },
      ],
    },
  },
  {
    id: 'q35', n: 35, section: 13,
    title: 'À quel rythme ?',
    input: {
      kind: 'choice', multiple: false,
      options: [
        { id: 'once', label: 'Ponctuel (1 à 3 séances)' },
        { id: 'monthly3', label: 'Mensuel sur 3 mois' },
        { id: 'monthly6', label: 'Mensuel sur 6 mois' },
        { id: 'year', label: 'Suivi sur un an' },
      ],
    },
  },
  {
    id: 'q36', n: 36, section: 13,
    title: 'Combien de temps pouvez-vous consacrer chaque mois au développement de votre carrière (hors création) ?',
    input: { kind: 'text', placeholder: 'Ex. 10 heures' },
  },
  {
    id: 'q37', n: 37, section: 13, optional: true,
    title: 'Budget envisageable pour un accompagnement',
    hint: 'Facultatif',
    input: {
      kind: 'choice', multiple: false,
      options: [
        { id: 'lt500', label: 'Moins de 500 €' },
        { id: '500_1000', label: '500 à 1 000 €' },
        { id: '1000_2000', label: '1 000 à 2 000 €' },
        { id: 'gt2000', label: 'Plus de 2 000 €' },
        { id: 'discuss', label: 'À discuter' },
      ],
    },
  },
  {
    id: 'q38', n: 38, section: 13,
    title: 'Avez-vous déjà bénéficié d’un accompagnement (coaching, formation, mentorat) ? Qu’est-ce qui a fonctionné ou non ?',
    input: { kind: 'textarea', rows: 5 },
  },
]

export const TOTAL_QUESTIONS = QUESTIONS.length

export type AnswerValue = string | string[] | Record<string, string> | Record<string, string>[]
export type Answers = Record<string, AnswerValue>

/** Clé du champ libre « lien portfolio » de l'étape des pièces jointes. */
export const DOCS_LINK_KEY = 'docs_link'

export function detailsKey(q: Question): string {
  return `${q.id}_details`
}

export function cellKey(row: string, col: string): string {
  return `${row}_${col}`
}

function nonEmpty(v: unknown): boolean {
  return typeof v === 'string' && v.trim().length > 0
}

export function isAnswered(q: Question, answers: Answers): boolean {
  const value = answers[q.id]
  const input = q.input
  switch (input.kind) {
    case 'text':
    case 'textarea':
      return nonEmpty(value)
    case 'choice': {
      const chosen = Array.isArray(value) ? value.length > 0 : nonEmpty(value)
      return chosen || (input.textLabel !== undefined && nonEmpty(answers[detailsKey(q)]))
    }
    case 'table':
      return Array.isArray(value) && (value as Record<string, string>[]).some((row) => Object.values(row).some(nonEmpty))
    case 'matrix':
      return !!value && !Array.isArray(value) && typeof value === 'object' && Object.values(value).some(nonEmpty)
    case 'radioGrid': {
      const grid = value && !Array.isArray(value) && typeof value === 'object' ? (value as Record<string, string>) : {}
      return input.rows.every((r) => nonEmpty(grid[r.id]))
    }
  }
}

export function countAnswered(answers: Answers): number {
  return QUESTIONS.filter((q) => isAnswered(q, answers)).length
}

export function missingRequired(answers: Answers): Question[] {
  return QUESTIONS.filter((q) => !q.optional && !isAnswered(q, answers))
}
