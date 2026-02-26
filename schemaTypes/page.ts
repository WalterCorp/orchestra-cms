// orchestra-cms/schemaTypes/page.ts

import { defineField, defineType } from "sanity";

// ============================================================
// RICH TEXT BLOCKS
//
// richTextBlockInline — titres et phrases courtes
//   - Pas de H1-H6 (le front gère la hiérarchie sémantique)
//   - Gras, italique, highlight
//   - Pas de liens, pas de listes
//
// richTextBlockBody — sections et contenus longs
//   - H2 et H3 autorisés (rendus par bodyComponents dans RichText.tsx)
//   - Gras, italique, highlight
//   - Liens et listes autorisés
// ============================================================

const richTextBlockInline = {
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  marks: {
    decorators: [
      { title: "Gras", value: "strong" },
      { title: "Italique", value: "em" },
      { title: "Mise en valeur (brand color)", value: "highlight" },
    ],
    annotations: [],
  },
};

const richTextBlockBody = {
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Titre H2", value: "h2" },
    { title: "Titre H3", value: "h3" },
  ],
  marks: {
    decorators: [
      { title: "Gras", value: "strong" },
      { title: "Italique", value: "em" },
      { title: "Mise en valeur (brand color)", value: "highlight" },
    ],
    annotations: [{ type: "link" }],
  },
  lists: [
    { title: "Liste à puces", value: "bullet" },
    { title: "Liste numérotée", value: "number" },
  ],
};

// ============================================================
// HELPERS
// ============================================================

/**
 * titleLines — titres multi-lignes pour cards
 * ✅ Option B : max sans min — flexible à la baisse
 */
const titleLinesField = defineField({
  name: "titleLines",
  title: "Titre (lignes)",
  type: "array",
  of: [{ type: "string" }],
  description: "Chaque élément = une ligne. Max 4 lignes.",
  validation: (Rule) => Rule.max(4),
});

/**
 * sectionTitleRichField — titre de section obligatoire
 * Utilise richTextBlockInline : pas de H1-H6 dans les titres
 */
const sectionTitleRichField = defineField({
  name: "titleRich",
  title: "Titre (rich) *",
  type: "array",
  of: [richTextBlockInline],
  validation: (Rule) => Rule.required().min(1),
});

/**
 * requireAtLeastOneContent — validation custom partagée
 * ✅ CORRECTION C : helper commun pour éviter la duplication
 * Utilisé sur : process.steps[] et domains.cards[]
 * Règle : au moins un des blocs topRich / bottomRich / outroRich doit être rempli
 */
// Rule typé `any` volontairement — Sanity n'exporte pas son type Rule
const requireAtLeastOneContent = (Rule: any) =>
  Rule.custom((value: any) => {
    if (!value) return true;
    const hasTop = Array.isArray(value.topRich) && value.topRich.length > 0;
    const hasBottom = Array.isArray(value.bottomRich) && value.bottomRich.length > 0;
    const hasOutro = Array.isArray(value.outroRich) && value.outroRich.length > 0;
    return hasTop || hasBottom || hasOutro
      ? true
      : "Ajoute au moins un contenu (topRich, bottomRich ou outroRich).";
  });

