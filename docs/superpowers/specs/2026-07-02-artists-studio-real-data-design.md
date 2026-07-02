# Artists Studio — Données réelles (ArtitudeArtist)

## Contexte

La page `/artists-studio` (`src/components/artists-studio/`) affiche actuellement une carte interactive et une liste "Les Ateliers" à partir de données mockées (`src/data/artistsStudioData.ts`). L'objectif est de remplacer ce mock par des données réelles issues de la table `ArtitudeArtist` (fiche établissement de type Google Business Profile) et de sa table liée `ArtitudeArtistImages`.

Au clic sur un atelier (carte ou liste), la carte "Fiche de l'atelier" (`ArtistsStudioDetail.tsx`) doit se mettre à jour avec les images réelles de `ArtitudeArtistImages`.

## Sources de données

- `ArtitudeArtist` (schema `landing`) : adresse, ville, géolocalisation (`latitude`/`longitude`), téléphone, site web, horaires (`openingHours` JSON), relation 1-1 vers `Artist`.
- `ArtitudeArtistImages` (schema `landing`) : `coverImage`, `exteriorImages[]`, `interiorImages[]`, `artistImages[]`, `otherImages[]`.
- `Artist` (schema `public`) : `name`, `surname`, `pseudo`, `imageUrl`, relation vers `artistSpecialties` (`ArtistSpecialtyArtist` → `ArtistSpecialty.name`) et vers `LandingArtist[]`.
- `LandingArtist` (schema `landing`) : `quoteFromInRealArt`, `intro`, `description`, `biographyText1` — utilisés pour tagline/bio.

Seuls les artistes possédant un enregistrement `ArtitudeArtist` apparaissent sur la page (jointure naturelle).

## Mapping vers `ArtistStudio`

| Champ `ArtistStudio` | Source | Règle |
|---|---|---|
| `id` | `artitudeArtist.id` | — |
| `name` | `artist.pseudo` \| `artist.name + ' ' + artist.surname` | pseudo prioritaire si renseigné |
| `medium` / `mediumLabel` / `color` | `artist.artistSpecialties[0].artistSpecialty.name` | mappé vers une des 5 catégories existantes (peinture/sculpture/photographie/dessin/autre) via table de correspondance ; fallback `'autre'` si aucune spécialité |
| `city` | `artitudeArtist.city` | — |
| ~~`region`~~ | supprimé | champ retiré du type et de l'UI (non disponible en base) |
| `lat` / `lng` | `latitude` / `longitude` (Decimal → number) | `null` si absent ; l'atelier reste dans la liste mais n'a pas de marker sur la carte |
| `openPublic` | dérivé de `openingHours` | `true` si le JSON contient au moins un créneau, sinon `false` |
| `hours` | formaté depuis `openingHours` | libellé lisible ; si absent → texte "Sur rendez-vous" (clé i18n existante `artistsStudio.detail.byAppointment`) |
| `tagline` | `landingArtist?.quoteFromInRealArt ?? landingArtist?.intro ?? ''` | vide si pas de `LandingArtist` |
| `bio` | `landingArtist?.description ?? landingArtist?.biographyText1 ?? ''` | idem |
| `photo` | `getImageUrl(images?.coverImage) ?? getImageUrl(artist.imageUrl)` | fallback portrait artiste |
| `gallery` | `[...exteriorImages, ...interiorImages, ...artistImages, ...otherImages]` passées par `getImageUrl` | filtré des valeurs `null` |

## Composants impactés

1. **`src/actions/artistsStudioActions.ts`** (nouveau) : server action `getArtistsStudioData(): Promise<ArtistStudio[]>` faisant le fetch Prisma + mapping ci-dessus.
2. **`src/types/artistsStudio.ts`** : suppression de `region`, `lat`/`lng` deviennent `number | null`.
3. **`src/components/artists-studio/ArtistsStudioPage.tsx`** : devient `async` Server Component, appelle `getArtistsStudioData()`, retire l'import du mock, passe `artists` en props aux enfants comme aujourd'hui. Le compteur de stats utilise `artists.length`.
4. **`ArtistsStudioMap.tsx`** : ignore (skip) les artistes avec `lat`/`lng` `null` lors de la pose des markers ; le `useEffect` de pan-to-selected vérifie aussi la présence de coordonnées.
5. **`ArtistsStudioGrid.tsx`** : retire l'affichage `{city} — {region}` → `{city}` ; le filtre de recherche localisation (`matchLoc`) ne teste plus que `city`.
6. **`ArtistsStudioDetail.tsx`** : retire l'affichage `{city} — {region}` → `{city}`. Le reste (galerie d'images, tagline, bio, horaires) fonctionne déjà génériquement à partir du type `ArtistStudio` — pas de changement structurel, seulement suppression de `region`.
7. **`src/data/artistsStudioData.ts`** : supprimé.

## Cas limites

- Artiste avec `ArtitudeArtist` mais sans `ArtitudeArtistImages` : `photo` retombe sur `artist.imageUrl`, `gallery` vide (section masquée, comportement déjà géré par `artist.gallery.length > 0` dans `ArtistsStudioDetail`).
- Artiste sans `artistSpecialties` : catégorie `'autre'`, couleur neutre associée.
- Artiste sans `latitude`/`longitude` : visible dans la liste et filtrable, absent de la carte (pas de marker, pas de pan).
- Artiste sans `LandingArtist` : `tagline`/`bio` vides (affichage conditionnel existant à vérifier/adapter si nécessaire pour ne pas afficher de guillemets vides).

## Hors périmètre

- Pas de modification du schéma Prisma (les champs `region`/`medium` ne sont pas ajoutés en base).
- Pas de pagination/cache spécifique — `getArtistsStudioData()` suit le pattern simple des autres server actions (`teamActions.ts`).
- Pas de changement du design visuel des composants, uniquement le branchement des données.
