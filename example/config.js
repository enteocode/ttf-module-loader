'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * Resolves the given path by the current directory root
 *
 * @private
 * @param {...string} localPath
 * @return {string}
 */
const resolve = (... localPath) => path.resolve(__dirname, ... localPath);

/**
 * Most common configuration for basics
 *
 * @public
 * @type {Object}
 */
module.exports = {
    target : 'node',
    mode : 'production',
    entry : resolve('src/index.js'),
    output : {
        libraryTarget : 'commonjs2',
        filename : '[name].js',
        path : resolve('dist'),
        publicPath : '/'
    },
    resolveLoader : {
        alias : { 'ttf-module-loader' : resolve('../') }
    },
    plugins: [
        new MiniCssExtractPlugin('[name].css')
    ],
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /node_modules/,
                use : [
                    {
                        loader : 'babel-loader',
                        options : {
                            cacheDirectory : true
                        }
                    }
                ]
            },
            {
                test : /\.(?:css|ttf)$/i,
                use : [
                    // We must extract CSS as no Window will be present when executing
                    // functional test

                    MiniCssExtractPlugin.loader,

                    {
                        loader : 'css-loader',
                        options : {
                            localIdentName : '_[sha256:hash:base62:7]',
                            importLoaders : 1,
                            modules : true,
                            minimize : false
                        }
                    },
                    {
                        loader : 'ttf-module-loader',
                        options : {
                            output : 'font/[hash:4]',
                            legacy : true
                        }
                    }
                ]
            }
        ]
    }
};
