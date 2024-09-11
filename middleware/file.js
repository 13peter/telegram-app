// middleware/file.js

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const allowedFileTypes = ['application/pdf', 'text/plain', 'video/mp4'];
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image types if needed

const fileFilter = (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Недійсний тип файлу. Дозволяються лише PDF, текстові, відео та зображення.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
