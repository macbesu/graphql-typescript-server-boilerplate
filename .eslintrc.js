module.exports = {
  "extends": "eslint:recommended",
  "rules": {
    "no-console": ["error", {
      "allow": ["warn", "error", "info"]
    }]
  },
  "env": {
    "node": true,
    "es6": true,
    "mocha": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "script"
  },
  "globals": {}
};