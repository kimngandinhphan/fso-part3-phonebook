module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        'indent': ['error', 4],
        'no-trailing-spaces': 'error',
        'eqeqeq': 'error',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-unused-vars': 'warn'
    }
}
