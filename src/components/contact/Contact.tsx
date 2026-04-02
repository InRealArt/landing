'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { EXTERNAL_URLS } from '@/constants/constants'
import { loadGsap } from '@/lib/gsap'

const LinkedInIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 0.5H2C0.9 0.5 0 1.4 0 2.5V16.5C0 17.6 0.9 18.5 2 18.5H16C17.1 18.5 18 17.6 18 16.5V2.5C18 1.4 17.1 0.5 16 0.5ZM5.56 16H2.79V7.63H5.56V16ZM4.18 6.41C3.26 6.41 2.5 5.65 2.5 4.73C2.5 3.81 3.26 3.05 4.18 3.05C5.1 3.05 5.86 3.81 5.86 4.73C5.86 5.65 5.1 6.41 4.18 6.41ZM15.5 16H12.73V11.57C12.73 10.5 11.83 9.6 10.76 9.6C9.69 9.6 8.79 10.5 8.79 11.57V16H6.02V7.63H8.79V8.74C9.27 7.96 10.26 7.44 11.11 7.44C12.86 7.44 15.5 8.65 15.5 11.57V16Z" fill="currentColor"/>
  </svg>
)

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5.8 0.5H14.2C17.4 0.5 20 3.1 20 6.3V14.7C20 17.9 17.4 20.5 14.2 20.5H5.8C2.6 20.5 0 17.9 0 14.7V6.3C0 3.1 2.6 0.5 5.8 0.5ZM14.4 2.5H5.6C3.61 2.5 2 4.11 2 6.1V14.9C2 16.89 3.61 18.5 5.6 18.5H14.4C16.39 18.5 18 16.89 18 14.9V6.1C18 4.11 16.39 2.5 14.4 2.5H5.6ZM15.25 4C15.8 4 16.25 4.45 16.25 5C16.25 5.55 15.8 6 15.25 6C14.7 6 14.25 5.55 14.25 5C14.25 4.45 14.7 4 15.25 4ZM10 5.5C12.76 5.5 15 7.74 15 10.5C15 13.26 12.76 15.5 10 15.5C7.24 15.5 5 13.26 5 10.5C5 7.74 7.24 5.5 10 5.5ZM10 7.5C8.34 7.5 7 8.84 7 10.5C7 12.16 8.34 13.5 10 13.5C11.66 13.5 13 12.16 13 10.5C13 8.84 11.66 7.5 10 7.5Z" fill="currentColor"/>
  </svg>
)

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.19678 19H7.19678V10.99H10.8008L11.1968 7.01H7.19678V5C7.19678 3.67 3.72 2.4 3.19678 5V7.01H1.19678L0.800781 10.99H3.19678V19Z" fill="currentColor"/>
  </svg>
)

const XIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.175 1.34375H16.9354L10.9054 8.25318L18 17.6569H12.4457L8.09229 11.9548L3.11657 17.6569H0.353571L6.80271 10.264L0 1.34504H5.69571L9.62486 6.55604L14.175 1.34375ZM13.2043 16.0009H14.7343L4.86 2.91361H3.21943L13.2043 16.0009Z" fill="currentColor"/>
  </svg>
)

