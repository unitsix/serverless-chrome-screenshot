const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    externals: [nodeExternals()],
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
            },
        }, ],
    },
    resolve: {
        symlinks: true,
    },
    output: {
        libraryTarget: 'commonjs',
        path: `${__dirname}/.webpack`,
        filename: '[name].js',
    },
    stats: 'minimal',
    target: 'node',
};