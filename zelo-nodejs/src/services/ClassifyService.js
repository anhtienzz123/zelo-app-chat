const Classify = require('../models/Classify');
const Color = require('../models/Color');
const Member = require('../models/Member');
const MyError = require('../exception/MyError');
const NotFoundError = require('../exception/NotFoundError');
const ObjectId = require('mongoose').Types.ObjectId;
const commonUtils = require('../utils/commonUtils');

class ClassifyService {
    async getAllColors() {
        return await Color.find({});
    }

    async getRandomColor() {
        const colors = await Color.find({});
        const index = commonUtils.getRandomInt(0, colors.length - 1);

        return colors[index].code;
    }

    async getList(userId) {
        return await Classify.aggregate([
            { $match: { userId: ObjectId(userId) } },
            {
                $lookup: {
                    from: 'colors',
                    localField: 'colorId',
                    foreignField: '_id',
                    as: 'color',
                },
            },
            { $unwind: '$color' },
            { $project: { _id: 1, name: 1, color: 1, conversationIds: 1 } },
        ]);
    }

    async add(userId, classify) {
        await this.validate(userId, classify);
        const { name, colorId } = classify;

        const newClassify = new Classify({
            name,
            colorId,
            userId,
        });

        const { _id } = await newClassify.save();

        return {
            _id,
            name,
            colorId,
        };
    }

    async update(userId, classify) {
        await this.validate(userId, classify);
        const { _id, name, colorId } = classify;

        const queryResult = await Classify.updateOne(
            { _id, userId },
            { name, colorId }
        );

        const { nModified } = queryResult;

        if (nModified === 0) throw new NotFoundError('Classify');
    }

    async delete(userId, classifyId) {
        const queryResult = await Classify.deleteOne({
            _id: classifyId,
            userId,
        });
        const { deletedCount } = queryResult;

        if (deletedCount === 0) throw new NotFoundError('Classify');
    }

    async validate(userId, classify) {
        const { _id, name, colorId } = classify;

        // check color phai ton tai
        await Color.checkById(colorId);

        // check name
        if (!name || name.length < 1 || name.length > 50)
            throw new MyError('Name not valid');

        let existsName;
        // update
        if (_id)
            existsName = await Classify.findOne({
                _id: { $ne: _id },
                name,
                userId,
            });
        else existsName = await Classify.findOne({ name, userId });

        if (existsName) throw new MyError('Name extis');
    }

    async addConversation(userId, classifyId, conversationId) {
        await Member.getByConversationIdAndUserId(conversationId, userId);

        if (
            await Classify.findOne({
                _id: classifyId,
                conversationIds: { $in: [conversationId] },
            })
        )
            throw new MyError('Conversation exists');

        const queryResult = await Classify.updateOne(
            { _id: classifyId, userId },
            {
                $push: {
                    conversationIds: conversationId,
                },
            }
        );

        const { nModified } = queryResult;

        if (nModified === 0) throw new NotFoundError('Add Conversation Fail');

        await Classify.updateMany(
            {
                _id: { $ne: classifyId },
                conversationIds: { $in: [conversationId] },
            },
            { $pull: { conversationIds: conversationId } }
        );
    }

    async deleteConversation(userId, classifyId, conversationId) {
        await Member.getByConversationIdAndUserId(conversationId, userId);
        const queryResult = await Classify.updateOne(
            { _id: classifyId, userId },
            {
                $pull: {
                    conversationIds: conversationId,
                },
            }
        );

        const { nModified } = queryResult;

        if (nModified === 0)
            throw new NotFoundError('Delete Conversation Fail');
    }
}

module.exports = new ClassifyService();
