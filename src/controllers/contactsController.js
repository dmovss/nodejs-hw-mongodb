import Contact from '../models/Contact.js';
import createHttpError from 'http-errors';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact: newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      code: 200,
      message: 'Contact deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};
