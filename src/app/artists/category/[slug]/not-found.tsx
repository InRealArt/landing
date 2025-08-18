import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="bricolage-grotesque text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Catégorie d'artistes non trouvée</h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          La catégorie d'artistes que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <div className="space-x-4">
          <Link
            href="/artists"
            className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Voir tous les artistes
          </Link>
          <Link
            href="/"
            className="inline-block border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
