import { GridItem } from "@/components/common/annexe/ContentGrid";

export const faqTabs = ["NFT", "Token", "DAO", "ICO", "Projet"];

export const faqItems: GridItem[] = [
  // NFT questions
  {
    title: "Qu'est-ce qu'un NFT ?",
    content: "Un NFT est un token unique et non-fongible qui permet de représenter la propriété d'un actif numérique, comme une image, une vidéo ou un bruit, sur une blockchain.",
    categories: ["NFT"]
  },
  {
    title: "Comment fonctionne un NFT ?",
    content: "Un NFT fonctionne sur une blockchain et utilise des contrats intelligents pour garantir l'authenticité et la propriété d'un actif numérique, permettant des transferts sécurisés et vérifiables.",
    categories: ["NFT"]
  },
  {
    title: "Pourquoi les NFT ont-ils de la valeur ?",
    content: "Les NFT ont de la valeur en raison de leur rareté, de leur authenticité vérifiable, de l'intérêt des collectionneurs, et parfois des droits et avantages associés à leur possession.",
    categories: ["NFT"]
  },
  {
    title: "Comment acheter un NFT sur InRealArt ?",
    content: "Pour acheter un NFT sur InRealArt, il faut créer un compte, connecter un portefeuille numérique, sélectionner l'œuvre souhaitée et finaliser l'achat via la blockchain.",
    categories: ["NFT"]
  },
  {
    title: "Puis-je revendre mon NFT ?",
    content: "Oui, vous pouvez revendre votre NFT sur la plateforme InRealArt ou sur d'autres marchés compatibles, le transfert de propriété étant automatiquement enregistré sur la blockchain.",
    categories: ["NFT"]
  },
  {
    title: "Quels types d'œuvres sont disponibles en NFT ?",
    content: "InRealArt propose une variété d'œuvres d'art en NFT, incluant des peintures, sculptures, art numérique, photographies et autres créations d'artistes renommés et émergents.",
    categories: ["NFT"]
  },

  // Token questions
  {
    title: "Qu'est-ce qu'un token ?",
    content: "Un token est une unité de valeur numérique qui représente un actif ou une utilité sur une blockchain, permettant des transactions et des interactions dans un écosystème décentralisé.",
    categories: ["Token"]
  },
  {
    title: "Comment fonctionne le token d'InRealArt ?",
    content: "Le token d'InRealArt est utilisé pour les transactions sur la plateforme, la gouvernance du système, et donne accès à certains avantages exclusifs pour les détenteurs.",
    categories: ["Token"]
  },
  {
    title: "Où puis-je acheter des tokens InRealArt ?",
    content: "Les tokens InRealArt peuvent être achetés directement sur notre plateforme lors des phases de prévente, ou sur les échanges décentralisés partenaires après le lancement.",
    categories: ["Token"]
  },
  {
    title: "Quelle est l'utilité du token InRealArt ?",
    content: "Le token InRealArt permet de participer à la gouvernance, d'accéder à des ventes exclusives, de bénéficier de frais réduits et de recevoir des récompenses dans l'écosystème.",
    categories: ["Token"]
  },
  {
    title: "Le token est-il limité en quantité ?",
    content: "Oui, le token InRealArt a une offre maximale limitée, ce qui contribue à sa valeur à long terme en évitant l'inflation excessive.",
    categories: ["Token"]
  },
  {
    title: "Comment stocker mes tokens en sécurité ?",
    content: "Pour une sécurité optimale, stockez vos tokens dans un portefeuille numérique sécurisé, idéalement un portefeuille matériel (hardware wallet) pour les sommes importantes.",
    categories: ["Token"]
  },

  // DAO questions
  {
    title: "Qu'est-ce qu'une DAO ?",
    content: "Une DAO (Organisation Autonome Décentralisée) est une organisation gérée par des règles codées dans des contrats intelligents, où les décisions sont prises collectivement par les membres sans autorité centrale.",
    categories: ["DAO"]
  },
  {
    title: "Comment fonctionne la DAO d'InRealArt ?",
    content: "La DAO d'InRealArt permet aux détenteurs de tokens de voter sur les décisions importantes comme la sélection d'œuvres, les partenariats et l'évolution de la plateforme.",
    categories: ["DAO"]
  },
  {
    title: "Comment participer à la DAO ?",
    content: "Pour participer à la DAO, vous devez détenir des tokens InRealArt, qui vous donnent des droits de vote proportionnels à votre participation.",
    categories: ["DAO"]
  },
  {
    title: "Quels types de décisions sont prises par la DAO ?",
    content: "La DAO prend des décisions sur la sélection d'artistes, l'acquisition d'œuvres, l'allocation des revenus, les mises à jour de la plateforme et les initiatives stratégiques.",
    categories: ["DAO"]
  },
  {
    title: "La DAO génère-t-elle des revenus ?",
    content: "Oui, la DAO génère des revenus via les frais de transaction, les ventes d'œuvres, et d'autres sources qui sont ensuite redistribués selon les décisions des membres.",
    categories: ["DAO"]
  },
  {
    title: "Comment les propositions sont-elles soumises à la DAO ?",
    content: "Les membres peuvent soumettre des propositions via l'interface de gouvernance de la plateforme, qui sont ensuite soumises au vote de l'ensemble des participants.",
    categories: ["DAO"]
  },

  // ICO questions
  {
    title: "Qu'est-ce qu'un ICO ?",
    content: "Un ICO (Initial Coin Offering) est une méthode de levée de fonds qui permet à des projets blockchain d'émettre des tokens et de les vendre au public pour financer leur développement.",
    categories: ["ICO"]
  },
  {
    title: "Quand aura lieu l'ICO d'InRealArt ?",
    content: "Les détails concernant la date et les modalités de l'ICO d'InRealArt seront annoncés sur notre site officiel et nos réseaux sociaux.",
    categories: ["ICO"]
  },
  {
    title: "Comment participer à l'ICO ?",
    content: "Pour participer à l'ICO, vous devrez vous inscrire sur notre plateforme, compléter les vérifications KYC requises, et suivre les instructions pour contribuer.",
    categories: ["ICO"]
  },
  {
    title: "Quel est le prix du token pendant l'ICO ?",
    content: "Le prix du token pendant l'ICO sera annoncé avant le lancement, avec différentes phases de prévente offrant potentiellement des tarifs préférentiels.",
    categories: ["ICO"]
  },
  {
    title: "Y a-t-il une contribution minimale pour l'ICO ?",
    content: "Oui, une contribution minimale sera fixée pour l'ICO afin d'assurer une distribution équitable et efficace des tokens.",
    categories: ["ICO"]
  },
  {
    title: "Comment les fonds de l'ICO seront-ils utilisés ?",
    content: "Les fonds levés lors de l'ICO seront utilisés pour le développement technique, l'acquisition d'œuvres d'art, le marketing, les partenariats et l'expansion internationale de la plateforme.",
    categories: ["ICO"]
  },

  // Projet questions
  {
    title: "Quels sont les objectifs du projet ?",
    content: "Notre projet vise à démocratiser l'accès à l'art de prestige grâce à la technologie blockchain, en permettant la fractionnalisation des œuvres et en créant un marché transparent et accessible.",
    categories: ["Projet"]
  },
  {
    title: "Qui sont les fondateurs d'InRealArt ?",
    content: "InRealArt a été fondé par une équipe d'experts en art, technologie blockchain et finance, ayant une vision commune de transformer le marché de l'art grâce à la tokenisation.",
    categories: ["Projet"]
  },
  {
    title: "Comment InRealArt sélectionne-t-il les œuvres d'art ?",
    content: "Les œuvres sont sélectionnées selon des critères rigoureux incluant la qualité artistique, la provenance, l'authenticité, la valeur potentielle et l'intérêt pour notre communauté.",
    categories: ["Projet"]
  },
  {
    title: "Quels sont les partenaires d'InRealArt ?",
    content: "InRealArt collabore avec des galeries renommées, des maisons de vente aux enchères, des experts en art, des plateformes blockchain et des institutions financières pour offrir un service complet.",
    categories: ["Projet"]
  },
  {
    title: "Comment InRealArt assure-t-il la sécurité des transactions ?",
    content: "Nous utilisons des technologies blockchain de pointe, des contrats intelligents audités, des protocoles de sécurité robustes et des partenaires de confiance pour garantir la sécurité de chaque transaction.",
    categories: ["Projet"]
  },
  {
    title: "Quels sont les projets futurs d'InRealArt ?",
    content: "Nos projets futurs incluent l'expansion internationale, l'intégration de nouvelles formes d'art, le développement d'expériences en réalité augmentée et virtuelle, et la création d'espaces d'exposition physiques.",
    categories: ["Projet"]
  }
]; 