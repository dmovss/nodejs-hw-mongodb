const express = require("express");
const ctrl = require("../controllers/contacts");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getAllContacts));
router.get("/:contactId", ctrlWrapper(ctrl.getContactById));
router.post("/", ctrlWrapper(ctrl.createContact));
router.patch("/:contactId", ctrlWrapper(ctrl.updateContact));
router.delete("/:contactId", ctrlWrapper(ctrl.deleteContact));

module.exports = router;
router.patch('/:contactId', ctrlWrapper(contactsCtrl.patchContact));
router.delete('/:contactId', ctrlWrapper(contactsCtrl.deleteContact));