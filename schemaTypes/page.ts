// orchestra-cms/schemaTypes/page.ts

import { defineField, defineType } from "sanity";

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

/**
 * Helper: titleLines pour titres multi-lignes (cards, etc.)
 * Exemple : ["Conserver une lecture", "humaine, pragmatique et", "responsable"]
 */
const titleLinesField = defineField({
  name: "titleLines",
  title: "Titre (lignes)",
  type: "array",
  of: [{ type: "string" }],
  description:
    "Chaque élément = une ligne. Permet de reproduire les titres multi-lignes du front sans PortableText.",
  validation: (Rule) => Rule.min(1).max(4),
});

/**
 * Helper: titre de section en rich text (requis)
 */
const sectionTitleRichFieldRequired = defineField({
  name: "titleRich",
  title: "Titre (rich)",
  type: "array",
  of: [richTextBlock],
  validation: (Rule) => Rule.required().min(1),
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

    // ✅ Expertises
    {
      name: "expertises",
      title: "🧩 Expertises",
      options: { collapsible: true, collapsed: true },
    },

    // ✅ FAQ
    {
      name: "faq",
      title: "❓ FAQ",
      options: { collapsible: true, collapsed: true },
    },
  ],

  fields: [
    // ============================================================
    // IDENTITÉ & SEO
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
      title: "SEO — Title",
      type: "string",
      fieldset: "identity",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO — Description",
      type: "text",
      rows: 3,
      fieldset: "identity",
    }),

    // ============================================================
    // HERO (commun)
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
    // CTA FINAL (commun)
    // ============================================================
    defineField({
      name: "finalCta",
      title: "CTA final (commun)",
      type: "object",
      fieldset: "finalCta",
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
        defineField({
          name: "primaryLabel",
          title: "CTA primaire — label",
          type: "string",
        }),
        defineField({
          name: "primaryHref",
          title: "CTA primaire — lien",
          type: "string",
        }),
        defineField({
          name: "secondaryLabel",
          title: "CTA secondaire — label",
          type: "string",
        }),
        defineField({
          name: "secondaryHref",
          title: "CTA secondaire — lien",
          type: "string",
        }),
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
            defineField({
              name: "titleRich",
              title: "Titre (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({
              name: "content",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),
        defineField({
          name: "human",
          title: "🤝 Humain",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Titre (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({
              name: "content",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),
        defineField({
          name: "ai",
          title: "🧠 IA",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Titre (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({
              name: "content",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),
      ],
    }),

    // ============================================================
    // MÉTHODE ORCHESTRA (inchangé)
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
            sectionTitleRichFieldRequired,
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({
              name: "contentRich",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        defineField({
          name: "why",
          title: "❓ Pourquoi ORCHESTRA",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "label",
              title: "Label (string)",
              type: "string",
            }),
            defineField({
              name: "pillars",
              title: "🃏 Cartes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
            defineField({
              name: "outroRich",
              title: "Texte final (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        defineField({
          name: "core",
          title: "🧠 Composition du noyau ORCHESTRA",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "label",
              title: "Label (string)",
              type: "string",
            }),
            defineField({
              name: "bubbles",
              title: "🫧 Bulles (layout 3 + 2)",
              type: "object",
              fields: [
                defineField({
                  name: "line1",
                  title: "Ligne 1 (3 bulles)",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      fields: [
                        defineField({
                          name: "icon",
                          title: "Icône",
                          type: "string",
                        }),
                        defineField({
                          name: "title",
                          title: "Titre",
                          type: "string",
                        }),
                        defineField({
                          name: "text",
                          title: "Texte",
                          type: "text",
                          rows: 4,
                        }),
                      ],
                    },
                  ],
                  validation: (Rule) => Rule.min(3).max(3),
                }),
                defineField({
                  name: "line2",
                  title: "Ligne 2 (2 bulles)",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      fields: [
                        defineField({
                          name: "icon",
                          title: "Icône",
                          type: "string",
                        }),
                        defineField({
                          name: "title",
                          title: "Titre",
                          type: "string",
                        }),
                        defineField({
                          name: "text",
                          title: "Texte",
                          type: "text",
                          rows: 4,
                        }),
                      ],
                    },
                  ],
                  validation: (Rule) => Rule.min(2).max(2),
                }),
              ],
            }),
            defineField({
              name: "outroRich",
              title: "Texte final (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        defineField({
          name: "human",
          title: "👤 Le rôle central de l’humain",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "label",
              title: "Label (string)",
              type: "string",
            }),
            defineField({
              name: "cards",
              title: "🃏 Cartes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
            defineField({
              name: "outroRich",
              title: "Texte final (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        defineField({
          name: "workflow",
          title: "⚙️ Fonctionnement global",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "steps",
              title: "🃏 Étapes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
            defineField({
              name: "outroRich",
              title: "Texte final (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        defineField({
          name: "benefits",
          title: "📈 Bénéfices pour le client",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "cards",
              title: "🃏 Cartes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
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
        // 1) Principles
        defineField({
          name: "principles",
          title: "🧱 Principes de notre approche",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "cards",
              title: "🃏 Cartes (3)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(3).max(3),
            }),
            defineField({
              name: "outroRich",
              title: "Texte final (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        // 2) Process (✅ version finale stable)
        defineField({
          name: "process",
          title: "🧭 Déroulement d’un accompagnement",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),

            defineField({
              name: "steps",
              title: "🧩 Étapes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    // icon optionnel (évite emojis fantômes)
                    defineField({
                      name: "icon",
                      title: "Icône (emoji) — optionnel",
                      type: "string",
                    }),

                    // titre contrôlé (layout)
                    defineField({
                      name: "titleLines",
                      title: "Titre (lignes)",
                      type: "array",
                      of: [{ type: "string" }],
                      validation: (Rule) => Rule.required().min(1).max(2),
                      description: "Chaque élément = une ligne (max 2).",
                    }),

                    // bloc haut
                    defineField({
                      name: "topRich",
                      title: "Bloc haut (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                    }),

                    // label (rich)
                    defineField({
                      name: "labelRich",
                      title: "Label (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                      description:
                        "Ex: “ORCHESTRA intervient pour :” ou “Les experts humains sont là pour :” (support Highlight).",
                    }),

                    // bloc bas
                    defineField({
                      name: "bottomRich",
                      title: "Bloc bas (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                    }),

                    // outro (rich)
                    defineField({
                      name: "outroRich",
                      title: "Outro (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                    }),
                  ],

                  // ✅ Validation : éviter carte vide
                  validation: (Rule) =>
                    Rule.custom((value: any) => {
                      if (!value) return true;
                      const hasTop =
                        Array.isArray(value.topRich) && value.topRich.length > 0;
                      const hasBottom =
                        Array.isArray(value.bottomRich) &&
                        value.bottomRich.length > 0;
                      const hasOutro =
                        Array.isArray(value.outroRich) && value.outroRich.length > 0;
                      const hasAny = hasTop || hasBottom || hasOutro;
                      return hasAny
                        ? true
                        : "Ajoute au moins un contenu (topRich, bottomRich ou outroRich).";
                    }),
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
          ],
        }),

        // 3) Orchestra place
        defineField({
          name: "orchestraPlace",
          title: "🤖 Place d’ORCHESTRA dans le processus",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),

            // ✅ label rich (support highlight)
            defineField({
              name: "labelRich",
              title:
                "Label (rich) (ex: Chaque production issue d’ORCHESTRA est :)",
              type: "array",
              of: [richTextBlock],
            }),

            defineField({
              name: "cards",
              title: "🃏 Cartes (3)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(3).max(3),
            }),
          ],
        }),

        // 4) Client benefits
        defineField({
          name: "clientBenefits",
          title: "📈 Ce que cela change pour le client",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "cards",
              title: "🃏 Cartes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
          ],
        }),
      ],
    }),

    // ============================================================
    // EXPERTISES  ✅ AJOUT COMPLET
    // ============================================================
    defineField({
      name: "expertisesSections",
      title: "Sections Expertises",
      type: "object",
      fieldset: "expertises",
      fields: [
        // 1) Approach
        defineField({
          name: "approach",
          title: "✨ Notre approche",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "contentRich",
              title: "Contenu (rich)",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        // 2) Domains (BigCards)
        defineField({
          name: "domains",
          title: "🧱 Domaines d’expertise",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich) — optionnel",
              type: "array",
              of: [richTextBlock],
            }),

            defineField({
              name: "cards",
              title: "🧩 Cartes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icône (emoji) — optionnel",
                      type: "string",
                    }),

                    defineField({
                      name: "titleLines",
                      title: "Titre (lignes)",
                      type: "array",
                      of: [{ type: "string" }],
                      validation: (Rule) => Rule.required().min(1).max(2),
                      description: "Chaque élément = une ligne (max 2).",
                    }),

                    defineField({
                      name: "topRich",
                      title: "Bloc haut (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                    }),

                    defineField({
                      name: "labelRich",
                      title: "Label (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                      description:
                        "Ex: “ORCHESTRA intervient pour :” (support Highlight).",
                    }),

                    defineField({
                      name: "bottomRich",
                      title: "Bloc bas (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                      description:
                        "Peut contenir une liste à puces (bullet list) pour reproduire les bullets.",
                    }),

                    defineField({
                      name: "outroRich",
                      title: "Outro (rich) — optionnel",
                      type: "array",
                      of: [richTextBlock],
                    }),
                  ],

                  validation: (Rule) =>
                    Rule.custom((value: any) => {
                      if (!value) return true;
                      const hasTop =
                        Array.isArray(value.topRich) && value.topRich.length > 0;
                      const hasBottom =
                        Array.isArray(value.bottomRich) &&
                        value.bottomRich.length > 0;
                      const hasOutro =
                        Array.isArray(value.outroRich) && value.outroRich.length > 0;
                      const hasAny = hasTop || hasBottom || hasOutro;
                      return hasAny
                        ? true
                        : "Ajoute au moins un contenu (topRich, bottomRich ou outroRich).";
                    }),
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),

            defineField({
              name: "changeBand",
              title: "🏷️ Bandeau — Accompagnement au changement",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Titre (string)",
                  type: "string",
                }),
                defineField({
                  name: "textRich",
                  title: "Texte (rich)",
                  type: "array",
                  of: [richTextBlock],
                }),
              ],
            }),
          ],
        }),

        // 3) Orchestra support
        defineField({
          name: "orchestraSupport",
          title: "🤖 Comment ORCHESTRA soutient",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "introRich",
              title: "Intro (rich)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "labelRich",
              title: "Label (rich) (ex: Il permet :)",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "cards",
              title: "🃏 Cartes (3)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(3).max(3),
            }),
            defineField({
              name: "outroRich",
              title: "Outro (rich) — optionnel",
              type: "array",
              of: [richTextBlock],
            }),
          ],
        }),

        // 4) Audiences
        defineField({
          name: "audiences",
          title: "👥 Pour qui",
          type: "object",
          fields: [
            sectionTitleRichFieldRequired,
            defineField({
              name: "labelRich",
              title: "Label (rich) — optionnel",
              type: "array",
              of: [richTextBlock],
            }),
            defineField({
              name: "cards",
              title: "🃏 Cartes (4)",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "icon", title: "Icône", type: "string" }),
                    titleLinesField,
                  ],
                },
              ],
              validation: (Rule) => Rule.min(4).max(4),
            }),
          ],
        }),
      ],
    }),

    // ============================================================
    // FAQ  ✅ AJOUT
    // ============================================================
    defineField({
      name: "faqSections",
      title: "Sections FAQ",
      type: "object",
      fieldset: "faq",
      fields: [
        defineField({
          name: "titleRich",
          title: "Titre (rich)",
          type: "array",
          of: [richTextBlock],
          validation: (Rule) => Rule.required().min(1),
        }),

        defineField({
          name: "introRich",
          title: "Intro (rich) — optionnel",
          type: "array",
          of: [richTextBlock],
        }),

        defineField({
          name: "items",
          title: "❓ Questions / réponses",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "question",
                  title: "Question",
                  type: "string",
                  validation: (Rule) => Rule.required().min(5),
                }),
                defineField({
                  name: "answerRich",
                  title: "Réponse (rich)",
                  type: "array",
                  of: [richTextBlock],
                  validation: (Rule) => Rule.required().min(1),
                }),
              ],
            },
          ],
          validation: (Rule) => Rule.min(1),
        }),

        defineField({
          name: "conviction",
          title: "🏷️ Bandeau conviction — optionnel",
          type: "object",
          fields: [
            defineField({
              name: "badgeEmoji",
              title: "Badge — Emoji (optionnel)",
              type: "string",
            }),
            defineField({
              name: "textRich",
              title: "Texte (rich)",
              type: "array",
              of: [richTextBlock],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        }),
      ],
    }),
  ],
});