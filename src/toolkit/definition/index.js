import * as font from '../font';

// Constants

const FEED = '\n';
const VOID = ' '.repeat(4);
const LINE_FEED = FEED.concat(VOID);

// Standard support (order matters)

const FONT_SUPPORTED_FORMATS = [
    [ '.woff2', 'woff2' ],
    [ '.woff', 'woff' ],
    [ '.ttf', 'truetype' ]
];

/**
 * Returns the CSS Module value definitions section
 *
 * @private
 * @param {Object} obj
 * @return {string}
 */
const getExportDefinitions = (obj: Object): string => {
    const def = Object.keys(obj).map((k: string): string => `${k}:${obj[ k ]}`);
    const css = def.join(';');

    return `:export{${css}}`;
};

/**
 * Returns a single resource declaration
 *
 * @private
 * @param {string} url
 * @param {string} ext
 * @param {string} format
 * @return {string}
 */
const getSourceURL = (url: string, ext: string, format: string = ''): string => {
    const base = `url(${url}${ext})`;

    if (format) {
        return base.concat(` format("${format}")`);
    }
    return base;
};

/**
 * Returns the options dependant `src` string
 *
 * @private
 * @param {string} output
 * @param {boolean} legacy
 * @param {string} postScriptName
 * @return {string}
 */
const getSourceDefinitions = (output: string, legacy: boolean, postScriptName: string): string => {
    const base = legacy ? [ [ '.eot#iefix', 'embedded-opentype' ] ] : [];
    const list = base.concat(FONT_SUPPORTED_FORMATS);

    if (legacy) {
        list.push([ `.svg#${postScriptName}`, 'svg' ]);
    }
    const data = list.map(([ url, format ]: string[]): string => getSourceURL(
        output,
        url,
        format
    ));
    return data.join(','.concat(FEED, VOID, VOID, ' '));
};

/**
 * Build the CSS Module for Font
 *
 * A CSS parser seems too much for this tiny job, but we should keep an eye on
 * 2 principles:
 *
 * - Should not contain whitespaces on ES source (templates are too easy, bro')
 * - Should be formatted for source-maps
 *
 * @public
 * @param {string} output
 * @param {Object} tables
 * @param {boolean} legacy
 * @return {string}
 */
const getDefinition = (output: string, { name = {}, os2 = {} }: Object, legacy: boolean = false): string => {
    const NAME = font.getFontFamily(name);
    const WEIGHT = os2.usWeightClass;
    const STYLE = font.getFontStyle(os2.fsSelection);

    const fontFamily = VOID.concat(`font-family: "${NAME}";`);
    const fontWeight = `font-weight: ${WEIGHT};`;
    const fontStyle  = `font-style: ${STYLE};`;

    return [
        getExportDefinitions({
            WEIGHT,
            PATH : output.concat('.ttf'),
            NAME,
            STYLE
        }),
        `@font-face {`,
            [ fontFamily, fontWeight, fontStyle, legacy ? `src: ${getSourceURL(output, '.eot')};` : '',
                `src: ${getSourceDefinitions(
                    output,
                    legacy,
                    font.getFontName(name)
                )}`
            ].join(LINE_FEED),
        `}`,
        `.font {`,
            [ fontFamily, fontWeight, fontStyle ].join(LINE_FEED),
        `}`
    ].join(FEED);
};

export default getDefinition;
