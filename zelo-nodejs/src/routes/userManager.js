const router = require('express').Router();
const userManagerController = require('../controllers/UserManagerController');

router.get('', userManagerController.getList);
router.patch('/:id/:isActived', userManagerController.updateActived);

module.exports = router;
