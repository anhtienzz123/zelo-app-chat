const router = require('express').Router();
const MeController = require('../controllers/MeController');
const uploadFile = require('../middleware/uploadFile');

const meRouter = (io) => {
    const meController = new MeController(io);

    router.get('/profile', meController.profile);
    router.put('/profile', meController.updateProfile);
    router.patch(
        '/avatar',
        uploadFile.singleUploadMiddleware,
        meController.changeAvatar
    );
    router.patch(
        '/cover-image',
        uploadFile.singleUploadMiddleware,
        meController.changeCoverImage
    );
    router.patch('/avatar/base64', meController.changeAvatarWithBase64);
    router.patch(
        '/cover-image/base64',
        meController.changeCoverImageWithBase64
    );
    router.get('/phone-books', meController.getPhoneBooks);
    router.post('/phone-books', meController.syncPhoneBooks);
    router.patch('/password', meController.changePassword);
    router.delete('/revoke-token', meController.revokeToken);

    return router;
};

module.exports = meRouter;
