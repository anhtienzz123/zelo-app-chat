const router = require('express').Router();
const memberController = require('../controllers/MemberController');

router.post('/:userId', memberController.addMember);
router.delete('/:userId', memberController.deleteMember);
router.delete('/leave', memberController.leaveGroup);

module.exports = router;
