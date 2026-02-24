import { GamePage } from '@/types/game';

export const games: GamePage[] = [
  {
    slug: 'monique-letang-aux-glycines',
    active: false,
    brevoListIdFr: 41,
    brevoListIdEn: 40,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    artwork: {
      name: "L'ETANG AUX GLYCINES",
      value: 4000,
      dimensions: '73 x 54 cm',
      image: '/images/games/monique/artwork.webp',
      medium: {
        fr: 'Huile, Collage sur Toile',
        en: 'Oil, Collage on Canvas'
      },
    },
    mockup: '/images/games/participation.webp',
    artist: {
      name: 'Monique Laville',
      image: '/images/games/monique/artist.webp',
      bio: {
        en: 'Discover the mesmerizing work of Monique, an artist who captures the essence of nature through her unique perspective.',
        fr: 'Découvrez l\'œuvre fascinante de Monique, une artiste qui capture l\'essence de la nature à travers sa perspective unique.'
      }
    },
    title: {
      en: 'CONTEST: Try to win a painting by artist Monique Laville worth €4,000: L\'Étang aux Glycines',
      fr: 'JEU CONCOURS : tentez de remporter une toile de l\'artiste Monique Laville d\'une valeur de 4000€ : L\'Étang aux Glycines'
    },
    description: {
      en: 'This is a very rare opportunity to acquire, for free, a unique painting to enhance your interior and impress your guests. Don\'t miss your chance!',
      fr: 'C\'est une occasion très rare de pouvoir acquérir, gratuitement, une toile unique pour sublimer votre intérieur et épater vos invités. Ne manquez pas votre chance !'
    },
    howToParticipate: {
      en: {
        steps: [
          'Fill out the participation form below and accept to be registered on the newsletter',
          'The winner will be announced on November 3rd, 2025'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous et acceptez de vous inscrire à la newsletter',
          'Le gagnant sera annoncé le 3 novembre 2025'
        ]
      }
    }
  },
  {
    slug: 'senechal-boudoir',
    active: false,
    brevoListIdFr: 39,
    brevoListIdEn: 38,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    artwork: {
      name: 'Boudoir',
      value: 880,
      dimensions: '21 x 26 cm',
      medium: {
        fr: 'Huile, Collage sur Toile',
        en: 'Oil, Collage on Canvas'
      },
      image: '/images/games/senechal/artwork.webp'
    },
    artist: {
      name: 'Catherine Sénéchal',
      image: '/images/games/senechal/artist.webp',
      bio: {
        en: 'Catherine brings intimate spaces to life through masterful technique and attention to detail.',
        fr: 'Catherine donne vie aux espaces intimes grâce à une technique magistrale et une attention aux détails.'
      }
    },
    mockup: '/images/games/senechal/mockup.webp',
    title: {
      en: 'CONTEST: Try to win a painting by artist Catherine Sénéchal worth €880: Boudoir',
      fr: 'JEU CONCOURS : tentez de remporter une toile de l\'artiste Catherine Sénéchal d\'une valeur de 880€ : Boudoir'
    },
    description: {
      en: 'This is a very rare opportunity to acquire, for free, a unique painting to enhance your interior and impress your guests. Don\'t miss your chance!',
      fr: 'C\'est une occasion très rare de pouvoir acquérir, gratuitement, une toile unique pour sublimer votre intérieur et épater vos invités. Ne manquez pas votre chance !'
    },
    howToParticipate: {
      en: {
        steps: [
          'Fill out the participation form below and accept to be registered on the newsletter',
          'The winner will be announced on November 3rd, 2025'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous et acceptez de vous inscrire à la newsletter',
          'Le gagnant sera annoncé le 3 novembre 2025'
        ]
      }
    }
  },
  {
    slug: 'mr-hope-drawing',
    active: true,
    brevoListIdFr: 61,
    brevoListIdEn: 60,
    startDate: '2026-02-26',
    endDate: '2026-03-07',
    artwork: {
      name: 'Dessin',
      value: 500,
      dimensions: '40 x 32 cm',
      medium: {
        fr: 'Dessin',
        en: 'Drawing'
      },
      image: '/images/games/mrHope/dessin_mr_hope_1.webp'
    },
    artist: {
      name: 'Mr Hope',
      image: '/images/games/mrHope/mr_hope.webp',
      bio: {
        en: "Mr Hope is a rising French self-taught artist who has made hope the very heart of his creative expression — transforming his favorite word into a full artistic identity. <br /> <br /> His work naturally blends Doodle Art, Pop Art and Street Art into a singular visual language, expressed across a wide range of media: drawing, canvas, wood, sculpture, ceramics and more. Each piece is an open invitation to believe, to share, and to keep hoping. <br /> <br /> MR.HOPE exhibits in galleries across France and internationally, carrying his universal message wherever his art travels.",
        fr: "Mr Hope est un artiste français autodidacte en pleine ascension, qui a fait de l\'espoir le cœur même de son expression créative — transformant son mot préféré en une identité artistique à part entière. <br /> <br /> Son travail mêle naturellement Doodle Art, Pop Art et Street Art dans un langage visuel singulier, exprimé à travers une grande variété de supports : dessin, toile, bois, sculpture, céramique et bien plus encore. Chaque œuvre est une invitation ouverte à croire, à partager et à continuer d\'espérer. <br /> <br /> MR.HOPE expose dans des galeries en France et à l\'international, portant son message universel partout où son art voyage."
      }
    },
    mockup: '/images/games/mrHope/dessin_mr_hope_2.webp',
    title: {
      en: 'CONTEST: Try to win a drawing by artist Mr Hope worth €500',
      fr: 'JEU CONCOURS : tentez de remporter un dessin de l\'artiste Mr Hope d\'une valeur de 500€'
    },
    description: {
      en: 'This is a very rare opportunity to acquire, for free, a unique work to enhance your interior and impress your guests. Don\'t miss your chance!',
      fr: 'C\'est une occasion très rare de pouvoir acquérir, gratuitement, une œuvre unique pour sublimer votre intérieur et épater vos invités. Ne manquez pas votre chance !'
    },
    howToParticipate: {
      en: {
        steps: [
          'Fill out the participation form below and accept to be registered on the newsletter',
          'The winner will be announced on March 16, 2026'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous et acceptez de vous inscrire à la newsletter',
          'Le gagnant sera annoncé le 16 mars 2026'
        ]
      }
    }
  },
  {
    slug: 'pontecorvo-plaine-contemplative',
    active: false,
    brevoListIdFr: 46,
    brevoListIdEn: 47,
    startDate: '2025-12-18',
    endDate: '2026-01-05',
    artwork: {
      name: 'Plaine contemplative',
      value: 900,
      dimensions: '14 x 24 cm',
      medium: {
        fr: 'Huile sur toile encadrée',
        en: 'Oil on Canvas'
      },
      image: '/images/games/alain/artwork1.webp'
    },
    artist: {
      name: 'Alain Pontecorvo',
      image: '/images/games/alain/artist.webp',
      bio: {
        en: "A major figure in contemporary French painting, Alain Pontecorvo is renowned for his unique universe, where light, geometry and emotion converge. <br /> <br /> Born in Paris in 1936 and trained at the Arts Décoratifs and then at École Estienne, he began his career as an art director before returning to his first passion: painting. Since his first exhibition in 1978, his work has been acclaimed by critics and exhibited in numerous galleries and international art fairs, confirming his status as an essential artist.  <br /> <br />  His work navigates between figuration and abstraction, giving rise to what some call constructivist realism. Figures, nudes, interiors, landscapes and still lifes are transformed under his gaze into compositions where each light and shadow tells a story. Pontecorvo captures what everyday life often overlooks, revealing the beauty of silent and suspended moments.",
        fr: "Figure majeure de la peinture française contemporaine, Alain Pontecorvo est reconnu pour son univers unique, où lumière, géométrie et émotion se rencontrent.  <br /> <br /> Né à Paris en 1936 et formé aux Arts décoratifs puis à l'École Estienne, il débute sa carrière comme directeur artistique avant de revenir à sa passion première : la peinture. Depuis sa première exposition en 1978, son travail a été salué par la critique et exposé dans de nombreuses galeries et salons internationaux, confirmant son statut d'artiste incontournable.  <br /> <br /> Son œuvre navigue entre figuration et abstraction, donnant naissance à ce que certains appellent un réalisme constructiviste. Figures, nus, intérieurs, paysages et natures mortes se transforment sous son regard en compositions où chaque lumière et chaque ombre racontent une histoire. Pontecorvo capture ce que le quotidien laisse souvent passer, révélant la beauté des instants silencieux et suspendus.",
      }
    },
    mockup: '/images/games/alain/mockup-1.webp',
    title: {
      en: 'CONTEST: Try to win a painting by artist Alain Pontecorvo worth €900: Plaine contemplative',
      fr: 'JEU CONCOURS : tentez de remporter une toile de l\'artiste Alain Pontecorvo d\'une valeur de 900€ : Plaine contemplative'
    },
    description: {
      en: 'This is a very rare opportunity to acquire, for free, a unique painting to enhance your interior and impress your guests. Don\'t miss your chance!',
      fr: 'C\'est une occasion très rare de pouvoir acquérir, gratuitement, une toile unique pour sublimer votre intérieur et épater vos invités. Ne manquez pas votre chance !'
    },
    howToParticipate: {
      en: {
        steps: [
          'Fill out the participation form below and accept to be registered on the newsletter',
          'The winner will be announced on January 5, 2026'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous et acceptez de vous inscrire à la newsletter',
          'Le gagnant sera annoncé le 5 janvier 2026'
        ]
      }
    }
  }
];