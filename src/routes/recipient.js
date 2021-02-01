const router = require('express').Router();
const { auth } = require('../utils/auth');

const recipientController = require('../controllers/recipient.controller')

router.route('/').post(auth, recipientController.create);
router.route('/').get(recipientController.list);
router.route('/:recipientId').get(recipientController.show);
router.route('/update/:recipientId').put(auth, recipientController.update);
// router.route('/updateNeed/:recipientId').put(recipientController.updateNeed);
router.route('/remove/:recipientId').delete(auth, recipientController.destroy);


module.exports = router;
