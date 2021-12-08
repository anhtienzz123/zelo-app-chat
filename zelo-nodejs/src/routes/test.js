const router = require('express').Router();
const TestModel = require('../models/Test');
const dateUtils = require('../utils/dateUtils');
const cloudinaryService = require('../services/CloudinaryService');
const uploadFile = require('../middleware/uploadFile');
const client = require('../app/redis');
const util = require('util');
const Member = require('../models/Member');
const Message = require('../models/Message');
const awsS3Service = require('../services/AwsS3Service');

router.get('/test', (req, res, next) => {
    res.json({
        a: 1,
        b: null,
        c: undefined,
    });
});

module.exports = router;
