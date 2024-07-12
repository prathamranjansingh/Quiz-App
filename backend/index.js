const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db/db");

const encryptionRoutes = require("./routes/encryptionRoutes");
const decryptionRoutes = require("./routes/decryptionRoutes");
const generatekeyRoutes = require("./routes/generatekeyRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const quizRoutes = require("./routes/quizRoutes.js");
const quizSubmissionRouter = require("./routes/quizSubmitRoutes.js");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDB();

app.use("/", encryptionRoutes);
app.use("/", decryptionRoutes);
app.use("/", userRoutes);
app.use("/", generatekeyRoutes);
app.use("/", quizRoutes);
app.use("/", quizSubmissionRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
