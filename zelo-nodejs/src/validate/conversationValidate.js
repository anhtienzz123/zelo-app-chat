const Conversation = require('../models/Conversation');
const MyError = require('../exception/MyError');
const User = require('../models/User');

const conversationValidate = {
    validateIndividualConversation: async (userId1, userId2) => {
        const conversationId = await Conversation.existsIndividualConversation(
            userId1,
            userId2
        );
        if (conversationId) return { conversationId };

        const user1 = await User.getById(userId1);
        const user2 = await User.getById(userId2);

        return {
            userName1: user1.name,
            userName2: user2.name,
        };
    },
};

module.exports = conversationValidate;
