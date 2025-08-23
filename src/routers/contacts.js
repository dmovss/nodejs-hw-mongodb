import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../validation/contactSchemas.js'; 
import {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', authenticate, getAllContacts);
router.get('/:id', authenticate, isValidId, getContactById);
router.post('/', authenticate, validateBody(createContactSchema), addContact);
router.delete('/:id', authenticate, isValidId, deleteContact);
router.put('/:id', authenticate, isValidId, validateBody(updateContactSchema), updateContact);
router.patch('/:id/favorite', authenticate, isValidId, validateBody(updateFavoriteSchema), updateStatusContact);

export default router;
