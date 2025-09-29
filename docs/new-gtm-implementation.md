# Nouvelle implémentation GTM basée sur l'article Medium

## Vue d'ensemble

Cette implémentation est basée sur l'article [Configuring Google Cookies Consent with Next.js 15](https://medium.com/@sdanvudi/configuring-google-cookies-consent-with-next-js-15-ca159a2bea13) et remplace l'utilisation de `@next/third-parties/google` par une approche personnalisée utilisant `next/script`.

## Pourquoi cette approche ?

### Problèmes avec `@next/third-parties/google`

1. **Pas de support pour la gestion dynamique du consentement** : Le package ne permet pas de mettre à jour le consentement en temps réel
2. **Manque de flexibilité** : Configuration limitée et peu de contrôle sur l'initialisation
3. **Documentation sparse** : Peu d'exemples pour les cas d'usage avancés

### Avantages de la nouvelle approche

1. **Gestion dynamique du consentement** : Mise à jour en temps réel via `gtag('consent', 'update')`
2. **Contrôle total** : Configuration fine des paramètres GTM
3. **Performance optimisée** : Chargement conditionnel selon les préférences utilisateur
4. **Conformité RGPD** : Respect du Consent Mode v2 de Google

## Architecture

### 1. Composant GoogleTag (`/src/components/common/GoogleTag.tsx`)

```typescript
interface GoogleTagProps {
  GTM_ID: string;
}
```

**Fonctionnalités :**

- Initialise GTM avec `next/script`
- Lit les préférences depuis `localStorage`
- Configure le consentement par défaut basé sur les préférences
- Gère la configuration des cookies (domaine, flags, chemin)

### 2. Hook useGTMConsent (`/src/hooks/useGTMConsent.ts`)

```typescript
useGTMConsent(preferences: CookiePreferences | null)
```

**Fonctionnalités :**

- Écoute les changements de préférences
- Met à jour le consentement GTM en temps réel
- Évite les mises à jour au premier rendu
- Envoie des événements de confirmation

### 3. Composant GDPRConsent (modifié)

**Simplifications apportées :**

- Suppression de la logique GTM complexe
- Utilisation du hook `useGTMConsent`
- Fonctions simplifiées pour la sauvegarde des préférences

## Flux de fonctionnement

### 1. Initialisation

1. **Chargement de la page** : Le composant `GoogleTag` vérifie `localStorage`
2. **Lecture des préférences** : `cookieConsent` et `cookiePreferences`
3. **Configuration GTM** : Initialisation avec consentement approprié

### 2. Première visite (pas de préférences)

1. **Consentement par défaut** : `denied` pour tous les types
2. **Bannière affichée** : Après 3 secondes d'engagement
3. **Choix utilisateur** : Accepter/Refuser/Personnaliser

### 3. Mise à jour du consentement

1. **Changement de préférences** : Via l'interface utilisateur
2. **Hook déclenché** : `useGTMConsent` détecte le changement
3. **GTM mis à jour** : `gtag('consent', 'update', { ... })`
4. **Événement envoyé** : Confirmation du consentement

## Configuration technique

### Consentement par défaut

```javascript
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
});
```

### Mise à jour dynamique

```javascript
gtag("consent", "update", {
  ad_storage: preferences.marketing ? "granted" : "denied",
  analytics_storage: preferences.analytics ? "granted" : "denied",
  // ...
});
```

### Configuration des cookies

```javascript
gtag("set", {
  cookie_domain: isLocalhost ? "none" : "auto",
  cookie_flags: isLocalhost ? "" : "SameSite=Lax;Secure",
  cookie_path: "/",
  cookie_update: true,
});
```

## Structure des données

### CookiePreferences

```typescript
interface CookiePreferences {
  necessary: boolean; // Toujours true
  analytics: boolean; // Google Analytics
  marketing: boolean; // Google Ads, retargeting
  functionality: boolean; // Préférences utilisateur
}
```

### localStorage

- `InRealArtCookieConsent`: `"true"` | `"false"` | `null`
- `InRealArtCookiePreferences`: JSON stringifié des préférences

## Debugging

### Console logs disponibles

- `🏷️ GTM initialisé avec consentement: [status]`
- `🔄 Mise à jour du consentement GTM: [preferences]`
- `✅ Préférences de consentement sauvegardées: [preferences]`

### Test dans la console

```javascript
// Vérifier le dataLayer
console.log(window.dataLayer);

// Tester une mise à jour de consentement
gtag("consent", "update", { analytics_storage: "granted" });

// Vérifier les cookies GTM
document.cookie.split(";").filter((c) => c.includes("_ga"));
```

## Migration depuis l'ancienne version

### Changements effectués

1. ✅ Création du composant `GoogleTag` personnalisé
2. ✅ Création du hook `useGTMConsent`
3. ✅ Simplification de `GDPRConsent`
4. ✅ Mise à jour du `layout.tsx`
5. ✅ Suppression de `@next/third-parties/google`

### Compatibilité

- **localStorage** : Format conservé, pas de migration nécessaire
- **Cookies existants** : Automatiquement gérés par la nouvelle implémentation
- **GTM Container** : Aucun changement requis

## Avantages mesurables

1. **Performance** : Réduction du temps de chargement initial
2. **Flexibilité** : Ajout facile de nouveaux types de consentement
3. **Conformité** : Respect total du RGPD et du Consent Mode v2
4. **Maintenance** : Code plus simple et modulaire

## Tests recommandés

1. **Premier visit** : Vérifier l'affichage de la bannière
2. **Acceptation** : Contrôler la création des cookies GTM
3. **Refus** : Vérifier l'absence de cookies non-essentiels
4. **Mise à jour** : Tester les changements de préférences
5. **Persistance** : Vérifier la sauvegarde des choix

---

_Documentation créée le $(date) - Basée sur l'article Medium de @sdanvudi_
