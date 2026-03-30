'use client'

const steps = [
  {
    title: 'Curation',
    description: 'Nos curateurs sélectionnent des œuvres en adéquation avec votre culture d\'entreprise et vos espaces.',
  },
  {
    title: 'Simulation',
    description: "Élaboration d'un plan de financement sur-mesure validé par nos partenaires bancaires.",
  },
  {
    title: 'Logistique',
    description: 'Transport spécialisé, assurance "clou à clou" et installation par nos techniciens d\'art.',
  },
  {
    title: 'Mise en valeur',
    description: 'Cartels explicatifs, vernissage interne et médiation pour engager vos collaborateurs.',
  },
];

export default function LeasingProcess() {
  return (
    <section className="py-40 px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <span className="section-number">Méthodologie</span>
            <h2 className="serif text-5xl mb-8 italic">
              De la sélection <br />à l&apos;installation.
            </h2>
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-gray-400 leading-loose">
              Un accompagnement clé-en-main pour intégrer l&apos;art dans votre stratégie d&apos;entreprise sans contrainte administrative.
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="advantage-box bg-[var(--soft-gray)]"
              >
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 text-ink-black">
                  {step.title}
                </h4>
                <p className="text-[13px] text-gray-500 font-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
