import { parse } from 'opentype.js';
import { toArrayBuffer } from '../formatter';

// Constants

const FLAG_SUBSCRIPT = 0x0020;

/**
 * Returns the standard (English) meta data for the given key
 *
 * @private
 * @param {Object} nameTable
 * @param {string} key
 * @return {string}
 */
const getEnglishName = (nameTable: Object, key: string): string => {
    const data = nameTable[ key ];

    if (data) {
        return data.en;
    }
    return '';
};

/**
 * Returns with the TABLES of the given TTF Buffer
 *
 * @public
 * @param {Buffer} buffer
 * @return {Object}
 */
export const getTables = (buffer: Buffer): Object => {
    const view = toArrayBuffer(buffer);
    const font = parse(view);

    return font.tables;
};

/**
 * Returns the family-name by NAME table
 *
 * @public
 * @param {Object} nameTable
 * @return {string}
 */
export const getFontFamily = (nameTable: Object): string => {
    return getEnglishName(nameTable, 'preferredFamily') || getEnglishName(nameTable, 'fontFamily');
};

/**
 * Returns the postScriptName by NAME table
 *
 * @public
 * @param {Object} nameTable
 * @return {string}
 */
export const getFontName = (nameTable: Object): string => {
    return getEnglishName(nameTable, 'postScriptName');
};

/**
 * Returns style-string by binary data
 *
 * @public
 * @param {number} style
 * @return {string}
 */
export const getFontStyle = (style: number): string => {
    if (style === 0x0001) {
        return 'italic';
    }
    if (style === 0x0200) {
        return 'oblique';
    }
    return 'normal';
};

/**
 * Checks default character by TABLE
 *
 * @public
 * @param {Object} tables
 * @return {boolean}
 */
export const hasDefaultChar = ({ os2 = {} }: Object): boolean => {
    return !! os2.usDefaultChar;
};

/**
 * Checks sub/superscript support
 *
 * @public
 * @param {Object} tables
 * @return {boolean}
 */
export const hasSubScript = ({ os2 = {} }: Object): boolean => {
    const rangeList = [
        os2.ulUnicodeRange1,
        os2.ulUnicodeRange2,
        os2.ulUnicodeRange3,
        os2.ulUnicodeRange4
    ];
    return rangeList.includes(FLAG_SUBSCRIPT);
};
