/*
 * @Date: 2020-04-08 14:12:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-20 00:10:51
 * @FilePath: /xt-crm/.eslintrc.js
 */
module.exports = {
  extends: ['plugin:xt-react/recommended'],
  plugins: [],
  globals: {
    APP: true,
    Moon: true,
    BUILD_TIME: true
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
