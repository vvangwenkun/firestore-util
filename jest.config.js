module.exports = {
    testEnvironment: 'node',
    testTimeout: 60 * 1000,
    clearMocks: true,
    collectCoverage: false,
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.vscode/',
    ],
    setupFiles: [
        './__tests__/bootstrap.js',
    ],
    modulePathIgnorePatterns: [
        'bootstrap.js',
    ],
}
