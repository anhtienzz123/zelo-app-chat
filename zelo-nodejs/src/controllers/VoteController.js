const voteService = require('../services/VoteService');
const messageService = require('../services/MessageService');

// votes
class VoteController {
    constructor(io) {
        this.io = io;
        this.addVoteMessage = this.addVoteMessage.bind(this);
        this.addOptions = this.addOptions.bind(this);
        this.deleteOptions = this.deleteOptions.bind(this);
        this.addVoteChoices = this.addVoteChoices.bind(this);
        this.deleteVoteChoices = this.deleteVoteChoices.bind(this);
    }

    // [GET] /:conversationId
    async getListVotesByConversationId(req, res, next) {
        const { _id } = req;
        const { conversationId } = req.params;
        const { page = 0, size = 10 } = req.query;

        try {
            const votes = await voteService.getListVotesByConversationId(
                conversationId,
                parseInt(page),
                parseInt(size),
                _id
            );

            res.json(votes);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /
    async addVoteMessage(req, res, next) {
        const { _id } = req;

        try {
            const voteMessage = await messageService.addVoteMessage(
                req.body,
                _id
            );
            const { conversationId } = voteMessage;
            this.io
                .to(conversationId + '')
                .emit('new-message', conversationId, voteMessage);

            res.status(201).json(voteMessage);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:messageId
    async addOptions(req, res, next) {
        const { _id } = req;
        const { messageId } = req.params;
        const { options } = req.body;

        try {
            await voteService.addOptions(
                messageId,
                Array.from(new Set(options)),
                _id
            );

            const voteMessage = await messageService.getById(messageId, true);
            const { conversationId } = voteMessage;
            this.io
                .to(conversationId + '')
                .emit('update-vote-message', conversationId, voteMessage);

            res.status(201).json(voteMessage);
        } catch (err) {
            next(err);
        }
    }
    // [DELETE] /:messageId
    async deleteOptions(req, res, next) {
        const { _id } = req;
        const { messageId } = req.params;
        const { options } = req.body;

        try {
            await voteService.deleteOptions(
                messageId,
                Array.from(new Set(options)),
                _id
            );

            const voteMessage = await messageService.getById(messageId, true);
            const { conversationId } = voteMessage;
            this.io
                .to(conversationId + '')
                .emit('update-vote-message', conversationId, voteMessage);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:messageId/choices
    async addVoteChoices(req, res, next) {
        const { _id } = req;
        const { messageId } = req.params;
        const { options } = req.body;

        try {
            await voteService.addVoteChoices(
                messageId,
                Array.from(new Set(options)),
                _id
            );
            const voteMessage = await messageService.getById(messageId, true);
            const { conversationId } = voteMessage;
            this.io
                .to(conversationId + '')
                .emit('update-vote-message', conversationId, voteMessage);
            res.status(201).json(voteMessage);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:messageId/choices
    async deleteVoteChoices(req, res, next) {
        const { _id } = req;
        const { messageId } = req.params;
        const { options } = req.body;

        try {
            await voteService.deleteVoteChoices(
                messageId,
                Array.from(new Set(options)),
                _id
            );
            const voteMessage = await messageService.getById(messageId, true);
            const { conversationId } = voteMessage;
            this.io
                .to(conversationId + '')
                .emit('update-vote-message', conversationId, voteMessage);
            res.status(204).json(voteMessage);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = VoteController;
