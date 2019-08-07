module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  "extends": [
    'standard',
    "eslint:recommended",
    "plugin:node/recommended-module"
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2019,
    'sourceType': 'module'
  },
  'rules': {
    'no-console': "off"
  }
}
