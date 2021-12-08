const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require('../exception/NotFoundError');

const classifySchema = new Schema({
    name: String,
    conversationIds: [ObjectId],
    colorId: ObjectId,
    userId: ObjectId,
});

classifySchema.statics.checkById = async (_id, message = 'Classify') => {
    const isExists = await Classify.findById(_id);

    if (!isExists) throw new NotFoundError(message);
};

classifySchema.statics.getByIdAndUserId = async (
    _id,
    userId,
    message = 'Classify'
) => {
    const classify = await Classify.findOne({ _id, userId });
    if (!classify) throw new NotFoundError(message);

    return classify;
};

const Classify = mongoose.model('classify', classifySchema);

module.exports = Classify;
