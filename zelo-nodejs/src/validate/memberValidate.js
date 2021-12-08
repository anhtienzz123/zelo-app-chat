const Conversation = require('../models/Conversation');
const User = require('../models/User');
const MyError = require('../exception/MyError');
const Member = require('../models/Member');

const memberValidate = {
    validateLeaveGroup: async (conversationId, userId) => {
        // check  có trong nhóm không
        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );
        const { type, leaderId } = conversation;
        // cá nhân hoặc đang là leader không thể out nhóm
        if (!type || leaderId == userId)
            throw new MyError("Cant't leave group");
    },

    validateAddMember: async (conversationId, userId, newUserIds) => {
        if (newUserIds.length <= 0) throw new MyError('User must > 0');

        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );

        const { type } = conversation;
        // cá nhân không thể thêm thành viên
        if (!type) throw new MyError("Cant't add member, only group");

        // check users đc add có tồn tại
        await User.checkByIds(newUserIds);
        // check xem có tồn tại trong nhóm chưa
        const isExistsNewUsers = await Conversation.findOne({
            _id: conversationId,
            members: { $in: newUserIds },
        });
        if (isExistsNewUsers) throw new MyError('User exists in group');
    },

    validateDeleteMember: async (conversationId, userId, deleteUserId) => {
        if (userId === deleteUserId) throw new MyError('Not delete your');

        const conversation = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );

        // chỉ leader mới được xóa
        const { type, leaderId, managerIds } = conversation;
        const isManager = managerIds.findIndex(
            (userIdEle) => userIdEle + '' === userId
        );

        if (
            !type ||
            leaderId + '' == deleteUserId ||
            (leaderId + '' !== userId && isManager === -1)
        )
            throw new MyError('Not permission delete member');

        // check xem deledtedUser có tồn tại trong nhóm
        const isExistsDeleteUser = await Member.existsByConversationIdAndUserId(
            conversationId,
            deleteUserId
        );
        if (!isExistsDeleteUser) throw new MyError('User not exists in group');
    },
};

module.exports = memberValidate;
