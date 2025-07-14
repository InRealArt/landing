# Implémentation de la Popup d'Abonnement Newsletter v2.0

## Vue d'ensemble

Cette implémentation ajoute une popup d'abonnement à la newsletter qui s'affiche après un délai configurable (par défaut 5 secondes) de navigation sur le site. Elle utilise une architecture robuste basée sur React Context, une server action sécurisée avec validation Zod, Google reCAPTCHA et intégration Brevo.

## Nouvelle Architecture (v2.0)

### 🏗️ **Architecture Context-based**

- **`NewsletterContext`** : Contexte global pour l'état de la popup
- **`NewsletterProvider`** : Provider qui gère le timer et la logique métier
- **`NewsletterManager`** : Composant wrapper qui intègre provider et modal
- **`NewsletterModal`** : Composant modal optimisé avec bonnes pratiques NextJS 15

### 🔧 **Bonnes pratiques NextJS 15**

- Évitement des problèmes d'hydratation avec `useEffect` et `isMounted`
- Gestion propre des effets côté client uniquement
- Utilisation de `useTransition` pour les actions asynchrones
- Cleanup approprié des event listeners

## Fonctionnalités

### 1. **Gestion du temps de session**

- Timer intégré dans le contexte global
- Déclenchement automatique après délai configurable
- Utilisation de `sessionStorage` pour éviter les réaffichages multiples
- Logs détaillés pour le debugging

### 2. **Popup d'abonnement**

- Design moderne et responsive
- Formulaire d'abonnement avec validation côté client et serveur
- Gestion des erreurs et messages de succès avec `react-sonner`
- Option "pas intéressé" pour désactiver définitivement
- Support clavier et accessibilité

### 3. **Server Action sécurisée**

- Validation Zod pour l'email
- Vérification Google reCAPTCHA côté serveur
- Intégration directe avec l'API Brevo
- Gestion d'erreurs robuste et logging

## Architecture technique

### Structure des fichiers

```
src/
├── contexts/
│   └── NewsletterContext.tsx           # Contexte global et provider
├── components/common/
│   ├── NewsletterManager.tsx           # Gestionnaire principal
│   └── NewsletterModal.tsx             # Modal optimisé
├── utils/
│   └── newsletterUtils.ts              # Utilitaires et fonctions debug
├── actions/
│   └── newsletterActions.ts            # Server action sécurisée
└── app/
    └── layout.tsx                      # Intégration dans le layout
```

### Composants principaux

1. **`NewsletterContext`** : Contexte global avec state management
2. **`NewsletterProvider`** : Provider avec logique de timer et conditions
3. **`NewsletterManager`** : Composant d'intégration avec Suspense
4. **`NewsletterModal`** : Modal optimisé avec bonnes pratiques
5. **`subscribeToNewsletter`** : Server action sécurisée

### Utilitaires

**`newsletterUtils.ts`** : Fonctions utilitaires pour :

- Gestion du stockage local/session
- Vérification des conditions
- Fonctions de debug pour les tests

### Logique de stockage

- **`localStorage`** : `newsletter-not-interested` (choix utilisateur permanent)
- **`sessionStorage`** : `newsletter-popup-shown` (popup vue dans cette session)

## Configuration

### Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Brevo API
BREVO_API_KEY="votre_clé_api_brevo"
BREVO_NEWSLETTER_LIST_ID="1" # ID de la liste dans Brevo

# Google reCAPTCHA (déjà configuré)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="votre_clé_site_recaptcha"
RECAPTCHA_SECRET_KEY="votre_clé_secrète_recaptcha"

# Next.js Server Actions
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="votre_clé_de_chiffrement"
```

### Utilisation

```tsx
// Dans layout.tsx
<NewsletterManager delayInSeconds={5} />
```

### Configuration du délai

```tsx
// Délai personnalisé
<NewsletterManager delayInSeconds={30} />

