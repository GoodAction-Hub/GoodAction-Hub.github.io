import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    settings: { react: { version: '19.0' } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
