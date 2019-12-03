module.exports = {
  extends: process.env.PUB_ENV ? ['react-app'] : ['react-app', 'prettier'],
  plugins: process.env.PUB_ENV ? [] : ['prettier'],
  globals: {
    APP: true
  },
  rules: process.env.PUB_ENV
    ? {}
    : {
        'prettier/prettier': [
          'warn',
          {
            singleQuote: true,
            trailingComma: 'none',
            printWidth: 120,
            proseWrap: 'never',
            overrides: [
              {
                files: '.prettierrc',
                options: {
                  parser: 'json'
                }
              }
            ]
          }
        ]
      },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
};
