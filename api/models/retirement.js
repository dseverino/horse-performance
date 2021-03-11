const mongoose = require("mongoose");

const retirementSchema = new mongoose.Schema(
  {
    date: Date,
    raceId: mongoose.Schema.Types.ObjectId,
    horse: mongoose.Schema.Types.ObjectId,
    reason: mongoose.Schema.Types.String
  }
)

module.exports = mongoose.model("Retirement", retirementSchema);