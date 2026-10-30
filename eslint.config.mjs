import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next 16 fournit une config « flat » native : plus de FlatCompat
// (l'ancien `compat.extends("next/...")` plantait avec « Converting circular structure to JSON »)
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    // .history : historique local de l'éditeur ; src/generated : client Prisma généré
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", ".history/**", ".remember/**", "public/**", "src/generated/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": ["warn", {
        "ignoreRestArgs": true
      }]
    }
  }
];

export default eslintConfig;
