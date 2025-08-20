import createHttpError from 'http-errors';
import Contact from '../models/Contact.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,             // contactType фильтр (опционально)
      isFavourite,      // булево как строка: 'true'|'false' (опционально)
    } = req.query;

    const filter = { userId: req.user._id };
    if (type) filter.contactType = type;
    if (typeof isFavourite !== 'undefined') {
      filter.favorite = String(isFavourite) === 'true';
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limit = Math.max(parseInt(perPage) || 10, 1);
    const skip = (pageNum - 1) * limit;

    const totalItems = await Contact.countDocuments(filter);
    const data = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data,
        page: pageNum,
        perPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: pageNum > 1,
        hasNextPage: pageNum < totalPages,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).lean();

    if (!contact) throw createHttpError(404, 'Not found');

    res.json({ status: 200, message: 'Ok', data: contact });
  } catch (e) {
    next(e);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const created = await Contact.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ status: 201, message: 'Created', data: created });
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deleted = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    }).lean();

    if (!deleted) throw createHttpError(404, 'Not found');

    res.json({ status: 200, message: 'Contact deleted' });
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    ).lean();

    if (!updated) throw createHttpError(404, 'Not found');

    res.json({ status: 200, message: 'Ok', data: updated });
  } catch (e) {
    next(e);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    if (!('favorite' in req.body)) {
      return res.status(400).json({ status: 400, message: 'Missing field favorite' });
    }

    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { favorite: req.body.favorite },
      { new: true }
    ).lean();

    if (!updated) throw createHttpError(404, 'Not found');

    res.json({ status: 200, message: 'Ok', data: updated });
  } catch (e) {
    next(e);
  }
};

export default {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
