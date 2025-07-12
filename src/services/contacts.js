const Contact = require("../models/contact");

const listContacts = () => Contact.find();
const getContactById = (id) => Contact.findById(id);
const addContact = (data) => Contact.create(data);
const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data, { new: true });
const removeContact = (id) => Contact.findByIdAndDelete(id);

module.exports = { listContacts, getContactById, addContact, updateContact, removeContact };
