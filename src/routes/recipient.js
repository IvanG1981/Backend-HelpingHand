const router = require('express').Router();
const { auth } = require('../utils/auth');

const recipientController = require('../controllers/recipient.controller')

router.route('/').post(recipientController.create);
router.route('/').get(recipientController.list);
router.route('/update/:recipientId').put(recipientController.update);
router.route('/updateNeed/:recipientId').put(recipientController.updateNeed);


module.exports = router;
