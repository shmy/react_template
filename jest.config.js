module.exports = {
	moduleFileExtensions: [
		"js",
		"ts",
		"tsx"
	],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|svg|bmp|css|scss)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testPathIgnorePatterns: ['<rootDir>/cypress/*']
};
