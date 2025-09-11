const express = require('express');
const { auth: ctrl } = require('../../controllers');
const { validateBody, authenticate } = require('../../middleware');
const { authSchema, emailSchema } = require('../../schemas/users');

const router = express.Router();

router.post('/register', validateBody(authSchema), ctrl.register);
router.post('/login', validateBody(authSchema), ctrl.login);
router.post('/logout', authenticate, ctrl.logout);
router.get('/current', authenticate, ctrl.current);
router.patch('/', authenticate, ctrl.updateSubscription);
router.post('/send-reset-email', validateBody(emailSchema), ctrl.sendResetEmail);
router.post('/reset-pwd', ctrl.resetPassword);

module.exports = router;
