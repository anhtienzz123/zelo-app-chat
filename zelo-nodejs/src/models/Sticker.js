const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require('../exception/NotFoundError');

const stickerSchema = new Schema({
    name: String,
    description: {
        type: String,
        default: '',
    },
    stickers: {
        type: [String],
        default: [],
    },
});

stickerSchema.statics.getById = async (_id) => {
    const stickerGroup = await Sticker.findById(_id);
    if (!stickerGroup) throw new NotFoundError('Sticker group');

    return stickerGroup;
};

const Sticker = mongoose.model('sticker', stickerSchema);

module.exports = Sticker;
