const messageUtils = {
    convertMessageOfGroup: (message) => {
        const { _id, isDeleted, replyMessage, replyUser, reactUsers, reacts } =
            message;

        if (isDeleted)
            return {
                _id,
                isDeleted,
                user: message.user,
                createdAt: message.createdAt,
            };

        // convert replyMessageResult
        let replyMessageResult = null;
        if (replyMessage && replyMessage.length > 0) {
            let replyMessageData = replyMessage[0];
            const messagesId = replyMessageData._id;
            let replyUserData = replyUser[0];

            const user = {
                _id: replyUserData._id,
                name: replyUserData.name,
                avatar: replyUserData.avatar,
            };

            if (replyMessageData.isDeleted)
                replyMessageResult = {
                    _id: messagesId,
                    user,
                    isDeleted: true,
                    createdAt: message.createdAt,
                };
            else
                replyMessageResult = {
                    _id: messagesId,
                    user,
                    content: replyMessageData.content,
                    type: replyMessageData.type,
                    createdAt: message.createdAt,
                };
        }
        // convert Reacts
        let reactsResult = [];

        if (reacts && reacts.length > 0) {
            reactsResult = reacts.map((reactEle) => {
                return {
                    user: reactUsers.find(
                        (userEle) => userEle._id + '' == reactEle.userId + ''
                    ),
                    type: reactEle.type,
                };
            });
        }

        delete message.isDeleted;
        delete message.reactUsers;
        delete message.replyUser;
        return {
            ...message,
            replyMessage: replyMessageResult,
            reacts: reactsResult,
        };
    },

    convertMessageOfIndividual: function (message) {
        const {
            _id,
            isDeleted,
            userId,
            replyMessage,
            reacts,
            members,
            userInfos,
        } = message;

        const user = this.getUserForIndividualConversation(
            userId,
            members,
            userInfos
        );

        if (isDeleted)
            return {
                _id,
                isDeleted,
                user,
                createdAt: message.createdAt,
            };

        // convert replyMessage
        let replyMessageResult = {};
        if (replyMessage && replyMessage.length > 0) {
            let replyMessageData = replyMessage[0];
            const messageId = replyMessageData._id;
            const { userId } = replyMessageData;

            const user = this.getUserForIndividualConversation(
                userId,
                members,
                userInfos
            );

            if (replyMessageData.isDeleted)
                replyMessageResult = {
                    _id: messageId,
                    user,
                    isDeleted: true,
                    createdAt: message.createdAt,
                };
            else
                replyMessageResult = {
                    _id: messageId,
                    user,
                    content: replyMessageData.content,
                    type: replyMessageData.type,
                    createdAt: message.createdAt,
                };
        }
        // convert reacts
        let reactsResult = [];

        if (reacts && reacts.length > 0) {
            reactsResult = reacts.map((reactEle) => {
                return {
                    user: this.getUserForIndividualConversation(
                        reactEle.userId,
                        members,
                        userInfos
                    ),
                    type: reactEle.type,
                };
            });
        }

        delete message.isDeleted;
        delete message.members;
        delete message.userInfos;
        delete message.userId;

        return {
            ...message,
            user,
            replyMessage: replyMessageResult,
            reacts: reactsResult,
        };
    },

    getUserForIndividualConversation: (userId, members, userInfos) => {
        const memberSearch = members.find(
            (memberEle) => memberEle.userId + '' == userId + ''
        );

        const userInfoSearch = userInfos.find(
            (userInfoEle) => userInfoEle._id + '' == userId + ''
        );

        return {
            _id: userId,
            name: memberSearch.name,
            avatar: userInfoSearch.avatar ? userInfoSearch.avatar : '',
        };
    },
};

module.exports = messageUtils;
