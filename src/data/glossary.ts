import { GridItem } from "@/components/common/annexe/ContentGrid";

export const glossaryTabs = ["Blockchain", "NFT", "Finance", "Art", "Technique"];

export const glossaryItems: GridItem[] = [
  // Blockchain terms
  {
    title: "Blockchain",
    content: "Technologie de stockage et de transmission d'informations, fonctionnant sans organe central de contrôle et organisée en blocs liés les uns aux autres de manière chronologique et sécurisée.",
    categories: ["Blockchain"]
  },
  {
    title: "Smart Contract",
    content: "Programme informatique autonome qui s'exécute automatiquement lorsque des conditions prédéterminées sont remplies, permettant des transactions sans intermédiaire sur une blockchain.",
    categories: ["Blockchain"]
  },
  {
    title: "Décentralisation",
    content: "Principe selon lequel le contrôle et la prise de décision sont distribués entre plusieurs entités plutôt que centralisés entre les mains d'une autorité unique.",
    categories: ["Blockchain"]
  },
  {
    title: "Consensus",
    content: "Mécanisme par lequel un réseau blockchain valide et approuve les transactions, garantissant que tous les participants s'accordent sur l'état du registre distribué.",
    categories: ["Blockchain"]
  },
  {
    title: "Mineur",
    content: "Participant à un réseau blockchain qui valide les transactions et crée de nouveaux blocs en résolvant des problèmes cryptographiques, recevant généralement une récompense en tokens.",
    categories: ["Blockchain"]
  },
  {
    title: "Hash",
    content: "Fonction cryptographique qui transforme des données de taille arbitraire en une séquence de caractères de taille fixe, servant à sécuriser les informations sur la blockchain.",
    categories: ["Blockchain"]
  },

  // NFT terms
  {
    title: "NFT",
    content: "Non-Fungible Token ou Jeton Non Fongible, est un actif numérique unique et non interchangeable, généralement utilisé pour représenter la propriété d'objets numériques ou physiques.",
    categories: ["NFT"]
  },
  {
    title: "Fongibilité",
    content: "Caractéristique d'un bien dont chaque unité peut être échangée contre une autre unité identique. Les NFT sont non fongibles, ce qui signifie que chaque token est unique et non interchangeable.",
    categories: ["NFT"]
  },
  {
    title: "Tokenisation",
    content: "Processus de conversion des droits sur un actif physique ou numérique en un token numérique sur une blockchain, permettant sa représentation, son échange et sa gestion simplifiés.",
    categories: ["NFT"]
  },
  {
    title: "Métadonnées",
    content: "Informations supplémentaires associées à un NFT qui définissent ses caractéristiques, son origine, et d'autres attributs pertinents stockés sur ou en lien avec la blockchain.",
    categories: ["NFT"]
  },
  {
    title: "Minting",
    content: "Processus de création d'un NFT sur une blockchain, transformant un actif numérique ou physique en un token unique avec un certificat d'authenticité immuable.",
    categories: ["NFT"]
  },
  {
    title: "Fractionnalisation",
    content: "Division d'un NFT en plusieurs parts plus petites, permettant à plusieurs personnes de posséder une fraction d'un actif de valeur élevée, comme une œuvre d'art.",
    categories: ["NFT"]
  },

  // Finance terms
  {
    title: "Liquidité",
    content: "Facilité avec laquelle un actif peut être acheté ou vendu sur le marché sans affecter significativement son prix, un indicateur important de la santé d'un marché.",
    categories: ["Finance"]
  },
  {
    title: "Actif alternatif",
    content: "Catégorie d'investissements non traditionnels tels que l'art, les objets de collection ou les crypto-monnaies, offrant une diversification par rapport aux actions et obligations.",
    categories: ["Finance"]
  },
  {
    title: "Volatilité",
    content: "Mesure de la variation de prix d'un actif sur une période donnée, indiquant le niveau de risque associé à l'investissement dans cet actif.",
    categories: ["Finance"]
  },
  {
    title: "Rendement",
    content: "Gain financier généré par un investissement, exprimé généralement en pourcentage du capital investi, incluant la plus-value et les revenus périodiques.",
    categories: ["Finance"]
  },
  {
    title: "Diversification",
    content: "Stratégie d'investissement consistant à répartir le capital entre différents types d'actifs pour réduire le risque global d'un portefeuille.",
    categories: ["Finance"]
  },
  {
    title: "KYC",
    content: "Know Your Customer (Connaître son client), processus de vérification de l'identité des clients pour prévenir la fraude, le blanchiment d'argent et autres activités illégales.",
    categories: ["Finance"]
  },

  // Art terms
  {
    title: "Provenance",
    content: "Historique de propriété d'une œuvre d'art, servant à établir son authenticité et sa valeur, désormais pouvant être enregistré de manière immuable sur la blockchain.",
    categories: ["Art"]
  },
  {
    title: "Conservation",
    content: "Ensemble des mesures prises pour préserver une œuvre d'art et prolonger sa durée de vie, incluant le stockage dans des conditions environnementales contrôlées.",
    categories: ["Art"]
  },
  {
    title: "Commissaire d'exposition",
    content: "Professionnel chargé de la sélection et de l'organisation d'œuvres d'art pour une exposition, jouant un rôle clé dans la valorisation des artistes.",
    categories: ["Art"]
  },
  {
    title: "Art numérique",
    content: "Œuvres d'art créées ou présentées à l'aide de technologies numériques, englobant un large éventail de pratiques artistiques contemporaines.",
    categories: ["Art"]
  },
  {
    title: "Édition limitée",
    content: "Série d'œuvres d'art produites en quantité définie et numérotée, augmentant leur valeur par leur rareté intentionnelle.",
    categories: ["Art"]
  },
  {
    title: "Certificat d'authenticité",
    content: "Document attestant l'origine et l'authenticité d'une œuvre d'art, remplacé ou complété par un NFT dans le contexte de l'art numérique et tokenisé.",
    categories: ["Art"]
  },

  // Technique terms
  {
    title: "Wallet",
    content: "Portefeuille numérique permettant de stocker, d'envoyer et de recevoir des crypto-monnaies et des NFT, existant sous forme de logiciel ou de matériel physique.",
    categories: ["Technique"]
  },
  {
    title: "Gas fees",
    content: "Frais payés pour effectuer des transactions sur certaines blockchains comme Ethereum, variant selon la complexité de l'opération et la congestion du réseau.",
    categories: ["Technique"]
  },
  {
    title: "Clé privée",
    content: "Code secret permettant d'accéder et de gérer les actifs numériques dans un wallet, essentiel à protéger pour sécuriser ses possessions numériques.",
    categories: ["Technique"]
  },
  {
    title: "IPFS",
    content: "InterPlanetary File System, système de stockage décentralisé souvent utilisé pour stocker le contenu des NFT, garantissant la persistance des données associées.",
    categories: ["Technique"]
  },
  {
    title: "Layer 2",
    content: "Solution construite au-dessus d'une blockchain principale pour améliorer sa capacité de traitement et réduire les frais de transaction.",
    categories: ["Technique"]
  },
  {
    title: "API",
    content: "Interface de Programmation d'Application, ensemble de règles permettant à différents logiciels de communiquer entre eux, facilitant l'intégration de services blockchain.",
    categories: ["Technique"]
  }
]; 