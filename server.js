import express from "express";
import cors from "cors";
import contactsRouter from "./routers/contacts.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Корневой маршрут для проверки работы
app.get("/", (req, res) => {
  res.json({
    message: "Contacts API is running!",
    endpoints: {
      getContacts: "GET /api/contacts",
      createContact: "POST /api/contacts",
      getContact: "GET /api/contacts/:id",
      updateContact: "PATCH /api/contacts/:id",
      deleteContact: "DELETE /api/contacts/:id"
    }
  });
});

// Маршруты API
app.use("/api/contacts", contactsRouter);

// Обработчики ошибок
app.use(notFoundHandler);
app.use(errorHandler);

export default app;