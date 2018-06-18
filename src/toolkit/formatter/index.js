import woff1 from 'ttf2woff';
import woff2 from 'ttf2woff2';
import eot from 'ttf2eot';
import svg from 'ttf2svg';

/**
 * Returns the ArrayBuffer representation of the given Buffer
 *
 * @public
 * @param {Buffer} buffer
 * @return {ArrayBuffer}
 */
export const toArrayBuffer = (buffer: Buffer): ArrayBuffer => {
    return new Uint8Array(buffer).buffer;
};

/**
 * Returns the Buffer representation of the given ArrayBuffer
 *
 * @public
 * @param {ArrayBuffer} buffer
 * @return {Buffer}
 */
export const toBuffer = (buffer: ArrayBuffer): Buffer => {
    return Buffer.from(buffer.buffer);
};

/**
 * Transforms TTF into Web Open Format
 *
 * @public
 * @param {Buffer} buffer
 * @param {number} version
 * @return {Buffer}
 */
export const toWOF = (buffer: Buffer, version: number = 1): Buffer => {
    if (version !== 2) {
        return toBuffer(woff1(buffer));
    }
    return woff2(buffer);
};

/**
 * Transforms TTF into EOT
 *
 * @public
 * @param {Buffer} buffer
 * @return {Buffer}
 */
export const toEOT = (buffer: Buffer): Buffer => {
    return toBuffer(eot(buffer));
};

/**
 * Transforms TTF into optimized SVG Font
 *
 * @public
 * @param {Buffer} buffer
 * @return {string}
 */
export const toSVG = (buffer: Buffer): Buffer => {
    const base = String(svg(buffer));
    const data = base.replace(/\s+/g, ' ').replace(/\s*(<|\/?>)\s*/g, '$1');

    return data.replace(/<metadata>.*<\/metadata>/, '');
};
