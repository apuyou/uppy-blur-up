# uppy-blur-up

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

## License

[The MIT License](./LICENSE).
