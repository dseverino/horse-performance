const mongoose = require("mongoose");

const stableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    horses: [
      {
        type: mongoose.Schema.Types.ObjectId
      }      
    ],
    trainers: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    stats: Object
  }
)

module.exports = mongoose.model("Stable", stableSchema);