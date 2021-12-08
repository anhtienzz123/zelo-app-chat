const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    const user = await User.findById(req._id);
    const { isActived, isAdmin, isDeleted } = user;

    if (!user || !isActived || !isAdmin || isDeleted)
        res.status(401).send({
            status: 403,
            error: 'Forbidden to access this resource',
        });

    next();
};

module.exports = adminAuth;
