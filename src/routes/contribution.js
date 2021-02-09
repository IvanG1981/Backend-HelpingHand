const router = require('express').Router();
const { auth } = require('../utils/auth');
const { mobileEpayco } = require('../utils/mobileEpayco');

const contributionController = require('../controllers/contribution.controller');

router.route('/mobile/:recipientId').post(auth, mobileEpayco, contributionController.createMobileContribution);
router.route('/').get(auth, contributionController.list);





module.exports = router;
