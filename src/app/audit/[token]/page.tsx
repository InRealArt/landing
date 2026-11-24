import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AuditApp from '@/components/audit/AuditApp'
import EmailGate from '@/components/audit/EmailGate'
import { hasEmailGate, loadAuditByToken } from '@/lib/audit/access'
import type { AuditFileDto } from '@/lib/audit/files'
import type { Answers } from '@/lib/audit/questionnaire'
import { draftAnswersSchema } from '@/lib/audit/schemas'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Audit de carrière',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default async function AuditPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const audit = await loadAuditByToken(token)
  if (!audit) notFound()

  // Tant que l'e-mail n'est pas confirmé, rien du questionnaire ni des réponses n'est envoyé au navigateur.
  if (!(await hasEmailGate(audit.tokenHash))) return <EmailGate token={token} />

  const files: AuditFileDto[] = (await prisma.auditFile.findMany({ where: { auditClientId: audit.id }, orderBy: { createdAt: 'asc' } })).map((f) => ({
    id: f.id,
    kind: f.kind,
    filename: f.filename,
    sizeBytes: f.sizeBytes,
  }))
  const parsed = draftAnswersSchema.safeParse(audit.answers)

  return (
    <AuditApp
      token={token}
      clientName={audit.clientName}
      auditorName={audit.auditorName}
      dueLabel={audit.dueDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
      submitted={audit.status === 'SUBMITTED'}
      initialAnswers={parsed.success ? (parsed.data as Answers) : {}}
      initialFiles={files}
    />
  )
}
