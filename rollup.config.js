import { minify } from 'uglify-es';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

/**
 * @type {Object} Internal cache
 */
const cache = {};

/**
 * @type {string[]} Global variables to pass IIFE to shrink
 */
const globs = [
    'require'
];

/**
 * @type {Object} Uglify options
 */
const uglifyOptions = {
    compress : { passes : 3 }
};

/**
 * Custom plugin for Rollup to apply logic on bundle-scope
 *
 * @private
 * @return {Object}
 */
const transform = {
    name : 'rollup-custom-minify',

    transformBundle(source) {
        const vars = globs.join(',');
        const code = `((${vars}) => {${source}})(${vars});`;

        return minify(
            code,
            uglifyOptions
        );
    }
};

/**
 * Rollup configuration
 *
 * As Rollup provides a different algorithm for tree-shaking, this is the best
 * compiler for plugins and loaders
 *
 * @public
 */
export default {
    input : 'src/index.js',
    cache,
    output : {
        sourceMap : false,
        file : 'index.js',
        format : `cjs`
    },
    external : [
        'loader-utils',
        'fs',
        'path',
        'ttf2woff2',
        'ttf2woff',
        'ttf2eot',
        'ttf2svg',
        'ttfautohint',
        'opentype.js'
    ],
    plugins : [
        resolve(),
        json(),
        babel({ exclude : 'node_modules/**' }),

        transform
    ]
};
