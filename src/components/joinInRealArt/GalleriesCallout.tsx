'use client'

import Link from 'next/link'

export default function GalleriesCallout() {
  return (
    <section className="pb-16 md:pb-24 lg:pb-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="bg-black text-white flex flex-col items-center text-center p-10 sm:p-14 lg:p-16 xl:p-20 gap-12">

          <div className="flex flex-col items-center">
            {/* Eyebrow label */}
            <span className="text-[#b89c72] text-[9px] uppercase tracking-[0.4em] mb-8 block font-[family-name:var(--font-montserrat)]">
              Partenariat galeries
            </span>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-[family-name:var(--font-cormorant)] font-light text-white leading-tight mb-8">
              Vous êtes une{' '}
              <span className="italic text-[#b89c72]">galerie</span>
            </h2>

            {/* Separator */}
            <div className="w-8 h-px bg-[#b89c72]/50 mb-8 mx-auto" />

            {/* Body */}
            <p className="text-[13px] leading-relaxed font-light text-gray-400 font-[family-name:var(--font-montserrat)] max-w-2xl mx-auto">
              InRealArt vous soutient dans la réalisation de vos projets
              créatifs les plus audacieux, en collaboration avec des artistes
              de renom. Que vous souhaitiez valoriser votre espace ou dénicher
              l&apos;œuvre idéale pour un client, nous sommes à vos côtés
              pour concrétiser vos aspirations.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/joinInRealArt/galleries"
            className="text-[10px] uppercase tracking-[0.3em] border-b pb-1 inline-flex items-end mx-auto transition-all duration-300 min-h-[44px] text-[#b89c72] border-[#b89c72] hover:text-white hover:border-white"
          >
            Découvrir l&apos;offre galeries →
          </Link>

        </div>
      </div>
    </section>
  )
}
