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
            { name: "heroTitle", type: "text", required: true },
            { name: "heroSubtitle", type: "text" },
            { name: "heroText", type: "textarea" },
            { name: "ctaText", type: "text" },
            { name: "ctaLink", type: "text" },
            { name: "heroImageUrl", type: "text" },
          ],
        },
        {
          label: "About Section",
          fields: [
            { name: "aboutTitle", type: "text" },
            { name: "aboutText", type: "textarea" },
            { name: "aboutCTAText", type: "text" },
            { name: "aboutCTALink", type: "text" },
            { name: "aboutImageUrl", type: "text" },
          ],
        },
        {
          label: "Why Take Quiz",
          fields: [
            { name: "whyTitle", type: "text" },
            { name: "whyText", type: "textarea" },
          ],
        },
        {
          label: "Discover Your Path",
          fields: [
            { name: "discoverTitle", type: "text" },
            { name: "discoverText", type: "textarea" },
            { name: "discoverCTA", type: "text" },
            { name: "discoverCTALink", type: "text" },
          ],
        },
      ],
    },
  ],
};
