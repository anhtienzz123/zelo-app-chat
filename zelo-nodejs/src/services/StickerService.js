const Sticker = require('../models/Sticker');
const NotFoundError = require('../exception/NotFoundError');
const MyError = require('../exception/MyError');
const awsS3Service = require('./AwsS3Service');
const AWS_BUCKET_NAME_ADMIN = process.env.AWS_BUCKET_NAME_ADMIN;

class StickerService {
    async getAll() {
        return await Sticker.find({});
    }

    async createStickerGroup(stickerGroupInfo) {
        await this.validateStickerGroup(stickerGroupInfo);

        const { name, description } = stickerGroupInfo;
        const newStickerGroup = new Sticker({ name, description });
        return await newStickerGroup.save();
    }

    async updateStickerGroup(_id, stickerGroupInfo) {
        await this.validateStickerGroup(stickerGroupInfo);
        const { name, description } = stickerGroupInfo;
        const { nModified } = await Sticker.updateOne(
            { _id },
            { name, description }
        );

        if (nModified === 0) throw new NotFoundError('Sticker group');
    }

    async validateStickerGroup(stickerGroupInfo) {
        const { name, description = '' } = stickerGroupInfo;

        if (
            !name ||
            name.length < 1 ||
            name.length > 100 ||
            description.length > 100
        )
            throw new MyError('1 <= name <= 100, description <= 100');
    }

    async deleteStickerGroup(_id) {
        const stickerGroup = await Sticker.getById(_id);

        const { stickers } = stickerGroup;
        if (stickers.length > 0)
            throw new MyError('Delete sticker group fail ');

        await Sticker.deleteOne({ _id });
    }

    async addSticker(_id, file) {
        const { mimetype } = file;
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png')
            throw new MyError('Image invalid');

        await Sticker.getById(_id);

        const url = await awsS3Service.uploadFile(file, AWS_BUCKET_NAME_ADMIN);
        await Sticker.updateOne({ _id }, { $push: { stickers: url } });

        return url;
    }

    async deleteSticker(_id, url) {
        const stickerGroup = await Sticker.getById(_id);
        const { stickers } = stickerGroup;

        // tìm thấy
        const index = stickers.findIndex((urlEle) => urlEle == url);
        if (index === -1) throw new NotFoundError('Url sticker');

        await awsS3Service.deleteFile(url, AWS_BUCKET_NAME_ADMIN);
        await Sticker.updateOne({ _id }, { $pull: { stickers: url } });
    }
}

module.exports = new StickerService();
