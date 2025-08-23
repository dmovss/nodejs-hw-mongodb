import express from 'express';
import authenticate from '../middlewares/authenticate.js';
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

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:id', isValidId, getContactById);
router.post('/', validateBody(createContactSchema), addContact);
router.delete('/:id', isValidId, deleteContact);
router.put('/:id', isValidId, validateBody(updateContactSchema), updateContact);
router.patch('/:id/favorite', isValidId, validateBody(updateFavoriteSchema), updateStatusContact);

export default router;
