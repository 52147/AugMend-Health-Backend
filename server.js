const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", feedbackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
