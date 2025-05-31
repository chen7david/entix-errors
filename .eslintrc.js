module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  env: {
    node: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'max-params': ['error', 2],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'prettier/prettier': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../'],
            message: 'Use path aliases (@src/, @utils/, etc.) instead of relative paths with ../.',
          },
          {
            group: ['./'],
            message: 'Use path aliases (@src/, @utils/, etc.) instead of relative paths with ./.',
          },
        ],
      },
    ],
    'jest/no-focused-tests': 'error',
    'jest/no-disabled-tests': 'error',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
