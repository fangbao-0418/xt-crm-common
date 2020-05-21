/*
 * @Date: 2020-04-08 14:12:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 23:01:33
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
    'react/prop-types': 1
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
};
