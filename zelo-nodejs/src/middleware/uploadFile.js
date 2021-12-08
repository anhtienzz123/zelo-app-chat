const util = require('util');
const multer = require('multer');

let TYPE_MATCH = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'video/mp3',
    'video/mp4',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/zip',
];
const FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);

let storage = multer.diskStorage({
    filename: (req, file, callback) => {
        const splitTempt = file.originalname.split('.');
        const fileExtension = splitTempt[splitTempt.length - 1];

        if (fileExtension === 'rar') {
            file.mimetype = 'application/vnd.rar';
        }

        if (fileExtension === 'zip') {
            file.mimetype = 'application/zip';
        }

        if (TYPE_MATCH.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }

        let filename = `${Date.now()}-zelo-${file.originalname}`;
        callback(null, filename);
    },
});

let uploadManyFiles = multer({
    storage,
    limits: { fileSize: FILE_SIZE },
}).array('files', 10);
let uploadFile = multer({ storage, limits: { fileSize: FILE_SIZE } }).single(
    'file'
);

let multipleUploadMiddleware = util.promisify(uploadManyFiles);
let singleUploadMiddleware = util.promisify(uploadFile);

module.exports = {
    multipleUploadMiddleware,
    singleUploadMiddleware,
};
