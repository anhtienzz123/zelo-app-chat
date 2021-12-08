const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const messageUtils = require('../utils/messageUtils');
const commonUtils = require('../utils/commonUtils');
const MyError = require('../exception/MyError');
const VOTE = 'VOTE';

class VoteService {
    async getListVotesByConversationId(conversationId, page, size, myId) {
        if (!conversationId || !size || page < 0 || size <= 0)
            throw new ArgumentError();

        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            myId
        );
        const { type } = conversation;
        if (!type) throw new MyError('Only group conversation');

        const totalVoteMessages = await Message.countDocuments({
            conversationId,
            type: VOTE,
        });

        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            totalVoteMessages
        );

        const messagesTempt =
            await Message.getListByConversationIdAndTypeAndUserId(
                conversationId,
                VOTE,
                myId,
                skip,
                limit
            );

        const messages = messagesTempt.map((messageEle) =>
            messageUtils.convertMessageOfGroup(messageEle)
        );

        return {
            data: messages,
            page,
            size,
            totalPages,
        };
    }

    async addOptions(messageId, optionNames, userId) {
        const message = await this.validateVote(messageId, optionNames, userId);
        const availableOptionNames = message.options.map(
            (optionEle) => optionEle.name
        );
        optionNames.forEach((optionNameEle) => {
            if (
                !(
                    !optionNameEle ||
                    optionNameEle.length === 0 ||
                    optionNameEle.length > 200 ||
                    availableOptionNames.includes(optionNameEle)
                )
            )
                message.options.push({ name: optionNameEle, userIds: [] });
        });

        await message.save();
    }
    async deleteOptions(messageId, optionNames, userId) {
        const message = await this.validateVote(messageId, optionNames, userId);

        message.options = message.options.filter(
            (optionEle) => !optionNames.includes(optionEle.name)
        );

        await message.save();
    }
    async addVoteChoices(messageId, optionNames, userId) {
        const message = await this.validateVote(messageId, ['1'], userId);

        message.options = message.options.map((optionEle) => {
            const { name, userIds } = optionEle;

            if (optionNames.includes(name) && !userIds.includes(userId))
                userIds.push(userId);

            return {
                name,
                userIds,
            };
        });

        await message.save();
    }
    async deleteVoteChoices(messageId, optionNames, userId) {
        const message = await this.validateVote(messageId, ['1'], userId);

        message.options = message.options.map((optionEle) => {
            const { name, userIds } = optionEle;

            const index = userIds.findIndex((userIdEle) => userIdEle == userId);
            if (optionNames.includes(name) && index !== -1)
                userIds.splice(index, 1);

            return {
                name,
                userIds,
            };
        });

        await message.save();
    }

    async validateVote(messageId, optionNames, userId) {
        if (!optionNames || optionNames.length === 0)
            throw new MyError('Options not empty');

        const message = await Message.getById(messageId);
        const { type, conversationId } = message;
        await Conversation.getByIdAndUserId(conversationId, userId);

        if (type !== 'VOTE') throw new MyError('Only vote message');

        return message;
    }
}

module.exports = new VoteService();
