module.exports = {
  '*.{js,ts}': ['eslint --fix', 'prettier --write', 'jest --bail --findRelatedTests'],
  '*.{json,md}': ['prettier --write'],
};
