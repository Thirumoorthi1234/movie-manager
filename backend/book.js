const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  year: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // owner
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
