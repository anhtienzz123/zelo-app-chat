const userService = require('../services/UserSevice');
const MyError = require('../exception/MyError');

// /admin/users-manager
class UserManagerController {
    // [GET]
    async getList(req, res, next) {
        const { username = '', page = 0, size = 20 } = req.query;

        try {
            const users = await userService.getList(
                username,
                parseInt(page),
                parseInt(size)
            );

            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /:userId/:isActived
    async updateActived(req, res, next) {
        const { _id } = req;
        const { id, isActived } = req.params;

        try {
            if (_id == id) throw new MyError('Not Me');
            if (isActived !== '0' && isActived !== '1')
                throw new MyError('IsActived invalid');

            const status = isActived === '0' ? false : true;
            await userService.updateActived(id, status);

            res.json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserManagerController();
