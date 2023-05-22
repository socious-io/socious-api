module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parser: '@babel/eslint-parser',
  plugins: [
    'jest',
    'typelint'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'typelint/typelint': 2
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'no-unused-vars': 0,
      },
    },
    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }]
      },
    },
  ]
}
