const express = require('express');
const router = express.Router();
const ctrlWrapper = require('../utils/ctrlWrapper');
const contactsCtrl = require('../controllers/contacts');

router.post('/', ctrlWrapper(contactsCtrl.createContact));

module.exports = router;