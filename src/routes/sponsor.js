const router = require('express').Router();
const { auth } = require('../utils/auth');

const sponsorController = require('../controllers/sponsor.controller')

router.route('/signup').post(sponsorController.signup)
router.route('/signin').post(sponsorController.signin)
router.route('/').get(sponsorController.list)
router.route('/:sponsorId').get(auth, sponsorController.show)
router.route('/:sponsorId').put(auth, sponsorController.update)
router.route('/:sponsorId').delete(auth, sponsorController.destroy)

module.exports = router;

