const router = require('express').Router();
const { auth } = require('../utils/auth');

const adminController = require('../controllers/admin.controller')


router.route('/signup').post(adminController.signup);
router.route('/signin').post(adminController.signin);


module.exports = router;
