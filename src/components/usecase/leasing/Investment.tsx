import Image from "next/image";

export default function Investment() {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-6">
              Investir dans l'art en entreprise
            </h2>
            <p className="text-sm inter text-gray-300 mb-6">
              Les conseils d'un expert du marché de l'art, Code Général des Impôts, le leasing artistique derrière des collections d'entreprise, tout en créant une véritable démarche RSE grâce à un suivi personnalisé de votre projet selon vos objectifs, votre image de marque et d'innovations.
            </p>
            <ul className="space-y-4 text-sm inter text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Objectifs et expertise du marché d'art pour une stratégie d'image et de patrimoine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Fiscalité déductible à 100% avec avantages ESG, optimisation du bilan, réduction de l'IS (déblocage ainsi du cashflow et réaffectation de l'épargne)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Protection contre l'Inflation (diversification d'actifs non corrélés et résilients) pour les PME</span>
              </li>
            </ul>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="/images/prestige.png"
              alt="Investissement dans l'art"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 