const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require('../exception/NotFoundError');

const memberSchema = new Schema({
    conversationId: ObjectId,
    userId: ObjectId,
    lastView: {
        type: Date,
        default: new Date(),
    },
    name: String,
    lastViewOfChannels: [{ channelId: ObjectId, lastView: Date }],
    isNotify: {
        type: Boolean,
        default: true,
    },
});

memberSchema.statics.getByConversationIdAndUserId = async (
    conversationId,
    userId,
    message = 'Conversation'
) => {
    const member = await Member.findOne({
        conversationId,
        userId,
    });

    if (!member) throw new NotFoundError(message);

    return member;
};

memberSchema.statics.existsByConversationIdAndUserId = async (
    conversationId,
    userId
) => {
    const member = await Member.findOne({
        conversationId,
        userId,
    });

    if (!member) return false;

    return true;
};

memberSchema.statics.getListInfosByConversationId = async (conversationId) => {
    const users = await Member.aggregate([
        { $match: { conversationId: ObjectId(conversationId) } },
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
            $project: {
                _id: 0,
                user: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    avatar: 1,
                    avatarColor: 1,
                },
            },
        },
        {
            $replaceWith: '$user',
        },
    ]);

    return users;
};

const Member = mongoose.model('member', memberSchema);

module.exports = Member;
