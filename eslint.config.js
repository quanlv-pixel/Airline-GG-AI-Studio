import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  },
  ...tseslint.configs.recommended,
  {
    files: ['firestore.rules', 'DRAFT_firestore.rules'],
    ...firebaseRulesPlugin.configs['flat/recommended']
  }
];
