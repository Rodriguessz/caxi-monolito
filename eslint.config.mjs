import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // web/ é um projeto à parte, com as próprias ferramentas
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'web/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
);
