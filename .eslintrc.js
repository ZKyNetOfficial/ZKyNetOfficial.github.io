module.exports = {
    env: {
        browser: true,
        es2022: true,
        node: false
    },
    extends: [
        'eslint:recommended',
        'prettier'
    ],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'script'
    },
    globals: {
        // ZKyNet global functions
        ZKyNet: 'readonly',
        ZKyNetDebug: 'writable',
        enableZKyNetDebug: 'readonly',
        // Error handling globals
        errorHandler: 'readonly'
    },
    rules: {
        // === ENHANCED STYLE STANDARDS ===
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'space-before-function-paren': ['error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'keyword-spacing': ['error', { 'before': true, 'after': true }],
        'space-infix-ops': 'error',
        'comma-spacing': ['error', { 'before': false, 'after': true }],

        // === ENHANCED VARIABLE STANDARDS ===
        'no-var': 'error',
        'prefer-const': ['error', { 'destructuring': 'all' }],
        'no-unused-vars': ['error', { 
            'vars': 'all', 
            'args': 'after-used',
            'ignoreRestSiblings': false,
            'argsIgnorePattern': '^_'
        }],
        'no-undef': 'error',
        'no-implicit-globals': 'error',

        // === ENHANCED FUNCTION STANDARDS ===
        'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
        'prefer-arrow-callback': ['error', { 'allowNamedFunctions': true }],
        'arrow-spacing': ['error', { 'before': true, 'after': true }],
        'no-unused-expressions': ['error', { 
            'allowShortCircuit': true, 
            'allowTernary': true 
        }],

        // === ENHANCED ERROR HANDLING STANDARDS ===
        'no-throw-literal': 'error',
        'prefer-promise-reject-errors': 'error',
        'no-return-await': 'error',
        'require-await': 'warn',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'warn',

        // === ENHANCED DEBUGGING STANDARDS ===
        'no-console': ['warn', { 
            'allow': ['warn', 'error', 'info', 'group', 'groupEnd'] 
        }],
        'no-debugger': 'error',
        'no-alert': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',

        // === ENHANCED DOM STANDARDS ===
        'no-global-assign': 'error',
        'no-implicit-coercion': ['error', { 'allow': ['!!'] }],
        'eqeqeq': ['error', 'always', { 'null': 'ignore' }],

        // === ENHANCED SECURITY STANDARDS ===
        'no-script-url': 'error',
        'no-proto': 'error',
        'no-iterator': 'error',

        // === ENHANCED PERFORMANCE STANDARDS ===
        'no-loop-func': 'error',
        'no-inner-declarations': ['error', 'both'],
        'no-redeclare': ['error', { 'builtinGlobals': true }],

        // === ENHANCED CODE ORGANIZATION ===
        'one-var': ['error', 'never'],
        'operator-linebreak': ['error', 'before'],
        'padded-blocks': ['error', 'never'],
        'space-before-blocks': 'error',
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],

        // === ENHANCED NAMING CONVENTIONS ===
        'camelcase': ['error', { 
            'properties': 'always',
            'ignoreDestructuring': false,
            'ignoreImports': false,
            'allow': ['^[A-Z_][A-Z0-9_]*$'] // Allow CONSTANTS
        }],
        'new-cap': ['error', { 'newIsCap': true, 'capIsNew': false }],

        // === ENHANCED BEST PRACTICES ===
        'curly': ['error', 'all'],
        'dot-notation': 'error',
        'no-else-return': ['error', { 'allowElseIf': false }],
        'no-empty-function': ['error', { 'allow': ['constructors'] }],
        'no-magic-numbers': ['warn', { 
            'ignore': [0, 1, -1, 2, 10, 100, 1000],
            'ignoreArrayIndexes': true,
            'detectObjects': false
        }],
        'no-multi-spaces': 'error',
        'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
        'no-trailing-spaces': 'error',
        'prefer-template': 'error',
        'template-curly-spacing': ['error', 'never'],

        // === PROJECT-SPECIFIC STANDARDS ===
        // Enforce consistent error handling patterns
        'consistent-return': 'error',
        
        // Require JSDoc for public functions (warn level for gradual adoption)
        'valid-jsdoc': ['warn', {
            'requireReturn': false,
            'requireReturnDescription': false,
            'requireParamDescription': true
        }],

        // === ACCESSIBILITY STANDARDS ===
        'no-restricted-properties': ['error', {
            'object': 'document',
            'property': 'write',
            'message': 'Use modern DOM methods instead of document.write'
        }],

        // === PRETTIER INTEGRATION ===
        'prettier/prettier': ['error', {
            'semi': true,
            'singleQuote': true,
            'tabWidth': 4,
            'trailingComma': 'none',
            'printWidth': 100
        }]
    },
    
    // === PROJECT-SPECIFIC OVERRIDES ===
    overrides: [
        {
            // More lenient rules for debug/development code
            files: ['**/debug.js', '**/*debug*.js'],
            rules: {
                'no-console': 'off',
                'no-magic-numbers': 'off',
                'no-unused-vars': 'warn'
            }
        },
        {
            // Stricter rules for main application code
            files: ['src/assets/js/main.js', 'src/assets/js/contact.js'],
            rules: {
                'complexity': ['warn', 10],
                'max-depth': ['warn', 4],
                'max-statements': ['warn', 25],
                'no-magic-numbers': 'error'
            }
        }
    ],

    // === IGNORE PATTERNS ===
    ignorePatterns: [
        'dist/',
        'node_modules/',
        '*.min.js',
        'testing/',
        'tmp/'
    ]
};