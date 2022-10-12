module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-restricted-syntax': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    'consistent-return': 0,
    'no-nested-ternary': 0,
  },
};
