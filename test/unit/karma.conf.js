// Karma configuration
// Generated on Sat Mar 18 2017 14:56:01 GMT+0800 (中国标准时间)
const path = require('path')
const srcPath = path.resolve(__dirname, '../../src')

module.exports = function(config) {
    config.set({
        webpack: {
            devtool: 'inline-source-map',//'#source-map',
            resolve: {
                alias: {
                    '@': srcPath
                }
            },
            module: {
                rules: [
                    {
                        test: /\.js/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015']
                            }
                        }
                    },
                    {
                        test: /\.js/,
                        use: 'istanbul-instrumenter-loader',
                        include: [srcPath],
                        exclude: /(node_modules|\.spec\.js$)/
                    }
                ]
            }
        },
        frameworks: ['mocha', 'sinon-chai'],
        files: [
            './index.js'
        ],
        exclude: [],
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage-istanbul'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity,
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text-summary'],
            dir: path.join(__dirname, 'coverage'),
            fixWebpackSourcePaths: true,
            'report-config': {
                html: {
                    subdir: 'html'
                }

            }
        }
    })
}
