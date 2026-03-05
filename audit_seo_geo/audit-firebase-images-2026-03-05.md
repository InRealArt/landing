# Audit — Images Firebase & Impact SEO
**Date :** 2026-03-05

---

## Problème identifié

Les images d'artworks sur `/artists/[slug]` renvoient des erreurs réseau intermittentes depuis Firebase Storage :

- **403 Forbidden** — header `Referer` bloqué par Firebase
- **412 Precondition Failed** — service account Firebase manquant de permissions (`iam.serviceAccounts.signBlob`) pour valider les tokens d'accès

L'URL directe sans token (`?alt=media` sans `&token=xxx`) retourne **200 OK** → les règles Storage autorisent la lecture publique.

---

## Corrections appliquées (côté code)

### 1. Composant `FirebaseImage` (`src/components/common/FirebaseImage.tsx`)
- Strip automatique du `token` dans les URLs Firebase avant fetch
- Retry automatique avec **backoff exponentiel** : 800ms → 1.6s → 3.2s → 6.4s (4 tentatives max)
- Loader élégant affiché pendant les retries (spinner violet + dots animés)
- Fade-in de l'image à la réception (`opacity 0 → 1`)

### 2. `ArtworkCardOrder` (`src/components/common/cards/ArtworkCardOrder.tsx`)
- Utilise `FirebaseImage` à la place de `<img>` natif

---

## Impact SEO

### Risques identifiés

| Métrique | Impact | Détail |
|---|---|---|
| **LCP** | Modéré | Si une image artwork est l'élément LCP, les retries retardent son affichage |
| **CLS** | Faible | Le conteneur `h-64` fixe dans la grille réserve l'espace → pas de layout shift |
| **Indexation images** | Réel | Googlebot ne rejoue pas les retries JS — les images en erreur restent invisibles pour le crawler |
| **SEO textuel** | Nul | Titres, metas, JSON-LD non affectés |

### Ce que le patch NE résout PAS
Le retry est un correctif **côté client uniquement**. Googlebot et les autres crawlers ne chargent pas les images via JS de retry — ils voient les images cassées directement.

---

## Action requise côté Firebase Console (priorité haute)

### 1. Vérifier les règles Storage
S'assurer que la règle suivante est active pour le path `artists/**` :

```
service firebase.storage {
  match /b/{bucket}/o {
    match /artists/{allPaths=**} {
      allow read;
    }
  }
}
```

### 2. Résoudre le 412 — Re-linker le service account
1. Aller dans **Firebase Console → Storage**
2. Cliquer sur **"Get started"** ou **"Re-link bucket"** si l'alerte est présente
3. Aller dans **Google Cloud Console → IAM & Admin → Service Accounts**
4. Trouver le service account Firebase (`firebase-storage@...`)
5. Ajouter le rôle **"Service Account Token Creator"**

### 3. Optionnel — Régénérer les URLs en base
Une fois Firebase stabilisé, les URLs en base contiennent encore des tokens révoqués. Envisager une migration pour stocker les URLs sans token (`?alt=media` uniquement) directement en DB, ce qui supprime la dépendance aux tokens révocables.

---

## Priorité

**P1** — À résoudre dans Firebase Console avant le prochain crawl Google. Les images cassées pénalisent l'expérience utilisateur et l'indexation des pages artistes.
