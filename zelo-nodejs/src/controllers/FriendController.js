const friendService = require('../services/FriendService');
const redisDb = require('../app/redis');

// /friends
class FriendController {
    constructor(io) {
        this.io = io;
        this.acceptFriend = this.acceptFriend.bind(this);
        this.sendFriendInvite = this.sendFriendInvite.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
        this.deleteFriendInvite = this.deleteFriendInvite.bind(this);
        this.deleteInviteWasSend = this.deleteInviteWasSend.bind(this);
    }

    // [GET] /?name
    async getListFriends(req, res, next) {
        const { _id } = req;
        const { name = '' } = req.query;

        try {
            const friends = await friendService.getList(name, _id);

            const frendsTempt = [];
            for (const friendEle of friends) {
                const friendResult = { ...friendEle };

                const friendId = friendEle._id;
                const cachedUser = await redisDb.get(friendId + '');
                if (cachedUser) {
                    friendResult.isOnline = cachedUser.isOnline;
                    friendResult.lastLogin = cachedUser.lastLogin;
                }

                frendsTempt.push(friendResult);
            }

            res.json(frendsTempt);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:userId
    async acceptFriend(req, res, next) {
        const { _id } = req;
        const { userId } = req.params;

        try {
            const result = await friendService.acceptFriend(_id, userId);
            const { conversationId, isExists, message } = result;

            const { name, avatar } = await redisDb.get(_id);
            this.io
                .to(userId + '')
                .emit('accept-friend', { _id, name, avatar });

            if (isExists)
                this.io
                    .to(conversationId + '')
                    .emit('new-message', conversationId, message);
            else {
                this.io
                    .to(_id + '')
                    .emit(
                        'create-individual-conversation-when-was-friend',
                        conversationId
                    );
                this.io
                    .to(userId + '')
                    .emit(
                        'create-individual-conversation-when-was-friend',
                        conversationId
                    );
            }

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:userId
    async deleteFriend(req, res, next) {
        const { _id } = req;
        const { userId } = req.params;
        try {
            await friendService.deleteFriend(_id, userId);

            this.io.to(userId + '').emit('deleted-friend', _id);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /invites
    async getListFriendInvites(req, res, next) {
        const { _id } = req;
        try {
            const friendInvites = await friendService.getListInvites(_id);

            res.json(friendInvites);
        } catch (err) {
            next(err);
        }
    }

    //[DELETE]  /invites/:userId
    async deleteFriendInvite(req, res, next) {
        const { _id } = req;
        const { userId } = req.params;

        try {
            await friendService.deleteFriendInvite(_id, userId);
            this.io.to(userId + '').emit('deleted-friend-invite', _id);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /invites/me
    async getListFriendInvitesWasSend(req, res, next) {
        const { _id } = req;
        try {
            const friendInvites = await friendService.getListInvitesWasSend(
                _id
            );

            res.json(friendInvites);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /invites/me/:userId
    async sendFriendInvite(req, res, next) {
        const { _id } = req;
        const { userId } = req.params;
        try {
            await friendService.sendFriendInvite(_id, userId);

            const { name, avatar } = await redisDb.get(_id);
            this.io
                .to(userId + '')
                .emit('send-friend-invite', { _id, name, avatar });

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /invites/me/:userId
    async deleteInviteWasSend(req, res, next) {
        const { _id } = req;
        const { userId } = req.params;

        try {
            await friendService.deleteInviteWasSend(_id, userId);
            this.io.to(userId + '').emit('deleted-invite-was-send', _id);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /suggest
    async getSuggestFriends(req, res, next) {
        const { _id } = req;
        const { page = 0, size = 12 } = req.query;

        try {
            const suggestFriends = await friendService.getSuggestFriends(
                _id,
                parseInt(page),
                parseInt(size)
            );

            res.json(suggestFriends);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = FriendController;
