const multer = require("multer");
const fs = require("fs");

module.exports = multerConfig = {
  config: {
    storage: multer.diskStorage({
      destination: (req, file, next) => {
        const folder = "./images/slip/";
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        next(null, folder);
      },
      filename: (_, file, next) => {
        const ext = file.mimetype.split("/")[1];
        next(null, file.fieldname + "-" + Date.now() + "." + ext);
      },
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (_, file, next) => {
      const image = file.mimetype.startsWith("image/");
      console.log(`image :${file.mimetype}`);

      if (image) {
        next(null, true);
      } else {
        next("File type is not support!", false);
      }
    },
  },
  keyUploadPhoto: "photo",
};
