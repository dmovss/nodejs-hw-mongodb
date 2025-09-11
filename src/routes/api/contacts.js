const express = require('express');
const { contacts: ctrl } = require('../../controllers');
const { validateBody, authenticate, upload } = require('../../middleware');
const { contactSchemas } = require('../../schemas');

const router = express.Router();

router.get('/', authenticate, ctrl.getAllContacts);
router.get('/:contactId', authenticate, ctrl.getContactById);
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchemas.addSchema),
  ctrl.addContact
);
router.put(
  '/:contactId',
  authenticate,
  validateBody(contactSchemas.addSchema),
  ctrl.updateContact
);
router.patch(
  '/:contactId',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchemas.updateSchema),
  ctrl.updateContact
);
router.delete('/:contactId', authenticate, ctrl.deleteContact);
router.patch(
  '/:contactId/favorite',
  authenticate,
  validateBody(contactSchemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
