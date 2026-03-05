# ORCHESTRA — CMS (Sanity v5)

Studio Sanity v5 du projet ORCHESTRA — source de vérité pour tous les contenus éditoriaux du site vitrine CMS-first Diligency Vision.

🔗 [Site en production](https://orchestra-site.vercel.app) · [Frontend repo](https://github.com/DiligencyVision/orchestra-site) · [Studio en ligne](https://orchestra-cms.sanity.studio)

---

## 🎯 Rôle

Ce repo contient le Studio Sanity — interface d'administration des contenus du site ORCHESTRA.
Toutes les pages du site sont pilotées depuis ce CMS. Le frontend Next.js consomme les contenus via l'API Sanity avec des requêtes GROQ centralisées dans `lib/sanity/queries.ts`.

**Principe cardinal : le CMS est la source de vérité — le frontend est le moteur de rendu.**

Chaque couche est indépendante : modifier un contenu dans Sanity ne nécessite pas de toucher au code frontend, et faire évoluer le frontend ne nécessite pas de modifier le schéma CMS — tant que le contrat entre les deux est respecté.

---

## 🗂️ Architecture des contenus

### Type `page` (type unique)
Toutes les pages du site sont des instances de ce type :
- `title` · `slug` · `seoTitle` · `seoDescription`
- `hero` : titre rich text, sous-titre, fond (solid / image / vidéo)
- `sections` : blocs de contenu modulaires
- `finalCta` : appel à l'action final commun

### Pages gérées

| Page | Slug |
|------|------|
| Accueil | `/` |
| Le Cabinet | `/cabinet` |
| Méthode ORCHESTRA | `/methode` |
| Fonctionnement | `/fonctionnement` |
| Expertises | `/expertises` |
| FAQ | `/faq` |
| Contact | `/contact` |

### Type `globalSettings` (singleton)
Données partagées entre toutes les pages :
- Identité visuelle (brand, couleur, font, logo)
- Navigation Header (liens, CTA)
- Contenu Footer (colonnes, copyright)
- SEO global (metaTitle, metaDescription, ogImage)

---

## 🔗 Lien avec le frontend

Le frontend Next.js (`DiligencyVision/orchestra-site`) consomme les contenus via l'API Sanity selon ce flux :
```
Studio Sanity → API Sanity → Requêtes GROQ → Composants React → Site rendu
```

Points d'intégration clés :
- `lib/sanity/client.ts` — configuration de la connexion Sanity
- `lib/sanity/queries.ts` — toutes les requêtes GROQ centralisées
- `app/[slug]/page.tsx` — page dynamique pilotée par le slug Sanity
- `app/layout.tsx` — charge `globalSettings` via `React cache()`

**Contrat schéma ↔ frontend :** tout champ ajouté dans le schéma Sanity doit être projeté dans la requête GROQ correspondante et typé côté TypeScript. Ces trois couches doivent toujours être alignées.

---

## ✏️ Modifier un contenu (guide rapide)

1. Aller sur [orchestra-cms.sanity.studio](https://orchestra-cms.sanity.studio)
2. Sélectionner la page à modifier dans le panneau gauche
3. Modifier les champs souhaités
4. Cliquer **Publish** — le site se met à jour automatiquement

**Ce qu'on peut modifier librement :**
- Tous les textes (titres, descriptions, CTA)
- Les images et vidéos de fond
- Les liens de navigation
- Les paramètres SEO par page
- Le contenu Footer et Header

**Ce qu'on ne touche pas sans le développeur :**
- La structure des schémas (fichiers `schemaTypes/`)
- Les slugs des pages existantes (risque de casser les URLs)
- Les champs techniques liés au frontend

---

## 🛠️ Faire évoluer un schéma

Procédure à suivre pour ajouter ou modifier un champ sans casser le frontend :

1. Modifier le schéma dans `schemaTypes/` — un seul champ à la fois
2. Redémarrer le Studio local (`npm run dev`) pour vérifier
3. Mettre à jour la requête GROQ correspondante dans `lib/sanity/queries.ts` (frontend)
4. Mettre à jour le typage TypeScript correspondant (frontend)
5. Mettre à jour le composant React qui consomme le champ (frontend)
6. Tester le rendu si le champ est vide (prévoir un fallback)
7. Commiter les deux repos séparément avec des messages explicites

> Ne jamais modifier plusieurs couches simultanément. Procéder couche par couche.

---

## ⚙️ Stack

- Sanity v5 · TypeScript
- Studio déployé : [orchestra-cms.sanity.studio](https://orchestra-cms.sanity.studio)

---

## 🚀 Installation locale
```bash
git clone https://github.com/DiligencyVision/orchestra-cms.git
cd orchestra-cms
npm install
npm run dev
```
→ http://localhost:3333

---

## 🧠 Retours d'expérience

- Toujours aligner schéma Sanity → requête GROQ → typage TypeScript → composant React
- Redémarrer le Studio après toute modification de schéma
- Ne jamais modifier plusieurs couches simultanément
- Tester le rendu si un champ CMS est vide (prévoir des fallbacks côté frontend)
- Les slugs des pages existantes ne doivent jamais changer en production

---

## 📄 Licence

Usage interne — Diligency Vision — 2026
