module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'script'
    },
    globals: {
        'ZKyNet': 'readonly',
        'ZKyNetDebug': 'readonly',
        'enableZKyNetDebug': 'readonly'
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'prefer-const': 'error',
        'no-var': 'error'
    }
};