// Désactiver temporairement
<NewsletterManager disabled={true} />
```

## Fonctionnalités avancées

### Context API Benefits

- État global accessible depuis n'importe où
- Logique centralisée et réutilisable
- Performance optimisée avec `useCallback`

### Gestion d'état persistant

- Respect du choix utilisateur entre les sessions
- Évite les réaffichages multiples dans la même session
- Réinitialisation facile pour les tests

### Accessibilité

- Support du clavier (Échap pour fermer)
- Aria labels appropriés
- Focus management et backdrop click
- Gestion du scroll body

### Performance

- Chargement conditionnel avec Suspense
- Évitement des problèmes d'hydratation
- Nettoyage automatique des écouteurs
- Optimisation des re-rendus avec `useCallback`

## Tests et Debug

### Mode Debug automatique

En développement, les fonctions suivantes sont disponibles dans la console :

```javascript
// Réinitialiser toutes les conditions
resetNewsletterConditions();

// Vérifier l'état actuel
isUserNotInterested(); // true/false
hasPopupBeenShown(); // true/false
shouldShowPopup(); // true/false

// Marquer manuellement
markUserAsNotInterested();
markPopupAsShown();
```

### Logs détaillés

```
🔍 Newsletter conditions: { notInterested, popupShown, canShowPopup, disabled, delayInSeconds }
✅ Newsletter timer activé pour X secondes
⏰ Session: X/Y secondes
🚀 Délai atteint! Affichage de la popup
📺 Popup marquée comme montrée
👤 Utilisateur marqué comme pas intéressé
```

### Test manuel

```javascript
// Dans la console développeur
resetNewsletterConditions();
// Recharger la page et attendre 5 secondes
```

## Sécurité

- Validation côté serveur avec Zod
- Protection reCAPTCHA contre les bots
- Sanitisation des données d'entrée
- Gestion sécurisée des erreurs
- Logging approprié sans exposer de données sensibles

## Intégration Brevo

La server action crée automatiquement un contact dans votre liste Brevo avec :

- Email de l'utilisateur
- Timestamp de l'abonnement
- Source : "Website Newsletter Popup"
- Gestion des contacts existants

### API utilisée

- Endpoint : `https://api.brevo.com/v3/contacts`
- Méthode : POST
- Authentification : API Key

## Traductions

Les textes sont déjà traduits en français et anglais dans :

- `src/locales/fr.json`
- `src/locales/en.json`

Sous la clé `newsletter.modal.*`

## Maintenance

### Monitoring

- Logs structurés pour le debugging
- Gestion d'erreurs avec try/catch
- Analytics des conversions possibles
- Performance du timer trackée

### Évolution

- Architecture modulaire et extensible
- Fonctions utilitaires réutilisables
- Context API pour ajouts futurs
- Bonnes pratiques NextJS 15 intégrées

## Migration depuis v1.0

Les anciens composants (`SessionManager`, `useSessionTimer`, `NewsletterSubscriptionModal`) ont été remplacés par la nouvelle architecture plus robuste. La configuration reste compatible.

### Changements principaux

- ✅ Architecture Context-based
- ✅ Évitement des problèmes d'hydratation
- ✅ Fonctions utilitaires centralisées
- ✅ Mode debug automatique
- ✅ Bonnes pratiques NextJS 15

## Performance

- Aucun impact sur le temps de chargement initial
- Lazy loading du modal avec Suspense
- Optimisations mémoire avec cleanup des timers
- Utilisation de sessionStorage pour éviter les répétitions
- Évitement des problèmes d'hydratation

## Troubleshooting

### La popup ne s'affiche pas

1. Vérifiez la console pour les logs
2. Utilisez `resetNewsletterConditions()` pour réinitialiser
3. Vérifiez que le délai est correct
4. Assurez-vous que la popup n'est pas désactivée

### Erreurs d'abonnement

1. Vérifiez les variables d'environnement Brevo
2. Contrôlez la configuration reCAPTCHA
3. Vérifiez les logs serveur pour les erreurs détaillées

### Problèmes d'hydratation

L'architecture v2.0 évite automatiquement ces problèmes avec `isMounted` et `useEffect` appropriés.
