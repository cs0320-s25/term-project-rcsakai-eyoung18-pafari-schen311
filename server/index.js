const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { userAdd, userClear, userSearch } = require("./handlers/userHandlers");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.post("/api/userAdd", userAdd);
app.post("/api/userClear", userClear);
app.get("/api/search", userSearch);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
