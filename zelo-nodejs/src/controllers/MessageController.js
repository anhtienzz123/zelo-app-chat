const messageService = require('../services/MessageService');
const MyError = require('../exception/MyError');

class MessageController {
    constructor(io) {
        this.io = io;

        this.getList = this.getList.bind(this);
        this.getListByChannelId = this.getListByChannelId.bind(this);
        this.addText = this.addText.bind(this);
        this.addFile = this.addFile.bind(this);
        this.addFileWithBase64 = this.addFileWithBase64.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.addReaction = this.addReaction.bind(this);
        this.shareMessage = this.shareMessage.bind(this);
    }

    // [GET] /:conversationId
    async getList(req, res, next) {
        const { _id } = req;
        const { conversationId } = req.params;
        const { page = 0, size = 20 } = req.query;

        try {
            const messages = await messageService.getList(
                conversationId,
                _id,
                parseInt(page),
                parseInt(size)
            );

            this.io.to(conversationId + '').emit('user-last-view', {
                conversationId,
                userId: _id,
                lastView: new Date(),
            });

            res.json(messages);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /channel/:channelId
    async getListByChannelId(req, res, next) {
        const { _id } = req;
        const { channelId } = req.params;
        const { page = 0, size = 20 } = req.query;

        try {
            const result = await messageService.getListByChannelId(
                channelId,
                _id,
                parseInt(page),
                parseInt(size)
            );

            this.io.to(result.conversationId + '').emit('user-last-view', {
                conversationId: result.conversationId,
                channelId,
                userId: _id,
                lastView: new Date(),
            });

            res.json({
                data: result.data,
                page: result.page,
                size: result.size,
                totalPages: result.totalPages,
            });
        } catch (error) {
            next(error);
        }
    }

    //[POST] /text  tin nhắn dạng text
    async addText(req, res, next) {
        const { _id } = req;

        try {
            const { conversationId } = req.body;
            const message = await messageService.addText(req.body, _id);
            const { channelId } = message;

            if (channelId) {
                this.io
                    .to(conversationId + '')
                    .emit(
                        'new-message-of-channel',
                        conversationId,
                        channelId,
                        message
                    );
            } else
                this.io
                    .to(conversationId + '')
                    .emit('new-message', conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    //[POST] /files  tin nhắn dạng file
    async addFile(req, res, next) {
        const { _id, file } = req;
        const { type, conversationId, channelId } = req.query;

        try {
            if (!conversationId || !type)
                throw new MyError('Params type or conversationId not exists');

            const message = await messageService.addFile(
                file,
                type,
                conversationId,
                channelId,
                _id
            );

            if (channelId) {
                this.io
                    .to(conversationId + '')
                    .emit(
                        'new-message-of-channel',
                        conversationId,
                        channelId,
                        message
                    );
            } else
                this.io
                    .to(conversationId + '')
                    .emit('new-message', conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /files/base64
    async addFileWithBase64(req, res, next) {
        const { _id } = req;
        const { type, conversationId, channelId } = req.query;
        try {
            if (!conversationId || !type)
                throw new MyError('Params type or conversationId not exists');
            const message = await messageService.addFileWithBase64(
                req.body,
                type,
                conversationId,
                channelId,
                _id
            );

            if (channelId) {
                this.io
                    .to(conversationId + '')
                    .emit(
                        'new-message-of-channel',
                        conversationId,
                        channelId,
                        message
                    );
            } else
                this.io
                    .to(conversationId + '')
                    .emit('new-message', conversationId, message);
            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id thu hồi tin nhắn
    async deleteById(req, res, next) {
        const { _id } = req;
        const { id } = req.params;

        try {
            const { conversationId, channelId } =
                await messageService.deleteById(id, _id);

            this.io
                .to(conversationId + '')
                .emit('delete-message', { conversationId, channelId, id });
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id/only xóa ở phía tôi
    async deleteOnlyMeById(req, res, next) {
        const { _id } = req;
        const { id } = req.params;

        try {
            await messageService.deleteOnlyMeById(id, _id);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/reacts/:type
    async addReaction(req, res, next) {
        const { _id } = req;
        const { id, type } = req.params;

        try {
            const { user, conversationId, channelId } =
                await messageService.addReaction(id, type, _id);

            this.io.to(conversationId + '').emit('add-reaction', {
                conversationId,
                channelId,
                messageId: id,
                user,
                type,
            });

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /:conversationId/files
    async getListFiles(req, res, next) {
        const { _id } = req;
        const { conversationId } = req.params;
        const { senderId, type = 'ALL', startTime, endTime } = req.query;

        try {
            let files;
            if (type === 'ALL')
                files = await messageService.getAllFiles(conversationId, _id);
            else
                files = await messageService.getListFiles(
                    conversationId,
                    _id,
                    type,
                    senderId,
                    startTime,
                    endTime
                );

            res.json(files);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/share/:conversationId
    async shareMessage(req, res, next) {
        const { _id } = req;
        const { id, conversationId } = req.params;

        try {
            const message = await messageService.shareMessage(
                id,
                conversationId,
                _id
            );

            this.io
                .to(conversationId + '')
                .emit('new-message', conversationId, message);
            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MessageController;
