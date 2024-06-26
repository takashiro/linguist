/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^\\.(.+)\\.js$': '.$1',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
};
