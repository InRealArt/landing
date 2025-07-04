# Guide d'utilisation des traductions avec HTML

Ce guide explique comment utiliser les traductions avec des balises HTML sécurisées (uniquement `<br>`) dans l'application InRealArt.

## Vue d'ensemble

Le système de traduction a été étendu pour permettre l'interprétation sécurisée des balises `<br>` grâce à DOMPurify. Cela permet d'ajouter des retours à la ligne dans les textes de traduction.

## Configuration

### 1. Store de langue étendu

Le `languageStore` dispose maintenant de deux fonctions :

- `t(key)` : traduction classique (texte brut)
- `tHtml(key)` : traduction avec HTML sécurisé (seules les balises `<br>` sont autorisées)

### 2. Sécurité avec DOMPurify

DOMPurify est configuré pour n'autoriser que les balises `<br>` :

```typescript
const cleanHtml = DOMPurify.sanitize(current, {
  ALLOWED_TAGS: ["br"],
  ALLOWED_ATTR: [],
});
```

## Utilisation

### Méthode 1 : Composant TranslatedText (Recommandée)

```tsx
import TranslatedText from '@/components/common/TranslatedText'

// Avec HTML (balises <br>)
<TranslatedText
  translationKey="joinInRealArt.galleries.hero.title"
  as="h1"
  className="text-4xl font-bold"
  allowHtml={true}
/>

// Sans HTML (texte brut)
<TranslatedText
  translationKey="joinInRealArt.galleries.hero.description"
  as="p"
  className="text-gray-300"
  allowHtml={false}
/>
```

### Méthode 2 : Utilisation directe du store

```tsx
import { useLanguageStore } from "@/store/languageStore";

function MyComponent() {
  const { t, tHtml } = useLanguageStore();

  return (
    <div>
      {/* Texte avec HTML */}
      <h1
        dangerouslySetInnerHTML={{
          __html: tHtml("joinInRealArt.galleries.hero.title"),
        }}
      />

      {/* Texte brut */}
      <p>{t("joinInRealArt.galleries.hero.description")}</p>
    </div>
  );
}
```

## Fichiers de traduction

### Structure avec balises `<br>`

```json
{
  "joinInRealArt": {
    "galleries": {
      "hero": {
        "title": "Rejoindre InRealArt<br>en tant que Galerie",
        "subtitle": "Développez votre présence digitale<br>et accédez à un nouveau marché"
      }
    }
  }
}
```

## Bonnes pratiques

1. **Utilisez `allowHtml={true}` uniquement quand nécessaire** pour des raisons de sécurité
2. **Préférez le composant `TranslatedText`** plutôt que l'utilisation directe du store
3. **N'utilisez que des balises `<br>`** dans les traductions HTML
4. **Testez toujours** le rendu des traductions avec HTML

## Sécurité

- Seules les balises `<br>` sont autorisées
- Tous les autres éléments HTML sont supprimés par DOMPurify
- Aucun attribut HTML n'est autorisé
- Protection automatique contre les attaques XSS

## Exemple complet

Voir le composant `ExampleWithHtml.tsx` pour un exemple d'utilisation complète.
