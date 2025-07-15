import express from "express";
import contactsController from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../schemas/contacts.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrlWrapper(contactsController.getContacts));
contactsRouter.get("/:id", isValidId, ctrlWrapper(contactsController.getContactById));
contactsRouter.post("/", validateBody(createContactSchema), ctrlWrapper(contactsController.createContact));
contactsRouter.patch(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.updateContact)
);
contactsRouter.delete("/:id", isValidId, ctrlWrapper(contactsController.deleteContact));

export default contactsRouter;
