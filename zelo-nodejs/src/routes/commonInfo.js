const router = require('express').Router();
const commonInfoController = require('../controllers/CommonInfoController');

router.get('/web-info', commonInfoController.getWebInfo);
router.get('/google-captcha', commonInfoController.getGoogleCaptcha);

module.exports = router;
