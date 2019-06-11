const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const API_URL = process.env.API_URL || 'http://10.1.1.201/api_rentas/rest';
const ENV_NAME = process.env.ENV_NAME || 'local';
const BASE_URL = process.env.BASE_URL || '/autogestion/';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/autogestion/';
const DEV_SERVER_PORT = 3110;
const MODO_ANONIMO = process.env.MODO_ANONIMO || true;

const GLOBALS = { // @TODO - read this from a .env
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    '__GLOBALS__': {
        NODE_ENV: JSON.stringify(nodeEnv),
        __DEV__: !isProduction,
        API_URL: JSON.stringify(API_URL),
        ENV_NAME: JSON.stringify(ENV_NAME),
        BASE_URL: isProduction ? JSON.stringify(BASE_URL) : JSON.stringify('/'),
        PUBLIC_PATH: isProduction ? PUBLIC_PATH : './',
        MODO_ANONIMO : isProduction ? MODO_ANONIMO : true,
    }
};
console.log("GLOBALS", GLOBALS);

// add modules you need from node-modules here - it's just to optimize hot-reloading as it separates files
const VENDORS = [
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'react-block-ui',
    'axios',
    'redux',
    'redux-actions',
    'redux-thunk',
];


module.exports.baseConfig = (basedir) => {
    // basePath = path.resolve('../' + basePath
    const context = path.resolve(basedir);
    const baseFolder = path.resolve(context, 'src');
    const publicFolder = path.resolve(context, 'public');
    const entryPointApps = path.resolve(baseFolder, 'index');
    const ouputPath = path.resolve(context, 'build');

    return {
        bail: isProduction,
        devtool: isProduction ? 'hidden-source-map' : 'source-map',
        context: context,
        entry: {
            main: entryPointApps,
            vendor: VENDORS
        },
        target: 'web',
        output: {
            filename: '[name]-[hash].js',
            path: ouputPath,
            publicPath: GLOBALS.__GLOBALS__.PUBLIC_PATH
        },
        module: {
            strictExportPresence: true,
            rules: rules(),
        },
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
        // Turn off performance hints during development because we don't do any
        // splitting or minification in interest of speed. These warnings become
        // cumbersome.
        performance: {
            hints: (isProduction && 'warning') || false,
        },
        resolve: {
            extensions: [ '.js', '.jsx'], //'.webpack-loader.js', '.web-loader.js', '.loader.js',
            modules: [
                path.resolve(context, 'node_modules'),
                path.join(context, './src'),
            ],
        },
        plugins: plugins(publicFolder, DEV_SERVER_PORT),
        devServer: {
            contentBase: isProduction ? './build/' + ouputPath : './src',
            publicPath: '/',
            historyApiFallback: true,
            port: DEV_SERVER_PORT - 1,
            compress: isProduction,
            inline: !isProduction,
            hot: !isProduction,
            host: '0.0.0.0',
            // disableHostCheck: true, // make it true in order to test under Virtual Box
            // proxy: { '^/graphql|^/public/**': API_URL },
            stats: {
                assets: true,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                publicPath: false,
                timings: true,
                version: false,
                warnings: true,
                colors: {
                    green: '\u001b[32m',
                },
            },
        }
    };
};


// Common plugins
const plugins = (publicFolder, PORT) => {

    const plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor-[hash].js',
        }),
        new webpack.DefinePlugin(GLOBALS),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            // atatusApiKey: ATATUS_API_KEY,
            template: path.join(publicFolder, 'index.html'),
            chunks: ['vendor', 'main'],
            filename: 'index.html',
        }),
        new ExtractTextPlugin("styles.css"),
        // if you use moment
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ];
    if (isProduction) {
        // Production plugins
        plugins.push(
            // Move common modules into the parent chunk -- not sure if it does anything
            new webpack.optimize.CommonsChunkPlugin({
                names: ["main"],
                children: true,
            }),
            new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 300000 }), // 300kb... before minification
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false,
                },
            })
        );
    } else {
        // Development plugins
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new BrowserSyncPlugin({
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                ghostMode: false,
                proxy: 'http://localhost:' + (PORT - 1) + '/',
                // files: ['public/css/**/*.css', '**/*.php', '!resources/assets/**/*'],
                port: PORT,
                // server: { baseDir: [basePath] }
            }, { reload: false })
        );
    }
    return plugins;
};

// Common rules
const rules = () => {
    const r = [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loaders: 'babel-loader',
            query: {
                plugins: ['transform-decorators-legacy'],
                presets: ['es2015', 'react', 'stage-0'],
                compact: isProduction,
                cacheDirectory: !isProduction
            }
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'file-loader?name=[name].[ext]'
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader?name=public/fonts/[name].[ext]'
        }
    ];
    if (true) {
        r.push({
            test: /(\.css|\.scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader?sourceMap', 'sass-loader']
            })
        })
    }

    return r;
};
