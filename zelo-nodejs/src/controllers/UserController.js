const userService = require('../services/UserSevice');

class UserController {
    // [GET] /search/username/:username
    async getByUsername(req, res, next) {
        const { _id } = req;
        const { username } = req.params;

        try {
            const user = await userService.getStatusFriendOfUser(_id, username);

            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /search/id/:userId
    async getById(req, res, next) {
        const { _id } = req;
        const { userId } = req.params;

        try {
            const user = await userService.getStatusFriendOfUserById(
                _id,
                userId
            );

            res.json(user);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();
