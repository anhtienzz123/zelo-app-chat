const Member = require('../models/Member');

class LastViewService {
    async updateLastViewOfConversation(conversationId, userId) {
        await Member.updateOne(
            { conversationId, userId },
            { $set: { lastView: new Date() } }
        );
    }

    async updateLastViewOfChannel(conversationId, channelId, userId) {
        const member = await Member.getByConversationIdAndUserId(
            conversationId,
            userId
        );

        const { lastViewOfChannels } = member;

        const index = lastViewOfChannels.findIndex(
            (lastViewEle) => lastViewEle.channelId + '' == channelId + ''
        );

        // not exists
        if (index === -1) return;

        lastViewOfChannels[index].lastView = new Date();

        await member.save();
    }
}

module.exports = new LastViewService();
