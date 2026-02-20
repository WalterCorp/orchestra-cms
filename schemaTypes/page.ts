// schemaTypes/page.ts
import { defineField, defineType } from "sanity";

/**
 * ============================================================
 * PAGE (Type unique)
 * ============================================================
 * Un seul type "page" pour tout le site (réplicabilité).
 * - Champs communs (SEO + Hero)
 * - Sections spécifiques (Accueil, Cabinet...)
 * - Studio lisible via fieldsets repliables
 */

/**
 * Portable Text block réutilisable
 * - Ajoute le bouton "Highlight" dans le Studio
 * - Le front mappe le mark "highlight" -> texte sky
 */
const richTextBlock = {
  type: "block",
  marks: {
    decorators: [{ title: "Highlight", value: "highlight" }],
  },
};

export const page = defineType({
  name: "page",
  title: "📄 Page",
  type: "document",

  // ============================================================
  // FIELDSETS (organisation visuelle Studio)
  // ============================================================
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
      name: "home",
      title: "🏠 Accueil",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "cabinet",
      title: "🏛️ Cabinet",
      options: { collapsible: true, collapsed: true },
    },
  ],

  fields: [
    // ============================================================
    // 🧭 IDENTITÉ & SEO
    // ============================================================

    defineField({
      name: "title",
      title: "Titre interne",
      type: "string",
      fieldset: "identity",
      description:
        "Titre interne pour l’admin (peut être différent du titre affiché sur la page).",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "identity",
      description: "Identifiant URL unique (ex : 'accueil', 'cabinet').",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO — Title",
      type: "string",
      fieldset: "identity",
      description: "Balise <title>. Laisser vide si non utilisé.",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO — Description",
      type: "text",
      rows: 3,
      fieldset: "identity",
      description: "Meta description. Laisser vide si non utilisé.",
    }),

    // ============================================================
    // 🚀 HERO (commun à toutes les pages)
    // ============================================================

    defineField({
      name: "hero",
      title: "Bloc Hero",
      type: "object",
      fieldset: "hero",
      fields: [
        defineField({
          name: "badgeEmoji",
          title: "Badge — Emoji",
          type: "string",
        }),
        defineField({
          name: "badgeText",
          title: "Badge — Texte",
          type: "string",
        }),

        defineField({
          name: "titleRich",
          title: "Titre (rich)",
          type: "array",
          of: [richTextBlock],
        }),

        defineField({
          name: "descriptionRich",
          title: "Description (rich)",
          type: "array",
          of: [richTextBlock],
        }),

        defineField({
          name: "primaryCtaLabel",
          title: "CTA primaire — label",
          type: "string",
        }),
        defineField({
          name: "primaryCtaHref",
          title: "CTA primaire — lien",
          type: "string",
        }),
        defineField({
          name: "secondaryCtaLabel",
          title: "CTA secondaire — label",
          type: "string",
        }),
        defineField({
          name: "secondaryCtaHref",
          title: "CTA secondaire — lien",
          type: "string",
        }),
      ],
    }),

    // ============================================================
    // 🏠 ACCUEIL
    // ============================================================

    defineField({
      name: "homeSections",
      title: "Sections Accueil",
      type: "object",
      fieldset: "home",
      fields: [
        // Notre approche
        defineField({
          name: "approach",
          title: "✨ Notre approche",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Titre (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "content",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        // ORCHESTRA — noyau IA
        defineField({
          name: "orchestraCore",
          title: "🤖 ORCHESTRA — Noyau IA",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Titre (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "content",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
            }),

            defineField({
              name: "pillars",
              title: "🧱 Piliers (4)",
              type: "array",
              description: "Exactement 4 éléments pour conserver le layout.",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icône (emoji)",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "line1",
                      title: "Ligne 1",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "line2",
                      title: "Ligne 2",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
          ],
        }),

        // La place de l'humain
        defineField({
          name: "humanPlace",
          title: "👤 La place de l’humain",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Titre (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "intro",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),

            defineField({
              name: "cards",
              title: "🃏 Cartes (3)",
              description: "Exactement 3 éléments pour conserver le layout.",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icône",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "title",
                      title: "Titre",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "text",
                      title: "Texte",
                      type: "text",
                      rows: 3,
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                },
              ],
              validation: (Rule) => Rule.min(3).max(3),
            }),

            defineField({
              name: "outro",
              title: "Texte final (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "homeCta",
      title: "🎯 CTA final Accueil",
      type: "object",
      fieldset: "home",
      fields: [
        defineField({
          name: "titleRich",
          title: "Titre (rich)",
          type: "array",
          of: [richTextBlock],
        }),
        defineField({
          name: "textRich",
          title: "Texte (rich)",
          type: "array",
          of: [richTextBlock],
        }),
        defineField({ name: "primaryLabel", title: "CTA primaire — label", type: "string" }),
        defineField({ name: "primaryHref", title: "CTA primaire — lien", type: "string" }),
        defineField({ name: "secondaryLabel", title: "CTA secondaire — label", type: "string" }),
        defineField({ name: "secondaryHref", title: "CTA secondaire — lien", type: "string" }),
      ],
    }),

    // ============================================================
    // 🏛️ CABINET
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
            defineField({ name: "titleRich", title: "Titre (rich)", type: "array", of: [richTextBlock] }),
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlock] }),
          ],
        }),
        defineField({
          name: "human",
          title: "🤝 Humain",
          type: "object",
          fields: [
            defineField({ name: "titleRich", title: "Titre (rich)", type: "array", of: [richTextBlock] }),
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlock] }),
          ],
        }),
        defineField({
          name: "ai",
          title: "🧠 IA",
          type: "object",
          fields: [
            defineField({ name: "titleRich", title: "Titre (rich)", type: "array", of: [richTextBlock] }),
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({ name: "content", title: "Texte (rich)", type: "array", of: [richTextBlock] }),
          ],
        }),
      ],
    }),

    defineField({
      name: "cabinetCta",
      title: "🎯 CTA final Cabinet",
      type: "object",
      fieldset: "cabinet",
      fields: [
        defineField({ name: "titleRich", title: "Titre (rich)", type: "array", of: [richTextBlock] }),
        defineField({ name: "textRich", title: "Texte (rich)", type: "array", of: [richTextBlock] }),
        defineField({ name: "primaryLabel", title: "CTA primaire — label", type: "string" }),
        defineField({ name: "primaryHref", title: "CTA primaire — lien", type: "string" }),
        defineField({ name: "secondaryLabel", title: "CTA secondaire — label", type: "string" }),
        defineField({ name: "secondaryHref", title: "CTA secondaire — lien", type: "string" }),
      ],
    }),
  ],
});