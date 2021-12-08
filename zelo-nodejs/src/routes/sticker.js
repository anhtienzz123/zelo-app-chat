const router = require('express').Router();
const stickerController = require('../controllers/StickerController');

router.get('', stickerController.getAll);

module.exports = router;
