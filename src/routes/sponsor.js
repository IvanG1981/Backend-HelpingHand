const router = require('express').Router();
const { auth } = require('../utils/auth');

const sponsorController = require('../controllers/sponsor.controller')

router.route('/update-password').put(sponsorController.updatePassword);
router.route('/signup').post(sponsorController.signup);
router.route('/signin').post(sponsorController.signin);
router.route('/').get(sponsorController.list);
router.route('/:sponsorId').get(auth, sponsorController.show);
router.route('/:sponsorId').put(auth, sponsorController.update);
router.route('/:sponsorId').delete(auth, sponsorController.destroy);
router.route('/forgot-password').post(sponsorController.resetEmail);
router.route('/reset/:resetPasswordToken').get(sponsorController.resetConfirm);

module.exports = router;

