module.exports = {
  extends: ['plugin:xt-react/recommended'],
  plugins: [],
  env: {
    jest: true
  },
  globals: {
    APP: true,
    Moon: true,
    BUILD_TIME: true,
    Observer: true,
    __ENV__: true
  },
  rules: {
    "react/prop-types": 1,
    "react/no-find-dom-node": 1,
    'react/prop-types': 1
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
};
