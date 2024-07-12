const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://prathamranjan3:H1IEw6OGtkmDk1mO@cluster0.nxuuszf.mongodb.net/QuizApp"
    )
    .then(() => console.log("DB connected"));
};

module.exports = { connectDB };

//mongodb+srv://prathamranjan3:H1IEw6OGtkmDk1mO@cluster0.nxuuszf.mongodb.net/
