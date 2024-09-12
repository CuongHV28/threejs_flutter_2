const path = require('path');
const webpack = require('webpack'); // Import webpack

module.exports = {
    entry: path.resolve(__dirname, 'assets/threejs-house/compiled/index.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules|\.js\.map$/, // Exclude .js.map files
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            'threejs-house': path.resolve(__dirname, 'assets/threejs-house/')
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'assets/threejs-house/'),
        library: 'ThreejsHouse', // Expose the library to the global scope
        libraryTarget: 'umd', // Universal Module Definition
        globalObject: 'this' // Ensure compatibility with different environments
    },
    mode: 'production', // Set mode to production
    devtool: 'source-map', // Use source-map for better readability
};