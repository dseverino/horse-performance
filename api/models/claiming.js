const mongoose = require("mongoose");

const claimingSchema = new mongoose.Schema(
  {
    date: Date,
    horse: mongoose.Schema.Types.ObjectId,
    claimedBy: mongoose.Schema.Types.ObjectId,
    claimedFrom: mongoose.Schema.Types.ObjectId,
    price: Number
  }
)

module.exports = mongoose.model("Claiming", claimingSchema);