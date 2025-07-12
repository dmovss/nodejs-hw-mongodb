const createError = require('http-errors');
const Contact = require('../models/Contact');

const createContact = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;
  
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "Missing required fields");
  }

  const newContact = await Contact.create(req.body);
  
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact
  });
};

module.exports = {
  createContact,
  // ... другие экспорты
};
const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    { new: true }
  );

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact
  });
};
const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  
  if (!deletedContact) {
    throw createError(404, "Contact not found");
  }

  res.status(204).send();
};