# Internationalization (i18n)

L'internationalisation consiste à rendre accessible un site web à plusieurs langages. Il se complète à la localization (`l10n`).

## Comment i18n fonctionne ?

Toute la configuration de `i18n` se retrouve dans le fichier [`config.ts`](./config.ts).

### Principe général

Nous définissons des JSONs de traductions dans tous les languages que nous souhaitons supporter. Les JSONs suivent la même structure, qui peut être aussi profonde que souhaitée, et définit une liste de clé-valeur.

```json
{
  "helloWorld": "Hello World!",
  "nestedValue": {
    "item1": "This is item 1",
    "item2": {
      "title": "Item 2",
      "description": "This is item 2"
    }
  }
}
```

La liste des clés-valeurs ici est donc:

- `"helloWorld"` -> `"Hello World!"`
- `"nestedValue.item1"` -> `"This is item 1"`
- `"nestedValue.item2.title"` -> `"Item 2"`
- `"nestedValue.item2.description"` -> `"This is item 2"`

Ensuite, une fonction de traduction `t` permet de mapper la clé sur la valeur dans le contexte de l'application.

```tsx
import { useTranslation } from "@shared/i18n";

const useMyHook = () => {
  const { t } = useTranslation("namespace");

  const myString = t("nestedValue.item2.title"); // "Item 2"
};
```

### Accès des traductions

Nous utilisons dans notre configuration `httpBackend` de `"i18next-http-backend"`. Il permet de récupérer les fichiers de `public/locales` (stockés dans le CDN) via une requête HTTP. Une autre solution est d'avoir les traductions directement built-in dans le bundle.

Le script `translations:update` permet de copier les fichier de traductions de `i18n/translations` vers `/public/locales`.

### Le langage source

Il faut distinguer le langage "source" (`fr`) des autres langages.

Le langage source (`fr`) fait loi. Pourquoi ?

- C'est lui qui impose la structure finale du JSON. Notamment, pour l'augmentation typescript (autocomplétion).
- C'est le "fallback" pour tous les autres langages. Si une clé n'est pas définie dans un langage en particulier, `i18n` utilisera la clé du fallback à la place\*.

\*NB: Il est possible de customiser, par language, la liste des langages fallbacks. Par exemple, pour le catalan, on pourrait utiliser dans cet ordre le fallback: [spanish, english, french].

### Détection du langage

Le `LanguageSelector` permet de choisir le langage à servir au WebClient. L'information est stockée dans le `localStorage` dans la clé `i18nextLng`.

La configuration est déterminée par le `languageDetector` de `"i18next-browser-languagedetector"`. Il est possible de customiser le stockage ou la détection.

## Cas d'usages

### Traductions avec singulier/pluriel

:bulb: https://www.i18next.com/translation-function/plurals

```tsx
t("myKey", { count: X });
```

### Interpolations de valeur

:bulb: https://www.i18next.com/translation-function/interpolation

```tsx
t("myKey", { id: 1234, anotherVal: "abracadabra" });
```

### Traductions avec des tag html

:bulb: https://react.i18next.com/latest/trans-component

Contexte: Vous avez de wrapper certaines parties de la traduction dans des balises HTML (`<a></a>`, `<b></b>`).

Exemple: `"Follow <tag1>this link</tag1> to meet <tag2>{{ name }}</tag2>"`

```tsx
import { Trans } from "react-i18next";

<Trans
  i18nKey="myKey"
  values={{
    name: "Eddy Manson",
  }}
  components={{
    tag1: <a href="..." />,
    tag2: <strong />,
  }}
/>;
```

## Ajouter une nouvelle traduction

Les traductions fonctionnent par pair:

- une clé de traduction, qui est le path dans le fichier JSON de traduction.
- une valeur de traduction (string), qui est montrée au client.

Ajouter dans le fichier la nouvelle clé et sa traduction (dans tous les langages si possible). Le mieux est d'organiser les clés par context, feature, type de composant, ...

## Ajouter un nouveau language

Un language a une représentation [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1). Par exemple, le français est représenté par `fr`. C'est cette abréviation que nous utilisons avec i18n.

Pour le guide, prenons l'exemple de l'espéranto (`eo`).

1. Créer un dossier pour le language `translations/{lang}` => `translations/eo`.
2. Ajouter un fichier `translations.json` dans ce dossier. Par simplicité, nous n'avons qu'un seul fichier de traduction par language\*.
3. Remplir le fichier de traduction en suivant la même structure JSON que pour `fr/translations.json` qui est notre language source.
4. Ajouter dans le dictionaire `LANGUAGES` de `config.ts` une nouvelle clé pour votre language

   ```tsx
   export const LANGUAGES = {
     FRENCH: "fr",
     ENGLISH: "en",
     ESPERANTO: "eo",
   } as const;
   ```

5. Ajouter dans `LANGUAGES_CONFIGS` du fichier `LanguageSelector` votre nouveau language.

   ```tsx
   const LANGUAGES_CONFIGS = [
     {
       identifier: LANGUAGES.FRENCH,
       fullString: "Français",
       flag: "🇫🇷",
     },
     // ...
     {
       identifier: LANGUAGES.ESPERANTO,
       fullString: "Esperanto", // Nom du langage dans sa propre langue
       flag: "🏴‍☠️", // https://keyboardemojis.com/flags/
     },
   ] as const;
   ```

\*NB: Si les fichiers deviennent trop volumineux, il est possible de les découper (chunks) en plusieurs "namespaces".
