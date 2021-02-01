const router = require('express').Router();
const { auth } = require('../utils/auth');

const contributionController = require('../controllers/contribution.controller')

router.route('/').get(auth, contributionController.list);
router.route('/:recipientId').post(auth, contributionController.create);



module.exports = router;