export const page = defineType({
  name: "page",
  title: "📄 Page",
  type: "document",

  fieldsets: [
    {
      name: "identity",
      title: "🧭 Identité & SEO",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "hero",
      title: "🚀 Hero (commun)",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "finalCta",
      title: "🎯 CTA final (commun)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "home",
      title: "🏠 Accueil",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "cabinet",
      title: "🏛️ Cabinet",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "methode",
      title: "🧠 Méthode ORCHESTRA",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "fonctionnement",
      title: "⚙️ Fonctionnement",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "expertises",
      title: "🧩 Expertises",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "faq",
      title: "❓ FAQ",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "contact",
      title: "✉️ Contact",
      options: { collapsible: true, collapsed: true },
    },
  ],

  fields: [
    // ============================================================
    // IDENTITÉ & SEO
    //
    // CONTRAT SEO (point A) :
    // - globalSettings.seo = métadonnées par défaut (toutes les pages)
    // - page.seoTitle / page.seoDescription = override optionnel par page
    // - Le front applique : page d'abord, global en fallback
    // - Ces champs sont intentionnels — ne pas supprimer
    // ============================================================
    defineField({
      name: "title",
      title: "Titre interne",
      type: "string",
      fieldset: "identity",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "identity",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO — Title (override optionnel)",
      type: "string",
      fieldset: "identity",
      description:
        "Si rempli, remplace le titre SEO global pour cette page uniquement.",
      validation: (Rule) =>
        Rule.max(60).warning("Idéalement moins de 60 caractères pour Google"),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO — Description (override optionnel)",
      type: "text",
      rows: 3,
      fieldset: "identity",
      description:
        "Si remplie, remplace la description SEO globale pour cette page uniquement.",
      validation: (Rule) =>
        Rule.max(160).warning("Idéalement moins de 160 caractères pour Google"),
    }),

    // ============================================================
    // HERO (commun)
    //
    // CONTRAT HERO :
    // - titleRich : obligatoire (sans titre, la page n'a pas de sens)
    // - descriptionRich : optionnel (flexibilité client)
    // - badge, CTAs : optionnels (rendu conditionnel côté front)
    //
    // HERO BACKGROUND (point B) :
    // - backgroundMode / backgroundImage / overlayIntensity
    // - Statut : "front support now" — implémenté dans les 6 pages
    // - overlayIntensity en string "40"|"70"|"90" = contrat implicite front
    //   Le front lit cette valeur et l'applique comme opacité CSS
    // ============================================================
    defineField({
      name: "hero",
      title: "Bloc Hero",
      type: "object",
      fieldset: "hero",
      fields: [
        defineField({
          name: "backgroundMode",
          title: "Fond du hero",
          type: "string",
          description:
            "Fond uni : couleur globale du site. Image : photo uploadée avec overlay.",
          options: {
            list: [
              { title: "Fond uni (défaut)", value: "solid" },
              { title: "Image de fond", value: "image" },
            ],
            layout: "radio",
          },
          initialValue: "solid",
        }),

        defineField({
          name: "backgroundImage",
          title: "Image de fond",
          type: "image",
          description:
            "Recommandé : 1920×1080px minimum. PNG ou WebP. Visible uniquement si 'Image de fond' est sélectionné.",
          options: {
            accept: "image/png,image/webp,image/jpeg",
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              description: "Si l'image est informative (photo de contexte, équipe…), renseigner ce champ pour l'accessibilité.",
            }),
          ],
          hidden: ({ parent }) => parent?.backgroundMode !== "image",
        }),

        defineField({
          name: "overlayIntensity",
          title: "Intensité de l'overlay sombre",
          type: "string",
          description:
            "Contrôle la lisibilité du texte sur l'image. 40 = overlay léger (40% noir), 70 = équilibré (70% noir), 90 = texte prioritaire (90% noir).",
          options: {
            list: [
              { title: "Léger — image très visible", value: "40" },
              { title: "Moyen — équilibré (défaut)", value: "70" },
              { title: "Fort — texte prioritaire", value: "90" },
            ],
            layout: "radio",
          },
          initialValue: "70",
          hidden: ({ parent }) => parent?.backgroundMode !== "image",
        }),

        defineField({ name: "badgeEmoji", title: "Badge — Emoji (optionnel)", type: "string" }),
        defineField({ name: "badgeText", title: "Badge — Texte (optionnel)", type: "string" }),

        defineField({
          name: "titleRich",
          title: "Titre (rich) *",
          type: "array",
          of: [richTextBlockInline],
          description: "Obligatoire. Supporte gras, italique et mise en valeur.",
          validation: (Rule) => Rule.required().min(1),
        }),

        defineField({
          name: "descriptionRich",
          title: "Description (rich)",
          type: "array",
          of: [richTextBlockInline],
          description: "Optionnel. Si absent, la description n'est pas affichée.",
        }),

        defineField({ name: "primaryCtaLabel", title: "CTA primaire — label (optionnel)", type: "string" }),
        defineField({ name: "primaryCtaHref", title: "CTA primaire — lien (optionnel)", type: "string", description: "Lien interne (ex : /contact) ou externe (ex : https://…)" }),
        defineField({ name: "secondaryCtaLabel", title: "CTA secondaire — label (optionnel)", type: "string" }),
        defineField({ name: "secondaryCtaHref", title: "CTA secondaire — lien (optionnel)", type: "string", description: "Lien interne (ex : /methode-orchestra) ou externe (ex : https://…)" }),
      ],
    }),

    // ============================================================
    // CTA FINAL (commun)
    // ============================================================
    defineField({
      name: "finalCta",
      title: "CTA final (commun)",
      type: "object",
      fieldset: "finalCta",
      fields: [
        defineField({ name: "titleRich", title: "Titre (rich)", type: "array", of: [richTextBlockInline] }),
        defineField({ name: "textRich", title: "Texte (rich)", type: "array", of: [richTextBlockInline] }),
        defineField({ name: "primaryLabel", title: "CTA primaire — label", type: "string" }),
        defineField({ name: "primaryHref", title: "CTA primaire — lien", type: "string" }),
        defineField({ name: "secondaryLabel", title: "CTA secondaire — label", type: "string" }),
        defineField({ name: "secondaryHref", title: "CTA secondaire — lien", type: "string" }),
      ],
    }),

    // ============================================================
    // ACCUEIL
    // ============================================================
    defineField({
      name: "homeSections",
      title: "Sections Accueil",
      type: "object",
      fieldset: "home",
      fields: [
        defineField({
          name: "approach",
          title: "✨ Notre approche",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "orchestraCore",
          title: "🤖 ORCHESTRA — Noyau IA",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "pillars",
              title: "🧱 Piliers",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }),
                    defineField({ name: "line1", title: "Ligne 1", type: "string", validation: (Rule) => Rule.required() }),
                    defineField({ name: "line2", title: "Ligne 2 (optionnel)", type: "string" }),
                  ],
                },
              ],
              validation: (Rule) => Rule.max(6),
            }),
          ],
        }),

        defineField({
          name: "humanPlace",
          title: "👤 La place de l'humain",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "intro", title: "Intro (rich)", type: "array", of: [richTextBlockInline] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }),
                    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required() }),
                    defineField({ name: "text", title: "Texte", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
                  ],
                },
              ],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "outro", title: "Texte final (rich)", type: "array", of: [richTextBlockInline] }),
          ],
        }),
      ],
    }),

    // ============================================================
    // CABINET
    // ============================================================
    defineField({
      name: "cabinetSections",
      title: "Sections Cabinet",
      type: "object",
      fieldset: "cabinet",
      fields: [
        defineField({
          name: "vision",
          title: "👁️ Vision",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "emoji", title: "Emoji (optionnel)", type: "string" }),
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),
        defineField({
          name: "human",
          title: "🤝 Humain",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "emoji", title: "Emoji (optionnel)", type: "string" }),
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),
        defineField({
          name: "ai",
          title: "🧠 IA",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "emoji", title: "Emoji (optionnel)", type: "string" }),
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),
      ],
    }),

    // ============================================================
    // MÉTHODE ORCHESTRA
    // ============================================================
    defineField({
      name: "methodeSections",
      title: "Sections Méthode ORCHESTRA",
      type: "object",
      fieldset: "methode",
      fields: [
        defineField({
          name: "intro",
          title: "🧩 Une nouvelle façon de travailler",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "emoji", title: "Emoji (optionnel)", type: "string" }),
            defineField({ name: "contentRich", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "why",
          title: "❓ Pourquoi ORCHESTRA",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({ name: "label", title: "Label (optionnel)", type: "string" }),
            defineField({
              name: "pillars",
              title: "🃏 Piliers",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "outroRich", title: "Texte final (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "core",
          title: "🧠 Composition du noyau ORCHESTRA",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({ name: "label", title: "Label (optionnel)", type: "string" }),
            defineField({
              name: "bubbles",
              title: "🫧 Bulles",
              type: "object",
              fields: [
                defineField({
                  name: "line1",
                  title: "Ligne 1",
                  type: "array",
                  of: [{ type: "object", fields: [
                    defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }),
                    defineField({ name: "title", title: "Titre", type: "string" }),
                    defineField({ name: "text", title: "Texte", type: "text", rows: 4 }),
                  ]}],
                  validation: (Rule) => Rule.max(4),
                }),
                defineField({
                  name: "line2",
                  title: "Ligne 2",
                  type: "array",
                  of: [{ type: "object", fields: [
                    defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }),
                    defineField({ name: "title", title: "Titre", type: "string" }),
                    defineField({ name: "text", title: "Texte", type: "text", rows: 4 }),
                  ]}],
                  validation: (Rule) => Rule.max(4),
                }),
              ],
            }),
            defineField({ name: "outroRich", title: "Texte final (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "human",
          title: "👤 Le rôle central de l'humain",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({ name: "label", title: "Label (optionnel)", type: "string" }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "outroRich", title: "Texte final (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "workflow",
          title: "⚙️ Fonctionnement global",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "steps",
              title: "🃏 Étapes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "outroRich", title: "Texte final (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "benefits",
          title: "📈 Bénéfices pour le client",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
          ],
        }),
      ],
    }),

    // ============================================================
    // FONCTIONNEMENT
    // ============================================================
    defineField({
      name: "fonctionnementSections",
      title: "Sections Fonctionnement",
      type: "object",
      fieldset: "fonctionnement",
      fields: [
        defineField({
          name: "principles",
          title: "🧱 Principes de notre approche",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "outroRich", title: "Texte final (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "process",
          title: "🧭 Déroulement d'un accompagnement",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "steps",
              title: "🧩 Étapes",
              type: "array",
              of: [
                {
                  type: "object",
                  // ✅ CORRECTION C : helper commun au lieu de la validation dupliquée
                  validation: requireAtLeastOneContent,
                  fields: [
                    defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }),
                    defineField({
                      name: "titleLines",
                      title: "Titre (lignes)",
                      type: "array",
                      of: [{ type: "string" }],
                      validation: (Rule) => Rule.required().min(1).max(2),
                    }),
                    defineField({ name: "topRich", title: "Bloc haut (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
                    defineField({ name: "labelRich", title: "Label (rich) — optionnel", type: "array", of: [richTextBlockInline] }),
                    defineField({ name: "bottomRich", title: "Bloc bas (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
                    defineField({ name: "outroRich", title: "Outro (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
                  ],
                },
              ],
              validation: (Rule) => Rule.max(6),
            }),
          ],
        }),

        defineField({
          name: "orchestraPlace",
          title: "🤖 Place d'ORCHESTRA dans le processus",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({ name: "labelRich", title: "Label (rich) — optionnel", type: "array", of: [richTextBlockInline] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
          ],
        }),

        defineField({
          name: "clientBenefits",
          title: "📈 Ce que cela change pour le client",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
          ],
        }),
      ],
    }),

    // ============================================================
    // EXPERTISES
    // ============================================================
    defineField({
      name: "expertisesSections",
      title: "Sections Expertises",
      type: "object",
      fieldset: "expertises",
      fields: [
        defineField({
          name: "approach",
          title: "✨ Notre approche",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "contentRich", title: "Contenu (rich)", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "domains",
          title: "🧱 Domaines d'expertise",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
            defineField({
              name: "cards",
              title: "🧩 Cartes",
              type: "array",
              of: [
                {
                  type: "object",
                  // ✅ CORRECTION C : helper commun
                  validation: requireAtLeastOneContent,
                  fields: [
                    defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }),
                    defineField({
                      name: "titleLines",
                      title: "Titre (lignes)",
                      type: "array",
                      of: [{ type: "string" }],
                      validation: (Rule) => Rule.required().min(1).max(2),
                    }),
                    defineField({ name: "topRich", title: "Bloc haut (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
                    defineField({ name: "labelRich", title: "Label (rich) — optionnel", type: "array", of: [richTextBlockInline] }),
                    defineField({ name: "bottomRich", title: "Bloc bas (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
                    defineField({ name: "outroRich", title: "Outro (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
                  ],
                },
              ],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({
              name: "changeBand",
              title: "🏷️ Bandeau — Accompagnement au changement (optionnel)",
              type: "object",
              fields: [
                defineField({ name: "title", title: "Titre (optionnel)", type: "string" }),
                defineField({ name: "textRich", title: "Texte (rich)", type: "array", of: [richTextBlockBody] }),
              ],
            }),
          ],
        }),

        defineField({
          name: "orchestraSupport",
          title: "🤖 Comment ORCHESTRA soutient",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "introRich", title: "Intro (rich)", type: "array", of: [richTextBlockBody] }),
            defineField({ name: "labelRich", title: "Label (rich) — optionnel", type: "array", of: [richTextBlockInline] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "outroRich", title: "Outro (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
          ],
        }),

        defineField({
          name: "audiences",
          title: "👥 Pour qui",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "labelRich", title: "Label (rich) — optionnel", type: "array", of: [richTextBlockInline] }),
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [{ type: "object", fields: [defineField({ name: "icon", title: "Icône (optionnel)", type: "string" }), titleLinesField] }],
              validation: (Rule) => Rule.max(6),
            }),
          ],
        }),
      ],
    }),

    // ============================================================
    // FAQ
    //
    // ✅ EXCEPTION D documentée — contrat ORCHESTRA :
    // faqSections.items : min(1) assumé intentionnellement.
    // Une page FAQ sans aucune question n'a pas de sens fonctionnel.
    // Ce n'est pas une violation de l'Option B — c'est une règle métier.
    // ============================================================
    defineField({
      name: "faqSections",
      title: "Sections FAQ",
      type: "object",
      fieldset: "faq",
      fields: [
        sectionTitleRichField,
        defineField({ name: "introRich", title: "Intro (rich) — optionnel", type: "array", of: [richTextBlockBody] }),
        defineField({
          name: "items",
          title: "❓ Questions / réponses",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required().min(5) }),
                defineField({ name: "answerRich", title: "Réponse (rich)", type: "array", of: [richTextBlockBody], validation: (Rule) => Rule.required().min(1) }),
              ],
            },
          ],
          // ✅ EXCEPTION D : min(1) intentionnel — règle métier, pas une dérive
          validation: (Rule) => Rule.min(1),
        }),
        defineField({
          name: "conviction",
          title: "🏷️ Bandeau conviction — optionnel",
          type: "object",
          fields: [
            defineField({ name: "badgeEmoji", title: "Badge — Emoji (optionnel)", type: "string" }),
            defineField({ name: "textRich", title: "Texte (rich)", type: "array", of: [richTextBlockBody], validation: (Rule) => Rule.required().min(1) }),
          ],
        }),
      ],
    }),

    // ============================================================
    // CONTACT
    //
    // ✅ EXCEPTION D documentée — contrat ORCHESTRA :
    // reassurance.cards : required assumé intentionnellement.
    // La section réassurance sans cartes est visuellement cassée.
    // Ce n'est pas une violation de l'Option B — c'est une règle métier.
    // ============================================================
    defineField({
      name: "contactSections",
      title: "Sections Contact",
      type: "object",
      fieldset: "contact",
      fields: [
        defineField({
          name: "form",
          title: "📝 Formulaire — bloc principal",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({ name: "textRich", title: "Texte (rich)", type: "array", of: [richTextBlockBody], validation: (Rule) => Rule.required().min(1) }),
          ],
        }),
        defineField({
          name: "reassurance",
          title: "🛡️ Réassurance — après formulaire",
          type: "object",
          fields: [
            sectionTitleRichField,
            defineField({
              name: "cards",
              title: "🃏 Cartes",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "title", title: "Titre", type: "string", validation: (Rule) => Rule.required().min(3) }),
                  ],
                },
              ],
              // ✅ EXCEPTION D : required intentionnel — section visuellement cassée sans cartes
              validation: (Rule) => Rule.required().min(1).max(6),
            }),
            defineField({ name: "linkLabel", title: "Lien — label (optionnel)", type: "string" }),
            defineField({ name: "linkHref", title: "Lien — href (optionnel)", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});