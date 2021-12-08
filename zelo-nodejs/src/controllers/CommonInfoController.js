const WebInfo = require('../models/WebInfo');
const redisDb = require('../app/redis');

// /common
class CommonInfoController {
    async getWebInfo(req, res, next) {
        try {
            const isExistsCached = await redisDb.exists('web-info');
            let webInfo;
            if (!isExistsCached) {
                webInfo = await WebInfo.find();
                await redisDb.set('web-info', webInfo);
            } else webInfo = await redisDb.get('web-info');

            res.json(webInfo);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /google-captcha
    async getGoogleCaptcha(req, res, next) {
        res.json({
            ENABLE_GOOGLE_CAPTCHA: new Boolean(
                process.env.ENABLE_GOOGLE_CAPTCHA
            ),
            KEY_GOOGLE_CAPTCHA: process.env.KEY_GOOGLE_CAPTCHA,
        });
    }
}

module.exports = new CommonInfoController();
