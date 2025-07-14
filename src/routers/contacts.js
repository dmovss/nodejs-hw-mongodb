import express from "express";
import contactsController from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrlWrapper(contactsController.getContacts));         // GET /contacts
contactsRouter.get("/:id", ctrlWrapper(contactsController.getContactById));   // GET /contacts/:id
contactsRouter.post("/", ctrlWrapper(contactsController.createContact));      // POST /contacts
contactsRouter.patch("/:id", ctrlWrapper(contactsController.updateContact));  // PATCH /contacts/:id
contactsRouter.delete("/:id", ctrlWrapper(contactsController.deleteContact)); // DELETE /contacts/:id

export default contactsRouter;