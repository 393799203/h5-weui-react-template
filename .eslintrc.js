var production = process.env.NODE_ENV === 'test'

module.exports = {
  'root': true,

  'env': {
    'browser': true,
    'node': true
  },

  'ecmaFeatures': {
    'arrowFunctions': true,
    'destructuring': true,
    'classes': true,
    'defaultParams': true,
    'blockBindings': true,
    'modules': true,
    'objectLiteralComputedProperties': true,
    'objectLiteralShorthandMethods': true,
    'objectLiteralShorthandProperties': true,
    'restParams': true,
    'spread': true,
    'forOf': true,
    'generators': true,
    'templateStrings': true,
    'superInFunctions': true,
    'experimentalObjectRestSpread': true
  },

  'rules': {
    "curly": 0,
    "comma-dangle": [2, "never"],
    "comma-spacing": 0,
    "eqeqeq": [2, "allow-null"],
    "key-spacing": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "no-shadow": 0,
    "no-shadow-restricted-names": 0,
    "no-extend-native": 0,
    "no-var": 2,
    "new-cap": 0,
    "quotes": 0,
    "semi": 0,
    "semi-spacing": 0,
    "space-unary-ops": 0,
    "space-infix-ops": 0,
    "consistent-return": 0,
    "strict": 0
 }
}
