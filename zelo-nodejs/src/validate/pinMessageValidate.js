const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const MyError = require('../exception/MyError');

const pinMessageValidate = {
    validateMessage: async (messageId, userId) => {
        const message = await Message.getById(messageId);
        const { conversationId } = message;

        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );

        const { type } = conversation;

        if (!type) throw new MyError('Only Conversation');

        return conversation;
    },
};

module.exports = pinMessageValidate;
