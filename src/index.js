const ThumbnailGenerator = require('@uppy/thumbnail-generator');
const isPreviewSupported = require('@uppy/utils/lib/isPreviewSupported');

/**
 * The Blur Up plugin :)
 */

module.exports = class BlurUp extends ThumbnailGenerator {
  constructor(uppy, opts) {
    super(uppy, {});
    this.id = this.opts.id || 'BlurUp';
    this.title = 'Blur Up Data Generator';

    this.defaultLocale = {
      strings: {
        generatingThumbnails: 'Generating metadata...',
      },
    };

    const defaultOptions = {
      thumbnailWidth: 20,
      thumbnailHeight: null,
      waitForThumbnailsBeforeUpload: true,
    };

    this.opts = {
      ...defaultOptions,
      ...opts,
    };
  }

  /**
   * Create a thumbnail for the given Uppy file object.
   *
   * @param {{data: Blob}} file
   * @param {number} width
   * @returns {Promise}
   */
  createThumbnail(file, targetWidth, targetHeight) {
    const originalUrl = URL.createObjectURL(file.data);

    const onload = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = originalUrl;
      image.addEventListener('load', () => {
        URL.revokeObjectURL(originalUrl);
        resolve(image);
      });
      image.addEventListener('error', event => {
        URL.revokeObjectURL(originalUrl);
        reject(event.error || new Error('Could not create thumbnail'));
      });
    });

    return Promise.all([onload, this.getOrientation(file)]).then(values => {
      const image = values[0];
      const orientation = values[1];
      const dimensions = this.getProportionalDimensions(
        image,
        targetWidth,
        targetHeight,
        orientation.rotation
      );
      const rotatedImage = this.rotateImage(image, orientation);
      const resizedImage = this.resizeImage(
        rotatedImage,
        dimensions.width,
        dimensions.height
      );
      return Promise.all([
        this.imageSize(image),
        this.canvasToUrl(resizedImage, 'image/png'),
      ]);
    });
  }

  imageSize(image) {
    return Promise.resolve({
      width: image.width,
      height: image.height,
    });
  }

  /**
   * Save a <canvas> element's content to a Data URL.
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise}
   */
  canvasToUrl(canvas, type, quality) {
    try {
      canvas.getContext('2d').getImageData(0, 0, 1, 1);
    } catch (err) {
      if (err.code === 18) {
        return Promise.reject(
          new Error(
            'cannot read image, probably an svg with external resources'
          )
        );
      }
    }

    return Promise.resolve().then(() => {
      return canvas.toDataURL(type, quality);
    });
  }

  processQueue() {
    this.queueProcessing = true;
    if (this.queue.length > 0) {
      const current = this.queue.shift();
      return this.requestThumbnail(current)
        .catch(err => {})
        .then(() => this.processQueue());
    } else {
      this.queueProcessing = false;
      this.uppy.log('[BlurUp] Emptied thumbnail queue');
      this.uppy.emit('thumbnail:all-generated');
    }
  }

  requestThumbnail(file) {
    if (isPreviewSupported(file.type) && !file.isRemote) {
      return this.createThumbnail(
        file,
        this.opts.thumbnailWidth,
        this.opts.thumbnailHeight
      )
        .then(data => {
          const metadata = {
            width: data[0].width,
            height: data[0].height,
            blur: data[1],
          };
          this.uppy.setFileMeta(file.id, metadata);
          this.uppy.log(`[BlurUp] Set Blur Up Data for ${file.id}`);
          this.uppy.emit(
            'blurup:generated',
            this.uppy.getFile(file.id),
            metadata
          );
        })
        .catch(err => {
          this.uppy.log(
            `[BlurUp] Failed setting Blur Up Data for ${file.id}:`,
            'warning'
          );
          this.uppy.log(err, 'warning');
          this.uppy.emit('blurup:error', this.uppy.getFile(file.id), err);
        });
    }
    return Promise.resolve();
  }
};
