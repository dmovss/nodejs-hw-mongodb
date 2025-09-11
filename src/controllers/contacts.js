const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');

const addContact = async (req, res, next) => {
  try {
    let photoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photoUrl = result.secure_url;
      await fs.unlink(req.file.path);
    }

    const newContact = await Contact.create({
      ...req.body,
      photo: photoUrl,
      owner: req.user._id,
    });

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    let photoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photoUrl = result.secure_url;
      await fs.unlink(req.file.path);
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { ...req.body, ...(photoUrl && { photo: photoUrl }) },
      { new: true }
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Not found');
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
