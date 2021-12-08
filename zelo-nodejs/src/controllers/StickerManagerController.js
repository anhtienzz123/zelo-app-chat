const stickerService = require('../services/StickerService');
const redisDb = require('../app/redis');

class StickerManagerController {
    // [POST]
    async createStickerGroup(req, res, next) {
        try {
            const stickerGroup = await stickerService.createStickerGroup(
                req.body
            );

            await redisDb.set('stickers', await stickerService.getAll());
            res.status(201).json(stickerGroup);
        } catch (err) {
            next(err);
        }
    }
    // [PATCH] /:id
    async updateStickerGroup(req, res, next) {
        const { id } = req.params;

        try {
            await stickerService.updateStickerGroup(id, req.body);
            await redisDb.set('stickers', await stickerService.getAll());
            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id
    async deleteStickerGroup(req, res, next) {
        const { id } = req.params;

        try {
            await stickerService.deleteStickerGroup(id);
            await redisDb.set('stickers', await stickerService.getAll());
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id
    async addSticker(req, res, next) {
        const { file } = req;
        const { id } = req.params;

        try {
            const url = await stickerService.addSticker(id, file);
            await redisDb.set('stickers', await stickerService.getAll());
            res.status(201).json({ url });
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /:id/sticker?url=
    async deleteSticker(req, res, next) {
        const { id } = req.params;
        const { url = '' } = req.query;

        try {
            await stickerService.deleteSticker(id, url);
            await redisDb.set('stickers', await stickerService.getAll());
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StickerManagerController();
