export default {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: [
    '@prettier/plugin-xml',
    'prettier-plugin-packagejson',
    'prettier-plugin-properties',
    'prettier-plugin-sh',
    'prettier-plugin-toml',
  ],
  overrides: [
    {
      files: 'package.json',
      options: {
        parser: 'json-stringify',
      },
    },
    {
      files: '*.xml',
      options: {
        parser: 'xml',
      },
    },
    {
      files: '*.properties',
      options: {
        parser: 'properties',
      },
    },
    {
      files: ['*.sh', '.bashrc', '.bash_profile', '.bash_aliases', '.zshrc'],
      options: {
        parser: 'sh',
      },
    },
    {
      files: '*.toml',
      options: {
        parser: 'toml',
      },
    },
  ],
};
