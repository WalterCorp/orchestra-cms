// schemaTypes/page.ts
import { defineType, defineField } from "sanity";

/**
 * Portable Text with a custom "highlight" decorator.
 * In the editor: select text => click Highlight => frontend renders sky-400.
 */
const portableTextWithHighlight = {
  type: "array",
  of: [
    {
      type: "block",
      marks: {
        decorators: [{ title: "Highlight", value: "highlight" }],
      },
    },
  ],
};

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",

  fields: [
    // --------------------------------------------------
    // Base fields
    // --------------------------------------------------
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    }),

    // --------------------------------------------------
    // CABINET — Hero
    // --------------------------------------------------
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "badgeEmoji",
          title: "Badge Emoji",
          type: "string",
          description: "Ex: 🤖",
        }),
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
          description: "Ex: Conseil augmenté par l’IA",
        }),

        defineField({
          name: "titleRich",
          title: "Hero Title (rich)",
          ...portableTextWithHighlight,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "descriptionRich",
          title: "Hero Description (rich)",
          ...portableTextWithHighlight,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "primaryCtaLabel",
          title: "Primary CTA label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "primaryCtaHref",
          title: "Primary CTA href",
          type: "string",
          description: 'Ex: "/methode-orchestra"',
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "secondaryCtaLabel",
          title: "Secondary CTA label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "secondaryCtaHref",
          title: "Secondary CTA href",
          type: "string",
          description: 'Ex: "/contact"',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // --------------------------------------------------
    // CABINET — 3 sections
    // --------------------------------------------------
    defineField({
      name: "cabinetSections",
      title: "Cabinet — Sections",
      type: "object",
      fields: [
        defineField({
          name: "vision",
          title: "Vision du Cabinet",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Title (rich)",
              ...portableTextWithHighlight,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "emoji",
              title: "Emoji",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Content (rich)",
              ...portableTextWithHighlight,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),

        defineField({
          name: "human",
          title: "Place de l’humain",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Title (rich)",
              ...portableTextWithHighlight,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "emoji",
              title: "Emoji",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Content (rich)",
              ...portableTextWithHighlight,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),

        defineField({
          name: "ai",
          title: "Usage encadré de l’IA",
          type: "object",
          fields: [
            defineField({
              name: "titleRich",
              title: "Title (rich)",
              ...portableTextWithHighlight,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "emoji",
              title: "Emoji",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Content (rich)",
              ...portableTextWithHighlight,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    // --------------------------------------------------
    // CABINET — CTA block
    // --------------------------------------------------
    defineField({
      name: "cabinetCta",
      title: "Cabinet — Bloc CTA",
      type: "object",
      fields: [
        defineField({
          name: "titleRich",
          title: "Title (rich)",
          ...portableTextWithHighlight,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "textRich",
          title: "Text (rich)",
          ...portableTextWithHighlight,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "primaryLabel",
          title: "Primary button label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "primaryHref",
          title: "Primary button href",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "secondaryLabel",
          title: "Secondary button label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "secondaryHref",
          title: "Secondary button href",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});
