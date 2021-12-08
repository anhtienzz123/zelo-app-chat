const router = require('express').Router();
const PinMessageController = require('../controllers/PinMessageController');

const pinMessageRouter = (io) => {
    const pinMessageController = new PinMessageController(io);

    router.get('/:conversationId', pinMessageController.getAllPinMessages);
    router.post('/:messageId', pinMessageController.addPinMessage);
    router.delete('/:messageId', pinMessageController.deletePinMessage);

    return router;
};

module.exports = pinMessageRouter;
