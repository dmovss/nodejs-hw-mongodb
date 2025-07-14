import express from "express";
import contactsController from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get("/", ctrlWrapper(contactsController.getContacts));
router.get("/:id", ctrlWrapper(contactsController.getContactById));
router.post("/", ctrlWrapper(contactsController.createContact));
router.put("/:id", ctrlWrapper(contactsController.updateContact));
router.patch("/:id", ctrlWrapper(contactsController.patchContact));
router.delete("/:id", ctrlWrapper(contactsController.deleteContact));

export default router;
