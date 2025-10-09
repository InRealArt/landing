import { GamePage } from '@/types/game';

export const games: GamePage[] = [
  {
    slug: 'monique-letang-aux-glycines',
    active: true,
    brevoListIdFr: 41,
    brevoListIdEn: 40,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    artwork: {
      name: "L'ETANG AUX GLYCINES",
      value: 4000,
      dimensions: '73 x 54 cm',
      image: '/images/games/monique/artwork.webp'
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
          'The winner will be announced on November 1st, 2025'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous et acceptez de vous inscrire à la newsletter',
          'Le gagnant sera annoncé le 1er novembre 2025'
        ]
      }
    },
    termsAndConditions: {
      en: [
        'No purchase necessary to enter or win',
        'You must fill out the form and subscribe to the newsletter',
        'Contest open to participants aged 18 and above',
        'One entry per person',
        'Winner will be selected randomly from all valid entries',
        'Prize cannot be exchanged for cash value'
      ],
      fr: [
        'Aucun achat nécessaire pour participer ou gagner',
        'Il faut remplir le formulaire et s\'inscrire à la newsletter',
        'Concours ouvert aux participants de 18 ans et plus',
        'Une participation par personne',
        'Le gagnant sera sélectionné au hasard parmi toutes les participations valides',
        'Le prix ne peut être échangé contre sa valeur en espèces'
      ]
    }
  },
  {
    slug: 'senechal-boudoir',
    active: true,
    brevoListIdFr: 39,
    brevoListIdEn: 38,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    artwork: {
      name: 'Boudoir',
      value: 880,
      dimensions: '21 x 26 cm',
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
          'The winner will be announced on November 1st, 2025'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous et acceptez de vous inscrire à la newsletter',
          'Le gagnant sera annoncé le 1er novembre 2025'
        ]
      }
    },
    termsAndConditions: {
      en: [
        'No purchase necessary to enter or win',
        'You must fill out the form and subscribe to the newsletter',
        'Contest open to participants aged 18 and above',
        'One entry per person',
        'Winner will be selected randomly from all valid entries',
        'Prize cannot be exchanged for cash value'
      ],
      fr: [
        'Aucun achat nécessaire pour participer ou gagner',
        'Il faut remplir le formulaire et s\'inscrire à la newsletter',
        'Concours ouvert aux participants de 18 ans et plus',
        'Une participation par personne',
        'Le gagnant sera sélectionné au hasard parmi toutes les participations valides',
        'Le prix ne peut être échangé contre sa valeur en espèces'
      ]
    }
  }
];