import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { files: ["src/app/**/opengraph-image.tsx"], rules: { "@next/next/no-img-element": "off" } },
  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts"]),
]);
