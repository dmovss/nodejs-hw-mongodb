import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }
  next();
};

export default isValidId;
