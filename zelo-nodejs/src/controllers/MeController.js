const meService = require('../services/MeService');
const redisDb = require('../app/redis');

// /me
class MeController {
    constructor(io) {
        this.io = io;
        this.revokeToken = this.revokeToken.bind(this);
    }

    // [GET] /profile
    async profile(req, res, next) {
        const { _id } = req;

        try {
            const isExistsCached = await redisDb.exists(_id);
            if (!isExistsCached)
                await redisDb.set(_id, await meService.getProfile(_id));

            res.json(await redisDb.get(_id));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /profile
    async updateProfile(req, res, next) {
        const { _id } = req;

        try {
            await meService.updateProfile(_id, req.body);
            await redisDb.set(_id, await meService.getProfile(_id));
            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /avatar
    async changeAvatar(req, res, next) {
        const { _id, file } = req;

        try {
            const avatar = await meService.changeAvatar(_id, file);

            const cachedUser = await redisDb.get(_id);
            await redisDb.set(_id, { ...cachedUser, avatar });

            return res.json({ avatar });
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /cover-image
    async changeCoverImage(req, res, next) {
        const { _id, file } = req;

        try {
            const coverImage = await meService.changeCoverImage(_id, file);

            const cachedUser = await redisDb.get(_id);
            await redisDb.set(_id, { ...cachedUser, coverImage });

            return res.json({ coverImage });
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /avatar/base64
    async changeAvatarWithBase64(req, res, next) {
        const { _id } = req;

        try {
            const avatar = await meService.changeAvatarWithBase64(
                _id,
                req.body
            );

            const cachedUser = await redisDb.get(_id);
            await redisDb.set(_id, { ...cachedUser, avatar });

            return res.json({ avatar });
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /cover-image/base64
    async changeCoverImageWithBase64(req, res, next) {
        const { _id } = req;

        try {
            const coverImage = await meService.changeCoverImageWithBase64(
                _id,
                req.body
            );

            const cachedUser = await redisDb.get(_id);
            await redisDb.set(_id, { ...cachedUser, coverImage });

            return res.json({ coverImage });
        } catch (err) {
            next(err);
        }
    }

    // [GET] /phone-books
    async getPhoneBooks(req, res, next) {
        const { _id } = req;

        try {
            const phoneBooks = await meService.getPhoneBooks(_id);

            res.json(phoneBooks);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /phone-books
    async syncPhoneBooks(req, res, next) {
        const { _id } = req;
        const { phones } = req.body;

        try {
            await meService.syncPhoneBooks(_id, phones);

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /password
    async changePassword(req, res, next) {
        const { _id } = req;
        const { oldPassword, newPassword } = req.body;

        try {
            await meService.changePassword(_id, oldPassword, newPassword);

            res.status(200).json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /revoke-token
    async revokeToken(req, res, next) {
        const { _id } = req;
        const { password, key } = req.body;
        const source = req.headers['user-agent'];

        try {
            const tokenAndRefreshToken = await meService.revokeToken(
                _id,
                password,
                source
            );

            this.io.to(_id + '').emit('revoke-token', { key });

            res.status(200).json(tokenAndRefreshToken);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MeController;
