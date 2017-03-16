const path = require('path')
const webpack = require('webpack')
const srcPath = path.resolve(__dirname, './src')
const outPath = path.resolve(__dirname, './lib')
const isProd = process.env.NODE_ENV === 'production'
const config = {
    entry: {
        marked: path.resolve(srcPath, './marked.js')
    },
    output: {
        path: outPath,
        library: "marked",
        filename: isProd? "[name].min.js": "[name].js",
        libraryTarget: 'umd'
    },
    devtool: '#source-map',
    resolve: {
        alias: {
            '@': srcPath
        },
        extensions: ['.js']
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.js/,
                use: 'eslint-loader',
                enforce: 'pre',
                include: [srcPath],
                exclude: /node_modules/
            },
            {
                test: /\.js/,
                include: [srcPath],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    }
}
if (isProd) {
    config.devtool = false
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    )
}
module.exports = config
