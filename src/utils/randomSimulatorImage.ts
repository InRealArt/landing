/**
 * Fonction utilitaire pour sélectionner aléatoirement une image de simulateur
 * @returns Le chemin vers une image simulator aléatoire (simulator1.webp à simulator10.webp)
 */
export function getRandomSimulatorImage(): string {
    const randomNumber = Math.floor(Math.random() * 10) + 1
    return `/images/simulator/simulator${randomNumber}.webp`
}
