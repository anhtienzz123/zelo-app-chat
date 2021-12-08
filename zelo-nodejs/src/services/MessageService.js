const Message = require('../models/Message');
const Member = require('../models/Member');
const MyError = require('../exception/MyError');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Channel = require('../models/Channel');
const messageValidate = require('../validate/messageValidate');
const commonUtils = require('../utils/commonUtils');
const ArgumentError = require('../exception/ArgumentError');
const messageUtils = require('../utils/messageUtils');
const dateUtils = require('../utils/dateUtils');
const awsS3Service = require('../services/AwsS3Service');
const lastViewService = require('../services/LastViewService');

class MessageService {
    async getList(conversationId, userId, page, size) {
        if (!conversationId || !userId || !size || page < 0 || size <= 0)
            throw new ArgumentError();

        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );

        const totalMessages =
            await Message.countDocumentsByConversationIdAndUserId(
                conversationId,
                userId
            );

        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            totalMessages
        );

        let messages;

        if (conversation.type) {
            const messagesTempt =
                await Message.getListByConversationIdAndUserIdOfGroup(
                    conversationId,
                    userId,
                    skip,
                    limit
                );

            messages = messagesTempt.map((messageEle) =>
                messageUtils.convertMessageOfGroup(messageEle)
            );
        } else {
            const messagesTempt =
                await Message.getListByConversationIdAndUserIdOfIndividual(
                    conversationId,
                    userId,
                    skip,
                    limit
                );
            messages = messagesTempt.map((messageEle) =>
                messageUtils.convertMessageOfIndividual(messageEle)
            );
        }

        await lastViewService.updateLastViewOfConversation(
            conversationId,
            userId
        );

        return {
            data: messages,
            page,
            size,
            totalPages,
        };
    }

    async getListByChannelId(channelId, userId, page, size) {
        if (!channelId || !userId || !size || page < 0 || size <= 0)
            throw new ArgumentError();

        const channel = await Channel.getById(channelId);
        const { conversationId } = channel;
        await Conversation.getByIdAndUserId(conversationId, userId);

        const totalMessages = await Message.countDocuments({
            channelId,
            deletedUserIds: {
                $nin: [userId],
            },
        });
        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            totalMessages
        );

        const messagesTempt = await Message.getListByChannelIdAndUserId(
            channelId,
            userId,
            skip,
            limit
        );
        const messages = messagesTempt.map((messageEle) =>
            messageUtils.convertMessageOfGroup(messageEle)
        );

        await lastViewService.updateLastViewOfChannel(
            conversationId,
            channelId,
            userId
        );

        return {
            data: messages,
            page,
            size,
            totalPages,
            conversationId,
        };
    }

    async getById(_id, type) {
        if (type) {
            const message = await Message.getByIdOfGroup(_id);

            return messageUtils.convertMessageOfGroup(message);
        }

        const message = await Message.getByIdOfIndividual(_id);
        return messageUtils.convertMessageOfIndividual(message);
    }

    // send text
    async addText(message, userId) {
        // validate
        await messageValidate.validateTextMessage(message, userId);

        const { channelId, conversationId } = message;
        if (channelId) delete message.conversationId;

        const newMessage = new Message({
            userId,
            ...message,
        });

        // lưu xuống
        const saveMessage = await newMessage.save();

        return this.updateWhenHasNewMessage(
            saveMessage,
            conversationId,
            userId
        );
    }

    // send file
    async addFile(file, type, conversationId, channelId, userId) {
        await messageValidate.validateFileMessage(
            file,
            type,
            conversationId,
            channelId,
            userId
        );

        // upload ảnh
        const content = await awsS3Service.uploadFile(file);

        const newMessageTempt = {
            userId,
            content,
            type,
        };

        if (channelId) newMessageTempt.channelId = channelId;
        else newMessageTempt.conversationId = conversationId;

        const newMessage = new Message({
            ...newMessageTempt,
        });

        // lưu xuống
        const saveMessage = await newMessage.save();

        return this.updateWhenHasNewMessage(
            saveMessage,
            conversationId,
            userId
        );
    }

    // send file base64
    async addFileWithBase64(fileInfo, type, conversationId, channelId, userId) {
        await messageValidate.validateFileMessageWithBase64(
            fileInfo,
            type,
            conversationId,
            channelId,
            userId
        );
        const { fileBase64, fileName, fileExtension } = fileInfo;

        // upload ảnh
        const content = await awsS3Service.uploadWithBase64(
            fileBase64,
            fileName,
            fileExtension
        );

        const newMessageTempt = {
            userId,
            content,
            type,
        };

        if (channelId) newMessageTempt.channelId = channelId;
        else newMessageTempt.conversationId = conversationId;

        const newMessage = new Message({
            ...newMessageTempt,
        });
        const saveMessage = await newMessage.save();

        return this.updateWhenHasNewMessage(
            saveMessage,
            conversationId,
            userId
        );
    }

    async updateWhenHasNewMessage(saveMessage, conversationId, userId) {
        const { _id, channelId } = saveMessage;

        if (channelId) {
            await lastViewService.updateLastViewOfChannel(
                conversationId,
                channelId,
                userId
            );
        } else {
            await Conversation.updateOne(
                { _id: conversationId },
                { lastMessageId: _id }
            );

            await lastViewService.updateLastViewOfConversation(
                conversationId,
                userId
            );
        }

        const { type } = await Conversation.findById(conversationId);

        return await this.getById(_id, type);
    }

    // thu hồi tin nhắn
    async deleteById(_id, user) {
        const message = await Message.getById(_id);
        const { userId, conversationId, channelId } = message;

        if (userId != user) throw new MyError('Not permission delete message');

        await Message.updateOne({ _id }, { isDeleted: true });

        let conversationTempt = conversationId;
        if (channelId) {
            const channel = await Channel.getById(channelId);
            conversationTempt = channel.conversationId;
        }

        return {
            _id,
            conversationId: conversationTempt,
            channelId,
        };
    }

    // xoá ở phía tôi
    async deleteOnlyMeById(_id, userId) {
        const message = await Message.getById(_id);
        const { deletedUserIds, isDeleted } = message;

        // tin nhắn đã thu hồi
        if (isDeleted) return;

        const index = deletedUserIds.findIndex(
            (userIdEle) => userIdEle == userId
        );
        // tìm thấy, thì không thêm vô nữa
        if (index !== -1) return;

        await Message.updateOne({ _id }, { $push: { deletedUserIds: userId } });
    }

    // thả reaction
    // check xem userId có trong group chứa tin nhắn này không
    async addReaction(_id, type, userId) {
        const numberType = parseInt(type);
        if (numberType < 1 || numberType > 6)
            throw new MyError('Reaction type invalid');

        const message = await Message.getById(_id);
        const { isDeleted, deletedUserIds, reacts, conversationId, channelId } =
            message;

        // nếu tin nhắn đã xóa
        if (isDeleted || deletedUserIds.includes(userId))
            throw new MyError('Message was deleted');

        // tìm react thả bởi user
        const reactIndex = reacts.findIndex(
            (reactEle) => reactEle.userId == userId
        );

        const reactTempt = [...reacts];
        // không tìm thấy
        if (reactIndex === -1) {
            reactTempt.push({ userId, type });
        } else {
            reactTempt[reactIndex] = { userId, type };
        }

        await Message.updateOne(
            { _id },
            {
                $set: {
                    reacts: reactTempt,
                },
            }
        );
        const user = await User.getSummaryById(userId);

        let conversationTempt = conversationId;
        if (channelId) {
            const channel = await Channel.getById(channelId);
            conversationTempt = channel.conversationId;
        }

        return {
            _id,
            conversationId: conversationTempt,
            channelId,
            user,
            type,
        };
    }

    async deleteAll(conversationId, userId) {
        await Member.getByConversationIdAndUserId(conversationId, userId);

        Message.updateMany(
            { conversationId, deletedUserIds: { $nin: [userId] } },
            { $push: { deletedUserIds: userId } }
        ).then();
    }

    async getListFiles(
        conversationId,
        userId,
        type,
        senderId,
        startTime,
        endTime
    ) {
        if (type !== 'IMAGE' && type !== 'VIDEO' && type !== 'FILE')
            throw new MyError('Message type invalid, only image, video, file');

        const startDate = dateUtils.toDate(startTime);
        const endDate = dateUtils.toDate(endTime);

        await Conversation.getByIdAndUserId(conversationId, userId);

        const query = {
            conversationId,
            type,
            isDeleted: false,
            deletedUserIds: { $nin: [userId] },
        };

        if (senderId) query.userId = senderId;

        if (startDate && endDate)
            query.createdAt = { $gte: startDate, $lte: endDate };

        const files = await Message.find(query, {
            userId: 1,
            content: 1,
            type: 1,
            createdAt: 1,
        });

        return files;
    }

    async getAllFiles(conversationId, userId) {
        await Conversation.getByIdAndUserId(conversationId, userId);

        const images = await Message.getListFilesByTypeAndConversationId(
            'IMAGE',
            conversationId,
            userId,
            0,
            8
        );

        const videos = await Message.getListFilesByTypeAndConversationId(
            'VIDEO',
            conversationId,
            userId,
            0,
            8
        );
        const files = await Message.getListFilesByTypeAndConversationId(
            'FILE',
            conversationId,
            userId,
            0,
            8
        );

        return {
            images,
            videos,
            files,
        };
    }

    async addVoteMessage(voteMessageInfo, userId) {
        const { content, options, conversationId } =
            await messageValidate.validateVoteMessage(voteMessageInfo, userId);

        const newMessage = new Message({
            userId,
            content,
            type: 'VOTE',
            options: options.map((optionNameEle) => {
                return {
                    name: optionNameEle,
                    userIds: [],
                };
            }),
            conversationId,
        });

        // lưu xuống
        const saveMessage = await newMessage.save();

        const { _id, createdAt } = saveMessage;
        // update lại message mới nhất
        await Conversation.updateOne(
            { _id: conversationId },
            { lastMessageId: _id }
        );

        await Member.updateOne(
            { conversationId, userId },
            { $set: { lastView: createdAt } }
        );

        return await this.getById(_id, true);
    }

    async shareMessage(messageId, conversationId, userId) {
        const message = await Message.getById(messageId);
        const { content, type } = message;
        await Conversation.getByIdAndUserId(message.conversationId, userId);
        const conversationShare = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );

        if (type === 'NOTIFY' || type === 'VOTE')
            throw new MyError('Not share message type is NOTIFY or Vote');

        const newMessage = new Message({
            userId,
            content,
            type,
            conversationId,
        });

        // lưu xuống
        const saveMessage = await newMessage.save();

        const { _id, createdAt } = saveMessage;
        // update lại message mới nhất
        await Conversation.updateOne(
            { _id: conversationId },
            { lastMessageId: _id }
        );

        await Member.updateOne(
            { conversationId, userId },
            { $set: { lastView: createdAt } }
        );

        return await this.getById(_id, conversationShare.type);
    }

    async addNotifyMessage(content, conversationId, userId) {
        // tin nhắn thêm vào group
        const newMessage = new Message({
            userId,
            content,
            type: 'NOTIFY',
            conversationId,
        });

        const { _id, createdAt } = await newMessage.save();

        await Conversation.updateOne(
            { _id: conversationId },
            { lastMessageId: _id }
        );

        await Member.updateOne(
            { conversationId, userId },
            { lastView: createdAt }
        );

        return this.getById(_id, true);
    }
}

module.exports = new MessageService();
