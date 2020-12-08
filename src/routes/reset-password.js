const express = require('express');
const router = express.Router();
const controller = require('../controllers/reset-password');

router.get('/reset-password', controller.get_reset_password);
router.post('/reset-password', controller.post_reset_password);
router.get('/reset-password/:code', controller.get_reset_password_code);
router.post('/reset-password/:code', controller.post_reset_password_code);

module.exports = router;