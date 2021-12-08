const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require('../exception/NotFoundError');

const messageSchema = new Schema(
    {
        userId: {
            type: ObjectId,
            require: true,
        },
        manipulatedUserIds: {
            type: [ObjectId],
            default: [],
        },
        content: {
            type: String,
            require: true,
        },
        tags: {
            type: [ObjectId],
            default: [],
        },
        replyMessageId: ObjectId,
        type: {
            type: String,
            enum: [
                'TEXT',
                'IMAGE',
                'STICKER',
                'VIDEO',
                'FILE',
                'HTML',
                'NOTIFY',
                'VOTE',
            ],
            require: true,
        },
        reacts: {
            type: [
                {
                    userId: ObjectId,
                    type: {
                        type: Number,
                        enum: [0, 1, 2, 3, 4, 5, 6],
                    },
                },
            ],
            default: [],
        },
        options: {
            type: [
                {
                    name: String,
                    userIds: {
                        type: [ObjectId],
                        default: [],
                    },
                },
            ],
            require: false,
        },
        deletedUserIds: {
            type: [ObjectId],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        conversationId: ObjectId,
        channelId: ObjectId,
        createdAt: Date,
        updatedAt: Date,
    },
    { timestamps: true }
);

messageSchema.statics.getByIdOfGroup = async (_id) => {
    const messages = await Message.aggregate([
        {
            $match: {
                _id: ObjectId(_id),
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'manipulatedUserIds',
                foreignField: '_id',
                as: 'manipulatedUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'options.userIds',
                foreignField: '_id',
                as: 'userOptions',
            },
        },
        // replyMessage
        {
            $lookup: {
                from: 'messages',
                localField: 'replyMessageId',
                foreignField: '_id',
                as: 'replyMessage',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replyMessage.userId',
                foreignField: '_id',
                as: 'replyUser',
            },
        },
        // lấy danh sách user thả react
        {
            $lookup: {
                from: 'users',
                localField: 'reacts.userId',
                foreignField: '_id',
                as: 'reactUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'tags',
                foreignField: '_id',
                as: 'tagUsers',
            },
        },

        {
            $project: {
                user: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                manipulatedUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                userOptions: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                options: 1,
                content: 1,
                type: 1,
                replyMessage: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    isDeleted: 1,
                },
                replyUser: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                tagUsers: {
                    _id: 1,
                    name: 1,
                },
                reacts: 1,
                reactUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                isDeleted: 1,
                createdAt: 1,
                conversationId: 1,
                channelId: 1,
            },
        },
    ]);

    if (messages.length > 0) return messages[0];

    throw new NotFoundError('Message');
};

messageSchema.statics.getByIdOfIndividual = async (_id) => {
    const messages = await Message.aggregate([
        {
            $match: {
                _id: ObjectId(_id),
            },
        },
        {
            $lookup: {
                from: 'messages',
                localField: 'replyMessageId',
                foreignField: '_id',
                as: 'replyMessage',
            },
        },
        {
            $lookup: {
                from: 'members',
                localField: 'conversationId',
                foreignField: 'conversationId',
                as: 'members',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members.userId',
                foreignField: '_id',
                as: 'userInfos',
            },
        },
        {
            $project: {
                userId: 1,
                members: {
                    userId: 1,
                    name: 1,
                },
                userInfos: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                content: 1,
                type: 1,
                replyMessage: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    isDeleted: 1,
                    userId: 1,
                },
                reacts: {
                    userId: 1,
                    type: 1,
                },
                isDeleted: 1,
                createdAt: 1,
                conversationId: 1,
            },
        },
    ]);

    if (messages.length > 0) return messages[0];

    throw new NotFoundError('Message');
};

messageSchema.statics.countUnread = async (time, conversationId) => {
    return await Message.countDocuments({
        createdAt: { $gt: time },
        conversationId,
    });
};

messageSchema.statics.getById = async (_id, message = 'Message') => {
    const messageResult = await Message.findById(_id);

    if (!messageResult) throw new NotFoundError(message);

    return messageResult;
};

messageSchema.statics.getByIdAndConversationId = async (
    _id,
    conversationId,
    message = 'Message'
) => {
    const messageResult = await Message.findOne({
        _id,
        conversationId,
    });

    if (!messageResult) throw new NotFoundError(message);

    return messageResult;
};

messageSchema.statics.getByIdAndChannelId = async (
    _id,
    channelId,
    message = 'Message'
) => {
    const messageResult = await Message.findOne({
        _id,
        channelId,
    });

    if (!messageResult) throw new NotFoundError(message);

    return messageResult;
};

messageSchema.statics.countDocumentsByConversationIdAndUserId = async (
    conversationId,
    userId
) => {
    const totalMessages = await Message.countDocuments({
        conversationId,
        deletedUserIds: {
            $nin: [userId],
        },
    });

    return totalMessages;
};

