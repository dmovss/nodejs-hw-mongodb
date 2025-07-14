import Contact from "../models/Contact.js";

export const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json({
    status: 200,
    message: "Successfully fetched contacts!",
    data: contacts
  });
};

export const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found"
    });
  }

  res.json({
    status: 200,
    message: "Successfully found contact!",
    data: contact
  });
};

export const createContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact
  });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedContact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found"
    });
  }

  res.json({
    status: 200,
    message: "Successfully updated contact!",
    data: updatedContact
  });
};

export const patchContact = async (req, res) => {
  const { id } = req.params;
  const patchedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!patchedContact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found"
    });
  }

  res.json({
    status: 200,
    message: "Successfully patched contact!",
    data: patchedContact
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(id);

  if (!deletedContact) {
    return res.status(404).json({
      status: 404,
      message: "Contact not found"
    });
  }

  res.status(204).send();
};

export default {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  patchContact,
  deleteContact
};
