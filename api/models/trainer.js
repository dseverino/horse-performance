const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    stats: Object
  }
)

module.exports = mongoose.model("Trainer", trainerSchema);