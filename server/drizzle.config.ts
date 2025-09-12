import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { url } from './src/db/url.ts';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
});
