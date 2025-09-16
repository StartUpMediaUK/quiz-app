import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from "payload";

import { Home } from "./lib/collections/home";
import { Users } from "./lib/collections/users";

export default buildConfig({
  serverURL:
    (process.env.NEXT_PUBLIC_APP_URL ?? process.env.NODE_ENV === "development")
      ? "http://localhost:3001"
      : "https://admin.fearless.nerissagolden.com",
  editor: lexicalEditor(),
  collections: [Home, Users],
  secret: process.env.PAYLOAD_SECRET || "",
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
});
