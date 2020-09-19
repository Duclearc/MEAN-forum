const multer = require('multer');

//* accepted image types
const mimeTypeMap = {
    'image/png': '.png',
    'image/jpg': '.jpg',
    'image/jpeg': '.jpeg',
};

//* verifying image file type, setting unique file name and extension
const storageConfig = multer.diskStorage({
    destination: (req, file, callback) => {
      let err = new Error('invalid mime type');
      if (mimeTypeMap[file.mimetype]) {
        err = null;
      }
      callback(err, "images");
    },
    filename: (req, file, callback) => {
      const extension = mimeTypeMap[file.mimetype];
      const todaysDate = new Date().toISOString().replace(/:/g, '_');
      const fileName = todaysDate + '-' + file.originalname + extension;
      callback(null, fileName);
    }
});

module.exports = multer({ storage: storageConfig }).single("imgFile");