messageSchema.statics.getListByConversationIdAndUserIdOfGroup = async (
    conversationId,
    userId,
    skip,
    limit
) => {
    const messages = await Message.aggregate([
        {
            $match: {
                conversationId: ObjectId(conversationId),
                deletedUserIds: {
                    $nin: [ObjectId(userId)],
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'manipulatedUserIds',
                foreignField: '_id',
                as: 'manipulatedUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'options.userIds',
                foreignField: '_id',
                as: 'userOptions',
            },
        },
        // replyMessage
        {
            $lookup: {
                from: 'messages',
                localField: 'replyMessageId',
                foreignField: '_id',
                as: 'replyMessage',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replyMessage.userId',
                foreignField: '_id',
                as: 'replyUser',
            },
        },
        // lấy danh sách user thả react
        {
            $lookup: {
                from: 'users',
                localField: 'reacts.userId',
                foreignField: '_id',
                as: 'reactUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'tags',
                foreignField: '_id',
                as: 'tagUsers',
            },
        },

        {
            $project: {
                user: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                manipulatedUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                userOptions: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                options: 1,
                content: 1,
                type: 1,
                replyMessage: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    isDeleted: 1,
                },
                replyUser: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },

                tagUsers: {
                    _id: 1,
                    name: 1,
                },
                reacts: 1,
                reactUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                isDeleted: 1,
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $sort: {
                createdAt: 1,
            },
        },
    ]);

    return messages;
};

messageSchema.statics.getListByConversationIdAndTypeAndUserId = async (
    conversationId,
    type,
    userId,
    skip,
    limit
) => {
    const messages = await Message.aggregate([
        {
            $match: {
                conversationId: ObjectId(conversationId),
                type,
                deletedUserIds: {
                    $nin: [ObjectId(userId)],
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'manipulatedUserIds',
                foreignField: '_id',
                as: 'manipulatedUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'options.userIds',
                foreignField: '_id',
                as: 'userOptions',
            },
        },
        // replyMessage
        {
            $lookup: {
                from: 'messages',
                localField: 'replyMessageId',
                foreignField: '_id',
                as: 'replyMessage',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replyMessage.userId',
                foreignField: '_id',
                as: 'replyUser',
            },
        },
        // lấy danh sách user thả react
        {
            $lookup: {
                from: 'users',
                localField: 'reacts.userId',
                foreignField: '_id',
                as: 'reactUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'tags',
                foreignField: '_id',
                as: 'tagUsers',
            },
        },

        {
            $project: {
                user: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                manipulatedUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                userOptions: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                options: 1,
                content: 1,
                type: 1,
                replyMessage: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    isDeleted: 1,
                },
                replyUser: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },

                tagUsers: {
                    _id: 1,
                    name: 1,
                },
                reacts: 1,
                reactUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                isDeleted: 1,
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $sort: {
                createdAt: 1,
            },
        },
    ]);

    return messages;
};

messageSchema.statics.getListByChannelIdAndUserId = async (
    channelId,
    userId,
    skip,
    limit
) => {
    const messages = await Message.aggregate([
        {
            $match: {
                channelId: ObjectId(channelId),
                deletedUserIds: {
                    $nin: [ObjectId(userId)],
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'manipulatedUserIds',
                foreignField: '_id',
                as: 'manipulatedUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'options.userIds',
                foreignField: '_id',
                as: 'userOptions',
            },
        },
        // replyMessage
        {
            $lookup: {
                from: 'messages',
                localField: 'replyMessageId',
                foreignField: '_id',
                as: 'replyMessage',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replyMessage.userId',
                foreignField: '_id',
                as: 'replyUser',
            },
        },
        // lấy danh sách user thả react
        {
            $lookup: {
                from: 'users',
                localField: 'reacts.userId',
                foreignField: '_id',
                as: 'reactUsers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'tags',
                foreignField: '_id',
                as: 'tagUsers',
            },
        },

        {
            $project: {
                user: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                manipulatedUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                userOptions: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                options: 1,
                content: 1,
                type: 1,
                replyMessage: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    isDeleted: 1,
                },
                replyUser: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },

                tagUsers: {
                    _id: 1,
                    name: 1,
                },
                reacts: 1,
                reactUsers: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                isDeleted: 1,
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $sort: {
                createdAt: 1,
            },
        },
    ]);

    return messages;
};

messageSchema.statics.getListByConversationIdAndUserIdOfIndividual = async (
    conversationId,
    userId,
    skip,
    limit
) => {
    const messages = await Message.aggregate([
        {
            $match: {
                conversationId: ObjectId(conversationId),
                deletedUserIds: {
                    $nin: [ObjectId(userId)],
                },
            },
        },
        {
            $lookup: {
                from: 'messages',
                localField: 'replyMessageId',
                foreignField: '_id',
                as: 'replyMessage',
            },
        },
        {
            $lookup: {
                from: 'members',
                localField: 'conversationId',
                foreignField: 'conversationId',
                as: 'members',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members.userId',
                foreignField: '_id',
                as: 'userInfos',
            },
        },
        {
            $project: {
                userId: 1,
                members: {
                    userId: 1,
                    name: 1,
                },
                userInfos: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
                content: 1,
                type: 1,
                replyMessage: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    isDeleted: 1,
                    userId: 1,
                },
                reacts: {
                    userId: 1,
                    type: 1,
                },
                isDeleted: 1,
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $sort: {
                createdAt: 1,
            },
        },
    ]);

    return messages;
};

messageSchema.statics.getListFilesByTypeAndConversationId = async (
    type,
    conversationId,
    userId,
    skip,
    limit
) => {
    const files = await Message.find(
        {
            conversationId,
            type,
            isDeleted: false,
            deletedUserIds: { $nin: [userId] },
        },
        {
            userId: 1,
            content: 1,
            type: 1,
            createdAt: 1,
        }
    )
        .skip(skip)
        .limit(limit);

    return files;
};

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
