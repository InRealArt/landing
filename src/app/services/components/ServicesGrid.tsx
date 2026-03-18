'use client'

interface ServiceItem {
  title: string
  description: string
  price: string
  priceUnit: string
  cta: string
}

interface ServiceCategory {
  number: string
  label: string
  items: ServiceItem[]
}

const SERVICES: ServiceCategory[] = [
  {
    number: '01.',
    label: 'Solutions Artistes',
    items: [
      {
        title: 'Audit de Carrière & Positionnement',
        description:
          "Analyse de votre production, définition de votre USP (Unique Selling Proposition) et stratégie de prix. (Par Maxime Girard)",
        price: '850 €',
        priceUnit: '/ Audit',
        cta: 'Réserver',
      },
      {
        title: 'Coaching "Sortir de l\'Ombre"',
        description:
          "Accompagnement sur 3 mois : réseau, pitch aux galeries et présence digitale. (Par Timothée Roy)",
        price: '2 400 €',
        priceUnit: '/ Trimestre',
        cta: 'Postuler',
      },
      {
        title: 'Dossier de Presse & Kit Curatorial',
        description:
          "Rédaction de votre manifeste, biographie et catalogue raisonné digital. (Équipe IRA)",
        price: '1 200 €',
        priceUnit: '/ Projet',
        cta: 'Commander',
      },
    ],
  },
  {
    number: '02.',
    label: 'Solutions Corporate & Privées',
    items: [
      {
        title: 'Sourcing d\'Œuvres Sur-Mesure',
        description:
          "Recherche exclusive de pièces pour un intérieur ou un siège social selon budget. (Par Ania Chrusciany)",
        price: 'Sur Devis',
        priceUnit: '/ Honoraires 10%',
        cta: 'Contacter',
      },
      {
        title: 'Optimisation Fiscale & Leasing Art',
        description:
          "Montage de dossiers de location avec option d'achat (LOA) pour entreprises. (Équipe IRA)",
        price: 'Offert',
        priceUnit: '/ (si achat)',
        cta: 'Simuler',
      },
    ],
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-32 px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="block text-[10px] uppercase tracking-[0.5em] mb-4 montserrat text-grayText">
            Catalogue des Services
          </span>
          <h2 className="serif text-5xl italic text-textColor">
            Consulting &amp; Tarification
          </h2>
        </div>

        {SERVICES.map((category) => (
          <div key={category.number} className="mb-20">
            <h3 className="text-[11px] uppercase tracking-[0.5em] font-bold pb-4 mb-8 montserrat text-textColor border-b border-borderColor">
              {category.number} {category.label}
            </h3>

            {category.items.map((item) => (
              <div
                key={item.title}
                className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-borderColor"
                style={{ transition: 'background 0.3s ease' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.backgroundColor =
                    'var(--background-grey)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
                }}
              >
                <div className="md:w-1/2">
                  <h4 className="serif text-2xl text-textColor">{item.title}</h4>
                  <p className="text-[12px] mt-2 montserrat text-grayText">{item.description}</p>
                </div>

                <div className="flex items-center gap-12">
                  <span className="serif italic text-xl text-textColor">
                    {item.price}{' '}
                    <small className="text-[10px] uppercase not-italic montserrat text-grayText">
                      {item.priceUnit}
                    </small>
                  </span>
                  <a
                    href="/contact"
                    className="py-2 px-6 text-[7px] uppercase tracking-[0.25em] montserrat inline-block border border-borderColor text-textColor"
                    style={{
                      transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.backgroundColor = 'var(--text)'
                      el.style.color = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.backgroundColor = 'transparent'
                      el.style.color = ''
                    }}
                  >
                    {item.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
