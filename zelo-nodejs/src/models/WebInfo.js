const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webInfoSchema = new Schema(
    {
        name: String,
        value: Object,
    },
    { timestamps: true }
);

module.exports = mongoose.model('webinfo', webInfoSchema);
