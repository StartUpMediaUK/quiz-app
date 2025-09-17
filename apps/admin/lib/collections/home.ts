import { CollectionConfig } from 'payload';

export const Home: CollectionConfig = {
  slug: "home",
  labels: { singular: "Homepage", plural: "Homepage" },
  access: {
    read: () => true,
    update: () => true, // only admins
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero Section",
          fields: [
            {
              name: "heroTitle",
              type: "text",
              required: true,
              label: "Hero Title",
            },
            {
              name: "heroSubtitle",
              type: "textarea",
              label: "Hero Subtitle / Description",
            },
            {
              name: "primaryCTA",
              type: "group",
              label: "Primary CTA (Main Button)",
              fields: [
                { name: "text", type: "text", label: "Button Text" },
                { name: "link", type: "text", label: "Button Link" },
              ],
            },
            {
              name: "secondaryCTA",
              type: "group",
              label: "Secondary CTA (Outline Button)",
              fields: [
                { name: "text", type: "text", label: "Button Text" },
                { name: "link", type: "text", label: "Button Link" },
              ],
            },
            {
              name: "heroImage",
              type: "text", // can upgrade to 'upload' if you want Payload file/image uploads
              label: "Hero Image URL",
            },
            {
              name: "badgeText",
              type: "text",
              label: "Badge Text (e.g., 'New Release!')",
            },
          ],
        },
        {
          label: "Features Section",
          fields: [
            { name: "featuresTitle", type: "text", label: "Section Title" },
            {
              name: "featuresSubtitle",
              type: "textarea",
              label: "Section Description",
            },
            {
              name: "features",
              type: "array",
              label: "Feature Items",
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
              ],
            },
            {
              name: "discoverBlock",
              type: "group",
              label: "What You'll Discover",
              fields: [
                { name: "discoverTitle", type: "text", label: "Section Title" },
                {
                  name: "items",
                  type: "array",
                  label: "Discover List Items",
                  fields: [{ name: "text", type: "text" }],
                },
                {
                  name: "testimonial",
                  type: "group",
                  fields: [
                    { name: "quote", type: "textarea" },
                    { name: "author", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Quiz Section",
          fields: [
            {
              name: "quiz",
              label: "Quiz",
              type: "group",
              fields: [
                { name: "quizTitle", type: "text", required: true },
                { name: "quizSubtitle", type: "textarea" },
                { name: "quizHeading", type: "text" }, // e.g. "The Live Fearless Assessment"
                { name: "quizDescription", type: "textarea" },
                {
                  name: "quizBenefits",
                  type: "array",
                  label: "Benefits",
                  fields: [{ name: "text", type: "text" }],
                },
                {
                  name: "quizCTA",
                  type: "group",
                  fields: [
                    { name: "text", type: "text" },
                    { name: "link", type: "text" },
                  ],
                },
                { name: "ctaNote", type: "text", label: "CTA Note" }, // e.g. "Takes only 5 minutes..."
                {
                  name: "quizStats",
                  type: "group",
                  fields: [
                    { name: "duration", type: "text", label: "Duration (e.g. 5 Minutes)" },
                    { name: "questions", type: "text", label: "Number of Questions" },
                    { name: "personalized", type: "text", label: "Personalized Label (e.g. 100% Personalized)" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
