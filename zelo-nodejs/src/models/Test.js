const mongoose = require('mongoose');
const MyError = require('../exception/MyError');
const NotFoundError = require('../exception/NotFoundError');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const testSchema = new Schema(
    {
        name: String,
        time: {
            type: Date,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('test', testSchema);
