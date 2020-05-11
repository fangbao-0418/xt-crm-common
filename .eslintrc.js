/*
 * @Date: 2020-04-08 14:12:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 10:20:17
 * @FilePath: /xt-crm/.eslintrc.js
 */
module.exports = {
  extends: ['plugin:xt-react/recommended'],
  plugins: [],
  globals: {
    APP: true,
    Moon: true
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
};
