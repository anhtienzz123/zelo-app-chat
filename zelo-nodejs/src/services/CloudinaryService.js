const MyError = require('../exception/MyError');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    sign_url: process.env.CLOUDINARY_URL,
});

const RESOURCE_TYPE = ['image', 'video', 'raw', 'auto'];

class CloudinaryService {
    // 0 la image
    // 1 la video
    // 2 la raw
    // 3: auto
    async upload(filePath, type = 0) {
        const options = {
            resource_type: RESOURCE_TYPE[type],
        };

        try {
            const result = await cloudinary.uploader.upload(filePath, options);

            return result.url;
        } catch (err) {
            throw new MyError('Upload file Cloudinary failed');
        }
    }

    getNumberType(type) {
        if (type === 'IMAGE') return 0;
        if (type === 'VIDEO') return 1;
        if (type === 'FILE') return 2;

        return 3;
    }

    async delete(url, type = 0) {
        if (!url) return;

        const options = {
            resource_type: RESOURCE_TYPE[type],
        };

        try {
            const publicId = this.getPublicId(url);

            await cloudinary.uploader.destroy(publicId, options);
        } catch (err) {
            throw new MyError('Delete file Cloudinary failed');
        }
    }

    getPublicId(url) {
        try {
            const arrTempt = url.split('/');
            const fileName = arrTempt[arrTempt.length - 1];

            return fileName.split('.')[0];
        } catch (err) {
            return '';
        }
    }
}

module.exports = new CloudinaryService();
