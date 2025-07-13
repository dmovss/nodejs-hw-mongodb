import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.json({
    message: "Contacts API is running!",
    endpoints: {
      getContacts: "GET /api/contacts",
      createContact: "POST /api/contacts",
      // додайте інші ендпоїнти
    }
  });
});
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});