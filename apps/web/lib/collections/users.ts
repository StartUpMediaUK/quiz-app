import { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    read: () => false,
  },
  fields: [{ name: "name", type: "text" }],
};
