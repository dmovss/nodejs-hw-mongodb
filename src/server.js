import express from "express";
import cors from "cors";
import contactsRouter from "./routers/contacts.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Contacts API is running!",
    endpoints: {
      getContacts: "GET /contacts",
      createContact: "POST /contacts",
      getContact: "GET /contacts/:id",
      updateContact: "PATCH /contacts/:id",
      deleteContact: "DELETE /contacts/:id"
    }
  });
});

app.use("/contacts", contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
