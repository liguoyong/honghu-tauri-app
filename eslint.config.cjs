module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/typescript/recommended',
      '@vue/prettier',
      '@vue/prettier/@typescript-eslint',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: require.resolve('@typescript-eslint/parser'),
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
      // 自定义规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // 其他自定义规则
    },
    overrides: [
      {
        files: ['**/*.vue'],
        rules: {
          // Vue 文件特定的规则
        },
      },
      {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
          // TypeScript 文件特定的规则
        },
      },
    ],
  };