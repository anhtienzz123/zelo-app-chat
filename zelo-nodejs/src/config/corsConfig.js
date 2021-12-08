const cors = require('cors');

const whitelist = ['http://localhost:3000']; //white list consumers
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PATCH', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
    ],
};

module.exports = cors(corsOptions);
