# uppy-blur-up

<img src="https://uppy.io/images/logos/uppy-dog-head-arrow.svg" width="120" alt="Uppy logo: a superman puppy in a pink suit" align="right">

<a href="https://www.npmjs.com/package/@uppy/thumbnail-generator"><img src="https://img.shields.io/npm/v/@uppy/thumbnail-generator.svg?style=flat-square"></a>
<a href="https://travis-ci.org/transloadit/uppy"><img src="https://img.shields.io/travis/transloadit/uppy/master.svg?style=flat-square" alt="Build Status"></a>

Uppy plugin that generates data to create the “blur up” technique popularized by Medium and Facebook where a small 20px wide version of the image is shown as a placeholder until the actual image is downloaded.

The relevant data is added to the file's metadata.

This plugin is not part of Uppy but inherits a lot from [@uppy/thumbnail-generator](https://www.npmjs.com/package/@uppy/thumbnail-generator). The original idea is inspired from [gatsby-remark-image](https://www.gatsbyjs.org/packages/gatsby-remark-images/).

It is currently maintained by Arthur Puyou with support from [Fotokorner](https://fotokorner.com).

## Example

```js
const Uppy = require('@uppy/core');
const BlurUp = require('uppy-blur-up');

const uppy = Uppy();
uppy.use(BlurUp);

uppy.on('blurup:generated', (file, data) => {
  console.log(`Blurup data generated for ${file.id}`, data);
});
```

## Installation

```bash
$ npm install uppy-blur-up --save
```

We recommend installing from npm and then using a module bundler such as [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/) or [Rollup.js](http://rollupjs.org/).

## License

[The MIT License](./LICENSE).
