const userRouter = require('./user');
const authRouter = require('./auth');
const classifyRouter = require('./classify');
const stickerRouter = require('./sticker');
const stickerManagerRouter = require('./stickerManager');
const userManagerRouter = require('./userManager');
const commonInfoRouter = require('./commonInfo');

const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const test = require('./test');

const route = (app, io) => {
    const meRouter = require('./me')(io);
    const friendRouter = require('./friend')(io);
    const messageRouter = require('./message')(io);
    const conversationRouter = require('./conversation')(io);
    const pinMessageRouter = require('./pinMessage')(io);
    const voteRouter = require('./vote')(io);
    const channelRouter = require('./channel')(io);

    app.use('/users', auth, userRouter);
    app.use('/auth', authRouter);
    app.use('/me', auth, meRouter);
    app.use('/friends', auth, friendRouter);
    app.use('/classifies', auth, classifyRouter);
    app.use('/messages', auth, messageRouter);
    app.use('/conversations', auth, conversationRouter);
    app.use('/pin-messages', auth, pinMessageRouter);
    app.use('/votes', auth, voteRouter);
    app.use('/stickers', auth, stickerRouter);
    app.use('/channels', auth, channelRouter);
    app.use('/admin/stickers-manager', auth, adminAuth, stickerManagerRouter);
    app.use('/admin/users-manager', auth, adminAuth, userManagerRouter);
    app.use('/common', commonInfoRouter);
    app.use('/test', test);
};

module.exports = route;
