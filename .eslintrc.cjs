module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	rules: {
		'class-methods-use-this': 'off',
		'func-names': 'off',
		'linebreak-style': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		indent: [
			'error',
			'tab',
		],
		'max-len': 'off',
		'no-await-in-loop': 'off',
		'no-continue': 'off',
		'no-param-reassign': 'off',
		'no-plusplus': 'off',
		'no-restricted-syntax': [
			'error',
			'WithStatement',
		],
		'no-shadow': 'off',
		'no-tabs': 'off',
		'no-undef': 'off',
		'prefer-arrow-callback': 'off',
		'@typescript-eslint/no-unsafe-declaration-merging': 'off',
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: [
					'.ts',
					'.js',
				],
			},
		},
	},
};
