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

interface ServicesGridProps {
  translations: {
    catalog: {
      eyebrow: string
      title: string
    }
    categories: {
      artists: {
        number: string
        label: string
      }
      corporate: {
        number: string
        label: string
      }
    }
    items: {
      careerAudit: {
        title: string
        description: string
        price: string
        priceUnit: string
        cta: string
      }
      coaching: {
        title: string
        description: string
        price: string
        priceUnit: string
        cta: string
      }
      pressKit: {
        title: string
        description: string
        price: string
        priceUnit: string
        cta: string
      }
      sourcing: {
        title: string
        description: string
        price: string
        priceUnit: string
        cta: string
      }
      taxOptimization: {
        title: string
        description: string
        price: string
        priceUnit: string
        cta: string
      }
    }
  }
}

export default function ServicesGrid({ translations }: ServicesGridProps) {
  const SERVICES: ServiceCategory[] = [
    {
      number: '01',
      label: 'DIGITAL',
      items: [
        {
          title: 'Mise en place Portfolio',
          description: 'Sélection, retouche légère et mise en page de 15-20 œuvres (PDF Pro).',
          price: '180',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
        {
          title: 'Création de Site Web',
          description: 'Site vitrine (5 pages) + Nom de domaine + Formation prise en main.',
          price: '450 – 900',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
        {
          title: 'Maintenance Site',
          description: 'Mise à jour technique et ajout de nouvelles œuvres (trimestriel).',
          price: '30',
          priceUnit: '€ / mois HT',
          cta: 'Commander',
        },
      ],
    },
    {
      number: '02',
      label: 'CONSEIL',
      items: [
        {
          title: 'Coaching Marketing',
          description: '1h de visio : définir sa cible, ses tarifs et son pitch de vente.',
          price: '120',
          priceUnit: '€ / heure HT',
          cta: 'Commander',
        },
        {
          title: 'Audit Réseaux Sociaux',
          description: "Analyse de l'existant (link/ig) + Plan d'action de 10 idées de posts.",
          price: '150',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
      ],
    },
    {
      number: '03',
      label: 'MÉDIA',
      items: [
        {
          title: 'Interview Exclusive',
          description: 'Interview écrite ou filmée publiée sur votre espace Média/Blog.',
          price: '250',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
        {
          title: 'Annonce Exposition',
          description: 'Article dédié "Agenda" sur votre site média avec lien vers l\'artiste.',
          price: '80',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
        {
          title: 'Relais Newsletter',
          description: 'Un encart dédié dans la newsletter envoyée aux collectionneurs.',
          price: '120',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
        {
          title: 'Post Sponsorisé',
          description: 'Publication dédiée sur vos réseaux sociaux (Instagram / Facebook).',
          price: '100',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
      ],
    },
    {
      number: '04',
      label: 'CONTENU',
      items: [
        {
          title: 'Rédaction de Bio',
          description: "Écriture de la biographie et du 'Artist Statement' (300 mots).",
          price: '150',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
        {
          title: 'Communiqué de Presse',
          description: 'Rédaction du document pro pour envoyer aux journalistes art.',
          price: '200',
          priceUnit: '€ HT',
          cta: 'Commander',
        },
      ],
    },
  ]

  return (
    <section className="py-32 px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="block text-[10px] uppercase tracking-[0.5em] mb-4 montserrat text-grayText">
            {translations.catalog.eyebrow}
          </span>
          <h2 className="serif text-5xl italic text-textColor">
            {translations.catalog.title}
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
