import { Router } from "express";
import * as contactsCtrl from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate); 

router.get("/", contactsCtrl.getAll);
router.post("/", contactsCtrl.createContact);
router.get("/:contactId", contactsCtrl.getOne);
router.patch("/:contactId", contactsCtrl.updateContact);
router.delete("/:contactId", contactsCtrl.deleteContact);

export default router;
