const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const messageSerivce = require('../services/MessageService');
const pinMessageValidate = require('../validate/pinMessageValidate');
const MyError = require('../exception/MyError');

class PinMessageService {
    async getAll(conversationId, userId) {
        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );
        const { type, pinMessageIds } = conversation;

        if (!type) throw new MyError('Only grop conversation');

        const pinMessagesResult = [];
        for (const messageId of pinMessageIds) {
            pinMessagesResult.push(
                await messageSerivce.getById(messageId, type)
            );
        }

        return pinMessagesResult;
    }

    async add(messageId, userId) {
        const conversation = await pinMessageValidate.validateMessage(
            messageId,
            userId
        );
        const { _id, type, pinMessageIds } = conversation;

        if (
            !type ||
            pinMessageIds.includes(messageId) ||
            pinMessageIds.length >= 3
        )
            throw new MyError('Pin message only conversation, < 3 pin');

        await Conversation.updateOne(
            { _id },
            { $push: { pinMessageIds: messageId } }
        );

        const newMessage = new Message({
            content: 'PIN_MESSAGE',
            userId,
            type: 'NOTIFY',
            conversationId: _id,
        });

        const saveMessage = await newMessage.save();

        return {
            conversationId: _id,
            message: await messageSerivce.updateWhenHasNewMessage(
                saveMessage,
                _id,
                userId
            ),
        };
    }

    async delete(messageId, userId) {
        const conversation = await pinMessageValidate.validateMessage(
            messageId,
            userId
        );

        const { _id, type, pinMessageIds } = conversation;

        if (!type || pinMessageIds.length === 0)
            throw new MyError('Pin message only conversation');

        await Conversation.updateOne(
            { _id },
            { $pull: { pinMessageIds: messageId } }
        );

        const newMessage = new Message({
            content: 'NOT_PIN_MESSAGE',
            userId,
            type: 'NOTIFY',
            conversationId: _id,
        });

        const saveMessage = await newMessage.save();

        return {
            conversationId: _id,
            message: await messageSerivce.updateWhenHasNewMessage(
                saveMessage,
                _id,
                userId
            ),
        };
    }
}

module.exports = new PinMessageService();
