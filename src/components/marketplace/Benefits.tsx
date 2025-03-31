'use client'

export default function Benefits() {
  const benefits = [
    {
      title: "Authenticité et Traçabilité intégrales",
      description: "Chaque œuvre est authentifiée des experts et certifiée sur la blockchain pour une transparence totale."
    },
    {
      title: "Exclusivité et Confiance",
      description: "La marketplace n'héberge que diverses œuvres vérifiées, chaque achat est une assurance de garantie authentiquement pour des œuvres de dernier cri."
    },
    {
      title: "Possibilité de Revente Sécurisée",
      description: "Grâce au NFT de propriété, la revente est simple, rapide et sécurisée, faisant la liaison d'authentifiée pour les acheteurs."
    },
    {
      title: "Achat de droits d'auteurs",
      description: "Possibilité d'achat de une part d'œuvre d'exception pour davantage de contrôle, avec une liquidité intégrée lors d'une acquisition future."
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-10">Bénéfices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-2">{benefit.title}</h3>
            <p className="text-sm inter">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 