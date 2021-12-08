const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require('../exception/NotFoundError');

const friendRequestSchema = new Schema(
    {
        senderId: ObjectId,
        receiverId: ObjectId,
    },
    { timestamps: true }
);

friendRequestSchema.statics.existsByIds = async (senderId, receiverId) => {
    const isExists = await FriendRequest.findOne({
        senderId,
        receiverId,
    });

    if (isExists) return true;

    return false;
};

friendRequestSchema.statics.checkByIds = async (
    senderId,
    receiverId,
    message = 'Invite'
) => {
    const isExists = await FriendRequest.findOne({
        senderId,
        receiverId,
    });

    if (!isExists) throw new NotFoundError(message);
};

friendRequestSchema.statics.deleteByIds = async (
    senderId,
    receiverId,
    message = 'Invite'
) => {
    const queryResult = await FriendRequest.deleteOne({ senderId, receiverId });

    const { deletedCount } = queryResult;
    if (deletedCount === 0) throw new NotFoundError(message);
};

const FriendRequest = mongoose.model('friendRequest', friendRequestSchema);

module.exports = FriendRequest;
