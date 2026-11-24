import type { Metadata } from 'next'
import AuditUnavailable from '@/components/audit/AuditUnavailable'

export const metadata: Metadata = {
  title: 'Audit de carrière',
  robots: { index: false, follow: false },
}

export default AuditUnavailable
