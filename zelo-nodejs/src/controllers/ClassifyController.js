const classifyService = require('../services/ClassifyService');

class ClassifyController {
    // [GET] /colors
    async getListColors(req, res, next) {
        try {
            const colors = await classifyService.getAllColors();
            res.json(colors);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /
    async getList(req, res, next) {
        const { _id } = req;

        try {
            const classifies = await classifyService.getList(_id);
            res.json(classifies);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /
    async add(req, res, next) {
        const { _id } = req;

        try {
            const newClassify = await classifyService.add(_id, req.body);

            res.status(201).json(newClassify);
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /:id
    async update(req, res, next) {
        const { _id } = req;

        const { id } = req.params;
        const classify = req.body;
        classify._id = id;

        try {
            await classifyService.update(_id, classify);

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /:id
    async delete(req, res, next) {
        const { _id } = req;
        const { id } = req.params;

        try {
            await classifyService.delete(_id, id);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/conversations/:conversationId
    async addConversation(req, res, next) {
        const { _id } = req;
        const { id, conversationId } = req.params;

        try {
            await classifyService.addConversation(_id, id, conversationId);

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }
    // [DELETE] /:id/conversations/:id
    async deleteConversation(req, res, next) {
        const { _id } = req;
        const { id, conversationId } = req.params;

        try {
            await classifyService.deleteConversation(_id, id, conversationId);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ClassifyController();
