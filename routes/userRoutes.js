const express = require('express');
const router = express.Router();


const {getCurrentUser, createUser, loginUser} = require('../controllers/userController');

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/current').get(getCurrentUser);


module.exports = router;
