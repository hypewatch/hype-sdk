export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
	testMatch: ['**/__tests__/**/*.test.ts'],
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov'],
	coverageThreshold: {
		global: {
			branches: 25,
			functions: 35,
			lines: 55,
			statements: 55,
		},
	},
}
