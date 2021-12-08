const MyError = require('../exception/MyError');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Channel = require('../models/Channel');

const messageValidate = {
    validateTextMessage: async (message, userId) => {
        const {
            content,
            type,
            replyMessageId,
            tags,
            conversationId,
            channelId,
        } = message;

        // check type
        if (
            !type ||
            (type !== 'TEXT' &&
                type !== 'HTML' &&
                type !== 'NOTIFY' &&
                type !== 'STICKER')
        )
            throw new MyError('Type only TEXT, HTML, NOTIFY, STICKER');

        if (!content) throw new MyError('Content not empty');

        // check userIds có trong conversation
        let userIds = [];
        if (tags) {
            const index = tags.findIndex((userIdEle) => userIdEle == userId);

            if (index !== -1) throw new MyError('No tag yourself');
            userIds = [...tags];
        }

        userIds.push(userId);
        await Conversation.existsByUserIds(conversationId, userIds);
        // check replyMessageId có tồn tại
        if (replyMessageId) {
            if (channelId)
                await Message.getByIdAndChannelId(replyMessageId, channelId);
            else
                await Message.getByIdAndConversationId(
                    replyMessageId,
                    conversationId
                );
        }

        if (channelId)
            await Channel.getByIdAndConversationId(channelId, conversationId);
    },

    validateFileMessage: async (
        file,
        type,
        conversationId,
        channelId,
        userId
    ) => {
        if (type !== 'IMAGE' && type !== 'VIDEO' && type !== 'FILE')
            throw new MyError('Type only IMAGE, VIDEO, FILE');

        const { mimetype } = file;

        if (type === 'IMAGE')
            if (
                mimetype !== 'image/png' &&
                mimetype !== 'image/jpeg' &&
                mimetype !== 'image/gif'
            )
                throw new MyError('Image mimetype invalid');

        if (type === 'VIDEO')
            if (mimetype !== 'video/mp3' && mimetype !== 'video/mp4')
                throw new MyError('Video mimetype invalid');

        if (type === 'FILE')
            if (
                mimetype !== 'application/pdf' &&
                mimetype !== 'application/msword' &&
                mimetype !==
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                mimetype !== 'application/vnd.ms-powerpoint' &&
                mimetype !==
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
                mimetype !== 'application/vnd.rar' &&
                mimetype !== 'application/zip'
            )
                throw new MyError('File mimetype invalid');

        // check có conversation
        await Conversation.getByIdAndUserId(conversationId, userId);

        if (channelId)
            await Channel.getByIdAndConversationId(channelId, conversationId);
    },

    validateFileMessageWithBase64: async (
        fileInfo,
        type,
        conversationId,
        channelId,
        userId
    ) => {
        if (type !== 'IMAGE' && type !== 'VIDEO' && type !== 'FILE')
            throw new MyError('Type only IMAGE, VIDEO, FILE');

        const { fileExtension } = fileInfo;

        if (type === 'IMAGE') {
            if (
                fileExtension !== '.png' &&
                fileExtension !== '.jpg' &&
                fileExtension !== '.jpeg' &&
                fileExtension !== '.gif'
            )
                throw new MyError('Image extension invalid');
        }

        if (type === 'VIDEO') {
            if (fileExtension !== '.mp3' && fileExtension !== '.mp4')
                throw new MyError('Video extension invalid');
        }

        if (type === 'FILE') {
            if (
                fileExtension !== '.pdf' &&
                fileExtension !== '.doc' &&
                fileExtension !== '.docx' &&
                fileExtension !== '.ppt' &&
                fileExtension !== '.pptx' &&
                fileExtension !== '.rar' &&
                fileExtension !== '.zip'
            )
                throw new MyError('File extension invalid');
        }

        // check có conversation
        await Conversation.getByIdAndUserId(conversationId, userId);

        if (channelId)
            await Channel.getByIdAndConversationId(channelId, conversationId);
    },

    validateVoteMessage: async (voteMessageInfo, userId) => {
        const { content, options, conversationId } = voteMessageInfo;

        if (!content || content.length > 500)
            throw new MyError('Content not empty ');

        if (!options || options.length < 2)
            throw new MyError('Options not empty');

        const { type } = await Conversation.getByIdAndUserId(
            conversationId,
            userId
        );

        if (!type) throw new MyError('Only group conversation');

        return {
            content,
            options,
            conversationId,
        };
    },
    validateImageWithBase64(fileInfo) {
        const { fileName, fileExtension, fileBase64 } = fileInfo;

        if (!fileName || !fileExtension || !fileBase64)
            throw new MyError('Info image with base64 invalid');

        if (
            fileExtension !== '.png' &&
            fileExtension !== '.jpg' &&
            fileExtension !== '.jpeg' &&
            fileExtension !== '.gif'
        )
            throw new MyError('Image extension invalid');
    },
};

module.exports = messageValidate;
