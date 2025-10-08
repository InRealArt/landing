import { GamePage } from '@/types/game';

export const games: GamePage[] = [
  {
    slug: 'monique-letang-aux-glycines',
    active: true,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    artwork: {
      name: "L'ETANG AUX GLYCINES",
      value: 4000,
      dimensions: '73 x 54 cm',
      image: '/images/games/monique/artwork.webp'
    },
    artist: {
      name: 'Monique Laville',
      image: '/images/games/monique/artist.webp',
      bio: {
        en: 'Discover the mesmerizing work of Monique, an artist who captures the essence of nature through her unique perspective.',
        fr: 'Découvrez l\'œuvre fascinante de Monique, une artiste qui capture l\'essence de la nature à travers sa perspective unique.'
      }
    },
    title: {
      en: 'Win "L\'ETANG AUX GLYCINES" - A Masterpiece Worth €4,000',
      fr: 'Gagnez "L\'ETANG AUX GLYCINES" - Un Chef-d\'œuvre d\'une Valeur de 4 000 €'
    },
    description: {
      en: 'Enter for a chance to win this stunning artwork that brings the serene beauty of a wisteria-laden pond to life.',
      fr: 'Participez pour avoir la chance de gagner cette œuvre magnifique qui donne vie à la beauté sereine d\'un étang bordé de glycines.'
    },
    howToParticipate: {
      en: {
        steps: [
          'Fill out the participation form below',
          'Follow InRealArt and the artist on Instagram',
          'Share this contest with your friends',
          'Winners will be announced on November 1st, 2025'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous',
          'Suivez InRealArt et l\'artiste sur Instagram',
          'Partagez ce concours avec vos amis',
          'Les gagnants seront annoncés le 1er novembre 2025'
        ]
      }
    },
    termsAndConditions: {
      en: [
        'No purchase necessary to enter or win',
        'Contest open to participants aged 18 and above',
        'One entry per person',
        'Winner will be selected randomly from all valid entries',
        'Prize cannot be exchanged for cash value'
      ],
      fr: [
        'Aucun achat nécessaire pour participer ou gagner',
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
    title: {
      en: 'Win "Boudoir" - An Intimate Masterpiece',
      fr: 'Gagnez "Boudoir" - Un Chef-d\'œuvre Intime'
    },
    description: {
      en: 'Enter our contest to win this exquisite artwork that captures the essence of intimate spaces.',
      fr: 'Participez à notre concours pour gagner cette œuvre exquise qui capture l\'essence des espaces intimes.'
    },
    howToParticipate: {
      en: {
        steps: [
          'Fill out the participation form below',
          'Follow InRealArt and the artist on Instagram',
          'Share this contest with your friends',
          'Winners will be announced on November 1st, 2025'
        ]
      },
      fr: {
        steps: [
          'Remplissez le formulaire de participation ci-dessous',
          'Suivez InRealArt et l\'artiste sur Instagram',
          'Partagez ce concours avec vos amis',
          'Les gagnants seront annoncés le 1er novembre 2025'
        ]
      }
    },
    termsAndConditions: {
      en: [
        'No purchase necessary to enter or win',
        'Contest open to participants aged 18 and above',
        'One entry per person',
        'Winner will be selected randomly from all valid entries',
        'Prize cannot be exchanged for cash value'
      ],
      fr: [
        'Aucun achat nécessaire pour participer ou gagner',
        'Concours ouvert aux participants de 18 ans et plus',
        'Une participation par personne',
        'Le gagnant sera sélectionné au hasard parmi toutes les participations valides',
        'Le prix ne peut être échangé contre sa valeur en espèces'
      ]
    }
  }
];