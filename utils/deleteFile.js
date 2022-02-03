const fs = require("fs");

const deleteFile = (unwantedUploadedImages) => {
  for (const unwantedUploadedImage of unwantedUploadedImages) {
    fs.unlink(`../../app/images/${unwantedUploadedImage.filename}`, (err) => {
      if (err) throw err;
      console.log("Files Deleted!");
    });
  }
};

const deleteExistingFile = (hotelImages) => {
  for (const hotelImage of hotelImages) {
    fs.unlink(`../../app/images/${hotelImage}`, (err) => {
      if (err) throw err;
      console.log("Files Deleted!");
    });
  }
};

module.exports = {
  deleteFile: deleteFile,
  deleteExistingFile: deleteExistingFile,
};
