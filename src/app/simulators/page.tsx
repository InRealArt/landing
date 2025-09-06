import { Metadata } from 'next'
import SimulatorsPageClient from './SimulatorsPageClient'

export const metadata: Metadata = {
  title: 'All Simulators - InRealArt',
  description: 'Access all our art and heritage simulators including LOA, Heritage & Art, and Art Salon simulators.',
}

export default function SimulatorsPage() {
  return <SimulatorsPageClient />
}
