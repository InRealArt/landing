import AuditFrame from './AuditFrame'
import AuditHero from './AuditHero'

/** Réponse unique pour tout lien inconnu, révoqué ou expiré : aucun indice sur la cause. */
export default function AuditUnavailable() {
  return (
    <AuditFrame>
      <main>
        <AuditHero
          titleLines={['Ce lien n’est', <em key="a" className="text-gold-accent">pas disponible</em>]}
          subtitle="Vérifiez l’adresse reçue, ou contactez la personne qui vous a envoyé ce lien."
        />
      </main>
    </AuditFrame>
  )
}
