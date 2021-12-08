const router = require('express').Router();
const classifyController = require('../controllers/ClassifyController');

router.get('/colors', classifyController.getListColors);
router.get('', classifyController.getList);
router.post('', classifyController.add);
router.put('/:id', classifyController.update);
router.delete('/:id', classifyController.delete);
router.post(
    '/:id/conversations/:conversationId',
    classifyController.addConversation
);
router.delete(
    '/:id/conversations/:conversationId',
    classifyController.deleteConversation
);

module.exports = router;
