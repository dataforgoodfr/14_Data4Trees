# Architecture Frontend : Adaptation de Feature-Sliced Design (FSD)

## Introduction

Cette documentation décrit l'architecture frontend de notre projet, inspirée de [Feature-Sliced Design (FSD)](https://feature-sliced.design/), mais adaptée pour rester simple et pragmatique. L'objectif est de structurer le code de manière claire et maintenable, sans surcharge inutile.

---

## Structure Globale

De la plus basse à la plus haute

```bash
.
├── shared/          # Code réutilisable à tous les niveaux
├── entities/        # Entités métier (optionnel, selon besoin)
├── features/        # Fonctionnalités utilisateur
├── widgets/         # Composants graphiques agrégés
├── pages/           # Pages de l'application
└── app/             # Configuration et providers globaux
```

Pour faire simple, un élément d'une couche n'a le droit d'importer du code que des layers au-dessus, ou de sa propre layer.

---

## Détail des Dossiers

### 1. `shared/`

**Contenu** : Tout ce qui est réutilisable partout dans l'application, sans logique métier.
**Exemples** :

- `lib/` : Façades de librairies externes (ex: `i18n`, `cn`, gestion de dates).
- `hooks/` : Hooks réutilisables (ex: `use-mobile`, hooks inspirés de [reactuse](https://reactuse.com/)).
- `ui/` : Composants primitifs de ShadCN ou autres (ex: `button.tsx`, `label.tsx`).

:warning: Les composants ShadCN sont installés dans l'alias "ui":

> The CLI will use the aliases.ui value to determine where to place your ui components. Use this config if you want to customize the installation directory for your ui components.

:warning: Les alias de ShadCN sont configurés dans components.json et sont très peu customisables.
Il est très important de conserver l'export de `cn` (et autres utils ShadCN) dans `shared/lib/utils` (notamment `lib` et `utils` sont les formats attendus).

**Règle** : Pas de logique métier ici.

### 2. `entities/` (optionnel)

**Contenu** : Entités métier, si nécessaire pour l'interaction front/back.
**Exemple** : Modèles de données, services dédiés à une entité spécifique.

### 3. `features/`

**Contenu** : Fonctionnalités utilisateur, répondant à un besoin métier.
**Exemple** :

- `filters/` : Composants pour filtrer des données (ex: filtre par catégorie, par année).
- Autres associations de composants primitifs pour répondre à un besoin plus large.

**Règle** : Une feature = une responsabilité claire.

### 4. `widgets/`

**Contenu** : Composants graphiques agrégés, souvent visuels.
**Exemples** :

- `FilterPanel/` : Section de filtres (composé de plusieurs composants de `features/filters`).
- `DashboardPopover/` : Panneau ou section visuelle complexe.

**Règle** : Un widget = une section visuelle.

### 5. `pages/`

**Contenu** : Pages de l'application, assemblage de features et widgets.
**Exemples** :

- `main/` : Page principale, avec logique de fetch haut niveau et CSS de placement.
- `login/` : Page de connexion.

**Règle** : Une page = un arrangement de features/widgets, avec logique déclarative.

### 6. `app/`

**Contenu** : Configuration et providers globaux.
**Exemples** :

- Routing, theming, auth, CSS global (Tailwind), entry point.

---

## Bonnes Pratiques

- **Imports** : Respecter l'ordre des layers (pas d'import circulaire).
- **Réutilisation** : Privilégier `shared/` pour le code générique.
- **Clarté** : Une feature/widget = un dossier, avec un `index.tsx` pour l'export principal.
- **Assets** : Utiliser `/public` pour les assets statiques (logos, etc.).

---

## Exemple de Structure

```bash
.
├── shared/
│   ├── lib/
│   │   ├── cn.ts
│   │   └── i18n/
│   ├── hooks/
│   │   └── use-mobile.ts
│   └── components/
│       ├── button.tsx
│       └── label.tsx
├── features/
│   └── filters/
│       ├── index.tsx
│       └── category-filter.tsx
├── widgets/
│   ├── header/
│   │   ├── index.tsx
│   │   ├── header.tsx
│   │   ├── mode-toggle.tsx
│   │   └── language-selector.tsx
│   └── FilterPanel/
│       ├── index.tsx
│       └── filter-panel.tsx
├── pages/
│   ├── main/
│   │   └── index.tsx
│   └── login/
│       └── index.tsx
└── app/
    ├── providers.tsx
    └── entry.tsx
```

---

## Points à discuter ou adapter

- **Dossier `entities/`** : À créer seulement si besoin d'entités métier front/back.
- **Différence Features/Widgets** : Clarifiée dans la doc, mais à ajuster selon l'usage réel.
- **ShadCN** : Les composants peuvent rester dans `shared/components/` pour simplifier.
