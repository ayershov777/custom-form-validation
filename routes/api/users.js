const router = require('express').Router();
const userCtrl = require('../../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/', userCtrl.findByEmail);

module.exports = router;