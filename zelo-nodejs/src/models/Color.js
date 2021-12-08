const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotFoundError = require('../exception/NotFoundError');

const colorSchema = new Schema({
    name: String,
    code: String,
});

colorSchema.statics.checkById = async (colorId, message = 'Color') => {
    const isExists = await Color.findById(colorId);

    if (!isExists) throw new NotFoundError(message);
};

const Color = mongoose.model('color', colorSchema);

module.exports = Color;
