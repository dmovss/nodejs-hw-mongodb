const express = require('express');
const { contacts: ctrl } = require('../../controllers');
const { validateBody, authenticate, upload } = require('../../middleware');
const { contactSchemas } = require('../../schemas');

const router = express.Router();

router.get('/', authenticate, ctrl.getAll);
router.get('/:contactId', authenticate, ctrl.getById);
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchemas.addSchema),
  ctrl.add
);
router.put(
  '/:contactId',
  authenticate,
  validateBody(contactSchemas.addSchema),
  ctrl.update
);
router.patch(
  '/:contactId',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchemas.updateSchema),
  ctrl.update
);
router.delete('/:contactId', authenticate, ctrl.remove);
router.patch(
  '/:contactId/favorite',
  authenticate,
  validateBody(contactSchemas.updateFavoriteSchema),
  ctrl.updateStatus
);

module.exports = router;
