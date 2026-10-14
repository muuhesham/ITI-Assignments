const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.error("ERR:", err));
};

module.exports = connectDB