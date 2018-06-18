import TTFAutohint from 'ttfautohint';
import * as path from 'path';
import * as fs from 'fs';
import * as loaderUtils from 'loader-utils';
import * as font from './toolkit/font';
import * as formatter from './toolkit/formatter';
import getDefinition from './toolkit/definition';

import type { TTFModuleOptions } from 'ttf-module-loader';

// OS/2 : https://docs.microsoft.com/en-us/typography/opentype/spec/os2

/**
 * @type {TTFModuleOptions}
 */
const defaultOptions: TTFModuleOptions = {
    output : 'font/[hash:4]',
    legacy : false
};

/**
 * Returns with the resolved output name
 *
 * @private
 * @param {Object} context
 * @param {string} output
 * @param {Buffer} buffer
 * @return {string}
 */
const getOutputName = (context: Object, output: string, buffer: Buffer): string => {
    return loaderUtils.interpolateName(context, output, { content : buffer });
};

/**
 * Returns with the public path (where outputs will be emitted to)
 *
 * @private
 * @param {Object} options
 * @return {string}
 */
const getPublicPath = ({ output = {} }: Object): string => {
    return output.publicPath || '';
};

/**
 * Loader method for the pitching-phase
 */
const pitch = function () {
    const { resourcePath, emitFile } = this;

    if (! /\.ttf$/i.test(path.extname(resourcePath))) {
        return;
    }
    if (this.cacheable) {
        this.cacheable();
    }
    const callback = this.async();
    const options: TTFModuleOptions = { ... defaultOptions, ... loaderUtils.getOptions(this) };

    fs.readFile(resourcePath, (error: string, buffer: Buffer) => {
        if (error) {
            return void callback(error);
        }
        const { legacy } = options;

        const path = getPublicPath(this.options || this._compiler.options);
        const name = getOutputName(this, options.output, buffer);
        const data = font.getTables(buffer);
        const icon = ! font.hasDefaultChar(data);

        const ttf = TTFAutohint.transform(buffer, { icon, extended : font.hasSubScript(data) });

        emitFile(`${name}.ttf`, ttf);
        emitFile(`${name}.woff2`, formatter.toWOF(ttf, 2));
        emitFile(`${name}.woff`, formatter.toWOF(ttf));

        if (legacy) {
            emitFile(`${name}.eot`, formatter.toEOT(ttf));
            emitFile(`${name}.svg`, formatter.toSVG(ttf));
        }
        callback(null, getDefinition(
            path.concat(name),
            data,
            legacy
        ));
    });
};

/**
 * Loader configuration
 *
 * @public
 * @param {string} src
 * @return {string}
 */
export default Object.assign((src: string): string => src, {
    target : 'web',
    raw : true,
    minimize : false,

    pitch
});
