import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/authSchemas.js';
import * as ctrl from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrl.register);
router.post('/login', validateBody(loginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

export default router;
