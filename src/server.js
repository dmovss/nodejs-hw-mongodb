const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const contactsRouter = require("./routers/contacts");
const errorHandler = require("./middlewares/errorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/contacts", contactsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("DB connection error:", err.message);
    process.exit(1);
  });
