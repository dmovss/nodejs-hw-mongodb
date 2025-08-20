import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../validation/contactSchemas.js';
import ctrl from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', authenticate, ctrl.getAllContacts);
router.get('/:id', authenticate, isValidId, ctrl.getContactById);
router.post('/', authenticate, validateBody(createContactSchema), ctrl.addContact);
router.delete('/:id', authenticate, isValidId, ctrl.deleteContact);
router.put('/:id', authenticate, isValidId, validateBody(updateContactSchema), ctrl.updateContact);
router.patch('/:id/favorite', authenticate, isValidId, validateBody(updateFavoriteSchema), ctrl.updateStatusContact);

export default router;