export default function Contact() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await loadGsap()

      ctx = gsap.context(() => {
        if (headerRef.current) {
          const headerElements = headerRef.current.querySelectorAll('.section-number, h1, p')
          gsap.fromTo(
            headerElements,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.expertise-card')
          gsap.fromTo(
            cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.18,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      }, sectionRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  // Contact information
  const contactInfo = {
    phone: '+33 (0)6 37 32 08 33',
    email: 'teaminrealart@gmail.com',
    social: [
      { name: 'LinkedIn', icon: LinkedInIcon, url: 'https://www.linkedin.com/company/inrealart/' },
      { name: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com/inrealartgallery/' },
      { name: 'Facebook', icon: FacebookIcon, url: 'https://www.facebook.com/inrealart' },
      { name: 'Twitter', icon: XIcon, url: 'https://x.com/InRealArt/' },
    ]
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-soft-gray to-backgroundGrey border-y border-borderColor py-28 lg:py-40 md:mt-0 mt-headerSize relative overflow-hidden"
    >
      {/* Subtle decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />
      
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="grid lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-8">
            <span className="section-number" suppressHydrationWarning>
              {t('footer.contact')}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl serif italic leading-tight text-textColor mb-8" suppressHydrationWarning>
              {t('contact.title')}
            </h1>
            <p className="text-[13px] uppercase tracking-[0.3em] text-grayText max-w-2xl leading-relaxed" suppressHydrationWarning>
              {t('contact.subtitle')}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-12 lg:gap-20">

          {/* Calendly */}
          <div className="expertise-card border-t border-borderColor pt-12 opacity-0 flex flex-col group hover:border-gold-accent/40 transition-colors duration-500">
            <div className="flex items-center gap-4 mb-8">
              <span className="serif text-4xl italic text-gold-accent leading-none">
                01.
              </span>
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-textColor" suppressHydrationWarning>
                {t('contact.calendly')}
              </h3>
            </div>

            <div className="bg-gradient-to-br from-soft-gray to-backgroundGrey rounded-full w-14 h-14 flex items-center justify-center mb-6 border border-borderColor group-hover:border-gold-accent/30 transition-colors duration-500">
              <Calendar size={24} className="text-textColor" />
            </div>

            <div className="w-8 h-px bg-gradient-to-r from-gold-accent to-transparent mb-6" />

            <p className="text-[13px] text-grayText leading-loose mb-10 flex-grow" suppressHydrationWarning>
              {t('contact.calendlyDescription')}
            </p>

            <div>
              <Link
                href={EXTERNAL_URLS.CALENDLY_MEETING}
                target="_blank"
                className="btn-cta"
                data-umami-event="calendly-contact-page-click"
                suppressHydrationWarning
              >
                {t('contact.scheduleMeeting')}
              </Link>
            </div>
          </div>

          {/* Email */}
          <div className="expertise-card border-t border-borderColor pt-12 opacity-0 flex flex-col group hover:border-gold-accent/40 transition-colors duration-500">
            <div className="flex items-center gap-4 mb-8">
              <span className="serif text-4xl italic text-gold-accent leading-none">
                02.
              </span>
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-textColor" suppressHydrationWarning>
                {t('contact.email')}
              </h3>
            </div>

            <div className="bg-gradient-to-br from-soft-gray to-backgroundGrey rounded-full w-14 h-14 flex items-center justify-center mb-6 border border-borderColor group-hover:border-gold-accent/30 transition-colors duration-500">
              <Mail size={24} className="text-textColor" />
            </div>

            <div className="w-8 h-px bg-gradient-to-r from-gold-accent to-transparent mb-6" />

            <p className="text-[13px] text-grayText leading-loose mb-10 flex-grow" suppressHydrationWarning>
              {contactInfo.email}
            </p>

            <div>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="btn-cta"
                suppressHydrationWarning
              >
                {t('contact.sendEmail')}
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="expertise-card border-t border-borderColor pt-12 opacity-0 flex flex-col group hover:border-gold-accent/40 transition-colors duration-500">
            <div className="flex items-center gap-4 mb-8">
              <span className="serif text-4xl italic text-gold-accent leading-none">
                03.
              </span>
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-textColor" suppressHydrationWarning>
                {t('contact.social')}
              </h3>
            </div>

            <div className="bg-gradient-to-br from-soft-gray to-backgroundGrey rounded-full w-14 h-14 flex items-center justify-center mb-6 border border-borderColor group-hover:border-gold-accent/30 transition-colors duration-500">
              <LinkedInIcon size={24} className="text-textColor" />
            </div>

            <div className="w-8 h-px bg-gradient-to-r from-gold-accent to-transparent mb-6" />

            <div className="flex gap-6 mb-10 flex-grow items-start pt-2">
              {contactInfo.social.map((platform) => {
                const Icon = platform.icon
                return (
                  <Link
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.name}
                    className="hover:scale-110 transition-transform duration-300 hover:text-gold-accent text-textColor"
                  >
                    <Icon
                      size={22}
                    />
                  </Link>
                )
              })}
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-grayText" suppressHydrationWarning>
              {t('contact.followUs')}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
