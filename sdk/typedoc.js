module.exports = {
    entryPoints: [
        './source/index.ts'
    ],
    name: '@prebenorwegian/sdk',
    excludeExternals: false,
    includeVersion: true,
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    excludePrivate: true,
    excludeProtected: true,
    disableSources: true,
    out: './docs/html'
};