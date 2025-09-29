# Documentation des cookies gérés par Google Tag Manager (GTM)

## Vue d'ensemble

Google Tag Manager (GTM) est notre plateforme unique de gestion des tags analytiques et publicitaires. Cette documentation détaille tous les cookies créés et gérés via GTM selon les meilleures pratiques Context7.

## Configuration GTM

- **Container ID**: GTM-NBR8FBBP
- **Mode Consent**: Google Consent Mode v2 activé
- **Domaine**: Configuration automatique (auto/none pour localhost)

## Cookies analytiques gérés par GTM

### 1. Cookies Google Analytics (via GTM)

| Cookie                 | Description                            | Durée     | Catégorie |
| ---------------------- | -------------------------------------- | --------- | --------- |
| `_ga`                  | Identifiant unique utilisateur via GTM | 2 ans     | Analytics |
| `_ga_XXXXXXXXXX`       | ID de propriété Analytics via GTM      | 2 ans     | Analytics |
| `_gid`                 | Identifiant de session via GTM         | 24 heures | Analytics |
| `_gat_gtag_XXXXXXXXXX` | Limitation du taux de requêtes GTM     | 1 minute  | Analytics |

### 2. Cookies Google Ads (via GTM)

| Cookie    | Description                                     | Durée    | Catégorie |
| --------- | ----------------------------------------------- | -------- | --------- |
| `_gcl_au` | Identifiant publicitaire Google via GTM         | 90 jours | Marketing |
| `_gcl_aw` | Conversion tracking AdWords via GTM             | 90 jours | Marketing |
| `_gcl_dc` | Conversion tracking Display & Video 360 via GTM | 90 jours | Marketing |

### 3. Cookies spécifiques GTM

| Cookie | Description                             | Durée   | Catégorie |
| ------ | --------------------------------------- | ------- | --------- |
| `_gtm` | Suivi des événements et conversions GTM | Session | Analytics |

## Avantages de GTM vs Google Analytics direct

### 1. Gestion centralisée

- Un seul point de configuration pour tous les tags
- Mise à jour des tags sans modification du code
- Versioning et workflow d'approbation

### 2. Performance optimisée

- Chargement asynchrone de tous les scripts
- Réduction du nombre de requêtes HTTP
- Cache optimisé

### 3. Conformité RGPD améliorée

- Google Consent Mode v2 intégré
- Contrôle granulaire des cookies
- Respect automatique des préférences utilisateur

### 4. Debugging et monitoring

- Mode Preview pour les tests
- Debug console intégré
- Monitoring en temps réel des tags

## Configuration technique

### Consent Mode v2

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

### Mise à jour du consentement

```javascript
gtag("consent", "update", {
  analytics_storage: preferences.analytics ? "granted" : "denied",
  ad_storage: preferences.marketing ? "granted" : "denied",
  // ...
});
```

## Événements GTM personnalisés

### 1. Événements de consentement

- `cookieConsentAccepted`: Consentement accordé
- `cookieConsentDeclined`: Consentement refusé
- `consent_granted`: Confirmation du consentement

### 2. Événements de navigation

- `page_view`: Consultation de page
- `gtm_debug_test`: Test de debug GTM

## Cookies tiers potentiels (via GTM)

En fonction de la configuration GTM, ces cookies peuvent être créés :

| Plateforme     | Cookies                               | Description                      |
| -------------- | ------------------------------------- | -------------------------------- |
| Facebook Pixel | `_fbp`, `_fbc`                        | Tracking Facebook (si configuré) |
| Google Ads     | `IDE`, `test_cookie`, `NID`, `1P_JAR` | Cookies publicitaires Google     |

## Debugging GTM

### Outils disponibles

1. **Mode Preview GTM**: Activable dans l'interface GTM
2. **Debug console**: `debugGTM()` dans la console navigateur
3. **Network tab**: Vérifier les requêtes vers `googletagmanager.com`
4. **dataLayer**: Inspecter `window.dataLayer` dans la console

### Commandes de debug

```javascript
// Debug général GTM
debugGTM();

// Inspecter dataLayer
console.log(window.dataLayer);

// Test événement
gtag("event", "test_event", { custom_parameter: "test" });
```

## Migration de GA4 vers GTM

### Changements effectués

1. ✅ Suppression de `GoogleAnalytics` component de Next.js
2. ✅ Conservation uniquement de `GoogleTagManager`
3. ✅ Mise à jour du Consent Mode pour GTM
4. ✅ Adaptation des fonctions de debug
5. ✅ Mise à jour des traductions

### Avantages de la migration

- Configuration plus flexible des tags analytics
- Possibilité d'ajouter d'autres plateformes sans modification du code
- Meilleur contrôle des données envoyées
- Conformité RGPD simplifiée

## Bonnes pratiques Context7 appliquées

1. **Consent Mode v2**: Implémentation complète du nouveau standard Google
2. **Configuration domaine**: Gestion automatique localhost vs production
3. **Cookie flags**: SameSite=Lax;Secure en production
4. **Debugging**: Outils de diagnostic intégrés
5. **Performance**: Chargement asynchrone et optimisé
6. **Sécurité**: Configuration CSP compatible

## Maintenance et monitoring

### Actions régulières recommandées

1. Vérifier le statut de publication du container GTM
2. Tester le mode Preview avant déploiement
3. Monitorer les événements dans GTM
4. Vérifier la conformité RGPD des nouveaux tags

### Alertes à surveiller

- Erreurs de chargement GTM dans la console
- Absence de cookies analytics après consentement
- Événements manqués dans GTM Preview
- Problèmes de Consent Mode

---

_Documentation mise à jour le: 2024 - Conforme aux standards Context7_
