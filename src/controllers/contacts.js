import Contact from "../models/Contact.js";

const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite
  } = req.query;

  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite) filter.isFavourite = isFavourite === 'true';

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / perPage);

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems: total,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    }
  });
};

// Получение контакта по ID
const getContactById = async (req, res) => {
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

// Создание нового контакта
const createContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact
  });
};

// Обновление контакта
const updateContact = async (req, res) => {
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

// Удаление контакта
const deleteContact = async (req, res) => {
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
  deleteContact
};
