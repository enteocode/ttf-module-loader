ttf-module-loader  [![Build Status][X]][Y]
=================

> Webpack Loader to use TTF files as CSS Modules

### Key Features

- Parses TTF for OS/2 and NAME tables to create `@font-face` declaration
  automatically
- Adds hinting info
- Generates CSS and standard WebFont files
  - `WOFF`
  - `WOFF2`
  - `TTF`
  - `EOT` \*
  - `SVG Font` \*

\* If `legacy` option is enabled.

### Highlights

- Type strict as possible (ESLint)
- ES7
- Functional

## Install

```bash
$ npm i ttf-module-loader
```

## Configuration

`webpack.config.js`

```javascript 
{
    test : /\.(?:css|ttf)$/i,
    use : [
        'style-loader',
        'css-loader?modules&importLoaders=1',
        'ttf-module-loader'
    ]
}
```

## Options

#### `output: string = "font/[hash:4]"`

The output pattern of the generated assets. It uses Webpack tokenizer, so
you can use the same way. Avoid using extension in the pattern, as it will be 
suffixed differently for different formats.

- `[hash]`: Digest of the resource
- `[name]`: Basename of the resource

#### `legacy: boolean = false`

If enabled, then EOT and SVG Font files will be generated as well to support 
old versions of Internet Explorer (6+) and Safari.

## Usage

### CSS Modules

Every generated CSS exports a basic class definition with the name `font`,
what you can use for composing.

```css
.myClass {
    composes: font from '../path/to/font.ttf';
}
```

But if you need some data only, then you can do

```css
@value NAME, WEIGHT from '../path/to/font.ttf';
 
.myClass {
    font-family: NAME, sans-serif;
    font-weight: WEIGHT;
}
```

### ECMAScript

In this case `@font-face` declaration is applied to the CSS as well on load,
but only once at all.

```javascript
import * as font from '../path/to/font.ttf';
 
console.log(font);
```

## Technical Overview

**The imported filename doesn't make any sense over caching.**
 
Every data needed to build `@font-face` declaration is extracted directly from
the Font to avoid multiple cache instances caused by different query 
parameters. As an additional benefit of parsing, we can create the best
configuration for hinting without any manual intervention.

**[TTFAutohint][0]**

#### Autodetect configuration

- For icon-fonts
- For sub and superscript support

#### Font-faces

If you are importing multiple faces of the same family, it will act like this:

`Roboto.ttf`

```css
@font-face {
    font-family: Roboto;
    font-weight: 400;
    font-style: normal;
}
```

`RobotoBoldItalic.ttf`

```css
@font-face {
    font-family: Roboto;
    font-weight: 700;
    font-style: italic;
}
```

#### Exported properties

Every generated CSS exports additional constants about the Font:

- **`NAME`** - Family name (like `Roboto`)
- **`PATH`** - The URL of the generated TTF output (like `/font/793ec93a.ttf`)
- **`WEIGHT`** - The weight (`100`...`900`)
- **`STYLE`** - Style (one of `normal`, `italic`, `oblique`)

## License

MIT © 2018, [Székely Ádám][Z]

[0]: https://www.freetype.org/ttfautohint/
[X]: https://api.travis-ci.com/enteocode/ttf-module-loader.svg?branch=master
[Y]: https://travis-ci.org/enteocode/ttf-module-loader
[Z]: https://github.com/enteocode

