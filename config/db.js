const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log("mongodb Connected...");
  } catch (err) {
    console.error(err.message);
    //exit Process with failure
    process.exit(1);
  }
};

module.exports = connectDb;
