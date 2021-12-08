const router = require('express').Router();
const stickerManagerController = require('../controllers/StickerManagerController');
const uploadFile = require('../middleware/uploadFile');

router.post('', stickerManagerController.createStickerGroup);
router.put('/:id', stickerManagerController.updateStickerGroup);
router.delete('/:id', stickerManagerController.deleteStickerGroup);
router.post(
    '/:id',
    uploadFile.singleUploadMiddleware,
    stickerManagerController.addSticker
);
router.delete('/:id/sticker', stickerManagerController.deleteSticker);
module.exports = router;
