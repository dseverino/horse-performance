const mongoose = require("mongoose");

const jockeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    stats: Object,
    trainerStats: Object
  }
)

module.exports = mongoose.model("Jockey", jockeySchema);