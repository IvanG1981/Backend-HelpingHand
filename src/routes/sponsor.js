const router = require('express').Router();

const sponsorController = require('../controllers/sponsor.controller')

router.route('/').post(sponsorController.signup)
router.route('/:sponsorId').get(sponsorController.show)
router.route('/:sponsorId').delete(sponsorController.destroy)

module.exports = router;

